import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { acolhidoService } from '@/services/acolhido'
import { useAuth } from '@/contexts/AuthContext'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Printer } from 'lucide-react'

export function AcolhidoView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, session } = useAuth()
  const [isPrinting, setIsPrinting] = useState(false)

  // Buscar dados do acolhido
  const { data: acolhido, isLoading, error } = useQuery({
    queryKey: ['acolhido', id],
    queryFn: () => acolhidoService.getAcolhidoById(id!),
    enabled: !!id
  })

  // Função para imprimir
  const handlePrint = () => {
    setIsPrinting(true)
    window.print()
    setIsPrinting(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500 mb-4">Erro ao carregar dados do acolhido</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  if (!acolhido) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Acolhido não encontrado</p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      {/* Botões de ação */}
      <div className="flex justify-between items-center mb-6 print:hidden">
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
        <Button onClick={handlePrint}>
          <Printer className="w-4 h-4 mr-2" />
          Imprimir
        </Button>
      </div>

      {/* Conteúdo em formato A4 */}
      <div className="bg-white p-8 shadow-lg mx-auto max-w-[210mm] min-h-[297mm] print:shadow-none print:p-0">
        {/* Cabeçalho com fotos */}
        <div className="flex justify-center gap-4 mb-8">
          {acolhido.fotos?.map((foto) => (
            <img
              key={foto.id}
              src={foto.url}
              alt="Foto do acolhido"
              className="w-32 h-32 object-cover rounded-lg"
            />
          ))}
        </div>

        {/* Dados pessoais */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Dados Pessoais</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome Completo</p>
              <p>{acolhido.nome_completo}</p>
            </div>
            <div>
              <p className="font-semibold">Data de Nascimento</p>
              <p>
                {acolhido.data_nascimento
                  ? format(new Date(acolhido.data_nascimento), 'dd/MM/yyyy', {
                      locale: ptBR
                    })
                  : 'Não informado'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Idade</p>
              <p>
                {acolhido.data_nascimento
                  ? `${Math.floor(
                      (new Date().getTime() -
                        new Date(acolhido.data_nascimento).getTime()) /
                        (1000 * 60 * 60 * 24 * 365.25)
                    )} anos`
                  : 'Não informado'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Sexo</p>
              <p>{acolhido.sexo || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Dados da mãe */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Dados da Mãe</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome da Mãe</p>
              <p>{acolhido.nome_mae || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">CPF da Mãe</p>
              <p>{acolhido.cpf_mae || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Telefone da Mãe</p>
              <p>{acolhido.telefone_mae || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Dados do responsável */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Dados do Responsável
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Nome do Responsável</p>
              <p>{acolhido.nome_responsavel || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">CPF do Responsável</p>
              <p>{acolhido.cpf_responsavel || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Telefone do Responsável</p>
              <p>{acolhido.telefone_responsavel || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Dados de saúde */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Dados de Saúde</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Plano de Saúde</p>
              <p>{acolhido.plano_saude || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Número do Plano</p>
              <p>{acolhido.numero_plano || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Observações de Saúde</p>
              <p>{acolhido.observacoes_saude || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Dados educacionais */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Dados Educacionais
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Escola</p>
              <p>{acolhido.escola || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Série</p>
              <p>{acolhido.serie || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Turno</p>
              <p>{acolhido.turno || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Dados de acolhimento */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">
            Dados de Acolhimento
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="font-semibold">Data de Entrada</p>
              <p>
                {acolhido.data_entrada
                  ? format(new Date(acolhido.data_entrada), 'dd/MM/yyyy', {
                      locale: ptBR
                    })
                  : 'Não informado'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Data de Inativação</p>
              <p>
                {acolhido.data_inativacao
                  ? format(new Date(acolhido.data_inativacao), 'dd/MM/yyyy', {
                      locale: ptBR
                    })
                  : 'Não informado'}
              </p>
            </div>
            <div>
              <p className="font-semibold">Status</p>
              <p>{acolhido.status || 'Não informado'}</p>
            </div>
            <div>
              <p className="font-semibold">Abrigo</p>
              <p>{acolhido.empresa?.nome || 'Não informado'}</p>
            </div>
          </div>
        </section>

        {/* Rodapé */}
        <footer className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
          <p>
            Documento gerado em{' '}
            {format(new Date(), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
              locale: ptBR
            })}
          </p>
          <p className="mt-2">Este é um documento oficial do sistema SAICA</p>
        </footer>
      </div>
    </div>
  )
} 