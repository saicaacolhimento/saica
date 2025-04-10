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
  Building,
  FileBox,
  Baby
} from 'lucide-react';

export default function AdminLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Home, label: 'Abrigos', route: '/admin/abrigos' },
    { icon: Baby, label: 'Crianças', route: '/admin/criancas' },
    { icon: Users, label: 'Usuários', route: '/admin/usuarios' },
    { icon: Building, label: 'Órgãos', route: '/admin/orgaos' },
    { icon: FileText, label: 'Relatórios', route: '/admin/relatorios' },
    { icon: FileBox, label: 'Documentos', route: '/admin/documentos' },
    { icon: Activity, label: 'Atividades', route: '/admin/atividades' },
    { icon: Settings, label: 'Configurações', route: '/admin/configuracoes' }
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#1E293B] text-white">
        <div className="p-4">
          <Link to="/admin/dashboard" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-white text-[#1E293B] h-8 w-8 flex items-center justify-center rounded-md">S</span>
            <span className="text-xl font-bold">SAICA</span>
          </Link>
        </div>
        
        <div className="px-4 py-2">
          <div className="bg-[#2D3B4E] rounded-lg p-3 mb-4">
            <p className="text-sm opacity-70">Logado como</p>
            <p className="font-medium truncate">{user?.nome}</p>
            <p className="text-xs opacity-70">{user?.email}</p>
          </div>
        </div>

        <nav className="space-y-1 px-2">
          {menuItems.map((item, index) => (
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

        <div className="absolute bottom-0 w-64 p-4">
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