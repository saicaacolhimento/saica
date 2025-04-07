import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart, Pie, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ResponsiveContainer, Cell } from 'recharts';

const Estatisticas: React.FC = () => {
  // Dados de exemplo para os gráficos
  const dadosPorEstado = [
    { estado: 'SP', acolhidos: 423, abrigos: 35 },
    { estado: 'RJ', acolhidos: 298, abrigos: 24 },
    { estado: 'MG', acolhidos: 187, abrigos: 18 },
    { estado: 'BA', acolhidos: 156, abrigos: 14 },
    { estado: 'RS', acolhidos: 134, abrigos: 12 },
    { estado: 'PR', acolhidos: 112, abrigos: 10 },
    { estado: 'PE', acolhidos: 98, abrigos: 8 },
  ];

  const dadosPorIdade = [
    { name: '0-2 anos', valor: 128 },
    { name: '3-5 anos', valor: 165 },
    { name: '6-9 anos', valor: 246 },
    { name: '10-12 anos', valor: 213 },
    { name: '13-15 anos', valor: 187 },
    { name: '16-18 anos', valor: 124 },
  ];

  const dadosPorSexo = [
    { name: 'Masculino', value: 540 },
    { name: 'Feminino', value: 523 },
  ];

  const dadosPorTempo = [
    { mes: 'Jan', acolhimentos: 42, desligamentos: 24 },
    { mes: 'Fev', acolhimentos: 38, desligamentos: 30 },
    { mes: 'Mar', acolhimentos: 45, desligamentos: 28 },
    { mes: 'Abr', acolhimentos: 39, desligamentos: 32 },
    { mes: 'Mai', acolhimentos: 47, desligamentos: 29 },
    { mes: 'Jun', acolhimentos: 52, desligamentos: 36 },
    { mes: 'Jul', acolhimentos: 43, desligamentos: 31 },
    { mes: 'Ago', acolhimentos: 41, desligamentos: 27 },
    { mes: 'Set', acolhimentos: 48, desligamentos: 33 },
    { mes: 'Out', acolhimentos: 46, desligamentos: 35 },
    { mes: 'Nov', acolhimentos: 51, desligamentos: 38 },
    { mes: 'Dez', acolhimentos: 55, desligamentos: 40 },
  ];

  const COLORS = ['#6366F1', '#EC4899', '#14B8A6', '#F97316', '#8B5CF6', '#06B6D4'];

  return (
    <div>
      <h1 className="text-2xl font-bold text-saica-blue mb-6">Estatísticas</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-saica-blue">1.063</div>
              <p className="text-sm text-gray-500">Acolhidos no Total</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-saica-blue">121</div>
              <p className="text-sm text-gray-500">Abrigos Cadastrados</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center">
              <div className="text-4xl font-bold text-saica-blue">76</div>
              <p className="text-sm text-gray-500">Órgãos Integrados</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="regiao" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="regiao">Por Estado/Região</TabsTrigger>
          <TabsTrigger value="idade">Por Idade</TabsTrigger>
          <TabsTrigger value="sexo">Por Sexo</TabsTrigger>
          <TabsTrigger value="tempo">Acolhimentos por Tempo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="regiao">
          <Card>
            <CardHeader>
              <CardTitle>Acolhidos por Estado</CardTitle>
              <CardDescription>Distribuição de acolhidos e abrigos por estado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosPorEstado}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="estado" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="acolhidos" name="Acolhidos" fill="#6366F1" />
                    <Bar dataKey="abrigos" name="Abrigos" fill="#14B8A6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="idade">
          <Card>
            <CardHeader>
              <CardTitle>Acolhidos por Faixa Etária</CardTitle>
              <CardDescription>Distribuição de acolhidos por idade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dadosPorIdade}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="valor" name="Número de Acolhidos" fill="#8B5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sexo">
          <Card>
            <CardHeader>
              <CardTitle>Acolhidos por Sexo</CardTitle>
              <CardDescription>Distribuição de acolhidos por sexo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex justify-center">
                <ResponsiveContainer width="80%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosPorSexo}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={150}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {dadosPorSexo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tempo">
          <Card>
            <CardHeader>
              <CardTitle>Acolhimentos x Desligamentos</CardTitle>
              <CardDescription>Evolução mensal de acolhimentos e desligamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={dadosPorTempo}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mes" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="acolhimentos" name="Acolhimentos" stroke="#6366F1" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="desligamentos" name="Desligamentos" stroke="#F97316" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Estatisticas;
