# 🚀 Guia Completo de Deploy - SAICA

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:

- ✅ Conta no [Netlify](https://www.netlify.com/) (gratuita)
- ✅ Conta no [Render](https://render.com/) (gratuita)
- ✅ Conta no [Supabase](https://supabase.com/) (gratuita)
- ✅ Acesso ao painel de DNS do domínio `saica.com.br`
- ✅ Repositório no GitHub conectado ao projeto
- ✅ Credenciais do Supabase (URL e chaves)

---

## 📦 PARTE 1: Preparação do Código

### ✅ Passo 1.1: Verificar Estrutura do Projeto

Certifique-se de que a estrutura está assim:
```
saica/
├── project/
│   ├── src/          # Frontend React
│   ├── backend/      # Backend Express
│   ├── netlify.toml  # Config Netlify
│   └── render.yaml   # Config Render
└── README.md
```

### ✅ Passo 1.2: Verificar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `project/` para testar localmente:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

**⚠️ IMPORTANTE:** Não commite o arquivo `.env` no Git!

---

## 🗄️ PARTE 2: Configuração do Supabase

### ✅ Passo 2.1: Verificar Projeto Supabase

1. Acesse [Supabase Dashboard](https://app.supabase.com/)
2. Selecione seu projeto (ou crie um novo)
3. Vá em **Settings > API**
4. Anote as seguintes informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public key** (chave anônima)
   - **service_role secret key** (chave de serviço - ⚠️ mantenha segredo!)

### ✅ Passo 2.2: Configurar RLS e Políticas

Certifique-se de que todas as políticas RLS estão configuradas corretamente no Supabase.

### ✅ Passo 2.3: Configurar Storage (se usar)

Se a aplicação usa upload de arquivos, configure as políticas de storage no Supabase.

---

## 🌐 PARTE 3: Deploy do Backend no Render

### ✅ Passo 3.1: Criar Conta no Render

1. Acesse [render.com](https://render.com/)
2. Clique em **Sign Up** e faça login com GitHub
3. Autorize o acesso ao seu repositório

### ✅ Passo 3.2: Criar Novo Web Service

1. No dashboard do Render, clique em **New +** > **Web Service**
2. Conecte seu repositório GitHub
3. Selecione o repositório `saica`
4. Configure:
   - **Name:** `saica-backend`
   - **Region:** Escolha a mais próxima (ex: `Oregon (US West)`)
   - **Branch:** `main`
   - **Root Directory:** `project/backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** `Free` (ou `Starter` se precisar de mais recursos)

### ✅ Passo 3.3: Configurar Variáveis de Ambiente no Render

No painel do serviço, vá em **Environment** e adicione:

```
NODE_ENV = production
PORT = 3333
SUPABASE_URL = https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY = sua_chave_service_role_aqui
CORS_ORIGIN = https://saica.com.br
```

**⚠️ IMPORTANTE:** Use a `SUPABASE_SERVICE_ROLE_KEY`, não a anon key!

### ✅ Passo 3.4: Deploy do Backend

1. Clique em **Create Web Service**
2. Aguarde o build e deploy (pode levar 5-10 minutos)
3. Anote a URL gerada (ex: `https://saica-backend.onrender.com`)

### ✅ Passo 3.5: Configurar Domínio Personalizado (Opcional)

Se quiser usar `api.saica.com.br`:

1. No painel do serviço, vá em **Settings** > **Custom Domains**
2. Clique em **Add Custom Domain**
3. Digite: `api.saica.com.br`
4. Render mostrará um registro DNS para adicionar
5. **Aguarde a próxima parte** para configurar DNS

---

## 🎨 PARTE 4: Deploy do Frontend no Netlify

### ✅ Passo 4.1: Criar Conta no Netlify

1. Acesse [netlify.com](https://www.netlify.com/)
2. Clique em **Sign up** e faça login com GitHub
3. Autorize o acesso ao seu repositório

### ✅ Passo 4.2: Criar Novo Site

1. No dashboard do Netlify, clique em **Add new site** > **Import an existing project**
2. Conecte seu repositório GitHub
3. Selecione o repositório `saica`
4. Configure:
   - **Base directory:** `project`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Branch to deploy:** `main`

### ✅ Passo 4.3: Configurar Variáveis de Ambiente no Netlify

Antes de fazer o deploy, configure as variáveis:

1. No painel do site, vá em **Site settings** > **Environment variables**
2. Clique em **Add variable** e adicione:

```
VITE_SUPABASE_URL = https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY = sua_chave_anonima_aqui
```

**⚠️ IMPORTANTE:** Use a `VITE_SUPABASE_ANON_KEY` (anon key), não a service role!

### ✅ Passo 4.4: Fazer Deploy

1. Clique em **Deploy site**
2. Aguarde o build e deploy (pode levar 3-5 minutos)
3. Anote a URL gerada (ex: `https://random-name-123.netlify.app`)

### ✅ Passo 4.5: Testar o Deploy

1. Acesse a URL gerada pelo Netlify
2. Verifique se a aplicação carrega corretamente
3. Teste o login e funcionalidades básicas

---

## 🔗 PARTE 5: Configuração do Domínio saica.com.br

### ✅ Passo 5.1: Acessar Painel de DNS

1. Acesse o painel do seu provedor de domínio (ex: Registro.br, GoDaddy, etc.)
2. Vá para a seção de **DNS** ou **Zona DNS**

### ✅ Passo 5.2: Configurar DNS para Frontend (Netlify)

1. No painel do Netlify, vá em **Site settings** > **Domain management**
2. Clique em **Add custom domain**
3. Digite: `saica.com.br`
4. Netlify mostrará instruções de DNS:
   - **Tipo:** `A` ou `CNAME`
   - **Nome:** `@` ou `saica.com.br`
   - **Valor:** IP ou hostname fornecido pelo Netlify

5. No painel de DNS do seu domínio, adicione o registro conforme instruções do Netlify

**Exemplo:**
```
Tipo: A
Nome: @
Valor: 75.2.60.5 (IP do Netlify - verifique no painel)
TTL: 3600
```

Para `www.saica.com.br`:
```
Tipo: CNAME
Nome: www
Valor: saica.netlify.app
TTL: 3600
```

### ✅ Passo 5.3: Configurar DNS para Backend (Render) - Opcional

Se configurou domínio personalizado no Render (`api.saica.com.br`):

1. No painel de DNS, adicione:
```
Tipo: CNAME
Nome: api
Valor: saica-backend.onrender.com (ou o hostname fornecido pelo Render)
TTL: 3600
```

### ✅ Passo 5.4: Aguardar Propagação DNS

- ⏱️ Pode levar de 5 minutos a 48 horas
- ✅ Use [whatsmydns.net](https://www.whatsmydns.net/) para verificar propagação
- ✅ Teste acessando `saica.com.br` no navegador

### ✅ Passo 5.5: Configurar SSL/HTTPS

Tanto Netlify quanto Render configuram SSL automaticamente:
- ✅ Netlify: SSL automático via Let's Encrypt
- ✅ Render: SSL automático via Let's Encrypt
- ⏱️ Pode levar alguns minutos após a propagação DNS

---

## 🔄 PARTE 6: Atualizar Código para Produção

### ✅ Passo 6.1: Atualizar CORS no Backend

Se necessário, atualize `project/backend/index.js` para incluir o domínio de produção.

### ✅ Passo 6.2: Atualizar URLs no Frontend

Se o frontend faz chamadas para o backend, atualize a URL da API:

```typescript
// Exemplo: src/lib/api.ts
const API_URL = import.meta.env.VITE_API_URL || 'https://api.saica.com.br';
```

### ✅ Passo 6.3: Commit e Push

```bash
git add .
git commit -m "feat: configura deploy para produção"
git push origin main
```

Tanto Netlify quanto Render fazem deploy automático ao detectar push na branch `main`.

---

## ✅ PARTE 7: Verificação Final

### Checklist de Verificação:

- [ ] Backend deployado no Render e respondendo em `/health`
- [ ] Frontend deployado no Netlify e carregando corretamente
- [ ] Domínio `saica.com.br` apontando para Netlify
- [ ] SSL/HTTPS funcionando (cadeado verde no navegador)
- [ ] Login funcionando
- [ ] Todas as funcionalidades testadas
- [ ] Variáveis de ambiente configuradas corretamente
- [ ] CORS configurado corretamente

---

## 🐛 Troubleshooting

### Problema: "Variáveis de ambiente não configuradas"

**Solução:**
- Verifique se as variáveis estão configuradas no painel (Netlify/Render)
- Verifique se os nomes estão corretos (ex: `VITE_SUPABASE_URL` com `VITE_` no início)
- Faça um novo deploy após adicionar variáveis

### Problema: "CORS error"

**Solução:**
- Verifique se `CORS_ORIGIN` no Render está configurado como `https://saica.com.br`
- Verifique se o backend está permitindo o domínio correto

### Problema: "Site não carrega"

**Solução:**
- Verifique os logs no Netlify (Deploys > [último deploy] > Deploy log)
- Verifique se o build está passando (`npm run build` localmente)
- Verifique se o diretório `publish` está correto (`dist`)

### Problema: "DNS não propagou"

**Solução:**
- Aguarde até 48 horas
- Verifique se os registros DNS estão corretos
- Use [whatsmydns.net](https://www.whatsmydns.net/) para verificar

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Netlify e Render
2. Verifique o console do navegador (F12)
3. Verifique as variáveis de ambiente
4. Teste localmente primeiro

---

**Última atualização:** 2025-01-07

