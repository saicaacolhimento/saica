import '@testing-library/jest-dom'
import { server } from './mocks/server'

// Estende o expect com os matchers do jest-dom
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null
    if (pass) {
      return {
        message: () =>
          `expected ${received} not to be in the document`,
        pass: true,
      }
    } else {
      return {
        message: () =>
          `expected ${received} to be in the document`,
        pass: false,
      }
    }
  },
})

// Inicia o servidor MSW antes de todos os testes
beforeAll(() => server.listen())

// Reseta os handlers após cada teste
afterEach(() => server.resetHandlers())

// Fecha o servidor MSW após todos os testes
afterAll(() => server.close()) 