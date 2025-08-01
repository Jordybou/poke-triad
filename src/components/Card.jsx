import '../styles/Card.css';
import { getTypeEmoji } from '../utils/translate';

/* Composant d'affichage d'une carte Pokémon (plateau ou deck)
Props :
- card : données de la carte (nom, image, type, valeurs...)
- onClick : fonction déclenchée au clic
- selected : indique si la carte est sélectionnée (effet visuel)
- owner : 'player' ou 'enemy' (définit la couleur de la bordure)
- inDeck : si la carte est affichée dans un deck
- faceDown : si la carte doit être affichée face cachée (image de dos)
- zoomable : effet de zoom (utilisé dans le Pokédex)
- element : type élémentaire de la case (si actif)
- flash : effet visuel lors d’un changement de camp 
- className : récupère via Game.jsx
*/
function Card({
  card,
  onClick,
  selected,
  owner,
  inDeck = false,
  faceDown = false,
  zoomable = false,
  element = null,
  flash = false,
  className = '',
}) {
  // Si aucune carte n’est fournie, ne rien afficher
  if (!card) return null;

  const borderColor = owner === 'player' ? 'blue-border' : 'red-border';
  const flashClass = flash ? 'flash-effect' : '';
  const contextClass = inDeck ? 'in-deck' : 'in-board';

  const cardClasses = `card ${contextClass} ${borderColor} ${selected ? 'selected' : ''} ${zoomable ? 'zoomable' : ''} ${flashClass} ${className}`;

  const getTypeIcon = (type) => {
    if (!type) return null;
    const filename = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return `/icons/types/${filename}.svg`;
  };
  // Affiche la valeur d’un côté de la carte (top, bottom, left, right)
  // Applique une couleur si la carte est affectée par un bonus ou un malus
  const renderValue = (side) => {
    if (!card.values || !card.values[side]) return null;

    const value = card.values[side];
    const isBonus = card.modifiers === 'bonus';
    const isMalus = card.modifiers === 'malus';

    const className = `value ${side} ${isBonus ? 'bonus' : isMalus ? 'malus' : ''
      }`;

    return <div className={className}>{value}</div>;
  };
  // Rendu visuel principal de la carte
  return (
    <div className={`card-wrapper ${selected ? 'selectable' : ''}`}>
      {inDeck && !faceDown && !card.hidden && (
        <div className="card-name">{card.frenchName || card.name}</div>
      )}

      <div
        className={cardClasses}
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
      >
        {(faceDown || card.hidden) ? (
          <div className="card-back-wrapper">
            <img src="/images/card-back.png" alt="Dos de carte" className="card-back-image" />
          </div>
        ) : (
          <>
            {renderValue('top')}
            {renderValue('left')}
            {renderValue('right')}
            {renderValue('bottom')}

            <div className="card-middle">
              <img
                src={card.image}
                alt={card.frenchName || card.name}
                className="card-image"
              />

              {(card.type || element) && (
                <img
                  src={getTypeIcon(element || card.type)}
                  alt={element || card.type}
                  className="card-element-icon"
                  onError={(e) => {
                    const emoji = getTypeEmoji(element || card.type);
                    const span = document.createElement('span');
                    span.className = 'fallback-emoji';
                    span.innerText = emoji;
                    e.target.replaceWith(span);
                  }}
                />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Card;