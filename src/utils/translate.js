
const translations = {
  pikachu: "Pikachu",
  charmander: "Salamèche",
  squirtle: "Carapuce",
  bulbasaur: "Bulbizarre",
  arcanine: "Arcanin"
  // Ajouter ici d'autres traductions si nécessaire
};

export function translateName(name) {
  return translations[name.toLowerCase()] || name;
}
