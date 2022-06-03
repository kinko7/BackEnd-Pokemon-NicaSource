const { Router } = require('express');
const { createPoke, updatePoke } = require('../controllers/pokemon.js')


const router = Router();

router.post('/', createPoke);
router.put('/:id', updatePoke);
// router.delete('/:id', deleteBook)
 



module.exports = router;
