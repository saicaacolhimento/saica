import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { AcolhidoList } from '@/features/acolhidos/pages/AcolhidoList';
import PrivateRoute from '@/components/PrivateRoute';
import UsuariosAdminList from '@/pages/admin/Usuarios';
import AcolhidoCadastroEdicao from '../pages/admin/AcolhidoCadastroEdicao';
import AgendamentoList from '@/features/agendamentos/pages/AgendamentoList';
import { AcolhidoDetails } from '@/features/acolhidos/pages/AcolhidoDetails';
import { ConfiguracaoList } from '@/features/configuracoes/pages/ConfiguracaoList';
import { ConfiguracaoCreate } from '@/features/configuracoes/pages/ConfiguracaoCreate';
import { ConfiguracaoEdit } from '@/features/configuracoes/pages/ConfiguracaoEdit';
import Financeiro from '@/pages/admin/Financeiro';
import Index from '@/pages/Index';

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
              <Route path=":id/visualizar" element={<AcolhidoDetails />} />
            </Route>
            <Route path="usuarios" element={<UsuariosAdminList />} />
            <Route path="agenda" element={<AgendamentoList />} />
            <Route path="relatorios" element={<div>Relatórios</div>} />
            <Route path="documentos" element={<div>Documentos</div>} />
            <Route path="atividades" element={<div>Atividades</div>} />
            <Route path="configuracoes">
              <Route index element={<ConfiguracaoList />} />
              <Route path="nova" element={<ConfiguracaoCreate />} />
              <Route path=":id/editar" element={<ConfiguracaoEdit />} />
            </Route>
            <Route path="financeiro">
              <Route index element={<Financeiro />} />
              <Route path="doacoes" element={<div>Doações</div>} />
              <Route path="despesas" element={<div>Despesas</div>} />
              <Route path="estoque" element={<div>Estoque</div>} />
              <Route path="relatorios" element={<div>Relatórios Financeiros</div>} />
            </Route>
          </Route>
          {/* Fallback para rotas não encontradas */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
} 