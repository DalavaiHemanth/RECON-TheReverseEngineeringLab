-- ====================================================================
-- RECON Complete Database Setup (Single Script for Supabase SQL Editor)
-- ====================================================================

-- 1. Investigations Table
CREATE TABLE IF NOT EXISTS public.investigations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  title text NOT NULL DEFAULT '',
  target_type text NOT NULL DEFAULT 'repository',
  target_ref text NOT NULL DEFAULT '',
  analysis_mode text NOT NULL DEFAULT 'white-box',
  question text NOT NULL,
  status text NOT NULL DEFAULT 'queued',
  step_count int NOT NULL DEFAULT 0,
  max_steps int NOT NULL DEFAULT 10,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  evidence jsonb NOT NULL DEFAULT '[]'::jsonb,
  hypotheses jsonb NOT NULL DEFAULT '[]'::jsonb,
  plan jsonb,
  report jsonb,
  confidence numeric,
  error text,
  revision integer NOT NULL DEFAULT 0,
  lease_id uuid,
  lease_until timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.investigations TO authenticated;
GRANT ALL ON public.investigations TO service_role;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own select" ON public.investigations FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.investigations FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.investigations FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.investigations FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS investigations_expiry ON public.investigations(expires_at) WHERE expires_at IS NOT NULL;

-- 2. Repository Indexes Table (Target Payload)
CREATE TABLE IF NOT EXISTS public.repo_indexes (
  investigation_id uuid PRIMARY KEY REFERENCES public.investigations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid(),
  files jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.repo_indexes TO authenticated;
GRANT ALL ON public.repo_indexes TO service_role;
ALTER TABLE public.repo_indexes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own select" ON public.repo_indexes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own insert" ON public.repo_indexes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own update" ON public.repo_indexes FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own delete" ON public.repo_indexes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. User Secrets Table (Encrypted GitHub Tokens)
CREATE TABLE IF NOT EXISTS public.user_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, key)
);

GRANT ALL ON public.user_secrets TO service_role;
ALTER TABLE public.user_secrets ENABLE ROW LEVEL SECURITY;
COMMENT ON TABLE public.user_secrets IS 'Server-only owner-scoped token storage; value stores versioned ciphertext after upgrade.';

-- 4. Recon Preferences Table (Data Retention)
CREATE TABLE IF NOT EXISTS public.recon_preferences (
  user_id uuid PRIMARY KEY DEFAULT auth.uid(),
  retention_days integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recon_preferences TO authenticated;
GRANT ALL ON public.recon_preferences TO service_role;
ALTER TABLE public.recon_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner preferences" ON public.recon_preferences FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- 5. Recon Artifacts Table (Follow-ups, Comparisons, Briefs)
CREATE TABLE IF NOT EXISTS public.recon_artifacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  investigation_id uuid NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
  kind text NOT NULL DEFAULT 'followup',
  question text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  comparison_id uuid REFERENCES public.investigations(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.recon_artifacts TO authenticated;
GRANT ALL ON public.recon_artifacts TO service_role;
ALTER TABLE public.recon_artifacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner artifact read" ON public.recon_artifacts FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Owner artifact insert" ON public.recon_artifacts FOR INSERT TO authenticated WITH CHECK (
  user_id = auth.uid() AND 
  EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()) AND 
  (comparison_id IS NULL OR EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = comparison_id AND i.user_id = auth.uid()))
);
CREATE POLICY "Owner artifact update" ON public.recon_artifacts FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Owner artifact delete" ON public.recon_artifacts FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE UNIQUE INDEX IF NOT EXISTS recon_artifacts_one_checklist ON public.recon_artifacts (investigation_id) WHERE kind = 'checklist';

-- 6. Helper Functions & Procedures

-- Claiming steps
CREATE OR REPLACE FUNCTION public.recon_claim(p_id uuid, p_lease uuid) 
RETURNS SETOF public.investigations LANGUAGE plpgsql SET search_path = public AS $$ 
BEGIN 
  RETURN QUERY UPDATE public.investigations 
  SET lease_id = p_lease, lease_until = now() + interval '3 minutes' 
  WHERE id = p_id AND user_id = auth.uid() AND status IN ('queued','running') AND (lease_until IS NULL OR lease_until < now()) 
  RETURNING *; 
END; 
$$;

REVOKE ALL ON FUNCTION public.recon_claim(uuid,uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recon_claim(uuid,uuid) TO authenticated;

-- Expiry trigger
CREATE OR REPLACE FUNCTION public.recon_expiry() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ 
DECLARE days integer; 
BEGIN 
  SELECT retention_days INTO days FROM public.recon_preferences WHERE user_id = NEW.user_id; 
  IF days IS NOT NULL AND days NOT IN (7,30,90) THEN 
    RAISE EXCEPTION 'Choose 7, 30, 90 days or keep until deleted'; 
  END IF; 
  NEW.expires_at := CASE WHEN days IS NULL THEN NULL ELSE now() + make_interval(days => days) END; 
  RETURN NEW; 
END; 
$$;

DROP TRIGGER IF EXISTS recon_set_expiry ON public.investigations;
CREATE TRIGGER recon_set_expiry BEFORE INSERT ON public.investigations FOR EACH ROW EXECUTE FUNCTION public.recon_expiry();

-- Preference validation trigger
CREATE OR REPLACE FUNCTION public.recon_validate_preferences() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$ 
BEGIN 
  IF NEW.retention_days IS NOT NULL AND NEW.retention_days NOT IN (7,30,90) THEN 
    RAISE EXCEPTION 'Choose 7, 30, 90 days or keep until deleted'; 
  END IF; 
  RETURN NEW; 
END; 
$$;

DROP TRIGGER IF EXISTS recon_preferences_valid ON public.recon_preferences;
CREATE TRIGGER recon_preferences_valid BEFORE INSERT OR UPDATE ON public.recon_preferences FOR EACH ROW EXECUTE FUNCTION public.recon_validate_preferences();

-- Atomic Investigation Creation
CREATE OR REPLACE FUNCTION public.recon_create(
  p_question text, 
  p_title text, 
  p_target_ref text, 
  p_target_type text, 
  p_max_steps integer, 
  p_payload jsonb
) RETURNS uuid LANGUAGE plpgsql SET search_path = public AS $$ 
DECLARE result uuid; 
BEGIN 
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF; 
  IF length(p_question) < 5 OR length(p_question) > 500 OR p_max_steps < 3 OR p_max_steps > 20 THEN 
    RAISE EXCEPTION 'Invalid investigation input'; 
  END IF; 
  INSERT INTO public.investigations(user_id,question,title,target_ref,target_type,max_steps,status) 
  VALUES(auth.uid(),p_question,p_title,p_target_ref,p_target_type,p_max_steps,'queued') 
  RETURNING id INTO result; 
  INSERT INTO public.repo_indexes(investigation_id,user_id,files) 
  VALUES(result,auth.uid(),p_payload); 
  RETURN result; 
END; 
$$;

REVOKE ALL ON FUNCTION public.recon_create(text,text,text,text,integer,jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recon_create(text,text,text,text,integer,jsonb) TO authenticated;

-- Retention Setter
CREATE OR REPLACE FUNCTION public.recon_set_retention(p_days integer) RETURNS void LANGUAGE plpgsql SET search_path = public AS $$ 
BEGIN 
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF; 
  IF p_days IS NOT NULL AND p_days NOT IN (7,30,90) THEN 
    RAISE EXCEPTION 'Invalid retention duration'; 
  END IF; 
  INSERT INTO public.recon_preferences(user_id,retention_days,updated_at) 
  VALUES(auth.uid(),p_days,now()) 
  ON CONFLICT(user_id) DO UPDATE SET retention_days = EXCLUDED.retention_days, updated_at = now(); 
  UPDATE public.investigations 
  SET expires_at = CASE WHEN p_days IS NULL THEN NULL ELSE created_at + make_interval(days => p_days) END 
  WHERE user_id = auth.uid(); 
END; 
$$;

REVOKE ALL ON FUNCTION public.recon_set_retention(integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.recon_set_retention(integer) TO authenticated;
