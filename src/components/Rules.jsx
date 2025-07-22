import { useDispatch, useSelector } from 'react-redux';
import { toggleRule, unlockRule } from '../redux/slices/rulesSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/Rules.css';

const thresholds = [
  { rule: 'Ordre', value: 18, badge: '/badges/badge-1.png' },
  { rule: 'Élémentaire', value: 36, badge: '/badges/badge-2.png' },
  { rule: 'Open', value: 54, badge: '/badges/badge-3.png' },
  { rule: 'Combo', value: 72, badge: '/badges/badge-4.png' },
  { rule: 'Plus', value: 90, badge: '/badges/badge-5.png' },
  { rule: 'Identique', value: 108, badge: '/badges/badge-6.png' },
  { rule: 'Mur', value: 126, badge: '/badges/badge-7.png' },
  { rule: 'Chaos', value: 144, badge: '/badges/badge-8.png' },
];

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
  Élémentaire: {
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
  const capturedCount = useSelector((state) => state.pokedex.captured.length);
  const unlockedRules = rules?.unlockedRules || [];
  const activeRules = rules?.activeRules || [];

  const [modalRule, setModalRule] = useState(null);

  useEffect(() => {
    thresholds.forEach(({ rule, value }) => {
      if (capturedCount >= value) {
        dispatch(unlockRule(rule));
      }
    });
  }, [capturedCount, dispatch]);

  const handleToggle = (rule) => {
    dispatch(toggleRule(rule));
  };

  return (
    <div className="rules-container">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h2>Règles débloquées</h2>

      <div className="rules-grid">
        {thresholds.map(({ rule, value, badge }) => {
          const data = ruleData[rule];
          if (!data) return null;

          const isUnlocked = unlockedRules.includes(rule);
          const isActive = activeRules.includes(rule);
          const progress = `${Math.min(capturedCount, value)}/${value}`;

          return (
            <div key={rule} className={`rule-box ${isUnlocked ? 'unlocked' : 'locked'}`}>
              <div className="rule-progress">
                {isUnlocked ? (
                  <img src={badge} alt="badge" className="rule-badge-img" />
                ) : (
                  <span className="rule-counter">{progress}</span>
                )}
              </div>

              <div className="rule-icon">{data.icon}</div>
              <div className="rule-name">{data.label}</div>

              <div className="rule-controls">
                {isUnlocked ? (
                  <label className="rule-toggle">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={() => handleToggle(rule)}
                    />
                    Activée
                  </label>
                ) : (
                  <div className="lock-icon">🔒</div>
                )}
                <button className="info-button" onClick={() => setModalRule(data)}>…</button>
              </div>
            </div>
          );
        })}
      </div>

      {modalRule && (
        <div className="modal-overlay" onClick={() => setModalRule(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{modalRule.icon} {modalRule.label}</h3>
            <p>{modalRule.description}</p>
            <button onClick={() => setModalRule(null)}>Fermer</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rules;