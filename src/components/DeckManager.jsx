
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveDeck, renameDeck, deleteDeck } from '../redux/slices/playerDeckSlice';

export default function DeckManager() {
    const decks = useSelector(state => state.playerDeck.decks);
    const activeDeckId = useSelector(state => state.playerDeck.activeDeckId);
    const dispatch = useDispatch();
    const [selectedDeckId, setSelectedDeckId] = useState(null);
    const [newName, setNewName] = useState('');

    const handleRename = () => {
        if (selectedDeckId && newName.trim()) {
            dispatch(renameDeck({ id: selectedDeckId, name: newName.trim() }));
            setNewName('');
        }
    };

    const handleDelete = () => {
        if (selectedDeckId) {
            dispatch(deleteDeck(selectedDeckId));
            setSelectedDeckId(null);
        }
    };

    const handleSetActive = () => {
        if (selectedDeckId) {
            dispatch(setActiveDeck(selectedDeckId));
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Gestion des Decks</h2>
            <ul>
                {decks.map(deck => (
                    <li
                        key={deck.id}
                        style={{
                            margin: '10px 0',
                            padding: '10px',
                            border: selectedDeckId === deck.id ? '2px solid blue' : '1px solid gray',
                            backgroundColor: deck.id === activeDeckId ? '#d0f0ff' : 'white',
                            cursor: 'pointer'
                        }}
                        onClick={() => setSelectedDeckId(deck.id)}
                    >
                        <strong>{deck.name}</strong> {deck.cards.length}/5 cartes
                        {deck.id === activeDeckId && <span> ✅ (Actif)</span>}
                    </li>
                ))}
            </ul>

            {selectedDeckId && (
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Nouveau nom"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                    />
                    <button onClick={handleRename} style={{ marginLeft: '10px' }}>Renommer</button>
                    <button onClick={handleDelete} style={{ marginLeft: '10px' }}>Supprimer</button>
                    <button onClick={handleSetActive} style={{ marginLeft: '10px' }}>Définir comme actif</button>
                </div>
            )}
        </div>
    );
}
