import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { Login } from '@/features/auth/pages/Login';
import { Dashboard } from '@/features/dashboard/pages/Dashboard';
import { AcolhidoList } from '@/features/acolhidos/pages/AcolhidoList';
import { AcolhidoCadastroEdicao } from '@/features/acolhidos/pages/AcolhidoCadastroEdicao';
import { AcolhidoView } from '@/features/acolhidos/pages/AcolhidoView';
import { ShelterList } from '@/features/shelters/pages/ShelterList';
import { ShelterCadastroEdicao } from '@/features/shelters/pages/ShelterCadastroEdicao';
import { UserList } from '@/features/users/pages/UserList';
import { UserCadastroEdicao } from '@/features/users/pages/UserCadastroEdicao';
import { Profile } from '@/features/profile/pages/Profile';
import { NotFound } from '@/features/not-found/pages/NotFound';

// Layouts
import AdminLayout from '@/layouts/AdminLayout';
import PrivateRoute from '@/components/PrivateRoute';
import UsuariosAdminList from '@/pages/admin/Usuarios';

const queryClient = new QueryClient();

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <Login />
      }
    ]
  },
  {
    path: '/admin',
    element: <DashboardLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'criancas',
        children: [
          {
            index: true,
            element: <AcolhidoList />
          },
          {
            path: 'novo',
            element: <AcolhidoCadastroEdicao />
          },
          {
            path: ':id',
            element: <AcolhidoCadastroEdicao />
          },
          {
            path: ':id/visualizar',
            element: <AcolhidoView />
          }
        ]
      },
      {
        path: 'abrigos',
        children: [
          {
            index: true,
            element: <ShelterList />
          },
          {
            path: 'novo',
            element: <ShelterCadastroEdicao />
          },
          {
            path: ':id',
            element: <ShelterCadastroEdicao />
          }
        ]
      },
      {
        path: 'usuarios',
        children: [
          {
            index: true,
            element: <UserList />
          },
          {
            path: 'novo',
            element: <UserCadastroEdicao />
          },
          {
            path: ':id',
            element: <UserCadastroEdicao />
          }
        ]
      },
      {
        path: 'perfil',
        element: <Profile />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
]);

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<AuthLayout />} />
            <Route path="/login" element={<AuthLayout />} />
            
            <Route path="/admin" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Rotas de Empresas */}
              <Route path="empresas">
                <Route index element={<ShelterList />} />
                <Route path=":id" element={<ShelterDetails />} />
                <Route path=":id/editar" element={<EditShelter />} />
              </Route>

              {/* Rotas de Crianças/Acolhidos */}
              <Route path="criancas">
                <Route index element={<AcolhidoList />} />
                <Route path="novo" element={<AcolhidoCadastroEdicao />} />
                <Route path=":id" element={<AcolhidoCadastroEdicao />} />
                <Route path=":id/visualizar" element={<AcolhidoView />} />
              </Route>

              <Route path="usuarios" element={<UsuariosAdminList />} />
              <Route path="relatorios" element={<div>Relatórios</div>} />
              <Route path="documentos" element={<div>Documentos</div>} />
              <Route path="atividades" element={<div>Atividades</div>} />
              <Route path="configuracoes" element={<div>Configurações</div>} />
            </Route>
            
            {/* Fallback para rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
} 