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

const FIXED_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151];
/*25, 4, 7, 1, 59*/
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
      emoji: getTypeEmoji[type] || '❓',
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

// 🔥 Nouvelle fonction : Génère entre 1 et 3 cases élémentaires aléatoires
export function generateRandomElementTiles(deck1, deck2) {
  const allTypes = [...new Set([...deck1, ...deck2].map(card => card.type))];
  const numberOfTiles = Math.floor(Math.random() * 3) + 1; // 1 à 3
  const usedPositions = new Set();
  const elementTiles = [];

  while (elementTiles.length < numberOfTiles) {
    const row = Math.floor(Math.random() * 3);
    const col = Math.floor(Math.random() * 3);
    const key = `${row}-${col}`;
    if (usedPositions.has(key)) continue;

    usedPositions.add(key);
    const type = allTypes[Math.floor(Math.random() * allTypes.length)];

    elementTiles.push({ row, col, type });
  }

  return elementTiles;
}