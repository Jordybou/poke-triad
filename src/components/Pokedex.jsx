import { useSelector } from 'react-redux';
import Card from './Card';
import '../styles/Pokedex.css';
import { ALL_RULES } from '../utils/rulesList';

export default function Pokedex({ setView }) {
  const pokedex = useSelector(state => state.pokedex.captured);
  const allPokemon = useSelector(state => state.pokedex.all || []);
  const unlockedRules = useSelector(state => state.rules.unlockedRules);

  return (
    <div className="pokedex-container">
      <div className="pokedex-header">
        <button className="pokedex-return" onClick={() => setView('home')}>⬅️</button>
        <h1>📘 Pokédex</h1>
      </div>

      <p className="capture-progress">
        Cartes capturées : {pokedex.length} / {allPokemon.length}
      </p>

      <div className="badges-section">
        <h3>Badges débloqués :</h3>
        <div className="badges-grid">
          {ALL_RULES.map((rule, index) => {
            const unlocked = unlockedRules.includes(rule);
            return (
              <img
                key={index}
                src={`/badges/badge-${index + 1}.png`}
                alt={`Badge ${rule}`}
                className={`badge-icon ${!unlocked ? 'locked' : ''}`}
              />
            );
          })}
        </div>
      </div>

      <div className="pokedex-grid">
        {allPokemon.map((pokemon, index) => {
          const captured = pokedex.find(p => p.name === pokemon.name);
          return (
            <div key={index} className="pokedex-card">
              {captured ? (
                <Card
                  name={captured.name}
                  image={captured.image}
                  values={captured.values}
                  element={captured.element}
                  owner="player"
                />
              ) : (
                <div className="card-locked">
                  <div className="card-locked-img">🔒</div>
                  <div className="card-locked-name">???</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {ALL_RULES.map((rule, idx) => {
        const unlocked = unlockedRules.includes(rule);
        return (
          <img
            key={idx}
            src={`/badges/badge-${idx + 1}.png`}
            alt={`Badge ${rule}`}
            className={`badge-icon ${!unlocked ? 'locked' : ''}`}
          />
        );
      })}
    </div>
  );
}
