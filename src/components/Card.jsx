import React from 'react';
import './Card.css';

const ELEMENT_ICONS = {
  grass: '🌿',
  fire: '🔥',
  water: '💧',
  electric: '⚡',
  bug: '🐞',
  normal: '⭐',
  poison: '☠️',
  ground: '🌍',
  rock: '⛰️',
  psychic: '🔮',
  ice: '❄️',
  dragon: '🐉',
  ghost: '👻',
  fighting: '🥊',
  flying: '🕊️',
  dark: '🌑',
  steel: '⚙️',
  fairy: '✨',
};

export default function Card({ name, image, element, values, owner = "player", onBoard = false, isSelected = false }) {
  const borderClass = onBoard
    ? owner === "enemy"
      ? "cell-enemy"
      : "cell-player"
    : owner === "enemy"
      ? "card-enemy"
      : "card-player";

  const boardClass = onBoard ? "card-on-board" : "";

  return (
    <div className={`card-wrapper ${onBoard ? "on-board" : ""} ${isSelected ? "selected" : ""} ${borderClass}`}>
      {!onBoard && <div className="card-name">{name}</div>}
      <div className={`card ${boardClass}`}>
        <div className="card-values">
          <div className="top">{values.top}</div>
          <div className="left">{values.left}</div>
          <div className="right">{values.right}</div>
          <div className="bottom">{values.bottom}</div>
        </div>
        <img className="card-image" src={image} alt={name} />
        <div className="card-element">{ELEMENT_ICONS[element] || '?'}</div>
      </div>
    </div>
  );
}