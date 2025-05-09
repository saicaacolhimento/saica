import { useMutation } from "@tanstack/react-query";
import { acolhidoService } from "@/services/acolhido";
import { FormValues } from "@/pages/AcolhidoCadastro";
import { toast } from "@/components/ui/use-toast";

export function useAcolhido() {
  const createMutation = useMutation({
    mutationFn: (data: FormValues) => acolhidoService.create(data),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Acolhido cadastrado com sucesso",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar acolhido",
        variant: "destructive",
      });
    },
  });

  const uploadPhotoMutation = useMutation({
    mutationFn: ({ file, acolhidoId }: { file: File; acolhidoId: string }) =>
      acolhidoService.uploadPhoto(file, acolhidoId),
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Foto enviada com sucesso",
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Erro", 
        description: "Erro ao enviar foto",
        variant: "destructive",
      });
    },
  });

  return {
    createAcolhido: createMutation.mutate,
    isCreating: createMutation.isPending,
    uploadPhoto: uploadPhotoMutation.mutate,
    isUploading: uploadPhotoMutation.isPending,
  };
}