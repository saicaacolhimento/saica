import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { usePermissions, MODULES, ACOLHIDO_FIELDS } from '@/hooks/usePermissions'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/config/supabase'
import { Users, Shield, Save, Search, ChevronDown, ChevronRight, Eye } from 'lucide-react'

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
  visible_fields?: Record<string, boolean>
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
  const [expandedModule, setExpandedModule] = useState<string | null>(null)

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
    setExpandedModule(null)
    try {
      const existing = await getUserPermissions(u.id)
      const existingMap: Record<string, ModulePerm> = {}
      for (const p of existing) {
        existingMap[p.module] = {
          module: p.module,
          can_read: p.can_read,
          can_write: p.can_write,
          can_delete: p.can_delete,
          visible_fields: (p as any).visible_fields || {},
        }
      }
      const allPerms = MODULES
        .filter(m => m !== 'empresas')
        .map(m => existingMap[m] || { module: m, can_read: false, can_write: false, can_delete: false, visible_fields: {} })
      setPerms(allPerms)
    } catch {
      setPerms(MODULES.filter(m => m !== 'empresas').map(m => ({
        module: m, can_read: false, can_write: false, can_delete: false, visible_fields: {}
      })))
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

  const toggleFieldVisibility = (module: string, fieldKey: string, visible: boolean) => {
    setPerms(prev => prev.map(p => {
      if (p.module !== module) return p
      const vf = { ...(p.visible_fields || {}) }
      vf[fieldKey] = visible
      return { ...p, visible_fields: vf }
    }))
  }

  const toggleAllFields = (module: string, visible: boolean) => {
    setPerms(prev => prev.map(p => {
      if (p.module !== module) return p
      const vf: Record<string, boolean> = {}
      ACOLHIDO_FIELDS.forEach(f => { vf[f.key] = visible })
      return { ...p, visible_fields: vf }
    }))
  }

  const isFieldVisible = (perm: ModulePerm, fieldKey: string): boolean => {
    if (!perm.visible_fields || Object.keys(perm.visible_fields).length === 0) return true
    return perm.visible_fields[fieldKey] !== false
  }

  const handleSave = async () => {
    if (!selectedUser) return
    try {
      await saveUserPermissions({ targetUserId: selectedUser.id, permissions: perms })
    } catch {
      // handled by hook
    }
  }

  const groups = [...new Set(ACOLHIDO_FIELDS.map(f => f.group))]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Shield className="h-6 w-6 text-indigo-600" />
        <h1 className="text-2xl font-bold">Permissões por Usuário</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="max-h-[600px] overflow-y-auto">
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
              <div className="p-4 max-h-[550px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500 uppercase border-b">
                      <th className="text-left py-2 font-medium">Módulo</th>
                      <th className="text-center py-2 font-medium w-20">Ver</th>
                      <th className="text-center py-2 font-medium w-20">Editar</th>
                      <th className="text-center py-2 font-medium w-20">Excluir</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {perms.map(p => (
                      <>
                        <tr key={p.module} className="border-b hover:bg-gray-50">
                          <td className="py-3 text-sm font-medium">{MODULE_LABELS[p.module] || p.module}</td>
                          <td className="py-3 text-center">
                            <Switch checked={p.can_read} onCheckedChange={(v) => togglePerm(p.module, 'can_read', v)} />
                          </td>
                          <td className="py-3 text-center">
                            <Switch checked={p.can_write} onCheckedChange={(v) => togglePerm(p.module, 'can_write', v)} />
                          </td>
                          <td className="py-3 text-center">
                            <Switch checked={p.can_delete} onCheckedChange={(v) => togglePerm(p.module, 'can_delete', v)} />
                          </td>
                          <td className="py-3 text-center">
                            {p.module === 'acolhidos' && p.can_read && (
                              <button
                                onClick={() => setExpandedModule(expandedModule === p.module ? null : p.module)}
                                className="p-1 rounded hover:bg-gray-200"
                                title="Configurar campos visíveis"
                              >
                                {expandedModule === p.module ? (
                                  <ChevronDown className="h-4 w-4 text-indigo-500" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                        {p.module === 'acolhidos' && expandedModule === 'acolhidos' && p.can_read && (
                          <tr key="acolhidos-fields">
                            <td colSpan={5} className="p-0">
                              <div className="bg-indigo-50/50 border-y px-4 py-3">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <Eye className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-semibold text-indigo-700">Campos Visíveis em Acolhidos</span>
                                  </div>
                                  <div className="flex gap-2">
                                    <button onClick={() => toggleAllFields('acolhidos', true)} className="text-xs text-indigo-600 hover:underline">Marcar todos</button>
                                    <span className="text-gray-300">|</span>
                                    <button onClick={() => toggleAllFields('acolhidos', false)} className="text-xs text-indigo-600 hover:underline">Desmarcar todos</button>
                                  </div>
                                </div>
                                {groups.map(group => (
                                  <div key={group} className="mb-3">
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1.5">{group}</p>
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                                      {ACOLHIDO_FIELDS.filter(f => f.group === group).map(f => (
                                        <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                                          <Switch
                                            checked={isFieldVisible(p, f.key)}
                                            onCheckedChange={(v) => toggleFieldVisibility('acolhidos', f.key, v)}
                                            className="scale-75"
                                          />
                                          <span className="text-sm text-gray-700">{f.label}</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
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
