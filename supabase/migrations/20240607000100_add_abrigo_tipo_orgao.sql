-- Se for ENUM
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tipo_orgao') THEN
    CREATE TYPE tipo_orgao AS ENUM ('ABRIGO', 'CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO');
  ELSE
    BEGIN
      ALTER TYPE tipo_orgao ADD VALUE IF NOT EXISTS 'ABRIGO';
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- Se for constraint CHECK
ALTER TABLE public.orgaos DROP CONSTRAINT IF EXISTS orgaos_tipo_check;
ALTER TABLE public.orgaos ADD CONSTRAINT orgaos_tipo_check CHECK (tipo IN ('ABRIGO', 'CREAS', 'CRAS', 'CAPS', 'CONSELHO_TUTELAR', 'OUTRO')); 