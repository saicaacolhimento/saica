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
        description: 'Relatório criado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao criar relatório',
        variant: 'destructive'
      })
      console.error(error)
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
        description: 'Relatório atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar relatório',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteRelatorioMutation = useMutation({
    mutationFn: relatorioService.deleteRelatorio,
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['relatorios'] })
      queryClient.invalidateQueries({ queryKey: ['relatorio', id] })
      toast({
        title: 'Sucesso',
        description: 'Relatório excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir relatório',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const gerarPDFMutation = useMutation({
    mutationFn: relatorioService.gerarPDF,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relatório PDF gerado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relatório PDF',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const gerarExcelMutation = useMutation({
    mutationFn: relatorioService.gerarExcel,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relatório Excel gerado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relatório Excel',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const gerarCSVMutation = useMutation({
    mutationFn: relatorioService.gerarCSV,
    onSuccess: (url) => {
      window.open(url, '_blank')
      toast({
        title: 'Sucesso',
        description: 'Relatório CSV gerado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao gerar relatório CSV',
        variant: 'destructive'
      })
      console.error(error)
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