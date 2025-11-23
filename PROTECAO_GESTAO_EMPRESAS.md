# ⚠️ PROTEÇÃO: Gestão de Empresas - APENAS MASTER

## 🚨 CRÍTICO - NÃO MODIFICAR SEM CUIDADO

O card "Gestão de Empresas" e o item do menu lateral "Empresas" devem aparecer **APENAS** para usuários **MASTER**.

**NÃO** devem aparecer para usuários **ADMIN**.

---

## 📍 Onde está implementado:

### 1. Dashboard (`src/pages/admin/Dashboard.tsx`)

**Card "Gestão de Empresas":**
```typescript
{
  title: 'Gestão de Empresas',
  description: 'Cadastro de empresas',
  route: '/admin/empresas',
  icon: Home,
  bgColor: 'bg-blue-100',
  iconColor: 'text-blue-600',
  masterOnly: true // ⚠️ APENAS MASTER PODE VER ESTE CARD
}
```

**Filtro aplicado:**
```typescript
{modules
  .filter(module => {
    // ⚠️ FILTRO CRÍTICO: Se masterOnly=true, só mostra para master
    if (module.masterOnly && !isMaster) return false;
    return true;
  })
  .map((module, index) => (
    // ... renderização do card
  ))}
```

### 2. Menu Lateral (`src/layouts/AdminLayout.tsx`)

**Item "Empresas":**
```typescript
{ icon: Home, label: 'Empresas', route: '/admin/empresas', show: isMaster }, // ⚠️ APENAS MASTER PODE VER
```

**Filtro aplicado:**
```typescript
{menuItems
  .filter(item => item.show) // ⚠️ FILTRO CRÍTICO: Só mostra itens com show=true
  .map((item, index) => (
    // ... renderização do menu item
  ))}
```

---

## ✅ Verificação de Master:

```typescript
// Verificar se é master
const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';
```

---

## 🚫 NÃO FAZER:

- ❌ **NÃO** remover a propriedade `masterOnly: true` do card
- ❌ **NÃO** remover o filtro `.filter(module => ...)` no Dashboard
- ❌ **NÃO** remover a propriedade `show: isMaster` do menu item
- ❌ **NÃO** remover o filtro `.filter(item => item.show)` no AdminLayout
- ❌ **NÃO** mudar `show: isMaster` para `show: true` no menu item
- ❌ **NÃO** adicionar "Gestão de Empresas" sem `masterOnly: true`

---

## ✅ SEMPRE FAZER:

- ✅ **SEMPRE** manter `masterOnly: true` no card "Gestão de Empresas"
- ✅ **SEMPRE** manter `show: isMaster` no menu item "Empresas"
- ✅ **SEMPRE** manter os filtros aplicados
- ✅ **SEMPRE** verificar se `isMaster` está sendo calculado corretamente

---

## 🔍 Como testar:

1. **Login como ADMIN:**
   - ✅ Card "Gestão de Empresas" **NÃO** deve aparecer
   - ✅ Item "Empresas" no menu lateral **NÃO** deve aparecer

2. **Login como MASTER:**
   - ✅ Card "Gestão de Empresas" **DEVE** aparecer
   - ✅ Item "Empresas" no menu lateral **DEVE** aparecer

---

## 📝 Histórico:

- **2025-01-07:** Implementado filtro definitivo após múltiplas regressões
- **Problema:** Card e menu apareciam para admins mesmo após correções
- **Solução:** Adicionado `masterOnly: true` e `show: isMaster` com filtros obrigatórios

---

**Última atualização:** 2025-01-07
**Status:** ✅ PROTEGIDO - NÃO MODIFICAR

