import '../styles/Home.css';

export default function Home({ setView }) {
  return (
    <div className="home-container">
      <h1 className="home-title">🎮 Poké-Triad</h1>
      <div className="home-menu">
        <button onClick={() => setView('game')}>▶️ Jouer</button>
        <button onClick={() => setView('decks')}>🃏 Decks</button>
        <button onClick={() => setView('pokedex')}>📘 Pokédex</button>
        <button onClick={() => setView('rules')}>📜 Règles</button>
        <button onClick={() => setView('quit')}>❌ Quitter</button>
      </div>
    </div>
  );
}