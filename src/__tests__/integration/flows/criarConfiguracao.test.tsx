import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ConfiguracaoCreate } from '@/features/configuracoes/pages/ConfiguracaoCreate'
import { useConfiguracao } from '@/hooks/useConfiguracao'

// Mock do hook
jest.mock('@/hooks/useConfiguracao')

describe('Fluxo de Criação de Configuração', () => {
  const mockNavigate = jest.fn()
  const mockCreateConfiguracao = jest.fn()

  beforeEach(() => {
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate)
    ;(useConfiguracao as jest.Mock).mockReturnValue({
      createConfiguracao: mockCreateConfiguracao
    })
  })

  it('deve criar uma nova configuração com sucesso', async () => {
    mockCreateConfiguracao.mockResolvedValueOnce({
      id: '1',
      chave: 'email_host',
      valor: 'smtp.example.com',
      descricao: 'Servidor SMTP',
      tipo: 'texto',
      categoria: 'email',
      obrigatorio: true,
      created_at: '2024-03-21T00:00:00Z',
      updated_at: '2024-03-21T00:00:00Z'
    })

    render(
      <BrowserRouter>
        <ConfiguracaoCreate />
      </BrowserRouter>
    )

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/chave/i), {
      target: { value: 'email_host' }
    })
    fireEvent.change(screen.getByLabelText(/valor/i), {
      target: { value: 'smtp.example.com' }
    })
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Servidor SMTP' }
    })
    fireEvent.change(screen.getByLabelText(/tipo/i), {
      target: { value: 'texto' }
    })
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: 'email' }
    })
    fireEvent.click(screen.getByLabelText(/obrigatório/i))

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    // Verifica se a configuração foi criada
    await waitFor(() => {
      expect(mockCreateConfiguracao).toHaveBeenCalledWith({
        chave: 'email_host',
        valor: 'smtp.example.com',
        descricao: 'Servidor SMTP',
        tipo: 'texto',
        categoria: 'email',
        obrigatorio: true
      })
    })

    // Verifica se foi redirecionado para a lista
    expect(mockNavigate).toHaveBeenCalledWith('/configuracoes')
  })

  it('deve mostrar erro ao tentar criar configuração com chave duplicada', async () => {
    mockCreateConfiguracao.mockRejectedValueOnce(new Error('Chave já existe'))

    render(
      <BrowserRouter>
        <ConfiguracaoCreate />
      </BrowserRouter>
    )

    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/chave/i), {
      target: { value: 'email_host' }
    })
    fireEvent.change(screen.getByLabelText(/valor/i), {
      target: { value: 'smtp.example.com' }
    })
    fireEvent.change(screen.getByLabelText(/descrição/i), {
      target: { value: 'Servidor SMTP' }
    })
    fireEvent.change(screen.getByLabelText(/tipo/i), {
      target: { value: 'texto' }
    })
    fireEvent.change(screen.getByLabelText(/categoria/i), {
      target: { value: 'email' }
    })

    // Submete o formulário
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    // Verifica se o erro foi exibido
    await waitFor(() => {
      expect(screen.getByText('Chave já existe')).toBeInTheDocument()
    })

    // Verifica se não foi redirecionado
    expect(mockNavigate).not.toHaveBeenCalled()
  })

  it('deve validar campos obrigatórios', async () => {
    render(
      <BrowserRouter>
        <ConfiguracaoCreate />
      </BrowserRouter>
    )

    // Tenta submeter o formulário vazio
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }))

    // Verifica se as mensagens de erro foram exibidas
    expect(screen.getByText('Chave é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Valor é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('Tipo é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument()

    // Verifica se não foi chamada a função de criação
    expect(mockCreateConfiguracao).not.toHaveBeenCalled()

    // Verifica se não foi redirecionado
    expect(mockNavigate).not.toHaveBeenCalled()
  })
}) 