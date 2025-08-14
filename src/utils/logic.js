import { weaknesses } from "./constants";

// --- Constantes de direction ---
const directions = [
  { dr: -1, dc: 0, side: 'top', opposite: 'bottom' },
  { dr: 1, dc: 0, side: 'bottom', opposite: 'top' },
  { dr: 0, dc: -1, side: 'left', opposite: 'right' },
  { dr: 0, dc: 1, side: 'right', opposite: 'left' },
];

function logCaptureEvent(type, attacker, defender, reason) {
  console.log(`🎯 Capture [${type}] : ${attacker.name} a capturé ${defender.name} (${reason})`);
}

function captureCardAt(row, col, card, newBoard, comboQueue = null, reason = 'classic') {
  const target = newBoard[row][col];
  if (target && target.owner !== card.owner) {
    newBoard[row][col] = { ...target, owner: card.owner, flash: true };
    if (comboQueue) comboQueue.push({ row, col, card: newBoard[row][col] });
    logCaptureEvent(reason, card, target, reason);
  }
}

function applyClassicCapture(board, row, col, card, newBoard) {
  directions.forEach(({ dr, dc, side, opposite }) => {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const adjCard = newBoard[nr][nc];
      if (adjCard && adjCard.owner !== card.owner && card.values[side] > adjCard.values[opposite]) {
        captureCardAt(nr, nc, card, newBoard, null, 'classic');
      }
    }
  });
}

function applyIdentique(board, row, col, card, newBoard, isCombo, comboQueue) {
  const matched = [];
  directions.forEach(({ dr, dc, side, opposite }) => {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const adjCard = newBoard[nr][nc];
      if (adjCard && adjCard.owner !== card.owner && card.values[side] === adjCard.values[opposite]) {
        matched.push({ row: nr, col: nc });
      }
    }
  });
  if (matched.length >= 2) {
    matched.forEach(({ row, col }) => captureCardAt(row, col, card, newBoard, comboQueue, 'identique'));
  }
}

function applyPlus(board, row, col, card, newBoard, isCombo, comboQueue) {
  const sums = {};
  directions.forEach(({ dr, dc, side, opposite }) => {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const adjCard = newBoard[nr][nc];
      if (adjCard && adjCard.owner !== card.owner) {
        const sum = card.values[side] + adjCard.values[opposite];
        if (!sums[sum]) sums[sum] = [];
        sums[sum].push({ row: nr, col: nc });
      }
    }
  });
  Object.values(sums).forEach(matches => {
    if (matches.length >= 2) {
      matches.forEach(({ row, col }) => captureCardAt(row, col, card, newBoard, comboQueue, 'plus'));
    }
  });
}

function applyWall(board, row, col, card, newBoard) {
  directions.forEach(({ dr, dc, side, opposite }) => {
    const nr = row + dr, nc = col + dc;
    if (nr < 0 || nr >= 3 || nc < 0 || nc >= 3) {
      const wallValue = 10;
      const adjCard = board[row + dr]?.[col + dc];
      if (adjCard && adjCard.owner !== card.owner && wallValue > adjCard.values[opposite]) {
        captureCardAt(row + dr, col + dc, card, newBoard, null, 'mur');
      }
    }
  });
}

function applyCombo(board, comboQueue, newBoard) {
  while (comboQueue.length) {
    const { row, col, card } = comboQueue.shift();
    directions.forEach(({ dr, dc, side, opposite }) => {
      const nr = row + dr, nc = col + dc;
      if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
        const adjCard = newBoard[nr][nc];
        if (adjCard && adjCard.owner !== card.owner && card.values[side] > adjCard.values[opposite]) {
          captureCardAt(nr, nc, card, newBoard, null, 'combo');
        }
      }
    });
  }
}

function applyElemental(card, elementMap) {
  const key = `${card.row}-${card.col}`;
  const tileType = elementMap[key];
  if (!tileType || !card?.type) return { card, mod: 0 };

  let mod = 0;
  if (card.type === tileType) {
    mod = 1;
  } else if (
    weaknesses[card.type] &&
    weaknesses[card.type].includes(tileType)
  ) {
    mod = -1;
  }

  const adjusted = JSON.parse(JSON.stringify(card)); // copie profonde
  adjusted.elementMod = mod;
  adjusted.values = Object.fromEntries(
    Object.entries(adjusted.values).map(([dir, val]) => [dir, Math.max(1, val + mod)])
  );
  return { card: adjusted, mod };
}

function applyCaptureRules(board, row, col, placedCard, activeRules, positionElements = {}) {
  const rulesSet = new Set(activeRules.map(r => r.trim().toLowerCase()));
  const isIdentique = rulesSet.has('identique');
  const isMur = rulesSet.has('mur');
  const isPlus = rulesSet.has('plus');
  const isCombo = rulesSet.has('combo');
  const isElemental = rulesSet.has('élémentaire');

  const newBoard = board.map(row => [...row]);
  const comboQueue = [];

  let card = {
    name: placedCard.name,
    frenchName: placedCard.frenchName,
    image: placedCard.image,
    type: placedCard.type,
    values: { ...placedCard.values },
    owner: placedCard.owner,
    flash: false,
    row,
    col
  };
  if (isElemental) {
    const result = applyElemental(card, positionElements);
    card = result.card;
  }

  newBoard[row][col] = card;
  applyClassicCapture(board, row, col, card, newBoard);
  if (isIdentique) applyIdentique(board, row, col, card, newBoard, isCombo, comboQueue);
  if (isPlus) applyPlus(board, row, col, card, newBoard, isCombo, comboQueue);
  if (isMur) applyWall(board, row, col, card, newBoard);
  if (isCombo) applyCombo(board, comboQueue, newBoard);

  return newBoard;
}

function isGameOver(board) {
  return board.flat().filter(Boolean).length === 9;
}

/*function generatePlayerOrder(deck) {
  // Crée une copie du deck pour ne pas modifier l'original
  const deckCopy = [...deck];

  // Mélange aléatoirement les cartes (algorithme de Fisher-Yates)
  for (let i = deckCopy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deckCopy[i], deckCopy[j]] = [deckCopy[j], deckCopy[i]];
  }

  // Retourne un tableau contenant les identifiants (nom ou index) des cartes dans l'ordre tiré
  return deckCopy.map((card) => card.id || card.name || card.frenchName);
}*/

function getForcedCardIndex(deck) {
  if (!deck || deck.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * deck.length);
  return randomIndex;
}

export {
  applyCaptureRules,
  isGameOver,
  logCaptureEvent,
  applyElemental,
  /*generatePlayerOrder,*/
  getForcedCardIndex
};