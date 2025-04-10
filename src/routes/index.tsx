import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Layouts
import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';

// Páginas
import { Login } from '@/features/auth/pages/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ShelterList from '@/features/shelters/pages/ShelterList';
import ShelterDetails from '@/features/shelters/pages/ShelterDetails';
import EditShelter from '@/features/shelters/pages/EditShelter';
import PrivateRoute from '@/components/PrivateRoute';

const queryClient = new QueryClient();

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
              
              {/* Rotas de Abrigos */}
              <Route path="abrigos">
                <Route index element={<ShelterList />} />
                <Route path=":id" element={<ShelterDetails />} />
                <Route path=":id/editar" element={<EditShelter />} />
              </Route>

              <Route path="criancas" element={<div>Crianças</div>} />
              <Route path="usuarios" element={<div>Usuários</div>} />
              <Route path="orgaos" element={<div>Órgãos</div>} />
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