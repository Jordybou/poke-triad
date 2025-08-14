// --- Convertit les statistiques en valeurs directionnelles entre 1 et 10
export function generateCardValuesFromStats(stats) {
  const hp = getStat(stats, 'hp');
  const atk = getStat(stats, 'attack');
  const def = getStat(stats, 'defense');
  const spd = getStat(stats, 'speed');

  // Répartition logique :
  // haut = défense, bas = attaque, gauche = vitesse, droite = hp
  return {
    top: normalizeStat(def),
    right: normalizeStat(hp),
    bottom: normalizeStat(atk),
    left: normalizeStat(spd),
  };
}

function getStat(stats, statName) {
  return stats.find(s => s.stat.name === statName)?.base_stat || 50;
}

function normalizeStat(stat) {
  // Normalisation douce avec max ~150 (la plupart des Pokémon 1G sont entre 20–130)
  const value = Math.round((stat / 150) * 10);
  return Math.min(Math.max(1, value), 10);
}