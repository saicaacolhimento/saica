# Instalação do SAICA

## Pré-requisitos

- Node.js 18.x ou superior
- npm 9.x ou superior
- Git
- Conta no Supabase
- Conta no GitHub (opcional, para CI/CD)

## Configuração do Ambiente

1. **Clone o Repositório**

```bash
git clone https://github.com/seu-usuario/saica.git
cd saica
```

2. **Instale as Dependências**

```bash
npm install
```

3. **Configure as Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Supabase
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase

# API
VITE_API_URL=http://localhost:3000

# Outras Configurações
VITE_APP_NAME=SAICA
VITE_APP_DESCRIPTION=Sistema de Acompanhamento de Indicadores de Controle Ambiental
```

4. **Configure o Supabase**

- Crie um novo projeto no Supabase
- Configure as tabelas necessárias:
  - `usuarios`
  - `configuracoes`
  - `relatorios`
  - `relatorio_templates`
  - `backups`
- Configure as políticas de segurança
- Configure o armazenamento de arquivos

5. **Configure o Banco de Dados**

Execute os scripts de migração:

```bash
npm run db:migrate
```

6. **Inicie o Servidor de Desenvolvimento**

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Cria a build de produção
- `npm run preview`: Visualiza a build de produção localmente
- `npm run test`: Executa os testes
- `npm run test:coverage`: Executa os testes com cobertura
- `npm run test:e2e`: Executa os testes E2E
- `npm run lint`: Executa o linter
- `npm run format`: Formata o código
- `npm run db:migrate`: Executa as migrações do banco de dados
- `npm run db:seed`: Popula o banco de dados com dados de teste

## Estrutura de Arquivos

```
saica/
  ├── src/              # Código fonte
  ├── public/           # Arquivos estáticos
  ├── docs/             # Documentação
  ├── tests/            # Testes
  ├── cypress/          # Testes E2E
  ├── .env              # Variáveis de ambiente
  ├── .env.example      # Exemplo de variáveis de ambiente
  ├── package.json      # Dependências e scripts
  ├── tsconfig.json     # Configuração do TypeScript
  ├── vite.config.ts    # Configuração do Vite
  ├── jest.config.js    # Configuração do Jest
  └── cypress.config.ts # Configuração do Cypress
```

## Configuração do Editor

### VS Code

1. Instale as extensões recomendadas:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

2. Configure o formato automático:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

### Outros Editores

- WebStorm
- Sublime Text
- Atom

## Solução de Problemas

### Problemas Comuns

1. **Erro de CORS**

Verifique se as configurações do Supabase estão corretas:

```typescript
// src/lib/supabase.ts
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
```

2. **Erro de Autenticação**

Verifique se as credenciais do Supabase estão corretas:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

3. **Erro de Build**

Limpe o cache e reinstale as dependências:

```bash
rm -rf node_modules
rm -rf dist
npm cache clean --force
npm install
```

### Logs

Os logs podem ser encontrados em:

- Console do navegador
- Terminal do servidor de desenvolvimento
- Logs do Supabase
- Logs do servidor de produção

## Suporte

Para suporte, entre em contato através de:

- GitHub Issues
- Email: suporte@saica.com
- Discord: [Link do servidor]
- Documentação: [Link da documentação] 