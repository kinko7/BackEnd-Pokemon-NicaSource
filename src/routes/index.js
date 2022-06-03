const { Router } = require('express');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const pokemons = require('./pokemons.js');
const pokemon = require('./pokemon.js');
const types = require('./types');
 

const router = Router();
// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemons', pokemons );
router.use('/pokemon', pokemon);
router.use('/types', types);
 


module.exports = router;
