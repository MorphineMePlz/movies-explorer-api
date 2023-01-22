const routerMovies = require('express').Router();

const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

const { validateMovieCreation, validateMovieId } = require('../middlewares/validator');

routerMovies.get('/', getMovies);
routerMovies.post('/', validateMovieCreation, createMovie);
routerMovies.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = routerMovies;
