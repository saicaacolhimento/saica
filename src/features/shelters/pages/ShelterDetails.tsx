import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { shelterService } from '@/services/shelter';
import type { Shelter } from '@/types/shelter';
import { useRef, useEffect, useState } from 'react';

export default function ShelterDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const [empresasVinculadas, setEmpresasVinculadas] = useState<any[]>([]);

  const { data: shelter, isLoading } = useQuery({
    queryKey: ['shelter', id],
    queryFn: () => shelterService.getShelterById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    async function fetchEmpresasVinculadas() {
      if (shelter && shelter.empresas_vinculadas && Array.isArray(shelter.empresas_vinculadas) && shelter.empresas_vinculadas.length > 0) {
        try {
          const empresas = await shelterService.getSheltersByIds(shelter.empresas_vinculadas);
          setEmpresasVinculadas(empresas);
        } catch (err) {
          // erro silencioso
        }
      } else {
        setEmpresasVinculadas([]);
      }
    }
    fetchEmpresasVinculadas();
  }, [shelter]);

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
            <div className="space-y-6 print:space-y-0 print:grid print:grid-cols-2 print:gap-8">
              <div className="print:col-span-1">
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
                      <p className="text-sm text-gray-500">Telefone da Empresa</p>
                      <p className="font-medium">{shelter.telefone_orgao}</p>
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
              </div>
              <div className="print:col-span-1">
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
                  <h2 className="text-lg font-semibold mb-2">Empresas Vinculadas</h2>
                  {empresasVinculadas.length === 0 ? (
                    <p className="text-sm text-gray-500">Nenhuma empresa vinculada.</p>
                  ) : (
                    <ul className="space-y-4">
                      {empresasVinculadas.map(emp => (
                        <li key={emp.id} className="text-sm border-b pb-2">
                          <div><span className="font-semibold">{emp.nome}</span> {emp.tipo && emp.tipo !== 'ABRIGO' ? <span className="text-gray-500">({emp.tipo})</span> : null}</div>
                          <div><span className="text-gray-500">Telefone:</span> {emp.telefone_orgao || emp.telefone}</div>
                          <div><span className="text-gray-500">Endereço:</span> {emp.endereco}</div>
                          <div><span className="text-gray-500">Responsável:</span> {emp.responsavel_nome}</div>
                          <div><span className="text-gray-500">Email do Responsável:</span> {emp.responsavel_email}</div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
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
            max-width: 100% !important;
            margin: 0 !important;
            text-align: left !important;
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
          .print-ficha .space-y-6 {
            margin: 0 !important;
            padding: 0 !important;
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 32px !important;
            border: 1px solid #ccc !important;
          }
          .print-ficha .print\:col-span-1 {
            grid-column: span 1 !important;
            padding: 16px !important;
            border-right: 1px solid #eee !important;
          }
          .print-ficha .print\:col-span-1:last-child {
            border-right: none !important;
          }
          .print-ficha h1, .print-ficha h2 {
            text-align: left !important;
            margin-left: 0 !important;
          }
          .print-ficha .flex, .print-ficha .justify-center, .print-ficha .mb-6 {
            justify-content: flex-start !important;
            margin-bottom: 0 !important;
          }
          .print-ficha img {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </>
  );
} 