import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Building2,
  FileText,
  Calendar,
  Bell,
  MessageSquare,
} from 'lucide-react';

const stats = [
  {
    name: 'Usuários',
    value: '0',
    icon: Users,
    href: '/admin/users',
  },
  {
    name: 'Abrigos',
    value: '0',
    icon: Building2,
    href: '/abrigos',
  },
  {
    name: 'Documentos',
    value: '0',
    icon: FileText,
    href: '/documentos',
  },
  {
    name: 'Agendamentos',
    value: '0',
    icon: Calendar,
    href: '/agendamentos',
  },
  {
    name: 'Notificações',
    value: '0',
    icon: Bell,
    href: '/notificacoes',
  },
  {
    name: 'Mensagens',
    value: '0',
    icon: MessageSquare,
    href: '/mensagens',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Bem-vindo, {user?.nome}!
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Aqui está um resumo das informações do sistema
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(item => (
          <div
            key={item.name}
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                {item.name}
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {item.value}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900">Atividades Recentes</h2>
        <div className="mt-4 rounded-lg bg-white shadow">
          <div className="p-4 text-center text-sm text-gray-500">
            Nenhuma atividade recente
          </div>
        </div>
      </div>
    </div>
  );
} 