-- Criar ENUM para tipo de órgão
CREATE TYPE tipo_orgao AS ENUM ('CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO');

-- Adicionar coluna data_ativacao
ALTER TABLE public.orgaos 
ADD COLUMN IF NOT EXISTS data_ativacao TIMESTAMP WITH TIME ZONE;

-- Renomear colunas
ALTER TABLE public.orgaos 
RENAME COLUMN nome TO nome_orgao;

ALTER TABLE public.orgaos 
RENAME COLUMN logo_url TO logo_orgao;

-- Alterar tipo da coluna tipo para ENUM
ALTER TABLE public.orgaos 
ALTER COLUMN tipo TYPE tipo_orgao USING tipo::tipo_orgao;

-- Remover constraint antiga do tipo
ALTER TABLE public.orgaos 
DROP CONSTRAINT IF EXISTS orgaos_tipo_check;

-- Atualizar políticas RLS
DROP POLICY IF EXISTS "Master admin can do everything" ON public.orgaos;
DROP POLICY IF EXISTS "Orgao admin can view their own orgao" ON public.orgaos;

-- Criar novas políticas
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

-- Criar função para atualizar data_ativacao
CREATE OR REPLACE FUNCTION handle_orgao_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ativo' AND OLD.status != 'ativo' THEN
        NEW.data_ativacao = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para data_ativacao
DROP TRIGGER IF EXISTS handle_orgao_status_change ON public.orgaos;
CREATE TRIGGER handle_orgao_status_change
    BEFORE UPDATE ON public.orgaos
    FOR EACH ROW
    EXECUTE FUNCTION handle_orgao_status_change(); 