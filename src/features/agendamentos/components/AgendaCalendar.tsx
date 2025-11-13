import React from 'react';
import { Calendar, momentLocalizer, ToolbarProps } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/pt-br';
import 'react-big-calendar/lib/css/react-big-calendar.css';

moment.locale('pt-br');
const localizer = momentLocalizer(moment);

const messages = {
  date: 'Data',
  time: 'Hora',
  event: 'Evento',
  allDay: 'Dia inteiro',
  week: 'Semana',
  work_week: 'Semana útil',
  day: 'Dia',
  month: 'Mês',
  previous: 'Voltar',
  next: 'Próximo',
  yesterday: 'Ontem',
  tomorrow: 'Amanhã',
  today: 'Hoje',
  agenda: 'Agenda',
  noEventsInRange: 'Nenhum agendamento neste período.',
  showMore: total => `+${total} mais`,
};

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

interface AgendaCalendarProps {
  events: any[];
  onSelectSlot: (slotInfo: any) => void;
  onSelectEvent: (event: any) => void;
  selectedDate: Date;
}

const CustomToolbar: React.FC<ToolbarProps> = (props) => {
  const mes = meses[props.date.getMonth()];
  const ano = props.date.getFullYear();
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex gap-2">
        <button onClick={() => props.onNavigate('PREV')} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Voltar</button>
        <button onClick={() => props.onNavigate('TODAY')} className="bg-blue-400 text-white px-3 py-1 rounded hover:bg-blue-500">Hoje</button>
        <button onClick={() => props.onNavigate('NEXT')} className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">Próximo</button>
      </div>
      <div className="font-bold text-lg">{mes} de {ano}</div>
    </div>
  );
};

export const AgendaCalendar: React.FC<AgendaCalendarProps> = ({ events, onSelectSlot, onSelectEvent, selectedDate }) => {
  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        views={['month']}
        onSelectSlot={onSelectSlot}
        onSelectEvent={onSelectEvent}
        date={selectedDate}
        onNavigate={date => onSelectSlot({ start: date, end: date })}
        style={{ background: '#fff', borderRadius: 8 }}
        messages={messages}
        culture="pt-BR"
        components={{ toolbar: CustomToolbar }}
        formats={{
          weekdayFormat: (date) => diasSemana[date.getDay()],
          dayFormat: (date) => String(date.getDate()).padStart(2, '0'),
        }}
      />
    </div>
  );
}; 