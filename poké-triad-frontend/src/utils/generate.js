import axios from 'axios';
import { generateCardValuesFromStats } from './statUtils';
import { fetchFrenchName } from './translate';
import { getTypeEmoji } from './translate';

export async function generateDeck(count = 5) {
  const deck = [];
  const usedIds = new Set();

  while (deck.length < count) {
    const id = Math.floor(Math.random() * 151) + 1;
    if (usedIds.has(id)) continue;
    usedIds.add(id);

    const card = await fetchCardData(id);
    if (card) deck.push(card);
  }

  return deck;
}

const FIXED_IDS = [25, 4, 7, 1, 59];
export async function generateDefaultDeck() {
  const cards = await Promise.all(FIXED_IDS.map(id => fetchCardData(id)));
  return cards.filter(Boolean);
}

async function fetchCardData(id) {
  try {
    const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = res.data;

    const values = generateCardValuesFromStats(data.stats);
    const type = data.types[0].type.name || 'normal';

    return {
      id: String(data.id),
      idDex: data.id,
      name: data.name,
      frenchName: await fetchFrenchName(data.name),
      image: data.sprites.other['official-artwork'].front_default || '/images/missing.png',
      type: type,
      emoji: getTypeEmoji(type) || '❓',
      top: values.top,
      right: values.right,
      bottom: values.bottom,
      left: values.left,
      values: values,
    };
  } catch (error) {
    console.error(`Erreur récupération Pokémon ${id}`, error);
    return null;
  }
}

// Génère entre min et max cases du plateau avec un type élémentaire aléatoire
export function generateElementTiles(min = 1, max = 4, typeList = []) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const positions = [];

  while (positions.length < count) {
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);
    const key = `${row}-${col}`;
    if (!positions.includes(key)) {
      const type = typeList[Math.floor(Math.random() * typeList.length)];
      positions.push({ position: key, type });
    }
  }

  return positions;
}