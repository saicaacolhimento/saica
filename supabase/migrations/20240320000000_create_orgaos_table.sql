-- Create orgaos table
CREATE TABLE IF NOT EXISTS public.orgaos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO')),
    tipo_outro TEXT,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    nome_responsavel TEXT NOT NULL,
    email_responsavel TEXT NOT NULL,
    telefone_responsavel TEXT NOT NULL,
    logo_url TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orgaos ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Master admin can do everything"
ON public.orgaos
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Orgao admin can view their own orgao"
ON public.orgaos
FOR SELECT
USING (
    id IN (
        SELECT orgao_id FROM auth.users
        WHERE id = auth.uid()
        AND role = 'orgao'
    )
);

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_orgaos_updated_at
    BEFORE UPDATE ON public.orgaos
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at(); 