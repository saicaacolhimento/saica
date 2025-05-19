import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthLayout } from '@/layouts/AuthLayout';
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
import ShelterDetails from '@/features/shelters/pages/ShelterDetails';
import EditShelter from '@/features/shelters/pages/EditShelter';
import PermissoesEmpresa from '@/pages/admin/PermissoesEmpresa';
import Configuracoes from '@/pages/admin/Configuracoes';

const queryClient = new QueryClient();

export default function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
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
              <Route path="configuracoes">
                <Route index element={<Configuracoes />} />
                <Route path="permissoes" element={<PermissoesEmpresa />} />
              </Route>
            </Route>
            
            {/* Fallback para rotas não encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
} 