/*
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
*/

import { setPlayerDeck } from '../redux/slices/playerDeckSlice';

/*
 * Construit la payload de progression à partir du state Redux.
 * On inclut un "snapshot" complet du deck pour pouvoir le restaurer sans appel externe.
 */
export function buildProgress(state) {
  const captured = state.pokedex?.captured || [];            // ex: [{ idDex, ... }]
  const currentDeck = state.playerDeck?.deck || [];          // ex: [{ idDex, name, ... }]
  const badgeCount = state.pokedex?.badgeCount ?? 0;

  // ⚠️ Dans ton slice rules, les champs s'appellent bien unlockedRules / activeRules
  const unlockedRules = state.rules?.unlockedRules || [];
  const activeRules = state.rules?.activeRules || [];

  return {
    // On garde des IDs si tu veux exploiter ces infos plus tard côté serveur
    capturedIds: captured.map(c => c.idDex ?? c.id),
    badgeCount,
    unlockedRules,
    activeRules,

    // IDs du deck (informatif)
    currentDeckIds: currentDeck.map(c => c.idDex ?? c.id),

    // 👇 Snapshot complet du deck pour réhydratation immédiate
    currentDeckSnapshot: currentDeck,
  };
}

/* Réinjecte la progression côté frontend.
 * Pour l’instant, on hydrate le DECK (il existe un setter public : setPlayerDeck).
 * Si plus tard tu exposes des actions "setter" dans pokedex/rules, on les ajoutera ici.
 */
export function hydrateFromProgress(progress, dispatch) {
  if (!progress) return;

  const { currentDeckSnapshot } = progress;

  // Si on a le deck complet, on le réinjecte directement
  if (Array.isArray(currentDeckSnapshot) && currentDeckSnapshot.length) {
    dispatch(setPlayerDeck(currentDeckSnapshot));

    // Reste cohérent avec le flux existant (tu utilises localStorage pour le deck invité)
    try {
      localStorage.setItem('currentDeck', JSON.stringify(currentDeckSnapshot));
    } catch (_) {}
  }

  // NOTE (future évol) :
  // - pokedex: ajouter par ex. setCapturedIds(...) / setBadgeCount(...)
  // - rules:   ajouter par ex. setUnlockedRules(...) / setActiveRules(...)
  // quand tu exposeras ces actions dans leurs slices respectifs.
}