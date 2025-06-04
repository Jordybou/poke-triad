import { useEffect, useState } from "react";
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
      for (const card of captured) {
        if (!translatedNames[card.name]) {
          const frName = await fetchFrenchName(card.name);
          newTranslations[card.name] = frName;
        }
      }
      setTranslatedNames((prev) => ({ ...prev, ...newTranslations }));
    };
    loadTranslations();
  }, [captured]);

  const toggleSelect = (card) => {
    const isSelected = selected.some((c) => c.id === card.id);
    if (isSelected) {
      setSelected(selected.filter((c) => c.id !== card.id));
    } else if (selected.length < 5) {
      setSelected([...selected, card]);
    }
  };

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

      <label>Nom du deck :</label>
      <input
        type="text"
        value={deckName}
        onChange={(e) => setDeckName(e.target.value)}
        placeholder="Nom de votre deck"
      />

      <p>{selected.length}/5 cartes sélectionnées</p>

      <div className="card-grid">
        {captured.map((card, index) => {
          const isSelected = selected.some((c) => c.id === card.id);
          const translatedName = translatedNames[card.name] || card.name;
          return (
            <div
              key={index}
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