import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAgendamento } from '@/hooks/useAgendamento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { ArrowLeft, Save, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function AgendamentoDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    data_hora: '',
    tipo: '',
    acolhido_id: '',
    profissional_id: '',
    local: '',
    observacoes: '',
    status: ''
  })

  const {
    agendamento,
    isLoadingAgendamento,
    updateAgendamento,
    deleteAgendamento
  } = useAgendamento()

  useEffect(() => {
    if (agendamento) {
      setFormData({
        titulo: agendamento.titulo,
        descricao: agendamento.descricao || '',
        data_hora: agendamento.data_hora,
        tipo: agendamento.tipo,
        acolhido_id: agendamento.acolhido_id,
        profissional_id: agendamento.profissional_id,
        local: agendamento.local,
        observacoes: agendamento.observacoes || '',
        status: agendamento.status
      })
    }
  }, [agendamento])

  const handleUpdateAgendamento = async () => {
    await updateAgendamento(id!, formData)
    setIsEditing(false)
  }

  const handleDeleteAgendamento = async () => {
    if (window.confirm('Tem certeza que deseja excluir este agendamento?')) {
      await deleteAgendamento(id!)
      navigate('/agendamentos')
    }
  }

  if (isLoadingAgendamento) {
    return <div>Carregando...</div>
  }

  if (!agendamento) {
    return <div>Agendamento não encontrado</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/agendamentos')}
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Agendamento</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="titulo">Título</Label>
            {isEditing ? (
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{agendamento.titulo}</p>
            )}
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            {isEditing ? (
              <Input
                id="descricao"
                value={formData.descricao}
                onChange={(e) =>
                  setFormData({ ...formData, descricao: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{agendamento.descricao || '-'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="data_hora">Data/Hora</Label>
            {isEditing ? (
              <Input
                id="data_hora"
                type="datetime-local"
                value={formData.data_hora}
                onChange={(e) =>
                  setFormData({ ...formData, data_hora: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">
                {format(new Date(agendamento.data_hora), 'dd/MM/yyyy HH:mm', {
                  locale: ptBR
                })}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            {isEditing ? (
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
            ) : (
              <p className="text-gray-700">{agendamento.tipo}</p>
            )}
          </div>

          <div>
            <Label htmlFor="acolhido">Acolhido</Label>
            {isEditing ? (
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
            ) : (
              <p className="text-gray-700">{agendamento.acolhido_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="profissional">Profissional</Label>
            {isEditing ? (
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
            ) : (
              <p className="text-gray-700">{agendamento.profissional_id}</p>
            )}
          </div>

          <div>
            <Label htmlFor="local">Local</Label>
            {isEditing ? (
              <Input
                id="local"
                value={formData.local}
                onChange={(e) =>
                  setFormData({ ...formData, local: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{agendamento.local}</p>
            )}
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            {isEditing ? (
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
              />
            ) : (
              <p className="text-gray-700">{agendamento.observacoes || '-'}</p>
            )}
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            {isEditing ? (
              <Select
                id="status"
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
              >
                <option value="agendado">Agendado</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
                <option value="concluido">Concluído</option>
              </Select>
            ) : (
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
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancelar
              </Button>
              <Button onClick={handleUpdateAgendamento}>
                <Save className="w-4 h-4 mr-2" />
                Salvar
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Editar
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteAgendamento}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 