
import React from 'react';
import { Bell, Calendar, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";

const NotificationsPanel: React.FC = () => {
  // Placeholder data
  const notifications = [
    { id: 1, type: 'appointment', title: 'Consulta Médica', message: 'João tem consulta com Dr. Silva às 14:00', time: '1h atrás' },
    { id: 2, type: 'message', title: 'Nova mensagem', message: 'CREAS enviou uma atualização sobre Maria', time: '3h atrás' },
    { id: 3, type: 'appointment', title: 'Audiência', message: 'Audiência de Pedro marcada para amanhã às 10:00', time: '5h atrás' },
  ];

  return (
    <div className="hidden md:block w-80 border-l bg-white overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-saica-blue">Notificações</h3>
      </div>
      <div className="divide-y">
        {notifications.map((notification) => (
          <div key={notification.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="mr-3 mt-1">
                {notification.type === 'appointment' ? (
                  <Calendar className="h-5 w-5 text-saica-blue" />
                ) : (
                  <MessageSquare className="h-5 w-5 text-saica-blue" />
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full" size="sm">
          <Bell className="h-4 w-4 mr-2" />
          Ver todas as notificações
        </Button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
