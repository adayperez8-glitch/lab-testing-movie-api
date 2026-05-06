const request = require('supertest')
const app = require('../../index')

describe('Bonus: Test de integración completo', () => {

  it('flujo completo: registro → login → añadir favoritos → listar → eliminar', async () => {
    const { crearPelicula } = require('./helpers')

    // 1. Registro
    const registroRes = await request(app)
      .post('/api/auth/registro')
      .send({ nombre: 'User Integration', email: 'integration@test.com', password: 'pass123' })

    expect(registroRes.status).toBe(201)
    const tokenRegistro = registroRes.body.token

    // 2. Login
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'integration@test.com', password: 'pass123' })

    expect(loginRes.status).toBe(200)
    const token = loginRes.body.token

    // 3. Crear películas para añadir a favoritos
    const pelicula1 = await crearPelicula({ titulo: 'Matrix', anio: 1999, nota: 8.7 })
    const pelicula2 = await crearPelicula({ titulo: 'Inception', anio: 2010, nota: 8.8 })

    // 4. Añadir a favoritos
    const add1 = await request(app)
      .post(`/api/favoritos/${pelicula1.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(add1.status).toBe(201)

    const add2 = await request(app)
      .post(`/api/favoritos/${pelicula2.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(add2.status).toBe(201)

    // 5. Listar favoritos
    const listRes = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes.status).toBe(200)
    expect(listRes.body).toHaveLength(2)
    expect(listRes.body.map(f => f.titulo)).toEqual(
      expect.arrayContaining(['Matrix', 'Inception'])
    )

    // 6. Eliminar un favorito
    const deleteRes = await request(app)
      .delete(`/api/favoritos/${pelicula1.id}`)
      .set('Authorization', `Bearer ${token}`)

    expect(deleteRes.status).toBe(200)

    // 7. Verificar que solo queda uno
    const listRes2 = await request(app)
      .get('/api/favoritos')
      .set('Authorization', `Bearer ${token}`)

    expect(listRes2.status).toBe(200)
    expect(listRes2.body).toHaveLength(1)
    expect(listRes2.body[0].titulo).toBe('Inception')
  })
})
