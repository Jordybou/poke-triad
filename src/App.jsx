import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import DeckBuilder from './components/DeckBuilder';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import Quit from './components/Quit';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllPokemon } from './utils/loadAllPokemon';
import { capturePokemon, setAllPokemon } from './redux/slices/pokedexSlice';
import { generateDefaultDeck } from './utils/generate';
import { useEffect } from 'react';

function App() {
  const dispatch = useDispatch();
  const captured = useSelector(state => state.pokedex.captured);

  useEffect(() => {
    const init = async () => {
      // Charger le Pokédex complet (sans tout capturer)
      const all = await loadAllPokemon();
      dispatch(setAllPokemon(all)); // ← pas de capture ici

      // Puis seulement capturer le deck de base
      if (captured.length === 0) {
        const base = await generateDefaultDeck();
        base.forEach(card => dispatch(capturePokemon(card)));
      }
    };

    init();
  }, []);

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