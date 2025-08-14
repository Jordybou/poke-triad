import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPlayerDeck, selectPlayerDeck } from "../redux/slices/playerDeckSlice";
import { fetchFrenchName, getTypeEmoji } from "../utils/translate";
import "../styles/DeckBuilder.css";
import { useNavigate, useLocation } from "react-router-dom";

// 🔁 Utilitaire global pour normaliser les idDex (ex: "25-waz" -> 25)
const normalizeIdDex = (val) => Number(String(val).replace(/\D/g, ''));

const DeckBuilder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const captured = useSelector((state) => state.pokedex.captured);
  const currentDeck = useSelector(selectPlayerDeck);
  const location = useLocation();

  const [selected, setSelected] = useState([]);
  const [translatedNames, setTranslatedNames] = useState({});

  useEffect(() => {
    if (location.pathname === '/decks' && currentDeck.length > 0) {
      const currentDeckIds = currentDeck.map(c =>
        typeof c === 'object' && c.idDex !== undefined ? normalizeIdDex(c.idDex) : normalizeIdDex(c)
      );

      const rebuilt = currentDeck
        .filter(cd => typeof cd === 'object' && cd.idDex !== undefined)
        .filter(cd =>
          captured.some(c => normalizeIdDex(c.idDex) === normalizeIdDex(cd.idDex))
        );

      if (rebuilt.length < currentDeck.length) {
        console.warn("⚠️ Certaines cartes du deck ne sont plus capturées !");
      }

      setSelected(rebuilt);

      console.log("▶️ currentDeck ids:", currentDeckIds);
      console.log("▶️ rebuilt selected:", rebuilt.map(c => ({ id: c.id, name: c.name })));
    }
  }, [location, currentDeck, captured]);

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
      const isSelected = prevSelected.some((c) =>
        normalizeIdDex(c.idDex) === normalizeIdDex(card.idDex)
      );

      if (isSelected) {
        return prevSelected.filter((c) =>
          normalizeIdDex(c.idDex) !== normalizeIdDex(card.idDex)
        );
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
          const selectedIdDexes = selected.map(c => normalizeIdDex(c.idDex));
          const isSelected = selectedIdDexes.includes(normalizeIdDex(card.idDex));
          const translatedName = translatedNames[card.name] || card.name;

          return (
            <div
              key={card.id}
              className={`card-wrapper deck-card ${isSelected ? "selected" : ""}`}
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

      <div className="button-group">
        <button onClick={handleValidateDeck} className="validate-btn">
          Valider le deck
        </button>
      </div>
    </div>
  );
};
//Bouton réinitialiser pour bug persistance du localStorage
      /*
        <button
          onClick={() => {
            localStorage.removeItem('currentDeck');
            window.location.reload();
          }}
          className="validate-btn"
        >
          Réinitialiser le deck
        </button>
      */

export default DeckBuilder;