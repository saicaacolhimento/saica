import { Link } from 'react-router-dom';
import { Shield, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Configuracoes() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Configurações</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/admin/configuracoes/permissoes">
          <Card className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Permissões</h2>
                <p className="text-sm text-gray-500">
                  Configure as permissões por tipo de empresa
                </p>
              </div>
            </div>
          </Card>
        </Link>

        {/* Adicione mais cards de configuração aqui */}
      </div>
    </div>
  );
} 