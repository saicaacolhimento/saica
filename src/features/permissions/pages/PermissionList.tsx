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
import { permissionService } from '@/services/permissions'
import { usePermissions } from '@/hooks/usePermissions'
import { UserRole, PermissionType } from '@/types/permissions'

export function PermissionList() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [newPermission, setNewPermission] = useState({
    role: '',
    table: '',
    field: '',
    permission_type: ''
  })

  const {
    permissions,
    isLoadingPermissions,
    createPermission,
    updatePermission,
    deletePermission
  } = usePermissions()

  const filteredPermissions = permissions?.filter(permission =>
    permission.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.table.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.field.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreatePermission = async () => {
    try {
      await createPermission(newPermission)
      setIsCreateDialogOpen(false)
      setNewPermission({ role: '', table: '', field: '', permission_type: '' })
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeletePermission = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta permissão?')) {
      try {
        await deletePermission(id)
      } catch (error) {
        console.error(error)
      }
    }
  }

  if (isLoadingPermissions) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Permissões</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nova Permissão
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Buscar permissões..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredPermissions?.length === 0 ? (
        <div className="text-center py-4">
          Nenhuma permissão encontrada
        </div>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Role</th>
              <th>Tabela</th>
              <th>Campo</th>
              <th>Tipo de Permissão</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredPermissions?.map((permission) => (
              <tr key={permission.id}>
                <td>{permission.role}</td>
                <td>{permission.table}</td>
                <td>{permission.field}</td>
                <td>{permission.permission_type}</td>
                <td>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/permissions/${permission.id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeletePermission(permission.id)}
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
          <h2 className="text-lg font-semibold">Nova Permissão</h2>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select
              id="role"
              value={newPermission.role}
              onValueChange={(value) => setNewPermission({ ...newPermission, role: value })}
            >
              {Object.values(UserRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="table">Tabela</Label>
            <Input
              id="table"
              value={newPermission.table}
              onChange={(e) => setNewPermission({ ...newPermission, table: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="field">Campo</Label>
            <Input
              id="field"
              value={newPermission.field}
              onChange={(e) => setNewPermission({ ...newPermission, field: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="permission_type">Tipo de Permissão</Label>
            <Select
              id="permission_type"
              value={newPermission.permission_type}
              onValueChange={(value) => setNewPermission({ ...newPermission, permission_type: value })}
            >
              {Object.values(PermissionType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreatePermission}>
              Criar
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
} 