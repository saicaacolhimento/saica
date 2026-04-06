import { useState, useEffect, useCallback } from 'react';
import { Bell, Calendar, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  lida: boolean;
  agendamento_id?: string;
  created_at: string;
}

export function NotificationBell() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [open, setOpen] = useState(false);

  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const fetchNotificacoes = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('notificacoes')
      .select('*')
      .eq('destinatario_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (data) setNotificacoes(data);
  }, [user?.id]);

  useEffect(() => {
    fetchNotificacoes();
  }, [fetchNotificacoes]);

  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notificacoes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notificacoes',
          filter: `destinatario_id=eq.${user.id}`,
        },
        (payload) => {
          setNotificacoes(prev => [payload.new as Notificacao, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const marcarComoLida = async (id: string) => {
    await supabase.from('notificacoes').update({ lida: true }).eq('id', id);
    setNotificacoes(prev => prev.map(n => n.id === id ? { ...n, lida: true } : n));
  };

  const marcarTodasComoLidas = async () => {
    const ids = notificacoes.filter(n => !n.lida).map(n => n.id);
    if (ids.length === 0) return;
    await supabase.from('notificacoes').update({ lida: true }).in('id', ids);
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const tempoRelativo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const min = Math.floor(diff / 60000);
    if (min < 1) return 'agora';
    if (min < 60) return `${min}min`;
    const hrs = Math.floor(min / 60);
    if (hrs < 24) return `${hrs}h`;
    const dias = Math.floor(hrs / 24);
    return `${dias}d`;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          {naoLidas > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {naoLidas > 99 ? '99+' : naoLidas}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notificações</h4>
          {naoLidas > 0 && (
            <button
              onClick={marcarTodasComoLidas}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Marcar todas como lidas
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notificacoes.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              Nenhuma notificação
            </div>
          ) : (
            notificacoes.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors ${!n.lida ? 'bg-blue-50/50' : ''}`}
                onClick={() => !n.lida && marcarComoLida(n.id)}
              >
                <div className="mt-0.5">
                  {n.tipo === 'agendamento' ? (
                    <Calendar className="h-4 w-4 text-indigo-500" />
                  ) : (
                    <Bell className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm truncate ${!n.lida ? 'font-semibold' : ''}`}>{n.titulo}</p>
                    {!n.lida && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{n.mensagem}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{tempoRelativo(n.created_at)}</p>
                </div>
                {!n.lida && (
                  <button
                    onClick={(e) => { e.stopPropagation(); marcarComoLida(n.id); }}
                    className="mt-1 p-1 rounded hover:bg-gray-200"
                    title="Marcar como lida"
                  >
                    <Check className="h-3 w-3 text-gray-400" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
