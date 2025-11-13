-- ============================================================
-- MIGRATION COMPLETA - TUDO QUE PRECISA SER CRIADO/CORRIGIDO
-- ============================================================
-- Execute esta migration no Supabase SQL Editor
-- ============================================================

-- ============================================================
-- 1. ADICIONAR CAMPOS FALTANTES NA TABELA ACOLHIDOS
-- ============================================================
-- Campos que estão no formulário mas não existem no banco

ALTER TABLE public.acolhidos
ADD COLUMN IF NOT EXISTS cras TEXT,
ADD COLUMN IF NOT EXISTS tecnico_cras TEXT,
ADD COLUMN IF NOT EXISTS historico_escolar TEXT,
ADD COLUMN IF NOT EXISTS laudo_medico TEXT,
ADD COLUMN IF NOT EXISTS receita_remedio TEXT,
ADD COLUMN IF NOT EXISTS nome_pai TEXT,
ADD COLUMN IF NOT EXISTS possui_irmaos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS numero_irmaos INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS nomes_irmaos TEXT,
ADD COLUMN IF NOT EXISTS endereco_familia TEXT,
ADD COLUMN IF NOT EXISTS telefone_familia TEXT,
ADD COLUMN IF NOT EXISTS diagnostico_medico TEXT,
ADD COLUMN IF NOT EXISTS uso_medicacao TEXT,
ADD COLUMN IF NOT EXISTS uso_drogas TEXT,
ADD COLUMN IF NOT EXISTS escola_atual TEXT,
ADD COLUMN IF NOT EXISTS telefone_escola TEXT;

-- Comentários para documentação
COMMENT ON COLUMN public.acolhidos.cras IS 'CRAS frequentado pelo acolhido';
COMMENT ON COLUMN public.acolhidos.tecnico_cras IS 'Nome do técnico do CRAS';
COMMENT ON COLUMN public.acolhidos.historico_escolar IS 'Histórico escolar do acolhido';
COMMENT ON COLUMN public.acolhidos.laudo_medico IS 'Laudo médico do acolhido';
COMMENT ON COLUMN public.acolhidos.receita_remedio IS 'Receita de remédios';
COMMENT ON COLUMN public.acolhidos.nome_pai IS 'Nome do pai do acolhido';
COMMENT ON COLUMN public.acolhidos.possui_irmaos IS 'Indica se o acolhido possui irmãos';
COMMENT ON COLUMN public.acolhidos.numero_irmaos IS 'Número de irmãos do acolhido';
COMMENT ON COLUMN public.acolhidos.nomes_irmaos IS 'Nomes dos irmãos do acolhido';
COMMENT ON COLUMN public.acolhidos.endereco_familia IS 'Endereço da família do acolhido';
COMMENT ON COLUMN public.acolhidos.telefone_familia IS 'Telefone da família do acolhido';
COMMENT ON COLUMN public.acolhidos.diagnostico_medico IS 'Diagnóstico médico do acolhido';
COMMENT ON COLUMN public.acolhidos.uso_medicacao IS 'Informações sobre uso de medicação';
COMMENT ON COLUMN public.acolhidos.uso_drogas IS 'Informações sobre uso de drogas';
COMMENT ON COLUMN public.acolhidos.escola_atual IS 'Escola atual do acolhido';
COMMENT ON COLUMN public.acolhidos.telefone_escola IS 'Telefone da escola atual';

-- ============================================================
-- 2. ADICIONAR COLUNA STATUS NA TABELA DOCUMENTOS
-- ============================================================
ALTER TABLE public.documentos
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

COMMENT ON COLUMN public.documentos.status IS 'Status do documento: ativo ou inativo';

-- ============================================================
-- 3. REMOVER TODAS AS POLÍTICAS RLS EXISTENTES
-- ============================================================
-- Remove todas as políticas de acolhido_fotos
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'acolhido_fotos' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.acolhido_fotos', r.policyname);
    END LOOP;
END $$;

-- Remove todas as políticas de documentos
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'documentos' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.documentos', r.policyname);
    END LOOP;
END $$;

-- ============================================================
-- 4. CRIAR POLÍTICAS RLS PERMISSIVAS PARA ACOLHIDO_FOTOS
-- ============================================================
-- Garantir que RLS está habilitado
ALTER TABLE public.acolhido_fotos ENABLE ROW LEVEL SECURITY;

-- SELECT: qualquer usuário autenticado pode ver
CREATE POLICY "allow_select_acolhido_fotos"
ON public.acolhido_fotos
FOR SELECT
TO authenticated
USING (true);

-- INSERT: qualquer usuário autenticado pode inserir
CREATE POLICY "allow_insert_acolhido_fotos"
ON public.acolhido_fotos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: qualquer usuário autenticado pode atualizar
CREATE POLICY "allow_update_acolhido_fotos"
ON public.acolhido_fotos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE: qualquer usuário autenticado pode deletar
CREATE POLICY "allow_delete_acolhido_fotos"
ON public.acolhido_fotos
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- 5. CRIAR POLÍTICAS RLS PERMISSIVAS PARA DOCUMENTOS
-- ============================================================
-- Garantir que RLS está habilitado
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- SELECT: qualquer usuário autenticado pode ver
CREATE POLICY "allow_select_documentos"
ON public.documentos
FOR SELECT
TO authenticated
USING (true);

-- INSERT: qualquer usuário autenticado pode inserir
CREATE POLICY "allow_insert_documentos"
ON public.documentos
FOR INSERT
TO authenticated
WITH CHECK (true);

-- UPDATE: qualquer usuário autenticado pode atualizar
CREATE POLICY "allow_update_documentos"
ON public.documentos
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- DELETE: qualquer usuário autenticado pode deletar
CREATE POLICY "allow_delete_documentos"
ON public.documentos
FOR DELETE
TO authenticated
USING (true);

-- ============================================================
-- FIM DA MIGRATION
-- ============================================================
-- Esta migration:
-- 1. Adiciona todos os campos faltantes na tabela acolhidos
-- 2. Adiciona a coluna status na tabela documentos
-- 3. Remove todas as políticas RLS antigas
-- 4. Cria políticas RLS permissivas para acolhido_fotos
-- 5. Cria políticas RLS permissivas para documentos
-- ============================================================

