
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  Home, 
  Users, 
  CalendarDays, 
  Bell, 
  FileText, 
  Settings
} from "lucide-react";

const MobileMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  
  const menuItems = [
    { label: 'Início', icon: <Home className="h-5 w-5" />, path: '/home' },
    { label: 'Acolhidos', icon: <Users className="h-5 w-5" />, path: '/home/acolhidos/lista' },
    { label: 'Agenda', icon: <CalendarDays className="h-5 w-5" />, path: '/home/agenda' },
    { label: 'Notificações', icon: <Bell className="h-5 w-5" />, path: '/home/notificacoes' },
    { label: 'Relatórios', icon: <FileText className="h-5 w-5" />, path: '/home/relatorios' },
    { label: 'Configurações', icon: <Settings className="h-5 w-5" />, path: '/home/configuracoes' },
  ];
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <div className="py-4 bg-saica-blue text-white">
          <h2 className="text-center font-semibold">Menu SAICA</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  to={item.path} 
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
