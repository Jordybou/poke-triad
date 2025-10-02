import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import DeckBuilder from './components/DeckBuilder';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import Quit from './components/Quit';
import './styles/variables.css';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { loadAllPokemon } from './utils/loadAllPokemon';
import { capturePokemon, setAllPokemon } from './redux/slices/pokedexSlice';
import { generateDefaultDeck } from './utils/generate';
import { setPlayerDeck, selectPlayerDeck } from './redux/slices/playerDeckSlice';

import { fetchMe } from './redux/slices/authSlice';
import AuthWidget from './components/AuthWidget';

function App() {
  const dispatch = useDispatch();
  const captured = useSelector(state => state.pokedex.captured);
  const playerDeck = useSelector(selectPlayerDeck);

  // 1) Tente de récupérer l'utilisateur courant dès le démarrage
  useEffect(() => { dispatch(fetchMe()); }, [dispatch]);

  //sauvegarde localement à la fermeture de l'onglet
  useEffect(() => {
  const handler = () => {
    try { localStorage.setItem('triad_progress_backup_at_unload', new Date().toISOString()); } catch {}
  };
  window.addEventListener('beforeunload', handler);
  return () => window.removeEventListener('beforeunload', handler);
}, []);

  //Initialisation du Pokédex et du deck joueur au premier chargement de l’app
  useEffect(() => {
    const init = async () => {
      // Charger tous les Pokémon
      const all = await loadAllPokemon();
      dispatch(setAllPokemon(all));

      // Si aucun Pokémon n’a encore été capturé
      if (captured.length === 0) {
        const base = await generateDefaultDeck();

        // Capture des 5 Pokémon de base
        base.forEach(card => dispatch(capturePokemon(card)));

        // Définir ce deck comme deck du joueur
        dispatch(setPlayerDeck(base));
      } else if (playerDeck.length === 0) {
        // Si le joueur a déjà des cartes mais pas de deck
        const base = captured.slice(0, 5);
        dispatch(setPlayerDeck(base));
      }
    };

    init();
  }, []); // ← une seule fois au lancement

  return (
    <div className='appHeader'>
      <header>
        <AuthWidget />
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/decks" element={<DeckBuilder />} />
          <Route path="/pokedex" element={<Pokedex />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/quit" element={<Quit />} />
        </Routes>
      </Router>
      <footer style={{ position: "fixed", bottom: 10, right: 10, fontSize: "12px", color: "#666" }}>
        Version {__APP_VERSION__}
      </footer>
    </div>
  );
}

export default App;