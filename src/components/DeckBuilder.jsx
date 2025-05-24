import '../styles/DeckBuilder.css';
import { useSelector, useDispatch } from 'react-redux';
import { updateDeck } from '../redux/slices/playerDeckSlice';
import Card from './Card';
import { selectSelectedDeck } from '../redux/slices/playerDeckSlice';

export default function DeckBuilder({ setView }) {
  const pokedex = useSelector(state => state.pokedex?.captured || []);
  const currentDeck = useSelector(selectSelectedDeck) || [] ;
  const activeDeckId = useSelector(state => state.playerDeck.activeDeckId);

  const dispatch = useDispatch();

  const toggleCard = (card) => {
    let updatedDeck;
    const isSelected = currentDeck.find(c => c.name === card.name);

    if (isSelected) {
      updatedDeck = currentDeck.filter(c => c.name !== card.name);
    } else {
      if (currentDeck.length >= 5) return;
      updatedDeck = [...currentDeck, card];
    }

    dispatch(updateDeck({ id: activeDeckId, cards: updatedDeck }));
  };

  const isInDeck = (card) => {
    return currentDeck.some(c => c.name === card.name);
  };

  return (
    <div className="deck-builder-container">
      <h1>🎴 Création de Deck</h1>
      <h3>Cartes sélectionnées : {currentDeck.length || 0} / 5</h3>

      <div className="deck-builder-grid">
        {(pokedex || []).map((card, index) => (
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

      <button onClick={() => setView('home')}>⬅️ Retour au menu</button>
    </div>
  );
}