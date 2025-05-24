import { useState, useEffect } from 'react';
import Game from './components/Game';
import Home from './components/Home';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import DeckBuilder from './components/DeckBuilder';
import Quit from './components/Quit';
import { useDispatch } from 'react-redux';
import { loadAllPokemon } from './utils/loadAllPokemon';
import { setAllPokemon, addToPokedex } from './redux/slices/pokedexSlice';
import { generateDefaultDeck } from './utils/generateDeck';
import { store } from './redux/store';

function App() {
  const [view, setView] = useState('home');
  const dispatch = useDispatch();

  useEffect(() => {
    loadAllPokemon().then(all => {
      dispatch(setAllPokemon(all));

      // On ajoute le deck de base au Pokédex s'il est vide
      generateDefaultDeck().then(defaultDeck => {
        const state = store.getState();
        if (state.pokedex.captured.length === 0) {
          defaultDeck.forEach(card => dispatch(addToPokedex(card)));
        }
      });
    });
  }, []);


  return (
    <>
      {view === 'home' && <Home setView={setView} />}
      {view === 'game' && <Game setView={setView} />}
      {view === 'decks' && <DeckBuilder setView={setView} />}
      {view === 'pokedex' && <Pokedex setView={setView} />}
      {view === 'rules' && <Rules setView={setView} />}
      {view === 'quit' && <Quit />}
    </>
  );
}

export default App;