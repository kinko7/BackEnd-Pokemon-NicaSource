const { Router } = require('express');
const { getAllPokemons } = require('../controllers/pokemons.js')


const router = Router();

router.get('/', getAllPokemons);

// router.get('/:id', getBookById);


module.exports = router;
