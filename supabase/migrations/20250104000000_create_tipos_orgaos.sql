-- Criar tabela para gerenciar tipos de órgãos dinamicamente
CREATE TABLE IF NOT EXISTS public.tipos_orgaos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL UNIQUE,
    codigo TEXT NOT NULL UNIQUE, -- Código único (ex: 'CRAS', 'CREAS', 'CAPS')
    descricao TEXT,
    ativo BOOLEAN DEFAULT true,
    ordem INTEGER DEFAULT 0, -- Ordem de exibição
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Inserir tipos padrão
INSERT INTO public.tipos_orgaos (nome, codigo, descricao, ordem) VALUES
    ('ABRIGO', 'ABRIGO', 'Abrigo para acolhimento', 1),
    ('CRAS', 'CRAS', 'Centro de Referência de Assistência Social', 2),
    ('CREAS', 'CREAS', 'Centro de Referência Especializado de Assistência Social', 3),
    ('CAPS', 'CAPS', 'Centro de Atenção Psicossocial', 4),
    ('Conselho Tutelar', 'CONSELHO_TUTELAR', 'Conselho Tutelar', 5),
    ('Outro', 'OUTRO', 'Outro tipo de órgão', 6)
ON CONFLICT (codigo) DO NOTHING;

-- Enable RLS
ALTER TABLE public.tipos_orgaos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Master admin can do everything on tipos_orgaos"
ON public.tipos_orgaos
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

CREATE POLICY "Authenticated users can view tipos_orgaos"
ON public.tipos_orgaos
FOR SELECT
USING (auth.role() = 'authenticated' AND ativo = true);

CREATE POLICY "Authenticated users can insert tipos_orgaos"
ON public.tipos_orgaos
FOR INSERT
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tipos_orgaos"
ON public.tipos_orgaos
FOR UPDATE
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tipos_orgaos"
ON public.tipos_orgaos
FOR DELETE
USING (auth.role() = 'authenticated');

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_tipos_orgaos_codigo ON public.tipos_orgaos(codigo);
CREATE INDEX IF NOT EXISTS idx_tipos_orgaos_ativo ON public.tipos_orgaos(ativo);

