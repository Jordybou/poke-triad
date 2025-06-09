// --- Constantes de direction ---
const directions = [
  { dr: -1, dc: 0, side: 'top', opposite: 'bottom' },
  { dr: 1, dc: 0, side: 'bottom', opposite: 'top' },
  { dr: 0, dc: -1, side: 'left', opposite: 'right' },
  { dr: 0, dc: 1, side: 'right', opposite: 'left' },
];

// --- Weaknesses by type (English, aligned with PokéAPI) ---
const weaknesses = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  grass: ['fire', 'ice', 'flying', 'bug'],
  electric: ['ground'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'fairy', 'dragon'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['steel', 'poison'],
};

function applyClassicCapture(board, row, col, card, newBoard) {
  directions.forEach(({ dr, dc, side, opposite }) => {
    const nr = row + dr, nc = col + dc;
    if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3) {
      const adjCard = newBoard[nr][nc];
      if (adjCard && adjCard.owner !== card.owner) {
        if (card.values[side] > adjCard.values[opposite]) {
          newBoard[nr][nc] = { ...adjCard, owner: card.owner, flash: true };
        }
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
    matched.forEach(({ row, col }) => {
      newBoard[row][col] = { ...newBoard[row][col], owner: card.owner, flash: true };
      if (isCombo) comboQueue.push({ row, col, card: newBoard[row][col] });
    });
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
      matches.forEach(({ row, col }) => {
        newBoard[row][col] = { ...newBoard[row][col], owner: card.owner, flash: true };
        if (isCombo) comboQueue.push({ row, col, card: newBoard[row][col] });
      });
    }
  });
}

function applyWall(board, row, col, card, newBoard) {
  const edges = [
    { check: col === 0, rowOffset: 0, colOffset: 2, side: 'left', opposite: 'right' },
    { check: col === 2, rowOffset: 0, colOffset: -2, side: 'right', opposite: 'left' },
    { check: row === 0, rowOffset: 2, colOffset: 0, side: 'top', opposite: 'bottom' },
    { check: row === 2, rowOffset: -2, colOffset: 0, side: 'bottom', opposite: 'top' },
  ];

  edges.forEach(({ check, rowOffset, colOffset, side, opposite }) => {
    if (check) {
      const r2 = row + rowOffset, c2 = col + colOffset;
      if (r2 >= 0 && r2 < 3 && c2 >= 0 && c2 < 3) {
        const target = newBoard[r2][c2];
        if (target && target.owner !== card.owner && card.values[side] > target.values[opposite]) {
          newBoard[r2][c2] = { ...target, owner: card.owner, flash: true };
        }
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
          newBoard[nr][nc] = { ...adjCard, owner: card.owner, flash: true };
        }
      }
    });
  }
}

function applyElemental(card, elementMap) {
  const key = `${card.row}-${card.col}`;
  const tileType = elementMap[key];
  if (!tileType) return card;

  let mod = 0;
  if (card.type === tileType) mod = 1;
  else if (weaknesses[card.type]?.includes(tileType)) mod = -1;

  const adjusted = { ...card, values: { ...card.values } };
  for (let key in adjusted.values) {
    adjusted.values[key] = Math.max(1, adjusted.values[key] + mod);
  }
  return adjusted;
}

export function applyCaptureRules(board, row, col, placedCard, activeRules, positionElements = {}) {
  const rulesSet = new Set(activeRules.map(r => r.trim().toLowerCase()));
  const isIdentique = rulesSet.has('identique');
  const isMur = rulesSet.has('mur');
  const isPlus = rulesSet.has('plus');
  const isCombo = rulesSet.has('combo');
  const isElemental = rulesSet.has('élémentaire');

  const newBoard = board.map(row => [...row]);
  const comboQueue = [];

  let card = { ...placedCard, row, col };
  if (isElemental) {
    card = applyElemental(card, positionElements);
  }

  newBoard[row][col] = card; // Place la carte jouée
  applyClassicCapture(board, row, col, card, newBoard);
  if (isIdentique) applyIdentique(board, row, col, card, newBoard, isCombo, comboQueue);
  if (isPlus) applyPlus(board, row, col, card, newBoard, isCombo, comboQueue);
  if (isMur) applyWall(board, row, col, card, newBoard);
  if (isCombo) applyCombo(board, comboQueue, newBoard);

  return newBoard;
}

export function isGameOver(board) {
  return board.flat().filter(Boolean).length === 9;
}