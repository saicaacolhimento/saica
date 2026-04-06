import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePermissions, MODULES } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/config/supabase'
import { Users, Shield, Save, Search } from 'lucide-react'

const MODULE_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  empresas: 'Empresas',
  usuarios: 'Usuários',
  acolhidos: 'Acolhidos',
  agenda: 'Agenda',
  financeiro: 'Financeiro',
  documentos: 'Documentos',
  atividades: 'Atividades',
  configuracoes: 'Configurações',
  relatorios: 'Relatórios',
  mensagens: 'Mensagens',
}

interface UserRow {
  id: string
  nome: string
  email: string
  role: string
  cargo?: string
}

interface ModulePerm {
  module: string
  can_read: boolean
  can_write: boolean
  can_delete: boolean
}

export function PermissionList() {
  const { user } = useAuth()
  const { isMaster, getUserPermissions, saveUserPermissions, isSaving } = usePermissions()
  const { toast } = useToast()

  const [usuarios, setUsuarios] = useState<UserRow[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null)
  const [perms, setPerms] = useState<ModulePerm[]>([])
  const [loadingPerms, setLoadingPerms] = useState(false)

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true)
      try {
        let query = supabase
          .from('usuarios')
          .select('id, nome, email, role, cargo, empresa_id')
          .neq('role', 'master')
          .order('nome')

        if (!isMaster && (user as any)?.empresa_id) {
          query = query.eq('empresa_id', (user as any).empresa_id)
        }

        const { data } = await query
        setUsuarios(data || [])
      } catch {
        setUsuarios([])
      }
      setLoading(false)
    }
    if (user) fetchUsers()
  }, [user, isMaster])

  const filteredUsers = usuarios.filter(u =>
    u.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectUser = useCallback(async (u: UserRow) => {
    setSelectedUser(u)
    setLoadingPerms(true)
    try {
      const existing = await getUserPermissions(u.id)
      const existingMap: Record<string, ModulePerm> = {}
      for (const p of existing) {
        existingMap[p.module] = { module: p.module, can_read: p.can_read, can_write: p.can_write, can_delete: p.can_delete }
      }
      const allPerms = MODULES
        .filter(m => m !== 'empresas')
        .map(m => existingMap[m] || { module: m, can_read: false, can_write: false, can_delete: false })
      setPerms(allPerms)
    } catch {
      setPerms(MODULES.filter(m => m !== 'empresas').map(m => ({ module: m, can_read: false, can_write: false, can_delete: false })))
    }
    setLoadingPerms(false)
  }, [getUserPermissions])

  const togglePerm = (module: string, field: 'can_read' | 'can_write' | 'can_delete', value: boolean) => {
    setPerms(prev => prev.map(p => {
      if (p.module !== module) return p
      const updated = { ...p, [field]: value }
      if (field === 'can_write' && value) updated.can_read = true
      if (field === 'can_delete' && value) { updated.can_read = true; updated.can_write = true }
      if (field === 'can_read' && !value) { updated.can_write = false; updated.can_delete = false }
      if (field === 'can_write' && !value) updated.can_delete = false
      return updated
    }))
  }

  const handleSave = async () => {
    if (!selectedUser) return
    try {
      await saveUserPermissions({ targetUserId: selectedUser.id, permissions: perms })
    } catch {
      // handled by hook
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold">Permissões por Usuário</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de usuários */}
        <div className="lg:col-span-1 bg-white rounded-lg border shadow-sm">
          <div className="p-4 border-b">
            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 text-gray-500" />
              <h2 className="font-semibold text-sm">Usuários</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-sm text-gray-400">Carregando...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-400">Nenhum usuário</div>
            ) : (
              filteredUsers.map(u => (
                <button
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  className={`w-full text-left px-4 py-3 border-b last:border-0 hover:bg-gray-50 transition-colors ${selectedUser?.id === u.id ? 'bg-indigo-50 border-l-2 border-l-indigo-500' : ''}`}
                >
                  <p className="text-sm font-medium truncate">{u.nome}</p>
                  <p className="text-xs text-gray-500 truncate">{u.email}</p>
                  <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">{u.role}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Painel de permissões */}
        <div className="lg:col-span-2 bg-white rounded-lg border shadow-sm">
          {!selectedUser ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-gray-400">
              <Shield className="h-12 w-12 mb-3 opacity-30" />
              <p className="text-sm">Selecione um usuário para configurar permissões</p>
            </div>
          ) : loadingPerms ? (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <p className="text-sm text-gray-400">Carregando permissões...</p>
            </div>
          ) : (
            <>
              <div className="p-4 border-b flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">{selectedUser.nome}</h2>
                  <p className="text-xs text-gray-500">{selectedUser.email} — <span className="uppercase">{selectedUser.role}</span></p>
                </div>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-1" />
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b">
                      <th className="text-left py-2 font-medium">Módulo</th>
                      <th className="text-center py-2 font-medium w-24">Ver</th>
                      <th className="text-center py-2 font-medium w-24">Editar</th>
                      <th className="text-center py-2 font-medium w-24">Excluir</th>
                    </tr>
                  </thead>
                  <tbody>
                    {perms.map(p => (
                      <tr key={p.module} className="border-b last:border-0 hover:bg-gray-50">
                        <td className="py-3 text-sm font-medium">{MODULE_LABELS[p.module] || p.module}</td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={p.can_read}
                            onCheckedChange={(v) => togglePerm(p.module, 'can_read', v)}
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={p.can_write}
                            onCheckedChange={(v) => togglePerm(p.module, 'can_write', v)}
                          />
                        </td>
                        <td className="py-3 text-center">
                          <Switch
                            checked={p.can_delete}
                            onCheckedChange={(v) => togglePerm(p.module, 'can_delete', v)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
