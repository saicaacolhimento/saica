// Comando para fazer login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login')
  cy.get('input[name="email"]').type(email)
  cy.get('input[name="password"]').type(password)
  cy.get('button').contains('Entrar').click()
  cy.url().should('include', '/dashboard')
})

// Comando para limpar o estado do banco de dados antes de cada teste
Cypress.Commands.add('cleanDatabase', () => {
  cy.request('POST', '/api/test/clean-database')
})

// Comando para criar um usuário de teste
Cypress.Commands.add('createTestUser', (user: { email: string; password: string; role: string }) => {
  cy.request('POST', '/api/test/create-user', user)
})

// Comando para criar uma configuração de teste
Cypress.Commands.add('createTestConfig', (config: {
  chave: string
  valor: string
  descricao: string
  tipo: string
  categoria: string
  obrigatorio: boolean
}) => {
  cy.request('POST', '/api/test/create-config', config)
})

// Comando para criar um relatório de teste
Cypress.Commands.add('createTestReport', (report: {
  nome: string
  descricao: string
  tipo: string
  template_id: string
  parametros: Record<string, any>
}) => {
  cy.request('POST', '/api/test/create-report', report)
})

// Comando para criar um template de relatório de teste
Cypress.Commands.add('createTestTemplate', (template: {
  nome: string
  descricao: string
  conteudo: string
  parametros: string[]
}) => {
  cy.request('POST', '/api/test/create-template', template)
})

// Comando para criar um backup de teste
Cypress.Commands.add('createTestBackup', (backup: {
  tipo: 'completo' | 'parcial'
  status: 'pendente' | 'concluido' | 'erro'
  url_download?: string
  erro?: string
}) => {
  cy.request('POST', '/api/test/create-backup', backup)
}) 