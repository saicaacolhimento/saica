
import React from 'react';
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

const formSchema = z.object({
  nome: z.string().min(2, "Nome é obrigatório"),
  dataNascimento: z.string().min(1, "Data de nascimento é obrigatória"),
  nomeMae: z.string().min(2, "Nome da mãe é obrigatório"),
  cpf: z.string().optional(),
  rg: z.string().optional(),
  endereco: z.string().optional(),
  telefone: z.string().optional(),
  nomePai: z.string().optional(),
  possuiIrmaos: z.boolean().default(false),
  numeroIrmaos: z.string().optional(),
  nomesIrmaos: z.string().optional(),
  enderecoFamiliaExtensa: z.string().optional(),
  telefoneFamiliaExtensa: z.string().optional(),
  numeroAcolhimentos: z.string().optional(),
  instituicoesAnteriores: z.string().optional(),
  tecnicoReferencia: z.string().optional(),
  diagnosticoMedico: z.string().optional(),
  caps: z.string().optional(),
  creas: z.string().optional(),
  tecnicoCreas: z.string().optional(),
  cras: z.string().optional(),
  tecnicoCras: z.string().optional(),
  medicacao: z.string().optional(),
  drogas: z.string().optional(),
  numeroProcesso: z.string().optional(),
  escolaAtual: z.string().optional(),
  escolaAnterior: z.string().optional(),
  telefoneEscola: z.string().optional(),
  tecnicoForum: z.string().optional(),
  descricaoCaso: z.string().optional(),
});

const AcolhidoCadastro: React.FC = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      dataNascimento: "",
      nomeMae: "",
      possuiIrmaos: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    // Aqui seria enviado para o backend
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-saica-blue mb-6">Cadastro de Acolhido</h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Tabs defaultValue="dadosPessoais" className="w-full">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="dadosPessoais">Dados Pessoais</TabsTrigger>
              <TabsTrigger value="familia">Família</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
              <TabsTrigger value="acompanhamento">Acompanhamento</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="dadosPessoais" className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo*</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome completo" {...field} />
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
                      <FormLabel>Data de Nascimento*</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cpf"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF</FormLabel>
                      <FormControl>
                        <Input placeholder="000.000.000-00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="rg"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RG</FormLabel>
                      <FormControl>
                        <Input placeholder="00.000.000-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="endereco"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="familia" className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nomeMae"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Mãe*</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo da mãe" {...field} />
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
                      <FormLabel>Nome do Pai</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome completo do pai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="possuiIrmaos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Possui Irmãos</FormLabel>
                      </div>
                    </FormItem>
                  )}
                />
                
                {form.watch("possuiIrmaos") && (
                  <>
                    <FormField
                      control={form.control}
                      name="numeroIrmaos"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantos irmãos?</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="nomesIrmaos"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Nomes dos irmãos</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Liste os nomes dos irmãos" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
                
                <FormField
                  control={form.control}
                  name="enderecoFamiliaExtensa"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Endereço da Família Extensa</FormLabel>
                      <FormControl>
                        <Input placeholder="Endereço de outros familiares" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefoneFamiliaExtensa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone da Família Extensa</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="historico" className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="numeroAcolhimentos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Acolhimentos</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="instituicoesAnteriores"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Instituições pelas quais passou</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Liste as instituições anteriores" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="numeroProcesso"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número do Processo Judicial</FormLabel>
                      <FormControl>
                        <Input placeholder="Nº do processo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="acompanhamento" className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tecnicoReferencia"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico de Referência Atual</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do técnico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="diagnosticoMedico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diagnóstico Médico</FormLabel>
                      <FormControl>
                        <Input placeholder="Se houver" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="caps"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CAPS Frequentado</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do CAPS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="creas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CREAS</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do CREAS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tecnicoCreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico de Referência do CREAS</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do técnico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CRAS</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do CRAS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tecnicoCras"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico de Referência do CRAS</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do técnico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="medicacao"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Uso de Medicação</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Quais medicamentos, datas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="drogas"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Uso de Drogas</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Quais substâncias" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="escolaAtual"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escola Atual</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da escola" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="escolaAnterior"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Escola Anterior</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da escola" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="telefoneEscola"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone da Escola</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tecnicoForum"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Técnico de Referência do Fórum</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome do técnico" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="descricaoCaso"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Descrição do Caso</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva detalhadamente o caso" 
                          className="min-h-[150px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="documentos" className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Documentos Pessoais (RG, CPF, Certidão de Nascimento)*</h3>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Arraste ou clique para enviar documentos (PDF)</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Selecionar Arquivos
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Fotos da Criança (mínimo 1, máximo 5)*</h3>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Arraste ou clique para enviar fotos (JPG, PNG)</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Selecionar Fotos
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Laudos Médicos e Outros Documentos</h3>
                  <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Arraste ou clique para enviar documentos (PDF)</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Selecionar Documentos
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" type="button">Cancelar</Button>
            <Button type="submit" className="bg-saica-blue hover:bg-saica-light-blue">Salvar Cadastro</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AcolhidoCadastro;
