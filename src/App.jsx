import React, { useState } from 'react';
import Game from './components/Game';
import Home from './components/Home';
import Pokedex from './components/Pokedex'; // vide pour l'instant
import Rules from './components/Rules';     // vide pour l'instant
import DeckBuilder from './components/DeckBuilder'; // vide pour l'instant
import Quit from './components/Quit';       // vide pour l'instant

function App() {
  const [view, setView] = useState('home');

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