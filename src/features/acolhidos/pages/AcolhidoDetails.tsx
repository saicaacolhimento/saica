import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { acolhidoService } from '@/services/acolhido'
import { usePermissions } from '@/hooks/usePermissions'

export function AcolhidoDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const { canSeeField } = usePermissions()
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
    } catch {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar foto',
        variant: 'destructive'
      })
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!acolhido) {
    return <div>Acolhido não encontrado</div>
  }

  const sf = (field: string) => canSeeField('acolhidos', field)

  const Field = ({ label, value, field }: { label: string; value: any; field: string }) => {
    if (!sf(field)) return null
    return (
      <div className="space-y-2">
        <Label className="text-base font-bold">{label}</Label>
        <div className="text-lg font-medium text-left">{value || '—'}</div>
      </div>
    )
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

      {sf('foto_url') && fotosSalvas.length > 0 && (
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
          <Field label="Nome" value={acolhido.nome} field="nome" />
          <Field label="Data de Nascimento" value={acolhido.data_nascimento && new Date(acolhido.data_nascimento).toLocaleDateString()} field="data_nascimento" />
          <Field label="Gênero" value={acolhido.genero} field="genero" />
          <Field label="Tipo Sanguíneo" value={acolhido.tipo_sanguineo} field="tipo_sanguineo" />
          <Field label="Nome da Mãe" value={acolhido.nome_mae} field="nome_mae" />
          <Field label="Nome do Pai" value={acolhido.nome_pai} field="nome_mae" />
          <Field label="Nome do Responsável" value={acolhido.nome_responsavel} field="nome_responsavel" />
          <Field label="Parentesco do Responsável" value={acolhido.parentesco_responsavel} field="parentesco_responsavel" />
          <Field label="CPF do Responsável" value={acolhido.cpf_responsavel} field="cpf_responsavel" />
          <Field label="Telefone do Responsável" value={acolhido.telefone_responsavel} field="telefone_responsavel" />
          <Field label="Endereço do Responsável" value={acolhido.endereco_responsavel} field="endereco_responsavel" />
          <Field label="Endereço" value={acolhido.endereco} field="endereco" />
          <Field label="Telefone" value={acolhido.telefone} field="telefone" />
          <Field label="CPF" value={acolhido.cpf} field="cpf" />
          <Field label="RG" value={acolhido.rg} field="rg" />
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
          <Field label="Alergias" value={acolhido.alergias} field="alergias" />
          <Field label="Medicamentos" value={acolhido.medicamentos} field="medicamentos" />
          <Field label="Deficiências" value={acolhido.deficiencias} field="deficiencias" />
          <Field label="Diagnóstico Médico" value={acolhido.diagnostico_medico} field="deficiencias" />
          <Field label="Uso de Medicação" value={acolhido.uso_medicacao} field="medicamentos" />
          <Field label="Uso de Drogas" value={acolhido.uso_drogas} field="alergias" />
          <Field label="Escola" value={acolhido.escola} field="escola" />
          <Field label="Série" value={acolhido.serie} field="serie" />
          <Field label="Turno" value={acolhido.turno} field="turno" />
          <Field label="Observações Educacionais" value={acolhido.observacoes_educacionais} field="observacoes_educacionais" />
          <Field label="Escola Atual" value={acolhido.escola_atual} field="escola" />
          <Field label="Telefone da Escola" value={acolhido.telefone_escola} field="escola" />
          <Field label="Data de Entrada" value={acolhido.data_entrada && new Date(acolhido.data_entrada).toLocaleDateString()} field="data_entrada" />
          <Field label="Motivo do Acolhimento" value={acolhido.motivo_acolhimento} field="motivo_acolhimento" />
          <Field label="Motivo de Inativação" value={acolhido.motivo_inativacao} field="motivo_acolhimento" />
        </div>
      </div>
    </div>
  )
}
