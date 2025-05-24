import axios from 'axios';
import { generateCardValuesFromStats } from statUtils.js;

const FIXED_IDS = [25, 4, 7, 1, 59]; // Pikachu, Salamèche, Carapuce, Bulbizarre, Arcanin

export async function generateDefaultDeck() {
  const cards = [];

  for (let id of FIXED_IDS) {
    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = res.data;

      cards.push({
        name: data.name,
        image: data.sprites.front_default,
        element: data.types[0].type.name,
        values: generateCardValuesFromStats(data.stats)
      });
    } catch (e) {
      console.error(`Erreur récupération Pokémon ${id}`, e);
    }
  }

  return cards;
}