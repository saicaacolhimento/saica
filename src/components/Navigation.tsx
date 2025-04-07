
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Users, 
  CalendarDays, 
  Bell, 
  FileText, 
  Settings
} from "lucide-react";

const Navigation: React.FC = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link to="/home" className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
            <Home className="h-4 w-4" />
            <span>Início</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Acolhidos</span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/home/acolhidos/cadastro"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Novo Cadastro</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Cadastrar um novo acolhido no sistema
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink asChild>
                  <Link
                    to="/home/acolhidos/lista"
                    className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div className="text-sm font-medium leading-none">Lista de Acolhidos</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Visualizar e gerenciar todos os acolhidos cadastrados
                    </p>
                  </Link>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/home/agenda" className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
            <CalendarDays className="h-4 w-4" />
            <span>Agenda</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/home/notificacoes" className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
            <Bell className="h-4 w-4" />
            <span>Notificações</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/home/relatorios" className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
            <FileText className="h-4 w-4" />
            <span>Relatórios</span>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/home/configuracoes" className={cn(navigationMenuTriggerStyle(), "flex items-center gap-2")}>
            <Settings className="h-4 w-4" />
            <span>Configurações</span>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navigation;
