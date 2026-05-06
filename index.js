require('dotenv').config()
require('./src/config/db')

const express = require('express')
const app = express()

app.use(express.json())

const peliculaRoutes = require('./src/routes/peliculaRoutes')
const authRouter = require('./src/routes/auth')
const favoritosRouter = require('./src/routes/favoritos')

app.use('/api/auth', authRouter)
app.use('/api/peliculas', peliculaRoutes)
app.use('/api/favoritos', favoritosRouter)

app.get('/api/estadisticas', async (req, res, next) => {
  try {
    const peliculaService = require('./src/services/PeliculaService')
    const stats = await peliculaService.obtenerEstadisticas()
    res.json(stats)
  } catch (err) {
    next(err)
  }
})

app.use((err, req, res, next) => {
  const status = err.statusCode || 500
  res.status(status).json({ error: err.message })
})

const PORT = process.env.PORT || 3000

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`)
  })
}

module.exports = app