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
        id, // 🆗 important pour les captures, tris, etc.
        name,
        image: res.data.sprites.other['official-artwork'].front_default || '/images/missing.png',
        type: res.data.types[0].type.name, // pour cohérence avec generate.js
        values: generateCardValuesFromStats(res.data.stats),
      });

    } catch (err) {
      console.error(`Erreur lors du chargement du Pokémon ${id}`, err);
    }
  }

  return allPokemon;
}