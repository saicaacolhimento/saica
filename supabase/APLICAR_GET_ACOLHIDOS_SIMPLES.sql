-- Versão SIMPLIFICADA da função para buscar acolhidos rapidamente
-- Execute este script no Supabase SQL Editor

-- Remover função antiga se existir
DROP FUNCTION IF EXISTS public.get_acolhidos(INTEGER, INTEGER);

-- Criar função simplificada
CREATE OR REPLACE FUNCTION public.get_acolhidos(
  p_page INTEGER DEFAULT 1,
  p_per_page INTEGER DEFAULT 10
)
RETURNS TABLE (
  data JSONB,
  total INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total INTEGER;
  v_data JSONB;
  v_user_id UUID;
  v_empresa_id UUID;
  v_is_master BOOLEAN;
BEGIN
  -- Obter ID do usuário atual
  v_user_id := auth.uid();
  
  -- Verificar se é master admin
  SELECT EXISTS (
    SELECT 1 FROM public.master_admin WHERE id = v_user_id
  ) INTO v_is_master;
  
  -- Se não for master, buscar empresa_id
  IF NOT v_is_master THEN
    SELECT empresa_id INTO v_empresa_id
    FROM public.usuarios
    WHERE id = v_user_id
    LIMIT 1;
  END IF;
  
  -- Contar total
  IF v_is_master THEN
    SELECT COUNT(*)::INTEGER INTO v_total FROM public.acolhidos;
  ELSE
    SELECT COUNT(*)::INTEGER INTO v_total 
    FROM public.acolhidos 
    WHERE abrigo_id = v_empresa_id;
  END IF;
  
  -- Buscar dados
  IF v_is_master THEN
    SELECT jsonb_agg(to_jsonb(a)) INTO v_data
    FROM (
      SELECT * FROM public.acolhidos
      ORDER BY created_at DESC
      LIMIT p_per_page OFFSET (p_page - 1) * p_per_page
    ) a;
  ELSE
    SELECT jsonb_agg(to_jsonb(a)) INTO v_data
    FROM (
      SELECT * FROM public.acolhidos
      WHERE abrigo_id = v_empresa_id
      ORDER BY created_at DESC
      LIMIT p_per_page OFFSET (p_page - 1) * p_per_page
    ) a;
  END IF;
  
  -- Retornar
  RETURN QUERY SELECT COALESCE(v_data, '[]'::jsonb), COALESCE(v_total, 0);
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) TO anon;

COMMENT ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) IS
'Busca acolhidos rapidamente. Master vê todos, admin vê apenas da sua empresa.';


