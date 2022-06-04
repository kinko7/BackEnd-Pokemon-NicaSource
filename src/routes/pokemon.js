const { Router } = require('express');
const { createPoke, getPokeById, getByTypes,deletePoke, updatePoke} = require('../controllers/pokemon.js')


const router = Router();

router.get('/:id', getPokeById);
router.post('/', createPoke);
router.put('/:id', updatePoke);
router.delete('/:id', deletePoke)
 



module.exports = router;
