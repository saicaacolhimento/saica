
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Search, 
  Plus, 
  FileText, 
  MoreVertical, 
  Edit, 
  Trash, 
  Eye, 
  Filter 
} from "lucide-react";

// Dados de exemplo
const acolhidos = [
  { id: 1, nome: "João Silva", idade: 8, dataAcolhimento: "15/03/2023", status: "Ativo", tecnico: "Maria Souza" },
  { id: 2, nome: "Ana Oliveira", idade: 5, dataAcolhimento: "22/05/2023", status: "Ativo", tecnico: "Carlos Mendes" },
  { id: 3, nome: "Pedro Santos", idade: 12, dataAcolhimento: "10/01/2023", status: "Ativo", tecnico: "Juliana Ramos" },
  { id: 4, nome: "Mariana Costa", idade: 3, dataAcolhimento: "30/04/2023", status: "Ativo", tecnico: "Roberto Alves" },
  { id: 5, nome: "Lucas Pereira", idade: 10, dataAcolhimento: "05/02/2023", status: "Inativo", tecnico: "Fernanda Lima" },
];

const AcolhidoLista: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredAcolhidos = acolhidos.filter(acolhido => 
    acolhido.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acolhido.tecnico.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-saica-blue">Lista de Acolhidos</h1>
        <Button className="bg-saica-blue hover:bg-saica-light-blue">
          <Plus className="h-4 w-4 mr-2" />
          <Link to="/acolhidos/cadastro">Novo Acolhido</Link>
        </Button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou técnico..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>
        
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Data de Acolhimento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Técnico Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAcolhidos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    Nenhum acolhido encontrado com os critérios de busca.
                  </TableCell>
                </TableRow>
              ) : (
                filteredAcolhidos.map((acolhido) => (
                  <TableRow key={acolhido.id}>
                    <TableCell className="font-medium">{acolhido.nome}</TableCell>
                    <TableCell>{acolhido.idade} anos</TableCell>
                    <TableCell>{acolhido.dataAcolhimento}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        acolhido.status === 'Ativo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {acolhido.status}
                      </span>
                    </TableCell>
                    <TableCell>{acolhido.tecnico}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            Visualizar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />
                            Relatórios
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AcolhidoLista;
