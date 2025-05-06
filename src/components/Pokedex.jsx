import React from 'react';
import { useSelector } from 'react-redux';
import Card from './Card';
import { firstGenPokemon } from '../utils/pokemonList';

export default function Pokedex({ setView }) {
  const captured = useSelector(state => state.pokedex.captured);

  const total = firstGenPokemon.length;
  const found = captured.length;
  const percentage = ((found / total) * 100).toFixed(1);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>📘 Pokédex – 1ère génération</h2>
      <p style={{ marginTop: '10px', fontSize: '16px' }}>
        Progression : {found}/{total} cartes capturées ({percentage}%)
      </p>
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
                  height: '150px',
                  backgroundColor: '#222',
                  border: '2px dashed #555',
                  borderRadius: '8px',
                  color: '#ccc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '24px',
                  opacity: 0.5
                }}>
                  🔒<div style={{ fontSize: '12px', marginTop: '5px' }}>{name}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}