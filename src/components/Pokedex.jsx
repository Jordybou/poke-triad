import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchFrenchName } from '../utils/translate';
import '../styles/Pokedex.css';
import { useNavigate } from 'react-router-dom';

const Pokedex = () => {
  const navigate = useNavigate();
  const captured = useSelector((state) => state.pokedex.captured);
  const all = useSelector((state) => state.pokedex.all);
  const badgeCount = useSelector((state) => state.pokedex.badgeCount);

  const [translatedNames, setTranslatedNames] = useState({});

  useEffect(() => {
    const fetchNames = async () => {
      const results = await Promise.all(
        captured.map(pokemon =>
          fetchFrenchName(pokemon.name).then(name => ({ id: pokemon.id, name }))
        )
      );
      const resultMap = {};
      results.forEach(({ id, name }) => resultMap[id] = name);
      setTranslatedNames(resultMap);
    };
    fetchNames();
  }, [captured]);

  const isCaptured = (id) => captured.some((p) => p.id === id);

  const renderBadges = () => {
    const badges = 8;
    return [...Array(badges)].map((_, i) => {
      const unlocked = i < badgeCount;
      return (
        <img
          key={i}
          src={`/badges/badge-${i + 1}.png`}
          alt={`Badge ${i + 1}`}
          className={`badge ${unlocked ? 'unlocked' : 'locked'}`}
        />
      );
    });
  };

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
        {renderBadges()}
      </div>
    </div>
  );
};

export default Pokedex;