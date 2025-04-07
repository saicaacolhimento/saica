# Guia de Desenvolvimento do SAICA

## Padrões de Código

### TypeScript

1. **Tipos e Interfaces**

```typescript
// Use interfaces para objetos
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Use types para uniões e utilitários
type UserRole = 'admin' | 'user' | 'guest';
type Nullable<T> = T | null;

// Use enums para valores constantes
enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending'
}
```

2. **Funções**

```typescript
// Use arrow functions para callbacks
const handleClick = (event: React.MouseEvent) => {
  // ...
};

// Use function declarations para métodos
function calculateTotal(items: Item[]): number {
  return items.reduce((total, item) => total + item.price, 0);
}

// Use async/await para operações assíncronas
async function fetchData(): Promise<Data> {
  const response = await api.get('/data');
  return response.data;
}
```

### React

1. **Componentes**

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

// Use hooks para lógica reutilizável
const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser(userId).then(setUser).finally(() => setLoading(false));
  }, [userId]);

  return { user, loading };
};
```

2. **Estilização**

```typescript
// Use Tailwind CSS
const Button: React.FC<ButtonProps> = ({ variant = 'primary', children }) => {
  const baseStyles = 'px-4 py-2 rounded-md font-medium';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]}`}>
      {children}
    </button>
  );
};
```

### Formulários

1. **React Hook Form**

```typescript
const LoginForm: React.FC = () => {
  const { register, handleSubmit, errors } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (error) {
      // Handle error
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register('email', { required: 'Email é obrigatório' })}
        error={errors.email?.message}
      />
      <Input
        type="password"
        {...register('password', { required: 'Senha é obrigatória' })}
        error={errors.password?.message}
      />
      <Button type="submit">Entrar</Button>
    </form>
  );
};
```

2. **Validação**

```typescript
// Use Zod para validação
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;
```

### API

1. **Serviços**

```typescript
// Use classes para serviços
class UserService {
  private api: Api;

  constructor(api: Api) {
    this.api = api;
  }

  async getUsers(): Promise<User[]> {
    const response = await this.api.get('/users');
    return response.data;
  }

  async createUser(data: CreateUserData): Promise<User> {
    const response = await this.api.post('/users', data);
    return response.data;
  }
}
```

2. **Hooks de API**

```typescript
// Use React Query para cache e gerenciamento de estado
const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getUsers(),
  });
};

const useCreateUser = () => {
  return useMutation({
    mutationFn: (data: CreateUserData) => userService.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

### Testes

1. **Testes Unitários**

```typescript
// Use Jest e React Testing Library
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
```

2. **Testes de Integração**

```typescript
// Use MSW para mock de API
describe('LoginForm', () => {
  it('should handle successful login', async () => {
    server.use(
      rest.post('/api/login', (req, res, ctx) => {
        return res(ctx.json({ token: 'fake-token' }));
      })
    );

    render(<LoginForm />);

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com');
    await userEvent.type(screen.getByLabelText('Senha'), 'password123');
    await userEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    expect(await screen.findByText('Dashboard')).toBeInTheDocument();
  });
});
```

### Git

1. **Commits**

```bash
# Use commits semânticos
git commit -m "feat: adiciona autenticação com Supabase"
git commit -m "fix: corrige validação de formulário"
git commit -m "docs: atualiza README"
git commit -m "style: ajusta layout do dashboard"
git commit -m "refactor: extrai lógica de autenticação"
git commit -m "test: adiciona testes de integração"
```

2. **Branches**

```bash
# Use branches feature/fix
git checkout -b feature/auth
git checkout -b fix/validation
git checkout -b docs/readme
```

### CI/CD

1. **GitHub Actions**

```yaml
name: CI

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
      - run: npm run build
```

2. **Deploy**

```yaml
name: Deploy

on:
  push:
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
      - uses: netlify/actions/cli@master
        with:
          args: deploy --dir=dist --prod
```

## Boas Práticas

1. **Performance**
   - Use `React.memo` para componentes que recebem as mesmas props frequentemente
   - Use `useMemo` e `useCallback` para valores e funções computadas
   - Use `lazy` e `Suspense` para code splitting
   - Otimize imagens e assets

2. **Acessibilidade**
   - Use tags semânticas
   - Adicione atributos ARIA
   - Mantenha contraste adequado
   - Suporte navegação por teclado

3. **Segurança**
   - Valide inputs
   - Sanitize dados
   - Use HTTPS
   - Implemente CSRF protection

4. **Manutenibilidade**
   - Siga princípios SOLID
   - Use padrões de projeto
   - Documente código complexo
   - Mantenha testes atualizados

## Ferramentas

1. **Desenvolvimento**
   - VS Code
   - Chrome DevTools
   - React DevTools
   - Redux DevTools

2. **Qualidade**
   - ESLint
   - Prettier
   - TypeScript
   - Jest
   - Cypress

3. **Monitoramento**
   - Sentry
   - Google Analytics
   - Lighthouse
   - Web Vitals 