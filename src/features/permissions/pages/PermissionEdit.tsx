import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { permissionService } from '@/services/permissions'
import { usePermissions } from '@/hooks/usePermissions'
import { UserRole, PermissionType } from '@/types/permissions'

export function PermissionEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { toast } = useToast()
  const [permission, setPermission] = useState({
    role: '',
    table: '',
    field: '',
    permission_type: ''
  })

  const {
    permissions,
    isLoadingPermissions,
    updatePermission
  } = usePermissions()

  useEffect(() => {
    const currentPermission = permissions?.find(p => p.id === id)
    if (currentPermission) {
      setPermission({
        role: currentPermission.role,
        table: currentPermission.table,
        field: currentPermission.field,
        permission_type: currentPermission.permission_type
      })
    }
  }, [permissions, id])

  const handleUpdatePermission = async () => {
    try {
      await updatePermission({ id: id!, data: permission })
      navigate('/permissions')
    } catch (error) {
      console.error(error)
    }
  }

  if (isLoadingPermissions) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Permissão</h1>
        <Button variant="outline" onClick={() => navigate('/permissions')}>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select
            id="role"
            value={permission.role}
            onValueChange={(value) => setPermission({ ...permission, role: value })}
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
            value={permission.table}
            onChange={(e) => setPermission({ ...permission, table: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="field">Campo</Label>
          <Input
            id="field"
            value={permission.field}
            onChange={(e) => setPermission({ ...permission, field: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="permission_type">Tipo de Permissão</Label>
          <Select
            id="permission_type"
            value={permission.permission_type}
            onValueChange={(value) => setPermission({ ...permission, permission_type: value })}
          >
            {Object.values(PermissionType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/permissions')}>
            Cancelar
          </Button>
          <Button onClick={handleUpdatePermission}>
            Salvar
          </Button>
        </div>
      </div>
    </div>
  )
} 