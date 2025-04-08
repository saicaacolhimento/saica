import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { MainLayout } from '@/layouts/MainLayout';
import AdminLayout from '@/layouts/AdminLayout';
import Login from '@/features/auth/pages/Login';
import AdminLogin from '@/features/auth/pages/AdminLogin';
import Dashboard from '@/features/dashboard/pages/Dashboard';
import { UserList } from '@/features/users/pages/UserList';
import { UserDetails } from '@/features/users/pages/UserDetails';
import { UserEdit } from '@/features/users/pages/UserEdit';
import { NotFound } from '@/features/misc/pages/NotFound';
import PrivateRoute from '@/components/PrivateRoute';
import { AuthProvider } from '@/contexts/AuthContext';
// import { ShelterList } from '@/features/shelters/pages/ShelterList';
// import { ShelterEdit } from '@/features/shelters/pages/ShelterEdit';
// import { ShelterDetails } from '@/features/shelters/pages/ShelterDetails';
// import { PermissionList } from '@/features/permissions/pages/PermissionList';
// import { PermissionDetails } from '@/features/permissions/pages/PermissionDetails';
// import { PermissionEdit } from '@/features/permissions/pages/PermissionEdit';
// import { AcolhidoList } from '@/features/acolhidos/pages/AcolhidoList';
// import { AcolhidoDetails } from '@/features/acolhidos/pages/AcolhidoDetails';
// import { AcolhidoEdit } from '@/features/acolhidos/pages/AcolhidoEdit';
// import { DocumentoList } from '@/features/documentos/pages/DocumentoList';
// import { DocumentoDetails } from '@/features/documentos/pages/DocumentoDetails';
// import { AgendamentoList } from '@/features/agendamentos/pages/AgendamentoList';
// import { AgendamentoDetails } from '@/features/agendamentos/pages/AgendamentoDetails';
// import { NotificacaoList } from '@/features/notificacoes/pages/NotificacaoList';
// import { NotificacaoDetails } from '@/features/notificacoes/pages/NotificacaoDetails';
// import { ConversaList } from '@/features/mensagens/pages/ConversaList'
// import { Chat } from '@/features/mensagens/pages/Chat'
// import { RelatorioList } from '@/features/relatorios/pages/RelatorioList'
// import { RelatorioDetails } from '@/features/relatorios/pages/RelatorioDetails'
// import { ConfiguracaoList } from '@/features/configuracoes/pages/ConfiguracaoList'
// import { ConfiguracaoEdit } from '@/features/configuracoes/pages/ConfiguracaoEdit'
// import { ConfiguracaoCreate } from '@/features/configuracoes/pages/ConfiguracaoCreate'
// import { BackupRestore } from '@/features/configuracoes/pages/BackupRestore'

// Layouts
import PublicLayout from '@/layouts/PublicLayout';
import { Layout } from '@/components/Layout';

const routes = [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'admin/login',
        element: <AdminLogin />
      }
    ]
  },
  {
    path: '/dashboard',
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'usuarios',
        element: <UserList />
      },
      {
        path: 'usuarios/:id',
        element: <UserDetails />
      },
      {
        path: 'usuarios/:id/editar',
        element: <UserEdit />
      }
    ]
  },
  {
    path: '/admin',
    element: (
      <PrivateRoute roles={['admin']}>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: '',
        element: <Navigate to="/admin/dashboard" />
      }
    ]
  }
];

export const router = createBrowserRouter([
  {
    element: <AuthProvider>
      <Outlet />
    </AuthProvider>,
    children: routes
  }
]); 