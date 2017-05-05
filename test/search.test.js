const expect = require('chai').expect;
const search = require('../backend/api/v1/search');
const Pokedex = require('pokedex-promise-v2');

const P = new Pokedex();
let pokemon = [];
let pokemonTypes = [];

describe('Search', () => {
  before(async () => {
    // heat up our cache
    pokemon = await P.getPokemonsList();
    pokemon = pokemon.results;
    pokemonTypes = await P.getTypesList();
    pokemonTypes = pokemonTypes.results;
    await search.getPokemonData([
      { name: 'bulbasaur' },
      { name: 'ivysaur' },
      { name: 'venusaur' },
      { name: 'venusaur-mega' },
    ]);
  });

  describe('Find pokemon', () => {
    it('Should get pokemon matching request', () => {
      const searchResults = search.search({ pokemon, pokemonTypes, name: 'saur' });
      expect(searchResults).to.have.lengthOf(4);
    });

    it('Should get pokemon data', async () => {
      const searchResults = search.search({ pokemon, pokemonTypes, name: 'saur' });
      const data = await search.getPokemonData(searchResults);
      expect(data).to.have.lengthOf(4);
    });

    it('Should map pokemon data', async () => {
      const searchResults = search.search({ pokemon, pokemonTypes, name: 'saur' });
      const data = await search.getPokemonData(searchResults);
      const results = search.mapPokemonData(data);
      expect(results).to.have.lengthOf(4);
    });
  });
});
