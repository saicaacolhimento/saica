import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { acolhidoService } from '@/services/acolhido'
import { useToast } from '@/components/ui/use-toast'
import { CreateAcolhidoData, UpdateAcolhidoData } from '@/types/acolhido'

export const useAcolhido = () => {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Queries
  const { data: acolhidos, isLoading: isLoadingAcolhidos } = useQuery({
    queryKey: ['acolhidos'],
    queryFn: acolhidoService.getAcolhidos
  })

  const getAcolhidoById = (id: string) => {
    return useQuery({
      queryKey: ['acolhido', id],
      queryFn: () => acolhidoService.getAcolhidoById(id)
    })
  }

  // Mutations
  const createAcolhidoMutation = useMutation({
    mutationFn: acolhidoService.createAcolhido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acolhidos'] })
      toast({
        title: 'Sucesso',
        description: 'Acolhido cadastrado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao cadastrar acolhido',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const updateAcolhidoMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAcolhidoData }) =>
      acolhidoService.updateAcolhido(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acolhidos'] })
      toast({
        title: 'Sucesso',
        description: 'Acolhido atualizado com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar acolhido',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  const deleteAcolhidoMutation = useMutation({
    mutationFn: acolhidoService.deleteAcolhido,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['acolhidos'] })
      toast({
        title: 'Sucesso',
        description: 'Acolhido excluído com sucesso'
      })
    },
    onError: (error) => {
      toast({
        title: 'Erro',
        description: 'Erro ao excluir acolhido',
        variant: 'destructive'
      })
      console.error(error)
    }
  })

  return {
    acolhidos,
    isLoadingAcolhidos,
    getAcolhidoById,
    createAcolhido: createAcolhidoMutation.mutate,
    updateAcolhido: updateAcolhidoMutation.mutate,
    deleteAcolhido: deleteAcolhidoMutation.mutate
  }
} 