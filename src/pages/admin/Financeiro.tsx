import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, DollarSign, ShoppingCart, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChartContainer } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function Financeiro() {
  const navigate = useNavigate();
  const modules = [
    {
      title: 'Doações',
      description: 'Registrar e consultar doações',
      route: '/admin/financeiro/doacoes',
      icon: DollarSign,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Despesas',
      description: 'Registrar e consultar despesas',
      route: '/admin/financeiro/despesas',
      icon: ShoppingCart,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    {
      title: 'Estoque',
      description: 'Controle de itens doados',
      route: '/admin/financeiro/estoque',
      icon: Archive,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Relatórios',
      description: 'Relatórios financeiros',
      route: '/admin/financeiro/relatorios',
      icon: Activity,
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    }
  ];

  // Dados mockados para doações
  const doacoesData = [
    { name: 'Dinheiro', value: 500 },
    { name: 'Alimentos', value: 350 },
    { name: 'Roupas', value: 150 },
    { name: 'Produtos de higiene', value: 100 },
    { name: 'Outros', value: 80 },
  ];
  const doacoesColors = ['#27ae60', '#2980b9', '#f1c40f', '#e67e22', '#7f8c8d'];

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center mb-6 gap-4 justify-between">
        <h1 className="text-2xl font-bold">Gestão Financeira</h1>
        <Button variant="outline" onClick={() => navigate('/admin/dashboard')}>
          Voltar
        </Button>
      </div>
      {/* Dashboard visual de despesas centralizado */}
      {/* Removido temporariamente até integração com dados reais */}
      {/* Cards de navegação para as funcionalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {modules.map((module, index) => (
          <Card
            key={index}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(module.route)}
          >
            <CardHeader className="flex flex-col items-center pb-2">
              <div className={`p-2 ${module.bgColor} rounded-lg mb-2`}>
                <module.icon className={`h-10 w-10 ${module.iconColor}`} />
              </div>
              <CardTitle className="text-lg text-center w-full">{module.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">{module.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 