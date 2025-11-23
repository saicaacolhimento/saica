# ⚠️ PROTEÇÃO - CARD E MENU "GESTÃO DE EMPRESAS"

## 🚨 NÃO MEXER - APENAS MASTER PODE VER

Este documento protege a lógica que esconde o card "Gestão de Empresas" e o menu "Empresas" para usuários admin.

---

## 📋 COMPORTAMENTO ESPERADO

### Master:
- ✅ Vê o card "Gestão de Empresas" no Dashboard
- ✅ Vê o menu "Empresas" no sidebar

### Admin:
- ❌ NÃO vê o card "Gestão de Empresas" no Dashboard
- ❌ NÃO vê o menu "Empresas" no sidebar

---

## 🔒 ARQUIVOS PROTEGIDOS

### 1. `project/src/pages/admin/Dashboard.tsx`

#### ⚠️ NÃO ALTERAR:
- **Linhas 19-22**: Estados e detecção de `isMaster`
- **Linhas 23-31**: Módulo "Gestão de Empresas" com `masterOnly: true`
- **Linhas 112-130**: Filtro `.filter(module => { if (module.masterOnly) return isMaster; return true; })`

#### Lógica Crítica:
```typescript
// ⚠️ CRÍTICO: Detecção de master
const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';

const modules = [
  {
    title: 'Gestão de Empresas',
    masterOnly: true // ⚠️ CRÍTICO: Apenas master pode ver
  },
  // ... outros módulos
];

// ⚠️ CRÍTICO: Filtrar cards baseado em isMaster
{modules
  .filter(module => {
    if (module.masterOnly) {
      return isMaster;
    }
    return true;
  })
  .map((module, index) => (...))}
```

---

### 2. `project/src/layouts/AdminLayout.tsx`

#### ⚠️ NÃO ALTERAR:
- **Linhas 20-33**: Estados e detecção de `isMaster`
- **Linha 25**: Menu item "Empresas" com `masterOnly: true`
- **Linhas 55-65**: Filtro `.filter(item => { if (item.masterOnly) return isMaster; return true; })`

#### Lógica Crítica:
```typescript
// ⚠️ CRÍTICO: Detecção de master
const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
  { icon: Home, label: 'Empresas', route: '/admin/empresas', masterOnly: true }, // ⚠️ CRÍTICO
  // ... outros itens
];

// ⚠️ CRÍTICO: Filtrar menu baseado em isMaster
{menuItems
  .filter(item => {
    if (item.masterOnly) {
      return isMaster;
    }
    return true;
  })
  .map((item, index) => (...))}
```

---

## ⚠️ AVISOS CRÍTICOS

### NÃO FAZER:
1. ❌ Remover `masterOnly: true` do card "Gestão de Empresas"
2. ❌ Remover `masterOnly: true` do menu "Empresas"
3. ❌ Remover o filtro `.filter()` que verifica `masterOnly`
4. ❌ Alterar a lógica de `isMaster` sem testar
5. ❌ Renderizar todos os módulos/itens sem filtrar

### FAZER ANTES DE ALTERAR:
1. ✅ Testar como Master (deve ver)
2. ✅ Testar como Admin (NÃO deve ver)
3. ✅ Verificar se o filtro está funcionando

---

## ✅ TESTES DE VALIDAÇÃO

### Teste 1: Master
1. Login como `saicaacolhimento2025@gmail.com`
2. Ir para Dashboard
3. ✅ Deve ver o card "Gestão de Empresas"
4. ✅ Deve ver o menu "Empresas" no sidebar

### Teste 2: Admin
1. Login como admin qualquer
2. Ir para Dashboard
3. ❌ NÃO deve ver o card "Gestão de Empresas"
4. ❌ NÃO deve ver o menu "Empresas" no sidebar

---

## 📅 DATA DA ÚLTIMA CORREÇÃO

**Data**: 2025-01-07
**Status**: ✅ FUNCIONANDO CORRETAMENTE
**Solução**: Filtro baseado em `isMaster` e propriedade `masterOnly`

---

## 🚫 PROTEÇÃO

**NÃO ALTERAR ESTAS LÓGICAS SEM:**
1. Autorização explícita do usuário
2. Testes completos como Master e Admin
3. Verificação de que a mudança não quebra o comportamento esperado

**ESTA LÓGICA FOI TESTADA E ESTÁ FUNCIONANDO. NÃO QUEBRAR.**

