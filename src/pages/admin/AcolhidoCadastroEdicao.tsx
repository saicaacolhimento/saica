import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { acolhidoService } from '@/services/acolhido';
import { shelterService } from '@/services/shelter';
import { useToast } from '@/components/ui/use-toast';
import { documentoService } from '@/services/documento';
import { AcolhimentoSection } from '../../../components/AcolhimentoSection';
import { useAuth } from '@/contexts/AuthContext';

// Exemplo de dados iniciais (edição)
const dadosIniciais = {
  nome: '',
  data_nascimento: '',
  genero: '',
  foto_url: [],
  telefone: '',
  empresa_id: '',
  status: 'ativo',
  cpf: '',
  rg: '',
  endereco: '',
  tipo_sanguineo: '',
  alergias: '',
  medicamentos: '',
  deficiencias: '',
  escola: '',
  serie: '',
  turno: '',
  observacoes_educacionais: '',
  nome_mae: '',
  nome_responsavel: '',
  parentesco_responsavel: '',
  cpf_responsavel: '',
  telefone_responsavel: '',
  endereco_responsavel: '',
  data_entrada: '',
  motivo_acolhimento: '',
  historico_escolar: '',
  laudo_medico: '',
  receita_remedio: '',
  nome_pai: '',
  possui_irmaos: false,
  numero_irmaos: 0,
  nomes_irmaos: '',
  endereco_familia: '',
  telefone_familia: '',
  numero_acolhimentos: 0,
  instituicoes_anteriores: '',
  processo_judicial: '',
  motivo_inativacao: '',
  data_inativacao: '',
  tecnico_referencia: '',
  diagnostico_medico: '',
  caps_frequentado: '',
  creas: '',
  tecnico_creas: '',
  cras: '',
  tecnico_cras: '',
  uso_medicacao: '',
  uso_drogas: '',
  escola_atual: '',
  telefone_escola: '',
};

const isMaster = true; // Troque para lógica real de permissão

const generoOptions = [
  'Masculino',
  'Feminino',
  'Não binário (ou Gênero não binário)',
  'Agênero (sem identificação com nenhum gênero)',
  'Gênero fluido (varia com o tempo)',
  'Bigênero (identificação com dois gêneros)',
  'Andrógino (gênero entre masculino e feminino)',
  'Transgênero (pessoa que se identifica com um gênero diferente do atribuído ao nascer)',
  'Homem trans (ou transmasculino)',
  'Mulher trans (ou transfeminina)',
  'Intersexo (pessoas com variações biológicas que não se encaixam nas normas típicas de masculino ou feminino)',
  'Dois-espíritos (identidade cultural específica de povos indígenas norte-americanos)',
  'Neutrois (gênero neutro ou ausência de gênero)',
  'Demiboy (parcialmente homem, parcialmente outro gênero)',
  'Demigirl (parcialmente mulher, parcialmente outro gênero)'
];

const tipoSanguineoOptions = [
  'A+ (A positivo)',
  'A− (A negativo)',
  'B+ (B positivo)',
  'B− (B negativo)',
  'AB+ (AB positivo)',
  'AB− (AB negativo)',
  'O+ (O positivo)',
  'O− (O negativo)'
];

const serieOptions = [
  'Berçário I (até 1 ano)',
  'Berçário II (1 a 2 anos)',
  'Maternal I (2 a 3 anos)',
  'Maternal II (3 a 4 anos)',
  'Jardim I (4 anos)',
  'Jardim II / Pré II (5 anos)',
  '1º ano (6 anos)',
  '2º ano',
  '3º ano',
  '4º ano',
  '5º ano',
  '6º ano',
  '7º ano',
  '8º ano',
  '9º ano',
  '1ª série do Ensino Médio',
  '2ª série do Ensino Médio',
  '3ª série do Ensino Médio'
];

const turnoOptions = [
  'Manhã',
  'Tarde',
  'Noite'
];

export default function AcolhidoCadastroEdicao() {
  const { id } = useParams(); // se existir, é edição
  const navigate = useNavigate();
  const { user, session } = useAuth();
  const [tab, setTab] = useState('dados');
  const [form, setForm] = useState(dadosIniciais);
  const [editField, setEditField] = useState<string | null>(null);
  const [abrigos, setAbrigos] = useState<{ id: string, nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);
  const [documentos, setDocumentos] = useState<{ file: File, nome: string }[]>([]);
  const [editandoNomeDoc, setEditandoNomeDoc] = useState<number | null>(null);
  const [nomeDocSalvo, setNomeDocSalvo] = useState<boolean[]>([]);
  const [cpfExiste, setCpfExiste] = useState(false);
  const [cpfVerificando, setCpfVerificando] = useState(false);
  const [fotosSalvas, setFotosSalvas] = useState([]);

  useEffect(() => {
    console.log('[Cadastro] Estado inicial:', {
      user: user ? { id: user.id, email: user.email } : null,
      session: session ? {
        expires_at: session.expires_at,
        access_token: session.access_token ? 'presente' : 'ausente'
      } : null
    });

    async function fetchData() {
      setLoading(true);
      try {
        if (isMaster) {
          console.log('[Cadastro] Buscando lista de abrigos...');
          const lista = await shelterService.getShelters(1, 100);
          setAbrigos(lista.map((a: any) => ({ id: a.id, nome: a.nome })));
          console.log('[Cadastro] Abrigos carregados:', lista.length);
        }
        if (id) {
          console.log('[Cadastro] Buscando dados do acolhido:', id);
          const acolhido = await acolhidoService.getAcolhidoById(id);
          setForm(acolhido);
          console.log('[Cadastro] Dados do acolhido carregados');
          const fotosSalvas = await acolhidoService.getAcolhidoFotos(id);
          setFotosSalvas(fotosSalvas);
        }
      } catch (error) {
        console.error('[Cadastro] Erro ao carregar dados iniciais:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao carregar dados. Tente novamente.',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Função para renderizar campo com edição inline
  const renderEditableField = (label: string, name: string, type = 'text', required = false) => {
    if (name === 'genero') {
      required = true;
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}<span className="text-red-500 ml-1">*</span></label>
          {(!id) ? (
            <select
              className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
              value={form.genero}
              onChange={e => setForm(f => ({ ...f, genero: e.target.value }))}
              required={required}
            >
              <option value="">Selecione</option>
              {generoOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            editField === name ? (
              <select
                className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
                value={form.genero}
                onChange={e => setForm(f => ({ ...f, genero: e.target.value }))}
                required={required}
              >
                <option value="">Selecione</option>
                {generoOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <>
                <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form.genero}</span>
                <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
              </>
            )
          )}
        </div>
      );
    }
    if (name === 'tipo_sanguineo') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          {(!id) ? (
            <select
              className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
              value={form.tipo_sanguineo}
              onChange={e => setForm(f => ({ ...f, tipo_sanguineo: e.target.value }))}
              required={required}
            >
              <option value="">Selecione</option>
              {tipoSanguineoOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            editField === name ? (
              <select
                className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
                value={form.tipo_sanguineo}
                onChange={e => setForm(f => ({ ...f, tipo_sanguineo: e.target.value }))}
                required={required}
              >
                <option value="">Selecione</option>
                {tipoSanguineoOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <>
                <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form.tipo_sanguineo}</span>
                <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
              </>
            )
          )}
        </div>
      );
    }
    if (name === 'serie') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          {(!id) ? (
            <select
              className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
              value={form.serie}
              onChange={e => setForm(f => ({ ...f, serie: e.target.value }))}
              required={required}
            >
              <option value="">Selecione</option>
              {serieOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            editField === name ? (
              <select
                className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
                value={form.serie}
                onChange={e => setForm(f => ({ ...f, serie: e.target.value }))}
                required={required}
              >
                <option value="">Selecione</option>
                {serieOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <>
                <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form.serie}</span>
                <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
              </>
            )
          )}
        </div>
      );
    }
    if (name === 'turno') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          {(!id) ? (
            <select
              className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
              value={form.turno}
              onChange={e => setForm(f => ({ ...f, turno: e.target.value }))}
              required={required}
            >
              <option value="">Selecione</option>
              {turnoOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          ) : (
            editField === name ? (
              <select
                className="w-64 border-2 border-gray-500 focus:border-saica-blue rounded px-2 py-1"
                value={form.turno}
                onChange={e => setForm(f => ({ ...f, turno: e.target.value }))}
                required={required}
              >
                <option value="">Selecione</option>
                {turnoOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <>
                <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form.turno}</span>
                <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
              </>
            )
          )}
        </div>
      );
    }
    if (name === 'data_nascimento' || name === 'data_entrada' || name === 'data_inativacao') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="date"
            value={form[name] as string}
            onChange={e => {
              let v = e.target.value;
              // Limitar o ano para 4 dígitos, mesmo se digitar mais
              if (/^\d{4,}-\d{2}-\d{2}$/.test(v)) {
                const partes = v.split('-');
                partes[0] = partes[0].slice(0, 4);
                v = partes.join('-');
              }
              setForm(f => ({ ...f, [name]: v }));
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={10}
            required={required}
          />
        </div>
      );
    }
    // Validação especial para telefone, cpf e rg
    let inputProps: any = {};
    if (name === 'telefone') {
      inputProps = {
        inputMode: 'numeric',
        pattern: '[0-9]*',
        maxLength: 11,
        minLength: 10,
        placeholder: 'Apenas números',
        onInput: (e: any) => {
          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 11);
        }
      };
      required = false;
    }
    if (name === 'cpf') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="text"
            value={form.cpf.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4')}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '').slice(0, 11);
              setForm(f => ({ ...f, cpf: v }));
            }}
            onBlur={async (e) => {
              const valor = e.target.value.replace(/\D/g, '');
              if (valor.length === 11) {
                setCpfVerificando(true);
                try {
                  const { data } = await acolhidoService.getAcolhidos();
                  const existe = data.some((a) => a.cpf === valor && (!id || a.id !== id));
                  setCpfExiste(existe);
                } catch {
                  setCpfExiste(false);
                } finally {
                  setCpfVerificando(false);
                }
              } else {
                setCpfExiste(false);
              }
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={14}
            placeholder="000.000.000-00"
          />
        </div>
      );
    }
    if (name === 'rg') {
      inputProps = {
        inputMode: 'numeric',
        pattern: '[0-9]*',
        maxLength: 9,
        placeholder: 'Apenas números',
        onInput: (e: any) => {
          e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9);
        }
      };
    }
    // Máscara para CPF do responsável
    if (name === 'cpf_responsavel') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="text"
            value={form.cpf_responsavel.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3').replace(/(\d{3})\.(\d{3})\.(\d{3})(\d{1,2})/, '$1.$2.$3-$4')}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '').slice(0, 11);
              setForm(f => ({ ...f, cpf_responsavel: v }));
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={14}
            placeholder="000.000.000-00"
          />
        </div>
      );
    }
    // Máscara para Telefone do responsável
    if (name === 'telefone_responsavel') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="text"
            value={form.telefone_responsavel}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '').slice(0, 11);
              v = v.replace(/(\d{2})(\d)/, '$1 $2');
              v = v.replace(/(\d{2}) (\d{5})(\d{1,4})/, '$1 $2-$3');
              setForm(f => ({ ...f, telefone_responsavel: v }));
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={14}
            placeholder="99 99999-9999"
          />
        </div>
      );
    }
    // Máscara para Telefone da Família
    if (name === 'telefone_familia') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="text"
            value={form.telefone_familia.replace(/(\d{2})(\d)/, '$1 $2').replace(/(\d{2}) (\d{5})(\d{1,4})/, '$1 $2-$3')}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '').slice(0, 11);
              setForm(f => ({ ...f, telefone_familia: v }));
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={14}
            placeholder="99 99999-9999"
          />
        </div>
      );
    }
    // Máscara para Telefone da Escola
    if (name === 'telefone_escola') {
      return (
        <div className="mb-4 flex items-center gap-2">
          <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
          <Input
            type="text"
            value={form.telefone_escola.replace(/(\d{2})(\d)/, '$1 $2').replace(/(\d{2}) (\d{5})(\d{1,4})/, '$1 $2-$3')}
            onChange={e => {
              let v = e.target.value.replace(/\D/g, '').slice(0, 11);
              setForm(f => ({ ...f, telefone_escola: v }));
            }}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            maxLength={14}
            placeholder="99 99999-9999"
          />
        </div>
      );
    }
    // Retorno padrão para os outros campos
    return (
      <div className="mb-4 flex items-center gap-2">
        <label className="w-48 font-medium">{label}{(required && name !== 'telefone') && <span className="text-red-500 ml-1">*</span>}</label>
        {(!id) ? (
          <Input
            type={type}
            value={form[name] as string}
            onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
            className="w-64 border-2 border-gray-500 focus:border-saica-blue"
            required={required}
            {...inputProps}
          />
        ) : (
          editField === name ? (
            <>
              <Input
                type={type}
                value={form[name] as string}
                onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
                className="w-64 border-2 border-gray-500 focus:border-saica-blue"
                required={required}
                {...inputProps}
              />
              <Button size="icon" variant="outline" onClick={() => setEditField(null)}><Save size={16} /></Button>
              <Button size="icon" variant="ghost" onClick={() => setEditField(null)}><X size={16} /></Button>
            </>
          ) : (
            <>
              <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form[name]}</span>
              <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
            </>
          )
        )}
      </div>
    );
  };

  // Substituir campo de abrigo por select se master
  const renderAbrigoField = () => (
    isMaster ? (
      <div className="mb-4 flex items-center gap-2">
        <label className="w-48 font-medium">Empresa <span className="text-red-500">*</span></label>
        <select
          className="w-64 border rounded px-2 py-1"
          value={form.empresa_id}
          onChange={e => setForm(f => ({ ...f, empresa_id: e.target.value }))}
          required
        >
          <option value="">Selecione a empresa</option>
          {abrigos.map(a => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
      </div>
    ) : null
  );

  // Validação dos campos obrigatórios
  function validarCampos() {
    if (!form.nome) return 'Nome é obrigatório';
    if (!form.data_nascimento) return 'Data de nascimento é obrigatória';
    if (isMaster && !form.empresa_id) return 'Selecione a empresa';
    if (fotos.length < 1) return 'Selecione pelo menos 1 foto';
    if (fotos.length > 5) return 'Selecione no máximo 5 fotos';
    if (!form.genero) return 'Gênero é obrigatório';
    return null;
  }

  function handleFotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (fotos.length + files.length > 5) {
      toast({ title: 'Erro', description: 'Selecione no máximo 5 fotos', variant: 'destructive' });
      return;
    }
    setFotos(prev => [...prev, ...files]);
  }

  function handleRemoveFoto(idx: number) {
    setFotos(prev => prev.filter((_, i) => i !== idx));
  }

  // Adicionar função para avançar abas
  const abas = ['dados', 'saude', 'escolar', 'familiar', 'acolhimento', 'documentos'];
  function handleNextTab(e: React.FormEvent) {
    e.preventDefault();
    const erro = validarCampos();
    if (erro) {
      toast({ title: 'Erro', description: erro, variant: 'destructive' });
      return;
    }
    const idx = abas.indexOf(tab);
    if (idx < abas.length - 1) {
      setTab(abas[idx + 1]);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('[Cadastro] Iniciando submissão do formulário');
    
    const erro = validarCampos();
    if (erro) {
      console.log('[Cadastro] Erro de validação:', erro);
      toast({ title: 'Erro', description: erro, variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      let acolhidoId = id;
      // Remover campo escola_anterior se existir
      const { escola_anterior, ...formFiltrado } = form;
      
      console.log('[Cadastro] Estado da autenticação antes do cadastro:', {
        user: user ? { id: user.id, email: user.email } : null,
        session: session ? {
          expires_at: session.expires_at,
          access_token: session.access_token ? 'presente' : 'ausente'
        } : null
      });

      // 1. Salvar ou atualizar acolhido
      if (id) {
        console.log('[Cadastro] Atualizando acolhido:', id);
        await acolhidoService.updateAcolhido(id, formFiltrado);
        console.log('[Cadastro] Acolhido atualizado com sucesso');
      } else {
        console.log('[Cadastro] Criando novo acolhido');
        const novo = await acolhidoService.createAcolhido(formFiltrado);
        acolhidoId = novo.id;
        console.log('[Cadastro] Novo acolhido criado:', acolhidoId);
      }

      // 2. Upload das fotos
      for (const file of fotos) {
        try {
          console.log('[Cadastro] Iniciando upload da foto:', file.name);
          const url = await acolhidoService.uploadFoto(file, acolhidoId, 'foto_perfil');
          console.log('[Cadastro] Upload da foto concluído:', url);
          await acolhidoService.createAcolhidoFoto({ acolhido_id: acolhidoId, url, tipo: 'foto_perfil' });
          console.log('[Cadastro] Registro da foto salvo na tabela acolhido_fotos:', url);
        } catch (fotoErr) {
          console.error('[Cadastro] Erro ao enviar foto:', fotoErr);
        }
      }

      // 3. Upload dos documentos
      for (const doc of documentos) {
        try {
          console.log('[Cadastro] Iniciando upload do documento:', doc.file.name);
          const { url } = await documentoService.uploadDocumento(doc.file, acolhidoId);
          console.log('[Cadastro] Upload do documento concluído:', url);

          // Sempre salva como 'outros'
          const tipo: 'outros' = 'outros';

          await documentoService.createDocumento({
            acolhido_id: acolhidoId,
            url,
            titulo: doc.nome,
            tipo
          });
          console.log('[Cadastro] Registro do documento salvo na tabela documentos:', doc.nome, url);
        } catch (docErr) {
          console.error('[Cadastro] Erro ao enviar documento:', docErr);
        }
      }

      console.log('[Cadastro] Estado da autenticação após cadastro:', {
        user: user ? { id: user.id, email: user.email } : null,
        session: session ? {
          expires_at: session.expires_at,
          access_token: session.access_token ? 'presente' : 'ausente'
        } : null
      });

      toast({
        title: 'Sucesso',
        description: id ? 'Acolhido atualizado com sucesso!' : 'Acolhido cadastrado com sucesso!'
      });

      navigate('/admin/criancas');
    } catch (error) {
      console.error('[Cadastro] Erro ao salvar acolhido:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar acolhido. Tente novamente.',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteFotoSalva(fotoId) {
    try {
      await acolhidoService.deleteAcolhidoFoto(fotoId);
      setFotosSalvas(prev => prev.filter(f => f.id !== fotoId));
      toast({ title: 'Sucesso', description: 'Foto removida com sucesso!' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Erro ao remover foto.', variant: 'destructive' });
    }
  }

  return (
    <div className="w-full px-4 pt-2 pb-8 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{id ? 'Editar Acolhido' : 'Cadastrar Acolhido'}</h1>
        <Button variant="outline" onClick={() => navigate('/admin/criancas')}>
          Voltar
        </Button>
      </div>
      {loading ? (
        <div className="text-center text-blue-700 font-medium py-8">Carregando dados...</div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-8 w-full grid grid-cols-6 gap-2">
              <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="saude">Saúde</TabsTrigger>
              <TabsTrigger value="escolar">Escolar</TabsTrigger>
              <TabsTrigger value="familiar">Familiar</TabsTrigger>
              <TabsTrigger value="acolhimento">Acolhimento</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>
            <TabsContent value="dados">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                <div>
                  {/* Previews das fotos cadastradas */}
                  {fotosSalvas.length > 0 && (
                    <div className="flex justify-center gap-4 mb-4">
                      {fotosSalvas.map((foto, idx) => (
                        <div key={foto.id || idx} className="relative group">
                          <img
                            src={foto.url}
                            alt={`Foto cadastrada ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteFotoSalva(foto.id)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                            title="Remover foto cadastrada"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Previews das fotos novas */}
                  {fotos.length > 0 && (
                    <div className="flex justify-center gap-4 mb-4">
                      {fotos.map((file, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Foto nova ${idx + 1}`}
                            className="w-20 h-20 object-cover rounded border shadow"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveFoto(idx)}
                            className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-80 hover:opacity-100"
                            title="Remover foto"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Botão de upload centralizado e menor */}
                  <div className="flex justify-center mb-6">
                    <label className="w-48 font-medium flex flex-col items-center gap-2">
                      <span>Foto <span className="text-red-500">*</span></span>
                      <input
                        id="input-foto"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFotosChange}
                      />
                      <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('input-foto')?.click()}>
                        Escolher arquivos
                      </Button>
                      <span className="text-xs text-gray-500">Mín. 1, máx. 5 fotos</span>
                    </label>
                  </div>
                  {renderEditableField('Nome', 'nome', 'text', true)}
                  {renderEditableField('Data de Nascimento', 'data_nascimento', 'date', true)}
                  {renderEditableField('Gênero', 'genero', 'text')}
                </div>
                <div>
                  {renderEditableField('Telefone', 'telefone', 'text')}
                  {renderEditableField('CPF', 'cpf', 'text')}
                  {cpfVerificando && <span className="text-sm text-gray-500 ml-2">Verificando CPF...</span>}
                  {cpfExiste && <span className="text-sm text-red-500 ml-2">Já existe um acolhido com este CPF!</span>}
                  {renderEditableField('RG', 'rg', 'text')}
                  {renderEditableField('Endereço', 'endereco', 'text')}
                  {renderAbrigoField()}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="saude">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                <div>
                  {renderEditableField('Tipo Sanguíneo', 'tipo_sanguineo', 'text')}
                  {renderEditableField('Alergias', 'alergias', 'text')}
                  {renderEditableField('Medicamentos', 'medicamentos', 'text')}
                  {renderEditableField('Deficiências', 'deficiencias', 'text')}
                </div>
                <div>
                  {renderEditableField('Diagnóstico Médico', 'diagnostico_medico', 'text')}
                  {renderEditableField('Uso de Medicação', 'uso_medicacao', 'text')}
                  {renderEditableField('Uso de Drogas', 'uso_drogas', 'text')}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="escolar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                <div>
                  {renderEditableField('Escola', 'escola', 'text')}
                  {renderEditableField('Série', 'serie', 'text')}
                  {renderEditableField('Turno', 'turno', 'text')}
                  {renderEditableField('Observações Educacionais', 'observacoes_educacionais', 'text')}
                  {renderEditableField('Escola Atual', 'escola_atual', 'text')}
                  {renderEditableField('Telefone da Escola', 'telefone_escola', 'text')}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="familiar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-8">
                <div>
                  {renderEditableField('Nome da Mãe', 'nome_mae', 'text')}
                  {renderEditableField('Nome do Pai', 'nome_pai', 'text')}
                  {renderEditableField('Nome do Responsável', 'nome_responsavel', 'text')}
                  {renderEditableField('Parentesco do Responsável', 'parentesco_responsavel', 'text')}
                  {renderEditableField('CPF do Responsável', 'cpf_responsavel', 'text')}
                  {renderEditableField('Telefone do Responsável', 'telefone_responsavel', 'text')}
                </div>
                <div>
                  {renderEditableField('Endereço do Responsável', 'endereco_responsavel', 'text')}
                  {renderEditableField('Número de Irmãos', 'numero_irmaos', 'number')}
                  {renderEditableField('Nomes dos Irmãos', 'nomes_irmaos', 'text')}
                  {renderEditableField('Endereço da Família', 'endereco_familia', 'text')}
                  {renderEditableField('Telefone da Família', 'telefone_familia', 'text')}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="acolhimento">
              <AcolhimentoSection form={form} setForm={setForm} />
            </TabsContent>
            <TabsContent value="documentos">
              <div className="flex flex-col items-center justify-center gap-4 py-8 w-full">
                {/* Exibir arquivos em cards pequenos */}
                {documentos.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-0 w-full">
                    {documentos.map((doc, idx) => (
                      <div key={idx} className="bg-gray-100 border rounded shadow flex flex-col items-center px-3 py-3 min-w-[180px] max-w-[260px] mb-4">
                        <div className="flex items-center w-full mb-2">
                          <span className="truncate text-xs flex-1 text-gray-400 italic" title={doc.file.name}>{doc.file.name}</span>
                          <Button type="button" size="icon" variant="ghost" onClick={() => setDocumentos(prev => prev.filter((_, i) => i !== idx))}>
                            <X size={14} />
                          </Button>
                        </div>
                        <div className="w-full flex items-center gap-2">
                          {editandoNomeDoc === idx ? (
                            <>
                              <Input
                                type="text"
                                value={doc.nome}
                                onChange={e => setDocumentos(prev => prev.map((d, i) => i === idx ? { ...d, nome: e.target.value } : d))}
                                className="text-xs flex-1 border-gray-400"
                                placeholder="Nome do arquivo"
                                maxLength={60}
                              />
                              <Button type="button" size="icon" variant="outline" onClick={() => {
                                setEditandoNomeDoc(null);
                                setNomeDocSalvo(prev => prev.map((v, i) => i === idx ? true : v));
                              }}>
                                <Save size={14} />
                              </Button>
                            </>
                          ) : (
                            <>
                              <span className="truncate text-xs flex-1" title={doc.nome}>{doc.nome}</span>
                              {!nomeDocSalvo[idx] && (
                                <Button type="button" size="icon" variant="ghost" onClick={() => setEditandoNomeDoc(idx)}>
                                  <Pencil size={14} />
                                </Button>
                              )}
                              <Button type="button" size="icon" variant="ghost" onClick={() => {
                                const url = URL.createObjectURL(doc.file);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = doc.nome || doc.file.name;
                                a.click();
                                URL.revokeObjectURL(url);
                              }} title="Baixar arquivo">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="block"
                  style={{ display: 'none' }}
                  id="input-documentos"
                  onChange={e => {
                    const files = Array.from(e.target.files || []);
                    setDocumentos(prev => {
                      const novos = files.map(file => ({ file, nome: '' }));
                      setEditandoNomeDoc(prev.length + novos.length - 1); // Foca no último novo
                      setNomeDocSalvo(prevSalvo => ([...prevSalvo, ...novos.map(() => false)]));
                      return [...prev, ...novos];
                    });
                  }}
                />
              </div>
              <div className="flex justify-center mt-2">
                <Button type="button" variant="outline" size="sm" className="border-2 border-black" onClick={() => document.getElementById('input-documentos')?.click()}>
                  Selecionar arquivos
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          {tab !== 'documentos' ? (
            <div className="flex justify-center mt-8">
              <Button type="button" onClick={handleNextTab} className="px-8 text-lg">
                Próxima Página
              </Button>
            </div>
          ) : (
            <div className="flex justify-center mt-8">
              <Button type="submit" disabled={saving} className="px-8 text-lg">
                {saving ? (id ? 'Salvando...' : 'Finalizando...') : (id ? 'Salvar Alterações' : 'Finalizar Cadastro')}
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
} 