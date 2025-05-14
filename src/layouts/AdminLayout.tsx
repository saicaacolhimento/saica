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
  Baby
} from 'lucide-react';

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', route: '/admin/dashboard' },
    { icon: Home, label: 'Empresas', route: '/admin/empresas' },
    { icon: Users, label: 'Usuários', route: '/admin/usuarios' },
    { icon: Baby, label: 'Acolhido', route: '/admin/criancas' },
    { icon: FileText, label: 'Relatórios', route: '/admin/relatorios' },
    { icon: FileBox, label: 'Documentos', route: '/admin/documentos' },
    { icon: Activity, label: 'Atividades', route: '/admin/atividades' },
    { icon: Settings, label: 'Configurações', route: '/admin/configuracoes' }
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4">
            <h1 className="text-xl font-bold text-saica-blue">SAICA</h1>
          </div>
          <nav className="mt-4">
            {menuItems.map((item) => (
              <Link
                key={item.route}
                to={item.route}
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 w-64 p-4">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 