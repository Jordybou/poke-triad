import React, { useEffect, useState } from 'react';
import Card from './Card';
import { generateDeck } from '../utils/generateDeck';
import '../styles/Board.css';
import { useDispatch } from 'react-redux';
import { addToPokedex } from '../redux/slices/pokedexSlice';
import { useSelector } from 'react-redux';
import { defaultDeck } from '../utils/defaultDeck';
import { checkCapture } from '../utils/logic';

export default function Game({ setView }) {
    const [playerDeck, setPlayerDeck] = useState([]);
    const [enemyDeck, setEnemyDeck] = useState([]);
    const [board, setBoard] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));
    const [selectedCard, setSelectedCard] = useState(null);
    const [turn, setTurn] = useState('player');
    const [gameOver, setGameOver] = useState(false);
    const [result, setResult] = useState('');
    const [capturedCard, setCapturedCard] = useState(null);
    const [showCapture, setShowCapture] = useState(false);
    const [initialEnemyDeck, setInitialEnemyDeck] = useState([]);
    const [elementalGrid, setElementalGrid] = useState(Array(3).fill(null).map(() => Array(3).fill(null)));

    const dispatch = useDispatch();

    const playerCustomDeck = useSelector(state => state.playerDeck.deck);
    const activeRules = useSelector(state => state.rules.enabledRules);
    const activeDeck = useSelector(state =>
        state.playerDeck.decks.find(deck => deck.id === state.playerDeck.activeDeckId)
    );

    useEffect(() => {
        startNewGame();
    }, []);

    const handleSelectCard = (card, index) => {
        if (turn !== 'player') return;

        const isOrderActive = activeRules.includes('Ordre');

        if (isOrderActive) {
            if (index !== 0) return; // Seule la première carte est jouable
        }

        setSelectedCard({ ...card, index });
    };

    const handleCellClick = (row, col) => {
        if (board[row][col] !== null) return;
        if (!selectedCard || turn !== 'player') return;

        const elementalType = elementalGrid[row][col];
        let adjustedCard = { ...selectedCard, owner: 'player' };

        if (activeRules.includes("Élémental") && elementalType) {
            const match = selectedCard.element === elementalType;

            adjustedCard = {
                ...adjustedCard,
                values: Object.fromEntries(
                    Object.entries(selectedCard.values).map(([dir, val]) => [
                        dir,
                        Math.max(1, Math.min(10, val + (match ? 1 : -1)))
                    ])
                )
            };
        }

        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = adjustedCard;
        const boardAfterCapture = checkCapture(newBoard, row, col, adjustedCard, activeRules);

        const newDeck = [...playerDeck];
        newDeck.splice(selectedCard.index, 1);

        setBoard(boardAfterCapture);
        setPlayerDeck(newDeck);
        setSelectedCard(null);
        setTurn('enemy');
        checkEndGame(boardAfterCapture);

        setTimeout(() => enemyPlay(boardAfterCapture), 1000);
    };

    const enemyPlay = (currentBoard) => {
        if (enemyDeck.length === 0) return;

        const emptyCells = [];
        currentBoard.forEach((row, r) =>
            row.forEach((cell, c) => {
                if (!cell) emptyCells.push([r, c]);
            })
        );

        if (emptyCells.length === 0) return;

        const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        const card = enemyDeck[0];

        const newBoard = [...currentBoard.map(row => [...row])];
        newBoard[row][col] = { ...card, owner: 'enemy' };
        const boardAfterCapture = checkCapture(newBoard, row, col, { ...card, owner: 'enemy' }, activeRules);

        setBoard(boardAfterCapture);
        checkEndGame(boardAfterCapture);
        setEnemyDeck(enemyDeck.slice(1));
        setTurn('player');
    };

    const countOwnedCards = (board) => {
        let playerCount = 0;
        let enemyCount = 0;

        board.forEach(row =>
            row.forEach(cell => {
                if (cell?.owner === 'player') playerCount++;
                if (cell?.owner === 'enemy') enemyCount++;
            })
        );

        return { player: playerCount, enemy: enemyCount };
    };

    const checkEndGame = (board) => {
        const totalPlaced = board.flat().filter(cell => cell !== null).length;
        if (totalPlaced === 9) {
            const { player, enemy } = countOwnedCards(board);
            if (player > enemy) {
                setShowCapture(true); // lance la fenêtre de capture
            } else {
                setResult(enemy > player ? 'Défaite... 😢' : 'Égalité ! 🤝');
                setGameOver(true);
            }
        }
    };

    const startNewGame = async () => {
        const player = playerCustomDeck.length === 5 ? playerCustomDeck : defaultDeck;
        const enemy = await generateDeck();
        setPlayerDeck(activeDeck?.cards || []);
        setEnemyDeck(enemy);
        setInitialEnemyDeck(enemy);
        setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
        setSelectedCard(null);
        setTurn('player');
        setGameOver(false);
        setResult('');
        setCapturedCard(null);
        setShowCapture(false);
        setElementalGrid(generateElementalGrid());
    };

    const generateElementalGrid = () => {
        const elements = ['fire', 'water', 'grass', 'electric', 'ice', 'psychic', 'ghost', 'rock'];
        const count = Math.floor(Math.random() * 4) + 2;

        const positions = new Set();
        while (positions.size < count) {
            const row = Math.floor(Math.random() * 3);
            const col = Math.floor(Math.random() * 3);
            positions.add(`${row},${col}`);
        }

        const grid = Array(3).fill(null).map(() => Array(3).fill(null));
        for (let pos of positions) {
            const [r, c] = pos.split(',').map(Number);
            grid[r][c] = elements[Math.floor(Math.random() * elements.length)];
        }

        return grid;
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
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
            <h1>Poké-Triad</h1>
            <h3>Tour actuel : {turn === 'player' ? '👤 Joueur' : '💻 Ennemi'}</h3>

            {(() => {
                const { player, enemy } = countOwnedCards(board);
                return <h3>Score : 🟦 Joueur {player} - {enemy} Ennemi 🟥</h3>;
            })()}

            {activeRules.length > 0 && (
                <div style={{ marginTop: '10px' }}>
                    <strong>Règles actives :</strong>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {activeRules.map((rule, index) => (
                            <li key={index}>📜 {rule}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                {/* Deck joueur */}
                <div>
                    <h2>Deck Joueur</h2>
                    {playerDeck.map((card, index) => {
                        const isOrderActive = activeRules.includes('Ordre');
                        const isDisabled = isOrderActive && index !== 0;

                        return (
                            <div
                                key={`player-${index}`}
                                onClick={() => !isDisabled && handleSelectCard(card, index)}
                                className={`${selectedCard?.index === index ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                            >
                                <Card
                                    name={card.name}
                                    image={card.image}
                                    element={card.element}
                                    values={card.values}
                                    owner="player"
                                    isSelected={selectedCard?.index === index}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Plateau */}
                <div className="board">
                    {board.map((row, rowIndex) => (
                        <div className="board-row" key={rowIndex}>
                            {row.map((cell, colIndex) => (
                                <div
                                    className="board-cell"
                                    key={colIndex}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                >
                                    {cell ? (
                                        <Card
                                            name={cell.name}
                                            image={cell.image}
                                            element={cell.element}
                                            values={cell.values}
                                            owner={cell.owner}
                                            onBoard={true}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Deck ennemi */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h2>Deck Ennemi</h2>
                    {enemyDeck.map((card, index) => (
                        <div key={index} style={{ marginBottom: '10px' }}>
                            {activeRules.includes('Open') ? (
                                <>
                                    <div
                                        style={{
                                            backgroundColor: '#f3f3f3',
                                            borderRadius: '4px',
                                            padding: '4px 8px',
                                            marginBottom: '4px',
                                            fontWeight: 'bold',
                                            width: '120px',
                                            textAlign: 'center'
                                        }}
                                    >
                                        {card.name}
                                    </div>
                                    <Card
                                        name={card.name}
                                        image={card.image}
                                        element={card.element}
                                        values={card.values}
                                        owner="enemy"
                                    />
                                </>
                            ) : (
                                <>
                                    {/* Espace vide pour nom de carte */}
                                    <div style={{ height: '18px', width: '120px', marginBottom: '4px' }} />
                                    <div
                                        style={{
                                            width: '120px',
                                            height: '150px',
                                            backgroundImage: 'url(/images/card-back.png)',
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            borderRadius: '8px',
                                            boxShadow: '0 0 4px black'
                                        }}
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {gameOver && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '30px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        boxShadow: '0 0 20px black'
                    }}>
                        <h2>{result}</h2>
                        <button onClick={startNewGame}>Rejouer</button>
                        <button onClick={() => setView('home')}>Retour au menu</button>
                    </div>
                </div>
            )}
            {showCapture && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 20
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        maxWidth: '600px'
                    }}>
                        <h2>Victoire ! Choisissez une carte à capturer :</h2>
                        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {initialEnemyDeck.map((card, index) => (
                                <div
                                    key={index}
                                    onClick={() => {
                                        dispatch(addToPokedex(card));
                                        setCapturedCard(card);
                                        setShowCapture(false);
                                        setGameOver(true);
                                        setResult(`Bravo, vous avez attrapé ${card.name} !`);
                                    }}
                                    style={{ cursor: 'pointer', margin: '5px' }}
                                >
                                    <Card
                                        name={card.name}
                                        image={card.image}
                                        element={card.element}
                                        values={card.values}
                                        owner="enemy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}