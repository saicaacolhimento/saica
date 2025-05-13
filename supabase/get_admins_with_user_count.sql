create or replace function public.get_admins_with_user_count()
returns table (
  id uuid,
  nome text,
  email text,
  empresa_id uuid,
  status text,
  role text,
  cargo text,
  nome_empresa text,
  tipo_empresa text,
  cidade_empresa text,
  estado_empresa text,
  usuarios_count integer
) as $$
begin
  return query
    select
      u.id,
      u.nome,
      u.email,
      u.empresa_id,
      u.status,
      u.role,
      u.cargo,
      e.nome as nome_empresa,
      e.tipo as tipo_empresa,
      e.cidade as cidade_empresa,
      e.estado as estado_empresa,
      (select count(*) from usuarios where empresa_id = u.empresa_id) as usuarios_count
    from usuarios u
    left join empresas e on u.empresa_id = e.id
    where u.role = 'admin';
end;
$$ language plpgsql security definer; 