import React, { useState, useEffect } from 'react';
import { authService } from '@/services/auth';

export const UserList: React.FC = () => {
  // Estados para filtros
  const [filterNome, setFilterNome] = useState('');
  const [filterEmpresa, setFilterEmpresa] = useState('');
  const [filterCargo, setFilterCargo] = useState('');
  const [usuariosMaster, setUsuariosMaster] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState<any>(null);
  const [usuariosEmpresa, setUsuariosEmpresa] = useState<any[]>([]);
  const [loadingUsuariosEmpresa, setLoadingUsuariosEmpresa] = useState(false);

  useEffect(() => {
    async function fetchMasters() {
      setLoading(true);
      try {
        const data = await authService.getAllMasters();
        setUsuariosMaster(data || []);
      } catch (e) {
        setUsuariosMaster([]);
      } finally {
        setLoading(false);
      }
    }
    fetchMasters();
  }, []);

  // Filtros
  const filtered = usuariosMaster.filter(usuario => {
    const matchNome = filterNome ? usuario.nome?.toLowerCase().includes(filterNome.toLowerCase()) : true;
    const matchEmpresa = filterEmpresa ? usuario.empresas?.nome?.toLowerCase().includes(filterEmpresa.toLowerCase()) : true;
    const matchCargo = filterCargo ? usuario.cargo?.toLowerCase().includes(filterCargo.toLowerCase()) : true;
    return matchNome && matchEmpresa && matchCargo;
  });

  // Função para abrir modal e buscar usuários da empresa
  const handleOpenModal = async (usuarioMaster: any) => {
    setEmpresaSelecionada(usuarioMaster);
    setModalOpen(true);
    setLoadingUsuariosEmpresa(true);
    try {
      const { data, error } = await authService.getUsersByEmpresa(usuarioMaster.empresa_id);
      setUsuariosEmpresa(data || []);
    } catch (e) {
      setUsuariosEmpresa([]);
    } finally {
      setLoadingUsuariosEmpresa(false);
    }
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEmpresaSelecionada(null);
    setUsuariosEmpresa([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Usuários Master</h1>
        {/* Filtros */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Filtrar por nome"
            className="border rounded px-2 h-9"
            value={filterNome}
            onChange={e => setFilterNome(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por empresa"
            className="border rounded px-2 h-9"
            value={filterEmpresa}
            onChange={e => setFilterEmpresa(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por cargo"
            className="border rounded px-2 h-9"
            value={filterCargo}
            onChange={e => setFilterCargo(e.target.value)}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="text-center p-2">Logo</th>
              <th className="text-center p-2">Nome</th>
              <th className="text-center p-2">Telefone</th>
              <th className="text-center p-2">Cargo</th>
              <th className="text-center p-2">Data de Cadastro</th>
              <th className="text-center p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center p-4">Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center text-gray-500 p-4">Nenhum usuário master encontrado.</td>
              </tr>
            ) : (
              filtered.map(usuario => (
                <tr key={usuario.id}>
                  <td className="text-center p-2">
                    {usuario.empresas?.logo_url ? (
                      <img src={usuario.empresas.logo_url} alt="Logo" className="w-8 h-8 object-cover rounded-full mx-auto" />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto" />
                    )}
                  </td>
                  <td className="text-center p-2">{usuario.nome}</td>
                  <td className="text-center p-2">{usuario.telefone}</td>
                  <td className="text-center p-2">{usuario.cargo}</td>
                  <td className="text-center p-2">{usuario.created_at ? new Date(usuario.created_at).toLocaleDateString() : ''}</td>
                  <td className="text-center p-2">
                    <button className="text-blue-600 hover:underline" onClick={() => handleOpenModal(usuario)}>Ver detalhes</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de detalhes dos usuários da empresa */}
      {modalOpen && empresaSelecionada && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={handleCloseModal}>X</button>
            {/* Topo: logo, nome e dados principais da empresa */}
            <div className="flex items-center gap-4 mb-4">
              {empresaSelecionada.empresas?.logo_url ? (
                <img src={empresaSelecionada.empresas.logo_url} alt="Logo" className="w-16 h-16 object-cover rounded-full" />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-full" />
              )}
              <div>
                <h2 className="text-xl font-bold">{empresaSelecionada.empresas?.nome}</h2>
                <p className="text-gray-600">CNPJ: {empresaSelecionada.empresas?.cnpj || '-'}</p>
                <p className="text-gray-600">Cidade: {empresaSelecionada.empresas?.cidade || '-'}</p>
              </div>
            </div>
            {/* Tabela de usuários da empresa */}
            <h3 className="text-lg font-semibold mb-2">Usuários da Empresa</h3>
            <div className="bg-gray-50 rounded-lg shadow-inner">
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-center p-2">Nome</th>
                    <th className="text-center p-2">E-mail</th>
                    <th className="text-center p-2">Telefone</th>
                    <th className="text-center p-2">Cargo</th>
                    <th className="text-center p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsuariosEmpresa ? (
                    <tr><td colSpan={5} className="text-center p-4">Carregando...</td></tr>
                  ) : usuariosEmpresa.length === 0 ? (
                    <tr><td colSpan={5} className="text-center text-gray-500 p-4">Nenhum usuário encontrado.</td></tr>
                  ) : (
                    usuariosEmpresa.map(usuario => (
                      <tr key={usuario.id}>
                        <td className="text-center p-2">{usuario.nome}</td>
                        <td className="text-center p-2">{usuario.email}</td>
                        <td className="text-center p-2">{usuario.telefone}</td>
                        <td className="text-center p-2">{usuario.cargo}</td>
                        <td className="text-center p-2">
                          <button className="text-blue-600 hover:underline">Editar</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 