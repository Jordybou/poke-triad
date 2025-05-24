
import { useSelector, useDispatch } from 'react-redux';
import { toggleRule } from '../redux/slices/rulesSlice';
import { ALL_RULES } from '../utils/rulesList';
import '../styles/Rules.css';

export default function Rules({ setView }) {
  const enabledRules = useSelector(state => state.rules.enabledRules);
  const unlockedRules = useSelector(state => state.rules.unlockedRules);
  const dispatch = useDispatch();

  const handleToggle = (rule) => {
    dispatch(toggleRule(rule));
  };

  return (
    <div className="rules-container">
      <div className="rules-header">
        <button className="rules-return" onClick={() => setView('home')}>⬅️</button>
        <h1>📜 Règles Spéciales</h1>
      </div>

      <p>Activez ou découvrez les règles débloquées au fil des captures :</p>

      <ul className="rules-list">
        {ALL_RULES.map((rule, index) => {
          const unlocked = unlockedRules.includes(rule);
          const enabled = enabledRules.includes(rule);

          return (
            <li key={index} className="rule-item">
              <label>
                {unlocked ? (
                  <input
                    type="checkbox"
                    checked={enabled}
                    onChange={() => handleToggle(rule)}
                  />
                ) : (
                  <span role="img" aria-label="lock">🔒</span>
                )}
                {rule}
              </label>
            </li>
          );
        })}
      </ul>
    </div>
  );
}