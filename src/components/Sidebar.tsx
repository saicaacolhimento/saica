import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  LayoutDashboard,
  Users,
  Home,
  Shield,
  FileText,
  Calendar,
  Bell,
  MessageSquare,
  Settings,
  LogOut,
  UserCircle,
  BarChart2
} from 'lucide-react'

export function Sidebar() {
  const location = useLocation()
  const { signOut } = useAuth()

  const menuItems = [
    {
      title: 'Dashboard',
      icon: LayoutDashboard,
      href: '/',
      admin: false
    },
    {
      title: 'Usuários',
      icon: Users,
      href: '/usuarios',
      admin: true
    },
    {
      title: 'Abrigos',
      icon: Home,
      href: '/abrigos',
      admin: false
    },
    {
      title: 'Órgãos',
      icon: Shield,
      href: '/admin/orgaos',
      admin: false
    },
    {
      title: 'Permissões',
      icon: Shield,
      href: '/permissoes',
      admin: true
    },
    {
      title: 'Crianças',
      icon: UserCircle,
      href: '/admin/criancas',
      admin: false
    },
    {
      title: 'Documentos',
      icon: FileText,
      href: '/documentos',
      admin: false
    },
    {
      title: 'Agendamentos',
      icon: Calendar,
      href: '/agendamentos',
      admin: false
    },
    {
      title: 'Notificações',
      icon: Bell,
      href: '/notifications',
      admin: false
    },
    {
      title: 'Mensagens',
      icon: MessageSquare,
      href: '/mensagens',
      admin: false
    },
    {
      title: 'Configurações',
      icon: Settings,
      href: '/settings',
      admin: true
    },
    {
      title: 'Relatórios',
      icon: BarChart2,
      href: '/relatorios',
      admin: true
    }
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r">
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-semibold">SAICA</h1>
      </div>
      <nav className="flex-1 space-y-1 p-2">
        {menuItems.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant={location.pathname === item.href ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              <item.icon className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        ))}
      </nav>
      <div className="p-2">
        <button
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </div>
  )
} 