const peliculaService = require('../services/PeliculaService')

const obtenerPeliculas = async (req, res, next) => {
  try {
    const peliculas = await peliculaService.obtenerTodas(req.query)
    res.json(peliculas)
  } catch (err) {
    next(err)
  }
}

const obtenerPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.obtenerPorId(Number(req.params.id))
    res.json(pelicula)
  } catch (err) {
    next(err)
  }
}

const crearPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.crear(req.body)
    res.status(201).json(pelicula)
  } catch (err) {
    next(err)
  }
}

const actualizarPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.actualizar(Number(req.params.id), req.body)
    res.json(pelicula)
  } catch (err) {
    next(err)
  }
}

const eliminarPelicula = async (req, res, next) => {
  try {
    const pelicula = await peliculaService.eliminar(Number(req.params.id))
    res.json({ mensaje: 'Película eliminada', pelicula })
  } catch (err) {
    next(err)
  }
}

const obtenerResenas = async (req, res, next) => {
  try {
    const resenas = await peliculaService.obtenerResenas(Number(req.params.id))
    res.json(resenas)
  } catch (err) {
    next(err)
  }
}

const crearResena = async (req, res, next) => {
  try {
    const resena = await peliculaService.crearResena(Number(req.params.id), req.body)
    res.status(201).json(resena)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  obtenerPeliculas,
  obtenerPelicula,
  crearPelicula,
  actualizarPelicula,
  eliminarPelicula,
  obtenerResenas,
  crearResena
}