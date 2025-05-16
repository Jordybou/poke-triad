export const checkCapture = (board, row, col, placedCard, activeRules) => {
    const isIdentiqueActive = activeRules.includes('Identique');
    const isMurActive = activeRules.includes('Mur');
    const isPlusActive = activeRules.includes('Plus');
    const isComboActive = activeRules.includes('Combo');

    const matchedSameValues = [];
    const newBoard = board.map(row => [...row]);

    const directions = [
        { dr: -1, dc: 0, side: 'top', opposite: 'bottom' },
        { dr: 1, dc: 0, side: 'bottom', opposite: 'top' },
        { dr: 0, dc: -1, side: 'left', opposite: 'right' },
        { dr: 0, dc: 1, side: 'right', opposite: 'left' },
    ];

    const comboQueue = [];

    if (isPlusActive) {
        const sums = {};
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
                    const sum = placedCard.values[side] + adjacentCard.values[opposite];
                    if (!sums[sum]) sums[sum] = [];
                    sums[sum].push({ row: newRow, col: newCol });
                }
            }
        });

        Object.values(sums).forEach(matches => {
            if (matches.length >= 2) {
                matches.forEach(({ row, col }) => {
                    const targetCard = newBoard[row][col];
                    if (targetCard.owner !== placedCard.owner) {
                        newBoard[row][col] = { ...targetCard, owner: placedCard.owner };
                        if (isComboActive) {
                            comboQueue.push({ row, col, card: newBoard[row][col] });
                        }
                    }
                });
            }
        });
    }

    directions.forEach(({ dr, dc, side, opposite }) => {
        const newRow = row + dr;
        const newCol = col + dc;

        if (
            newRow >= 0 && newRow < 3 &&
            newCol >= 0 && newCol < 3 &&
            newBoard[newRow][newCol]
        ) {
            const adjacentCard = newBoard[newRow][newCol];
            const placedValue = placedCard.values[side];
            const adjacentValue = adjacentCard.values[opposite];

            if (adjacentCard.owner !== placedCard.owner) {
                if (placedValue > adjacentValue) {
                    newBoard[newRow][newCol] = {
                        ...adjacentCard,
                        owner: placedCard.owner
                    };
                }

                if (placedValue === adjacentValue && isIdentiqueActive) {
                    matchedSameValues.push({ row: newRow, col: newCol });
                }
            }
        }
    });

    if (isIdentiqueActive && matchedSameValues.length >= 2) {
        matchedSameValues.forEach(({ row, col }) => {
            const targetCard = newBoard[row][col];
            if (targetCard.owner !== placedCard.owner) {
                newBoard[row][col] = {
                    ...targetCard,
                    owner: placedCard.owner
                };
                if (isComboActive) {
                    comboQueue.push({ row, col, card: newBoard[row][col] });
                }
            }
        });
    }

    if (isMurActive) {
        if (col === 0 && newBoard[row][2]) {
            const targetCard = newBoard[row][2];
            if (targetCard.owner !== placedCard.owner) {
                const left = placedCard.values.left;
                const right = targetCard.values.right;
                if (left > right) {
                    newBoard[row][2] = { ...targetCard, owner: placedCard.owner };
                }
            }
        } else if (col === 2 && newBoard[row][0]) {
            const targetCard = newBoard[row][0];
            if (targetCard.owner !== placedCard.owner) {
                const right = placedCard.values.right;
                const left = targetCard.values.left;
                if (right > left) {
                    newBoard[row][0] = { ...targetCard, owner: placedCard.owner };
                }
            }
        }

        if (row === 0 && newBoard[2][col]) {
            const targetCard = newBoard[2][col];
            if (targetCard.owner !== placedCard.owner) {
                const top = placedCard.values.top;
                const bottom = targetCard.values.bottom;
                if (top > bottom) {
                    newBoard[2][col] = { ...targetCard, owner: placedCard.owner };
                }
            }
        } else if (row === 2 && newBoard[0][col]) {
            const targetCard = newBoard[0][col];
            if (targetCard.owner !== placedCard.owner) {
                const bottom = placedCard.values.bottom;
                const top = targetCard.values.top;
                if (bottom > top) {
                    newBoard[0][col] = { ...targetCard, owner: placedCard.owner };
                }
            }
        }
    }

    while (comboQueue.length) {
        const { row: comboRow, col: comboCol, card } = comboQueue.shift();
        directions.forEach(({ dr, dc, side, opposite }) => {
            const newRow = comboRow + dr;
            const newCol = comboCol + dc;

            if (
                newRow >= 0 && newRow < 3 &&
                newCol >= 0 && newCol < 3 &&
                newBoard[newRow][newCol]
            ) {
                const adjacentCard = newBoard[newRow][newCol];
                const placedValue = card.values[side];
                const adjacentValue = adjacentCard.values[opposite];

                if (adjacentCard.owner !== card.owner && placedValue > adjacentValue) {
                    newBoard[newRow][newCol] = {
                        ...adjacentCard,
                        owner: card.owner
                    };
                }
            }
        });
    }

    return newBoard;
};
