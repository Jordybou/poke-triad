import Card from './Card';
import '../styles/Board.css';
import { getTypeEmoji } from '../utils/translate';

// Renvoie le chemin vers l'icône SVG d’un type donné
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

  console.log('🎯 BOARD RENDER', board);

  return (
    <div className="board-container">
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => {
            const isElement = isElementTile(rowIndex, colIndex);
            const type = getElementType(rowIndex, colIndex);

            return (
              <div
                className={`board-cell 
                ${isElement ? 'element-cell' : ''} 
                ${cell?.owner === 'player' ? 'owned-player' : ''} 
                ${cell?.owner === 'enemy' ? 'owned-enemy' : ''}`}
                key={colIndex}
                onClick={() => onCellClick(rowIndex, colIndex)}
              >
                {cell ? (
                  <Card
                    card={cell}
                    owner={cell.owner}
                    inDeck={false}
                    faceDown={false}
                    zoomable={false}
                    bonus={cell.bonus}
                    malus={cell.malus}
                    element={type}
                    flash={cell.flash}
                  />
                ) : isElement ? (
                  <img
                    src={getTypeIcon(type)}
                    alt={type}
                    title={type}
                    className="element-icon"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const fallback = document.createElement('span');
                      fallback.className = 'element-emoji-fallback';
                      fallback.innerText = getTypeEmoji(type);
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
