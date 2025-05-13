import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDocumento } from '@/hooks/useDocumento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { FileText, Download, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DocumentoDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: '',
    acolhido_id: '',
    status: 'ativo' as const
  })

  const { getDocumentoById, updateDocumento, deleteDocumento } = useDocumento()
  const { data: documento, isLoading } = getDocumentoById(id || '')

  useEffect(() => {
    if (documento) {
      setFormData({
        titulo: documento.titulo,
        descricao: documento.descricao,
        tipo: documento.tipo,
        acolhido_id: documento.acolhido_id,
        status: documento.status
      })
    }
  }, [documento])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpdateDocumento = async () => {
    if (!id) return

    await updateDocumento({
      id,
      data: {
        ...formData,
        file: selectedFile || undefined
      }
    })

    navigate('/documentos')
  }

  const handleDeleteDocumento = async () => {
    if (!id) return

    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocumento(id)
      navigate('/documentos')
    }
  }

  const handleDownload = async () => {
    if (!documento?.url) return

    try {
      const response = await fetch(documento.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = documento.titulo
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erro ao baixar documento:', error)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!documento) {
    return <div>Documento não encontrado</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate('/documentos')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold">Detalhes do Documento</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) =>
                setFormData({ ...formData, titulo: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
            />
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select
              id="tipo"
              value={formData.tipo}
              onValueChange={(value) =>
                setFormData({ ...formData, tipo: value })
              }
            >
              <option value="">Selecione um tipo</option>
              <option value="DOCUMENTO">Documento</option>
              <option value="FOTO">Foto</option>
              <option value="LAUDO">Laudo</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="acolhido">Acolhido</Label>
            <Select
              id="acolhido"
              value={formData.acolhido_id}
              onValueChange={(value) =>
                setFormData({ ...formData, acolhido_id: value })
              }
            >
              <option value="">Selecione um acolhido</option>
              {/* TODO: Adicionar lista de acolhidos */}
            </Select>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value as 'ativo' | 'inativo' })
              }
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="arquivo">Arquivo</Label>
            <div className="flex items-center space-x-4">
              <Input
                id="arquivo"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {documento.url && (
                <Button onClick={handleDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Baixar
                </Button>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <Label>Informações Adicionais</Label>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Data de Upload:{' '}
                {format(new Date(documento.created_at), 'dd/MM/yyyy', {
                  locale: ptBR
                })}
              </p>
              <p>
                Última Atualização:{' '}
                {format(new Date(documento.updated_at), 'dd/MM/yyyy', {
                  locale: ptBR
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <Button
            variant="destructive"
            onClick={handleDeleteDocumento}
          >
            Excluir
          </Button>
          <Button onClick={handleUpdateDocumento}>
            Salvar Alterações
          </Button>
        </div>
      </div>
    </div>
  )
} 