import React, { useEffect, useState } from 'react';
import Card from './Card';
import { generateDeck } from '../utils/generateDeck';
import '../styles/Board.css';
import { useDispatch } from 'react-redux';
import { addToPokedex } from '../redux/slices/pokedexSlice';

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

    const dispatch = useDispatch();

    useEffect(() => {
        startNewGame();
    }, []);

    const handleSelectCard = (card, index) => {
        if (turn !== 'player') return;
        setSelectedCard({ ...card, index });
    };

    const handleCellClick = (row, col) => {
        if (turn !== 'player') return;
        if (board[row][col] !== null) return;
        if (!selectedCard) return;

        const newBoard = [...board.map(row => [...row])];
        newBoard[row][col] = { ...selectedCard, owner: 'player' };
        const boardAfterCapture = checkCapture(newBoard, row, col, { ...selectedCard, owner: 'player' });

        const newDeck = [...playerDeck];
        newDeck.splice(selectedCard.index, 1);

        setBoard(newBoard);
        setPlayerDeck(newDeck);
        setSelectedCard(null);
        setTurn('enemy');
        setBoard(boardAfterCapture);
        checkEndGame(boardAfterCapture);

        setTimeout(() => enemyPlay(newBoard), 1000);
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
        const boardAfterCapture = checkCapture(newBoard, row, col, { ...card, owner: 'enemy' });

        setBoard(boardAfterCapture);
        checkEndGame(boardAfterCapture);
        setEnemyDeck(enemyDeck.slice(1));
        setTurn('player');
    };

    const checkCapture = (board, row, col, placedCard) => {
        const directions = [
            { dr: -1, dc: 0, side: 'top', opposite: 'bottom' },
            { dr: 1, dc: 0, side: 'bottom', opposite: 'top' },
            { dr: 0, dc: -1, side: 'left', opposite: 'right' },
            { dr: 0, dc: 1, side: 'right', opposite: 'left' },
        ];

        const newBoard = [...board.map(row => [...row])];

        directions.forEach(({ dr, dc, side, opposite }) => {
            const newRow = row + dr;
            const newCol = col + dc;

            if (
                newRow >= 0 && newRow < 3 &&
                newCol >= 0 && newCol < 3 &&
                newBoard[newRow][newCol]
            ) {
                const adjacentCard = newBoard[newRow][newCol];

                if (adjacentCard.owner !== placedCard.owner) {
                    const placedValue = placedCard.values[side];
                    const adjacentValue = adjacentCard.values[opposite];

                    if (placedValue > adjacentValue) {
                        newBoard[newRow][newCol] = {
                            ...adjacentCard,
                            owner: placedCard.owner
                        };
                    }
                }
            }
        });

        return newBoard;
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
        const player = await generateDeck();
        const enemy = await generateDeck();
        setPlayerDeck(player);
        setEnemyDeck(enemy);
        setInitialEnemyDeck(enemy);
        setBoard(Array(3).fill(null).map(() => Array(3).fill(null)));
        setSelectedCard(null);
        setTurn('player');
        setGameOver(false);
        setResult('');
        setCapturedCard(null);
        setShowCapture(false);
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

            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start' }}>
                {/* Deck joueur */}
                <div>
                    <h2>Deck Joueur</h2>
                    {playerDeck.map((card, index) => (
                        <div
                            key={`player-${index}`}
                            onClick={() => handleSelectCard(card, index)}
                            className={selectedCard?.index === index ? 'selected' : ''}
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
                    ))}
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
                <div>
                    <h2>Deck Ennemi</h2>
                    {enemyDeck.map((card, index) => (
                        <Card
                            key={`enemy-${index}`}
                            name={card.name}
                            image={card.image}
                            element={card.element}
                            values={card.values}
                            owner="enemy"
                        />
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