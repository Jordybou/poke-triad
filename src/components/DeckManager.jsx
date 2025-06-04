import { useSelector, useDispatch } from 'react-redux';
import {
  setActiveDeck,
  deleteDeck,
  duplicateDeck,
  selectDecks,
  selectActiveDeckId,
} from '../redux/slices/playerDeckSlice';
import Card from './Card';
import '../styles/DeckManager.css';
import { useNavigate } from 'react-router-dom';

export default function DeckManager() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const decks = useSelector(selectDecks);
  const activeId = useSelector(selectActiveDeckId);

  return (
    <div className="deck-manager-container">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>📦 Gestion des Decks</h1>

      {decks.length === 0 ? (
        <p>Vous n'avez encore aucun deck. Créez-en un !</p>
      ) : (
        <div className="deck-list">
          {decks.map((deck, index) => (
            <div key={deck.id} className={`deck-box ${deck.id === activeId ? 'active' : ''}`}>
              <h3>{deck.name || `Deck ${index + 1}`}</h3>
              <div className="deck-cards">
                {deck.cards.map((card, idx) => (
                  <Card key={idx} card={card} owner="player" inDeck />
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