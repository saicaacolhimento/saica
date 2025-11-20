import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/services/auth';
import {
  Users,
  Home,
  FileText,
  Settings,
  Activity,
  Building,
  FileBox,
  Baby,
  Calendar,
  DollarSign
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userNome, setUserNome] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Buscar dados completos do usuário em background
  useEffect(() => {
    if (user?.id) {
      authService.getCurrentUser().then(fullUser => {
        if (fullUser) {
          setUserNome(fullUser.nome || null);
          setUserRole(fullUser.role || null);
        }
      }).catch(() => {
        // Silencioso
      });
    }
  }, [user?.id]);

  const isMaster = userRole === 'master' || user?.email === 'saicaacolhimento2025@gmail.com';
  const isAdmin = userRole === 'admin' || isMaster;

  const modules = [
    {
      title: 'Gestão de Empresas',
      description: 'Cadastro de empresas',
      route: '/admin/empresas',
      icon: Home,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      masterOnly: true // ⚠️ SÓ PARA MASTER
    },
    {
      title: 'Gestão de Usuários',
      description: 'Gerenciamento de usuários e permissões',
      route: '/admin/usuarios',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600',
      adminOnly: true // ⚠️ PARA ADMIN E MASTER (NÃO PARA USUÁRIO NORMAL)
    },
    {
      title: 'Gestão de Acolhido',
      description: 'Cadastro e acompanhamento de acolhidos',
      route: '/admin/criancas',
      icon: Baby,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Agenda',
      description: 'Veja e gerencie seus compromissos',
      route: '/admin/agenda',
      icon: Calendar,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-700'
    },
    {
      title: 'Gestão Financeira',
      description: 'Controle de doações, despesas e estoque',
      route: '/admin/financeiro',
      icon: DollarSign,
      bgColor: 'bg-pink-100',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Documentos',
      description: 'Gestão de documentos e arquivos',
      route: '/admin/documentos',
      icon: FileBox,
      bgColor: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    {
      title: 'Atividades',
      description: 'Registro e acompanhamento de atividades',
      route: '/admin/atividades',
      icon: Activity,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Configurações',
      description: 'Configurações do sistema',
      route: '/admin/configuracoes',
      icon: Settings,
      bgColor: 'bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium text-gray-700">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 md:px-6 py-4 overflow-x-hidden">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            {(() => {
              if (isMaster) {
                return 'Olá, Administrador';
              }
              const nomeCompleto = userNome;
              if (nomeCompleto && nomeCompleto.trim()) {
                const primeiroNome = nomeCompleto.trim().split(' ')[0];
                return `Olá, ${primeiroNome}`;
              }
              return 'Olá, Usuário';
            })()}
          </h1>
          <p className="text-gray-600">Acesso total ao sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {modules
          .filter(module => {
            // Se o módulo for masterOnly, só exibe se o usuário for master
            if (module.masterOnly) {
              return isMaster;
            }
            // Se o módulo for adminOnly, só exibe se o usuário for admin ou master
            if (module.adminOnly) {
              return isAdmin;
            }
            // Outros módulos são exibidos para todos
            return true;
          })
          .map((module, index) => (
            <Card
              key={index}
              className="w-full hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => navigate(module.route)}
              tabIndex={0}
            >
              <CardHeader className="flex flex-col items-center pb-2">
                <div className={`p-2 ${module.bgColor} rounded-lg mb-2`}>
                  <module.icon className={`h-8 w-8 md:h-10 md:w-10 ${module.iconColor}`} />
                </div>
                <CardTitle className="text-base md:text-lg text-center w-full truncate">{module.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center break-words">{module.description}</p>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
} 