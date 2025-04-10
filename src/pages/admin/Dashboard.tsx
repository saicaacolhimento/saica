import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  Home,
  FileText,
  Settings,
  Activity,
  Building,
  FileBox,
  Baby
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simula um tempo de carregamento para garantir que todos os recursos estarão prontos
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const modules = [
    {
      title: 'Gestão de Abrigos',
      description: 'Cadastro e gerenciamento de abrigos',
      route: '/admin/abrigos',
      icon: Home,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Gestão de Crianças',
      description: 'Cadastro e acompanhamento de crianças',
      route: '/admin/criancas',
      icon: Baby,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Gestão de Usuários',
      description: 'Gerenciamento de usuários e permissões',
      route: '/admin/usuarios',
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Gestão de Órgãos',
      description: 'Cadastro e gerenciamento de órgãos externos',
      route: '/admin/orgaos',
      icon: Building,
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      title: 'Relatórios',
      description: 'Geração e visualização de relatórios',
      route: '/admin/relatorios',
      icon: FileText,
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

  if (isLoading || !user) {
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
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Bem-vindo, {user?.nome || 'Administrador'}</h1>
          <p className="text-gray-600">Acesso total ao sistema</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map((module, index) => (
          <Card 
            key={index} 
            className="hover:shadow-lg transition-shadow cursor-pointer" 
            onClick={() => navigate(module.route)}
          >
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <div className={`p-2 ${module.bgColor} rounded-lg`}>
                <module.icon className={`h-6 w-6 ${module.iconColor}`} />
              </div>
              <CardTitle className="text-lg">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 