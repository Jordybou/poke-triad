import axios from 'axios';
import { generateCardValuesFromStats } from './statUtils';

export async function loadAllPokemon() {
  const requests = [...Array(151)].map((_, index) => fetchPokemonData(index + 1));
  const allResults = await Promise.all(requests);
  return allResults.filter(Boolean); // enlève les éventuels nulls
}

async function fetchPokemonData(id) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const frRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    const nameEntry = frRes.data.names.find(n => n.language.name === 'fr');
    const name = nameEntry ? nameEntry.name : res.data.name;

    return {
      id,
      name,
      image: res.data.sprites.other['official-artwork'].front_default || '/images/missing.png',
      type: res.data.types[0].type.name,
      values: generateCardValuesFromStats(res.data.stats),
    };
  } catch (err) {
    console.error(`Erreur lors du chargement du Pokémon ${id}`, err);
    return null;
  }
}