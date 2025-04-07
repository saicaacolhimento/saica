// Importa os comandos personalizados
import './commands'

// Declara os tipos para os comandos personalizados
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
    }
  }
}

// Configura o Cypress para ignorar exceções não capturadas
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que o Cypress falhe no teste
  return false
}) 