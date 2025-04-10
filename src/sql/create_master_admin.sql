-- Create master_admin table
CREATE TABLE IF NOT EXISTS public.master_admin (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked'))
);

-- Enable RLS
ALTER TABLE public.master_admin ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Master admin can view their own record"
ON public.master_admin
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Master admin can update their own record"
ON public.master_admin
FOR UPDATE
USING (auth.uid() = id);

-- Insert master admin record if not exists
INSERT INTO public.master_admin (id, email, nome, status)
VALUES (
    '744e43fe-2c07-476c-bf0b-b7f5a0a1a059',
    'saicaacolhimento2025@gmail.com',
    'Administrador Master',
    'active'
)
ON CONFLICT (id) DO NOTHING; 