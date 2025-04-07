describe('Fluxo de Configurações', () => {
  beforeEach(() => {
    // Login como administrador
    cy.login('admin@example.com', 'admin123')
    cy.visit('/configuracoes')
  })

  it('deve listar configurações', () => {
    cy.get('h1').should('contain', 'Configurações')
    cy.get('[data-testid="configuracao-card"]').should('have.length.greaterThan', 0)
  })

  it('deve criar nova configuração', () => {
    cy.get('a').contains('Nova Configuração').click()
    cy.url().should('include', '/configuracoes/nova')

    // Preenche o formulário
    cy.get('input[name="chave"]').type('email_host')
    cy.get('input[name="valor"]').type('smtp.example.com')
    cy.get('textarea[name="descricao"]').type('Servidor SMTP')
    cy.get('select[name="tipo"]').select('texto')
    cy.get('select[name="categoria"]').select('email')
    cy.get('input[name="obrigatorio"]').check()

    // Submete o formulário
    cy.get('button').contains('Salvar').click()

    // Verifica se foi redirecionado e se a configuração aparece na lista
    cy.url().should('include', '/configuracoes')
    cy.contains('email_host').should('exist')
    cy.contains('Servidor SMTP').should('exist')
  })

  it('deve editar configuração existente', () => {
    // Clica no botão de editar da primeira configuração
    cy.get('[data-testid="configuracao-card"]').first()
      .find('button').contains('Editar').click()

    // Verifica se foi redirecionado para a página de edição
    cy.url().should('include', '/editar')

    // Altera o valor
    cy.get('input[name="valor"]').clear().type('novo.smtp.example.com')

    // Salva as alterações
    cy.get('button').contains('Salvar').click()

    // Verifica se foi redirecionado e se o valor foi atualizado
    cy.url().should('include', '/configuracoes')
    cy.contains('novo.smtp.example.com').should('exist')
  })

  it('deve excluir configuração', () => {
    // Clica no botão de excluir da primeira configuração
    cy.get('[data-testid="configuracao-card"]').first()
      .find('button').contains('Excluir').click()

    // Confirma a exclusão
    cy.get('button').contains('Confirmar').click()

    // Verifica se a configuração foi removida
    cy.get('[data-testid="configuracao-card"]').first()
      .should('not.contain', 'email_host')
  })

  it('deve filtrar configurações', () => {
    // Digite na busca
    cy.get('input[placeholder="Buscar configurações..."]').type('email')

    // Verifica se apenas as configurações de email são exibidas
    cy.get('[data-testid="configuracao-card"]').each(($card) => {
      cy.wrap($card).should('contain', 'email')
    })
  })

  it('deve validar campos obrigatórios', () => {
    cy.get('a').contains('Nova Configuração').click()

    // Tenta submeter o formulário vazio
    cy.get('button').contains('Salvar').click()

    // Verifica se as mensagens de erro aparecem
    cy.contains('Chave é obrigatória').should('exist')
    cy.contains('Valor é obrigatório').should('exist')
    cy.contains('Descrição é obrigatória').should('exist')
    cy.contains('Tipo é obrigatório').should('exist')
    cy.contains('Categoria é obrigatória').should('exist')
  })

  it('deve mostrar loading state', () => {
    // Simula uma resposta lenta do servidor
    cy.intercept('GET', '/rest/v1/configuracoes', (req) => {
      req.reply({
        delay: 1000,
        statusCode: 200,
        body: []
      })
    })

    cy.visit('/configuracoes')

    // Verifica se o skeleton loading aparece
    cy.get('[data-testid="skeleton"]').should('exist')
  })
}) 