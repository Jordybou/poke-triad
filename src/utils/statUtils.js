// --- Convertit les statistiques en valeurs directionnelles entre 1 et 10
export function generateCardValuesFromStats(stats) {
  return {
    top: convertStatToValue(getStat(stats, 'attack')),
    right: convertStatToValue(getStat(stats, 'defense')),
    bottom: convertStatToValue(getStat(stats, 'special-attack')),
    left: convertStatToValue(getStat(stats, 'speed')),
  };
}

function getStat(stats, statName) {
  return stats.find(s => s.stat.name === statName)?.base_stat || 0;
}

function convertStatToValue(stat) {
  // Valeur normalisée entre 1 et 10 sur base d’un max de 255
  const value = Math.round((stat / 255) * 10);
  return Math.min(Math.max(1, value), 10);
}