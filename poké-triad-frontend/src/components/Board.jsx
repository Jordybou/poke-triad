import Card from './Card';
import '../styles/Board.css';
import { getTypeEmoji } from '../utils/translate';
import { weaknesses } from '../utils/constants';

// Icône du type
const getTypeIcon = (type) => {
  if (!type) return null;
  const filename = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return `/icons/types/${filename}.svg`;
};

export default function Board({ board, onCellClick, elementTiles = [] }) {
  const isElementTile = (row, col) =>
    elementTiles.some(tile => tile.row === row && tile.col === col);

  const getElementType = (row, col) => {
    const tile = elementTiles.find(tile => tile.row === row && tile.col === col);
    return tile?.type || null;
  };

  return (
    <div className="board-container">
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const isElement = isElementTile(rowIndex, colIndex);
            const elementType = getElementType(rowIndex, colIndex);

            let bonusSide = null;
            let malusSide = null;

            if (cell && elementType && cell.type) {
              if (cell.type === elementType) {
                // Bonus : on prend tous les côtés (tu peux adapter si nécessaire)
                bonusSide = 'all';
              } else if (weaknesses[cell.type]?.includes(elementType)) {
                malusSide = 'all';
              }
            }

            return (
              <div
                key={colIndex}
                className={`board-cell 
                  ${isElement ? 'element-cell' : ''} 
                  ${cell?.owner === 'player' ? 'owned-player' : ''} 
                  ${cell?.owner === 'enemy' ? 'owned-enemy' : ''}`}
                onClick={() => onCellClick(rowIndex, colIndex)}
              >
                {cell ? (
                  <Card
                    card={cell}
                    owner={cell.owner}
                    inDeck={false}
                    faceDown={false}
                    zoomable={false}
                    bonus={bonusSide}
                    malus={malusSide}
                    element={elementType}
                    flash={cell.flash}
                  />
                ) : isElement ? (
                  <img
                    src={getTypeIcon(elementType)}
                    alt={elementType}
                    title={elementType}
                    className="element-icon"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.className = 'board-fallback-emoji';
                      fallback.innerText = getTypeEmoji(elementType);
                      e.target.parentNode.appendChild(fallback);
                    }}
                  />
                ) : null}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}