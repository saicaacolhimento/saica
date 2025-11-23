import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Settings,
  LogOut,
  Activity,
  FileBox,
  Baby,
  Calendar,
  DollarSign
} from 'lucide-react';
import logoSaica from '@/assets/images/logo-saica.png';
import { useEffect, useState } from 'react';
import { authService } from '@/services/auth';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string | null>(null);

  // ⚠️ CRÍTICO: Buscar role do usuário para filtrar menu
  useEffect(() => {
    async function fetchUserRole() {
      const currentUser = await authService.getCurrentUser();
      setUserRole(currentUser?.role || null);
    }
    if (user) {
      fetchUserRole();
    }
  }, [user]);

  // ⚠️ CRÍTICO: Detecção de master
  const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Home, label: 'Empresas', route: '/admin/empresas', masterOnly: true }, // ⚠️ CRÍTICO: Apenas master
    { icon: Users, label: 'Usuários', route: '/admin/usuarios' },
    { icon: Baby, label: 'Acolhidos', route: '/admin/criancas' },
    { icon: Calendar, label: 'Agenda', route: '/admin/agenda' },
    { icon: DollarSign, label: 'Financeiro', route: '/admin/financeiro' },
    { icon: FileBox, label: 'Documentos', route: '/admin/documentos' },
    { icon: Activity, label: 'Atividades', route: '/admin/atividades' },
    { icon: Settings, label: 'Configurações', route: '/admin/configuracoes' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E293B] text-white flex flex-col h-screen">
        <div className="p-4 flex flex-col items-center">
          <Link to="/admin/dashboard" className="flex items-center">
            <img src={logoSaica} alt="Logo SAICA" className="h-28 w-auto" />
          </Link>
          <div className="mt-4 bg-[#2D3B4E] rounded-lg p-3 w-full text-center">
            <p className="text-sm opacity-70">Logado como</p>
            <p className="font-medium truncate">{user?.nome}</p>
            <p className="text-xs opacity-70">{user?.email}</p>
          </div>
        </div>
        
        <nav className="space-y-1 px-2">
          {/* ⚠️ CRÍTICO: Filtrar menu baseado em isMaster - "Empresas" apenas para master */}
          {menuItems
            .filter(item => {
              // Se o item tem masterOnly, só mostra para master
              if (item.masterOnly) {
                return isMaster;
              }
              // Caso contrário, mostra para todos
              return true;
            })
            .map((item, index) => (
              <Link
                key={index}
                to={item.route}
                className="flex items-center space-x-2 px-4 py-2 text-sm rounded-lg hover:bg-[#2D3B4E] transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            ))}
        </nav>

        <div className="mt-auto w-64 p-2">
          <Button
            variant="ghost"
            className="w-full text-white hover:bg-[#2D3B4E] justify-start space-x-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Sair</span>
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50">
        <div className="h-16 bg-white border-b flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-gray-800">
            Sistema de Acompanhamento Integrado de Crianças e Adolescentes
          </h1>
        </div>
        
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
} 