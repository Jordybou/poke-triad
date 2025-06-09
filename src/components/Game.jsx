import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlayerDeck, setPlayerDeck, removeCardFromPlayerDeck } from '../redux/slices/playerDeckSlice';
import { generateEnemyDeck, selectEnemyDeck, removeCardFromEnemyDeck } from '../redux/slices/enemyDeckSlice';
import { placeCard, selectBoard, resetBoard, setBoard } from '../redux/slices/boardSlice';
import { endGame, resetGame, selectTurn, switchTurn } from '../redux/slices/gameSlice';
import { capturePokemon } from '../redux/slices/pokedexSlice';
import { selectActiveRules } from '../redux/slices/rulesSlice';
import Card from './Card';
import '../styles/Game.css';
import { applyCaptureRules, isGameOver } from '../utils/logic';
import Board from './Board';
import { generateDefaultDeck } from '../utils/generate';

function Game() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playerDeck = useSelector(selectPlayerDeck);
  const enemyDeck = useSelector(selectEnemyDeck);
  const board = useSelector(selectBoard);
  const flatBoard = board?.flat?.() || [];
  const turn = useSelector(selectTurn);
  const activeRules = useSelector(selectActiveRules);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [captureChoice, setCaptureChoice] = useState(null);
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  const [elementTiles, setElementTiles] = useState([]);

  const playerScore = flatBoard.filter(card => card?.owner === 'player').length;
  const enemyScore = flatBoard.filter(card => card?.owner === 'enemy').length;

  useEffect(() => {
    async function initializeGame() {
      dispatch(resetBoard());
      dispatch(resetGame());

      if (playerDeck.length === 0) {
        const defaultDeck = await generateDefaultDeck();
        dispatch(setPlayerDeck(defaultDeck));
      }

      dispatch(generateEnemyDeck());
    }

    initializeGame();
  }, [dispatch]);

  useEffect(() => {
    if (!activeRules.includes('Élémentaire') || playerDeck.length === 0 || enemyDeck.length === 0) {
      setElementTiles([]);
      return;
    }

    const allTypes = [...playerDeck, ...enemyDeck]
      .map(card => card.type)
      .filter((v, i, a) => a.indexOf(v) === i);

    const count = Math.floor(Math.random() * 3) + 1;
    const positions = new Set();
    while (positions.size < count) {
      const row = Math.floor(Math.random() * 3);
      const col = Math.floor(Math.random() * 3);
      positions.add(`${row}-${col}`);
    }

    const result = Array.from(positions).map(pos => {
      const [row, col] = pos.split('-').map(Number);
      const type = allTypes[Math.floor(Math.random() * allTypes.length)];
      return { row, col, type };
    });

    setElementTiles(result);
  }, [activeRules, playerDeck, enemyDeck]);

  const handleCardClick = (card, index) => {
    if (turn !== 'player' || selectedCard || flatBoard.some(slot => slot?.id === card.id)) return;
    setSelectedCard({ ...card, index });
  };

  const handleSlotClick = (row, col) => {
    if (!selectedCard || board[row][col]) return;

    const cardToPlace = {
      ...selectedCard,
      owner: 'player',
      values: {
        top: selectedCard.top,
        right: selectedCard.right,
        bottom: selectedCard.bottom,
        left: selectedCard.left,
      },
    };

    dispatch(placeCard({ row, col, card: cardToPlace }));
    dispatch(removeCardFromPlayerDeck(selectedCard.id));

    const updated = applyCaptureRules(
      board,
      row,
      col,
      cardToPlace,
      activeRules,
      elementTiles.reduce((acc, { row, col, type }) => {
        acc[`${row}-${col}`] = type;
        return acc;
      }, {})
    );

    dispatch(setBoard(updated));

    setTimeout(() => {
      const noFlash = updated.map(row =>
        row.map(cell => (cell ? { ...cell, flash: false } : null))
      );
      dispatch(setBoard(noFlash));
    }, 500);

    setSelectedCard(null);

    if (isGameOver(updated)) {
      dispatch(endGame());
      resolveEndGame(updated);
      return;
    }

    dispatch(switchTurn());

    setTimeout(() => {
      const coords = [];
      updated.forEach((r, ri) =>
        r.forEach((cell, ci) => {
          if (!cell) coords.push({ row: ri, col: ci });
        })
      );

      const aiCard = enemyDeck.find(c => !updated.flat().some(b => b?.id === c.id));
      if (aiCard && coords.length > 0) {
        const { row: aiRow, col: aiCol } = coords[Math.floor(Math.random() * coords.length)];
        const aiToPlace = {
          ...aiCard,
          owner: 'enemy',
          values: {
            top: aiCard.top,
            right: aiCard.right,
            bottom: aiCard.bottom,
            left: aiCard.left,
          },
        };

        dispatch(placeCard({ row: aiRow, col: aiCol, card: aiToPlace }));
        dispatch(removeCardFromEnemyDeck(aiCard.id));

        const aiUpdated = applyCaptureRules(
          updated,
          aiRow,
          aiCol,
          aiToPlace,
          activeRules,
          elementTiles.reduce((acc, { row, col, type }) => {
            acc[`${row}-${col}`] = type;
            return acc;
          }, {})
        );

        dispatch(setBoard(aiUpdated));

        setTimeout(() => {
          const cleared = aiUpdated.map(row =>
            row.map(cell => (cell ? { ...cell, flash: false } : null))
          );
          dispatch(setBoard(cleared));
        }, 500);

        if (isGameOver(aiUpdated)) {
          dispatch(endGame());
          resolveEndGame(aiUpdated);
          return;
        }

        dispatch(switchTurn());
      }
    }, 500);
  };

  const resolveEndGame = (finalBoard) => {
    const playerCount = finalBoard.flat().filter(c => c?.owner === 'player').length;
    const enemyCount = finalBoard.flat().filter(c => c?.owner === 'enemy').length;
    setWinner(playerCount > enemyCount ? 'player' : playerCount < enemyCount ? 'enemy' : 'draw');
    setShowEndModal(true);
  };

  const confirmCapture = () => {
    if (captureChoice) {
      dispatch(capturePokemon(captureChoice));
      setCaptureConfirmed(true);
    }
  };

  const restart = () => navigate('/game');

  return (
    <div className="game-container">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>

      <div className="game-header">
        <h1 className="game-title">🎮 Poké-Triad</h1>
        <p className="game-turn">Tour : {turn === 'player' ? 'Joueur' : 'Ennemi'}</p>
        <p className="game-score">Score – Joueur : {playerScore} | Ennemi : {enemyScore}</p>
        <p className="game-rules">
          Règle{activeRules.length > 1 ? 's' : ''} en cours :{' '}
          {activeRules.length > 0 ? activeRules.join(', ') : 'aucune'}
        </p>
      </div>

      <div className="game-main">
        <div className="player-deck">
          {playerDeck.map((card, index) => (
            <div key={index} className="card-wrapper">
              <p className="card-name">{card.frenchName || card.name}</p>
              <Card
                card={card}
                source="player"
                onClick={() => handleCardClick(card, index)}
                selected={selectedCard?.id === card.id}
              />
            </div>
          ))}
        </div>

        <Board board={board} onCellClick={handleSlotClick} elementTiles={elementTiles} />

        <div className="enemy-deck">
          {enemyDeck.map((card, index) => (
            <div key={index} className="card-wrapper">
              <p className="card-name">???</p>
              <Card card={{ ...card, hidden: true }} source="enemy" />
            </div>
          ))}
        </div>
      </div>

      {showEndModal && (
        <div className="end-modal">
          {winner === 'draw' && (
            <>
              <h2>Égalité...</h2>
              <button onClick={restart}>Rejouer</button>
              <button onClick={() => navigate('/')}>Retour au menu</button>
            </>
          )}
          {winner === 'enemy' && (
            <>
              <h2>Perdu...</h2>
              <button onClick={restart}>Rejouer</button>
              <button onClick={() => navigate('/')}>Retour au menu</button>
            </>
          )}
          {winner === 'player' && !captureConfirmed && (
            <>
              <h2>Victoire ! Choisissez un Pokémon à capturer :</h2>
              <div className="capture-choices">
                {enemyDeck.map((card, index) => (
                  <div
                    key={index}
                    className={`card-wrapper ${captureChoice?.id === card.id ? 'selected' : ''}`}
                    onClick={() => setCaptureChoice(card)}
                  >
                    <p className="card-name">{card.frenchName || card.name}</p>
                    <Card card={card} source="enemy" />
                  </div>
                ))}
              </div>
              <button onClick={confirmCapture}>Capturer</button>
            </>
          )}
          {captureConfirmed && (
            <>
              <h2>Bravo, vous avez attrapé {captureChoice.frenchName || captureChoice.name} !</h2>
              <button onClick={restart}>Rejouer</button>
              <button onClick={() => navigate('/')}>Retour au menu</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Game;