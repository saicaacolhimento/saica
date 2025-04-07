import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { configuracaoService } from '@/services/configuracao'
import { useToast } from '@/components/ui/use-toast'
import {
  CreateConfiguracaoData,
  UpdateConfiguracaoData,
  CreateBackupConfig,
  UpdateBackupConfig
} from '@/types/configuracao'

export const useConfiguracao = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const getConfiguracoes = () => {
    return useQuery({
      queryKey: ['configuracoes'],
      queryFn: () => configuracaoService.getConfiguracoes()
    })
  }

  const getConfiguracaoById = (id: string) => {
    return useQuery({
      queryKey: ['configuracao', id],
      queryFn: () => configuracaoService.getConfiguracaoById(id)
    })
  }

  const getConfiguracaoByChave = (chave: string) => {
    return useQuery({
      queryKey: ['configuracao', chave],
      queryFn: () => configuracaoService.getConfiguracaoByChave(chave)
    })
  }

  const getBackups = () => {
    return useQuery({
      queryKey: ['backups'],
      queryFn: () => configuracaoService.getBackups()
    })
  }

  const getBackupById = (id: string) => {
    return useQuery({
      queryKey: ['backup', id],
      queryFn: () => configuracaoService.getBackupById(id)
    })
  }

  const getEmailConfig = () => {
    return useQuery({
      queryKey: ['email-config'],
      queryFn: () => configuracaoService.getEmailConfig()
    })
  }

  const getSMSConfig = () => {
    return useQuery({
      queryKey: ['sms-config'],
      queryFn: () => configuracaoService.getSMSConfig()
    })
  }

  const getWhatsAppConfig = () => {
    return useQuery({
      queryKey: ['whatsapp-config'],
      queryFn: () => configuracaoService.getWhatsAppConfig()
    })
  }

  const getSecurityConfig = () => {
    return useQuery({
      queryKey: ['security-config'],
      queryFn: () => configuracaoService.getSecurityConfig()
    })
  }

  // Mutations
  const createConfiguracaoMutation = useMutation({
    mutationFn: configuracaoService.createConfiguracao,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
      toast({
        title: 'Sucesso',
        description: 'Configuração criada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar configuração',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateConfiguracaoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateConfiguracaoData }) =>
      configuracaoService.updateConfiguracao(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
      queryClient.invalidateQueries({ queryKey: ['configuracao', variables.id] })
      toast({
        title: 'Sucesso',
        description: 'Configuração atualizada com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar configuração',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteConfiguracaoMutation = useMutation({
    mutationFn: configuracaoService.deleteConfiguracao,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['configuracoes'] })
      queryClient.invalidateQueries({ queryKey: ['configuracao', id] })
      toast({
        title: 'Sucesso',
        description: 'Configuração excluída com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir configuração',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const createBackupMutation = useMutation({
    mutationFn: configuracaoService.createBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      toast({
        title: 'Sucesso',
        description: 'Backup criado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar backup',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateBackupMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBackupConfig }) =>
      configuracaoService.updateBackup(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      queryClient.invalidateQueries({ queryKey: ['backup', variables.id] })
      toast({
        title: 'Sucesso',
        description: 'Backup atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar backup',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteBackupMutation = useMutation({
    mutationFn: configuracaoService.deleteBackup,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      queryClient.invalidateQueries({ queryKey: ['backup', id] })
      toast({
        title: 'Sucesso',
        description: 'Backup excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir backup',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const gerarBackupMutation = useMutation({
    mutationFn: configuracaoService.gerarBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      toast({
        title: 'Sucesso',
        description: 'Backup gerado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar backup',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const restaurarBackupMutation = useMutation({
    mutationFn: configuracaoService.restaurarBackup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['backups'] })
      toast({
        title: 'Sucesso',
        description: 'Backup restaurado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao restaurar backup',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    getConfiguracoes,
    getConfiguracaoById,
    getConfiguracaoByChave,
    getBackups,
    getBackupById,
    getEmailConfig,
    getSMSConfig,
    getWhatsAppConfig,
    getSecurityConfig,
    createConfiguracao: createConfiguracaoMutation.mutate,
    updateConfiguracao: updateConfiguracaoMutation.mutate,
    deleteConfiguracao: deleteConfiguracaoMutation.mutate,
    createBackup: createBackupMutation.mutate,
    updateBackup: updateBackupMutation.mutate,
    deleteBackup: deleteBackupMutation.mutate,
    gerarBackup: gerarBackupMutation.mutate,
    restaurarBackup: restaurarBackupMutation.mutate
  }
} 