import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Upload, FileText, X } from 'lucide-react';

// Array com todas as abas em ordem
const tabs = ["dadosPessoais", "documentacao", "saude", "escolar", "familiar", "acolhimento"];

const formSchema = z.object({
  // Dados Pessoais
  nome: z.string().min(1, "Nome é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  sexo: z.string().min(1, "Sexo é obrigatório"),
  corRaca: z.string().min(1, "Cor/Raça é obrigatória"),
  naturalidade: z.string().min(1, "Naturalidade é obrigatória"),
  nacionalidade: z.string().min(1, "Nacionalidade é obrigatória"),

  // Documentação
  rg: z.string().min(1, "RG é obrigatório"),
  cpf: z.string().min(11, "CPF inválido").max(11, "CPF inválido"),
  certidaoNascimento: z.string().min(1, "Certidão de Nascimento é obrigatória"),
  certidaoCasamento: z.string().optional(),

  // Saúde
  tipoSanguineo: z.string().min(1, "Tipo Sanguíneo é obrigatório"),
  alergias: z.string().optional(),
  medicamentos: z.string().optional(),
  deficiencias: z.string().optional(),

  // Escolar
  escola: z.string().min(1, "Escola é obrigatória"),
  serie: z.string().min(1, "Série é obrigatória"),
  turno: z.string().min(1, "Turno é obrigatório"),
  transporteEscolar: z.string().min(1, "Transporte Escolar é obrigatório"),

  // Familiar
  nomeMae: z.string().min(1, "Nome da mãe é obrigatório"),
  nomePai: z.string().optional(),
  telefoneContato: z.string().min(1, "Telefone de contato é obrigatório"),
  enderecoFamiliar: z.string().min(1, "Endereço familiar é obrigatório"),

  // Acolhimento
  dataEntrada: z.string().min(1, "Data de entrada é obrigatória"),
  motivoAcolhimento: z.string().min(1, "Motivo do acolhimento é obrigatório"),
  medidaProtecao: z.string().min(1, "Medida de proteção é obrigatória")
});

type FormValues = z.infer<typeof formSchema>;

const AcolhidoCadastro: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>("dadosPessoais");
  
  const [formData, setFormData] = useState({
    rg: null as File | null,
    cpf: null as File | null,
    certidaoNascimento: null as File | null,
    certidaoCasamento: null as File | null,
  });
  
  // Estado para controlar nomes dos arquivos
  const [fileNames, setFileNames] = useState({
    rg: '',
    cpf: '',
    certidaoNascimento: '',
    certidaoCasamento: ''
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      dataNascimento: "",
      sexo: "",
      corRaca: "",
      naturalidade: "",
      nacionalidade: "",
      rg: "",
      cpf: "",
      certidaoNascimento: "",
      certidaoCasamento: "",
      tipoSanguineo: "",
      alergias: "",
      medicamentos: "",
      deficiencias: "",
      escola: "",
      serie: "",
      turno: "",
      transporteEscolar: "",
      nomeMae: "",
      nomePai: "",
      telefoneContato: "",
      enderecoFamiliar: "",
      dataEntrada: "",
      motivoAcolhimento: "",
      medidaProtecao: ""
    }
  });

  const goToNextTab = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex < tabs.length - 1) {
      setCurrentTab(tabs[currentIndex + 1]);
    }
  };

  const goToPreviousTab = () => {
    const currentIndex = tabs.indexOf(currentTab);
    if (currentIndex > 0) {
      setCurrentTab(tabs[currentIndex - 1]);
    }
  };

  const handleSaveAndContinue = async () => {
    const result = await form.trigger();
    if (result) {
      goToNextTab();
    }
  };

  const onSubmit = (data: FormValues) => {
    try {
      const formattedData = {
        ...data,
        dataNascimento: new Date(data.dataNascimento).toISOString(),
        dataEntrada: new Date(data.dataEntrada).toISOString()
      }
      
      console.log("Dados do formulário:", formattedData)
      
      toast({
        title: "Acolhido cadastrado com sucesso!",
        variant: "success"
      })
      
      form.reset()
      
    } catch (error) {
      console.error("Erro ao cadastrar acolhido:", error)
      toast({
        title: "Erro ao cadastrar acolhido",
        description: "Tente novamente mais tarde",
        variant: "destructive" 
      })
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cadastro de Acolhido</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs value={currentTab} className="w-full" onValueChange={setCurrentTab}>
            <TabsList className="grid grid-cols-6 mb-6">
              <TabsTrigger value="dadosPessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="documentacao">Documentação</TabsTrigger>
              <TabsTrigger value="saude">Saúde</TabsTrigger>
              <TabsTrigger value="escolar">Escolar</TabsTrigger>
              <TabsTrigger value="familiar">Familiar</TabsTrigger>
              <TabsTrigger value="acolhimento">Acolhimento</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dadosPessoais">
              <div className="grid grid-cols-2 gap-3 space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Nome Completo</FormLabel>
                      <FormControl>
                        <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Data de Nascimento</FormLabel>
                      <FormControl>
                        <Input type="date" className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Sexo</FormLabel>
                      <FormControl>
                        <select className="h-8 border-2 border-gray-400 w-full rounded-md" {...field}>
                          <option value="">Selecione</option>
                          <option value="masculino">Masculino</option>
                          <option value="feminino">Feminino</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="corRaca"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Cor/Raça</FormLabel>
                      <FormControl>
                        <select className="h-8 border-2 border-gray-400 w-full rounded-md" {...field}>
                          <option value="">Selecione</option>
                          <option value="branca">Branca</option>
                          <option value="preta">Preta</option>
                          <option value="parda">Parda</option>
                          <option value="amarela">Amarela</option>
                          <option value="indigena">Indígena</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="naturalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Naturalidade</FormLabel>
                      <FormControl>
                        <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nacionalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Nacionalidade</FormLabel>
                      <FormControl>
                        <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="documentacao">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <FormLabel htmlFor="rg-upload" className="text-sm">RG</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="rg-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({...prev, rg: file}));
                            setFileNames(prev => ({...prev, rg: file.name}));
                            form.setValue('rg', file.name);
                          }
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {fileNames.rg ? (
                        <div className="flex items-center gap-2 border rounded-md p-2 w-full bg-gray-50">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate flex-1">{fileNames.rg}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFormData(prev => ({...prev, rg: null}));
                              setFileNames(prev => ({...prev, rg: ''}));
                              form.setValue('rg', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => document.getElementById('rg-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar RG
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.rg && <p className="text-sm text-red-500">{form.formState.errors.rg.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel htmlFor="cpf-upload" className="text-sm">CPF</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="cpf-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({...prev, cpf: file}));
                            setFileNames(prev => ({...prev, cpf: file.name}));
                            form.setValue('cpf', file.name);
                          }
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {fileNames.cpf ? (
                        <div className="flex items-center gap-2 border rounded-md p-2 w-full bg-gray-50">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate flex-1">{fileNames.cpf}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFormData(prev => ({...prev, cpf: null}));
                              setFileNames(prev => ({...prev, cpf: ''}));
                              form.setValue('cpf', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                      </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => document.getElementById('cpf-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar CPF
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.cpf && <p className="text-sm text-red-500">{form.formState.errors.cpf.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel htmlFor="certidao-nascimento-upload" className="text-sm">Certidão de Nascimento</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="certidao-nascimento-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({...prev, certidaoNascimento: file}));
                            setFileNames(prev => ({...prev, certidaoNascimento: file.name}));
                            form.setValue('certidaoNascimento', file.name);
                          }
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {fileNames.certidaoNascimento ? (
                        <div className="flex items-center gap-2 border rounded-md p-2 w-full bg-gray-50">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate flex-1">{fileNames.certidaoNascimento}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFormData(prev => ({...prev, certidaoNascimento: null}));
                              setFileNames(prev => ({...prev, certidaoNascimento: ''}));
                              form.setValue('certidaoNascimento', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => document.getElementById('certidao-nascimento-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar Certidão
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.certidaoNascimento && <p className="text-sm text-red-500">{form.formState.errors.certidaoNascimento.message}</p>}
                  </div>
                  
                  <div className="space-y-2">
                    <FormLabel htmlFor="certidao-casamento-upload" className="text-sm">Certidão de Casamento</FormLabel>
                    <div className="flex items-center gap-2">
                      <Input 
                        id="certidao-casamento-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFormData(prev => ({...prev, certidaoCasamento: file}));
                            setFileNames(prev => ({...prev, certidaoCasamento: file.name}));
                            form.setValue('certidaoCasamento', file.name);
                          }
                        }}
                        accept=".pdf,.jpg,.jpeg,.png"
                      />
                      {fileNames.certidaoCasamento ? (
                        <div className="flex items-center gap-2 border rounded-md p-2 w-full bg-gray-50">
                          <FileText className="h-5 w-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate flex-1">{fileNames.certidaoCasamento}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full"
                            onClick={() => {
                              setFormData(prev => ({...prev, certidaoCasamento: null}));
                              setFileNames(prev => ({...prev, certidaoCasamento: ''}));
                              form.setValue('certidaoCasamento', '');
                            }}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full justify-start gap-2"
                          onClick={() => document.getElementById('certidao-casamento-upload')?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Selecionar Certidão
                        </Button>
                      )}
                    </div>
                    {form.formState.errors.certidaoCasamento && <p className="text-sm text-red-500">{form.formState.errors.certidaoCasamento.message}</p>}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="saude">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 space-y-4">
                <FormField
                  control={form.control}
                    name="tipoSanguineo"
                  render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm">Tipo Sanguíneo</FormLabel>
                      <FormControl>
                          <select className="h-8 border-2 border-gray-400 w-full rounded-md" {...field}>
                            <option value="">Selecione</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                          </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="alergias"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Alergias</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="medicamentos"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Medicamentos</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="deficiencias"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Deficiências</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="escolar">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 space-y-4">
                <FormField
                  control={form.control}
                    name="escola"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Escola</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="serie"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Série</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="turno"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Turno</FormLabel>
                      <FormControl>
                          <select className="h-8 border-2 border-gray-400 w-full rounded-md" {...field}>
                            <option value="">Selecione</option>
                            <option value="manha">Manhã</option>
                            <option value="tarde">Tarde</option>
                            <option value="noite">Noite</option>
                          </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="transporteEscolar"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Transporte Escolar</FormLabel>
                      <FormControl>
                          <select className="h-8 border-2 border-gray-400 w-full rounded-md" {...field}>
                            <option value="">Selecione</option>
                            <option value="sim">Sim</option>
                            <option value="nao">Não</option>
                          </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            </TabsContent>
                
            <TabsContent value="familiar">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 space-y-4">
                <FormField
                  control={form.control}
                    name="nomeMae"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Nome da Mãe</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="nomePai"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Nome do Pai</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="telefoneContato"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Telefone de Contato</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="enderecoFamiliar"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Endereço Familiar</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            </TabsContent>
                
            <TabsContent value="acolhimento">
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3 space-y-4">
                <FormField
                  control={form.control}
                    name="dataEntrada"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Data de Entrada</FormLabel>
                      <FormControl>
                          <Input type="date" className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="motivoAcolhimento"
                  render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-sm">Motivo do Acolhimento</FormLabel>
                      <FormControl>
                          <Textarea className="min-h-[80px] border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                    name="medidaProtecao"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-sm">Medida de Proteção</FormLabel>
                      <FormControl>
                          <Input className="h-8 border-2 border-gray-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            {currentTab !== "dadosPessoais" && (
              <Button variant="outline" onClick={goToPreviousTab}>
                Anterior
              </Button>
            )}
            <Button onClick={handleSaveAndContinue}>
              Próximo
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AcolhidoCadastro;