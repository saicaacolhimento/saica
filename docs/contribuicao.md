# Guia de Contribuição - SAICA

## Introdução

Obrigado pelo seu interesse em contribuir com o SAICA! Este guia fornece instruções detalhadas sobre como contribuir com o projeto, seja através de:

1. **Relatórios de Bugs**
2. **Sugestões de Melhorias**
3. **Pull Requests**
4. **Documentação**

## Como Contribuir

### 1. Preparação

1. **Fork o Repositório**
   - Acesse [GitHub](https://github.com/seu-usuario/saica)
   - Clique em "Fork"
   - Clone seu fork localmente

2. **Configure o Ambiente**
   ```bash
   # Clone seu fork
   git clone https://github.com/seu-usuario/saica.git
   cd saica

   # Instale dependências
   npm install

   # Configure variáveis de ambiente
   cp .env.example .env
   ```

3. **Crie uma Branch**
   ```bash
   # Crie uma branch para sua feature
   git checkout -b feature/nome-da-feature

   # Ou para correção de bug
   git checkout -b fix/nome-do-bug
   ```

### 2. Desenvolvimento

1. **Siga os Padrões de Código**
   - Use TypeScript
   - Siga o estilo de código existente
   - Documente funções e componentes
   - Escreva testes

2. **Commits**
   ```bash
   # Use commits semânticos
   git commit -m "feat: adiciona autenticação"
   git commit -m "fix: corrige validação"
   git commit -m "docs: atualiza README"
   git commit -m "style: ajusta layout"
   git commit -m "refactor: extrai lógica"
   git commit -m "test: adiciona testes"
   ```

3. **Testes**
   ```bash
   # Execute testes
   npm test

   # Verifique cobertura
   npm run test:coverage

   # Execute testes E2E
   npm run test:e2e
   ```

### 3. Pull Request

1. **Prepare o PR**
   - Atualize sua branch com a main
   - Resolva conflitos
   - Atualize documentação
   - Execute testes

2. **Crie o PR**
   - Use o template fornecido
   - Descreva as mudanças
   - Adicione screenshots
   - Referencie issues

3. **Revisão**
   - Responda feedback
   - Faça ajustes necessários
   - Mantenha commits organizados
   - Aguarde aprovação

## Padrões de Código

### TypeScript

```typescript
// Use interfaces para objetos
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Use types para uniões
type UserRole = 'admin' | 'user' | 'guest';

// Use enums para constantes
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

### React

```typescript
// Use functional components
const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  return (
    <div className="card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <button onClick={() => onEdit(user)}>Editar</button>
    </div>
  );
};

// Use hooks para lógica
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
};
```

### Testes

```typescript
// Testes unitários
describe('UserCard', () => {
  it('should render user information', () => {
    const user = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    };

    render(<UserCard user={user} onEdit={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });
});

// Testes de integração
describe('LoginForm', () => {
  it('should handle successful login', async () => {
    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(window.location.pathname).toBe('/dashboard');
  });
});
```

## Documentação

### Componentes

```typescript
/**
 * Card de usuário que exibe informações básicas
 * @param user - Dados do usuário
 * @param onEdit - Callback para edição
 */
const UserCard: React.FC<UserCardProps> = ({ user, onEdit }) => {
  // ...
};
```

### Hooks

```typescript
/**
 * Hook para gerenciar dados do usuário
 * @param userId - ID do usuário
 * @returns Dados do usuário e estado de loading
 */
const useUser = (userId: string) => {
  // ...
};
```

### Funções

```typescript
/**
 * Formata data para o padrão brasileiro
 * @param date - Data a ser formatada
 * @returns Data formatada
 */
function formatDate(date: Date): string {
  // ...
}
```

## Fluxo de Trabalho

### 1. Issue

1. **Crie uma Issue**
   - Use o template apropriado
   - Descreva o problema/feature
   - Adicione contexto
   - Adicione screenshots

2. **Discuta a Solução**
   - Interaja com mantenedores
   - Proponha abordagens
   - Receba feedback
   - Defina escopo

### 2. Desenvolvimento

1. **Implemente**
   - Siga padrões
   - Escreva testes
   - Documente
   - Teste localmente

2. **Revise**
   - Execute linting
   - Execute testes
   - Verifique cobertura
   - Teste em diferentes ambientes

### 3. Pull Request

1. **Prepare**
   - Atualize branch
   - Resolva conflitos
   - Atualize documentação
   - Execute testes

2. **Submeta**
   - Use template
   - Descreva mudanças
   - Adicione screenshots
   - Referencie issues

3. **Revisão**
   - Responda feedback
   - Faça ajustes
   - Mantenha commits
   - Aguarde aprovação

## Ferramentas

### Desenvolvimento

1. **Editor**
   - VS Code
   - Extensões recomendadas
   - Configurações

2. **Git**
   - Configuração
   - Aliases
   - Hooks
   - Workflow

3. **Testes**
   - Jest
   - React Testing Library
   - Cypress
   - MSW

### Qualidade

1. **Linting**
   - ESLint
   - Prettier
   - TypeScript
   - Husky

2. **Testes**
   - Unitários
   - Integração
   - E2E
   - Performance

3. **Documentação**
   - JSDoc
   - Storybook
   - README
   - Wikis

## Comunicação

### Canais

1. **GitHub**
   - Issues
   - Pull Requests
   - Discussions
   - Wikis

2. **Chat**
   - Discord
   - Slack
   - Teams
   - Email

3. **Documentação**
   - README
   - Wikis
   - Docs
   - Blogs

### Boas Práticas

1. **Comunicação**
   - Seja claro
   - Seja conciso
   - Seja profissional
   - Seja construtivo

2. **Feedback**
   - Seja específico
   - Seja construtivo
   - Seja respeitoso
   - Seja objetivo

3. **Colaboração**
   - Compartilhe conhecimento
   - Ajude outros
   - Aprenda com feedback
   - Mantenha diálogo

## Reconhecimento

### Contribuições

1. **Tipos**
   - Código
   - Documentação
   - Testes
   - Design

2. **Níveis**
   - Bug fix
   - Feature
   - Melhoria
   - Refatoração

3. **Reconhecimento**
   - Menção
   - Badges
   - Agradecimentos
   - Perfil

### Manutenção

1. **Responsabilidades**
   - Revisão de código
   - Merge de PRs
   - Releases
   - Documentação

2. **Processo**
   - Triagem
   - Revisão
   - Merge
   - Release

3. **Comunicação**
   - Atualizações
   - Mudanças
   - Decisões
   - Feedback 