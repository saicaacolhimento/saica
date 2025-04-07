import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { notificacaoService } from '@/services/notificacao'
import { useToast } from '@/components/ui/use-toast'
import { CreateNotificacaoData, UpdateNotificacaoData, CreateNotificacaoTemplateData, UpdateNotificacaoTemplateData } from '@/types/notificacao'

export const useNotificacao = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const { data: notificacoes, isLoading: isLoadingNotificacoes } = useQuery({
    queryKey: ['notificacoes'],
    queryFn: notificacaoService.getNotificacoes
  })

  const getNotificacaoById = (id: string) => {
    return useQuery({
      queryKey: ['notificacao', id],
      queryFn: () => notificacaoService.getNotificacaoById(id)
    })
  }

  const getNotificacoesByDestinatario = (destinatarioId: string, destinatarioTipo: 'usuario' | 'acolhido' | 'profissional') => {
    return useQuery({
      queryKey: ['notificacoes', 'destinatario', destinatarioId, destinatarioTipo],
      queryFn: () => notificacaoService.getNotificacoesByDestinatario(destinatarioId, destinatarioTipo)
    })
  }

  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['notificacao_templates'],
    queryFn: notificacaoService.getTemplates
  })

  const getTemplateById = (id: string) => {
    return useQuery({
      queryKey: ['notificacao_template', id],
      queryFn: () => notificacaoService.getTemplateById(id)
    })
  }

  // Mutations
  const createNotificacaoMutation = useMutation({
    mutationFn: notificacaoService.createNotificacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] })
      toast({
        title: 'Sucesso',
        description: 'Notificação criada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar notificação',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateNotificacaoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificacaoData }) =>
      notificacaoService.updateNotificacao(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] })
      toast({
        title: 'Sucesso',
        description: 'Notificação atualizada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar notificação',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteNotificacaoMutation = useMutation({
    mutationFn: notificacaoService.deleteNotificacao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] })
      toast({
        title: 'Sucesso',
        description: 'Notificação excluída com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir notificação',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const marcarComoLidaMutation = useMutation({
    mutationFn: notificacaoService.marcarComoLida,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacoes'] })
      toast({
        title: 'Sucesso',
        description: 'Notificação marcada como lida'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao marcar notificação como lida',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const createTemplateMutation = useMutation({
    mutationFn: notificacaoService.createTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacao_templates'] })
      toast({
        title: 'Sucesso',
        description: 'Template criado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar template',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificacaoTemplateData }) =>
      notificacaoService.updateTemplate(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacao_templates'] })
      toast({
        title: 'Sucesso',
        description: 'Template atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar template',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteTemplateMutation = useMutation({
    mutationFn: notificacaoService.deleteTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificacao_templates'] })
      toast({
        title: 'Sucesso',
        description: 'Template excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir template',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    notificacoes,
    isLoadingNotificacoes,
    getNotificacaoById,
    getNotificacoesByDestinatario,
    createNotificacao: createNotificacaoMutation.mutate,
    updateNotificacao: updateNotificacaoMutation.mutate,
    deleteNotificacao: deleteNotificacaoMutation.mutate,
    marcarComoLida: marcarComoLidaMutation.mutate,
    templates,
    isLoadingTemplates,
    getTemplateById,
    createTemplate: createTemplateMutation.mutate,
    updateTemplate: updateTemplateMutation.mutate,
    deleteTemplate: deleteTemplateMutation.mutate
  }
} 