const Quit = () => {
  const handleQuit = () => {
    window.close(); // Peut ne pas fonctionner selon le navigateur
    window.location.href = "about:blank"; // Alternative de redirection
  };

  return (
    <div className="quit-page">
      <h1>Quitter Poké-Triad</h1>
      <p>Êtes-vous sûr de vouloir quitter le jeu ?</p>
      <button onClick={handleQuit}>Quitter</button>
    </div>
  );
};

export default Quit;