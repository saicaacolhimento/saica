# Guia de Manutenção do SAICA

## Visão Geral

Este guia fornece instruções para a manutenção regular do sistema SAICA, incluindo:

1. **Manutenção Preventiva**: Tarefas regulares para prevenir problemas
2. **Manutenção Corretiva**: Correção de problemas quando ocorrem
3. **Monitoramento**: Acompanhamento do sistema
4. **Backup**: Preservação dos dados

## Manutenção Preventiva

### Atualizações de Dependências

```bash
# Verifique atualizações disponíveis
npm outdated

# Atualize dependências
npm update

# Verifique vulnerabilidades
npm audit

# Corrija vulnerabilidades
npm audit fix
```

### Limpeza de Cache

```bash
# Limpe cache do npm
npm cache clean --force

# Limpe cache do Vite
rm -rf node_modules/.vite

# Limpe builds antigos
rm -rf dist
```

### Otimização de Banco de Dados

```sql
-- Otimize tabelas
ANALYZE TABLE usuarios;
ANALYZE TABLE configuracoes;
ANALYZE TABLE relatorios;
ANALYZE TABLE relatorio_templates;
ANALYZE TABLE backups;

-- Limpe logs antigos
DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

## Manutenção Corretiva

### Logs de Erro

```typescript
// src/utils/logger.ts
export function logError(error: Error, context?: Record<string, any>) {
  console.error(error);
  Sentry.captureException(error, { extra: context });
  
  // Salve no banco de dados
  db.logs.create({
    type: 'error',
    message: error.message,
    stack: error.stack,
    context,
  });
}
```

### Monitoramento de Performance

```typescript
// src/utils/performance.ts
export function trackPerformance(metric: PerformanceMetric) {
  // Envie para serviço de monitoramento
  monitoringService.sendMetric(metric);
  
  // Alerte se performance estiver ruim
  if (metric.value > threshold) {
    alertService.sendAlert({
      type: 'performance',
      message: `Performance degradada em ${metric.name}`,
      metric,
    });
  }
}
```

### Correção de Dados

```typescript
// src/scripts/fix-data.ts
async function fixCorruptedData() {
  // Corrija dados corrompidos
  await db.transaction(async (trx) => {
    // Corrija usuários
    await trx('usuarios')
      .where('email', 'like', '%@%')
      .update({ status: 'active' });
    
    // Corrija configurações
    await trx('configuracoes')
      .whereNull('valor')
      .update({ valor: 'default' });
  });
}
```

## Monitoramento

### Métricas do Sistema

```typescript
// src/utils/metrics.ts
export function collectSystemMetrics() {
  return {
    cpu: process.cpuUsage(),
    memory: process.memoryUsage(),
    uptime: process.uptime(),
    connections: db.getConnectionCount(),
    requests: api.getRequestCount(),
  };
}
```

### Logs do Sistema

```typescript
// src/utils/logging.ts
export function setupLogging() {
  // Configure Winston
  const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
      new winston.transports.File({ filename: 'combined.log' }),
    ],
  });

  // Configure Sentry
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
  });
}
```

### Alertas

```typescript
// src/utils/alerts.ts
export function setupAlerts() {
  // Configure alertas por email
  emailAlerts.setup({
    smtp: process.env.SMTP_CONFIG,
    recipients: process.env.ALERT_RECIPIENTS,
  });

  // Configure alertas por Slack
  slackAlerts.setup({
    webhook: process.env.SLACK_WEBHOOK,
    channel: process.env.SLACK_CHANNEL,
  });
}
```

## Backup

### Banco de Dados

```bash
# Backup completo
supabase db dump -f backup.sql

# Backup incremental
supabase db dump --incremental -f incremental.sql

# Restauração
supabase db restore backup.sql
```

### Arquivos

```bash
# Backup de uploads
tar -czf uploads.tar.gz public/uploads/

# Backup de configurações
tar -czf config.tar.gz .env*

# Restauração
tar -xzf uploads.tar.gz -C public/uploads/
tar -xzf config.tar.gz
```

### Logs

```bash
# Backup de logs
tar -czf logs.tar.gz logs/

# Limpe logs antigos
find logs/ -type f -name "*.log" -mtime +30 -delete
```

## Segurança

### Atualizações de Segurança

```bash
# Verifique vulnerabilidades
npm audit

# Atualize dependências com vulnerabilidades
npm audit fix

# Atualize manualmente se necessário
npm install package@latest
```

### Monitoramento de Segurança

```typescript
// src/utils/security.ts
export function monitorSecurity() {
  // Monitore tentativas de login
  authService.onLoginAttempt((attempt) => {
    if (attempt.failed > 5) {
      securityService.blockIP(attempt.ip);
    }
  });

  // Monitore requisições suspeitas
  apiService.onRequest((request) => {
    if (isSuspiciousRequest(request)) {
      securityService.alert(request);
    }
  });
}
```

### Logs de Segurança

```typescript
// src/utils/security-logger.ts
export function logSecurityEvent(event: SecurityEvent) {
  // Salve no banco de dados
  db.securityLogs.create({
    type: event.type,
    ip: event.ip,
    user: event.user,
    details: event.details,
  });

  // Alerte equipe de segurança
  securityTeam.notify(event);
}
```

## Performance

### Otimização de Cache

```typescript
// src/utils/cache.ts
export function optimizeCache() {
  // Limpe cache antigo
  cacheService.cleanup();

  // Revalide cache
  cacheService.revalidate();

  // Otimize configurações
  cacheService.optimize({
    maxSize: '1GB',
    ttl: '1h',
  });
}
```

### Otimização de Banco de Dados

```sql
-- Otimize índices
ANALYZE TABLE usuarios;
ANALYZE TABLE configuracoes;

-- Limpe dados antigos
DELETE FROM logs WHERE created_at < DATE_SUB(NOW(), INTERVAL 90 DAY);
DELETE FROM backups WHERE created_at < DATE_SUB(NOW(), INTERVAL 30 DAY);
```

### Monitoramento de Performance

```typescript
// src/utils/performance-monitor.ts
export function monitorPerformance() {
  // Monitore tempo de resposta
  apiService.onResponse((response) => {
    if (response.time > 1000) {
      performanceService.alert('Response time high', response);
    }
  });

  // Monitore uso de recursos
  setInterval(() => {
    const metrics = collectSystemMetrics();
    if (metrics.memory.heapUsed > 0.8 * metrics.memory.heapTotal) {
      performanceService.alert('High memory usage', metrics);
    }
  }, 60000);
}
```

## Troubleshooting

### Problemas Comuns

1. **Erro de Conexão com Banco de Dados**
   ```bash
   # Verifique status
   supabase status
   
   # Reinicie conexão
   supabase db reset
   
   # Verifique logs
   supabase logs
   ```

2. **Erro de Performance**
   ```bash
   # Verifique uso de recursos
   top
   
   # Verifique logs
   tail -f logs/error.log
   
   # Limpe cache
   npm cache clean --force
   ```

3. **Erro de Segurança**
   ```bash
   # Verifique logs de segurança
   tail -f logs/security.log
   
   # Verifique tentativas de login
   supabase auth logs
   
   # Bloqueie IPs suspeitos
   supabase security block-ip <ip>
   ```

### Procedimentos de Emergência

1. **Falha de Sistema**
   ```bash
   # Faça backup
   supabase db dump -f emergency_backup.sql
   
   # Reinicie serviços
   supabase stop
   supabase start
   
   # Verifique logs
   supabase logs
   ```

2. **Perda de Dados**
   ```bash
   # Restaure backup
   supabase db restore latest_backup.sql
   
   # Verifique integridade
   supabase db check
   
   # Notifique usuários
   notifyUsers('maintenance')
   ```

3. **Ataque de Segurança**
   ```bash
   # Bloqueie acesso
   supabase security lockdown
   
   # Faça backup
   supabase db dump -f security_backup.sql
   
   # Notifique equipe
   securityTeam.alert('security_breach')
   ``` 