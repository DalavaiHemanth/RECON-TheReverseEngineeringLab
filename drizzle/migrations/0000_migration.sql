CREATE TABLE public.investigations (
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

CREATE TABLE public.repo_indexes (
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

CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;
CREATE TRIGGER inv_touch BEFORE UPDATE ON public.investigations FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();