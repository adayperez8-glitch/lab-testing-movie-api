describe('Bonus: Mock de bcrypt - medición de rendimiento', () => {

  it('debe crear usuario y hacer request con bcrypt mockeado', async () => {
    const bcrypt = require('bcrypt')
    const originalHash = bcrypt.hash
    bcrypt.hash = jest.fn().mockResolvedValue('$2b$10$fixedHashForTesting1234567890abcdefghijklmno')

    const { crearUsuario, crearPelicula } = require('./helpers')
    const request = require('supertest')
    const app = require('../../index')

    const start = Date.now()

    const { token } = await crearUsuario({ email: 'mock-bcrypt@test.com' })
    const pelicula = await crearPelicula({ titulo: 'Peli Mock' })

    const res = await request(app)
      .post(`/api/favoritos/${pelicula.id}`)
      .set('Authorization', `Bearer ${token}`)

    const elapsed = Date.now() - start

    expect(res.status).toBe(201)

    bcrypt.hash = originalHash
  })
})
