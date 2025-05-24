import { useSelector, useDispatch } from 'react-redux';
import { setActiveDeck, deleteDeck, duplicateDeck } from '../redux/slices/playerDeckSlice';
import Card from './Card';
import '../styles/DeckManager.css';

export default function DeckManager({ setView }) {
  const decks = useSelector(state => state.playerDeck.decks);
  const activeId = useSelector(state => state.playerDeck.activeDeckId);
  const dispatch = useDispatch();

  return (
    <div className="deck-manager-container">
      <div className="deck-manager-header">
        <button className="return-button" onClick={() => setView('home')}>⬅️</button>
        <h1>📦 Gestion des Decks</h1>
      </div>

      {decks.length === 0 ? (
        <p>Vous n'avez aucun deck.</p>
      ) : (
        <div className="deck-list">
          {decks.map((deck, index) => (
            <div key={deck.id} className={`deck-box ${deck.id === activeId ? 'active' : ''}`}>
              <h3>Deck {index + 1}</h3>
              <div className="deck-cards">
                {deck.cards.map((card, idx) => (
                  <Card key={idx} {...card} owner="player" />
                ))}
              </div>
              <div className="deck-actions">
                <button onClick={() => dispatch(setActiveDeck(deck.id))}>Activer</button>
                <button onClick={() => dispatch(duplicateDeck(deck))}>Dupliquer</button>
                <button onClick={() => dispatch(deleteDeck(deck.id))}>Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}