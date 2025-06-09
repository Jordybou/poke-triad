// --- Émojis pour chaque type (fallback visuel)
const typeEmojis = {
  fire: '🔥', water: '💧', grass: '🌿', electric: '⚡',
  normal: '⭐', bug: '🐛', poison: '☠️', ground: '🌍',
  flying: '🕊️', psychic: '🔮', rock: '⛰️', ghost: '👻',
  ice: '❄️', dragon: '🐉', dark: '🌑', steel: '⚙️',
  fairy: '✨', fighting: '🥊',
};

// --- Cache des noms FR déjà traduits
const nameCache = {};

// --- Fonction asynchrone pour récupérer le nom FR d’un Pokémon
export async function fetchFrenchName(name) {
  const key = name.toLowerCase();
  if (nameCache[key]) return nameCache[key];

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${key}`);
    const data = await response.json();
    const frName = data.names.find(n => n.language.name === 'fr')?.name || name;
    nameCache[key] = frName;
    return frName;
  } catch (err) {
    console.error(`Erreur de traduction pour ${name}:`, err);
    return name;
  }
}

// --- Récupère un emoji pour un type (si SVG manquant)
export function getTypeEmoji(type) {
  return typeEmojis[type?.toLowerCase()] || '❓';
}

// --- Renvoie le chemin de l'icône SVG pour un type donné
export function getTypeIcon(type) {
  if (!type) return null;
  const filename = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `/icons/types/${filename}.svg`;
}