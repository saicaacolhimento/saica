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

export default function UsuariosAdminList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [editForm, setEditForm] = useState({ nome: '', email: '', senha: '' });
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    async function fetchAdmins() {
      setLoading(true);
      try {
        const data = await authService.getAllAdmins();
        console.log('Admins encontrados:', data);
        setAdmins(data);
      } finally {
        setLoading(false);
      }
    }
    fetchAdmins();
  }, []);

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
        empresa_id: modalAdmin.empresa_id,
      });
      toast({ title: 'Usuário criado com sucesso!' });
      handleCloseModal();
    } catch (e: any) {
      toast({ title: 'Erro ao criar usuário', description: e.message, variant: 'destructive' });
    } finally {
      setFormLoading(false);
    }
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
    setEditForm({ nome: user.nome, email: user.email, senha: '' });
  };

  const handleCloseEditModal = () => {
    setEditUserModal({ open: false, user: null });
    setEditForm({ nome: '', email: '', senha: '' });
  };

  const handleEditUser = async () => {
    if (!editUserModal.user) return;
    
    setEditLoading(true);
    try {
      await authService.updateUser(editUserModal.user.id, {
        nome: editForm.nome,
        email: editForm.email,
        password: editForm.senha || undefined
      });
      
      // Atualiza a lista de usuários
      if (editUserModal.user.empresa_id) {
        const { data } = await authService.getUsersByEmpresa(editUserModal.user.empresa_id);
        setEmpresaUsuarios(prev => ({ ...prev, [editUserModal.user.empresa_id]: data || [] }));
      }
      
      toast({ title: 'Usuário atualizado com sucesso!' });
      handleCloseEditModal();
    } catch (e: any) {
      toast({ title: 'Erro ao atualizar usuário', description: e.message, variant: 'destructive' });
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Usuários Admin</h1>
      <div className="bg-white rounded-lg shadow">
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
            {admins.filter(admin => admin.role === 'admin').map((admin) => [
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
              onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
              required
            />
            <div className="relative">
              <Input
                placeholder="Nova senha (opcional)"
                type={showSenha ? 'text' : 'password'}
                value={editForm.senha}
                onChange={(e) => setEditForm(prev => ({ ...prev, senha: e.target.value }))}
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