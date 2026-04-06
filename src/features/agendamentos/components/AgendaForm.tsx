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
  const acolhidoInputRef = useRef<HTMLInputElement>(null);
  const [acolhidoFocado, setAcolhidoFocado] = useState(false);

  // Adicionar imports e estados para participantes
  const participanteInputRef = useRef<HTMLInputElement>(null);
  const participanteAutocompleteRef = useRef<HTMLDivElement>(null);
  const [participanteInput, setParticipanteInput] = useState('');
  const [participanteSugestoes, setParticipanteSugestoes] = useState<any[]>([]);
  const [participanteFocado, setParticipanteFocado] = useState(false);

  // Estados para autocomplete de endereço/local
  const localInputRef = useRef<HTMLInputElement>(null);
  const localAutocompleteRef = useRef<HTMLDivElement>(null);
  const [localSugestoes, setLocalSugestoes] = useState<any[]>([]);
  const [localFocado, setLocalFocado] = useState(false);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Estados para "Mais Eventos" (roteiro)
  const [mostrarMaisEventos, setMostrarMaisEventos] = useState(false);
  const [eventosAdicionais, setEventosAdicionais] = useState<any[]>([]);
  const [eventoLocalSugestoes, setEventoLocalSugestoes] = useState<{ index: number; sugestoes: any[] }>({ index: -1, sugestoes: [] });
  const [eventoLocalBuscando, setEventoLocalBuscando] = useState(-1);
  const eventoLocalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Buscar abrigos dos acolhidos
  useMemo(() => {
    async function fetchAbrigos() {
      const acolhidosArray = Array.isArray(acolhidos) ? acolhidos : [];
      const ids = Array.from(new Set(acolhidosArray.map(a => a?.empresa_id).filter(Boolean)));
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
      const target = event.target as Node;
      const isClickOnButton = (target as HTMLElement)?.tagName === 'BUTTON' ||
                              (target as HTMLElement)?.closest('button') !== null;

      if (isClickOnButton && autocompleteRef.current?.contains(target)) {
        return;
      }

      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(target) &&
        acolhidoInputRef.current &&
        !acolhidoInputRef.current.contains(target)
      ) {
        setAcolhidoSugestoes([]);
        setAcolhidoFocado(false);
      }
    }
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    function handleClickOutsideParticipante(event: MouseEvent) {
      if (
        participanteAutocompleteRef.current &&
        !participanteAutocompleteRef.current.contains(event.target as Node) &&
        participanteInputRef.current &&
        !participanteInputRef.current.contains(event.target as Node)
      ) {
        setParticipanteSugestoes([]);
        setParticipanteFocado(false);
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

    if (name === 'local') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      if (value.length === 0) {
        setLocalSugestoes([]);
        setBuscandoEndereco(false);
      } else if (value.length >= 3) {
        setLocalSugestoes([]);
        setBuscandoEndereco(true);

        debounceTimerRef.current = setTimeout(() => {
          buscarEnderecos(value);
        }, 500);
      } else {
        setLocalSugestoes([]);
        setBuscandoEndereco(false);
      }
    }
  };

  const buscarEnderecos = async (query: string) => {
    if (query.length < 3) {
      setLocalSugestoes([]);
      setBuscandoEndereco(false);
      return;
    }

    setBuscandoEndereco(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=br&limit=10&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'SAICA-Agendamento/1.0'
          }
        }
      );

      const data = await response.json();

      if (!data || data.length === 0) {
        setLocalSugestoes([]);
        setBuscandoEndereco(false);
        return;
      }
      
      const enderecosFormatados = data
        .map((item: any) => {
          const address = item.address || {};
          let displayName = item.display_name;

          if (address.road || address.street) {
            const rua = address.road || address.street;
            const numero = address.house_number || '';
            const bairro = address.suburb || address.neighbourhood || address.quarter || '';
            const cidade = address.city || address.town || address.municipality || '';
            const estado = address.state || '';
            
            displayName = `${rua}${numero ? ', ' + numero : ''}${bairro ? ' - ' + bairro : ''}${cidade ? ', ' + cidade : ''}${estado ? ' - ' + estado : ''}`;
          }

          return {
            display_name: displayName,
            lat: item.lat,
            lon: item.lon,
            address: address,
            type: item.type || item.class || '',
            original: item.display_name
          };
        })
        .sort((a: any, b: any) => {
          const aIsRua = a.address?.road || a.address?.street || a.original?.toLowerCase().includes('rua') || a.original?.toLowerCase().includes('avenida');
          const bIsRua = b.address?.road || b.address?.street || b.original?.toLowerCase().includes('rua') || b.original?.toLowerCase().includes('avenida');
          if (aIsRua && !bIsRua) return -1;
          if (!aIsRua && bIsRua) return 1;
          return 0;
        })
        .slice(0, 5);

      setLocalSugestoes(enderecosFormatados);
    } catch {
      setLocalSugestoes([]);
    } finally {
      setBuscandoEndereco(false);
    }
  };

  const handleLocalFocus = () => {
    setLocalFocado(true);
    if (form.local && form.local.length >= 3) {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setBuscandoEndereco(true);
      buscarEnderecos(form.local);
    }
  };

  const handleLocalBlur = () => {
    setTimeout(() => {
      setLocalFocado(false);
      setLocalSugestoes([]);
    }, 200);
  };

  const handleSelecionarEndereco = (endereco: any) => {
    setForm(prev => ({ ...prev, local: endereco.display_name }));
    setLocalSugestoes([]);
    setLocalFocado(false);
    if (localInputRef.current) {
      localInputRef.current.blur();
    }
  };

  const handleSelectMultiple = (name: string, value: any) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAcolhidoFocus = () => {
    const acolhidosArray = Array.isArray(acolhidos) ? acolhidos : [];
    setAcolhidoFocado(true);
    const acolhidosDisponiveis = acolhidosArray.filter(a => a && a.id && !form.acolhidos.includes(a.id));
    setAcolhidoSugestoes(acolhidosDisponiveis);
  };

  const handleAcolhidoBlur = () => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isStillFocused =
        activeElement === acolhidoInputRef.current ||
        (autocompleteRef.current && autocompleteRef.current.contains(activeElement));

      if (!isStillFocused) {
        setAcolhidoFocado(false);
        if (acolhidoInput.length === 0) {
          setAcolhidoSugestoes([]);
        }
      }
    }, 300);
  };

  const handleAcolhidoInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAcolhidoInput(value);
    const acolhidosArray = Array.isArray(acolhidos) ? acolhidos : [];
    if (value.length > 0) {
      setAcolhidoSugestoes(
        acolhidosArray.filter(a =>
          a && a.nome && a.nome.toLowerCase().includes(value.toLowerCase()) &&
          !form.acolhidos.includes(a.id)
        )
      );
    } else {
      if (acolhidoFocado) {
        const acolhidosDisponiveis = acolhidosArray.filter(a => a && a.id && !form.acolhidos.includes(a.id));
        setAcolhidoSugestoes(acolhidosDisponiveis);
      } else {
        setAcolhidoSugestoes([]);
      }
    }
  };

  const handleAddAcolhido = (acolhido: any) => {
    const acolhidosArray = Array.isArray(acolhidos) ? acolhidos : [];

    setAcolhidoFocado(true);

    setForm(prev => {
      const novosAcolhidos = [...prev.acolhidos, acolhido.id];

      const acolhidosDisponiveis = acolhidosArray.filter(a => a && a.id && !novosAcolhidos.includes(a.id));

      setTimeout(() => {
        setAcolhidoSugestoes(acolhidosDisponiveis);
        setAcolhidoFocado(true);
      }, 0);

      return { ...prev, acolhidos: novosAcolhidos };
    });

    setAcolhidoInput('');

    setTimeout(() => {
      if (acolhidoInputRef.current) {
        acolhidoInputRef.current.focus();
        setAcolhidoFocado(true);
        const arr = Array.isArray(acolhidos) ? acolhidos : [];
        setForm(currentForm => {
          const acolhidosDisponiveis = arr.filter(a => a && a.id && !currentForm.acolhidos.includes(a.id));
          setAcolhidoSugestoes(acolhidosDisponiveis);
          return currentForm;
        });
      }
    }, 100);
  };

  const handleRemoveAcolhido = (id: string) => {
    setForm(prev => ({ ...prev, acolhidos: prev.acolhidos.filter((aid: string) => aid !== id) }));
  };

  const getUserNome = (u: any) => u.nome || u.nome_completo || u.displayName || u.email || '-';

  const handleParticipanteFocus = () => {
    setParticipanteFocado(true);
    const participantesDisponiveis = usuarios.filter(u => !form.participantes.includes(u.id));
    setParticipanteSugestoes(participantesDisponiveis);
  };

  const handleParticipanteBlur = () => {
    setTimeout(() => {
      setParticipanteFocado(false);
      if (participanteInput.length === 0) {
        setParticipanteSugestoes([]);
      }
    }, 200);
  };

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
      if (participanteFocado) {
        const participantesDisponiveis = usuarios.filter(u => !form.participantes.includes(u.id));
        setParticipanteSugestoes(participantesDisponiveis);
      } else {
        setParticipanteSugestoes([]);
      }
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

    const eventosFormatados = eventosAdicionais.map(evento => ({
      ...evento,
      data_hora: form.data && evento.hora ? `${form.data}T${evento.hora}` : null
    }));

    const formTratado = {
      ...form,
      data_hora,
      criador_id,
      eventos_adicionais: eventosFormatados.length > 0 ? eventosFormatados : undefined
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
          <div className="relative">
            <input
              name="local"
              value={form.local}
              onChange={handleChange}
              onFocus={handleLocalFocus}
              onBlur={handleLocalBlur}
              ref={localInputRef}
              required
              className="border rounded px-2 py-1 w-full"
              placeholder="Digite o endereço ou local"
              autoComplete="off"
            />
            {buscandoEndereco && (
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-500">
                Buscando...
              </div>
            )}
            {localSugestoes.length > 0 && localFocado && (
              <div ref={localAutocompleteRef} className="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-48 overflow-y-auto">
                <ul className="py-1">
                  {localSugestoes.map((endereco, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleSelecionarEndereco(endereco);
                      }}
                    >
                      <div className="font-medium text-gray-900">{endereco.display_name}</div>
                      {endereco.address?.city && (
                        <div className="text-xs text-gray-500">
                          {endereco.address.city}
                          {endereco.address.state && `, ${endereco.address.state}`}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
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
          <div className="flex flex-wrap gap-1 mb-1">
            {form.participantes.map((id: string) => {
              const u = usuarios.find(u => u.id === id);
              if (!u) return null;
              return (
                <span key={id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  {getUserNome(u)}
                  <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveParticipante(id)}>×</button>
                </span>
              );
            })}
          </div>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                handleAddParticipante(usuarios.find(u => u.id === e.target.value));
              }
            }}
            className="border rounded px-2 py-1 w-full text-sm"
          >
            <option value="">Adicionar participante...</option>
            {usuarios
              .filter(u => !form.participantes.includes(u.id))
              .map(u => (
                <option key={u.id} value={u.id}>{getUserNome(u)}</option>
              ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Acolhidos *</label>
          <div className="flex flex-wrap gap-1 mb-1">
            {form.acolhidos.map((id: string) => {
              const acolhido = (Array.isArray(acolhidos) ? acolhidos : []).find(a => a.id === id);
              if (!acolhido) return null;
              return (
                <span key={id} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                  {acolhido.nome}
                  <button type="button" className="text-red-500 hover:text-red-700" onClick={() => handleRemoveAcolhido(id)}>×</button>
                </span>
              );
            })}
          </div>
          <select
            value=""
            onChange={(e) => {
              if (e.target.value) {
                const acolhido = (Array.isArray(acolhidos) ? acolhidos : []).find(a => a.id === e.target.value);
                if (acolhido) handleAddAcolhido(acolhido);
              }
            }}
            className="border rounded px-2 py-1 w-full text-sm"
          >
            <option value="">Adicionar acolhido...</option>
            {(Array.isArray(acolhidos) ? acolhidos : [])
              .filter(a => !form.acolhidos.includes(a.id))
              .map(a => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
          </select>
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

        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setMostrarMaisEventos(!mostrarMaisEventos)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
          >
            <span>{mostrarMaisEventos ? '−' : '+'}</span>
            <span>Mais Eventos (Roteiro para Motorista)</span>
          </button>
          
          {mostrarMaisEventos && (
            <div className="mt-4 space-y-4 border-t pt-4">
              {eventosAdicionais.map((evento, index) => {
                // Definir nome da parada baseado no índice
                const nomesParadas = ['Primeira parada', 'Segunda parada', 'Terceira parada', 'Quarta parada', 'Quinta parada'];
                const nomeParada = nomesParadas[index] || `Parada ${index + 1}`;
                
                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border space-y-3">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-sm">{nomeParada}</h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEventosAdicionais(eventosAdicionais.filter((_, i) => i !== index));
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Remover
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium mb-1">Título *</label>
                      <input
                        type="text"
                        value={evento.titulo || ''}
                        onChange={(e) => {
                          const novosEventos = [...eventosAdicionais];
                          novosEventos[index] = { ...novosEventos[index], titulo: e.target.value };
                          setEventosAdicionais(novosEventos);
                        }}
                        className="border rounded px-2 py-1 w-full text-sm"
                        placeholder="Ex: Parada 1, Coleta, Entrega"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Hora *</label>
                      <input
                        type="time"
                        value={evento.hora || ''}
                        onChange={(e) => {
                          const novosEventos = [...eventosAdicionais];
                          novosEventos[index] = { ...novosEventos[index], hora: e.target.value };
                          setEventosAdicionais(novosEventos);
                        }}
                        className="border rounded px-2 py-1 w-full text-sm"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2 relative">
                      <label className="block text-xs font-medium mb-1">Local *</label>
                      <input
                        type="text"
                        value={evento.local || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          const novosEventos = [...eventosAdicionais];
                          novosEventos[index] = { ...novosEventos[index], local: value };
                          setEventosAdicionais(novosEventos);
                          if (eventoLocalTimerRef.current) clearTimeout(eventoLocalTimerRef.current);
                          if (value.length >= 3) {
                            setEventoLocalBuscando(index);
                            eventoLocalTimerRef.current = setTimeout(async () => {
                              try {
                                const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}&countrycodes=br&limit=5&addressdetails=1`, { headers: { 'User-Agent': 'SAICA-Agendamento/1.0' } });
                                const data = await resp.json();
                                setEventoLocalSugestoes({ index, sugestoes: (data || []).map((item: any) => ({ display_name: item.display_name, address: item.address })) });
                              } catch { setEventoLocalSugestoes({ index: -1, sugestoes: [] }); }
                              setEventoLocalBuscando(-1);
                            }, 500);
                          } else {
                            setEventoLocalSugestoes({ index: -1, sugestoes: [] });
                          }
                        }}
                        onFocus={() => {
                          if ((evento.local || '').length >= 3) {
                            setEventoLocalBuscando(index);
                            if (eventoLocalTimerRef.current) clearTimeout(eventoLocalTimerRef.current);
                            eventoLocalTimerRef.current = setTimeout(async () => {
                              try {
                                const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(evento.local)}&countrycodes=br&limit=5&addressdetails=1`, { headers: { 'User-Agent': 'SAICA-Agendamento/1.0' } });
                                const data = await resp.json();
                                setEventoLocalSugestoes({ index, sugestoes: (data || []).map((item: any) => ({ display_name: item.display_name, address: item.address })) });
                              } catch { setEventoLocalSugestoes({ index: -1, sugestoes: [] }); }
                              setEventoLocalBuscando(-1);
                            }, 300);
                          }
                        }}
                        onBlur={() => setTimeout(() => setEventoLocalSugestoes({ index: -1, sugestoes: [] }), 200)}
                        className="border rounded px-2 py-1 w-full text-sm"
                        placeholder="Digite o endereço ou local"
                        autoComplete="off"
                        required
                      />
                      {eventoLocalBuscando === index && (
                        <div className="absolute right-2 top-7 text-xs text-gray-500">Buscando...</div>
                      )}
                      {eventoLocalSugestoes.index === index && eventoLocalSugestoes.sugestoes.length > 0 && (
                        <ul className="absolute z-20 w-full mt-1 bg-white border rounded shadow-lg max-h-40 overflow-y-auto">
                          {eventoLocalSugestoes.sugestoes.map((end: any, i: number) => (
                            <li key={i} className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-xs" onMouseDown={(ev) => {
                              ev.preventDefault();
                              const novosEventos = [...eventosAdicionais];
                              novosEventos[index] = { ...novosEventos[index], local: end.display_name };
                              setEventosAdicionais(novosEventos);
                              setEventoLocalSugestoes({ index: -1, sugestoes: [] });
                            }}>
                              {end.display_name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Participantes</label>
                      <div className="flex flex-wrap gap-1">
                        {evento.participantes?.map((id: string) => {
                          const user = usuarios.find(u => u.id === id);
                          if (!user) return null;
                          return (
                            <span key={id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                              {getUserNome(user)}
                              <button
                                type="button"
                                onClick={() => {
                                  const novosEventos = [...eventosAdicionais];
                                  novosEventos[index] = {
                                    ...novosEventos[index],
                                    participantes: novosEventos[index].participantes?.filter((pid: string) => pid !== id) || []
                                  };
                                  setEventosAdicionais(novosEventos);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const novosEventos = [...eventosAdicionais];
                            const participantesAtuais = novosEventos[index].participantes || [];
                            if (!participantesAtuais.includes(e.target.value)) {
                              novosEventos[index] = {
                                ...novosEventos[index],
                                participantes: [...participantesAtuais, e.target.value]
                              };
                              setEventosAdicionais(novosEventos);
                            }
                            e.target.value = '';
                          }
                        }}
                        className="border rounded px-2 py-1 w-full text-sm mt-1"
                      >
                        <option value="">Adicionar participante...</option>
                        {usuarios
                          .filter(u => !evento.participantes?.includes(u.id))
                          .map(u => (
                            <option key={u.id} value={u.id}>{getUserNome(u)}</option>
                          ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium mb-1">Acolhidos</label>
                      <div className="flex flex-wrap gap-1">
                        {evento.acolhidos?.map((id: string) => {
                          const acolhido = (Array.isArray(acolhidos) ? acolhidos : []).find(a => a.id === id);
                          if (!acolhido) return null;
                          return (
                            <span key={id} className="bg-green-100 text-green-800 px-2 py-0.5 rounded text-xs flex items-center gap-1">
                              {acolhido.nome}
                              <button
                                type="button"
                                onClick={() => {
                                  const novosEventos = [...eventosAdicionais];
                                  novosEventos[index] = {
                                    ...novosEventos[index],
                                    acolhidos: novosEventos[index].acolhidos?.filter((aid: string) => aid !== id) || []
                                  };
                                  setEventosAdicionais(novosEventos);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </span>
                          );
                        })}
                      </div>
                      <select
                        value=""
                        onChange={(e) => {
                          if (e.target.value) {
                            const novosEventos = [...eventosAdicionais];
                            const acolhidosAtuais = novosEventos[index].acolhidos || [];
                            if (!acolhidosAtuais.includes(e.target.value)) {
                              novosEventos[index] = {
                                ...novosEventos[index],
                                acolhidos: [...acolhidosAtuais, e.target.value]
                              };
                              setEventosAdicionais(novosEventos);
                            }
                            e.target.value = '';
                          }
                        }}
                        className="border rounded px-2 py-1 w-full text-sm mt-1"
                      >
                        <option value="">Adicionar acolhido...</option>
                        {Array.isArray(acolhidos) && acolhidos
                          .filter(a => !evento.acolhidos?.includes(a.id))
                          .map(a => (
                            <option key={a.id} value={a.id}>{a.nome}</option>
                          ))}
                      </select>
                    </div>
                  </div>
                  </div>
                );
              })}
              
              <button
                type="button"
                onClick={() => {
                  setEventosAdicionais([
                    ...eventosAdicionais,
                    {
                      titulo: '',
                      local: '',
                      hora: '',
                      participantes: [],
                      acolhidos: []
                    }
                  ]);
                }}
                className="w-full border-2 border-dashed border-gray-300 rounded px-4 py-2 text-sm text-gray-600 hover:border-blue-400 hover:text-blue-600"
              >
                + Adicionar Novo Evento
              </button>
            </div>
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