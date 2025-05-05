# Poké-Triad

Un jeu de cartes inspiré de Triple Triad et de l’univers Pokémon (1ère génération), développé en React.

---

## ⚙️ Fonctionnalités actuelles

- 🎴 Génération automatique de 2 decks de 5 cartes Pokémon chacun (joueur et ennemi) via la PokéAPI.
- 🧠 Chaque carte possède :
  - Un nom, une image, un type (ex : feu 🔥),
  - 4 valeurs directionnelles (haut, bas, gauche, droite) calculées à partir des **stats de base Pokémon**.
- 🕹️ Plateau 3x3 interactif au centre.
- 🔄 Système de tour par tour avec une IA ennemie simple.
- 🎯 Mécanique de capture des cartes adjacentes selon les règles de Triple Triad.
- 🧮 Compteur de points en direct : `Joueur 5 - 4 Ennemi`
- ✅ Fin de partie détectée automatiquement (quand 9 cartes sont posées).
- 🏆 En cas de victoire :
  - Une fenêtre s’ouvre avec les 5 cartes initiales de l’ennemi,
  - Le joueur peut **en capturer une**,
  - Un message s’affiche : "Bravo, vous avez attrapé [Nom] !".
- 🔁 Bouton "Rejouer" pour relancer une partie proprement.

---

## 📦 Installation

```bash
npm install
npm start