import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { shelterService } from '@/services/shelter';
import type { Shelter } from '@/types/shelter';

export default function ShelterDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: shelter, isLoading } = useQuery({
    queryKey: ['shelter', id],
    queryFn: () => shelterService.getShelterById(id!),
    enabled: !!id,
  });

  if (isLoading || !shelter) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Detalhes do Abrigo</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/abrigos/${id}/editar`)}
            >
              Editar
            </Button>
            <Button variant="outline" onClick={() => navigate('/abrigos')}>
              Voltar
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-2">Informações Básicas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{shelter.nome}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{shelter.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Capacidade</p>
                  <p className="font-medium">{shelter.capacidade} pessoas</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ocupação Atual</p>
                  <p className="font-medium">{shelter.ocupacao_atual} pessoas</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Contato</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{shelter.telefone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{shelter.email}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Endereço</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500">Endereço</p>
                  <p className="font-medium">{shelter.endereco}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Cidade</p>
                    <p className="font-medium">{shelter.cidade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="font-medium">{shelter.estado}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CEP</p>
                    <p className="font-medium">{shelter.cep}</p>
                  </div>
                </div>
              </div>
            </div>

            {shelter.descricao && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Descrição</h2>
                <p className="text-gray-700">{shelter.descricao}</p>
              </div>
            )}

            {shelter.observacoes && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Observações</h2>
                <p className="text-gray-700">{shelter.observacoes}</p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Informações do Sistema</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Criado em</p>
                  <p className="font-medium">
                    {new Date(shelter.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Última atualização</p>
                  <p className="font-medium">
                    {new Date(shelter.updated_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 