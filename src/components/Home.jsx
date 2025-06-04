import { useNavigate } from 'react-router-dom';
import '../styles/Home.css';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="home-title">🎮 Poké-Triad</h1>
      <div className="home-menu">
        <button onClick={() => navigate('/game')}>▶️ Jouer</button>
        <button onClick={() => navigate('/decks')}>🃏 Decks</button>
        <button onClick={() => navigate('/pokedex')}>📘 Pokédex</button>
        <button onClick={() => navigate('/rules')}>📜 Règles</button>
        <button onClick={() => navigate('/quit')}>❌ Quitter</button>
      </div>
    </div>
  );
}