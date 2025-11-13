import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { acolhidoService } from '@/services/acolhido'

export function AcolhidoDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [fotosSalvas, setFotosSalvas] = useState([])

  const { data: acolhido, isLoading } = useQuery({
    queryKey: ['acolhido', id],
    queryFn: () => acolhidoService.getAcolhidoById(id!)
  })

  useEffect(() => {
    if (acolhido?.foto_url) {
      setPreviewUrl(acolhido.foto_url)
    }
    if (id) {
      acolhidoService.getAcolhidoFotos(id).then(setFotosSalvas)
    }
  }, [acolhido, id])

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
          <Button variant="outline" onClick={() => window.print()}>
            Imprimir
          </Button>
          <Button variant="outline" onClick={() => navigate('/admin/criancas')}>
            Voltar
          </Button>
        </div>
      </div>

      {fotosSalvas.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4 justify-center items-center">
          {fotosSalvas.map((foto, idx) => (
            <img
              key={foto.id || idx}
              src={foto.url}
              alt={`Foto cadastrada ${idx + 1}`}
              className="w-28 h-28 object-cover rounded border shadow"
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 print:gap-8 gap-4 w-full max-w-3xl mx-auto justify-center">
        <div className="space-y-4 flex flex-col items-start text-left ml-20">
          <div className="space-y-2">
            <Label className="text-base font-bold">Nome</Label>
            <div className="text-lg font-medium text-left">{acolhido.nome}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Data de Nascimento</Label>
            <div className="text-lg font-medium text-left">{new Date(acolhido.data_nascimento).toLocaleDateString()}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Gênero</Label>
            <div className="text-lg font-medium text-left">{acolhido.genero}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Tipo Sanguíneo</Label>
            <div className="text-lg font-medium text-left">{acolhido.tipo_sanguineo}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Nome da Mãe</Label>
            <div className="text-lg font-medium text-left">{acolhido.nome_mae}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Nome do Pai</Label>
            <div className="text-lg font-medium text-left">{acolhido.nome_pai}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Nome do Responsável</Label>
            <div className="text-lg font-medium text-left">{acolhido.nome_responsavel}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Parentesco do Responsável</Label>
            <div className="text-lg font-medium text-left">{acolhido.parentesco_responsavel}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">CPF do Responsável</Label>
            <div className="text-lg font-medium text-left">{acolhido.cpf_responsavel}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Telefone do Responsável</Label>
            <div className="text-lg font-medium text-left">{acolhido.telefone_responsavel}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Endereço do Responsável</Label>
            <div className="text-lg font-medium text-left">{acolhido.endereco_responsavel}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Endereço</Label>
            <div className="text-lg font-medium text-left">{acolhido.endereco}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Telefone</Label>
            <div className="text-lg font-medium text-left">{acolhido.telefone}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">CPF</Label>
            <div className="text-lg font-medium text-left">{acolhido.cpf}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">RG</Label>
            <div className="text-lg font-medium text-left">{acolhido.rg}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Status</Label>
            <div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                acolhido.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {acolhido.status}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-base font-bold">Alergias</Label>
            <div className="text-lg font-medium text-left">{acolhido.alergias}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Medicamentos</Label>
            <div className="text-lg font-medium text-left">{acolhido.medicamentos}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Deficiências</Label>
            <div className="text-lg font-medium text-left">{acolhido.deficiencias}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Diagnóstico Médico</Label>
            <div className="text-lg font-medium text-left">{acolhido.diagnostico_medico}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Uso de Medicação</Label>
            <div className="text-lg font-medium text-left">{acolhido.uso_medicacao}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Uso de Drogas</Label>
            <div className="text-lg font-medium text-left">{acolhido.uso_drogas}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Escola</Label>
            <div className="text-lg font-medium text-left">{acolhido.escola}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Série</Label>
            <div className="text-lg font-medium text-left">{acolhido.serie}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Turno</Label>
            <div className="text-lg font-medium text-left">{acolhido.turno}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Observações Educacionais</Label>
            <div className="text-lg font-medium text-left">{acolhido.observacoes_educacionais}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Escola Atual</Label>
            <div className="text-lg font-medium text-left">{acolhido.escola_atual}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Telefone da Escola</Label>
            <div className="text-lg font-medium text-left">{acolhido.telefone_escola}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Data de Entrada</Label>
            <div className="text-lg font-medium text-left">{acolhido.data_entrada && new Date(acolhido.data_entrada).toLocaleDateString()}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Motivo do Acolhimento</Label>
            <div className="text-lg font-medium text-left">{acolhido.motivo_acolhimento}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Motivo de Inativação</Label>
            <div className="text-lg font-medium text-left">{acolhido.motivo_inativacao}</div>
          </div>
          <div className="space-y-2">
            <Label className="text-base font-bold">Observações</Label>
            <div className="text-lg font-medium text-left">{acolhido.observacoes_educacionais}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 