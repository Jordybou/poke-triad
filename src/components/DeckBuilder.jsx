import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerDeck, selectPlayerDeck } from "../redux/slices/playerDeckSlice";
import { fetchFrenchName, getTypeEmoji } from "../utils/translate";
import "../styles/DeckBuilder.css";
import { useNavigate } from "react-router-dom";

const DeckBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const captured = useSelector((state) => state.pokedex.captured);
  const currentDeck = useSelector(selectPlayerDeck);

  const [selected, setSelected] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});

  useEffect(() => {
  // On réinitialise la sélection à partir du deck actuel dès que la page se charge ou que currentDeck change
  if (currentDeck.length === 5) {
    setSelected([...currentDeck]); // 🔁 crée une copie pour déclencher le rendu
  } else {
    setSelected([]); // si le deck est invalide ou incomplet
  }
}, [currentDeck]);

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

    if (captured.length > 0) {
      loadTranslations();
    }
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
    dispatch(setPlayerDeck(selected));
    localStorage.setItem('currentDeck', JSON.stringify(selected));
    alert("Deck mis à jour !");
    navigate("/");
  };

  return (
    <div className="deck-builder">
      <button className="back-button" onClick={() => navigate('/')}>← Retour</button>
      <h1>Créer votre Deck</h1>
      <p>{selected.length}/5 cartes sélectionnées</p>

      <div className="card-grid">
        {captured.map((card) => {
          const isSelected = selected.some((c) => c.id === card.id);
          const translatedName = translatedNames[card.name] || card.name;

          return (
            <div
              key={card.id}
              className={`card-wrapper ${isSelected ? "selected" : ""}`}
              onClick={() => toggleSelect(card)}
            >
              <p className="card-name">{translatedName}</p>
              <div className="card">
                <div className="card-values">
                  <span className="value top">{card.top}</span>
                  <span className="value left">{card.left}</span>
                  <span className="value right">{card.right}</span>
                  <span className="value bottom">{card.bottom}</span>
                </div>
                <img src={card.image} alt={translatedName} />
                <div className="card-type">{getTypeEmoji(card.type)}</div>
              </div>
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