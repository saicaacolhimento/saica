# 🚀 Resumo Rápido - Deploy SAICA

## 📝 Checklist Pré-Deploy

- [ ] Tenho conta no Netlify
- [ ] Tenho conta no Render  
- [ ] Tenho projeto Supabase configurado
- [ ] Tenho acesso ao DNS do domínio saica.com.br
- [ ] Tenho as credenciais do Supabase (URL, anon key, service role key)

---

## ⚡ Deploy Rápido (5 passos)

### 1️⃣ Backend no Render (10 min)
1. Acesse [render.com](https://render.com/) → New Web Service
2. Conecte repositório GitHub → `saica`
3. Configure:
   - Root Directory: `project/backend`
   - Build: `npm install`
   - Start: `npm start`
4. Adicione variáveis de ambiente:
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   CORS_ORIGIN=https://saica.com.br
   ```
5. Deploy!

### 2️⃣ Frontend no Netlify (5 min)
1. Acesse [netlify.com](https://www.netlify.com/) → Add new site
2. Conecte repositório GitHub → `saica`
3. Configure:
   - Base directory: `project`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Adicione variáveis de ambiente:
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
5. Deploy!

### 3️⃣ Configurar DNS (5 min)
No painel DNS do seu domínio:

**Para saica.com.br (Netlify):**
```
Tipo: A
Nome: @
Valor: [IP fornecido pelo Netlify]
```

**Para www.saica.com.br:**
```
Tipo: CNAME
Nome: www
Valor: saica.netlify.app
```

### 4️⃣ Aguardar Propagação (5 min - 48h)
- Use [whatsmydns.net](https://www.whatsmydns.net/) para verificar
- SSL será configurado automaticamente

### 5️⃣ Testar
- Acesse `https://saica.com.br`
- Teste login e funcionalidades

---

## 📚 Documentação Completa

Veja o arquivo `DEPLOY_GUIA_COMPLETO.md` para instruções detalhadas passo a passo.

---

## 🆘 Problemas Comuns

**"Variáveis não configuradas"**
→ Verifique se adicionou no painel (Netlify/Render)

**"CORS error"**
→ Verifique `CORS_ORIGIN` no Render

**"Site não carrega"**
→ Verifique logs no Netlify

**"DNS não propagou"**
→ Aguarde até 48h ou verifique registros DNS

---

**Última atualização:** 2025-01-07

