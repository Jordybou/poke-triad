import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlayerDeck, setPlayerDeck } from '../redux/slices/playerDeckSlice';
import { generateEnemyDeck, selectEnemyDeck } from '../redux/slices/enemyDeckSlice';
import { placeCard, selectBoard, resetBoard, setBoard } from '../redux/slices/boardSlice';
import { endGame, resetGame, selectTurn, switchTurn } from '../redux/slices/gameSlice';
import { capturePokemon } from '../redux/slices/pokedexSlice';
import { selectActiveRules } from '../redux/slices/rulesSlice';
import Card from './Card';
import '../styles/Game.css';
import { applyCaptureRules, isGameOver } from '../utils/logic';
import Board from './Board';

function Game() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playerDeck = useSelector(selectPlayerDeck);
  const enemyDeck = useSelector(selectEnemyDeck);
  const board = useSelector(selectBoard);
  const flatBoard = board?.flat?.() || [];
  const turn = useSelector(selectTurn);
  const activeRules = useSelector(selectActiveRules);
  const captured = useSelector((state) => state.pokedex.captured);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [captureChoice, setCaptureChoice] = useState(null);
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  const [elementTiles, setElementTiles] = useState([]);

  const playerScore = flatBoard.filter(card => card?.owner === 'player').length;
  const enemyScore = flatBoard.filter(card => card?.owner === 'enemy').length;

  useEffect(() => {
    dispatch(resetBoard());
    dispatch(resetGame());

    if (playerDeck.length === 0) {
      const fromCaptured = captured.slice(0, 5);
      dispatch(setPlayerDeck(fromCaptured));
    }

    dispatch(generateEnemyDeck());
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
    if (!selectedCard) return;

    if (board[row][col]) return;

    const cardToPlace = { ...selectedCard, owner: 'player' };
    dispatch(placeCard({ row, col, card: cardToPlace }));

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
    console.log('✅ Board mis à jour !', updated);
    setSelectedCard(null);

    if (isGameOver(updated)) {
      dispatch(endGame());
      resolveEndGame(updated);
      return;
    }

    dispatch(switchTurn());

    setTimeout(() => {
      const availableCoords = [];
      updated.forEach((rowArr, rowIdx) => {
        rowArr.forEach((cell, colIdx) => {
          if (!cell) availableCoords.push({ row: rowIdx, col: colIdx });
        });
      });

      if (availableCoords.length > 0) {
        const aiCard = enemyDeck.find(c => !updated.flat().some(b => b?.id === c.id));
        if (aiCard) {
          const { row: aiRow, col: aiCol } = availableCoords[Math.floor(Math.random() * availableCoords.length)];
          dispatch(placeCard({ row: aiRow, col: aiCol, card: { ...aiCard, owner: 'enemy' } }));

          const aiUpdated = applyCaptureRules(
            updated,
            aiRow,
            aiCol,
            { ...aiCard, owner: 'enemy' },
            activeRules,
            elementTiles.reduce((acc, { row, col, type }) => {
              acc[`${row}-${col}`] = type;
              return acc;
            }, {})
          );
          dispatch(setBoard(updated));
          console.log('✅ Board mis à jour !', updated);

          if (isGameOver(aiUpdated)) {
            dispatch(endGame());
            resolveEndGame(aiUpdated);
            return;
          }

          dispatch(switchTurn());
        }
      }
    }, 500);
  };

  const resolveEndGame = (finalBoard) => {
    const playerFinal = finalBoard.flat().filter(c => c?.owner === 'player').length;
    const enemyFinal = finalBoard.flat().filter(c => c?.owner === 'enemy').length;

    setWinner(playerFinal > enemyFinal ? 'player' : playerFinal < enemyFinal ? 'enemy' : 'draw');
    setShowEndModal(true);
  };

  const confirmCapture = () => {
    if (captureChoice) {
      dispatch(capturePokemon(captureChoice));
      setCaptureConfirmed(true);
    }
  };

  const restart = () => navigate('/game');

  console.log('🎯 BOARD RENDER:', JSON.stringify(board, null, 2));
  console.log('🎯 BOARD REÇU dans <Board />:', board);
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

        <Board
          board={board}
          onCellClick={handleSlotClick}
          elementTiles={elementTiles}
        />

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