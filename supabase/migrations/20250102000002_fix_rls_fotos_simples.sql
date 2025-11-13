-- ============================================================
-- CORRIGIR POLÍTICAS RLS - VERSÃO ULTRA SIMPLIFICADA
-- ============================================================

-- REMOVER TODAS AS POLÍTICAS EXISTENTES DE ACOLHIDO_FOTOS
DROP POLICY IF EXISTS "Master admin can insert fotos" ON public.acolhido_fotos;
DROP POLICY IF EXISTS "Users can insert fotos from their empresa acolhidos" ON public.acolhido_fotos;
DROP POLICY IF EXISTS "Users can view fotos from their empresa acolhidos" ON public.acolhido_fotos;
DROP POLICY IF EXISTS "Users can update fotos from their empresa acolhidos" ON public.acolhido_fotos;
DROP POLICY IF EXISTS "Users can delete fotos from their empresa acolhidos" ON public.acolhido_fotos;

-- CRIAR POLÍTICAS ULTRA SIMPLIFICADAS
-- SELECT: qualquer usuário autenticado pode ver fotos
CREATE POLICY "Authenticated users can view fotos"
ON public.acolhido_fotos
FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT: qualquer usuário autenticado com empresa_id pode inserir
CREATE POLICY "Authenticated users with empresa_id can insert fotos"
ON public.acolhido_fotos
FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- UPDATE: qualquer usuário autenticado com empresa_id pode atualizar
CREATE POLICY "Authenticated users with empresa_id can update fotos"
ON public.acolhido_fotos
FOR UPDATE
USING (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- DELETE: qualquer usuário autenticado com empresa_id pode deletar
CREATE POLICY "Authenticated users with empresa_id can delete fotos"
ON public.acolhido_fotos
FOR DELETE
USING (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- REMOVER TODAS AS POLÍTICAS EXISTENTES DE DOCUMENTOS
DROP POLICY IF EXISTS "Master admin can do everything on documentos" ON public.documentos;
DROP POLICY IF EXISTS "Users can insert documentos from their empresa acolhidos" ON public.documentos;
DROP POLICY IF EXISTS "Users can view documentos from their empresa acolhidos" ON public.documentos;
DROP POLICY IF EXISTS "Users can update documentos from their empresa acolhidos" ON public.documentos;
DROP POLICY IF EXISTS "Users can delete documentos from their empresa acolhidos" ON public.documentos;

-- CRIAR POLÍTICAS ULTRA SIMPLIFICADAS PARA DOCUMENTOS
-- SELECT: qualquer usuário autenticado pode ver documentos
CREATE POLICY "Authenticated users can view documentos"
ON public.documentos
FOR SELECT
USING (auth.role() = 'authenticated');

-- INSERT: qualquer usuário autenticado com empresa_id pode inserir
CREATE POLICY "Authenticated users with empresa_id can insert documentos"
ON public.documentos
FOR INSERT
WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- UPDATE: qualquer usuário autenticado com empresa_id pode atualizar
CREATE POLICY "Authenticated users with empresa_id can update documentos"
ON public.documentos
FOR UPDATE
USING (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- DELETE: qualquer usuário autenticado com empresa_id pode deletar
CREATE POLICY "Authenticated users with empresa_id can delete documentos"
ON public.documentos
FOR DELETE
USING (
    auth.role() = 'authenticated'
    AND EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

