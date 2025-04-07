# Guia de Deploy do SAICA

## Visão Geral

O SAICA utiliza uma estratégia de deploy contínuo com múltiplos ambientes:

1. **Desenvolvimento**: Ambiente local para desenvolvimento
2. **Homologação**: Ambiente de testes e validação
3. **Staging**: Ambiente de pré-produção
4. **Produção**: Ambiente final para usuários

## Ambientes

### Desenvolvimento

```bash
# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env

# Inicie o servidor de desenvolvimento
npm run dev
```

### Homologação

```bash
# Build para homologação
npm run build:staging

# Deploy para homologação
npm run deploy:staging
```

### Staging

```bash
# Build para staging
npm run build:staging

# Deploy para staging
npm run deploy:staging
```

### Produção

```bash
# Build para produção
npm run build:prod

# Deploy para produção
npm run deploy:prod
```

## Configuração

### Variáveis de Ambiente

```env
# .env.production
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_API_URL=https://api.saica.com
VITE_APP_NAME=SAICA
VITE_APP_DESCRIPTION=Sistema de Acompanhamento de Indicadores de Controle Ambiental
```

### Build

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
});
```

### Otimização

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

### Netlify

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

## Monitoramento

### Logs

```typescript
// src/utils/logger.ts
import * as Sentry from '@sentry/react';

export function logError(error: Error, context?: Record<string, any>) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
}

export function logInfo(message: string, context?: Record<string, any>) {
  console.info(message);
  Sentry.addBreadcrumb({
    category: 'info',
    message,
    data: context,
  });
}
```

### Métricas

```typescript
// src/utils/metrics.ts
import * as Sentry from '@sentry/react';

export function trackPageView(path: string) {
  Sentry.addBreadcrumb({
    category: 'navigation',
    message: `Page View: ${path}`,
  });
}

export function trackEvent(name: string, properties?: Record<string, any>) {
  Sentry.addBreadcrumb({
    category: 'event',
    message: name,
    data: properties,
  });
}
```

### Alertas

```typescript
// src/utils/alerts.ts
import * as Sentry from '@sentry/react';

export function setupAlerts() {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      new Sentry.BrowserTracing(),
      new Sentry.Replay(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
```

## Backup

### Banco de Dados

```bash
# Backup do Supabase
supabase db dump -f backup.sql

# Restauração
supabase db restore backup.sql
```

### Arquivos

```bash
# Backup de arquivos
tar -czf uploads.tar.gz public/uploads/

# Restauração
tar -xzf uploads.tar.gz -C public/uploads/
```

## Segurança

### SSL/TLS

```nginx
# nginx.conf
server {
  listen 443 ssl;
  server_name saica.com.br;

  ssl_certificate /etc/letsencrypt/live/saica.com.br/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/saica.com.br/privkey.pem;
}
```

### Headers

```nginx
# nginx.conf
add_header X-Frame-Options "SAMEORIGIN";
add_header X-XSS-Protection "1; mode=block";
add_header X-Content-Type-Options "nosniff";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
```

## Performance

### Cache

```nginx
# nginx.conf
location /static/ {
  expires 1y;
  add_header Cache-Control "public, no-transform";
}

location / {
  proxy_cache_use_stale error timeout http_500 http_502 http_503 http_504;
  proxy_cache_valid 200 60m;
  proxy_cache_valid 404 1m;
}
```

### CDN

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|gif|svg|webp|ico)$/.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          return `assets/${ext}/[name]-[hash][extname]`;
        },
      },
    },
  },
});
```

## Manutenção

### Atualizações

```bash
# Atualize as dependências
npm update

# Verifique vulnerabilidades
npm audit

# Corrija vulnerabilidades
npm audit fix
```

### Limpeza

```bash
# Limpe o cache
npm cache clean --force

# Remova node_modules
rm -rf node_modules

# Remova builds antigos
rm -rf dist
```

### Logs

```bash
# Visualize logs do Netlify
netlify logs

# Visualize logs do Supabase
supabase logs
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Build**
   ```bash
   # Limpe o cache e reinstale
   rm -rf node_modules
   rm -rf dist
   npm cache clean --force
   npm install
   ```

2. **Erro de Deploy**
   ```bash
   # Verifique as credenciais
   netlify login
   netlify link
   ```

3. **Erro de Banco de Dados**
   ```bash
   # Verifique a conexão
   supabase status
   supabase db reset
   ```

### Monitoramento

1. **Métricas**
   - Tempo de resposta
   - Taxa de erro
   - Uso de CPU/Memória
   - Requisições/minuto

2. **Logs**
   - Erros
   - Avisos
   - Informações
   - Debug

3. **Alertas**
   - Email
   - Slack
   - SMS
   - Dashboard 