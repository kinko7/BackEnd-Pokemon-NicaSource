const { Types, Pokemons } = require("../db.js");
const axios = require('axios')
const { uuid:v4} = require('uuidv4');

const getTypes = async (req,res) => {
    try{
        const dbTypes = await Types.findAll({attributes: ['name', 'id']})
        if(dbTypes.length > 0) return res.json(dbTypes)
            else{
                 try{

                    let res = await axios.get('https://pokeapi.co/api/v2/type');
                    var types = res.data.results.map(el => {return {name: el.name}})
                    console.log(types)
                    Types.bulkCreate(types);
                    return res.json(types);
                } catch {
                    (err) => next(err);
                  }
              
            }
        
    } catch (error){
        console.log(error)
    }
}


module.exports = {
    getTypes,
   
};
