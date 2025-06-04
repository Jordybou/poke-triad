import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Game from './components/Game';
import DeckBuilder from './components/DeckBuilder';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import Quit from './components/Quit';
import { useDispatch, useSelector } from 'react-redux';
import { loadAllPokemon } from './utils/loadAllPokemon';
import { capturePokemon } from './redux/slices/pokedexSlice';
import { generateDeck } from './utils/generate';

function App() {
  const dispatch = useDispatch();
  const captured = useSelector(state => state.pokedex.captured);

  useEffect(() => {
    loadAllPokemon().then(all => {
      dispatch(capturePokemon(all));

      // Ajout du deck de base si le pokedex est vide
      generateDeck().then(defaultDeck => {
        if (captured.length === 0) {
          defaultDeck.forEach(card => dispatch(capturePokemon(card)));
        }
      });
    });
  }, [dispatch, captured.length]);

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