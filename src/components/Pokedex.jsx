import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchFrenchName } from '../utils/translate';
import { useNavigate } from 'react-router-dom';
import '../styles/Pokedex.css';
import { BADGES } from '../utils/badges';

const Pokedex = () => {
  const navigate = useNavigate();
  const captured = useSelector((state) => state.pokedex.captured);
  const all = useSelector((state) => state.pokedex.all);
  const badgeCount = useSelector((state) => state.pokedex.badgeCount);

  const [translatedNames, setTranslatedNames] = useState({});

  useEffect(() => {
    const fetchNames = async () => {
      const newTranslations = {};
      for (const pokemon of captured) {
        if (!translatedNames[pokemon.id]) {
          const frName = await fetchFrenchName(pokemon.name);
          newTranslations[pokemon.id] = frName;
        }
      }
      setTranslatedNames((prev) => ({ ...prev, ...newTranslations }));
    };
    fetchNames();
  }, [captured]);

  const isCaptured = (id) => captured.some((p) => p.id === id);

  return (
    <div className="pokedex">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>Pokédex</h1>
      <p>Progression : {captured.length}/151</p>

      <div className="card-grid">
        {all.map((pokemon) => {
          const owned = isCaptured(pokemon.id);
          const translatedName = owned ? (translatedNames[pokemon.id] || '...') : '???';

          return (
            <div
              key={pokemon.id}
              className={`card ${owned ? 'captured' : 'locked'}`}
              title={owned ? translatedName : 'Non capturé'}
            >
              {owned ? (
                <>
                  <p className="poke-id">#{String(pokemon.id).padStart(3, '0')}</p>
                  <img
                    src={pokemon.image || '/images/missing.png'}
                    alt={translatedName}
                    onError={(e) => { e.target.src = '/images/missing.png'; }}
                  />
                  <p className="poke-name">{translatedName}</p>
                </>
              ) : (
                <div className="lock" />
              )}
            </div>
          );
        })}
      </div>

      <div className="badge-container">
        {BADGES.map((badge, i) => (
          <img
            key={i}
            src={badge.image}
            alt={badge.name}
            className={`badge-item ${i < badgeCount ? 'badge-unlocked' : 'badge-locked'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Pokedex;