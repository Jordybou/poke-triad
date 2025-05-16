import React from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { firstGenPokemon } from '../utils/pokemonList';
import { BADGES } from '../utils/badges';

export default function Pokedex({ setView }) {
  const captured = useSelector(state => state.pokedex.captured);

  const total = firstGenPokemon.length;
  const found = captured.length;
  const percentage = ((found / total) * 100).toFixed(1);
  const unlockedBadges = BADGES.filter(badge => found >= badge.threshold);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button
        onClick={() => setView('home')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Retour au menu"
      >
        ⬅️
      </button>

      <h2>📘 Pokédex – 1ère génération</h2>

      <p style={{ marginTop: '10px', fontSize: '16px' }}>
        Progression : {found}/{total} cartes capturées ({percentage}%)
      </p>

      <div style={{ marginTop: '10px' }}>
        <strong>🏅 Badges obtenus :</strong>
        {unlockedBadges.length === 0 ? (
          <span> Aucun pour le moment.</span>
        ) : (
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'center',
            marginTop: '8px',
            flexWrap: 'wrap'
          }}>
            {unlockedBadges.map((badge, i) => (
              <div key={i} style={{
                padding: '8px 12px',
                backgroundColor: '#eee',
                borderRadius: '8px',
                fontSize: '20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <img src={badge.image} alt={badge.name} style={{ width: '40px', height: '40px' }} />
                <span style={{ fontSize: '12px' }}>{badge.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section des règles débloquées */}
      {unlockedBadges.length > 0 && (
        <div style={{ marginTop: '20px' }}>
          <strong>📜 Règles débloquées :</strong>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {unlockedBadges.map((badge, i) => (
              <li key={i}>✅ {badge.rule}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Affichage des cartes du Pokédex */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '30px'
      }}>
        {firstGenPokemon.map((name, index) => {
          const card = captured.find(c => c.name === name);

          return (
            <div key={index}>
              {card ? (
                <Card
                  name={card.name}
                  image={card.image}
                  element={card.element}
                  values={card.values}
                  owner="player"
                />
              ) : (
                <div style={{
                  width: '120px',
                  height: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  backgroundColor: '#222',
                  border: '2px dashed #555',
                  borderRadius: '8px',
                  color: '#ccc',
                  opacity: 0.5,
                  paddingTop: '8px',
                  boxSizing: 'border-box'
                }}>
                  <div style={{ height: '20px', fontSize: '12px', marginBottom: '6px' }}>{name}</div>
                  <div style={{
                    width: '100px',
                    height: '130px',
                    backgroundImage: 'url(/images/card-back.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '6px'
                  }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}