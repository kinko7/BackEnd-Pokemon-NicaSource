const { Router } = require('express');
const { getAllPokemons,getByTypes} = require('../controllers/pokemons.js')
const { getPokeById,createPoke,deletePoke,updatePoke } = require('../controllers/pokemon.js')


const router = Router();

router.get('/sync', getAllPokemons);
router.get('/pokemons/bytypes', getByTypes);
router.get('/pokemon/:id', getPokeById)
router.post('/pokemon', createPoke);
router.patch('/pokemon/:id', updatePoke);
router.delete('/pokemon/:id', deletePoke)






module.exports = router;
