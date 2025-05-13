import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Pencil, Save, X } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { acolhidoService } from '@/services/acolhido';
import { shelterService } from '@/services/shelter';
import { useToast } from '@/components/ui/use-toast';

// Exemplo de dados iniciais (edição)
const dadosIniciais = {
  nome: '',
  data_nascimento: '',
  genero: '',
  foto_url: [],
  telefone: '',
  abrigo_id: '',
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
  tecnico_caps: '',
  caps_id: '',
  creas_id: '',
};

const isMaster = true; // Troque para lógica real de permissão

export default function AcolhidoCadastroEdicao() {
  const { id } = useParams(); // se existir, é edição
  const navigate = useNavigate();
  const [tab, setTab] = useState('dados');
  const [form, setForm] = useState(dadosIniciais);
  const [editField, setEditField] = useState<string | null>(null);
  const [abrigos, setAbrigos] = useState<{ id: string, nome: string }[]>([]);
  const [caps, setCaps] = useState<{ id: string, nome: string }[]>([]);
  const [creas, setCreas] = useState<{ id: string, nome: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [fotos, setFotos] = useState<File[]>([]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (isMaster) {
          console.log('Buscando abrigos...');
          const lista = await shelterService.getShelters(1, 100);
          setAbrigos(lista.map((a: any) => ({ id: a.id, nome: a.nome })));
          
          console.log('Buscando CAPS...');
          const listaCaps = await shelterService.getCaps(1, 100);
          console.log('CAPS encontrados:', listaCaps);
          setCaps(listaCaps.map((c: any) => ({ id: c.id, nome: c.nome })));
          
          console.log('Buscando CREAS...');
          const listaCreas = await shelterService.getCreas(1, 100);
          console.log('CREAS encontrados:', listaCreas);
          setCreas(listaCreas.map((c: any) => ({ id: c.id, nome: c.nome })));
        }
        if (id) {
          const acolhido = await acolhidoService.getAcolhidoById(id);
          setForm(acolhido);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Não foi possível carregar os dados necessários',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Função para renderizar campo com edição inline
  const renderEditableField = (label: string, name: string, type = 'text', required = false) => (
    <div className="mb-4 flex items-center gap-2">
      <label className="w-48 font-medium">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
      {editField === name ? (
        <>
          <Input
            type={type}
            value={form[name] as string}
            onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
            className="w-64"
            required={required}
          />
          <Button size="icon" variant="outline" onClick={() => setEditField(null)}><Save size={16} /></Button>
          <Button size="icon" variant="ghost" onClick={() => setEditField(null)}><X size={16} /></Button>
        </>
      ) : (
        <>
          <span className="w-64 block truncate bg-gray-50 border px-2 py-1 rounded text-gray-700">{form[name]}</span>
          <Button size="icon" variant="ghost" onClick={() => setEditField(name)}><Pencil size={16} /></Button>
        </>
      )}
    </div>
  );

  // Substituir campo de abrigo por select se master
  const renderAbrigoField = () => (
    isMaster ? (
      <div className="mb-4 flex items-center gap-2">
        <label className="w-48 font-medium">Abrigo <span className="text-red-500">*</span></label>
        <select
          className="w-64 border rounded px-2 py-1"
          value={form.abrigo_id}
          onChange={e => setForm(f => ({ ...f, abrigo_id: e.target.value }))}
          required
        >
          <option value="">Selecione o abrigo</option>
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
    if (!form.telefone) return 'Telefone é obrigatório';
    if (isMaster && !form.abrigo_id) return 'Selecione o abrigo';
    if (fotos.length < 1) return 'Selecione pelo menos 1 foto';
    if (fotos.length > 5) return 'Selecione no máximo 5 fotos';
    return null;
  }

  function handleFotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      toast({ title: 'Erro', description: 'Selecione no máximo 5 fotos', variant: 'destructive' });
      return;
    }
    setFotos(files);
  }

  function limparCamposVazios(obj) {
    if (Array.isArray(obj)) {
      return obj.length === 0 ? null : obj.map(limparCamposVazios);
    } else if (obj && typeof obj === 'object') {
      const novo = {};
      Object.keys(obj).forEach(key => {
        const valor = limparCamposVazios(obj[key]);
        if (valor === "" || valor === undefined) {
          novo[key] = null;
        } else {
          novo[key] = valor;
        }
      });
      return novo;
    }
    return obj;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const erro = validarCampos();
    if (erro) {
      toast({ title: 'Erro', description: erro, variant: 'destructive' });
      return;
    }
    setSaving(true);
    try {
      let acolhidoId = id;
      // Limpa todos os campos vazios ANTES de qualquer transformação
      let payload = limparCamposVazios({ ...form });
      if (Array.isArray(payload.foto_url)) {
        payload.foto_url = payload.foto_url.length > 0 ? payload.foto_url.join(',') : null;
      }
      // LOG DETALHADO
      console.log('--- PAYLOAD ANTES DO ENVIO ---');
      console.log(JSON.stringify(payload, null, 2));
      console.log('------------------------------');
      // ENVIE APENAS O PAYLOAD LIMPO!
      if (id) {
        await acolhidoService.updateAcolhido(id, payload);
      } else {
        const novo = await acolhidoService.createAcolhido(payload);
        acolhidoId = novo.id;
      }
      toast({ title: id ? 'Acolhido atualizado com sucesso!' : 'Acolhido cadastrado com sucesso!' });
      navigate('/admin/acolhidos');
    } catch (e) {
      toast({ title: 'Erro ao salvar', description: e.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">{id ? 'Editar' : 'Cadastrar'} Acolhido</h1>
      {loading ? (
        <div className="text-center text-blue-700 font-medium py-8">Carregando dados...</div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dados">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="saude">Saúde</TabsTrigger>
              <TabsTrigger value="escolar">Escolar</TabsTrigger>
              <TabsTrigger value="familiar">Familiar</TabsTrigger>
              <TabsTrigger value="acolhimento">Acolhimento</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>
            <TabsContent value="dados">
              {renderEditableField('Nome', 'nome', 'text', true)}
              {renderEditableField('Data de Nascimento', 'data_nascimento', 'date', true)}
              {renderEditableField('Gênero', 'genero', 'text')}
              {renderEditableField('Telefone', 'telefone', 'text', true)}
              {renderAbrigoField()}
              {/* Campo de foto: obrigatório pelo menos 1, máximo 5 */}
              <div className="mb-4 flex items-center gap-2">
                <label className="w-48 font-medium">Foto <span className="text-red-500">*</span></label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-64"
                  onChange={handleFotosChange}
                />
                <span className="text-xs text-gray-500">Mín. 1, máx. 5 fotos</span>
              </div>
              {/* Previews das fotos */}
              {fotos.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {fotos.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt={`Foto ${idx + 1}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
              {renderEditableField('CPF', 'cpf', 'text')}
              {renderEditableField('RG', 'rg', 'text')}
              {renderEditableField('Endereço', 'endereco', 'text')}
            </TabsContent>
            <TabsContent value="saude">
              {renderEditableField('Tipo Sanguíneo', 'tipo_sanguineo', 'text')}
              {renderEditableField('Alergias', 'alergias', 'text')}
              {renderEditableField('Medicamentos', 'medicamentos', 'text')}
              {renderEditableField('Deficiências', 'deficiencias', 'text')}
            </TabsContent>
            <TabsContent value="escolar">
              {renderEditableField('Escola', 'escola', 'text')}
              {renderEditableField('Série', 'serie', 'text')}
              {renderEditableField('Turno', 'turno', 'text')}
              {renderEditableField('Observações Educacionais', 'observacoes_educacionais', 'text')}
              {renderEditableField('Telefone da Escola', 'telefone_escola', 'text', true)}
            </TabsContent>
            <TabsContent value="familiar">
              {renderEditableField('Nome da Mãe', 'nome_mae', 'text')}
              {renderEditableField('Nome do Responsável', 'nome_responsavel', 'text')}
              {renderEditableField('Parentesco do Responsável', 'parentesco_responsavel', 'text')}
              {renderEditableField('CPF do Responsável', 'cpf_responsavel', 'text')}
              {renderEditableField('Telefone do Responsável', 'telefone_responsavel', 'text')}
              {renderEditableField('Endereço do Responsável', 'endereco_responsavel', 'text')}
            </TabsContent>
            <TabsContent value="acolhimento">
              {renderEditableField('Data de Entrada', 'data_entrada', 'date')}
              {renderEditableField('Motivo do Acolhimento', 'motivo_acolhimento', 'text')}
              {renderEditableField('Técnico CAPS', 'tecnico_caps', 'text')}
              
              <div className="mb-4 flex items-center gap-2">
                <label className="w-48 font-medium">CAPS</label>
                <select
                  className="w-64 border rounded px-2 py-1"
                  value={form.caps_id || ''}
                  onChange={e => setForm(f => ({ ...f, caps_id: e.target.value }))}
                >
                  <option value="">Selecione o CAPS</option>
                  {caps && caps.length > 0 ? (
                    caps.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))
                  ) : (
                    <option value="" disabled>Nenhum CAPS encontrado</option>
                  )}
                </select>
              </div>

              <div className="mb-4 flex items-center gap-2">
                <label className="w-48 font-medium">CREAS</label>
                <select
                  className="w-64 border rounded px-2 py-1"
                  value={form.creas_id || ''}
                  onChange={e => setForm(f => ({ ...f, creas_id: e.target.value }))}
                >
                  <option value="">Selecione o CREAS</option>
                  {creas && creas.length > 0 ? (
                    creas.map(c => (
                      <option key={c.id} value={c.id}>{c.nome}</option>
                    ))
                  ) : (
                    <option value="" disabled>Nenhum CREAS encontrado</option>
                  )}
                </select>
              </div>
            </TabsContent>
            <TabsContent value="documentos">
              <div className="mb-4">
                <label className="font-medium">RG (arquivo)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">CPF (arquivo)</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Certidão de Nascimento</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Carteira de Vacinação</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Histórico Escolar</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Laudo Médico</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Receita de Remédio</label>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="block mt-1" />
              </div>
              <div className="mb-4">
                <label className="font-medium">Outros Arquivos</label>
                <input type="file" multiple className="block mt-1" />
              </div>
            </TabsContent>
          </Tabs>
          <div className="flex justify-end mt-8">
            <Button type="submit" disabled={saving}>
              {saving ? (id ? 'Salvando...' : 'Cadastrando...') : (id ? 'Salvar Alterações' : 'Cadastrar Acolhido')}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
} 