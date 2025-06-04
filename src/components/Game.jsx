import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlayerDeck } from '../redux/slices/playerDeckSlice';
import { generateEnemyDeck, selectEnemyDeck } from '../redux/slices/enemyDeckSlice';
import { placeCard, selectBoard, resetBoard, updateBoard } from '../redux/slices/boardSlice';
import { endGame, resetGame, selectGameStatus, selectTurn, switchTurn } from '../redux/slices/gameSlice';
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
  const turn = useSelector(selectTurn);
  const gameStatus = useSelector(selectGameStatus);
  const activeRules = useSelector(selectActiveRules);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [captureChoice, setCaptureChoice] = useState(null);
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  const [elementTiles, setElementTiles] = useState([]);

  const playerScore = board.filter(card => card?.owner === 'player').length;
  const enemyScore = board.filter(card => card?.owner === 'enemy').length;

  useEffect(() => {
    dispatch(resetBoard());
    dispatch(resetGame());
    dispatch(generateEnemyDeck());

    // Génération des cases élémentaires si la règle est active
    if (activeRules.includes('Élémentaire')) {
      const allTypes = [...playerDeck, ...enemyDeck]
        .map(card => card.type)
        .filter((v, i, a) => a.indexOf(v) === i); // unique

      const count = Math.floor(Math.random() * 3) + 1; // 1 à 3 cases
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
    } else {
      setElementTiles([]);
    }
  }, [dispatch, activeRules, playerDeck, enemyDeck]);

  const handleCardClick = (card, index) => {
    if (turn !== 'player' || selectedCard || board.some(slot => slot?.id === card.id)) return;
    setSelectedCard({ ...card, index });
  };

  const handleSlotClick = (index) => {
    if (!selectedCard || board[index]) return;

    const row = Math.floor(index / 3);
    const col = index % 3;
    const cardToPlace = { ...selectedCard, owner: 'player' };

    dispatch(placeCard({ index, card: cardToPlace }));

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
    dispatch(updateBoard(updated));
    setSelectedCard(null);

    if (isGameOver(updated)) {
      dispatch(endGame());
      resolveEndGame(updated);
      return;
    }

    dispatch(switchTurn());

    // Tour de l'ennemi
    setTimeout(() => {
      const availableIndexes = updated.map((c, i) => c === null ? i : null).filter(i => i !== null);
      if (availableIndexes.length > 0) {
        const aiCard = enemyDeck.find(c => !updated.some(b => b?.id === c.id));
        if (aiCard) {
          const aiIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
          dispatch(placeCard({ index: aiIndex, card: { ...aiCard, owner: 'enemy' } }));

          const row = Math.floor(aiIndex / 3);
          const col = aiIndex % 3;

          const aiUpdated = applyCaptureRules(
            updated,
            row,
            col,
            { ...aiCard, owner: 'enemy' },
            activeRules,
            elementTiles.reduce((acc, { row, col, type }) => {
              acc[`${row}-${col}`] = type;
              return acc;
            }, {})
          );
          dispatch(updateBoard(aiUpdated));

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
    const playerFinal = finalBoard.filter(c => c?.owner === 'player').length;
    const enemyFinal = finalBoard.filter(c => c?.owner === 'enemy').length;

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

  return (
    <div className="game-container">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>

      <div className="game-header">
        <h1 className="game-title">🎮 Poké-Triad</h1>
        <p className="game-turn">Tour : {turn === 'player' ? 'Joueur' : 'Ennemi'}</p>
        <p className="game-score">Score – Joueur : {playerScore} | Ennemi : {enemyScore}</p>
        <p className="game-rules">
          Règle{activeRules.length > 1 ? 's' : ''} en cours :{" "}
          {activeRules.length > 0 ? activeRules.join(", ") : "aucune"}
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

        <Board board={[board.slice(0, 3), board.slice(3, 6), board.slice(6, 9)]}
          onCellClick={(r, c) => handleSlotClick(r * 3 + c)}
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