import { useDispatch, useSelector } from 'react-redux';
import { toggleRule } from '../redux/slices/rulesSlice';
import { useNavigate } from 'react-router-dom';
import '../styles/Rules.css';

const ruleData = {
  mur: {
    label: 'Mur',
    icon: '🧱',
    description: "Il n'y a pas de bord : une carte peut capturer en regardant au-delà du plateau (ex: la case 0 regarde la 2).",
  },
  plus: {
    label: 'Plus',
    icon: '➕',
    description: "Capture si deux additions de valeurs adjacentes sont identiques.",
  },
  combo: {
    label: 'Combo',
    icon: '🔁',
    description: "Une capture déclenche une réaction en chaîne.",
  },
  même: {
    label: 'Même',
    icon: '🔗',
    description: "Capture si deux valeurs adjacentes sont égales.",
  },
  aléatoire: {
    label: 'Aléatoire',
    icon: '🎲',
    description: "Deck composé de cartes aléatoires.",
  },
  ordre: {
    label: 'Ordre',
    icon: '📜',
    description: "Les cartes doivent être jouées dans l'ordre.",
  },
  chaos: {
    label: 'Chaos',
    icon: '💥',
    description: "Une carte aléatoire est jouée à chaque tour.",
  },
  ascension: {
    label: 'Ascension',
    icon: '📈',
    description: "Bonus de +1 aux cartes du même type déjà posées.",
  },
};

export default function Rules() {
  const rules = useSelector((state) => state.rules);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="rules-container">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>Règles Spéciales</h1>
      <div className="rules-grid">
        {rules.map((rule) => {
          const { name, active, unlocked } = rule;
          const data = ruleData[name] || {};
          return (
            <div
              key={name}
              className={`rule-box ${unlocked ? 'unlocked' : 'locked'}`}
              title={unlocked ? data.description : 'Règle verrouillée'}
            >
              <div className="rule-icon">{data.icon || '❓'}</div>
              <div className="rule-name">{data.label || name}</div>
              {unlocked ? (
                <>
                  <p className="rule-description">{data.description}</p>
                  <label className="rule-toggle">
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => dispatch(toggleRule(name))}
                    />
                    Activée
                  </label>
                </>
              ) : (
                <div className="lock-icon">🔒</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}