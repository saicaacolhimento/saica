-- ============================================================
-- VERIFICAR E CORRIGIR POLÍTICAS RLS DEFINITIVAMENTE
-- ============================================================

-- PRIMEIRO: Verificar se RLS está habilitado
-- Se estiver causando problemas, vamos garantir que as políticas funcionem

-- REMOVER TODAS AS POLÍTICAS EXISTENTES DE ACOLHIDO_FOTOS (garantir limpeza completa)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'acolhido_fotos' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.acolhido_fotos', r.policyname);
    END LOOP;
END $$;

-- REMOVER TODAS AS POLÍTICAS EXISTENTES DE DOCUMENTOS (garantir limpeza completa)
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'documentos' AND schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.documentos', r.policyname);
    END LOOP;
END $$;

-- CRIAR POLÍTICAS ULTRA PERMISSIVAS PARA ACOLHIDO_FOTOS
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

-- CRIAR POLÍTICAS ULTRA PERMISSIVAS PARA DOCUMENTOS
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

-- Verificar se a coluna status existe em documentos
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'documentos' 
        AND column_name = 'status'
    ) THEN
        ALTER TABLE public.documentos
        ADD COLUMN status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));
    END IF;
END $$;

-- Garantir que as tabelas têm RLS habilitado
ALTER TABLE public.acolhido_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

