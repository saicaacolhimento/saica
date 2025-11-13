-- ============================================================
-- SCRIPT COMPLETO DE SETUP DO NOVO SUPABASE - SAICA
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================================

-- ============================================================
-- 1. HABILITAR EXTENSÕES NECESSÁRIAS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 2. CRIAR TABELA MASTER_ADMIN (PRIMEIRO - outras dependem dela)
-- ============================================================
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
DROP POLICY IF EXISTS "Master admin can view their own record" ON public.master_admin;
CREATE POLICY "Master admin can view their own record"
ON public.master_admin
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Master admin can update their own record" ON public.master_admin;
CREATE POLICY "Master admin can update their own record"
ON public.master_admin
FOR UPDATE
USING (auth.uid() = id);

-- Create function to handle master admin authentication
CREATE OR REPLACE FUNCTION handle_master_admin_auth()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.email = 'saicaacolhimento2025@gmail.com' THEN
        INSERT INTO public.master_admin (id, email, nome)
        VALUES (NEW.id, NEW.email, 'Administrador Master')
        ON CONFLICT (id) DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_master_admin_auth();

-- ============================================================
-- 3. CRIAR TABELA EMPRESA_PERMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.empresa_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_type TEXT NOT NULL UNIQUE,
  permissions JSONB NOT NULL DEFAULT '{
    "acolhidos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "usuarios": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "agendamentos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "documentos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "relatorios": {
      "view": false,
      "export": false
    }
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_empresa_permissions_type ON public.empresa_permissions(empresa_type);

-- Insert default permissions
INSERT INTO public.empresa_permissions (empresa_type, permissions)
VALUES 
  ('abrigo', '{
    "acolhidos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "usuarios": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "agendamentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "documentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "relatorios": {
      "view": true,
      "export": true
    }
  }'::jsonb),
  ('caps', '{
    "acolhidos": {
      "view": true,
      "create": false,
      "edit": false,
      "delete": false
    },
    "usuarios": {
      "view": true,
      "create": false,
      "edit": false,
      "delete": false
    },
    "agendamentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "documentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "relatorios": {
      "view": true,
      "export": true
    }
  }'::jsonb),
  ('creas', '{
    "acolhidos": {
      "view": true,
      "create": false,
      "edit": false,
      "delete": false
    },
    "usuarios": {
      "view": true,
      "create": false,
      "edit": false,
      "delete": false
    },
    "agendamentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "documentos": {
      "view": true,
      "create": true,
      "edit": true,
      "delete": false
    },
    "relatorios": {
      "view": true,
      "export": true
    }
  }'::jsonb),
  ('outro', '{
    "acolhidos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "usuarios": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "agendamentos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "documentos": {
      "view": false,
      "create": false,
      "edit": false,
      "delete": false
    },
    "relatorios": {
      "view": false,
      "export": false
    }
  }'::jsonb)
ON CONFLICT (empresa_type) DO NOTHING;

-- Enable RLS
ALTER TABLE public.empresa_permissions ENABLE ROW LEVEL SECURITY;

-- Policies para empresa_permissions
DROP POLICY IF EXISTS "Everyone can view empresa_permissions" ON public.empresa_permissions;
CREATE POLICY "Everyone can view empresa_permissions"
ON public.empresa_permissions
FOR SELECT
USING (true);

-- ============================================================
-- 4. CRIAR TABELA EMPRESAS (ABRIGOS)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.empresas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    cnpj TEXT,
    endereco TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    postal_code TEXT,
    telefone TEXT NOT NULL,
    telefone_orgao TEXT,
    email TEXT NOT NULL,
    capacidade INTEGER DEFAULT 0,
    ocupacao_atual INTEGER DEFAULT 0,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'em_construcao')),
    descricao TEXT,
    observacoes TEXT,
    logo_url TEXT,
    responsavel_nome TEXT NOT NULL,
    responsavel_telefone TEXT NOT NULL,
    responsavel_email TEXT NOT NULL,
    master_email TEXT,
    master_password_hash TEXT,
    tipo TEXT DEFAULT 'ABRIGO' CHECK (tipo IN ('ABRIGO', 'CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

-- Policies para empresas
DROP POLICY IF EXISTS "Master admin can do everything on empresas" ON public.empresas;
CREATE POLICY "Master admin can do everything on empresas"
ON public.empresas
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can view empresas" ON public.empresas;
CREATE POLICY "Users can view empresas"
ON public.empresas
FOR SELECT
USING (true);

-- ============================================================
-- 5. CRIAR TABELA USUARIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.usuarios (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'master', 'padrao', 'orgao')),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
    cargo TEXT,
    empresa_id UUID REFERENCES public.empresas(id),
    orgao_id UUID,
    funcao TEXT,
    telefone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_sign_in_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Policies para usuarios
DROP POLICY IF EXISTS "Master admin can do everything on usuarios" ON public.usuarios;
CREATE POLICY "Master admin can do everything on usuarios"
ON public.usuarios
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can view their own record" ON public.usuarios;
CREATE POLICY "Users can view their own record"
ON public.usuarios
FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own record" ON public.usuarios;
CREATE POLICY "Users can update their own record"
ON public.usuarios
FOR UPDATE
USING (auth.uid() = id);

-- ============================================================
-- 6. CRIAR TABELA ORGAOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.orgaos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL CHECK (tipo IN ('ABRIGO', 'CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO')),
    tipo_outro TEXT,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL,
    nome_responsavel TEXT NOT NULL,
    email_responsavel TEXT NOT NULL,
    telefone_responsavel TEXT NOT NULL,
    telefone_orgao TEXT,
    logo_url TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    data_ativacao TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.orgaos ENABLE ROW LEVEL SECURITY;

-- Policies para orgaos
DROP POLICY IF EXISTS "Master admin can do everything on orgaos" ON public.orgaos;
CREATE POLICY "Master admin can do everything on orgaos"
ON public.orgaos
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Orgao admin can view their own orgao" ON public.orgaos;
CREATE POLICY "Orgao admin can view their own orgao"
ON public.orgaos
FOR SELECT
USING (
    id IN (
        SELECT orgao_id FROM public.usuarios
        WHERE id = auth.uid()
        AND role = 'orgao'
    )
);

-- ============================================================
-- 7. CRIAR TABELA ACOLHIDOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.acolhidos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome TEXT NOT NULL,
    data_nascimento DATE,
    nome_mae TEXT NOT NULL,
    cpf TEXT,
    rg TEXT,
    endereco TEXT,
    telefone TEXT,
    foto_url TEXT,
    abrigo_id UUID REFERENCES public.empresas(id),
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    genero TEXT,
    tipo_sanguineo TEXT,
    alergias TEXT,
    medicamentos TEXT,
    deficiencias TEXT,
    escola TEXT,
    serie TEXT,
    turno TEXT,
    observacoes_educacionais TEXT,
    nome_responsavel TEXT,
    parentesco_responsavel TEXT,
    cpf_responsavel TEXT,
    telefone_responsavel TEXT,
    endereco_responsavel TEXT,
    data_entrada DATE,
    motivo_acolhimento TEXT,
    data_inativacao DATE,
    motivo_inativacao TEXT,
    tecnico_referencia TEXT,
    caps_frequentado TEXT,
    creas TEXT,
    tecnico_creas TEXT,
    numero_acolhimentos INTEGER,
    instituicoes_anteriores TEXT,
    processo_judicial TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.acolhidos ENABLE ROW LEVEL SECURITY;

-- Policies para acolhidos
DROP POLICY IF EXISTS "Master admin can do everything on acolhidos" ON public.acolhidos;
CREATE POLICY "Master admin can do everything on acolhidos"
ON public.acolhidos
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can view acolhidos from their empresa" ON public.acolhidos;
CREATE POLICY "Users can view acolhidos from their empresa"
ON public.acolhidos
FOR SELECT
USING (
    abrigo_id IN (
        SELECT empresa_id FROM public.usuarios
        WHERE id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Users can manage acolhidos from their empresa" ON public.acolhidos;
CREATE POLICY "Users can manage acolhidos from their empresa"
ON public.acolhidos
FOR ALL
USING (
    abrigo_id IN (
        SELECT empresa_id FROM public.usuarios
        WHERE id = auth.uid()
        AND role IN ('admin', 'master')
    )
);

-- ============================================================
-- 8. CRIAR TABELA ACOLHIDO_FOTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.acolhido_fotos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    acolhido_id UUID REFERENCES public.acolhidos(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('foto_perfil', 'foto_documento')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.acolhido_fotos ENABLE ROW LEVEL SECURITY;

-- Policies para acolhido_fotos
DROP POLICY IF EXISTS "Users can view fotos from their empresa acolhidos" ON public.acolhido_fotos;
CREATE POLICY "Users can view fotos from their empresa acolhidos"
ON public.acolhido_fotos
FOR SELECT
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- ============================================================
-- 9. CRIAR TABELA AGENDAMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.agendamentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('consulta', 'exame', 'procedimento', 'outros')),
    status TEXT DEFAULT 'agendado' CHECK (status IN ('agendado', 'confirmado', 'cancelado', 'concluido')),
    acolhido_id UUID REFERENCES public.acolhidos(id),
    profissional_id UUID REFERENCES public.usuarios(id),
    local TEXT NOT NULL,
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Policies para agendamentos
DROP POLICY IF EXISTS "Users can view agendamentos from their empresa" ON public.agendamentos;
CREATE POLICY "Users can view agendamentos from their empresa"
ON public.agendamentos
FOR SELECT
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
    OR profissional_id = auth.uid()
);

-- ============================================================
-- 10. CRIAR TABELA DOCUMENTOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.documentos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    acolhido_id UUID REFERENCES public.acolhidos(id) ON DELETE CASCADE,
    tipo TEXT NOT NULL,
    nome TEXT NOT NULL,
    url TEXT NOT NULL,
    descricao TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;

-- Policies para documentos
DROP POLICY IF EXISTS "Users can view documentos from their empresa acolhidos" ON public.documentos;
CREATE POLICY "Users can view documentos from their empresa acolhidos"
ON public.documentos
FOR SELECT
USING (
    acolhido_id IN (
        SELECT id FROM public.acolhidos
        WHERE abrigo_id IN (
            SELECT empresa_id FROM public.usuarios
            WHERE id = auth.uid()
        )
    )
);

-- ============================================================
-- 11. CRIAR TABELA NOTIFICACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.notificacoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES auth.users(id),
    titulo TEXT NOT NULL,
    mensagem TEXT NOT NULL,
    tipo TEXT,
    lida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;

-- Policies para notificacoes
DROP POLICY IF EXISTS "Users can view their own notificacoes" ON public.notificacoes;
CREATE POLICY "Users can view their own notificacoes"
ON public.notificacoes
FOR SELECT
USING (usuario_id = auth.uid());

-- ============================================================
-- 12. CRIAR TABELA MENSAGENS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.mensagens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    remetente_id UUID REFERENCES auth.users(id),
    destinatario_id UUID REFERENCES auth.users(id),
    mensagem TEXT NOT NULL,
    lida BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Policies para mensagens
DROP POLICY IF EXISTS "Users can view their own mensagens" ON public.mensagens;
CREATE POLICY "Users can view their own mensagens"
ON public.mensagens
FOR SELECT
USING (remetente_id = auth.uid() OR destinatario_id = auth.uid());

-- ============================================================
-- 13. CRIAR TABELA RELATORIOS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.relatorios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tipo TEXT NOT NULL,
    titulo TEXT NOT NULL,
    dados JSONB,
    url TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.relatorios ENABLE ROW LEVEL SECURITY;

-- Policies para relatorios
DROP POLICY IF EXISTS "Users can view relatorios" ON public.relatorios;
CREATE POLICY "Users can view relatorios"
ON public.relatorios
FOR SELECT
USING (true);

-- ============================================================
-- 14. CRIAR TABELA CONFIGURACOES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.configuracoes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    chave TEXT UNIQUE NOT NULL,
    valor JSONB NOT NULL,
    descricao TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Policies para configuracoes
DROP POLICY IF EXISTS "Master admin can manage configuracoes" ON public.configuracoes;
CREATE POLICY "Master admin can manage configuracoes"
ON public.configuracoes
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.master_admin
        WHERE id = auth.uid()
    )
);

-- ============================================================
-- 15. CRIAR FUNÇÕES E TRIGGERS
-- ============================================================

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger updated_at em todas as tabelas
CREATE TRIGGER handle_empresas_updated_at
    BEFORE UPDATE ON public.empresas
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_usuarios_updated_at
    BEFORE UPDATE ON public.usuarios
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_orgaos_updated_at
    BEFORE UPDATE ON public.orgaos
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_acolhidos_updated_at
    BEFORE UPDATE ON public.acolhidos
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_configuracoes_updated_at
    BEFORE UPDATE ON public.configuracoes
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Função para atualizar data_ativacao de orgaos
CREATE OR REPLACE FUNCTION handle_orgao_status_change()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'ativo' AND (OLD.status IS NULL OR OLD.status != 'ativo') THEN
        NEW.data_ativacao = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_orgao_status_change
    BEFORE UPDATE ON public.orgaos
    FOR EACH ROW
    EXECUTE FUNCTION handle_orgao_status_change();

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================

