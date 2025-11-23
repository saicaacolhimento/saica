import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { authService } from '@/services/auth';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { supabase } from '@/config/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function UsuariosAdminList() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [usuariosEmpresa, setUsuariosEmpresa] = useState([]); // ⚠️ Usuários da empresa do admin
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userEmpresaId, setUserEmpresaId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalAdmin, setModalAdmin] = useState<any>(null);
  const [form, setForm] = useState({ nome: '', telefone: '', cargo: '', email: '', senha: '', confirmarSenha: '' });
  const [formLoading, setFormLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);
  const [showConfirmarSenha, setShowConfirmarSenha] = useState(false);
  const [expandedAdminId, setExpandedAdminId] = useState<string | null>(null);
  const [empresaUsuarios, setEmpresaUsuarios] = useState<{ [key: string]: any[] }>({});
  const [loadingUsuarios, setLoadingUsuarios] = useState<string | null>(null);
  const [editUserModal, setEditUserModal] = useState<{ open: boolean, user: any | null }>({ open: false, user: null });
  const [editForm, setEditForm] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editSenhaCoincide, setEditSenhaCoincide] = useState(true);

  // ⚠️ CRÍTICO: Detecção de master e admin
  const isMaster = user?.email === 'saicaacolhimento2025@gmail.com' || userRole === 'master';
  const isAdmin = userRole === 'admin' || isMaster;

  // Buscar role e empresa_id do usuário logado
  useEffect(() => {
    async function fetchUserData() {
      const currentUser = await authService.getCurrentUser();
      setUserRole(currentUser?.role || null);
      setUserEmpresaId(currentUser?.empresa_id || null);
    }
    fetchUserData();
  }, [user]);

  // ⚠️ CRÍTICO: Buscar dados baseado no role
  async function fetchAdmins() {
    setLoading(true);
    try {
      const data = await authService.getAllAdmins();
      console.log('[Usuarios] Admins encontrados:', data);
      setAdmins(data);
    } finally {
      setLoading(false);
    }
  }

  // ⚠️ CRÍTICO: Buscar apenas usuários da empresa do admin
  async function fetchUsuariosEmpresa() {
    if (!userEmpresaId) {
      console.warn('[Usuarios] Admin sem empresa_id');
      setUsuariosEmpresa([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await authService.getUsersByEmpresa(userEmpresaId);
      if (error) {
        console.error('[Usuarios] Erro ao buscar usuários da empresa:', error);
        toast({ title: 'Erro ao buscar usuários', description: error, variant: 'destructive' });
        setUsuariosEmpresa([]);
      } else {
        console.log('[Usuarios] Usuários da empresa encontrados:', data);
        setUsuariosEmpresa(data || []);
      }
    } catch (e: any) {
      console.error('[Usuarios] Erro ao buscar usuários da empresa:', e);
      toast({ title: 'Erro ao buscar usuários', description: e.message, variant: 'destructive' });
      setUsuariosEmpresa([]);
    } finally {
      setLoading(false);
    }
  }

  // ⚠️ CRÍTICO: Buscar dados baseado no role
  useEffect(() => {
    // Detecção imediata pelo email (mais rápido)
    if (user?.email === 'saicaacolhimento2025@gmail.com') {
      fetchAdmins(); // Master vê todos os admins
      return;
    }

    // Aguardar userRole e userEmpresaId serem carregados
    if (userRole === 'master') {
      fetchAdmins(); // Master vê todos os admins
    } else if (userRole === 'admin' && userEmpresaId) {
      fetchUsuariosEmpresa(); // Admin vê apenas usuários da sua empresa
    } else if (userRole === 'admin' && !userEmpresaId) {
      console.warn('[Usuarios] Admin sem empresa_id, não pode buscar usuários');
      setLoading(false);
    }
  }, [userRole, userEmpresaId, user?.email]);

  console.log('Admins para renderizar:', admins);

  const handleOpenModal = (admin: any) => {
    setModalAdmin(admin);
    setForm({ nome: '', telefone: '', cargo: '', email: '', senha: '', confirmarSenha: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalAdmin(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const senhaCoincide = form.senha === form.confirmarSenha;

  const handleDeleteUser = useCallback(async (user: any) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await authService.deleteUser(user.id);
      toast({ title: 'Usuário excluído com sucesso!' });
      if (user.empresa_id) {
        const { data } = await authService.getUsersByEmpresa(user.empresa_id);
        setEmpresaUsuarios(prev => ({ ...prev, [user.empresa_id]: data || [] }));
      }
    } catch (e: any) {
      toast({ title: 'Erro ao excluir usuário', description: e.message, variant: 'destructive' });
    }
  }, [setEmpresaUsuarios, toast]);

  const handleOpenEditModal = (user: any) => {
    setEditUserModal({ open: true, user });
    setEditForm({ nome: user.nome, email: user.email, senha: '', confirmarSenha: '' });
  };

  const handleCloseEditModal = () => {
    setEditUserModal({ open: false, user: null });
    setEditForm({ nome: '', email: '', senha: '', confirmarSenha: '' });
  };

  const handleEditUser = async () => {
    if (!editUserModal.user) return;
    
    setEditLoading(true);
    try {
      await authService.updateUser(
        editUserModal.user.id,
        {
          nome: editForm.nome,
          // outros campos...
        }
      );

      if (editForm.senha && editForm.senha === editForm.confirmarSenha) {
        const resp = await fetch('http://localhost:3333/admin/alterar-senha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editUserModal.user.id,
            novaSenha: editForm.senha,
          }),
        });
        const result = await resp.json();
        if (!result.success) throw new Error(result.error || 'Erro ao alterar senha');
      }

      toast({ title: 'Usuário atualizado com sucesso!' });
      handleCloseEditModal();
    } catch (e: any) {
      toast({ title: 'Erro ao atualizar usuário', description: e.message, variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  // ⚠️ CRÍTICO: Atualizar lista após criar/editar/deletar usuário
  const handleCreateUser = async () => {
    if (!form.nome || !form.email || !form.senha || !form.confirmarSenha) {
      toast({ title: 'Preencha todos os campos obrigatórios', variant: 'destructive' });
      return;
    }
    if (form.senha !== form.confirmarSenha) {
      toast({ title: 'As senhas não coincidem', variant: 'destructive' });
      return;
    }
    setFormLoading(true);
    try {
      await authService.createUser({
        nome: form.nome,
        telefone: form.telefone,
        cargo: form.cargo,
        email: form.email,
        password: form.senha,
        role: 'padrao',
        status: 'active',
        empresa_id: isMaster ? modalAdmin?.empresa_id : userEmpresaId, // ⚠️ Usar empresa_id do admin se não for master
      });
      if (isMaster) {
        await fetchAdmins();
      } else {
        await fetchUsuariosEmpresa(); // ⚠️ Atualizar lista de usuários da empresa
      }
      toast({ title: 'Usuário criado com sucesso!' });
      handleCloseModal();
    } catch (e: any) {
      toast({ title: 'Erro ao criar usuário', description: e.message, variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = useCallback(async (user: any) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await authService.deleteUser(user.id);
      toast({ title: 'Usuário excluído com sucesso!' });
      if (isMaster) {
        // Se for master, atualizar lista de admins
        if (user.empresa_id) {
          const { data } = await authService.getUsersByEmpresa(user.empresa_id);
          setEmpresaUsuarios(prev => ({ ...prev, [user.empresa_id]: data || [] }));
        }
      } else {
        // Se for admin, atualizar lista de usuários da empresa
        await fetchUsuariosEmpresa();
      }
    } catch (e: any) {
      toast({ title: 'Erro ao excluir usuário', description: e.message, variant: 'destructive' });
    }
  }, [isMaster, userEmpresaId, toast]);

  const handleEditUser = async () => {
    if (!editUserModal.user) return;
    
    setEditLoading(true);
    try {
      await authService.updateUser(
        editUserModal.user.id,
        {
          nome: editForm.nome,
        }
      );

      if (editForm.senha && editForm.senha === editForm.confirmarSenha) {
        const resp = await fetch('http://localhost:3333/admin/alterar-senha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: editUserModal.user.id,
            novaSenha: editForm.senha,
          }),
        });
        const result = await resp.json();
        if (!result.success) throw new Error(result.error || 'Erro ao alterar senha');
      }

      toast({ title: 'Usuário atualizado com sucesso!' });
      handleCloseEditModal();
      
      // ⚠️ Atualizar lista após edição
      if (isMaster) {
        await fetchAdmins();
      } else {
        await fetchUsuariosEmpresa();
      }
    } catch (e: any) {
      toast({ title: 'Erro ao atualizar usuário', description: e.message, variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários</h1>
        {/* ⚠️ Botão "Criar Usuário" apenas para admin (não master) */}
        {!isMaster && isAdmin && (
          <Button onClick={() => {
            setModalAdmin({ empresa_id: userEmpresaId }); // Usar empresa_id do admin logado
            setForm({ nome: '', telefone: '', cargo: '', email: '', senha: '', confirmarSenha: '' });
            setModalOpen(true);
          }}>
            Criar Usuário
          </Button>
        )}
      </div>
      <div className="bg-white rounded-lg shadow">
        {/* ⚠️ CRÍTICO: Renderização condicional baseada em isMaster */}
        {isMaster ? (
          // MASTER: Vê todos os admins
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Empresa</TableHead>
                <TableHead className="text-center">Cidade</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">Carregando usuários...</TableCell>
                </TableRow>
              ) : admins.filter(admin => admin.role === 'admin').length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">Nenhum admin encontrado.</TableCell>
                </TableRow>
              ) : (
                admins.filter(admin => admin.role === 'admin').map((admin) => [
              <TableRow key={admin.id}>
                <TableCell>{admin.nome}</TableCell>
                <TableCell className="text-center">{admin.email}</TableCell>
                <TableCell className="text-center">
                  {admin.tipo_empresa === 'ABRIGO'
                    ? (admin.nome_empresa || '-')
                    : (admin.tipo_empresa || '-')}
                </TableCell>
                <TableCell className="text-center">{admin.cidade_empresa || '-'}</TableCell>
                <TableCell className="text-center">{admin.estado_empresa || '-'}</TableCell>
                <TableCell>{admin.status}</TableCell>
                <TableCell>{admin.cargo || '-'}</TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(admin)}>
                      Criar Usuário
                    </Button>
                    <Button variant="outline" size="sm" onClick={async () => {
                      if (expandedAdminId === admin.id) {
                        setExpandedAdminId(null);
                      } else {
                        setLoadingUsuarios(admin.id);
                        if (!empresaUsuarios[admin.empresa_id]) {
                          const { data, error } = await authService.getUsersByEmpresa(admin.empresa_id);
                          setEmpresaUsuarios(prev => ({ ...prev, [admin.empresa_id]: data || [] }));
                        }
                        setExpandedAdminId(admin.id);
                        setLoadingUsuarios(null);
                      }
                    }}>
                      {expandedAdminId === admin.id ? 'Ocultar usuários' : '+ Usuários'}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>,
              expandedAdminId === admin.id && (
                <TableRow key={admin.id + '-usuarios'}>
                  <TableCell colSpan={8} className="bg-gray-50 p-0">
                    {loadingUsuarios === admin.id ? (
                      <div className="text-center p-4">Carregando usuários...</div>
                    ) : (
                      <div className="p-4">
                        <strong>Usuários vinculados:</strong>
                        {empresaUsuarios[admin.empresa_id]?.length ? (
                          <Table className="mt-2">
                            <TableHeader>
                              <TableRow>
                                <TableHead>Nome</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Cargo</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Ações</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {empresaUsuarios[admin.empresa_id].map((user: any) => (
                                <TableRow key={user.id}>
                                  <TableCell>{user.nome}</TableCell>
                                  <TableCell>{user.email}</TableCell>
                                  <TableCell>{user.cargo || '-'}</TableCell>
                                  <TableCell>{user.status}</TableCell>
                                  <TableCell className="text-center">
                                    {user.role === 'admin' ? (
                                      <span className="text-gray-400 text-sm">Apenas master pode gerenciar</span>
                                    ) : (
                                      <>
                                        <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(user)}>Editar</Button>
                                        <Button
                                          variant="destructive"
                                          size="icon"
                                          className="ml-2"
                                          title="Excluir usuário"
                                          onClick={() => handleDeleteUser(user)}
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </>
                                    )}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <div className="text-gray-500 mt-2">Nenhum usuário vinculado.</div>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )
            ])}
          </TableBody>
        </Table>
        ) : (
          // ADMIN: Vê apenas usuários da sua empresa
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead className="text-center">Email</TableHead>
                <TableHead className="text-center">Cargo</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">Carregando usuários...</TableCell>
                </TableRow>
              ) : usuariosEmpresa.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Nenhum usuário cadastrado. Clique em "Criar Usuário" para adicionar.
                  </TableCell>
                </TableRow>
              ) : (
                usuariosEmpresa.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.nome}</TableCell>
                    <TableCell className="text-center">{user.email}</TableCell>
                    <TableCell className="text-center">{user.cargo || '-'}</TableCell>
                    <TableCell className="text-center">{user.status}</TableCell>
                    <TableCell className="text-center">
                      {/* ⚠️ CRÍTICO: Admin não pode editar/deletar outros admins */}
                      {user.role === 'admin' ? (
                        <span className="text-gray-400 text-sm">Apenas master pode gerenciar</span>
                      ) : (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleOpenEditModal(user)}>
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="ml-2"
                            title="Excluir usuário"
                            onClick={() => handleDeleteUser(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Modal de criação de usuário */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input name="nome" placeholder="Nome" value={form.nome} onChange={handleChange} required />
            <Input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} />
            <select
              name="cargo"
              value={form.cargo}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Selecione o cargo</option>
              <optgroup label="Equipe Técnica">
                <option>Psicólogo(a)</option>
                <option>Assistente Social</option>
                <option>Pedagogo(a)</option>
                <option>Psicopedagogo(a)</option>
                <option>Terapeuta Ocupacional</option>
                <option>Fisioterapeuta</option>
                <option>Fonoaudiólogo(a)</option>
                <option>Nutricionista</option>
                <option>Médico(a)</option>
                <option>Enfermeiro(a)</option>
                <option>Técnico(a) de Enfermagem</option>
              </optgroup>
              <optgroup label="Acolhimento e Educação">
                <option>Mãe Social</option>
                <option>Cuidador(a)</option>
                <option>Educador(a) Social</option>
                <option>Monitor(a) de Atividades</option>
                <option>Instrutor(a) de Oficinas</option>
              </optgroup>
              <optgroup label="Coordenação e Administração">
                <option>Coordenador(a) Geral</option>
                <option>Assistente Administrativo</option>
                <option>Auxiliar Administrativo</option>
                <option>Analista de Recursos Humanos (RH)</option>
                <option>Contador(a)</option>
                <option>Financeiro</option>
              </optgroup>
              <optgroup label="Serviços Gerais">
                <option>Cozinheiro(a)</option>
                <option>Auxiliar de Cozinha</option>
                <option>Auxiliar de Limpeza / Serviços Gerais</option>
                <option>Lavadeira</option>
                <option>Motorista</option>
                <option>Porteiro(a)</option>
                <option>Vigia / Segurança</option>
              </optgroup>
              <optgroup label="Outros Profissionais">
                <option>Advogado(a) / Assessor(a) Jurídico(a)</option>
                <option>Recreador(a)</option>
                <option>Professor(a) de Apoio</option>
                <option>Coordenador(a) Pedagógico(a)</option>
                <option>Instrutor(a) de Esportes</option>
                <option>Conselheiro(a) Tutelar</option>
                <option>Coordenador(a) do CRAS</option>
                <option>Técnico(a) de Referência</option>
                <option>Coordenador(a) do CREAS</option>
                <option>Coordenador(a) do CAPS</option>
                <option>Farmacêutico(a)</option>
                <option>Terapeuta Ocupacional</option>
                <option>Psiquiatra</option>
              </optgroup>
            </select>
            <Input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required />
            <div className="relative">
              <Input
                name="senha"
                placeholder="Senha"
                type={showSenha ? 'text' : 'password'}
                value={form.senha}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowSenha((v) => !v)}
                tabIndex={-1}
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                name="confirmarSenha"
                placeholder="Confirmar senha"
                type={showConfirmarSenha ? 'text' : 'password'}
                value={form.confirmarSenha}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowConfirmarSenha((v) => !v)}
                tabIndex={-1}
              >
                {showConfirmarSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!senhaCoincide && form.confirmarSenha && (
              <div className="text-red-500 text-xs mt-1">As senhas não coincidem</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal} disabled={formLoading}>Cancelar</Button>
            <Button onClick={handleCreateUser} loading={formLoading} disabled={!senhaCoincide}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de edição de usuário */}
      <Dialog open={editUserModal.open} onOpenChange={(open) => !open && handleCloseEditModal()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              placeholder="Nome"
              value={editForm.nome}
              onChange={(e) => setEditForm(prev => ({ ...prev, nome: e.target.value }))}
              required
            />
            <Input
              placeholder="Email"
              type="email"
              value={editForm.email}
              readOnly
              required
            />
            <div className="relative">
              <Input
                placeholder="Nova senha"
                type={showSenha ? 'text' : 'password'}
                value={editForm.senha}
                onChange={(e) => {
                  setEditForm(prev => ({ ...prev, senha: e.target.value }));
                  setEditSenhaCoincide(e.target.value === editForm.confirmarSenha);
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowSenha((v) => !v)}
                tabIndex={-1}
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="relative">
              <Input
                placeholder="Confirmar nova senha"
                type={showSenha ? 'text' : 'password'}
                value={editForm.confirmarSenha}
                onChange={(e) => {
                  setEditForm(prev => ({ ...prev, confirmarSenha: e.target.value }));
                  setEditSenhaCoincide(editForm.senha === e.target.value);
                }}
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                onClick={() => setShowSenha((v) => !v)}
                tabIndex={-1}
              >
                {showSenha ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!editSenhaCoincide && editForm.confirmarSenha && (
              <div className="text-red-500 text-xs mt-1">As senhas não coincidem</div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditModal} disabled={editLoading}>
              Cancelar
            </Button>
            <Button onClick={handleEditUser} disabled={editLoading}>
              {editLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 