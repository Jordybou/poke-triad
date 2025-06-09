import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addDeck } from "../redux/slices/playerDeckSlice";
import { fetchFrenchName } from "../utils/translate";
import "../styles/DeckBuilder.css";
import { useNavigate } from "react-router-dom";

const DeckBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const captured = useSelector((state) => state.pokedex.captured);

  const [selected, setSelected] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});
  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    const loadTranslations = async () => {
      const newTranslations = {};
      const uncached = captured.filter(card => !translatedNames[card.name]);

      await Promise.all(uncached.map(async (card) => {
        const frName = await fetchFrenchName(card.name);
        newTranslations[card.name] = frName;
      }));

      if (Object.keys(newTranslations).length > 0) {
        setTranslatedNames(prev => ({ ...prev, ...newTranslations }));
      }
    };

    loadTranslations();
  }, [captured]);

  const toggleSelect = useCallback((card) => {
    setSelected((prevSelected) => {
      const isSelected = prevSelected.some((c) => c.id === card.id);
      if (isSelected) {
        return prevSelected.filter((c) => c.id !== card.id);
      } else if (prevSelected.length < 5) {
        return [...prevSelected, card];
      }
      return prevSelected;
    });
  }, []);

  const handleValidateDeck = () => {
    if (selected.length !== 5) {
      alert("Veuillez sélectionner exactement 5 cartes.");
      return;
    }

    if (!deckName.trim()) {
      alert("Veuillez donner un nom à votre deck.");
      return;
    }

    dispatch(addDeck({ name: deckName.trim(), cards: selected }));
    alert("Deck créé !");
    navigate("/decks");
  };

  return (
    <div className="deck-builder">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>Créer un Deck</h1>

      <label htmlFor="deck-name">Nom du deck :</label>
      <input
        id="deck-name"
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Nom de votre deck"
      />

      <p>{selected.length}/5 cartes sélectionnées</p>

      <div className="card-grid">
        {captured.map((card) => {
          const isSelected = selected.some((c) => c.id === card.id);
          const translatedName = translatedNames[card.name] || card.name;

          return (
            <div
              key={card.id}
              className={`card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSelect(card)}
            >
              <img src={card.image} alt={translatedName} />
              <p>{translatedName}</p>
            </div>
          );
        })}
      </div>

      <button onClick={handleValidateDeck} className="validate-btn">
        Valider le deck
      </button>
    </div>
  );
};

export default DeckBuilder;