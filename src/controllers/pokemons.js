const { Pokemons, Types, poke_type } = require('../db');
const axios = require('axios');
const { uuid:v4 } = require('uuidv4');

async function getApi() {
   try {
       const pokemonsList = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=40`)
       let pokemonsData = [];

       for (obj of pokemonsList.data.results) {
           let dataObj = await axios.get(`${obj.url}`);
           pokemonsData.push({
               id: dataObj.data.id,
               name: dataObj.data.forms[0].name,
               img: dataObj.data.sprites.other.dream_world.front_default,
               height: dataObj.data.height,
               weight: dataObj.data.weight,
               hp: dataObj.data.stats[0].base_stat,
               attack: dataObj.data.stats[1].base_stat,
               defense: dataObj.data.stats[2].base_stat,
               speed: dataObj.data.stats[5].base_stat,
               types: dataObj.data.types.map((t) =>{return {name:t.type.name}})
           })
       }
       return pokemonsData;
   } catch (err) {
       console.log(err);
   }

};

//traigo todos y y si hay name, busco por name
async function getAllPokemons(req, res, next) {
   const { name } = req.query;

   if(name) {
       //busco api
       return axios.get('https://pokeapi.co/api/v2/pokemon/' + name)
       .then(response => {
           let pokemonSearched = {
               id: response.data.id,
               name: response.data.forms[0].name,
               img: response.data.sprites.other.dream_world.front_default,
               height: response.data.height,
               weight: response.data.weight,
               attack: response.data.stats[1].base_stat,
               defense: response.data.stats[2].base_stat,
               speed: response.data.stats[5].base_stat,
               types: response.data.types.map((t) =>{return {name:t.type.name}})
           }
           response.json(pokemonSearched)
       }) 
       .catch(() => {
           //busco db
           Pokemons.findOne({
               where: {
                   name: name
               },
               include: [
                   { model: Types, attributes: ["name"], through: { attributes: [] } }
               ]
           })
           .then((response) => {
           if (response) {
              return res.send(response);
           }
           return res.status(404).send({error: 'pokemon not found'});
        });    
       })
       .catch(()=>{
           next({ status: 404, message: 'Pokemon not found' })
       })
   };

   //Armo la lista de pokemons con la data
   const pokeApi = await getApi();
   let pokeMine = await Pokemons.findAll({ include: [
       { model: Types, attributes: ["name"], through: { attributes: [] } }
       ]
   });

   Promise.all([pokeApi, pokeMine])
   .then(response => {
       let [pokeMineRes, pokeApiRes] = response;
       return pokeApiRes.concat(pokeMineRes);
   })
   .then(pokeList => { //-> lista completa de 40 pokemons
       return res.json(pokeList);
   })
   .catch(() => {
       next({ status: 404, message: 'Pokemon not found' })
   })  
};

const getByTypes = async (req, res) => {
const {type} = req.query
     try{ 
         
   
    if (type) {
    types = await Types.findAll({
        where: {
           types:type
        },
        include: [
            { model: Pokemons, attributes: ["name"], through: { attributes: [] } }
        ]
    })
    }
    console.log("AAAAAAAAAAAAAAAAA",types)
    return res.json(types)
} catch (error) {
    console.log(error)
}
}
      
    

    
 
    
module.exports = {
   getAllPokemons,
   getByTypes
   

};
