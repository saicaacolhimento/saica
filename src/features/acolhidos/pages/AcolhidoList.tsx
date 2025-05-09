import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { acolhidoService } from '@/services/acolhido'
import { useAcolhido } from '@/hooks/useAcolhido'
import { CreateAcolhidoData } from '@/types/acolhido'
import { Upload, FileText, X, Loader2, Plus, Pencil, Trash2 } from 'lucide-react'

export function AcolhidoList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newAcolhido, setNewAcolhido] = useState<CreateAcolhidoData>({
    nome: '',
    data_nascimento: '',
    nome_mae: '',
    nome_pai: '',
    cpf: '',
    rg: '',
    endereco: '',
    telefone: '',
    abrigo_id: '',
    status: 'ativo',
    genero: '',
    naturalidade: '',
    nacionalidade: '',
    etnia: '',
    religiao: '',
    tipo_sanguineo: '',
    alergias: '',
    medicamentos: '',
    deficiencias: '',
    escola: '',
    serie: '',
    turno: '',
    observacoes_educacionais: '',
    nome_responsavel: '',
    parentesco_responsavel: '',
    cpf_responsavel: '',
    telefone_responsavel: '',
    endereco_responsavel: '',
    data_entrada: '',
    motivo_acolhimento: '',
    rg_file: undefined,
    cpf_file: undefined,
    certidaoNascimento_file: undefined,
    certidaoCasamento_file: undefined,
    carteira_vacinacao_file: undefined
  })
  const [isLoading, setIsLoading] = useState(false)
  const [fileNames, setFileNames] = useState({
    rg: '',
    cpf: '',
    certidaoNascimento: '',
    certidaoCasamento: '',
    carteira_vacinacao: ''
  })
  const [editingAcolhido, setEditingAcolhido] = useState<CreateAcolhidoData | null>(null)
  const [fotos, setFotos] = useState<File[]>([])
  const [fotoPreview, setFotoPreview] = useState<string[]>([])

  const {
    acolhidos,
    isLoadingAcolhidos,
    createAcolhido,
    updateAcolhido,
    deleteAcolhido
  } = useAcolhido()

  const filteredAcolhidos = acolhidos?.filter(acolhido =>
    acolhido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acolhido.nome_mae.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async () => {
    try {
      setIsLoading(true)
      
      const response = await acolhidoService.create(newAcolhido)
      
      if (response.id) {
        if (newAcolhido.rg_file) {
          await acolhidoService.uploadDocument(newAcolhido.rg_file, response.id, 'rg')
        }
        
        if (newAcolhido.cpf_file) {
          await acolhidoService.uploadDocument(newAcolhido.cpf_file, response.id, 'cpf')
        }
        
        if (newAcolhido.certidaoNascimento_file) {
          await acolhidoService.uploadDocument(newAcolhido.certidaoNascimento_file, response.id, 'certidaoNascimento')
        }
        
        if (newAcolhido.certidaoCasamento_file) {
          await acolhidoService.uploadDocument(newAcolhido.certidaoCasamento_file, response.id, 'certidaoCasamento')
        }
      }

      toast({
        title: 'Sucesso',
        description: 'Acolhido criado com sucesso!'
      })
      setIsDialogOpen(false)
      queryClient.invalidateQueries(['acolhidos'])
      
    } catch (error) {
      console.error(error)
      toast({
        title: 'Erro',
        description: 'Erro ao criar acolhido',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAcolhido = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este acolhido?')) {
      try {
        await deleteAcolhido(id)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const handleEdit = (acolhido: CreateAcolhidoData) => {
    setEditingAcolhido(acolhido)
    setNewAcolhido(acolhido)
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      if (editingAcolhido) {
        await updateAcolhido(newAcolhido)
      } else {
        await handleCreate()
      }
    } catch (error) {
      console.error(error)
      toast.error('Erro ao salvar acolhido')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (field: 'rg_file' | 'cpf_file' | 'certidaoNascimento_file' | 'certidaoCasamento_file' | 'carteira_vacinacao_file') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewAcolhido(prev => ({...prev, [field]: file}))
      setFileNames(prev => ({...prev, [field.replace('_file', '')]: file.name}))
    }
  }

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (fotos.length + files.length > 5) {
      toast.error('Máximo de 5 fotos permitido')
      return
    }
    setFotos([...fotos, ...files])
    const previews = files.map(file => URL.createObjectURL(file))
    setFotoPreview([...fotoPreview, ...previews])
  }

  const removeFoto = (index: number) => {
    const newFotos = [...fotos]
    const newPreviews = [...fotoPreview]
    newFotos.splice(index, 1)
    newPreviews.splice(index, 1)
    setFotos(newFotos)
    setFotoPreview(newPreviews)
  }

  if (isLoadingAcolhidos) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Acolhidos</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Acolhido
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingAcolhido ? 'Editar Acolhido' : 'Novo Acolhido'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Seção 1: Informações Pessoais */}
              <div>
                <h3 className="text-lg font-medium mb-4">Informações Pessoais</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      value={newAcolhido.nome}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, nome: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                    <Input
                      id="data_nascimento"
                      type="date"
                      value={newAcolhido.data_nascimento}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, data_nascimento: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nome_mae">Nome da Mãe</Label>
                    <Input
                      id="nome_mae"
                      value={newAcolhido.nome_mae}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, nome_mae: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
                    <Input
                      id="cpf"
                      value={newAcolhido.cpf}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, cpf: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rg">RG</Label>
                    <Input
                      id="rg"
                      value={newAcolhido.rg}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, rg: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco">Endereço</Label>
                    <Input
                      id="endereco"
                      value={newAcolhido.endereco}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, endereco: e.target.value}))}
                    />
                  </div>
                </div>
              </div>

              {/* Seção 2: Responsável e Acolhimento */}
              <div>
                <h3 className="text-lg font-medium mb-4">Responsável e Acolhimento</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome_responsavel">Nome do Responsável</Label>
                    <Input
                      id="nome_responsavel"
                      value={newAcolhido.nome_responsavel}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, nome_responsavel: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parentesco_responsavel">Parentesco</Label>
                    <Input
                      id="parentesco_responsavel"
                      value={newAcolhido.parentesco_responsavel}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, parentesco_responsavel: e.target.value}))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="data_entrada">Data de Entrada</Label>
                    <Input
                      id="data_entrada"
                      type="date"
                      value={newAcolhido.data_entrada}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, data_entrada: e.target.value}))}
                    />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label htmlFor="motivo_acolhimento">Motivo do Acolhimento</Label>
                    <Textarea
                      id="motivo_acolhimento"
                      value={newAcolhido.motivo_acolhimento}
                      onChange={(e) => setNewAcolhido(prev => ({...prev, motivo_acolhimento: e.target.value}))}
                    />
                  </div>
                </div>
              </div>

              {/* Seção 3: Documentos */}
              <div>
                <h3 className="text-lg font-medium mb-4">Documentos</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>RG (PDF)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange('rg_file')}
                        className="flex-1"
                      />
                      {fileNames.rg && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setNewAcolhido(prev => ({...prev, rg_file: undefined}))
                            setFileNames(prev => ({...prev, rg: ''}))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>CPF (PDF)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange('cpf_file')}
                        className="flex-1"
                      />
                      {fileNames.cpf && (
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            setNewAcolhido(prev => ({...prev, cpf_file: undefined}))
                            setFileNames(prev => ({...prev, cpf: ''}))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    'Salvar'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <Input
          placeholder="Buscar por nome ou nome da mãe..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Nome da Mãe</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAcolhidos?.map((acolhido) => (
              <TableRow key={acolhido.id}>
                <TableCell className="font-medium">{acolhido.nome}</TableCell>
                <TableCell>{new Date(acolhido.data_nascimento).toLocaleDateString()}</TableCell>
                <TableCell>{acolhido.nome_mae}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    acolhido.status === 'ativo' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {acolhido.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(acolhido)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAcolhido(acolhido.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 