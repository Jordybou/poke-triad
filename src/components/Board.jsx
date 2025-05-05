import React from 'react';
import './Board.css';

export default function Board({ board, onCellClick }) {
  return (
    <div className="board-container">
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell, colIndex) => (
            <div
              className="board-cell"
              key={colIndex}
              onClick={() => onCellClick(rowIndex, colIndex)}
            >
              {/* Cellule vide ou carte ici */}
              {cell ? <div className="card-placeholder">🃏</div> : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}