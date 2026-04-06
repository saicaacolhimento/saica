import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { relatorioService } from '@/services/relatorio'
import { useToast } from '@/components/ui/use-toast'
import { CreateRelatorioData, UpdateRelatorioData } from '@/types/relatorio'

export const useRelatorio = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const getRelatorios = () => {
    return useQuery({
      queryKey: ['relatorios'],
      queryFn: () => relatorioService.getRelatorios()
    })
  }

  const getRelatorioById = (id: string) => {
    return useQuery({
      queryKey: ['relatorio', id],
      queryFn: () => relatorioService.getRelatorioById(id)
    })
  }

  const getEstatisticas = () => {
    return useQuery({
      queryKey: ['relatorio-estatisticas'],
      queryFn: () => relatorioService.getEstatisticas()
    })
  }

  // Mutations
  const createRelatorioMutation = useMutation({
    mutationFn: relatorioService.createRelatorio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      toast({
        title: 'Sucesso',
        description: 'Relat?rio criado com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar relat?rio',
        variant: 'destructive'
      })
    }
  })

  const updateRelatorioMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRelatorioData }) =>
      relatorioService.updateRelatorio(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      queryClient.invalidateQueries({ queryKey: ['relatorio', variables.id] })
      toast({
        title: 'Sucesso',
        description: 'Relat?rio atualizado com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar relat?rio',
        variant: 'destructive'
      })
    }
  })

  const deleteRelatorioMutation = useMutation({
    mutationFn: relatorioService.deleteRelatorio,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      queryClient.invalidateQueries({ queryKey: ['relatorio', id] })
      toast({
        title: 'Sucesso',
        description: 'Relat?rio exclu?do com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir relat?rio',
        variant: 'destructive'
      })
    }
  })

  const gerarPDFMutation = useMutation({
    mutationFn: relatorioService.gerarPDF,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relat?rio PDF gerado com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relat?rio PDF',
        variant: 'destructive'
      })
    }
  })

  const gerarExcelMutation = useMutation({
    mutationFn: relatorioService.gerarExcel,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relat?rio Excel gerado com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relat?rio Excel',
        variant: 'destructive'
      })
    }
  })

  const gerarCSVMutation = useMutation({
    mutationFn: relatorioService.gerarCSV,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relat?rio CSV gerado com sucesso'
      })
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relat?rio CSV',
        variant: 'destructive'
      })
    }
  })

  return {
    getRelatorios,
    getRelatorioById,
    getEstatisticas,
    createRelatorio: createRelatorioMutation.mutate,
    updateRelatorio: updateRelatorioMutation.mutate,
    deleteRelatorio: deleteRelatorioMutation.mutate,
    gerarPDF: gerarPDFMutation.mutate,
    gerarExcel: gerarExcelMutation.mutate,
    gerarCSV: gerarCSVMutation.mutate
  }
} 