import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlayerDeck, setPlayerDeck, removeCardFromPlayerDeck } from '../redux/slices/playerDeckSlice';
import { setEnemyDeck, selectEnemyDeck, removeCardFromEnemyDeck } from '../redux/slices/enemyDeckSlice';
import { generateDeck, generateDefaultDeck } from '../utils/generate';
import { placeCard, selectBoard, resetBoard, setBoard } from '../redux/slices/boardSlice';
import { endGame, resetGame, selectTurn, switchTurn } from '../redux/slices/gameSlice';
import { capturePokemon, selectCaptured } from '../redux/slices/pokedexSlice';
import { selectActiveRules } from '../redux/slices/rulesSlice';
import Card from './Card';
import '../styles/Game.css';
import { applyCaptureRules, isGameOver } from '../utils/logic';
import Board from './Board';
import pokeball from '../assets/pokeball.png';
import { store } from '../redux/store';

function Game() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playerDeck = useSelector(selectPlayerDeck);
  const enemyDeck = useSelector(selectEnemyDeck);
  const board = useSelector(selectBoard);
  const flatBoard = board?.flat?.() || [];
  const turn = useSelector(selectTurn);
  const activeRules = useSelector(selectActiveRules);
  const captured = useSelector(selectCaptured);

  const [selectedCard, setSelectedCard] = useState(null);
  const [showEndModal, setShowEndModal] = useState(false);
  const [winner, setWinner] = useState(null);
  const [captureChoice, setCaptureChoice] = useState(null);
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  const [elementTiles, setElementTiles] = useState([]);
  const [originalEnemyDeck, setOriginalEnemyDeck] = useState([]);
  const [gameInitialized, setGameInitialized] = useState(false);

  const playerScore = flatBoard.filter(card => card?.owner === 'player').length;
  const enemyScore = flatBoard.filter(card => card?.owner === 'enemy').length;

  useEffect(() => {
    async function initializeGame() {
      dispatch(resetBoard());
      dispatch(resetGame());

      const storedDeck = JSON.parse(localStorage.getItem('currentDeck'));
      const isValidDeck = Array.isArray(storedDeck) &&
        storedDeck.length === 5 &&
        storedDeck.every(card => card && typeof card.idDex === 'number');

      if (isValidDeck) {
        dispatch(setPlayerDeck(storedDeck));
      } else {
        const defaultDeck = await generateDefaultDeck();
        dispatch(setPlayerDeck(defaultDeck));
        localStorage.setItem('currentDeck', JSON.stringify(defaultDeck));
      }

      const deck = await generateDeck();
      dispatch(setEnemyDeck(deck));
      setOriginalEnemyDeck(deck);
      setGameInitialized(true);
    }

    initializeGame();
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(enemyDeck) && enemyDeck.length === 5 && Array.isArray(originalEnemyDeck) && originalEnemyDeck.length === 0) {
      setOriginalEnemyDeck(enemyDeck);
    }
  }, [enemyDeck, originalEnemyDeck]);

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
    if (turn !== 'player') return;

    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard({ ...card, index });
    }
  };

  useEffect(() => {
    const totalCards = board.flat().filter(Boolean).length;
    if (totalCards === 0 || !gameInitialized) return;

    if (!showEndModal && isGameOver(board)) {
      dispatch(endGame());
      resolveEndGame(board);
    }
  }, [board, dispatch, showEndModal]);

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
    console.log('Retirer la carte avec idDex :', selectedCard.idDex);
    dispatch(removeCardFromPlayerDeck(selectedCard.idDex));

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

    setTimeout(() => {
      dispatch(switchTurn());
      setTimeout(() => {
        playEnemyTurn();
      }, 300); // On laisse le temps à Redux de switcher le tour
    }, 500); // délai entre le tour du joueur et celui de l’IA
  };

  const resolveEndGame = (finalBoard) => {
    const playerCount = finalBoard.flat().filter(c => c?.owner === 'player').length;
    const enemyCount = finalBoard.flat().filter(c => c?.owner === 'enemy').length;
    setWinner(playerCount > enemyCount ? 'player' : playerCount < enemyCount ? 'enemy' : 'draw');
    setShowEndModal(true);
  };

  const confirmCapture = () => {
    if (!captureChoice) return;

    const isAlreadyCaptured = captured.some(card => card.name === captureChoice.name);

    // On capture uniquement si ce n'est pas déjà dans le Pokédex
    if (!isAlreadyCaptured) {
      dispatch(capturePokemon(captureChoice));
    }

    // On vérifie si la carte existe déjà dans le deck actif
    const currentDeck = JSON.parse(localStorage.getItem('currentDeck')) || [];
    const alreadyInDeck = currentDeck.some(c => c.id === captureChoice.id);

    // Si elle n'y est pas, on l'ajoute
    if (!alreadyInDeck) {
      const updatedDeck = currentDeck.length < 5
        ? [...currentDeck, captureChoice]
        : currentDeck;
      localStorage.setItem('currentDeck', JSON.stringify(updatedDeck));

      // ✅ mise à jour Redux en plus du localStorage
      dispatch(setPlayerDeck(updatedDeck));
    }

    setCaptureConfirmed(true); // dans tous les cas, on passe à l'écran final
  };

  const restart = async () => {
    dispatch(resetBoard());
    dispatch(resetGame());
    setSelectedCard(null);
    setShowEndModal(false);
    setWinner(null);
    setCaptureChoice(null);
    setCaptureConfirmed(false);
    setElementTiles([]);

    const storedDeck = JSON.parse(localStorage.getItem('currentDeck'));

    const isValidDeck = Array.isArray(storedDeck) &&
      storedDeck.length === 5 &&
      storedDeck.every(card => card && typeof card.idDex === 'number');

    if (isValidDeck) {
      dispatch(setPlayerDeck(storedDeck));
    } else {
      const defaultDeck = await generateDefaultDeck();
      dispatch(setPlayerDeck(defaultDeck));
      localStorage.setItem('currentDeck', JSON.stringify(defaultDeck));
    }

    const enemy = await generateDeck();
    dispatch(setEnemyDeck(enemy));
    setOriginalEnemyDeck(enemy);
  };

  const playEnemyTurn = () => {
    const updated = store.getState().board.grid; // Récupère l’état actuel du plateau
    if (!Array.isArray(updated) || !Array.isArray(updated[0])) return;

    const coords = [];
    updated.forEach((r, ri) =>
      r.forEach((cell, ci) => {
        if (!cell) coords.push({ row: ri, col: ci });
      })
    );

    const enemyDeckCurrent = store.getState().enemy.deck;
    if (!Array.isArray(enemyDeckCurrent)) {
      console.error('Le deck ennemi est invalide :', enemyDeckCurrent);
      return;
    }
    const aiCard = enemyDeckCurrent.find(c => !updated.flat().some(b => b?.id === c.id));
    if (!aiCard || coords.length === 0) return;

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
      image: aiCard.image || aiCard.sprite || '',
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

    const totalCards = aiUpdated.flat().filter(Boolean).length;
    if (totalCards === 9 || isGameOver(aiUpdated)) {
      dispatch(endGame());
      resolveEndGame(aiUpdated);
      return;
    }

    dispatch(switchTurn());
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
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
              {activeRules.includes('Open') && (
                <p className="card-name">{card.frenchName || card.name}</p>
              )}
              <Card
                card={{ ...card, hidden: !activeRules.includes('Open') }}
                source="enemy"
                inDeck={true}
                faceDown={!activeRules.includes('Open')}
              />
            </div>
          ))}
        </div>
      </div>

      {showEndModal && (
        <>
          <div className="modal-overlay" />
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

            {winner === 'player' && !captureConfirmed && Array.isArray(originalEnemyDeck) && originalEnemyDeck.length > 0 && (() => {
              console.log("Enemy deck original:", originalEnemyDeck.map(c => ({ name: c.name, idDex: c.idDex })));
              const capturableCards = originalEnemyDeck.filter(card =>
                !captured.some(c => String(c.idDex) === String(card.idDex))
              );

              if (capturableCards.length === 0) {
                return (
                  <>
                    <h2>Victoire !</h2>
                    <p>Vous avez déjà capturé tous les Pokémon ennemis !</p>
                    <button onClick={restart}>Rejouer</button>
                    <button onClick={() => navigate('/')}>Retour au menu</button>
                  </>
                );
              }

              return (
                <>
                  <h2>Victoire ! Choisissez un Pokémon à capturer :</h2>
                  <div className="capture-choices">
                    {originalEnemyDeck.map((card, index) => {
                      const isAlreadyCaptured = captured.some(c => String(c.idDex) === String(card.idDex));

                      return (
                        <div
                          key={index}
                          className={`card-wrapper ${captureChoice?.idDex === card.idDex ? 'selected' : ''} ${isAlreadyCaptured ? 'already-captured' : ''}`}
                          onClick={() => !isAlreadyCaptured && setCaptureChoice(card)}
                          style={{
                            position: 'relative',
                            opacity: isAlreadyCaptured ? 0.5 : 1,
                            filter: isAlreadyCaptured ? 'grayscale(80%)' : 'none',
                            pointerEvents: isAlreadyCaptured ? 'none' : 'auto'
                          }}
                        >
                          <p className="card-name">{card.frenchName || card.name}</p>
                          <Card card={card} source="enemy" />
                          {isAlreadyCaptured && (
                            <img
                              src={pokeball}
                              alt="Déjà capturé"
                              style={{
                                position: 'absolute',
                                bottom: '6px',
                                right: '6px',
                                width: '22px',
                                height: '22px',
                                zIndex: 10,
                                opacity: 0.95,
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <button onClick={confirmCapture} disabled={!captureChoice}>Capturer</button>
                </>
              );
            })()}

            {captureConfirmed && (
              <>
                <h2>Bravo, vous avez attrapé {captureChoice.frenchName || captureChoice.name} !</h2>
                <button onClick={restart}>Rejouer</button>
                <button onClick={() => navigate('/')}>Retour au menu</button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Game;