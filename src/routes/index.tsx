import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import AuthLayout from '@/layouts/AuthLayout';
import AdminLayout from '@/layouts/AdminLayout';

import { Login } from '@/features/auth/pages/Login';
import Dashboard from '@/pages/admin/Dashboard';
import ShelterList from '@/features/shelters/pages/ShelterList';
import ShelterDetails from '@/features/shelters/pages/ShelterDetails';
import EditShelter from '@/features/shelters/pages/EditShelter';
import { AcolhidoList } from '@/features/acolhidos/pages/AcolhidoList';
import PrivateRoute from '@/components/PrivateRoute';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import UsuariosAdminList from '@/pages/admin/Usuarios';
import AcolhidoCadastroEdicao from '../pages/admin/AcolhidoCadastroEdicao';
import AgendamentoList from '@/features/agendamentos/pages/AgendamentoList';
import { AcolhidoDetails } from '@/features/acolhidos/pages/AcolhidoDetails';
import { ConfiguracaoList } from '@/features/configuracoes/pages/ConfiguracaoList';
import { ConfiguracaoCreate } from '@/features/configuracoes/pages/ConfiguracaoCreate';
import { ConfiguracaoEdit } from '@/features/configuracoes/pages/ConfiguracaoEdit';
import Financeiro from '@/pages/admin/Financeiro';
import MensagensPage from '@/features/mensagens/pages/MensagensPage';
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
            <Route path="dashboard" element={<ProtectedRoute module="dashboard"><Dashboard /></ProtectedRoute>} />
            <Route path="empresas">
              <Route index element={<ProtectedRoute module="empresas"><ShelterList /></ProtectedRoute>} />
              <Route path=":id" element={<ProtectedRoute module="empresas"><ShelterDetails /></ProtectedRoute>} />
              <Route path=":id/editar" element={<ProtectedRoute module="empresas" type="write"><EditShelter /></ProtectedRoute>} />
            </Route>
            <Route path="criancas">
              <Route index element={<ProtectedRoute module="acolhidos"><AcolhidoList /></ProtectedRoute>} />
              <Route path="novo" element={<ProtectedRoute module="acolhidos" type="write"><AcolhidoCadastroEdicao /></ProtectedRoute>} />
              <Route path=":id" element={<ProtectedRoute module="acolhidos" type="write"><AcolhidoCadastroEdicao /></ProtectedRoute>} />
              <Route path=":id/visualizar" element={<ProtectedRoute module="acolhidos"><AcolhidoDetails /></ProtectedRoute>} />
            </Route>
            <Route path="usuarios" element={<ProtectedRoute module="usuarios"><UsuariosAdminList /></ProtectedRoute>} />
            <Route path="agenda" element={<ProtectedRoute module="agenda"><AgendamentoList /></ProtectedRoute>} />
            <Route path="relatorios" element={<ProtectedRoute module="relatorios"><div>Relatórios</div></ProtectedRoute>} />
            <Route path="documentos" element={<ProtectedRoute module="documentos"><div>Documentos</div></ProtectedRoute>} />
            <Route path="atividades" element={<ProtectedRoute module="atividades"><div>Atividades</div></ProtectedRoute>} />
            <Route path="mensagens" element={<ProtectedRoute module="mensagens"><MensagensPage /></ProtectedRoute>} />
            <Route path="configuracoes">
              <Route index element={<ProtectedRoute module="configuracoes"><ConfiguracaoList /></ProtectedRoute>} />
              <Route path="nova" element={<ProtectedRoute module="configuracoes" type="write"><ConfiguracaoCreate /></ProtectedRoute>} />
              <Route path=":id/editar" element={<ProtectedRoute module="configuracoes" type="write"><ConfiguracaoEdit /></ProtectedRoute>} />
            </Route>
            <Route path="financeiro">
              <Route index element={<ProtectedRoute module="financeiro"><Financeiro /></ProtectedRoute>} />
              <Route path="doacoes" element={<ProtectedRoute module="financeiro"><div>Doações</div></ProtectedRoute>} />
              <Route path="despesas" element={<ProtectedRoute module="financeiro"><div>Despesas</div></ProtectedRoute>} />
              <Route path="estoque" element={<ProtectedRoute module="financeiro"><div>Estoque</div></ProtectedRoute>} />
              <Route path="relatorios" element={<ProtectedRoute module="financeiro"><div>Relatórios Financeiros</div></ProtectedRoute>} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
