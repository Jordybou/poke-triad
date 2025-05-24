import axios from 'axios';
import { generateCardValuesFromStats } from './statUtils';

export async function generateDeck(count = 5) {
  const deck = [];
  const usedIds = new Set();

  while (deck.length < count) {
    const id = Math.floor(Math.random() * 151) + 1;

    if (usedIds.has(id)) continue;
    usedIds.add(id);

    try {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = res.data;

      deck.push({
        name: data.name,
        image: data.sprites.front_default,
        element: data.types[0].type.name,
        values: generateCardValuesFromStats(data.stats),
      });
    } catch (error) {
      console.error(`Erreur lors de la récupération du Pokémon ${id}`, error);
    }
  }

  return deck;
}

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