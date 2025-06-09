import '../styles/Card.css';
import { getTypeEmoji } from '../utils/translate';

function Card({
  card,
  onClick,
  selected,
  owner,
  inDeck = false,
  faceDown = false,
  zoomable = false,
  bonus = null,
  malus = null,
  element = null,
  flash = false, // 👈 Nouvelle prop pour effet flash
}) {
  if (!card) return null;

  const borderColor = owner === 'player' ? 'blue-border' : 'red-border';
  const bonusClass = bonus ? 'card-bonus' : '';
  const malusClass = malus ? 'card-malus' : '';
  const flashClass = flash ? 'flash-effect' : '';
  const cardClasses = `card ${borderColor} ${selected ? 'selected' : ''} ${zoomable ? 'zoomable' : ''} ${bonusClass} ${malusClass} ${flashClass}`;

  const getTypeIcon = (type) => {
    if (!type) return null;
    const filename = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return `/icons/types/${filename}.svg`;
  };

  const renderValue = (value, side) => {
    const isBonus = bonus === side;
    const isMalus = malus === side;
    const className = `value ${side} ${isBonus ? 'bonus' : ''} ${isMalus ? 'malus' : ''}`;
    return <div className={className}>{value}</div>;
  };

  return (
    <div className={cardClasses} onClick={onClick}>
      {(inDeck && !faceDown && !card.hidden) && (
        <div className="card-name">{card.frenchName || card.name}</div>
      )}

      {(faceDown || card.hidden) ? (
        <div className="card-back-wrapper">
          <img src="/images/card-back.png" alt="Dos de carte" className="card-back-image" />
        </div>
      ) : (
        <>
          {renderValue(card.top, 'top')}
          {renderValue(card.left, 'left')}
          {renderValue(card.right, 'right')}
          {renderValue(card.bottom, 'bottom')}

          <img src={card.image} alt={card.frenchName || card.name} className="card-image" />

          {card.type && (
            <img
              src={getTypeIcon(card.type)}
              alt={card.type}
              className="card-element-icon"
              onError={(e) => {
                const emoji = getTypeEmoji(card.type);
                e.target.replaceWith(Object.assign(document.createElement('span'), {
                  className: 'fallback-emoji',
                  innerText: emoji,
                }));
              }}
            />
          )}

          {element && (
            <img
              src={getTypeIcon(element)}
              alt={element}
              className="card-element-icon"
              onError={(e) => {
                const emoji = getTypeEmoji(element);
                e.target.replaceWith(Object.assign(document.createElement('span'), {
                  className: 'fallback-emoji',
                  innerText: emoji,
                }));
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default Card;