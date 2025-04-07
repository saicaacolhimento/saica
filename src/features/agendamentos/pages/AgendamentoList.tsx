import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAgendamento } from '@/hooks/useAgendamento'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Calendar, Search, Plus, Trash2, Edit, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function AgendamentoList() {
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_hora: '',
    tipo: '',
    acolhido_id: '',
    profissional_id: '',
    local: '',
    observacoes: ''
  })

  const {
    agendamentos,
    isLoadingAgendamentos,
    createAgendamento,
    deleteAgendamento
  } = useAgendamento()

  const handleCreateAgendamento = async () => {
    await createAgendamento(formData)

    setIsCreateOpen(false)
    setFormData({
      titulo: '',
      descricao: '',
      data_hora: '',
      tipo: '',
      acolhido_id: '',
      profissional_id: '',
      local: '',
      observacoes: ''
    })
  }

  const handleDeleteAgendamento = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteAgendamento(id)
    }
  }

  const filteredAgendamentos = agendamentos?.filter((agendamento) =>
    agendamento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agendamento.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoadingAgendamentos) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar agendamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Data/Hora</th>
            <th>Tipo</th>
            <th>Status</th>
            <th>Local</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredAgendamentos?.map((agendamento) => (
            <tr key={agendamento.id}>
              <td>{agendamento.titulo}</td>
              <td>
                {format(new Date(agendamento.data_hora), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR
                })}
              </td>
              <td>{agendamento.tipo}</td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    agendamento.status === 'agendado'
                      ? 'bg-yellow-100 text-yellow-800'
                      : agendamento.status === 'confirmado'
                      ? 'bg-green-100 text-green-800'
                      : agendamento.status === 'cancelado'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {agendamento.status === 'agendado'
                    ? 'Agendado'
                    : agendamento.status === 'confirmado'
                    ? 'Confirmado'
                    : agendamento.status === 'cancelado'
                    ? 'Cancelado'
                    : 'Concluído'}
                </span>
              </td>
              <td>{agendamento.local}</td>
              <td>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/agendamentos/${agendamento.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/agendamentos/${agendamento.id}/editar`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteAgendamento(agendamento.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Novo Agendamento</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="data_hora">Data/Hora</Label>
              <Input
                id="data_hora"
                type="datetime-local"
                value={formData.data_hora}
                onChange={(e) =>
                  setFormData({ ...formData, data_hora: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select
                id="tipo"
                value={formData.tipo}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipo: value })
                }
              >
                <option value="">Selecione um tipo</option>
                <option value="consulta">Consulta</option>
                <option value="exame">Exame</option>
                <option value="procedimento">Procedimento</option>
                <option value="outros">Outros</option>
              </Select>
            </div>
            <div>
              <Label htmlFor="acolhido">Acolhido</Label>
              <Select
                id="acolhido"
                value={formData.acolhido_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, acolhido_id: value })
                }
              >
                <option value="">Selecione um acolhido</option>
                {/* TODO: Adicionar lista de acolhidos */}
              </Select>
            </div>
            <div>
              <Label htmlFor="profissional">Profissional</Label>
              <Select
                id="profissional"
                value={formData.profissional_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, profissional_id: value })
                }
              >
                <option value="">Selecione um profissional</option>
                {/* TODO: Adicionar lista de profissionais */}
              </Select>
            </div>
            <div>
              <Label htmlFor="local">Local</Label>
              <Input
                id="local"
                value={formData.local}
                onChange={(e) =>
                  setFormData({ ...formData, local: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateAgendamento}>
              Criar Agendamento
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 