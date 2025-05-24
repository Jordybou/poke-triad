export function generateCardValuesFromStats(stats) {
  return {
    top: convertStatToValue(stats[0].base_stat),
    right: convertStatToValue(stats[1].base_stat),
    bottom: convertStatToValue(stats[2].base_stat),
    left: convertStatToValue(stats[5].base_stat),
  };
}

function convertStatToValue(stat) {
  const value = Math.round((stat / 150) * 10);
  return Math.max(1, Math.min(value, 10));
}