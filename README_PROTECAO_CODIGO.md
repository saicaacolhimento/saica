# 🛡️ PROTEÇÃO DO CÓDIGO - LEIA ANTES DE MODIFICAR

## ⚠️ ATENÇÃO: CÓDIGO FUNCIONANDO

Este projeto está em um estado **FUNCIONANDO**. Antes de fazer qualquer modificação, leia este documento.

## 📁 Arquivos de Proteção

1. **`PROTECAO_CODIGO_ACOLHIDOS.md`** - Documentação sobre busca de acolhidos
2. **`IMPORTANTE_AUTHCONTEXT.md`** - Documentação crítica sobre AuthContext (se existir)
3. **`ESTADO_ATUAL_FUNCIONANDO.md`** - Lista de todas as funcionalidades funcionando (se existir)

## 🚫 NÃO MODIFICAR SEM CUIDADO

### AuthContext (`src/contexts/AuthContext.tsx`)
- ⚠️ **CRÍTICO:** Não adicione `await authService.getCurrentUser()` no carregamento inicial
- ⚠️ **CRÍTICO:** Não remova `finally { setLoading(false) }`
- ⚠️ **CRÍTICO:** Não adicione timeouts ou delays no carregamento inicial

**Por quê?** Isso causa tela branca e bloqueia o login.

### Busca de Acolhidos (`src/services/acolhido.ts`)
- ⚠️ **CRÍTICO:** Não adicione timeout manual
- ⚠️ **CRÍTICO:** Não remova o filtro por `empresa_id` para admins
- ⚠️ **CRÍTICO:** Use `abrigo_id` no mapeamento, não `empresa_id`

**Por quê?** Isso causa timeout e erro de carregamento.

### Dashboard (`src/pages/admin/Dashboard.tsx`)
- ⚠️ **CRÍTICO:** "Gestão de Empresas" só para master (`masterOnly: true`)
- ⚠️ **CRÍTICO:** "Gestão de Usuários" só para admin e master (`adminOnly: true`)

**Por quê?** Cards devem aparecer apenas para usuários corretos.

### AdminLayout (`src/layouts/AdminLayout.tsx`)
- ⚠️ **CRÍTICO:** "Empresas" só para master (`show: isMaster`)
- ⚠️ **CRÍTICO:** "Usuários" só para admin e master (`show: isAdmin`)

**Por quê?** Botões laterais devem aparecer apenas para usuários corretos.

## ✅ Como Fazer Modificações Seguras

1. **Leia primeiro:**
   - `PROTECAO_CODIGO_ACOLHIDOS.md`
   - Este arquivo

2. **Teste imediatamente:**
   - Faça login
   - Verifique se não ficou tela branca
   - Verifique se o carregamento é rápido
   - Verifique se os cards/botões aparecem corretamente

3. **Se algo quebrar:**
   - Reverta as mudanças imediatamente
   - Use o git para voltar à versão anterior

## 📝 Checklist Antes de Modificar

- [ ] Li os arquivos de proteção
- [ ] Entendi que NÃO devo adicionar timeouts manuais
- [ ] Entendi que NÃO devo remover filtros por role
- [ ] Vou testar imediatamente após a mudança
- [ ] Tenho um plano de rollback se algo der errado

## 🔄 Se Precisar Reverter

1. Use `git log` para ver commits recentes
2. Use `git revert <commit-hash>` para reverter um commit específico
3. Ou use `git reset --hard <commit-hash>` (CUIDADO: perde mudanças não commitadas)

---

**Última atualização:** Código funcionando - login rápido, busca de acolhidos funcionando, cards/botões filtrados corretamente

---

## Correção de Tela de Usuários (2025-01-07)

### Problema:
A tela de usuários estava mostrando todos os usuários do sistema, mesmo quando logado como admin (não master). Além disso, botões de editar/deletar apareciam para usuários admin quando logado como admin.

### Solução:

**1. Filtragem por Empresa:**
- Adicionada lógica para verificar se o usuário logado é `master` ou `admin`
- **Master:** Vê todos os admins do sistema (comportamento original)
- **Admin (não master):** Vê apenas usuários vinculados à sua empresa (`empresa_id`)
- Função `fetchUsuariosEmpresa()` busca apenas usuários da empresa do admin logado

**2. Proteção de Botões:**
- Botões de "Editar" e "Excluir" são ocultados para usuários com `role === 'admin'` quando logado como admin (não master)
- Exibe mensagem "Apenas master pode gerenciar" no lugar dos botões

**3. Posicionamento do Botão "Criar Usuário":**
- Botão movido para o topo da página, lado direito, acima do card de usuários
- Aparece apenas para admins (não master)

**4. Melhorias no Serviço:**
- `getUsersByEmpresa()` atualizado para tentar usar função RPC `get_users_by_empresa` primeiro (com `SECURITY DEFINER` para bypassar RLS)
- Fallback para query direta se RPC não estiver disponível
- Logs adicionados para debug

### Arquivos Modificados:
- `project/src/pages/admin/Usuarios.tsx` - Lógica de filtragem e renderização condicional
- `project/src/services/auth.ts` - Função `getUsersByEmpresa()` melhorada

### ⚠️ NÃO REVERTER:
- ❌ **NÃO** remover a verificação `!isMaster && user.role === 'admin'` para ocultar botões
- ❌ **NÃO** remover a lógica de `fetchUsuariosEmpresa()` para admins
- ❌ **NÃO** fazer `fetchAdmins()` quando logado como admin (não master)
- ✅ **SEMPRE** verificar `isMaster` e `isAdmin` antes de decidir qual lista mostrar

### Lógica de Detecção de Master (2025-01-07):

**Problema:** Master não via usuários porque `userRole` demorava para ser carregado.

**Solução:**
- **Detecção imediata pelo email:** Se `user?.email === 'saicaacolhimento2025@gmail.com'`, o sistema identifica como master imediatamente, sem esperar `userRole`
- **Busca imediata:** Quando master é detectado pelo email, `fetchAdmins()` é chamado imediatamente no `useEffect`
- **Fallback:** Se houver erro ao buscar dados do usuário, mas o email for do master, define `userRole` como 'master'

**Código crítico:**
```typescript
// Detecção imediata pelo email (mais rápido)
const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';

// No useEffect, verificar email primeiro
if (user?.email === 'saicaacolhimento2025@gmail.com') {
  fetchAdmins(); // Busca imediata, sem esperar userRole
  return;
}
```

**⚠️ NÃO REVERTER:**
- ❌ **NÃO** remover a verificação do email antes de verificar `userRole`
- ❌ **NÃO** fazer o `useEffect` esperar `userRole` se o email for do master
- ✅ **SEMPRE** verificar email primeiro para detecção rápida do master

