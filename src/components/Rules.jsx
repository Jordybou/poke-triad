import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleRule } from '../redux/slices/rulesSlice';
import { BADGES } from '../utils/badges';
import { useSelector as useReduxSelector } from 'react-redux';

export default function Rules({ setView }) {
  const captured = useReduxSelector(state => state.pokedex.captured);
  const enabledRules = useReduxSelector(state => state.rules.enabledRules);
  const dispatch = useDispatch();

  const unlockedRules = BADGES.filter(badge => captured.length >= badge.threshold);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <button
        onClick={() => setView('home')}
        style={{
          position: 'absolute',
          top: 20,
          left: 20,
          fontSize: '24px',
          background: 'none',
          border: 'none',
          cursor: 'pointer'
        }}
        title="Retour au menu"
      >
        ⬅️
      </button>

      <h2>📜 Règles du jeu</h2>

      <p style={{ marginTop: '10px' }}>
        Activez ou désactivez les règles débloquées grâce à vos badges.
      </p>

      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        {BADGES.map((badge, index) => {
          const unlocked = captured.length >= badge.threshold;
          const isChecked = enabledRules.includes(badge.rule);

          return (
            <div key={index} style={{
              width: '300px',
              padding: '12px',
              backgroundColor: unlocked ? '#f8f8f8' : '#ddd',
              border: '1px solid #aaa',
              borderRadius: '8px',
              opacity: unlocked ? 1 : 0.5,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span>{badge.rule}</span>
              {unlocked ? (
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => dispatch(toggleRule(badge.rule))}
                />
              ) : (
                <span style={{ fontSize: '20px' }}>🔒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
