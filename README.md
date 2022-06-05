Assessment



You’ll develop a small back-end, and database layer. The goal is to show Pokemon’s list and detail it with new records.



Initially, you will be fetching data from a public API which you will be using to populate your own database. Please note that your own database will be the one used as the single source of truth for your application and not the external API.



You will be using this service https://pokeapi.co/. The POKEMON API is free, accessible, and it provides data about them. The API has many endpoints but we’re going to focus on this endpoint: https://pokeapi.co/api/v2/pokemon?offset=0&limit=1126 to get the complete list of pokemon and this one: https://pokeapi.co/api/v2/pokemon/1 to get more details information of the pokemon so you can populate your database. The idea is that you get to build your own API, so the usage of Pokémon API is to provide you with an initial data source.



You should provide an endpoint called /sync, this endpoint will perform the initial data fetching and will process the insertions in your database.( You will also enable an endpoint to update any Pokemon in your database, but every time you call the /sync endpoint, the data should be overwritten by the response provided by Pokémon API. Your API should expose endpoints to get the list of pokemon and allow searches by id/name and type.)



Required endpoints

/sync GET
/pokemon GET
/pokemon/{pokemon-id / pokemon-name} GET
/pokemon/type/{pokemon-type} GET