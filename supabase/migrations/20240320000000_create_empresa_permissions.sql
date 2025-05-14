-- Create empresa_permissions table
CREATE TABLE IF NOT EXISTS empresa_permissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  empresa_type TEXT NOT NULL,
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
  }',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index on empresa_type
CREATE INDEX IF NOT EXISTS idx_empresa_permissions_type ON empresa_permissions(empresa_type);

-- Insert default permissions for each type
INSERT INTO empresa_permissions (empresa_type, permissions)
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
  }'),
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
  }'),
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
  }'),
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
  }')
ON CONFLICT (empresa_type) DO NOTHING; 