export default function Rules({ setView }) {
  return (
    <div>
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
      <h1>Bienvenue dans Rules</h1>
    </div>
  );
}
