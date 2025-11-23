-- ⚠️ CRÍTICO: Corrigir RLS para permitir que admins vejam usuários da mesma empresa
-- Execute este script no Supabase SQL Editor

-- 0. Primeiro, garantir que a política do Master permite ver tudo (incluindo pelo UID específico)
DROP POLICY IF EXISTS "Master admin can do everything on usuarios" ON public.usuarios;
CREATE POLICY "Master admin can do everything on usuarios"
ON public.usuarios
FOR ALL
USING (
    -- Master na tabela master_admin
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    -- Master pelo UID específico (fallback caso não esteja na tabela master_admin)
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
);

-- Criar função auxiliar para evitar recursão infinita
CREATE OR REPLACE FUNCTION public.get_user_empresa_id(user_id UUID)
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT empresa_id FROM public.usuarios WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_user_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT role = 'admin' FROM public.usuarios WHERE id = user_id;
$$;

-- 1. Corrigir política de SELECT para permitir admins verem usuários da mesma empresa
-- ⚠️ CRÍTICO: A política do Master deve vir ANTES e ter prioridade
-- A política "Master admin can do everything" já existe e permite tudo para master
-- Esta política é apenas para usuários normais e admins

DROP POLICY IF EXISTS "Users can view their own record" ON public.usuarios;
CREATE POLICY "Users can view their own record"
ON public.usuarios
FOR SELECT
USING (
    -- Master pode ver tudo (verifica na tabela master_admin OU pelo UID específico)
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    -- Master pelo UID específico (fallback caso não esteja na tabela master_admin)
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Pode ver seu próprio registro
    auth.uid() = id
    OR
    -- Admin pode ver usuários da mesma empresa (usando função para evitar recursão)
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.empresa_id IS NOT NULL
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
    )
);

-- 2. Corrigir política de UPDATE para permitir admins atualizarem usuários da mesma empresa (exceto outros admins)
DROP POLICY IF EXISTS "Users can update their own record" ON public.usuarios;
CREATE POLICY "Users can update their own record"
ON public.usuarios
FOR UPDATE
USING (
    -- Pode atualizar seu próprio registro
    auth.uid() = id
    OR
    -- Admin pode atualizar usuários da mesma empresa (exceto outros admins)
    (
        public.is_user_admin(auth.uid())
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin' -- Admin não pode atualizar outros admins
    )
);

-- 3. Adicionar política para INSERT (admin pode criar usuários na sua empresa)
DROP POLICY IF EXISTS "Admins can insert users in their empresa" ON public.usuarios;
CREATE POLICY "Admins can insert users in their empresa"
ON public.usuarios
FOR INSERT
WITH CHECK (
    -- Admin pode criar usuários na sua empresa
    (
        public.is_user_admin(auth.uid())
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin' -- Admin não pode criar outros admins
    )
    OR
    -- Pode criar seu próprio registro (se não existir)
    auth.uid() = id
);

-- 4. Adicionar política para DELETE (admin pode deletar usuários da sua empresa, exceto outros admins)
DROP POLICY IF EXISTS "Admins can delete users from their empresa" ON public.usuarios;
CREATE POLICY "Admins can delete users from their empresa"
ON public.usuarios
FOR DELETE
USING (
    -- Admin pode deletar usuários da mesma empresa (exceto outros admins)
    (
        public.is_user_admin(auth.uid())
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin' -- Admin não pode deletar outros admins
    )
    OR
    -- Pode deletar seu próprio registro
    auth.uid() = id
);

