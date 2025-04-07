import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAcolhido } from '@/hooks/useAcolhido'
import { acolhidoService } from '@/services/acolhido'

export function AcolhidoDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const { getAcolhidoById } = useAcolhido()
  const { data: acolhido, isLoading } = getAcolhidoById(id!)

  useEffect(() => {
    if (acolhido?.foto_url) {
      setPreviewUrl(acolhido.foto_url)
    }
  }, [acolhido])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUploadFoto = async () => {
    if (!selectedFile || !id) return

    try {
      const fotoUrl = await acolhidoService.uploadFoto(selectedFile, id, 'foto_perfil')
      await acolhidoService.updateAcolhido(id, { foto_url: fotoUrl })
      toast({
        title: 'Sucesso',
        description: 'Foto atualizada com sucesso'
      })
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar foto',
        variant: 'destructive'
      })
      console.error(error)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!acolhido) {
    return <div>Acolhido não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Detalhes do Acolhido</h1>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => navigate(`/acolhidos/${id}/editar`)}>
            Editar
          </Button>
          <Button variant="outline" onClick={() => navigate('/acolhidos')}>
            Voltar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={acolhido.nome}
                  className="w-32 h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500 text-2xl">
                    {acolhido.nome.charAt(0)}
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 right-0">
                <Label
                  htmlFor="foto"
                  className="cursor-pointer bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Label>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            {selectedFile && (
              <Button onClick={handleUploadFoto}>
                Salvar Foto
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <div className="text-lg font-medium">{acolhido.nome}</div>
          </div>

          <div className="space-y-2">
            <Label>Data de Nascimento</Label>
            <div className="text-lg font-medium">
              {new Date(acolhido.data_nascimento).toLocaleDateString()}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nome da Mãe</Label>
            <div className="text-lg font-medium">{acolhido.nome_mae}</div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>CPF</Label>
            <div className="text-lg font-medium">{acolhido.cpf || 'Não informado'}</div>
          </div>

          <div className="space-y-2">
            <Label>RG</Label>
            <div className="text-lg font-medium">{acolhido.rg || 'Não informado'}</div>
          </div>

          <div className="space-y-2">
            <Label>Endereço</Label>
            <div className="text-lg font-medium">{acolhido.endereco || 'Não informado'}</div>
          </div>

          <div className="space-y-2">
            <Label>Telefone</Label>
            <div className="text-lg font-medium">{acolhido.telefone || 'Não informado'}</div>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                acolhido.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {acolhido.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 