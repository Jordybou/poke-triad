import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Game from './components/Game';
import DeckBuilder from './components/DeckBuilder';
import Pokedex from './components/Pokedex';
import Rules from './components/Rules';
import Quit from './components/Quit';

export default function App() {
  return (
    <Router>
      <div className="menu">
        <Link to="/">JOUER</Link> |{' '}
        <Link to="/decks">DECKS</Link> |{' '}
        <Link to="/pokedex">POKEDEX</Link> |{' '}
        <Link to="/rules">REGLES</Link> |{' '}
        <Link to="/quit">QUITTER</Link>
      </div>

      <Routes>
        <Route path="/" element={<Game />} />
        <Route path="/decks" element={<DeckBuilder />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/quit" element={<Quit />} />
      </Routes>
    </Router>
  );
}