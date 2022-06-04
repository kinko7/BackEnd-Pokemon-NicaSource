const { Pokemons, Types } = require("../db");
const axios = require('axios');
const { v4: uuidv4 } = require("uuid");
 

const getPokeById = async (req, res) => {
  const id = req.params.id;
  if (!id || parseInt(id) < 0) res.status(404).json('Invalid Id');
  try {
      if (!id.includes('-')) {
          const urlId = await axios.get('https://pokeapi.co/api/v2/pokemon/' + id);
          
          let pokemon = {
              id: urlId.data.id,
              name: urlId.data.name,
              img: urlId.data.sprites.other.dream_world.front_default,
              attack: urlId.data.stats[1].base_stat,
              defense: urlId.data.stats[2].base_stat,
              speed: urlId.data.stats[5].base_stat,
              height: urlId.data.height,
              weight: urlId.data.weight,
          }
         
          let types = urlId.data.types.map(el => {
              let temp = {}
              return temp = {name: el.type.name}
          });

          pokemon = {...pokemon, types: types};
          return res.json(pokemon);

      } else {
          // console.log(await 'im in')
          const pokemon = await Pokemons.findByPk(String(id), {
              include: {
                  model: Types,
                  attributes: ['name']
              }
          });
          if (pokemon)return res.json(pokemon);
          else {
              res.status(400).json('Invalid ID')
          }
      }
  } catch (error) {
      console.log(error)
  }
}
 const createPoke = async (req,res) => {
        let {name,img,attack,defense,speed,height,weight,types} = req.body;
        if(!name) return res.status(404).json('Invalid Name');
    
        name = name.toLowerCase();
        let newPokemon = await Pokemons.create({
            id:uuidv4(),
            name,
            img,
            attack,
            defense,
            speed,
            height,
            weight
        });
        newPokemon.setTypes(types)
        res.json(newPokemon)
    }


const updatePoke = async (req,res) => {
    try { 
        let id = req.params.id;
        let data = {...req.body}; 
        // let {name,attack,defense,speed,height, weight,img} = req.body;
            await Pokemons.update({data},
                    {
                where: {
                    id,
                },
                    }
            );
            return res.send("No Updated")
        } catch (error) {
         res.send("No Update")
         }
     }


const deletePoke = async (req, res, next) => {
    let id = req.params.id
   
    try {
      await Pokemons.destroy({
        where: {
          id: id
        }
      })
      return res.send('Pokemon deleted')
    } catch (error) {
      next(error)
    }
  
  }

module.exports = {
  createPoke,
  updatePoke,
  getPokeById,
  deletePoke
};
