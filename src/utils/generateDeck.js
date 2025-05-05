import axios from 'axios';

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function convertStatToValue(stat) {
    const value = Math.round((stat / 150) * 10);
    return Math.max(1, Math.min(value, 10));
  }
  
  function generateCardValuesFromStats(stats) {
    return {
      top: convertStatToValue(stats[0].base_stat),     // HP
      right: convertStatToValue(stats[1].base_stat),   // Attack
      bottom: convertStatToValue(stats[2].base_stat),  // Defense
      left: convertStatToValue(stats[5].base_stat),    // Speed
    };
  }

export async function generateDeck(count = 5) {
  const deck = [];
  const usedIds = new Set();

  while (deck.length < count) {
    const id = getRandomInt(1, 151); // 1ère génération

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