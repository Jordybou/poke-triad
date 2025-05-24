import axios from 'axios';
import { generateCardValuesFromStats } from './statUtils';

export async function loadAllPokemon() {
  const allPokemon = [];

  for (let id = 1; id <= 151; id++) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const frRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

      const nameEntry = frRes.data.names.find(n => n.language.name === 'fr');
      const name = nameEntry ? nameEntry.name : res.data.name;

      allPokemon.push({
        name,
        image: res.data.sprites.front_default,
        element: res.data.types[0].type.name,
        values: generateCardValuesFromStats(res.data.stats),
      });

    } catch (err) {
      console.error(`Erreur lors du chargement du Pokémon ${id}`, err);
    }
  }

  return allPokemon;
}