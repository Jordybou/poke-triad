export function generateCardValuesFromStats(stats) {
  return {
    top: convertStatToValue(getStat(stats, 'attack')),
    right: convertStatToValue(getStat(stats, 'defense')),
    bottom: convertStatToValue(getStat(stats, 'special-attack')),
    left: convertStatToValue(getStat(stats, 'speed')),
  };
}

function getStat(stats, statName) {
  const found = stats.find(s => s.stat.name === statName);
  return found ? found.base_stat : 0;
}

function convertStatToValue(stat) {
  // Échelle basée sur un maximum de 255 (stats max sur PokéAPI)
  const value = Math.round((stat / 255) * 10);
  return Math.max(1, Math.min(value, 10));
}