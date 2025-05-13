import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumento } from '@/hooks/useDocumento'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { FileText, Search, Plus, Trash2, Edit, Eye } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function DocumentoList() {
  const navigate = useNavigate()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    tipo: '',
    acolhido_id: ''
  })

  const {
    documentos,
    isLoadingDocumentos,
    createDocumento,
    deleteDocumento
  } = useDocumento()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleCreateDocumento = async () => {
    if (!selectedFile) {
      return
    }

    await createDocumento({
      ...formData,
      file: selectedFile
    })

    setIsCreateOpen(false)
    setSelectedFile(null)
    setFormData({
      titulo: '',
      descricao: '',
      tipo: '',
      acolhido_id: ''
    })
  }

  const handleDeleteDocumento = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este documento?')) {
      await deleteDocumento(id)
    }
  }

  const filteredDocumentos = documentos?.filter((documento) =>
    documento.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    documento.descricao.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoadingDocumentos) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Documentos</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Documento
        </Button>
      </div>

      <div className="flex items-center space-x-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar documentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Tipo</th>
            <th>Data de Upload</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredDocumentos?.map((documento) => (
            <tr key={documento.id}>
              <td>{documento.titulo}</td>
              <td>{documento.tipo}</td>
              <td>
                {format(new Date(documento.created_at), 'dd/MM/yyyy', {
                  locale: ptBR
                })}
              </td>
              <td>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    documento.status === 'ativo'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {documento.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </span>
              </td>
              <td>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/documentos/${documento.id}`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/documentos/${documento.id}/editar`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteDocumento(documento.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Novo Documento</h2>
          <div className="space-y-4">
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
              <Label htmlFor="arquivo">Arquivo</Label>
              <Input
                id="arquivo"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleCreateDocumento}>
              Criar Documento
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 