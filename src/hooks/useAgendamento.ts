import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { agendamentoService } from '@/services/agendamento'
import { useToast } from '@/components/ui/use-toast'
import { CreateAgendamentoData, UpdateAgendamentoData } from '@/types/agendamento'

export const useAgendamento = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const { data: agendamentos, isLoading: isLoadingAgendamentos } = useQuery({
    queryKey: ['agendamentos'],
    queryFn: agendamentoService.getAgendamentos
  })

  const getAgendamentoById = (id: string) => {
    return useQuery({
      queryKey: ['agendamento', id],
      queryFn: () => agendamentoService.getAgendamentoById(id)
    })
  }

  const getAgendamentosByAcolhido = (acolhidoId: string) => {
    return useQuery({
      queryKey: ['agendamentos', 'acolhido', acolhidoId],
      queryFn: () => agendamentoService.getAgendamentosByAcolhido(acolhidoId)
    })
  }

  const getAgendamentosByProfissional = (profissionalId: string) => {
    return useQuery({
      queryKey: ['agendamentos', 'profissional', profissionalId],
      queryFn: () => agendamentoService.getAgendamentosByProfissional(profissionalId)
    })
  }

  // Mutations
  const createAgendamentoMutation = useMutation({
    mutationFn: agendamentoService.createAgendamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
      toast({
        title: 'Sucesso',
        description: 'Agendamento cadastrado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar agendamento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateAgendamentoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAgendamentoData }) =>
      agendamentoService.updateAgendamento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
      toast({
        title: 'Sucesso',
        description: 'Agendamento atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar agendamento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteAgendamentoMutation = useMutation({
    mutationFn: agendamentoService.deleteAgendamento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agendamentos'] })
      toast({
        title: 'Sucesso',
        description: 'Agendamento excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir agendamento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    agendamentos,
    isLoadingAgendamentos,
    getAgendamentoById,
    getAgendamentosByAcolhido,
    getAgendamentosByProfissional,
    createAgendamento: createAgendamentoMutation.mutate,
    updateAgendamento: updateAgendamentoMutation.mutate,
    deleteAgendamento: deleteAgendamentoMutation.mutate
  }
} 