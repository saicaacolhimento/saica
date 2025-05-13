import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { shelterService } from '@/services/shelter';
import type { Shelter } from '@/types/shelter';
import { useRef } from 'react';

export default function ShelterDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);

  const { data: shelter, isLoading } = useQuery({
    queryKey: ['shelter', id],
    queryFn: () => shelterService.getShelterById(id!),
    enabled: !!id,
  });

  const handlePrint = () => {
    if (printRef.current) {
      window.print();
    }
  };

  if (isLoading || !shelter) {
    return (
      <div className="container mx-auto px-4">
        <div className="text-center">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 print-ficha">
      <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-2xl font-bold">Detalhes da Empresa</h1>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/admin/empresas/${id}/editar`)}
            >
              Editar
            </Button>
            <Button variant="outline" onClick={() => navigate('/admin/empresas')}>
              Voltar
            </Button>
              <Button variant="default" onClick={handlePrint}>
                Imprimir Ficha
              </Button>
          </div>
        </div>

          <div ref={printRef} className="bg-white rounded-lg shadow p-6 print:shadow-none print:bg-white print:p-0 print:rounded-none">
          <div className="space-y-6">
            {shelter.logo_url && (
              <div className="flex justify-center mb-6">
                <img 
                  src={shelter.logo_url} 
                  alt={`Logo do ${shelter.nome}`}
                    className="w-32 h-32 object-cover rounded-lg print:mx-auto print:mb-4 print:rounded-none"
                />
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-2">Informações Básicas</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Nome</p>
                  <p className="font-medium">{shelter.nome}</p>
                </div>
                  <div>
                    <p className="text-sm text-gray-500">CNPJ</p>
                    <p className="font-medium">{shelter.cnpj}</p>
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
                <h2 className="text-lg font-semibold mb-2">Responsável</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nome do Responsável</p>
                    <p className="font-medium">{shelter.responsavel_nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email do Responsável</p>
                    <p className="font-medium">{shelter.responsavel_email}</p>
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
                    <p className="font-medium">{shelter.postal_code}</p>
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
      <style>{`
        @media print {
          @page {
            margin: 0;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
            background: #fff !important;
          }
          body * {
            visibility: hidden !important;
          }
          .print-ficha, .print-ficha * {
            visibility: visible !important;
            display: block !important;
          }
          .print-ficha {
            width: 100vw !important;
            min-height: 100vh !important;
            background: #fff !important;
            margin: 0 auto !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .print-ficha .max-w-2xl {
            max-width: 700px !important;
            margin: 40px auto 40px auto !important;
            text-align: center !important;
            background: #fff !important;
            padding: 0 !important;
            box-shadow: none !important;
          }
          .print-ficha .bg-white, .print-ficha .rounded-lg, .print-ficha .shadow, .print-ficha .p-6 {
            box-shadow: none !important;
            border-radius: 0 !important;
            background: #fff !important;
            padding: 0 !important;
          }
          .print-ficha .space-y-6 > * {
            margin-left: auto !important;
            margin-right: auto !important;
          }
          .print-ficha .grid {
            justify-content: center !important;
            text-align: left !important;
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      `}</style>
    </>
  );
} 