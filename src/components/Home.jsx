import React from 'react';

export default function Home({ setView }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: '80px' }}>
      <h1>🎴 Poké-Triad</h1>
      <div style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <button onClick={() => setView('game')}>▶️ JOUER</button>
        <button onClick={() => setView('decks')}>🧩 DECKS</button>
        <button onClick={() => setView('pokedex')}>📘 POKEDEX</button>
        <button onClick={() => setView('rules')}>📜 RÈGLES</button>
        <button onClick={() => setView('quit')}>❌ QUITTER</button>
      </div>
    </div>
  );
}