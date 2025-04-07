import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useAcolhido } from '@/hooks/useAcolhido'
import { UpdateAcolhidoData } from '@/types/acolhido'

export function AcolhidoEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [acolhido, setAcolhido] = useState<UpdateAcolhidoData>({
    nome: '',
    data_nascimento: '',
    nome_mae: '',
    cpf: '',
    rg: '',
    endereco: '',
    telefone: '',
    abrigo_id: '',
    status: 'ativo'
  })

  const { getAcolhidoById, updateAcolhido } = useAcolhido()
  const { data: acolhidoData, isLoading } = getAcolhidoById(id!)

  useEffect(() => {
    if (acolhidoData) {
      setAcolhido({
        nome: acolhidoData.nome,
        data_nascimento: acolhidoData.data_nascimento,
        nome_mae: acolhidoData.nome_mae,
        cpf: acolhidoData.cpf || '',
        rg: acolhidoData.rg || '',
        endereco: acolhidoData.endereco || '',
        telefone: acolhidoData.telefone || '',
        abrigo_id: acolhidoData.abrigo_id,
        status: acolhidoData.status
      })
    }
  }, [acolhidoData])

  const handleUpdateAcolhido = async () => {
    try {
      await updateAcolhido({ id: id!, data: acolhido })
      navigate(`/acolhidos/${id}`)
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!acolhidoData) {
    return <div>Acolhido não encontrado</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Acolhido</h1>
        <Button variant="outline" onClick={() => navigate(`/acolhidos/${id}`)}>
          Voltar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              value={acolhido.nome}
              onChange={(e) => setAcolhido({ ...acolhido, nome: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_nascimento">Data de Nascimento</Label>
            <Input
              id="data_nascimento"
              type="date"
              value={acolhido.data_nascimento}
              onChange={(e) => setAcolhido({ ...acolhido, data_nascimento: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nome_mae">Nome da Mãe</Label>
            <Input
              id="nome_mae"
              value={acolhido.nome_mae}
              onChange={(e) => setAcolhido({ ...acolhido, nome_mae: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cpf">CPF</Label>
            <Input
              id="cpf"
              value={acolhido.cpf}
              onChange={(e) => setAcolhido({ ...acolhido, cpf: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rg">RG</Label>
            <Input
              id="rg"
              value={acolhido.rg}
              onChange={(e) => setAcolhido({ ...acolhido, rg: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Input
              id="endereco"
              value={acolhido.endereco}
              onChange={(e) => setAcolhido({ ...acolhido, endereco: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={acolhido.telefone}
              onChange={(e) => setAcolhido({ ...acolhido, telefone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abrigo_id">Abrigo</Label>
            <Select
              id="abrigo_id"
              value={acolhido.abrigo_id}
              onValueChange={(value) => setAcolhido({ ...acolhido, abrigo_id: value })}
            >
              {/* Aqui você precisará buscar os abrigos disponíveis */}
              <option value="">Selecione um abrigo</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={acolhido.status}
              onValueChange={(value: 'ativo' | 'inativo') => setAcolhido({ ...acolhido, status: value })}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => navigate(`/acolhidos/${id}`)}>
          Cancelar
        </Button>
        <Button onClick={handleUpdateAcolhido}>
          Salvar
        </Button>
      </div>
    </div>
  )
} 