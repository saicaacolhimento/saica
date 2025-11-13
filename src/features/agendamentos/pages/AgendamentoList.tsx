import { useState, useEffect } from 'react'
import { useAgendamento } from '@/hooks/useAgendamento'
import { AgendaCalendar } from '../components/AgendaCalendar'
import { AgendaDayList } from '../components/AgendaDayList'
import { AgendaForm } from '../components/AgendaForm'
import { Modal } from '@/components/Modal'
import { authService } from '@/services/auth'
import { acolhidoService } from '@/services/acolhido'

export default function AgendamentoList() {
  const {
    agendamentos = [],
    isLoadingAgendamentos,
    createAgendamento
  } = useAgendamento()

  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedAgendamento, setSelectedAgendamento] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [usuarios, setUsuarios] = useState<any[]>([])
  const [acolhidos, setAcolhidos] = useState<any[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const usuariosData = await authService.getAllUsuarios?.() || [];
        const acolhidosData = await acolhidoService.getAcolhidos();
        setUsuarios(usuariosData);
        setAcolhidos(acolhidosData || []);
      } catch (e) {
        setUsuarios([]);
        setAcolhidos([]);
      }
    }
    fetchData();
  }, []);

  // Função para comparar datas em horário local
  const isSameDayLocal = (d1, d2) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  // Filtra agendamentos do mês selecionado
  const agendamentosDoMes = agendamentos.filter((ag: any) => {
    const data = new Date(ag.data_hora || ag.data);
    return (
      data.getFullYear() === selectedDate.getFullYear() &&
      data.getMonth() === selectedDate.getMonth()
    );
  });

  // Eventos para o calendário
  const calendarEvents = agendamentos.map((ag: any) => ({
    id: ag.id,
    title: ag.titulo,
    start: new Date(ag.data_hora || ag.data),
    end: new Date(ag.data_hora || ag.data),
    resource: ag
  }))

  const handleSelectDay = (slotInfo: any) => {
    setSelectedDate(slotInfo.start || slotInfo)
    setSelectedAgendamento(null)
    setShowForm(false)
  }

  const handleSelectAgendamento = (ag: any) => {
    setSelectedAgendamento(ag)
    setShowForm(true)
  }

  const handleCreate = () => {
    setSelectedAgendamento(null)
    setShowForm(true)
  }

  const handleSave = (data: any) => {
    createAgendamento(data)
    setShowForm(false)
    setSelectedAgendamento(null)
  }

  const handleCancel = () => {
    setShowForm(false)
    setSelectedAgendamento(null)
  }

  if (isLoadingAgendamentos) {
    return <div>Carregando...</div>
  }

  return (
    <div className="flex gap-6 p-6 min-h-[80vh]">
      {/* Coluna do calendário */}
      <div className="w-[600px]">
        <AgendaCalendar
          events={calendarEvents}
          onSelectSlot={handleSelectDay}
          onSelectEvent={e => handleSelectAgendamento(e.resource)}
          selectedDate={selectedDate}
        />
      </div>
      {/* Coluna da lista do mês */}
      <div className="w-[430px]">
        <AgendaDayList
          agendamentos={agendamentosDoMes}
          onSelect={handleSelectAgendamento}
          onCreate={handleCreate}
        />
      </div>
      {/* Modal de formulário de agendamento */}
      <Modal open={showForm} onClose={handleCancel}>
        <AgendaForm
          initialData={selectedAgendamento}
          onSave={handleSave}
          onCancel={handleCancel}
          usuarios={usuarios}
          acolhidos={acolhidos}
        />
      </Modal>
    </div>
  )
} 