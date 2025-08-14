// Fonctions utilitaires pour convertir l'état Redux ↔ payload serveur
// NOTE: Adapte les selecteurs à tes slices exacts si les noms diffèrent

export function buildProgress(state) {
  // Exemples : adapte selon ce que stockent tes slices
  const captured = state.pokedex?.captured || [];          // [{ idDex }, ...]
  const currentDeck = state.playerDeck?.deck || [];         // [{ idDex }, ...]
  const badgeCount = state.pokedex?.badgeCount || 0;
  const unlockedRules = state.rules?.unlocked || [];
  const activeRules = state.rules?.active || [];

  return {
    capturedIds: captured.map((c) => c.idDex ?? c.id),
    badgeCount,
    unlockedRules,
    activeRules,
    currentDeckIds: currentDeck.map((c) => c.idDex ?? c.id),
  };
}

export function hydrateFromProgress(progress, dispatch) {
  // TODO: écris/importe ici des actions qui remettent l'état Redux
  // Exemple (à adapter à tes actions/slices):
  // dispatch(pokedexActions.setCapturedIds(progress.capturedIds));
  // dispatch(pokedexActions.setBadgeCount(progress.badgeCount));
  // dispatch(rulesActions.setUnlocked(progress.unlockedRules));
  // dispatch(rulesActions.setActive(progress.activeRules));
  // dispatch(playerDeckActions.setDeckFromIds(progress.currentDeckIds));
}