const { Pokemons, Types } = require('../db');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

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
       .then(r => {
           let pokemonSearched = {
               id: r.data.id,
               name: r.data.forms[0].name,
               img: r.data.sprites.other.dream_world.front_default,
               height: r.data.height,
               weight: r.data.weight,
               hp: r.data.stats[0].base_stat,
               attack: r.data.stats[1].base_stat,
               defense: r.data.stats[2].base_stat,
               speed: r.data.stats[5].base_stat,
               types: r.data.types.map((t) =>{return {name:t.type.name}})
           }
           res.json(pokemonSearched)
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
           .then((r) => {
           if (r) {
              return res.send(r);
           }
           return res.status(404).send({error: 'pokemon not found'});
        });    
       })
       .catch(()=>{
           next({ status: 404, message: 'Pokemon not found' })
       })
   };

   //Armo la lista de pokemons que voy a mostrar en home
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

module.exports = {
   getAllPokemons,
   

};
