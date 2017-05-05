const express = require('express');
const Pokedex = require('pokedex-promise-v2');
const _ = require('lodash');

const router = express.Router();

/*
 * PokeAPI wrapper provides an 11-day caching policy
 * So we can simply get it manually everytime and be good with it
 */

const P = new Pokedex();

/**
 * @param {array} pokemon - list of all the pokemon to search through
 * @param {array} pokemonTypes - list of all the pokemon types to search through
 * @param {string} name - pokemon name to look for
 * @param {array} types - pokemon types to look for
 * @return {array} list of mathing pokemon
 */
const search = ({
  pokemon = [],
  pokemonTypes = [],
  name = '',
  types = [] } = {}) => {
    // check if we have data to perform any searching
  if (pokemon.length === 0 ||
      pokemonTypes.length === 0 ||
      (name.length === 0 && types.length === 0)) {
    return [];
  } else if (name.length !== 0 && types.length === 0) {
    // if searching purely by name - perform a simple filter
    return _.filter(pokemon, item => item.name.includes(_.lowerCase(name)));
  } else if (name.length !== 0 && types.length !== 0) {
    // if searching both by name and type (a bit fuzzier search)
    // TODO: implement
    return [];
  }
  // if searching by type
  // TODO: implement
  return [];
};

exports.search = search;

/**
 * @param {array} pokemon - collection of pokemon to get data for
 * @return {array} collection of pokemon with all their data
 */
const getPokemonData = async pokemon => (
  // get all the needed pokemon in parallel
  Promise.all(pokemon.map(item => (P.getPokemonByName(item.name))))
);

exports.getPokemonData = getPokemonData;


/**
 * @param {array} pokemon - collection of pokemon with all the data
 * @return {array} collection of pokemon with only the data we need
 */
const mapPokemonData = pokemon => (
  // leave only data we need
  _.map(pokemon, item => ({
    name: item.name,
    abilities: item.abilities,
    stats: item.stats,
    sprites: item.sprites,
    types: item.types,
  }))
);

exports.mapPokemonData = mapPokemonData;

router.get('/', async (req, res) => {
  // get all the pokemon
  let pokemon = [];
  try {
    pokemon = await P.getPokemonsList();
    pokemon = pokemon.results;
  } catch (e) {
    throw e;
  }

  // get all the types
  let pokemonTypes = [];
  try {
    pokemonTypes = await P.getTypesList();
    pokemonTypes = pokemonTypes.results;
  } catch (e) {
    throw e;
  }

  // parse query
  const name = (req.query.name && decodeURIComponent(req.query.name)) || '';
  const types = (req.query.types && decodeURIComponent(req.query.types)) || '';

  // filter needed pokemon
  const searchResults = search({ pokemon, pokemonTypes, name, types });
  // get data for filtered pokemon
  const pokemonData = await getPokemonData(searchResults);
  // remove unnecessary data
  const found = mapPokemonData(pokemonData);

  // return results
  res.status(200).send({
    status: 'OK',
    count: found.length,
    results: found,
  });
});

exports.router = router;
