import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { usePermissions } from '@/hooks/usePermissions'
import type { UserRole, PermissionType } from '@/types/permissions'

const USER_ROLES: UserRole[] = ['master', 'admin', 'padrao', 'orgao']
const PERMISSION_TYPES: PermissionType[] = ['read', 'write', 'delete', 'admin']

export function PermissionEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
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
      navigate('/admin/configuracoes')
    } catch {
      // handled by hook
    }
  }

  if (isLoadingPermissions) {
    return <div>Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Editar Permissão</h1>
        <Button variant="outline" onClick={() => navigate('/admin/configuracoes')}>
          Voltar
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Role</Label>
          <Select
            value={permission.role}
            onValueChange={(value) => setPermission({ ...permission, role: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a role" />
            </SelectTrigger>
            <SelectContent>
              {USER_ROLES.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Tabela/Módulo</Label>
          <Input
            value={permission.table}
            onChange={(e) => setPermission({ ...permission, table: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Campo</Label>
          <Input
            value={permission.field}
            onChange={(e) => setPermission({ ...permission, field: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Tipo de Permissão</Label>
          <Select
            value={permission.permission_type}
            onValueChange={(value) => setPermission({ ...permission, permission_type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              {PERMISSION_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => navigate('/admin/configuracoes')}>
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
