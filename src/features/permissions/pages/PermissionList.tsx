import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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
const MODULES = ['dashboard', 'empresas', 'usuarios', 'acolhidos', 'agenda', 'financeiro', 'documentos', 'atividades', 'configuracoes', 'relatorios', 'mensagens']

export function PermissionList() {
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
    deletePermission
  } = usePermissions()

  const filteredPermissions = permissions?.filter(permission =>
    permission.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.table?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    permission.field?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreatePermission = async () => {
    try {
      await createPermission(newPermission)
      setIsCreateDialogOpen(false)
      setNewPermission({ role: '', table: '', field: '', permission_type: '' })
    } catch {
      // handled by hook
    }
  }

  const handleDeletePermission = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta permissão?')) {
      try {
        await deletePermission(id)
      } catch {
        // handled by hook
      }
    }
  }

  if (isLoadingPermissions) {
    return <div className="text-center py-8">Carregando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciamento de Permissões</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          Nova Permissão
        </Button>
      </div>

      <Input
        placeholder="Buscar permissões..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {!filteredPermissions || filteredPermissions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          Nenhuma permissão encontrada
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Role</TableHead>
              <TableHead>Módulo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPermissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.role}</TableCell>
                <TableCell>{permission.table || (permission as any).table_name}</TableCell>
                <TableCell>{permission.permission_type}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeletePermission(permission.id)}
                  >
                    Excluir
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Permissão</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Role</Label>
              <Select
                value={newPermission.role}
                onValueChange={(value) => setNewPermission({ ...newPermission, role: value })}
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
              <Label>Módulo</Label>
              <Select
                value={newPermission.table}
                onValueChange={(value) => setNewPermission({ ...newPermission, table: value, field: '*' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o módulo" />
                </SelectTrigger>
                <SelectContent>
                  {MODULES.map((mod) => (
                    <SelectItem key={mod} value={mod}>
                      {mod}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tipo de Permissão</Label>
              <Select
                value={newPermission.permission_type}
                onValueChange={(value) => setNewPermission({ ...newPermission, permission_type: value })}
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
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreatePermission}>
                Criar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
