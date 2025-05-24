import '../styles/Card.css';

const ELEMENT_ICONS = {
  fire: '🔥', water: '💧', grass: '🌿',
  electric: '⚡', ice: '❄️', psychic: '🔮',
  rock: '⛰️', ghost: '👻', bug: '🐞',
  dragon: '🐉', fairy: '✨', dark: '🌑',
  steel: '⚙️', normal: '⭐', poison: '☠️',
  ground: '🌍', flying: '🕊️', fighting: '🥊'
};

export default function Card({ name, image, values, element, owner, isSelected, onBoard }) {
  return (
    <div className={`card ${owner} ${isSelected ? 'selected' : ''} ${onBoard ? 'on-board' : ''}`}>
      <div className="card-name">{name}</div>

      {image ? (
        <img className="card-image" src={image} alt={name} />
      ) : (
        <div className="card-image placeholder">🔲</div>
      )}

      <div className="card-values">
        <span className="value top">{values?.top}</span>
        <span className="value right">{values?.right}</span>
        <span className="value bottom">{values?.bottom}</span>
        <span className="value left">{values?.left}</span>
      </div>

      <div className="card-element">{element}</div>
    </div>
  );
}