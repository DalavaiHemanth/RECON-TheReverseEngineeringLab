CREATE TABLE public.user_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  key text NOT NULL,
  value text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, key)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.user_secrets TO authenticated;
GRANT ALL ON public.user_secrets TO service_role;

ALTER TABLE public.user_secrets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own secrets"
ON public.user_secrets
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);