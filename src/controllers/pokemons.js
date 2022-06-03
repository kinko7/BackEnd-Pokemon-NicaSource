const {
   Router
} = require("express");
const {
   default: axios
} = require("axios");

const {
 Pokemons,
 Types
} = require("../db");
const {
   Op,
   where
} = require("sequelize");
const {
   v4: uuidv4
} = require("uuid");
const e = require("express");
require("dotenv").config();
 
 
const router = Router();
const cors =  require("cors");

// async function getApi() {
//    try {
//        const pokemonsList = await axios.get('https://pokeapi.co/api/v2/pokemon?offset=0&limit=40')
//        let pokemonsData = [];

//        for (obj of pokemonsList.data.results) {
//            let dataObj = await axios.get(`${obj.url}`);
//            pokemonsData.push({
//                id: dataObj.data.id,
//                name: dataObj.data.forms[0].name,
//                img: dataObj.data.sprites.other.dream_world.front_default,
//                height: dataObj.data.height,
//                weight: dataObj.data.weight,
//                attack: dataObj.data.stats[1].base_stat,
//                defense: dataObj.data.stats[2].base_stat,
//                speed: dataObj.data.stats[5].base_stat,
//                types: dataObj.data.types.map((t) =>{return {name:t.type.name}})
//            })
//        }
//        return pokemonsData;
//    } catch (err) {
//        console.log(err);
//    }

// };
async function getAllPokemons(req, res, next) {
   const { name } = req.query;
   const urlName= await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=0&limit=40`)

   console.log("AAAAAAAA", urlName)
     const pokeAPi= await urlName.data.results.map(e=>{
        return {
         id: e.id,
         name: e.name,
         url:e.url
      //   //  img: e.sprites.other.dream_world.front_default,
      //    attack: e.stats[1].base_stat,
      //    defense: e.stats[2].base_stat,
      //    speed: e.stats[5].base_stat,
      //    height: e.height,
      //    weight: e.weight,
      //    types : e.types.map(el => el.type.name)
     }
       
      
        })
     
            
         return res.json(pokeAPi);
      
      }




    

async function getPokeById(req, res, next) {
 
}

 


module.exports = {
   getAllPokemons,
   getPokeById

};
