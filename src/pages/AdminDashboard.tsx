
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Building, Users, Shield, Settings, Plus, BarChart } from "lucide-react";
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-saica-blue">Administração SAICA</h1>
        <div className="flex gap-2">
          <Link to="/adminhome/estatisticas">
            <Button variant="outline">
              <BarChart className="h-4 w-4 mr-2" />
              Estatísticas
            </Button>
          </Link>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
          <Button className="bg-saica-blue hover:bg-saica-light-blue">
            <Plus className="h-4 w-4 mr-2" />
            Novo Abrigo
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Abrigos</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Building className="h-6 w-6 text-saica-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total de Acolhidos</p>
                <p className="text-2xl font-bold">187</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-6 w-6 text-saica-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Órgãos Cadastrados</p>
                <p className="text-2xl font-bold">42</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Shield className="h-6 w-6 text-saica-blue" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="abrigos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="abrigos">Abrigos</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="orgaos">Órgãos Externos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="abrigos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Abrigos</CardTitle>
              <CardDescription>Lista de todos os abrigos cadastrados no sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome do Abrigo</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Acolhidos</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, nome: "Lar Feliz", cidade: "São Paulo", estado: "SP", responsavel: "Maria Silva", acolhidos: 12, status: "Ativo" },
                      { id: 2, nome: "Casa Esperança", cidade: "Rio de Janeiro", estado: "RJ", responsavel: "João Oliveira", acolhidos: 8, status: "Ativo" },
                      { id: 3, nome: "Abrigo Novo Amanhã", cidade: "Curitiba", estado: "PR", responsavel: "Ana Pereira", acolhidos: 15, status: "Ativo" },
                      { id: 4, nome: "Instituto Criança Feliz", cidade: "Belo Horizonte", estado: "MG", responsavel: "Carlos Santos", acolhidos: 10, status: "Inativo" },
                      { id: 5, nome: "Lar dos Pequeninos", cidade: "Salvador", estado: "BA", responsavel: "Juliana Costa", acolhidos: 9, status: "Ativo" },
                    ].map((abrigo) => (
                      <TableRow key={abrigo.id}>
                        <TableCell className="font-medium">{abrigo.nome}</TableCell>
                        <TableCell>{abrigo.cidade}</TableCell>
                        <TableCell>{abrigo.estado}</TableCell>
                        <TableCell>{abrigo.responsavel}</TableCell>
                        <TableCell>{abrigo.acolhidos}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            abrigo.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {abrigo.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="usuarios">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Usuários</CardTitle>
              <CardDescription>Usuários administrativos do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Abrigo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, nome: "Ana Coordenadora", email: "ana@example.com", perfil: "Administrador", abrigo: "Lar Feliz", status: "Ativo" },
                      { id: 2, nome: "João Psicólogo", email: "joao@example.com", perfil: "Técnico", abrigo: "Lar Feliz", status: "Ativo" },
                      { id: 3, nome: "Maria Assistente", email: "maria@example.com", perfil: "Assistente Social", abrigo: "Casa Esperança", status: "Ativo" },
                      { id: 4, nome: "Pedro Educador", email: "pedro@example.com", perfil: "Educador", abrigo: "Abrigo Novo Amanhã", status: "Inativo" },
                    ].map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nome}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.perfil}</TableCell>
                        <TableCell>{usuario.abrigo}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            usuario.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {usuario.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orgaos">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciamento de Órgãos Externos</CardTitle>
              <CardDescription>CREAS, CRAS, CAPS, Conselho Tutelar e outros</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Responsável</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { id: 1, nome: "CREAS Central", tipo: "CREAS", cidade: "São Paulo", estado: "SP", responsavel: "Juliana Melo", status: "Ativo" },
                      { id: 2, nome: "CRAS Norte", tipo: "CRAS", cidade: "São Paulo", estado: "SP", responsavel: "Roberto Alves", status: "Ativo" },
                      { id: 3, nome: "CAPS Infantil", tipo: "CAPS", cidade: "São Paulo", estado: "SP", responsavel: "Sandra Lima", status: "Ativo" },
                      { id: 4, nome: "Conselho Tutelar Zona Sul", tipo: "Conselho Tutelar", cidade: "Rio de Janeiro", estado: "RJ", responsavel: "Marcos Silva", status: "Ativo" },
                    ].map((orgao) => (
                      <TableRow key={orgao.id}>
                        <TableCell className="font-medium">{orgao.nome}</TableCell>
                        <TableCell>{orgao.tipo}</TableCell>
                        <TableCell>{orgao.cidade}</TableCell>
                        <TableCell>{orgao.estado}</TableCell>
                        <TableCell>{orgao.responsavel}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            orgao.status === 'Ativo' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {orgao.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">Editar</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
