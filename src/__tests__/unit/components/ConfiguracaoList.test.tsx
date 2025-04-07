import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ConfiguracaoList } from '@/features/configuracoes/pages/ConfiguracaoList'
import { useConfiguracao } from '@/hooks/useConfiguracao'

// Mock do hook
jest.mock('@/hooks/useConfiguracao')

describe('ConfiguracaoList', () => {
  const mockConfiguracoes = [
    {
      id: '1',
      chave: 'email_host',
      valor: 'smtp.example.com',
      descricao: 'Servidor SMTP',
      tipo: 'texto',
      categoria: 'email',
      obrigatorio: true,
      created_at: '2024-03-21T00:00:00Z',
      updated_at: '2024-03-21T00:00:00Z'
    },
    {
      id: '2',
      chave: 'email_port',
      valor: '587',
      descricao: 'Porta SMTP',
      tipo: 'numero',
      categoria: 'email',
      obrigatorio: true,
      created_at: '2024-03-21T00:00:00Z',
      updated_at: '2024-03-21T00:00:00Z'
    }
  ]

  beforeEach(() => {
    (useConfiguracao as jest.Mock).mockReturnValue({
      getConfiguracoes: () => ({
        data: mockConfiguracoes,
        isLoading: false
      }),
      deleteConfiguracao: jest.fn()
    })
  })

  it('deve renderizar a lista de configurações', () => {
    render(<ConfiguracaoList />)
    
    expect(screen.getByText('email_host')).toBeInTheDocument()
    expect(screen.getByText('Servidor SMTP')).toBeInTheDocument()
    expect(screen.getByText('email_port')).toBeInTheDocument()
    expect(screen.getByText('Porta SMTP')).toBeInTheDocument()
  })

  it('deve filtrar configurações ao digitar na busca', () => {
    render(<ConfiguracaoList />)
    
    const searchInput = screen.getByPlaceholderText('Buscar configurações...')
    fireEvent.change(searchInput, { target: { value: 'email' } })
    
    expect(screen.getByText('email_host')).toBeInTheDocument()
    expect(screen.getByText('email_port')).toBeInTheDocument()
  })

  it('deve mostrar diálogo de confirmação ao clicar em excluir', () => {
    render(<ConfiguracaoList />)
    
    const deleteButton = screen.getAllByRole('button', { name: /excluir/i })[0]
    fireEvent.click(deleteButton)
    
    expect(screen.getByText('Excluir configuração')).toBeInTheDocument()
  })

  it('deve chamar deleteConfiguracao ao confirmar exclusão', async () => {
    const deleteConfiguracao = jest.fn()
    ;(useConfiguracao as jest.Mock).mockReturnValue({
      getConfiguracoes: () => ({
        data: mockConfiguracoes,
        isLoading: false
      }),
      deleteConfiguracao
    })

    render(<ConfiguracaoList />)
    
    const deleteButton = screen.getAllByRole('button', { name: /excluir/i })[0]
    fireEvent.click(deleteButton)
    
    const confirmButton = screen.getByRole('button', { name: /confirmar/i })
    fireEvent.click(confirmButton)
    
    await waitFor(() => {
      expect(deleteConfiguracao).toHaveBeenCalledWith('1')
    })
  })

  it('deve mostrar loading state enquanto carrega', () => {
    ;(useConfiguracao as jest.Mock).mockReturnValue({
      getConfiguracoes: () => ({
        data: [],
        isLoading: true
      }),
      deleteConfiguracao: jest.fn()
    })

    render(<ConfiguracaoList />)
    
    expect(screen.getAllByTestId('skeleton')).toHaveLength(3)
  })
}) 