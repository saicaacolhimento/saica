-- Aplicar função SQL para buscar acolhidos rapidamente
-- Execute este script no Supabase SQL Editor

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
  v_user_role TEXT;
  v_empresa_id UUID;
  v_is_master BOOLEAN;
BEGIN
  -- Obter informações do usuário atual
  v_user_id := auth.uid();
  
  -- Verificar se é master admin
  SELECT EXISTS (
    SELECT 1 FROM public.master_admin WHERE id = v_user_id
  ) INTO v_is_master;
  
  -- Se não for master, buscar empresa_id do usuário
  IF NOT v_is_master THEN
    SELECT empresa_id, role INTO v_empresa_id, v_user_role
    FROM public.usuarios
    WHERE id = v_user_id;
  END IF;
  
  -- Contar total de acolhidos
  IF v_is_master THEN
    -- Master vê todos
    SELECT COUNT(*)::INTEGER INTO v_total
    FROM public.acolhidos;
  ELSE
    -- Admin vê apenas da sua empresa
    SELECT COUNT(*)::INTEGER INTO v_total
    FROM public.acolhidos
    WHERE abrigo_id = v_empresa_id;
  END IF;
  
  -- Buscar dados paginados
  IF v_is_master THEN
    -- Master vê todos
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'nome', a.nome,
        'data_nascimento', a.data_nascimento,
        'nome_mae', a.nome_mae,
        'cpf', a.cpf,
        'rg', a.rg,
        'endereco', a.endereco,
        'telefone', a.telefone,
        'foto_url', a.foto_url,
        'abrigo_id', a.abrigo_id,
        'status', a.status,
        'genero', a.genero,
        'tipo_sanguineo', a.tipo_sanguineo,
        'alergias', a.alergias,
        'medicamentos', a.medicamentos,
        'deficiencias', a.deficiencias,
        'escola', a.escola,
        'serie', a.serie,
        'turno', a.turno,
        'observacoes_educacionais', a.observacoes_educacionais,
        'nome_responsavel', a.nome_responsavel,
        'parentesco_responsavel', a.parentesco_responsavel,
        'cpf_responsavel', a.cpf_responsavel,
        'telefone_responsavel', a.telefone_responsavel,
        'endereco_responsavel', a.endereco_responsavel,
        'data_entrada', a.data_entrada,
        'motivo_acolhimento', a.motivo_acolhimento,
        'data_inativacao', a.data_inativacao,
        'motivo_inativacao', a.motivo_inativacao,
        'tecnico_referencia', a.tecnico_referencia,
        'caps_frequentado', a.caps_frequentado,
        'creas', a.creas,
        'tecnico_creas', a.tecnico_creas,
        'numero_acolhimentos', a.numero_acolhimentos,
        'instituicoes_anteriores', a.instituicoes_anteriores,
        'processo_judicial', a.processo_judicial,
        'created_at', a.created_at,
        'updated_at', a.updated_at
      )
    ) INTO v_data
    FROM (
      SELECT * FROM public.acolhidos
      ORDER BY created_at DESC
      LIMIT p_per_page OFFSET (p_page - 1) * p_per_page
    ) a;
  ELSE
    -- Admin vê apenas da sua empresa
    SELECT jsonb_agg(
      jsonb_build_object(
        'id', a.id,
        'nome', a.nome,
        'data_nascimento', a.data_nascimento,
        'nome_mae', a.nome_mae,
        'cpf', a.cpf,
        'rg', a.rg,
        'endereco', a.endereco,
        'telefone', a.telefone,
        'foto_url', a.foto_url,
        'abrigo_id', a.abrigo_id,
        'status', a.status,
        'genero', a.genero,
        'tipo_sanguineo', a.tipo_sanguineo,
        'alergias', a.alergias,
        'medicamentos', a.medicamentos,
        'deficiencias', a.deficiencias,
        'escola', a.escola,
        'serie', a.serie,
        'turno', a.turno,
        'observacoes_educacionais', a.observacoes_educacionais,
        'nome_responsavel', a.nome_responsavel,
        'parentesco_responsavel', a.parentesco_responsavel,
        'cpf_responsavel', a.cpf_responsavel,
        'telefone_responsavel', a.telefone_responsavel,
        'endereco_responsavel', a.endereco_responsavel,
        'data_entrada', a.data_entrada,
        'motivo_acolhimento', a.motivo_acolhimento,
        'data_inativacao', a.data_inativacao,
        'motivo_inativacao', a.motivo_inativacao,
        'tecnico_referencia', a.tecnico_referencia,
        'caps_frequentado', a.caps_frequentado,
        'creas', a.creas,
        'tecnico_creas', a.tecnico_creas,
        'numero_acolhimentos', a.numero_acolhimentos,
        'instituicoes_anteriores', a.instituicoes_anteriores,
        'processo_judicial', a.processo_judicial,
        'created_at', a.created_at,
        'updated_at', a.updated_at
      )
    ) INTO v_data
    FROM (
      SELECT * FROM public.acolhidos
      WHERE abrigo_id = v_empresa_id
      ORDER BY created_at DESC
      LIMIT p_per_page OFFSET (p_page - 1) * p_per_page
    ) a;
  END IF;
  
  -- Retornar resultado
  RETURN QUERY SELECT COALESCE(v_data, '[]'::jsonb), COALESCE(v_total, 0);
END;
$$;

-- Conceder permissões
GRANT EXECUTE ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) TO anon;

COMMENT ON FUNCTION public.get_acolhidos(INTEGER, INTEGER) IS
'Busca acolhidos com paginação. Master vê todos, admin vê apenas da sua empresa. Usa SECURITY DEFINER para bypassar RLS.';

