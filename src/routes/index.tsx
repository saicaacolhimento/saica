import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createBrowserRouter } from 'react-router-dom';
import { PrivateRoute } from '@/components/PrivateRoute';
import { AdminRoute } from '@/components/AdminRoute';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { UserList } from '@/features/users/pages/UserList';
import { UserEdit } from '@/features/users/pages/UserEdit';
import { UserDetails } from '@/features/users/pages/UserDetails';
import { ShelterList } from '@/features/shelters/pages/ShelterList';
import { ShelterEdit } from '@/features/shelters/pages/ShelterEdit';
import { ShelterDetails } from '@/features/shelters/pages/ShelterDetails';
import { PermissionList } from '@/features/permissions/pages/PermissionList';
import { PermissionDetails } from '@/features/permissions/pages/PermissionDetails';
import { PermissionEdit } from '@/features/permissions/pages/PermissionEdit';
import { AcolhidoList } from '@/features/acolhidos/pages/AcolhidoList';
import { AcolhidoDetails } from '@/features/acolhidos/pages/AcolhidoDetails';
import { AcolhidoEdit } from '@/features/acolhidos/pages/AcolhidoEdit';
import { DocumentoList } from '@/features/documentos/pages/DocumentoList';
import { DocumentoDetails } from '@/features/documentos/pages/DocumentoDetails';
import { AgendamentoList } from '@/features/agendamentos/pages/AgendamentoList';
import { AgendamentoDetails } from '@/features/agendamentos/pages/AgendamentoDetails';
import { NotificacaoList } from '@/features/notificacoes/pages/NotificacaoList';
import { NotificacaoDetails } from '@/features/notificacoes/pages/NotificacaoDetails';
import { ConversaList } from '@/features/mensagens/pages/ConversaList'
import { Chat } from '@/features/mensagens/pages/Chat'
import { RelatorioList } from '@/features/relatorios/pages/RelatorioList'
import { RelatorioDetails } from '@/features/relatorios/pages/RelatorioDetails'
import { ConfiguracaoList } from '@/features/configuracoes/pages/ConfiguracaoList'
import { ConfiguracaoEdit } from '@/features/configuracoes/pages/ConfiguracaoEdit'
import { ConfiguracaoCreate } from '@/features/configuracoes/pages/ConfiguracaoCreate'
import { BackupRestore } from '@/features/configuracoes/pages/BackupRestore'

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminLayout from '@/layouts/AdminLayout';
import { Layout } from '@/components/Layout';
import { MainLayout } from '@/layouts/MainLayout';

// Pages
import Login from '@/features/auth/pages/Login';
import AdminLogin from '@/features/auth/pages/AdminLogin';
import NotFound from '@/features/common/pages/NotFound';

// Importa os endpoints de teste
import testRoutes from '@/api/test'

// Protected Route Component
const ProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles?: string[] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Dashboard />
      },
      {
        path: '/usuarios',
        element: <UserList />
      },
      {
        path: '/usuarios/:id',
        element: <UserDetails />
      },
      {
        path: '/usuarios/:id/editar',
        element: <UserEdit />
      },
      {
        path: '/abrigos',
        element: <ShelterList />
      },
      {
        path: '/abrigos/:id',
        element: <ShelterDetails />
      },
      {
        path: '/abrigos/:id/editar',
        element: <ShelterEdit />
      },
      {
        path: '/permissoes',
        element: <PermissionList />
      },
      {
        path: '/permissoes/:id',
        element: <PermissionDetails />
      },
      {
        path: '/permissoes/:id/editar',
        element: <PermissionEdit />
      },
      {
        path: '/acolhidos',
        element: <AcolhidoList />
      },
      {
        path: '/acolhidos/:id',
        element: <AcolhidoDetails />
      },
      {
        path: '/acolhidos/:id/editar',
        element: <AcolhidoEdit />
      },
      {
        path: '/documentos',
        element: <DocumentoList />
      },
      {
        path: '/documentos/:id',
        element: <DocumentoDetails />
      },
      {
        path: '/agendamentos',
        element: <AgendamentoList />
      },
      {
        path: '/agendamentos/:id',
        element: <AgendamentoDetails />
      },
      {
        path: '/notificacoes',
        element: <NotificacaoList />
      },
      {
        path: '/notificacoes/:id',
        element: <NotificacaoDetails />
      },
      {
        path: '/mensagens',
        element: <ConversaList />
      },
      {
        path: '/mensagens/:id',
        element: <Chat />
      },
      {
        path: '/relatorios',
        element: <RelatorioList />
      },
      {
        path: '/relatorios/:id',
        element: <RelatorioDetails />
      },
      {
        path: '/configuracoes',
        element: <ConfiguracaoList />
      },
      {
        path: '/configuracoes/nova',
        element: <ConfiguracaoCreate />
      },
      {
        path: '/configuracoes/:id/editar',
        element: <ConfiguracaoEdit />
      },
      {
        path: '/configuracoes/backup',
        element: <BackupRestore />
      }
    ]
  }
]);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      {/* Rotas do Dashboard (Protegidas) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Navigate to="/dashboard/acolhidos" />} />
        {/* Adicionar mais rotas do dashboard aqui */}
      </Route>

      {/* Rotas Administrativas (Protegidas - Apenas Admin) */}
      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
        {/* Adicionar mais rotas administrativas aqui */}
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Adiciona os endpoints de teste
app.use('/api/test', testRoutes) 