import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectPlayerDeck, setPlayerDeck, removeCardFromPlayerDeck } from '../redux/slices/playerDeckSlice';
import { setEnemyDeck, selectEnemyDeck, removeCardFromEnemyDeck } from '../redux/slices/enemyDeckSlice';
import { generateDeck, generateDefaultDeck } from '../utils/generate';
import { placeCard, selectBoard, resetBoard, setBoard } from '../redux/slices/boardSlice';
import { endGame, resetGame, selectTurn, switchTurn, selectForcedCardIndex, setForcedCardIndex } from '../redux/slices/gameSlice';
import { capturePokemon, selectCaptured } from '../redux/slices/pokedexSlice';
import { selectActiveRules } from '../redux/slices/rulesSlice';
import Card from './Card';
import '../styles/Game.css';
import { applyCaptureRules, isGameOver, logCaptureEvent, applyElemental, getForcedCardIndex } from '../utils/logic';
import Board from './Board';
import { store } from '../redux/store';
import { generateElementTiles } from '../utils/generate';
import { saveProgress } from '../redux/thunks/saveProgress';

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
  const forcedCardIndex = useSelector(selectForcedCardIndex);

  //Carte séléctionnée par le joueur
  const [selectedCard, setSelectedCard] = useState(null);
  //Affichage modal de fin de partie
  const [showEndModal, setShowEndModal] = useState(false);
  //Stocke le vainqueur
  const [winner, setWinner] = useState(null);
  //Pokémon choisit en cas de victoire
  const [captureChoice, setCaptureChoice] = useState(null);
  //Booléen pour validation au Pokédex du pokémon capturé
  const [captureConfirmed, setCaptureConfirmed] = useState(false);
  //Cases du plateau contenant un élément (règle élémentaire)
  const [elementTiles, setElementTiles] = useState([]);
  //Deck ennemi, sauvegarde du deck initial pour modal victoire
  const [originalEnemyDeck, setOriginalEnemyDeck] = useState([]);
  //Indique si la partie a été initialisée
  const [gameInitialized, setGameInitialized] = useState(false);

  const playerScore = flatBoard.filter(card => card?.owner === 'player').length;
  const enemyScore = flatBoard.filter(card => card?.owner === 'enemy').length;
  const availableTypes = [...new Set([...playerDeck, ...enemyDeck].map(card => card.type))];

  //UseEffect pour règle Elémentaire
  useEffect(() => {
    if (activeRules.includes('Élémentaire') && elementTiles.length === 0) {
      setElementTiles(generateElementTiles(1, 4, availableTypes));
    }
  }, [activeRules, elementTiles]);

  useEffect(() => {
    if (activeRules.includes('Ordre') && turn === 'player' && playerDeck.length > 0) {
      const newForced = getForcedCardIndex(playerDeck);
      dispatch(setForcedCardIndex(newForced));
    }
  }, [turn, activeRules, playerDeck]);

  useEffect(() => {
    async function initializeGame() {
      dispatch(resetBoard());
      dispatch(resetGame());

      const storedDeck = JSON.parse(localStorage.getItem('currentDeck'));
      const isValidDeck = Array.isArray(storedDeck) && storedDeck.length === 5;

      if (isValidDeck) {
        dispatch(setPlayerDeck(storedDeck));
      } else {
        const defaultDeck = await generateDefaultDeck();
        dispatch(setPlayerDeck(defaultDeck));
        localStorage.setItem('currentDeck', JSON.stringify(defaultDeck));
      }

      const deck = await generateDeck();
      if (!gameInitialized) {
        dispatch(setEnemyDeck(deck));
        setOriginalEnemyDeck(deck);
        setGameInitialized(true);
      }
    }
    initializeGame();
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(enemyDeck) && enemyDeck.length === 5 && originalEnemyDeck.length === 0) {
      setOriginalEnemyDeck(enemyDeck);
    }
  }, [enemyDeck, originalEnemyDeck]);

  // Sauvegarde auto quand la partie est finie et que le joueur n'a PAS gagné
  // -> couvre les cas "enemy" et "draw" dès que la modale s'ouvre.
  useEffect(() => {
    if (showEndModal && winner && winner !== 'player') {
      dispatch(saveProgress());
    }
  }, [showEndModal, winner, dispatch]);

  // Fonction déclenchée lorsqu'une case vide du plateau est cliquée
  // Gère le clic sur une case du plateau et toute la logique du tour joueur
  const handleCardPlay = (row, col) => {
    const isOrdreActive = activeRules.includes("Ordre");
    const cardToUse = isOrdreActive ? playerDeck[forcedCardIndex] : selectedCard;

    if (!cardToUse || board[row][col]) return;

    if (isOrdreActive) {
      dispatch(setForcedCardIndex(null));
    } else {
      setSelectedCard(null);
    }

    // Création d'une map { '0-1': 'fire', ... } des cases élémentaires
    const elementMap = Object.fromEntries(
      elementTiles.map(({ row, col, type }) => [`${row}-${col}`, type])
    );

    // Application de la règle Élémentaire (bonus/malus et valeurs modifiées)
    const { card: adjustedCard, mod } = applyElemental(cardToUse, elementMap);

    // Construction finale de la carte à poser sur le plateau
    const cardToPlace = {
      ...adjustedCard,
      owner: 'player',
      row,
      col,
      modifiers: mod === 1 ? 'bonus' : mod === -1 ? 'malus' : null,
    };

    // Placement de la carte sur le plateau et retrait du deck
    dispatch(placeCard({ row, col, card: cardToPlace }));
    dispatch(removeCardFromPlayerDeck(cardToUse.idDex));

    // Application des règles de capture (base + règles spéciales activées)
    const updatedBoard = applyCaptureRules(
      board,
      row,
      col,
      cardToPlace,
      activeRules,
      elementMap
    );

    // Ajout d'un effet visuel temporaire sur les cartes capturées
    logCaptureEvent(row, col, cardToPlace, board, updatedBoard);
    dispatch(setBoard(updatedBoard));

    // Suppression de l'effet flash après un délai
    setTimeout(() => {
      dispatch(setBoard(
        updatedBoard.map(row =>
          row.map(cell => cell ? { ...cell, flash: false } : null)
        )
      ));
    }, 500);

    // Si toutes les cartes ont été jouées, on termine la partie
    if (isGameOver(updatedBoard)) {
      dispatch(endGame());
      resolveEndGame(updatedBoard);
      return;
    }

    // Sinon, on passe au tour de l'adversaire après un petit délai
    setTimeout(() => {
      dispatch(switchTurn());
      setTimeout(() => {
        playEnemyTurn();
      }, 300);
    }, 500);
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

    // Capture uniquement si ce n'est pas déjà dans le Pokédex
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

      // Mise à jour Redux en plus du localStorage
      dispatch(setPlayerDeck(updatedDeck));
    }

    setCaptureConfirmed(true); // dans tous les cas, on passe à l'écran final

    // Sauvegarder juste après une capture confirmée (victoire)
    // -> garantit que le Pokédex et le deck sont persistés (serveur si connecté, sinon localStorage)
    dispatch(saveProgress());
  };

  const restart = async () => {
    // Sauvegarde de sécurité au moment où l'on relance une partie
    // Utile si victoire sans carte à capturer, ou si le joueur ferme rapidement la modale.
    dispatch(saveProgress());

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
    const updated = store.getState().board.grid; // Récupère la copie de l’état avant que l'IA ne joue
    if (!Array.isArray(updated) || !Array.isArray(updated[0])) return;

    const coords = [];
    updated.forEach((r, ri) =>
      r.forEach((cell, ci) => {
        if (!cell) coords.push({ row: ri, col: ci });
      })
    );

    const enemyDeckCurrent = store.getState().enemy.deck;
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

  const handlePlayerMove = (card, index) => {
    if (turn !== 'player') return;
    if (selectedCard?.id === card.id) {
      setSelectedCard(null);
    } else {
      setSelectedCard(card);
    }
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
              <Card
                card={card}
                source="player"
                onClick={() => handlePlayerMove(card, index)}
                selected={selectedCard?.id === card.id}
                className={selectedCard?.id === card.id ? 'selectable' : ''}
                inDeck={true}
                orderMode={activeRules.includes("Ordre")}
                forced={false} //ligne temporaire
                zoomable={false} //ligne temporaire
              />
            </div>
          ))}
        </div>

        <Board board={board} onCellClick={handleCardPlay} elementTiles={elementTiles} />

        <div className="enemy-deck">
          {enemyDeck.map((card, index) => (
            <div key={index} className="card-wrapper">
              {activeRules.includes('Open')}
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
              console.log("Carte choisie pour capture :", captureChoice);
              return (
                <>
                  <h2>Victoire ! Choisissez un Pokémon à capturer :</h2>
                  <div className="capture-choices">
                    {originalEnemyDeck.map((card, index) => {
                      const isAlreadyCaptured = captured.some(c => String(c.idDex) === String(card.idDex));
                      const isSelected = captureChoice?.idDex === card.idDex;

                      return (
                        <div
                          key={index}
                          className={`card-wrapper selectable ${captureChoice?.idDex === card.idDex ? 'selected' : ''} ${isAlreadyCaptured ? 'already-captured' : ''}`}
                          onClick={() => {
                            if (!isAlreadyCaptured) {
                              setCaptureChoice(card);
                            }
                          }}
                          style={{
                            cursor: isAlreadyCaptured ? 'not-allowed' : 'pointer',
                            opacity: isAlreadyCaptured ? 0.5 : 1,
                          }}
                        >
                          <Card
                            card={card}
                            owner="enemy"
                            inDeck={true}
                            selected={isSelected}
                          />
                        </div>
                      );
                    })}
                  </div>

                  <button onClick={confirmCapture} disabled={!captureChoice}>
                    Capturer
                  </button>
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