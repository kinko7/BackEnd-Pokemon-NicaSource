const { Router } = require('express');
const { getAllPokemons,getByTypes} = require('../controllers/pokemons.js')


const router = Router();
router.get('/sync', getAllPokemons);
router.get('/bytypes', getByTypes);






module.exports = router;
