import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateDeck } from '../redux/slices/playerDeckSlice';
import Card from './Card';

export default function DeckBuilder({ setView }) {
  const pokedex = useSelector(state => state.pokedex?.cards || []);
  const currentDeck = useSelector(state => state.playerDeck.selectedDeck);
  const activeDeckId = useSelector(state => state.playerDeck.activeDeckId);

  const dispatch = useDispatch();

  const toggleCard = (card) => {
    let updatedDeck;
    const isSelected = currentDeck.find(c => c.name === card.name);

    if (isSelected) {
      updatedDeck = currentDeck.filter(c => c.name !== card.name);
    } else {
      if (currentDeck.length >= 5) return; // max 5 cartes
      updatedDeck = [...currentDeck, card];
    }

    dispatch(updateDeck({ id: activeDeckId, cards: updatedDeck }));
  };

  const isInDeck = (card) => {
    return currentDeck.some(c => c.name === card.name);
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Création de Deck</h1>
      <h3>Cartes sélectionnées : {currentDeck?.length || 0} / 5</h3>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {(pokedex || []).filter(card => card).map((card, index) => (
          <div key={index} onClick={() => toggleCard(card)} style={{ cursor: 'pointer' }}>
            <Card
              name={card.name}
              image={card.image}
              values={card.values}
              element={card.element}
              owner="player"
              isSelected={isInDeck(card)}
            />
          </div>
        ))}
      </div>

      <button
        onClick={() => setView('home')}
        style={{ marginTop: '20px' }}
      >
        Retour au menu
      </button>
    </div>
  );
}