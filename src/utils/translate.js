// --- Émojis pour chaque type (plan de secours) ---
const typeEmojis = {
  fire: '🔥',
  water: '💧',
  grass: '🌿',
  electric: '⚡',
  normal: '⭐',
  bug: '🐛',
  poison: '☠️',
  ground: '🌍',
  flying: '🕊️',
  psychic: '🔮',
  rock: '⛰️',
  ghost: '👻',
  ice: '❄️',
  dragon: '🐉',
  dark: '🌑',
  steel: '⚙️',
  fairy: '✨',
  fighting: '🥊',
};

// --- Cache de traduction FR ---
const nameCache = {};

// --- Traduction du nom anglais → nom français (via PokéAPI) ---
export async function fetchFrenchName(name) {
  const lowerName = name.toLowerCase();
  if (nameCache[lowerName]) return nameCache[lowerName];

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${lowerName}`);
    const data = await response.json();
    const frenchEntry = data.names.find(n => n.language.name === 'fr');
    const frenchName = frenchEntry ? frenchEntry.name : name;
    nameCache[lowerName] = frenchName;
    return frenchName;
  } catch (error) {
    console.error(`Erreur de traduction pour ${name} :`, error);
    return name;
  }
}

// --- Récupère l’émoji d’un type (fallback si icône manquante) ---
export function getTypeEmoji(type) {
  return typeEmojis[type.toLowerCase()] || '❓';
}

// --- Renvoie le chemin de l'icône SVG pour un type (ex: 'feu' => '/icons/types/feu.svg') ---
export function getTypeIcon(type) {
  if (!type) return null;

  // Normalisation Unicode pour enlever les accents (é => e)
  const filename = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `/icons/types/${filename}.svg`;
}