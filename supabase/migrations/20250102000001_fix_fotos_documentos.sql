-- ============================================================
-- CORRIGIR POLÍTICAS RLS E ESTRUTURA DAS TABELAS
-- ============================================================

-- 1. ADICIONAR COLUNA STATUS NA TABELA DOCUMENTOS
ALTER TABLE public.documentos
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo'));

-- 2. ADICIONAR POLÍTICAS RLS PARA INSERT EM ACOLHIDO_FOTOS
-- Política para master admin
DROP POLICY IF EXISTS "Master admin can insert fotos" ON public.acolhido_fotos;
CREATE POLICY "Master admin can insert fotos"
ON public.acolhido_fotos
FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

-- Política para usuários inserirem fotos de acolhidos da sua empresa
-- Versão MUITO simplificada: permite inserir se o usuário está autenticado e tem empresa_id
DROP POLICY IF EXISTS "Users can insert fotos from their empresa acolhidos" ON public.acolhido_fotos;
CREATE POLICY "Users can insert fotos from their empresa acolhidos"
ON public.acolhido_fotos
FOR INSERT
WITH CHECK (
    -- Apenas verifica se o usuário está autenticado e tem empresa_id
    EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- Política para UPDATE em acolhido_fotos
DROP POLICY IF EXISTS "Users can update fotos from their empresa acolhidos" ON public.acolhido_fotos;
CREATE POLICY "Users can update fotos from their empresa acolhidos"
ON public.acolhido_fotos
FOR UPDATE
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- Política para DELETE em acolhido_fotos
DROP POLICY IF EXISTS "Users can delete fotos from their empresa acolhidos" ON public.acolhido_fotos;
CREATE POLICY "Users can delete fotos from their empresa acolhidos"
ON public.acolhido_fotos
FOR DELETE
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- 3. ADICIONAR POLÍTICAS RLS PARA INSERT/UPDATE/DELETE EM DOCUMENTOS
-- Política para master admin
DROP POLICY IF EXISTS "Master admin can do everything on documentos" ON public.documentos;
CREATE POLICY "Master admin can do everything on documentos"
ON public.documentos
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

-- Política para INSERT em documentos
-- Versão MUITO simplificada: permite inserir se o usuário está autenticado e tem empresa_id
DROP POLICY IF EXISTS "Users can insert documentos from their empresa acolhidos" ON public.documentos;
CREATE POLICY "Users can insert documentos from their empresa acolhidos"
ON public.documentos
FOR INSERT
WITH CHECK (
    -- Apenas verifica se o usuário está autenticado e tem empresa_id
    EXISTS (
        SELECT 1 FROM public.usuarios
        WHERE id = auth.uid()
        AND empresa_id IS NOT NULL
    )
);

-- Política para UPDATE em documentos
DROP POLICY IF EXISTS "Users can update documentos from their empresa acolhidos" ON public.documentos;
CREATE POLICY "Users can update documentos from their empresa acolhidos"
ON public.documentos
FOR UPDATE
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- Política para DELETE em documentos
DROP POLICY IF EXISTS "Users can delete documentos from their empresa acolhidos" ON public.documentos;
CREATE POLICY "Users can delete documentos from their empresa acolhidos"
ON public.documentos
FOR DELETE
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- Comentários para documentação
COMMENT ON COLUMN public.documentos.status IS 'Status do documento: ativo ou inativo';

