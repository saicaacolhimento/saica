# Documentação Completa - SAICA (Sistema de Acompanhamento e Integração de Crianças Acolhidas)

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura do Projeto](#estrutura-do-projeto)
4. [Funcionalidades Implementadas](#funcionalidades-implementadas)
5. [Banco de Dados](#banco-de-dados)
6. [Autenticação e Segurança](#autenticação-e-segurança)
7. [Rotas da Aplicação](#rotas-da-aplicação)
8. [Serviços e APIs](#serviços-e-apis)
9. [Componentes Principais](#componentes-principais)
10. [Migrations e Configurações](#migrations-e-configurações)
11. [Status das Funcionalidades](#status-das-funcionalidades)

---

## 🎯 Visão Geral

O SAICA é uma plataforma web desenvolvida para auxiliar na gestão e acompanhamento de crianças e adolescentes acolhidos em abrigos, integrando diferentes órgãos como CRAS, CAPS, CREAS e Conselho Tutelar.

### Objetivo Principal
Facilitar a integração entre diferentes instituições que trabalham com crianças e adolescentes em situação de acolhimento, permitindo o compartilhamento de informações e o acompanhamento completo do histórico de cada acolhido.

---

## 🛠 Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Vite** - Build tool e dev server
- **React Router** - Roteamento de páginas
- **React Query (TanStack Query)** - Gerenciamento de estado e cache de dados
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes UI reutilizáveis
- **Lucide React** - Ícones

### Backend
- **Supabase** - Backend as a Service (BaaS)
  - PostgreSQL - Banco de dados
  - Row Level Security (RLS) - Segurança em nível de linha
  - Storage - Armazenamento de arquivos
  - Auth - Autenticação de usuários

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript/TypeScript
- **PostCSS** - Processador CSS
- **Git** - Controle de versão

---

## 📁 Estrutura do Projeto

```
project/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes UI (shadcn/ui)
│   │   ├── Sidebar.tsx       # Barra lateral de navegação
│   │   ├── Banner.tsx        # Banner da página inicial
│   │   └── ...
│   │
│   ├── features/             # Módulos da aplicação
│   │   ├── acolhidos/        # Gestão de acolhidos
│   │   ├── shelters/         # Gestão de empresas/abrigos
│   │   ├── auth/             # Autenticação
│   │   ├── agendamentos/     # Agendamentos
│   │   ├── configuracoes/    # Configurações
│   │   └── ...
│   │
│   ├── pages/                # Páginas principais
│   │   ├── admin/            # Páginas administrativas
│   │   │   ├── Dashboard.tsx
│   │   │   ├── AcolhidoCadastroEdicao.tsx
│   │   │   ├── Usuarios.tsx
│   │   │   └── Financeiro.tsx
│   │   └── Index.tsx
│   │
│   ├── services/             # Serviços de API
│   │   ├── acolhido.ts       # Serviço de acolhidos
│   │   ├── shelter.ts       # Serviço de empresas/abrigos
│   │   ├── auth.ts           # Serviço de autenticação
│   │   ├── documento.ts      # Serviço de documentos
│   │   └── ...
│   │
│   ├── types/                # Tipos TypeScript
│   │   ├── acolhido.ts
│   │   ├── shelter.ts
│   │   └── ...
│   │
│   ├── hooks/                # Hooks personalizados
│   │   ├── useAcolhido.ts
│   │   ├── useDocumento.ts
│   │   └── ...
│   │
│   ├── layouts/              # Layouts da aplicação
│   │   ├── AdminLayout.tsx
│   │   ├── AuthLayout.tsx
│   │   └── MainLayout.tsx
│   │
│   ├── routes/               # Configuração de rotas
│   │   └── index.tsx
│   │
│   ├── contexts/             # Contextos React
│   │   └── AuthContext.tsx
│   │
│   └── config/               # Configurações
│       └── supabase.ts
│
├── supabase/
│   └── migrations/           # Migrations do banco de dados
│
└── docs/                     # Documentação
```

---

## ✅ Funcionalidades Implementadas

### 1. **Gestão de Empresas/Abrigos** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Listagem de empresas com paginação
- ✅ Criação de novas empresas
- ✅ Edição de empresas existentes
- ✅ Visualização de detalhes da empresa
- ✅ Upload de logo da empresa
- ✅ Busca e filtros
- ✅ Validação de campos obrigatórios (nome, telefone, CNPJ)

#### Campos da Empresa:
- Nome, CNPJ, Telefone, Telefone do Órgão
- Tipo (ABRIGO, CREAS, CRAS, CAPS, CONSELHO_TUTELAR, OUTRO)
- Endereço completo (CEP, Rua, Número, Bairro, Cidade, Estado)
- Logo da empresa

#### Arquivos Principais:
- `src/features/shelters/pages/ShelterList.tsx` - Listagem
- `src/features/shelters/pages/EditShelter.tsx` - Edição
- `src/features/shelters/pages/ShelterDetails.tsx` - Detalhes
- `src/services/shelter.ts` - Serviço de API

---

### 2. **Gestão de Usuários** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Listagem de usuários admin com contagem de usuários por empresa
- ✅ Criação de novos usuários
- ✅ Edição de usuários existentes
- ✅ Exclusão de usuários
- ✅ Visualização de detalhes do usuário
- ✅ Vinculação de usuário a empresa
- ✅ Sistema de roles (admin, master, user)

#### Campos do Usuário:
- Nome, Email, Senha
- Role (admin, master, user)
- Cargo
- Empresa vinculada
- Status (ativo/inativo)

#### Arquivos Principais:
- `src/pages/admin/Usuarios.tsx` - Listagem e gestão
- `src/services/auth.ts` - Serviço de autenticação e usuários
- `supabase/migrations/20250101000001_create_get_admins_function.sql` - Função SQL para listar admins

---

### 3. **Gestão de Acolhidos (Crianças)** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Listagem de acolhidos com paginação
- ✅ Criação de novos acolhidos
- ✅ Edição de acolhidos existentes
- ✅ Visualização de detalhes do acolhido
- ✅ Upload de fotos (mínimo 1, máximo 5)
- ✅ Upload de documentos
- ✅ Validação inteligente de fotos (obrigatória apenas se não houver fotos salvas)
- ✅ Mapeamento automático de empresa_id para abrigo_id
- ✅ Preservação da empresa selecionada ao editar

#### Campos do Acolhido:

**Dados Pessoais:**
- Nome, Data de Nascimento, Gênero, CPF, RG
- Endereço, Telefone
- Tipo Sanguíneo, Alergias, Medicamentos, Deficiências

**Dados Escolares:**
- Escola, Série, Turno
- Observações Educacionais
- Histórico Escolar
- Escola Atual, Telefone da Escola

**Dados Familiares:**
- Nome da Mãe, Nome do Pai
- Possui Irmãos, Número de Irmãos, Nomes dos Irmãos
- Endereço da Família, Telefone da Família

**Dados de Responsável:**
- Nome do Responsável, Parentesco
- CPF do Responsável, Telefone do Responsável
- Endereço do Responsável

**Dados de Acolhimento:**
- Data de Entrada, Motivo do Acolhimento
- Técnico de Referência
- CAPS Frequentado
- CREAS, Técnico CREAS
- CRAS, Técnico CRAS
- Número de Acolhimentos
- Instituições Anteriores
- Processo Judicial

**Dados Médicos:**
- Laudo Médico, Receita de Remédios
- Diagnóstico Médico
- Uso de Medicação, Uso de Drogas

**Fotos e Documentos:**
- Fotos do perfil (mínimo 1, máximo 5)
- Documentos anexados

#### Arquivos Principais:
- `src/pages/admin/AcolhidoCadastroEdicao.tsx` - Cadastro/Edição
- `src/features/acolhidos/pages/AcolhidoList.tsx` - Listagem
- `src/features/acolhidos/pages/AcolhidoDetails.tsx` - Detalhes
- `src/services/acolhido.ts` - Serviço de API
- `src/types/acolhido.ts` - Tipos TypeScript

---

### 4. **Sistema de Autenticação** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Login de usuários
- ✅ Logout
- ✅ Recuperação de senha
- ✅ Proteção de rotas (PrivateRoute)
- ✅ Contexto de autenticação (AuthContext)
- ✅ Verificação de sessão

#### Arquivos Principais:
- `src/features/auth/pages/Login.tsx` - Página de login
- `src/services/auth.ts` - Serviço de autenticação
- `src/contexts/AuthContext.tsx` - Contexto de autenticação
- `src/components/PrivateRoute.tsx` - Proteção de rotas

---

### 5. **Dashboard Administrativo** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Visão geral do sistema
- ✅ Cards de navegação para diferentes módulos
- ✅ Acesso rápido às principais funcionalidades

#### Módulos Disponíveis:
- Gestão de Empresas
- Gestão de Usuários
- Gestão de Acolhidos
- Agenda
- Gestão Financeira
- Documentos
- Atividades
- Configurações

#### Arquivos Principais:
- `src/pages/admin/Dashboard.tsx` - Dashboard principal

---

### 6. **Agendamentos** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Listagem de agendamentos
- ✅ Criação de novos agendamentos
- ✅ Edição de agendamentos
- ✅ Visualização de detalhes

#### Arquivos Principais:
- `src/features/agendamentos/pages/AgendamentoList.tsx`
- `src/services/agendamento.ts`

---

### 7. **Configurações** ✅ FUNCIONANDO

#### Funcionalidades:
- ✅ Listagem de configurações
- ✅ Criação de novas configurações
- ✅ Edição de configurações existentes

#### Arquivos Principais:
- `src/features/configuracoes/pages/ConfiguracaoList.tsx`
- `src/features/configuracoes/pages/ConfiguracaoCreate.tsx`
- `src/features/configuracoes/pages/ConfiguracaoEdit.tsx`

---

### 8. **Gestão Financeira** ✅ PARCIALMENTE IMPLEMENTADO

#### Funcionalidades:
- ✅ Página inicial do módulo financeiro
- ⏳ Doações (em desenvolvimento)
- ⏳ Despesas (em desenvolvimento)
- ⏳ Estoque (em desenvolvimento)
- ⏳ Relatórios Financeiros (em desenvolvimento)

#### Arquivos Principais:
- `src/pages/admin/Financeiro.tsx`

---

## 🗄 Banco de Dados

### Tabelas Principais

#### 1. **empresas** (Abrigos/Empresas)
```sql
- id (UUID)
- nome (TEXT)
- cnpj (TEXT)
- telefone (TEXT)
- telefone_orgao (TEXT)
- tipo (TEXT) - ABRIGO, CREAS, CRAS, CAPS, etc.
- endereco completo
- logo_url (TEXT)
- created_at, updated_at
```

#### 2. **usuarios**
```sql
- id (UUID)
- nome (TEXT)
- email (TEXT)
- role (TEXT) - admin, master, user
- cargo (TEXT)
- empresa_id (UUID) - FK para empresas
- status (TEXT) - ativo, inativo
- created_at, updated_at
```

#### 3. **acolhidos**
```sql
- id (UUID)
- nome (TEXT)
- data_nascimento (DATE)
- nome_mae (TEXT)
- cpf, rg, endereco, telefone
- abrigo_id (UUID) - FK para empresas
- status (TEXT) - ativo, inativo
- genero, tipo_sanguineo
- alergias, medicamentos, deficiencias
- escola, serie, turno
- observacoes_educacionais
- nome_responsavel, parentesco_responsavel
- cpf_responsavel, telefone_responsavel
- endereco_responsavel
- data_entrada, motivo_acolhimento
- tecnico_referencia
- caps_frequentado
- creas, tecnico_creas
- cras, tecnico_cras
- historico_escolar
- laudo_medico, receita_remedio
- nome_pai
- possui_irmaos, numero_irmaos, nomes_irmaos
- endereco_familia, telefone_familia
- diagnostico_medico
- uso_medicacao, uso_drogas
- escola_atual, telefone_escola
- numero_acolhimentos
- instituicoes_anteriores
- processo_judicial
- created_at, updated_at
```

#### 4. **acolhido_fotos**
```sql
- id (UUID)
- acolhido_id (UUID) - FK para acolhidos
- url (TEXT)
- tipo (TEXT) - foto_perfil, foto_documento
- created_at, updated_at
```

#### 5. **documentos**
```sql
- id (UUID)
- acolhido_id (UUID) - FK para acolhidos
- tipo (TEXT)
- nome (TEXT)
- url (TEXT)
- descricao (TEXT)
- status (TEXT) - ativo, inativo
- created_by (UUID) - FK para auth.users
- created_at, updated_at
```

#### 6. **agendamentos**
```sql
- id (UUID)
- titulo (TEXT)
- descricao (TEXT)
- data_hora (TIMESTAMP)
- tipo (TEXT) - consulta, exame, procedimento, outros
- status (TEXT) - agendado, confirmado, cancelado, concluido
- acolhido_id (UUID) - FK para acolhidos
- profissional_id (UUID) - FK para usuarios
- local (TEXT)
- observacoes (TEXT)
- created_at, updated_at
```

#### 7. **master_admin**
```sql
- id (UUID) - FK para auth.users
- created_at
```

---

## 🔐 Autenticação e Segurança

### Row Level Security (RLS)

Todas as tabelas principais têm RLS habilitado com políticas que permitem:

#### **acolhidos**
- Master admin: Acesso total
- Usuários: Podem ver e gerenciar acolhidos da sua empresa

#### **acolhido_fotos**
- Usuários autenticados: Podem inserir, visualizar, atualizar e deletar fotos

#### **documentos**
- Usuários autenticados: Podem inserir, visualizar, atualizar e deletar documentos

#### **empresas**
- Master admin: Acesso total
- Usuários: Podem ver empresas da sua organização

#### **usuarios**
- Master admin: Acesso total
- Admins: Podem gerenciar usuários da sua empresa

---

## 🛣 Rotas da Aplicação

### Rotas Públicas
- `/` - Página inicial (AuthLayout)
- `/login` - Página de login

### Rotas Administrativas (Protegidas)
- `/admin` - Redireciona para `/admin/dashboard`
- `/admin/dashboard` - Dashboard principal

#### Empresas
- `/admin/empresas` - Listagem de empresas
- `/admin/empresas/:id` - Detalhes da empresa
- `/admin/empresas/:id/editar` - Editar empresa

#### Acolhidos (Crianças)
- `/admin/criancas` - Listagem de acolhidos
- `/admin/criancas/novo` - Cadastrar novo acolhido
- `/admin/criancas/:id` - Editar acolhido
- `/admin/criancas/:id/visualizar` - Visualizar detalhes do acolhido

#### Usuários
- `/admin/usuarios` - Listagem de usuários admin

#### Outros Módulos
- `/admin/agenda` - Agendamentos
- `/admin/configuracoes` - Configurações
- `/admin/financeiro` - Gestão financeira
- `/admin/relatorios` - Relatórios (em desenvolvimento)
- `/admin/documentos` - Documentos (em desenvolvimento)
- `/admin/atividades` - Atividades (em desenvolvimento)

---

## 🔌 Serviços e APIs

### 1. **acolhidoService** (`src/services/acolhido.ts`)
```typescript
- getAcolhidos(page, perPage) - Lista acolhidos com paginação
- getAcolhidoById(id) - Busca acolhido por ID
- createAcolhido(data) - Cria novo acolhido
- updateAcolhido(id, data) - Atualiza acolhido
- deleteAcolhido(id) - Deleta acolhido
- getAcolhidoFotos(acolhidoId) - Lista fotos do acolhido
- createAcolhidoFoto(data) - Adiciona foto ao acolhido
- uploadFoto(file, acolhidoId, tipo) - Faz upload de foto
```

### 2. **shelterService** (`src/services/shelter.ts`)
```typescript
- getShelters(page, perPage) - Lista empresas com paginação
- getShelterById(id) - Busca empresa por ID
- createShelter(data) - Cria nova empresa
- updateShelter(id, data) - Atualiza empresa
- deleteShelter(id) - Deleta empresa
- uploadLogo(file, shelterId) - Faz upload de logo
- getSheltersByIds(ids) - Busca múltiplas empresas por IDs
```

### 3. **authService** (`src/services/auth.ts`)
```typescript
- login(email, password) - Login de usuário
- logout() - Logout
- getCurrentUser() - Busca usuário atual
- getAllAdmins() - Lista todos os admins (com contagem de usuários)
- createUser(data) - Cria novo usuário
- updateUser(id, data) - Atualiza usuário
- deleteUser(id) - Deleta usuário
```

### 4. **documentoService** (`src/services/documento.ts`)
```typescript
- getDocumentos() - Lista documentos
- getDocumentosByAcolhido(acolhidoId) - Lista documentos do acolhido
- createDocumento(data) - Cria novo documento
- updateDocumento(id, data) - Atualiza documento
- deleteDocumento(id) - Deleta documento
- uploadDocumento(file, acolhidoId) - Faz upload de documento
```

### 5. **agendamentoService** (`src/services/agendamento.ts`)
```typescript
- getAgendamentos() - Lista agendamentos
- getAgendamentoById(id) - Busca agendamento por ID
- createAgendamento(data) - Cria novo agendamento
- updateAgendamento(id, data) - Atualiza agendamento
- deleteAgendamento(id) - Deleta agendamento
```

---

## 🧩 Componentes Principais

### Layouts
- **AdminLayout** - Layout administrativo com sidebar
- **AuthLayout** - Layout de autenticação
- **MainLayout** - Layout principal público

### Componentes Reutilizáveis
- **Sidebar** - Barra lateral de navegação
- **Banner** - Banner da página inicial
- **Modal** - Modal genérico
- **AcolhimentoSection** - Seção de dados de acolhimento

### Componentes UI (shadcn/ui)
- Button, Input, Table, Dialog, Toast
- Calendar, Select, Tabs
- E outros componentes do shadcn/ui

---

## 📦 Migrations e Configurações

### Migrations Importantes

#### 1. **20251112205921_setup_completo.sql**
- Criação inicial de todas as tabelas
- Políticas RLS básicas
- Tabelas: empresas, usuarios, acolhidos, acolhido_fotos, documentos, agendamentos

#### 2. **20250102000000_add_campos_faltantes_acolhidos.sql**
- Adiciona 16 campos faltantes na tabela acolhidos:
  - cras, tecnico_cras
  - historico_escolar, laudo_medico, receita_remedio
  - nome_pai
  - possui_irmaos, numero_irmaos, nomes_irmaos
  - endereco_familia, telefone_familia
  - diagnostico_medico
  - uso_medicacao, uso_drogas
  - escola_atual, telefone_escola

#### 3. **20250102000005_COMPLETA_TUDO.sql** ⭐ **EXECUTAR ESTA**
- Migration completa que:
  - Adiciona todos os campos faltantes em acolhidos
  - Adiciona coluna status em documentos
  - Remove todas as políticas RLS antigas
  - Cria políticas RLS permissivas para acolhido_fotos e documentos

#### 4. **20250101000001_create_get_admins_function.sql**
- Cria função SQL `get_admins_with_user_count()` para listar admins com contagem de usuários

---

## ✅ Status das Funcionalidades

### ✅ Totalmente Funcionando

1. **Autenticação**
   - ✅ Login
   - ✅ Logout
   - ✅ Recuperação de senha
   - ✅ Proteção de rotas

2. **Gestão de Empresas**
   - ✅ CRUD completo
   - ✅ Upload de logo
   - ✅ Validações

3. **Gestão de Usuários**
   - ✅ CRUD completo
   - ✅ Listagem com contagem
   - ✅ Vinculação a empresas

4. **Gestão de Acolhidos**
   - ✅ CRUD completo
   - ✅ Upload de fotos (mínimo 1, máximo 5)
   - ✅ Upload de documentos
   - ✅ Validação inteligente de fotos
   - ✅ Preservação de empresa ao editar
   - ✅ Todos os campos do formulário

5. **Dashboard**
   - ✅ Navegação para módulos
   - ✅ Cards informativos

6. **Agendamentos**
   - ✅ Listagem
   - ✅ CRUD básico

7. **Configurações**
   - ✅ CRUD completo

### ⏳ Em Desenvolvimento

1. **Gestão Financeira**
   - ⏳ Doações
   - ⏳ Despesas
   - ⏳ Estoque
   - ⏳ Relatórios Financeiros

2. **Relatórios**
   - ⏳ Geração de relatórios
   - ⏳ Exportação

3. **Documentos**
   - ⏳ Visualização completa
   - ⏳ Gestão avançada

4. **Atividades**
   - ⏳ Cadastro de atividades
   - ⏳ Acompanhamento

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Supabase
- Git instalado

### Instalação

```bash
# 1. Clone o repositório
git clone <URL_DO_REPOSITORIO>
cd saica/project

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Crie um arquivo .env com:
VITE_SUPABASE_URL=sua_url_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon

# 4. Execute as migrations no Supabase
# Acesse o Supabase Dashboard > SQL Editor
# Execute o arquivo: supabase/migrations/20250102000005_COMPLETA_TUDO.sql

# 5. Inicie o servidor de desenvolvimento
npm run dev
```

### Build para Produção

```bash
npm run build
```

---

## 📝 Notas Importantes

### Configuração do Supabase

1. **Storage Buckets Necessários:**
   - `empresas` - Para logos das empresas
   - `acolhidos` - Para fotos dos acolhidos
   - `documentos` - Para documentos anexados

2. **Políticas RLS:**
   - As políticas estão configuradas para permitir acesso a usuários autenticados
   - Master admin tem acesso total
   - Usuários podem acessar apenas dados da sua empresa

3. **Funções SQL:**
   - `get_admins_with_user_count()` - Lista admins com contagem de usuários

### Validações Implementadas

1. **Empresas:**
   - Nome obrigatório
   - Telefone ou Telefone do Órgão obrigatório
   - CNPJ válido

2. **Acolhidos:**
   - Nome obrigatório
   - Data de nascimento obrigatória
   - Gênero obrigatório
   - Fotos: mínimo 1 (apenas se não houver fotos salvas), máximo 5 no total

3. **Usuários:**
   - Nome, email e senha obrigatórios
   - Role obrigatória

---

## 🔧 Correções e Melhorias Recentes

### Correções Aplicadas

1. **Campo telefone em empresas:**
   - ✅ Corrigido erro "null value in column telefone"
   - ✅ Validação para telefone ou telefone_orgao

2. **Upload de logo:**
   - ✅ Tratamento de erro quando bucket não existe
   - ✅ Não bloqueia criação da empresa se upload falhar

3. **Campos faltantes em acolhidos:**
   - ✅ Adicionados 16 campos que estavam no formulário mas não no banco

4. **RLS para fotos e documentos:**
   - ✅ Políticas RLS corrigidas para permitir inserção
   - ✅ Políticas permissivas para usuários autenticados

5. **Validação de fotos:**
   - ✅ Foto obrigatória apenas se não houver fotos salvas
   - ✅ Limite de 5 fotos no total (salvas + novas)

6. **Preservação de empresa ao editar:**
   - ✅ Mapeamento de abrigo_id para empresa_id
   - ✅ Empresa selecionada é mantida ao editar

7. **Coluna status em documentos:**
   - ✅ Adicionada coluna status na tabela documentos
   - ✅ Serviço atualizado para usar nome em vez de titulo

---

## 📚 Documentação Adicional

- `docs/arquitetura.md` - Arquitetura do sistema
- `docs/instalacao.md` - Guia de instalação
- `docs/manual-usuario.md` - Manual do usuário
- `docs/desenvolvimento.md` - Guia de desenvolvimento
- `LISTA_DE_PRIORIDADES.md` - Lista de prioridades do projeto

---

## 👥 Contribuindo

Para contribuir com o projeto, consulte o arquivo `docs/contribuicao.md`.

---

## 📄 Licença

[Especificar licença do projeto]

---

**Última atualização:** Janeiro 2025
**Versão:** 1.0.0

