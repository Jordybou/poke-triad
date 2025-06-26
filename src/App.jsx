import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import DeckBuilder from './components/DeckBuilder';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import Quit from './components/Quit';

import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';

import { loadAllPokemon } from './utils/loadAllPokemon';
import { capturePokemon, setAllPokemon } from './redux/slices/pokedexSlice';
import { generateDefaultDeck } from './utils/generate';
import { setPlayerDeck, selectPlayerDeck } from './redux/slices/playerDeckSlice';

function App() {
  const dispatch = useDispatch();
  const captured = useSelector(state => state.pokedex.captured);
  const playerDeck = useSelector(selectPlayerDeck);

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
  );
}

export default App;