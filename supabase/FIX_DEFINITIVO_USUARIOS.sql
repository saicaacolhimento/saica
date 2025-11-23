-- ⚠️ SOLUÇÃO DEFINITIVA: Permitir que admins vejam usuários da mesma empresa
-- Execute este script no Supabase SQL Editor

-- 1. Criar função RPC que bypassa RLS para buscar usuários da empresa
-- Esta função usa SECURITY DEFINER para executar com privilégios do criador
CREATE OR REPLACE FUNCTION public.get_users_by_empresa_rpc(empresa_id_param UUID)
RETURNS TABLE (
    id UUID,
    nome TEXT,
    email TEXT,
    telefone TEXT,
    cargo TEXT,
    role TEXT,
    status TEXT,
    empresa_id UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.id,
        u.nome,
        u.email,
        u.telefone,
        u.cargo,
        u.role,
        u.status,
        u.empresa_id,
        u.created_at,
        u.updated_at
    FROM public.usuarios u
    WHERE u.empresa_id = empresa_id_param
    ORDER BY u.created_at DESC;
END;
$$;

-- 2. Garantir que a política do Master permite tudo
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
    -- Master pelo UID específico
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
);

-- 3. Criar função auxiliar para evitar recursão infinita
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

-- 4. Política de SELECT simplificada - Master pode tudo, Admin pode ver usuários da mesma empresa
DROP POLICY IF EXISTS "Users can view their own record" ON public.usuarios;
CREATE POLICY "Users can view their own record"
ON public.usuarios
FOR SELECT
USING (
    -- Master pode ver tudo
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Pode ver seu próprio registro
    auth.uid() = id
    OR
    -- Admin pode ver usuários da mesma empresa
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.empresa_id IS NOT NULL
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
    )
);

-- 5. Política de UPDATE
DROP POLICY IF EXISTS "Users can update their own record" ON public.usuarios;
CREATE POLICY "Users can update their own record"
ON public.usuarios
FOR UPDATE
USING (
    -- Master pode tudo
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Pode atualizar seu próprio registro
    auth.uid() = id
    OR
    -- Admin pode atualizar usuários da mesma empresa (exceto outros admins)
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin'
    )
);

-- 6. Política de INSERT
DROP POLICY IF EXISTS "Admins can insert users in their empresa" ON public.usuarios;
CREATE POLICY "Admins can insert users in their empresa"
ON public.usuarios
FOR INSERT
WITH CHECK (
    -- Master pode tudo
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Admin pode criar usuários na sua empresa
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin'
    )
    OR
    -- Pode criar seu próprio registro
    auth.uid() = id
);

-- 7. Política de DELETE
DROP POLICY IF EXISTS "Admins can delete users from their empresa" ON public.usuarios;
CREATE POLICY "Admins can delete users from their empresa"
ON public.usuarios
FOR DELETE
USING (
    -- Master pode tudo
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
    OR
    auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Admin pode deletar usuários da mesma empresa (exceto outros admins)
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
        AND public.get_user_empresa_id(auth.uid()) IS NOT NULL
        AND usuarios.role != 'admin'
    )
    OR
    -- Pode deletar seu próprio registro
    auth.uid() = id
);

