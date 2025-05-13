import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth';

export default function UsuariosDetalhe() {
  const { id } = useParams(); // id do admin
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState({ nome: '', email: '', password: '' });

  useEffect(() => {
    async function fetchUsuarios() {
      setLoading(true);
      try {
        console.log('Buscando admin pelo id:', id);
        const admin = await authService.getUserById(id);
        console.log('Admin encontrado:', admin);
        if (!admin.empresa_id) {
          console.warn('Admin sem empresa_id');
          return;
        }
        console.log('Buscando usuários da empresa:', admin.empresa_id);
        const { data, error } = await authService.getUsersByEmpresa(admin.empresa_id);
        if (error) {
          console.error('Erro ao buscar usuários da empresa:', error);
        }
        console.log('Usuários encontrados:', data);
        setUsuarios(data);
      } catch (e) {
        console.error('Erro geral no fetchUsuarios:', e);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUsuarios();
  }, [id]);

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setEditData({
      nome: usuarios[index].nome,
      email: usuarios[index].email,
      password: '',
    });
  };

  const handleSave = async (userId: string) => {
    await authService.updateUser(userId, editData);
    setEditIndex(null);
    // Atualiza a lista
    const admin = await authService.getUserById(id);
    const { data } = await authService.getUsersByEmpresa(admin.empresa_id);
    setUsuarios(data);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Usuários da Empresa</h1>
      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usuarios.map((user, idx) => (
              <TableRow key={user.id}>
                <TableCell>
                  {editIndex === idx ? (
                    <Input value={editData.nome} onChange={e => setEditData(d => ({ ...d, nome: e.target.value }))} />
                  ) : (
                    user.nome
                  )}
                </TableCell>
                <TableCell>
                  {editIndex === idx ? (
                    <Input value={editData.email} onChange={e => setEditData(d => ({ ...d, email: e.target.value }))} />
                  ) : (
                    user.email
                  )}
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell className="text-right">
                  {editIndex === idx ? (
                    <>
                      <Input
                        type="password"
                        placeholder="Nova senha (opcional)"
                        value={editData.password}
                        onChange={e => setEditData(d => ({ ...d, password: e.target.value }))}
                        className="mb-2"
                      />
                      <Button variant="outline" onClick={() => handleSave(user.id)}>
                        Salvar
                      </Button>
                      <Button variant="outline" onClick={() => setEditIndex(null)} className="ml-2">
                        Cancelar
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" onClick={() => handleEdit(idx)}>
                      Editar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 