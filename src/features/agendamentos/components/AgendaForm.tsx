import React, { useState, useMemo, useRef, useEffect } from 'react';
import { shelterService } from '@/services/shelter';
import { supabase } from '@/config/supabase';

interface AgendaFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
  usuarios: any[];
  acolhidos: any[];
}

export const AgendaForm: React.FC<AgendaFormProps> = ({ initialData, onSave, onCancel, usuarios, acolhidos }) => {
  const safeInitialData = initialData || {};
  const [form, setForm] = useState({
    titulo: safeInitialData.titulo || '',
    descricao: safeInitialData.descricao || '',
    data: safeInitialData.data || '',
    hora: safeInitialData.hora || '',
    local: safeInitialData.local || '',
    participantes: safeInitialData.participantes || [],
    acolhidos: safeInitialData.acolhidos || [],
    recorrente: safeInitialData.recorrente || false,
    tipoRecorrencia: safeInitialData.tipoRecorrencia || 'nenhuma',
    dataFinalRecorrencia: safeInitialData.dataFinalRecorrencia || ''
  });

  // Autocomplete para acolhidos
  const [acolhidoInput, setAcolhidoInput] = useState('');
  const [acolhidoSugestoes, setAcolhidoSugestoes] = useState<any[]>([]);
  const [abrigos, setAbrigos] = useState<any>({});
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Adicionar imports e estados para participantes
  const participanteInputRef = useRef<HTMLInputElement>(null);
  const participanteAutocompleteRef = useRef<HTMLDivElement>(null);
  const [participanteInput, setParticipanteInput] = useState('');
  const [participanteSugestoes, setParticipanteSugestoes] = useState<any[]>([]);

  // Buscar abrigos dos acolhidos
  useMemo(() => {
    async function fetchAbrigos() {
      const ids = Array.from(new Set(acolhidos.map(a => a.empresa_id).filter(Boolean)));
      if (ids.length === 0) return;
      const abrigosData = await shelterService.getSheltersByIds(ids);
      const abrigosMap: any = {};
      abrigosData.forEach((a: any) => { abrigosMap[a.id] = a; });
      setAbrigos(abrigosMap);
    }
    fetchAbrigos();
  }, [acolhidos]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setAcolhidoSugestoes([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutsideParticipante(event: MouseEvent) {
      if (participanteAutocompleteRef.current && !participanteAutocompleteRef.current.contains(event.target as Node)) {
        setParticipanteSugestoes([]);
      }
    }
    document.addEventListener('mousedown', handleClickOutsideParticipante);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideParticipante);
    };
  }, []);

  function calcularIdade(data_nascimento: string) {
    if (!data_nascimento) return '-';
    const nasc = new Date(data_nascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nasc.getFullYear();
    const m = hoje.getMonth() - nasc.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
    return idade;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectMultiple = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAcolhidoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAcolhidoInput(value);
    if (value.length > 0) {
      setAcolhidoSugestoes(
        acolhidos.filter(a =>
          a.nome.toLowerCase().includes(value.toLowerCase()) &&
          !form.acolhidos.includes(a.id)
        )
      );
    } else {
      setAcolhidoSugestoes([]);
    }
  };

  const handleAddAcolhido = (acolhido: any) => {
    setForm(prev => ({ ...prev, acolhidos: [...prev.acolhidos, acolhido.id] }));
    setAcolhidoInput('');
    setAcolhidoSugestoes([]);
  };

  const handleRemoveAcolhido = (id: string) => {
    setForm(prev => ({ ...prev, acolhidos: prev.acolhidos.filter((aid: string) => aid !== id) }));
  };

  const getUserNome = (u: any) => u.nome || u.nome_completo || u.displayName || u.email || '-';

  const handleParticipanteInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setParticipanteInput(value);
    if (value.length > 0) {
      setParticipanteSugestoes(
        usuarios.filter(u =>
          getUserNome(u).toLowerCase().includes(value.toLowerCase()) &&
          !form.participantes.includes(u.id)
        )
      );
    } else {
      setParticipanteSugestoes([]);
    }
  };

  const handleAddParticipante = (user: any) => {
    setForm(prev => ({ ...prev, participantes: [...prev.participantes, user.id] }));
    setParticipanteInput('');
    setParticipanteSugestoes([]);
    if (participanteInputRef.current) participanteInputRef.current.blur();
  };

  const handleRemoveParticipante = (id: string) => {
    setForm(prev => ({ ...prev, participantes: prev.participantes.filter((uid: string) => uid !== id) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data_hora = form.data && form.hora ? `${form.data}T${form.hora}` : null;

    // Buscar usuário logado do Supabase Auth
    const { data: { user } } = await supabase.auth.getUser();
    const criador_id = user?.id;

    const formTratado = {
      ...form,
      data_hora,
      criador_id,
    };
    delete formTratado.data;
    delete formTratado.hora;
    onSave(formTratado);
  };

  return (
    <form className="bg-white rounded-lg shadow p-6 space-y-4" onSubmit={handleSubmit}>
      <h2 className="text-xl font-bold mb-2">{safeInitialData.id ? 'Editar Agendamento' : 'Novo Agendamento'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Título *</label>
          <input name="titulo" value={form.titulo} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Local *</label>
          <input name="local" value={form.local} onChange={handleChange} required className="border rounded px-2 py-1 w-full" placeholder="Endereço ou link" />
        </div>
        <div>
          <label className="block text-sm font-medium">Data *</label>
          <input name="data" type="date" value={form.data} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Hora *</label>
          <input name="hora" type="time" value={form.hora} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Descrição *</label>
          <textarea name="descricao" value={form.descricao} onChange={handleChange} required className="border rounded px-2 py-1 w-full" />
        </div>
        <div>
          <label className="block text-sm font-medium">Participantes *</label>
          <input
            type="text"
            value={participanteInput}
            onChange={handleParticipanteInput}
            placeholder="Digite o nome do participante"
            className="border rounded px-2 py-1 w-full mb-1"
            ref={participanteInputRef}
            autoComplete="off"
          />
          {participanteSugestoes.length > 0 && (
            <div ref={participanteAutocompleteRef} className="relative min-w-[600px]">
              <div className="border rounded-t bg-gray-100 px-2 py-1 font-semibold flex gap-1 text-xs w-full min-w-[600px]">
                <span className="w-44 text-center shrink-0">NOME</span>
                <span className="w-24 text-center shrink-0">CARGO</span>
                <span className="w-56 text-center shrink-0">E-MAIL</span>
                <span className="w-16 text-center shrink-0">&nbsp;</span>
              </div>
              <ul className="border rounded-b bg-white shadow max-h-32 overflow-y-auto absolute z-10 w-full min-w-[600px]">
                {participanteSugestoes.map(u => (
                  <li key={u.id} className="px-2 py-1 hover:bg-blue-100 cursor-pointer flex gap-1 items-center">
                    <span className="w-44 font-semibold text-left shrink-0">{getUserNome(u)}</span>
                    <span className="w-24 text-xs text-gray-500 text-center shrink-0">{u.cargo ? u.cargo : '-'}</span>
                    <span className="w-56 text-xs text-gray-500 text-center shrink-0">{u.email}</span>
                    <span className="w-16 text-center shrink-0">
                      <button type="button" className="ml-1 text-blue-600 hover:underline text-xs" onClick={() => handleAddParticipante(u)}>Adicionar</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.participantes.map((id: string) => {
              const user = usuarios.find(u => u.id === id);
              if (!user) return null;
              return (
                <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  {getUserNome(user)}
                  <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveParticipante(id)}>×</button>
                </span>
              );
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Acolhidos *</label>
          <input
            type="text"
            value={acolhidoInput}
            onChange={handleAcolhidoInput}
            placeholder="Digite o nome do acolhido"
            className="border rounded px-2 py-1 w-full mb-1"
          />
          {acolhidoSugestoes.length > 0 && (
            <div ref={autocompleteRef} className="relative min-w-[470px]">
              <div className="border rounded-t bg-gray-100 px-2 py-1 font-semibold flex gap-1 text-xs w-full">
                <span className="w-44 text-center shrink-0">NOME</span>
                <span className="w-10 text-center shrink-0">IDADE</span>
                <span className="w-16 text-center shrink-0">ABRIGO</span>
                <span className="w-16 text-center shrink-0">CIDADE</span>
                <span className="w-14 text-center shrink-0">&nbsp;</span>
              </div>
              <ul className="border rounded-b bg-white shadow max-h-32 overflow-y-auto absolute z-10 w-full">
                {acolhidoSugestoes.map(a => (
                  <li key={a.id} className="px-2 py-1 hover:bg-blue-100 cursor-pointer flex gap-1 items-center">
                    <span className="w-44 font-semibold text-left shrink-0">{a.nome}</span>
                    <span className="w-10 text-xs text-gray-500 text-center shrink-0">{calcularIdade(a.data_nascimento)}</span>
                    <span className="w-16 text-xs text-gray-500 text-center shrink-0">{abrigos[a.empresa_id]?.nome || '-'}</span>
                    <span className="w-16 text-xs text-gray-500 text-center shrink-0">{abrigos[a.empresa_id]?.cidade || '-'}</span>
                    <span className="w-14 text-center shrink-0">
                      <button type="button" className="ml-1 text-blue-600 hover:underline text-xs" onClick={() => handleAddAcolhido(a)}>Adicionar</button>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {form.acolhidos.map((id: string) => {
              const acolhido = acolhidos.find(a => a.id === id);
              if (!acolhido) return null;
              return (
                <span key={id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  {acolhido.nome}
                  <button type="button" className="ml-1 text-red-500 hover:text-red-700" onClick={() => handleRemoveAcolhido(id)}>×</button>
                </span>
              );
            })}
          </div>
        </div>
        <div className="md:col-span-2 flex items-center gap-4">
          <input type="checkbox" name="recorrente" checked={form.recorrente} onChange={handleChange} />
          <span className="text-sm">Agendamento recorrente</span>
          {form.recorrente && (
            <>
              <select name="tipoRecorrencia" value={form.tipoRecorrencia} onChange={handleChange} className="border rounded px-2 py-1">
                <option value="diario">Todo dia</option>
                <option value="semanal">Toda semana</option>
                <option value="mensal">Todo mês</option>
              </select>
              <input name="dataFinalRecorrencia" type="date" value={form.dataFinalRecorrencia} onChange={handleChange} className="border rounded px-2 py-1" placeholder="Até" />
            </>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button type="button" className="btn" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">Salvar</button>
      </div>
    </form>
  );
}; 