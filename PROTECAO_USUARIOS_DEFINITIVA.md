# ⚠️ PROTEÇÃO DEFINITIVA - LÓGICA DE USUÁRIOS

## 🚨 NÃO MEXER NESTAS LÓGICAS SEM AUTORIZAÇÃO EXPLÍCITA

Este documento protege a lógica crítica de gerenciamento de usuários que foi testada e está funcionando corretamente.

---

## 📋 RESUMO DA SOLUÇÃO

### Problema Resolvido:
- **Master**: Vê todos os admins e pode gerenciar todos os usuários
- **Admin**: Vê APENAS usuários vinculados à sua empresa (incluindo ele mesmo)
- **Admin NÃO pode**: Editar/deletar outros admins

### Solução Implementada:
1. **Função RPC `get_users_by_empresa_rpc`**: Bypassa RLS usando `SECURITY DEFINER`
2. **Políticas RLS atualizadas**: Master e Admin configurados corretamente
3. **Renderização condicional**: Baseada em `isMaster` e `isAdmin`
4. **Fallback**: Se RPC falhar, usa query direta (respeita RLS)

---

## 🔒 ARQUIVOS PROTEGIDOS

### 1. `project/src/pages/admin/Usuarios.tsx`

#### ⚠️ NÃO ALTERAR:
- **Linhas 37-38**: Detecção de `isMaster` e `isAdmin`
- **Linhas 40-57**: `useEffect` que busca `userRole` e `userEmpresaId`
- **Linhas 71-105**: Função `fetchUsuariosEmpresa()` - Busca usuários da empresa do admin
- **Linhas 107-136**: `useEffect` que decide qual função chamar baseado no role
- **Linhas 304-505**: Renderização condicional `{isMaster ? ... : ...}`
- **Linhas 239-251**: `handleDeleteUser` - Atualiza lista correta baseada no role
- **Linhas 263-301**: `handleEditUser` - Atualiza lista correta baseada no role
- **Linhas 165-235**: `handleCreateUser` - Usa `userEmpresaId` para admin

#### Lógica Crítica:
```typescript
// ⚠️ CRÍTICO: Detecção de master e admin
const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';
const isAdmin = userRole === 'admin' || isMaster;

// ⚠️ CRÍTICO: Buscar dados baseado no role
useEffect(() => {
  if (user?.email === 'saicaacolhimento2025@gmail.com') {
    fetchAdmins(); // Master vê todos os admins
    return;
  }
  if (userRole === 'master') {
    fetchAdmins();
  } else if (userRole === 'admin' && userEmpresaId) {
    fetchUsuariosEmpresa(); // Admin vê apenas usuários da sua empresa
  }
}, [userRole, userEmpresaId, user?.email]);

// ⚠️ CRÍTICO: Renderização condicional
{isMaster ? (
  // MASTER: Vê todos os admins
  <Table>...</Table>
) : (
  // ADMIN: Vê apenas usuários da sua empresa
  <Table>...</Table>
)}
```

---

### 2. `project/src/services/auth.ts`

#### ⚠️ NÃO ALTERAR:
- **Linhas 193-241**: Função `getUsersByEmpresa()` - Tenta RPC primeiro, depois query direta
- **Linhas 60-88**: Função `getCurrentUser()` - Busca dados do usuário (SEM `abrigos(*)`)

#### Lógica Crítica:
```typescript
async getUsersByEmpresa(empresa_id: string): Promise<{ data: any[]; error: any }> {
  // ⚠️ SOLUÇÃO DEFINITIVA: Tentar primeiro usar RPC que bypassa RLS
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_users_by_empresa_rpc', {
      empresa_id_param: empresa_id
    });
    if (!rpcError && rpcData) {
      return { data: rpcData || [], error: null };
    }
  } catch (rpcErr: any) {
    // Fallback para query direta
  }
  
  // Fallback: Query direta (respeita RLS)
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nome, email, telefone, cargo, role, status, empresa_id, created_at, updated_at')
    .eq('empresa_id', empresa_id)
    .order('created_at', { ascending: false });
  
  return { data: data || [], error };
}
```

---

### 3. `project/supabase/FIX_DEFINITIVO_USUARIOS.sql`

#### ⚠️ NÃO ALTERAR:
- **Linhas 6-39**: Função RPC `get_users_by_empresa_rpc` - Bypassa RLS
- **Linhas 42-55**: Política do Master
- **Linhas 58-74**: Funções auxiliares (`get_user_empresa_id`, `is_user_admin`)
- **Linhas 77-100**: Política de SELECT
- **Linhas 102-126**: Política de UPDATE
- **Linhas 128-152**: Política de INSERT
- **Linhas 154-178**: Política de DELETE

#### Lógica Crítica:
```sql
-- ⚠️ CRÍTICO: Função RPC que bypassa RLS
CREATE OR REPLACE FUNCTION public.get_users_by_empresa_rpc(empresa_id_param UUID)
RETURNS TABLE (...)
LANGUAGE plpgsql
SECURITY DEFINER  -- ⚠️ Bypassa RLS
AS $$
BEGIN
    RETURN QUERY
    SELECT ... FROM public.usuarios u
    WHERE u.empresa_id = empresa_id_param
    ORDER BY u.created_at DESC;
END;
$$;

-- ⚠️ CRÍTICO: Política de SELECT
CREATE POLICY "Users can view their own record"
ON public.usuarios
FOR SELECT
USING (
    -- Master pode ver tudo
    EXISTS (SELECT 1 FROM public.master_admin WHERE id = auth.uid())
    OR auth.uid() = '744e43fe-2c07-476c-bf0b-b7f5a0a1a059'::uuid
    OR
    -- Pode ver seu próprio registro
    auth.uid() = id
    OR
    -- Admin pode ver usuários da mesma empresa
    (
        public.is_user_admin(auth.uid()) = true
        AND public.get_user_empresa_id(auth.uid()) = usuarios.empresa_id
    )
);
```

---

## 🎯 COMPORTAMENTO ESPERADO

### Master (`saicaacolhimento2025@gmail.com`):
- ✅ Vê TODOS os admins na lista principal
- ✅ Pode clicar em "+ Usuários" em qualquer admin e ver TODOS os usuários daquela empresa
- ✅ Pode criar, editar e deletar qualquer usuário
- ✅ Botão "Criar Usuário" aparece apenas quando expande um admin

### Admin (qualquer outro admin):
- ✅ Vê APENAS usuários da sua empresa (incluindo ele mesmo)
- ✅ Vê usuários criados por ele
- ✅ Botão "Criar Usuário" aparece no topo direito
- ✅ NÃO pode editar/deletar outros admins (mostra "Apenas master pode gerenciar")
- ✅ Pode criar, editar e deletar usuários com `role = 'padrao'`

---

## 🔧 COMO FUNCIONA

### Fluxo para Master:
1. `useEffect` detecta `isMaster = true`
2. Chama `fetchAdmins()` → Busca todos os admins via RPC `get_admins_with_user_count`
3. Renderiza tabela com todos os admins
4. Ao clicar em "+ Usuários", chama `getUsersByEmpresa(admin.empresa_id)`
5. Função tenta RPC `get_users_by_empresa_rpc` (bypassa RLS)
6. Se RPC falhar, usa query direta (respeita RLS do Master)

### Fluxo para Admin:
1. `useEffect` detecta `userRole = 'admin'` e `userEmpresaId`
2. Chama `fetchUsuariosEmpresa()` → Busca usuários da empresa do admin
3. Função `getUsersByEmpresa(userEmpresaId)` tenta RPC primeiro
4. RPC bypassa RLS e retorna TODOS os usuários da empresa
5. Renderiza tabela simplificada apenas com usuários da empresa

---

## ⚠️ AVISOS CRÍTICOS

### NÃO FAZER:
1. ❌ Remover a função RPC `get_users_by_empresa_rpc`
2. ❌ Alterar a lógica de `isMaster` e `isAdmin`
3. ❌ Remover a renderização condicional `{isMaster ? ... : ...}`
4. ❌ Alterar as políticas RLS sem testar
5. ❌ Usar `select('*, abrigos(*)')` - causa erro 400
6. ❌ Remover o fallback da função `getUsersByEmpresa`
7. ❌ Alterar a ordem das políticas RLS (Master deve vir primeiro)

### FAZER ANTES DE ALTERAR:
1. ✅ Testar como Master
2. ✅ Testar como Admin
3. ✅ Verificar logs no console
4. ✅ Verificar se RPC está funcionando
5. ✅ Verificar se políticas RLS estão ativas

---

## 📝 SCRIPTS SQL NECESSÁRIOS

### Para aplicar no Supabase:
1. **`FIX_DEFINITIVO_USUARIOS.sql`** - Script completo com todas as correções
   - Cria função RPC
   - Atualiza políticas RLS
   - Cria funções auxiliares

### Ordem de execução:
1. Execute `FIX_DEFINITIVO_USUARIOS.sql` no Supabase SQL Editor
2. Verifique se não há erros
3. Teste a aplicação

---

## 🐛 DEBUG

### Se Admin não vê usuários:
1. Verifique no console: `[Usuarios] Admin detectado com empresa_id`
2. Verifique: `[authService] ✅ RPC funcionou!` ou erro
3. Verifique se `userEmpresaId` não é `null`
4. Verifique se a função RPC existe no Supabase
5. Execute `FIX_DEFINITIVO_USUARIOS.sql` novamente

### Se Master não vê usuários ao expandir:
1. Verifique se a política do Master está ativa
2. Verifique se o UID do master está correto
3. Verifique logs no console

---

## ✅ TESTES DE VALIDAÇÃO

### Teste 1: Master
1. Login como `saicaacolhimento2025@gmail.com`
2. Ir para `/admin/usuarios`
3. Deve ver lista de admins
4. Clicar em "+ Usuários" em um admin
5. Deve ver TODOS os usuários daquela empresa

### Teste 2: Admin
1. Login como admin qualquer
2. Ir para `/admin/usuarios`
3. Deve ver APENAS usuários da sua empresa
4. Deve ver o botão "Criar Usuário" no topo direito
5. Criar um novo usuário
6. Novo usuário deve aparecer na lista imediatamente

### Teste 3: Admin não pode gerenciar outros admins
1. Login como admin
2. Se houver outro admin na lista, não deve ter botões de editar/deletar
3. Deve mostrar "Apenas master pode gerenciar"

---

## 📅 DATA DA ÚLTIMA CORREÇÃO

**Data**: 2025-01-07
**Status**: ✅ FUNCIONANDO CORRETAMENTE
**Solução**: Função RPC + Políticas RLS atualizadas

---

## 🚫 PROTEÇÃO

**NÃO ALTERAR ESTAS LÓGICAS SEM:**
1. Autorização explícita do usuário
2. Testes completos como Master e Admin
3. Verificação de que a solução alternativa funciona
4. Documentação da mudança

**ESTA LÓGICA FOI TESTADA E ESTÁ FUNCIONANDO. NÃO QUEBRAR.**

