import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { documentoService } from '@/services/documento'
import { useToast } from '@/components/ui/use-toast'
import { CreateDocumentoData, UpdateDocumentoData } from '@/types/documento'

export const useDocumento = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const { data: documentos, isLoading: isLoadingDocumentos } = useQuery({
    queryKey: ['documentos'],
    queryFn: documentoService.getDocumentos
  })

  const getDocumentoById = (id: string) => {
    return useQuery({
      queryKey: ['documento', id],
      queryFn: () => documentoService.getDocumentoById(id)
    })
  }

  const getDocumentosByAcolhido = (acolhidoId: string) => {
    return useQuery({
      queryKey: ['documentos', 'acolhido', acolhidoId],
      queryFn: () => documentoService.getDocumentosByAcolhido(acolhidoId)
    })
  }

  // Mutations
  const createDocumentoMutation = useMutation({
    mutationFn: documentoService.createDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast({
        title: 'Sucesso',
        description: 'Documento cadastrado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar documento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateDocumentoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDocumentoData }) =>
      documentoService.updateDocumento(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast({
        title: 'Sucesso',
        description: 'Documento atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar documento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteDocumentoMutation = useMutation({
    mutationFn: documentoService.deleteDocumento,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] })
      toast({
        title: 'Sucesso',
        description: 'Documento excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir documento',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    documentos,
    isLoadingDocumentos,
    getDocumentoById,
    getDocumentosByAcolhido,
    createDocumento: createDocumentoMutation.mutate,
    updateDocumento: updateDocumentoMutation.mutate,
    deleteDocumento: deleteDocumentoMutation.mutate
  }
} 