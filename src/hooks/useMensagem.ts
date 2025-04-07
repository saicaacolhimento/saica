import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { mensagemService } from '@/services/mensagem'
import { useToast } from '@/components/ui/use-toast'
import { CreateMensagemData, UpdateMensagemData, CreateConversaData, UpdateConversaData } from '@/types/mensagem'

export const useMensagem = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const getMensagens = (conversaId: string) => {
    return useQuery({
      queryKey: ['mensagens', conversaId],
      queryFn: () => mensagemService.getMensagens(conversaId)
    })
  }

  const getMensagemById = (id: string) => {
    return useQuery({
      queryKey: ['mensagem', id],
      queryFn: () => mensagemService.getMensagemById(id)
    })
  }

  const getConversas = (usuarioId: string) => {
    return useQuery({
      queryKey: ['conversas', usuarioId],
      queryFn: () => mensagemService.getConversas(usuarioId)
    })
  }

  const getConversaById = (id: string) => {
    return useQuery({
      queryKey: ['conversa', id],
      queryFn: () => mensagemService.getConversaById(id)
    })
  }

  // Mutations
  const createMensagemMutation = useMutation({
    mutationFn: mensagemService.createMensagem,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', variables.conversa_id] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Mensagem enviada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao enviar mensagem',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateMensagemMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMensagemData }) =>
      mensagemService.updateMensagem(id, data),
    onSuccess: (mensagem) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', mensagem.conversa_id] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Mensagem atualizada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar mensagem',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteMensagemMutation = useMutation({
    mutationFn: mensagemService.deleteMensagem,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens'] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Mensagem excluída com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir mensagem',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const marcarComoLidaMutation = useMutation({
    mutationFn: mensagemService.marcarComoLida,
    onSuccess: (mensagem) => {
      queryClient.invalidateQueries({ queryKey: ['mensagens', mensagem.conversa_id] })
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Mensagem marcada como lida'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao marcar mensagem como lida',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const createConversaMutation = useMutation({
    mutationFn: mensagemService.createConversa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Conversa criada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar conversa',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateConversaMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConversaData }) =>
      mensagemService.updateConversa(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      toast({
        title: 'Sucesso',
        description: 'Conversa atualizada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar conversa',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteConversaMutation = useMutation({
    mutationFn: mensagemService.deleteConversa,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversas'] })
      queryClient.invalidateQueries({ queryKey: ['mensagens'] })
      toast({
        title: 'Sucesso',
        description: 'Conversa excluída com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir conversa',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    getMensagens,
    getMensagemById,
    getConversas,
    getConversaById,
    createMensagem: createMensagemMutation.mutate,
    updateMensagem: updateMensagemMutation.mutate,
    deleteMensagem: deleteMensagemMutation.mutate,
    marcarComoLida: marcarComoLidaMutation.mutate,
    createConversa: createConversaMutation.mutate,
    updateConversa: updateConversaMutation.mutate,
    deleteConversa: deleteConversaMutation.mutate
  }
} 