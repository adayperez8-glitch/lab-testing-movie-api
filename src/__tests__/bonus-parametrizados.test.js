const request = require('supertest')
const app = require('../../index')

describe('Bonus: Tests parametrizados con test.each', () => {

  describe('POST /api/auth/registro - validaciones', () => {
    const casosInvalidos = [
      ['campos vacíos', {}, 400],
      ['solo nombre', { nombre: 'Test' }, 400],
      ['solo email', { email: 'test@test.com' }, 400],
      ['solo password', { password: 'pass123' }, 400],
      ['password muy corta (<6)', { nombre: 'Test', email: 'test@test.com', password: '123' }, 400],
    ]

    test.each(casosInvalidos)(
      'debe rechazar registro con %s → %d',
      async (_, body, expectedStatus) => {
        const res = await request(app)
          .post('/api/auth/registro')
          .send(body)

        expect(res.status).toBe(expectedStatus)
        expect(res.body).toHaveProperty('error')
      }
    )
  })

  describe('POST /api/auth/login - validaciones', () => {
    const casosLoginInvalido = [
      ['body vacío', {}, 400],
      ['solo email', { email: 'test@test.com' }, 400],
      ['solo password', { password: 'pass123' }, 400],
    ]

    test.each(casosLoginInvalido)(
      'debe rechazar login con %s → %d',
      async (_, body, expectedStatus) => {
        const res = await request(app)
          .post('/api/auth/login')
          .send(body)

        expect(res.status).toBe(expectedStatus)
      }
    )
  })
})
