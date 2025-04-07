import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { acolhidoService } from '@/services/acolhido'
import { useAcolhido } from '@/hooks/useAcolhido'
import { CreateAcolhidoData } from '@/types/acolhido'

export function AcolhidoList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newAcolhido, setNewAcolhido] = useState<CreateAcolhidoData>({
    nome: '',
    data_nascimento: '',
    nome_mae: '',
    abrigo_id: ''
  })

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

  const handleCreateAcolhido = async () => {
    try {
      await createAcolhido(newAcolhido)
      setIsCreateDialogOpen(false)
      setNewAcolhido({
        nome: '',
        data_nascimento: '',
        nome_mae: '',
        abrigo_id: ''
      })
    } catch (error) {
      console.error(error)
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

  if (isLoadingAcolhidos) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Acolhidos</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Novo Acolhido
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar acolhidos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredAcolhidos?.length === 0 ? (
        <div className="text-center py-4">
          Nenhum acolhido encontrado
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nome</th>
              <th>Data de Nascimento</th>
              <th>Nome da Mãe</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredAcolhidos?.map((acolhido) => (
              <tr key={acolhido.id}>
                <td>
                  {acolhido.foto_url ? (
                    <img
                      src={acolhido.foto_url}
                      alt={acolhido.nome}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-sm">
                        {acolhido.nome.charAt(0)}
                      </span>
                    </div>
                  )}
                </td>
                <td>{acolhido.nome}</td>
                <td>{new Date(acolhido.data_nascimento).toLocaleDateString()}</td>
                <td>{acolhido.nome_mae}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    acolhido.status === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {acolhido.status}
                  </span>
                </td>
                <td>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/acolhidos/${acolhido.id}`)}
                    >
                      Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/acolhidos/${acolhido.id}/editar`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteAcolhido(acolhido.id)}
                    >
                      Excluir
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Novo Acolhido</h2>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={newAcolhido.nome}
              onChange={(e) => setNewAcolhido({ ...newAcolhido, nome: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              value={newAcolhido.data_nascimento}
              onChange={(e) => setNewAcolhido({ ...newAcolhido, data_nascimento: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nome_mae">Nome da Mãe</Label>
            <Input
              id="nome_mae"
              value={newAcolhido.nome_mae}
              onChange={(e) => setNewAcolhido({ ...newAcolhido, nome_mae: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="abrigo_id">Abrigo</Label>
            <Select
              id="abrigo_id"
              value={newAcolhido.abrigo_id}
              onValueChange={(value) => setNewAcolhido({ ...newAcolhido, abrigo_id: value })}
            >
              {/* Aqui você precisará buscar os abrigos disponíveis */}
              <option value="">Selecione um abrigo</option>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateAcolhido}>
              Criar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 