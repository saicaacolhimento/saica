# Guia de Testes do SAICA

## Visão Geral

O SAICA utiliza uma abordagem abrangente para testes, cobrindo diferentes níveis e aspectos da aplicação:

1. **Testes Unitários**: Componentes, hooks, funções utilitárias
2. **Testes de Integração**: Fluxos completos, APIs, navegação
3. **Testes E2E**: Cenários de usuário, autenticação, formulários
4. **Testes de Performance**: Tempo de resposta, carregamento, otimizações

## Configuração

### Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

### Cypress

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
  },
});
```

## Testes Unitários

### Componentes React

```typescript
// src/components/UserCard.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UserCard } from './UserCard';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('should render user information', () => {
    render(<UserCard user={mockUser} onEdit={jest.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = jest.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    await userEvent.click(screen.getByRole('button', { name: 'Editar' }));
    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

### Hooks Personalizados

```typescript
// src/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAuth } from './useAuth';

describe('useAuth', () => {
  it('should handle login successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toBeTruthy();
  });

  it('should handle login failure', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('invalid@example.com', 'wrongpassword');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});
```

### Funções Utilitárias

```typescript
// src/utils/format.test.ts
import { formatDate, formatCurrency } from './format';

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-01-01');
    expect(formatDate(date)).toBe('01/01/2024');
  });
});

describe('formatCurrency', () => {
  it('should format currency correctly', () => {
    expect(formatCurrency(1000)).toBe('R$ 1.000,00');
    expect(formatCurrency(1000.5)).toBe('R$ 1.000,50');
  });
});
```

## Testes de Integração

### Fluxos de API

```typescript
// src/features/users/tests/UserList.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { UserList } from '../components/UserList';
import { server } from '@/mocks/server';

const queryClient = new QueryClient();

describe('UserList', () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  it('should fetch and display users', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  it('should handle error state', async () => {
    server.use(
      rest.get('/api/users', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Erro ao carregar usuários')).toBeInTheDocument();
    });
  });
});
```

### Navegação

```typescript
// src/features/auth/tests/Login.test.tsx
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Login } from '../components/Login';

describe('Login', () => {
  it('should navigate to dashboard after successful login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(window.location.pathname).toBe('/dashboard');
  });
});
```

## Testes E2E

### Autenticação

```typescript
// cypress/e2e/auth.cy.ts
describe('Authentication', () => {
  beforeEach(() => {
    cy.cleanDatabase();
    cy.createTestUser({
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    });
  });

  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('test@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid="user-menu"]').should('be.visible');
  });

  it('should show error for invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('wrong@example.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="error-message"]')
      .should('be.visible')
      .and('contain', 'Credenciais inválidas');
  });
});
```

### Formulários

```typescript
// cypress/e2e/forms.cy.ts
describe('Forms', () => {
  beforeEach(() => {
    cy.login('admin@example.com', 'password123');
  });

  it('should create new user', () => {
    cy.visit('/users/new');
    cy.get('input[name="name"]').type('New User');
    cy.get('input[name="email"]').type('new@example.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('select[name="role"]').select('user');
    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/users');
    cy.get('table').should('contain', 'New User');
  });

  it('should validate required fields', () => {
    cy.visit('/users/new');
    cy.get('button[type="submit"]').click();

    cy.get('[data-testid="error-name"]').should('be.visible');
    cy.get('[data-testid="error-email"]').should('be.visible');
    cy.get('[data-testid="error-password"]').should('be.visible');
  });
});
```

## Testes de Performance

### Lighthouse

```javascript
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'npm run preview',
      url: ['http://localhost:4173'],
      numberOfTests: 5,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
      },
    },
  },
};
```

### Web Vitals

```typescript
// src/utils/performance.ts
export function reportWebVitals(metric: any) {
  if (metric.label === 'web-vital') {
    console.log(metric); // Envie para seu serviço de analytics
  }
}
```

## CI/CD

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test
      - run: npm run test:e2e
      - run: npm run lighthouse
```

## Boas Práticas

1. **Organização**
   - Separe testes por tipo (unit, integration, e2e)
   - Use nomes descritivos para arquivos e testes
   - Mantenha testes próximos ao código testado
   - Use fixtures para dados de teste

2. **Isolamento**
   - Mock dependências externas
   - Limpe estado entre testes
   - Use `beforeEach` e `afterEach`
   - Evite dependências entre testes

3. **Cobertura**
   - Mantenha cobertura mínima de 80%
   - Teste casos de sucesso e erro
   - Teste edge cases
   - Use relatórios de cobertura

4. **Manutenção**
   - Atualize testes com mudanças no código
   - Remova testes obsoletos
   - Documente testes complexos
   - Use helpers e fixtures

## Ferramentas

1. **Testes Unitários**
   - Jest
   - React Testing Library
   - MSW
   - Testing Library User Event

2. **Testes E2E**
   - Cypress
   - Cypress Testing Library
   - Cypress Real Events
   - Cypress Axe

3. **Performance**
   - Lighthouse CI
   - Web Vitals
   - Chrome DevTools
   - Performance API

4. **CI/CD**
   - GitHub Actions
   - Jest
   - Cypress
   - Lighthouse CI 