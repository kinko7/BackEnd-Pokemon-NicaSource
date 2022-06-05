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
           return pokemonsData;
       }
      const bulkData= await Pokemons.bulkCreate(pokemonsData);
       return res.json(bulkData);

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

// const searchdata = async (req,res) => {
//     const dataBase = await Pokemons.findAll({
//       include: [
//         {
//           model: Types,
//           through: {
//             attributes: [],
//           },
//         },
//       ],
//     });
//     console.log("AAAAAAAAAAAAAAAAAAA",dataBase)
//     if (dataBase.length > 0) {
//         const pokeDb = await dataBase.map((data) => {
//             return {
//                 id:data.id,
//                 name:data.name,
//                 height:data.height,
//                 weight:data.weight,
//                 // types:data.types.map((t) =>{return {name:t.type.name}})
//                     };          
//           });
//           return pokeDb
//         }
//       }
    

//   const  getByTypes = async  (req, res, next) =>{
//     let { id } = req.query;
  
//     try {
//       const pokeDB = await searchdata();
  
//       const filters = [];
  
//       pokeDB.map((e) => (e.types.id=== id ? filters.push(e) : null));
  
//       filters.length > 0
//         ? res.send(filters)
//         : res.send("No poke exists");
//     } catch (error) {
//       next(error);
//     }
//   }
  

const getByTypes = async (req, res) => {
    const {id} = req.params
const {name} = req.query
     try{ 
         
    if (name) {
  let typ= await Pokemons.findAll({
        where: {
            name:"name"
        },
        include: [
            { model: Types, attributes: ["name"], through: { attributes: [] } }
        ]
    })
    return res.send(typ)
    }
 
} catch (error) {
    console.log(error)
   }
}
      
       
 
    
module.exports = {
   getAllPokemons,
   getByTypes
};
