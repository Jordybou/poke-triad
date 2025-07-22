import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchFrenchName, getTypeEmoji } from '../utils/translate';
import { useNavigate } from 'react-router-dom';
import '../styles/Pokedex.css';
import { BADGES } from '../utils/badges';

const Pokedex = () => {
  const navigate = useNavigate();
  const captured = useSelector((state) => state.pokedex.captured);
  const all = useSelector((state) => state.pokedex.all);
  const badgeCount = useSelector((state) => state.pokedex.badgeCount);
  const [zoomedCard, setZoomedCard] = useState(null);
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

  const goToPrev = () => {
    const sorted = [...captured].sort((a, b) => a.id - b.id);
    const index = sorted.findIndex((p) => p.id === zoomedCard.id);
    const newIndex = (index - 1 + sorted.length) % sorted.length;
    setZoomedCard(sorted[newIndex]);
  };

  const goToNext = () => {
    const sorted = [...captured].sort((a, b) => a.id - b.id);
    const index = sorted.findIndex((p) => p.id === zoomedCard.id);
    const newIndex = (index + 1) % sorted.length;
    setZoomedCard(sorted[newIndex]);
  };

  return (
    <div className="pokedex">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>Pokédex</h1>
      <p>Progression : {captured.length}/151</p>

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

      <div className="pokedex-card-grid">
        {all.map((pokemon) => {
          const owned = captured.some(
            (p) => p.id === pokemon.id || p.name.toLowerCase() === pokemon.name.toLowerCase()
          );
          const matched = captured.find(
            (p) => p.id === pokemon.id || p.name.toLowerCase() === pokemon.name.toLowerCase()
          );
          const translatedName = owned ? (translatedNames[matched?.id] || matched?.frenchName || matched?.name || '...') : '???';

          return (
            <div key={pokemon.id} className="pokedex-entry">
              <div className="pokedex-card-name-bar">
                {translatedName}
              </div>

              <div
                className={`pokedex-card ${owned ? 'captured' : 'locked'}`}
                title={owned ? translatedName : 'Non capturé'}
                onClick={() => owned && setZoomedCard(matched)}
              >
                {owned ? (
                  <>
                    <img
                      src={pokemon.image}
                      alt={translatedName}
                      className="poke-image"
                      onError={(e) => { e.target.src = '/images/missing.png'; }}
                    />
                    <p className="poke-id">#{String(pokemon.id).padStart(3, '0')}</p>
                  </>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {zoomedCard && (
        <div className="zoom-overlay">
          <button className="zoom-nav left" onClick={goToPrev}>←</button>
          <div className="zoom-card">
            <button className="zoom-close" onClick={() => setZoomedCard(null)}>✕</button>
            <h2 className="zoom-name">{translatedNames[zoomedCard.id] || zoomedCard.frenchName || zoomedCard.name}</h2>
            <img src={zoomedCard.image} alt={zoomedCard.name} className="zoom-image" />
            <p><strong>ID :</strong> #{String(zoomedCard.id).padStart(3, '0')}</p>
            <p><strong>Type :</strong> {getTypeEmoji(zoomedCard.type || zoomedCard.element)}</p>
            <div className="zoom-values-grid">
              <div className="value-top">
                <span className="stat-arrow"></span> {zoomedCard.values.top}
              </div>
              <div className="value-bottom">
                <span className="stat-arrow"></span> {zoomedCard.values.bottom}
              </div>
              <div className="value-left">
                <span className="stat-arrow"></span> {zoomedCard.values.left}
              </div>
              <div className="value-right">
                {zoomedCard.values.right} <span className="stat-arrow"></span>
              </div>
            </div>
          </div>
          <button className="zoom-nav right" onClick={goToNext}>→</button>
        </div>
      )}
    </div>
  );
};

export default Pokedex;