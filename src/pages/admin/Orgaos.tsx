import React, { useState } from 'react';
import OrgaoService from '../../services/OrgaoService';
import AuthService from '../../services/AuthService';
import { Input } from '../../components/Input';

const Orgaos: React.FC = () => {
  const [form, setForm] = useState<CreateOrgaoData & { email_admin: string; senha_admin: string; confirmar_senha_admin: string; endereco: string; numero: string; bairro: string; telefone_orgao: string }>(
    {
      tipo: '',
      tipo_outro: '',
      endereco: '',
      numero: '',
      bairro: '',
      cidade: '',
      estado: '',
      nome_responsavel: '',
      email_responsavel: '',
      telefone_responsavel: '',
      telefone_orgao: '',
      logo_url: '',
      status: 'ativo',
      email_admin: '',
      senha_admin: '',
      confirmar_senha_admin: '',
    }
  );
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [editOrgao, setEditOrgao] = useState<Orgao | null>(null);
  const [loading, setLoading] = useState(false);

  const orgaoService = new OrgaoService();
  const authService = new AuthService();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.senha_admin !== form.confirmar_senha_admin) {
        alert('As senhas não coincidem!');
        setLoading(false);
        return;
      }
      let logoUrl = form.logo_url;
      if (selectedLogo) {
        const tempId = Math.random().toString(36).substring(7);
        logoUrl = await orgaoService.uploadLogo(selectedLogo, tempId);
      }
      let orgaoId = editOrgao?.id;
      const { confirmar_senha_admin, ...orgaoData } = form;
      if (editOrgao) {
        await orgaoService.updateOrgao(editOrgao.id, { ...orgaoData, logo_url: logoUrl });
        orgaoId = editOrgao.id;
        if (form.status === 'inativo') {
          await fetch(`/api/bloquear-usuarios-orgao?orgao_id=${orgaoId}`);
        }
      } else {
        const orgao = await orgaoService.createOrgao({
          ...orgaoData,
          logo_url: logoUrl,
          status: 'ativo',
          telefone_orgao: form.telefone_orgao,
          cidade: form.cidade,
        });
        orgaoId = orgao.id;
        await authService.createUser({
          email: form.email_admin,
          password: form.senha_admin,
          nome: form.nome_responsavel,
          role: 'orgao_admin',
          orgao_id: orgaoId,
          status: 'active',
        });
      }
      await fetchOrgaos();
      closeModal();
    } finally {
      setLoading(false);
    }
  };

  function openModal(orgao?: Orgao) {
    if (orgao) {
      setEditOrgao(orgao);
      setForm({
        ...orgao,
        endereco: orgao?.endereco || '',
        numero: orgao?.numero || '',
        bairro: orgao?.bairro || '',
        telefone_orgao: orgao?.telefone_orgao || '',
        email_admin: '',
        senha_admin: '',
        confirmar_senha_admin: '',
      });
      setLogoPreview(orgao.logo_url || null);
      setSelectedLogo(null);
    } else {
      setEditOrgao(null);
      setForm({
        tipo: '',
        tipo_outro: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        nome_responsavel: '',
        email_responsavel: '',
        telefone_responsavel: '',
        telefone_orgao: '',
        logo_url: '',
        status: 'ativo',
        email_admin: '',
        senha_admin: '',
        confirmar_senha_admin: '',
      });
      setLogoPreview(null);
      setSelectedLogo(null);
    }
    setModalOpen(true);
  }

  return (
    <div>
      {/* Renderização do formulário de submissão */}
      {/* Campo Cidade */}
      <Input
        value={form.cidade}
        onChange={e => setForm(f => ({ ...f, cidade: e.target.value }))}
        placeholder="Cidade"
        required
        className="w-full"
      />
      {/* Campo Telefone do Órgão */}
      <Input
        value={form.telefone_orgao}
        onChange={e => setForm(f => ({ ...f, telefone_orgao: e.target.value }))}
        placeholder="Telefone do Órgão"
        required
        className="w-full"
      />
    </div>
  );
};

export default Orgaos; 