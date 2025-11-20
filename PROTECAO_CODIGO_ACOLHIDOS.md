# 🛡️ PROTEÇÃO - BUSCA DE ACOLHIDOS - NÃO MODIFICAR

## ⚠️ ATENÇÃO: ESTE CÓDIGO ESTÁ FUNCIONANDO CORRETAMENTE
**NÃO FAÇA MUDANÇAS QUE POSSAM CAUSAR TIMEOUT OU TRAVAMENTO**

## Estado Atual (Funcionando)

### 1. Serviço de Acolhidos (`src/services/acolhido.ts`)
- **Versão:** Busca direta com filtro baseado em role
- **Funcionalidade:**
  - Master vê todos os acolhidos
  - Admin vê apenas acolhidos da sua empresa (filtrado por `abrigo_id = empresa_id`)
  - Busca direta no Supabase, sem depender de função SQL
  - **NÃO usa timeout** - deixa o React Query gerenciar

### 2. Listagem de Acolhidos (`src/features/acolhidos/pages/AcolhidoList.tsx`)
- **Versão:** Sem timeout manual
- **Funcionalidade:**
  - React Query gerencia o loading/error
  - **NÃO tem timeout de 15 segundos** - foi removido
  - Mostra erro apenas se realmente houver erro na query
  - Usa `abrigo_id` para mapear abrigos (não `empresa_id`)

## ⚠️ NÃO FAÇA:

- ❌ **NÃO** adicione timeout manual no componente ou serviço
- ❌ **NÃO** tente usar função SQL RPC se não estiver funcionando
- ❌ **NÃO** remova o filtro por `empresa_id` para admins
- ❌ **NÃO** use `empresa_id` ao invés de `abrigo_id` no mapeamento
- ❌ **NÃO** adicione `Promise.race` com timeout que bloqueia a query

## ✅ PODE FAZER:

- ✅ Melhorar a UI/UX sem afetar a busca
- ✅ Adicionar mais filtros (mas não remover os existentes)
- ✅ Otimizar a query se necessário (mas manter o filtro por role)

## Como Funciona:

1. Usuário acessa `/admin/criancas`
2. `AcolhidoList` chama `acolhidoService.getAcolhidos()`
3. Serviço verifica se é master ou admin
4. Se master: busca todos os acolhidos
5. Se admin: busca apenas acolhidos onde `abrigo_id = empresa_id` do admin
6. Retorna dados paginados
7. React Query gerencia loading/error automaticamente

## Arquivos Críticos:

- `project/src/services/acolhido.ts` - Função `getAcolhidos()`
- `project/src/features/acolhidos/pages/AcolhidoList.tsx` - Componente de listagem

## Se Precisar Modificar:

1. **TESTE PRIMEIRO** se a busca ainda funciona rapidamente
2. **NÃO** adicione timeouts manuais
3. **NÃO** remova o filtro por `empresa_id` para admins
4. Se precisar usar função SQL, teste bem antes de remover o fallback

---

**Última atualização:** Versão funcionando - busca direta, sem timeout, com filtro correto por role

