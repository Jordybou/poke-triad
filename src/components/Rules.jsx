import { useDispatch, useSelector } from 'react-redux';
import { toggleRule } from '../redux/slices/rulesSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Rules.css';

const ruleData = {
  Mur: {
    label: 'Mur',
    icon: '🧱',
    description: "Il n'y a pas de bord : une carte peut capturer en regardant au-delà du plateau.",
  },
  Plus: {
    label: 'Plus',
    icon: '➕',
    description: "Capture si deux additions de valeurs adjacentes sont identiques.",
  },
  Combo: {
    label: 'Combo',
    icon: '🔁',
    description: "Une capture déclenche une réaction en chaîne.",
  },
  Identique: {
    label: 'Identique',
    icon: '🔗',
    description: "Capture si deux valeurs adjacentes sont égales.",
  },
  Open: {
    label: 'Open',
    icon: '👁️',
    description: "Deck visible par tous.",
  },
  Ordre: {
    label: 'Ordre',
    icon: '📜',
    description: "Les cartes doivent être jouées dans l'ordre.",
  },
  Elémentaire: {
    label: 'Élémentaire',
    icon: '🌿',
    description: "Bonus/malus si la carte correspond ou non à l'élément de la case.",
  },
  Chaos: {
    label: 'Chaos',
    icon: '🎲',
    description: "La carte jouée est choisie aléatoirement dans votre main.",
  },
};

const Rules = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const rules = useSelector((state) => state.rules);
  const unlockedRules = rules?.unlockedRules || [];
  const activeRules = rules?.activeRules || [];

  const handleToggle = (rule) => {
    dispatch(toggleRule(rule));
  };

  return (
    <div className="rules-container">
      <h2>Règles débloquées</h2>
      <div className="rules-list">
        {Object.entries(ruleData).map(([key, data]) => {
          const isUnlocked = unlockedRules.includes(key);
          const isActive = activeRules.includes(key);

          return (
            <div
              key={key}
              className={`rule-card ${isUnlocked ? '' : 'locked'}`}
              onClick={() => isUnlocked && handleToggle(key)}
            >
              <h3>
                {data.icon} {data.label}
              </h3>
              <p>{data.description}</p>
              {isUnlocked && (
                <input type="checkbox" checked={isActive} readOnly />
              )}
              {!isUnlocked && <div className="lock">🔒</div>}
            </div>
          );
        })}
      </div>
      <button onClick={() => navigate('/')}>Retour au menu</button>
    </div>
  );
};

export default Rules;