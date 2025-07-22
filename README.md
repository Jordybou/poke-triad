# 🎮 Poké-Triad

Un jeu de **cartes stratégique** en React mêlant les mécaniques de **Triple Triad** (Final Fantasy VIII) à l’univers de **Pokémon** (1ʳᵉ génération), avec un style visuel **rétro Game Boy Advance**.

---

## 🚀 Fonctionnalités

### 🧭 Navigation
- Menu principal avec 5 onglets :
  - `▶️ Jouer` : Lancer une partie contre l'IA
  - `🃏 Decks` : Gérer son deck
  - `📘 Pokédex` : Visualiser sa collection de cartes capturées ou non
  - `📜 Règles` : Activer ou non les règles spéciales avec explications
  - `❌ Quitter` : Fermer l’application

---

### 🎴 Partie – Plateau 3x3
- **Decks de 5 cartes** pour le joueur et l'ennemi
- Chaque carte comprend :
  - Nom + image officielle Pokémon
  - Statistiques converties en **valeurs directionnelles** (haut, bas, gauche, droite)
  - Un **type élémentaire** (feu, eau, etc.) avec emoji ou icône
- **Tour par tour** (joueur / IA)
- Cartes posées sur le plateau central avec animation
- **Effets de bordures colorées**, zoom sur sélection
- **Score en direct** (cartes possédées)

---

### 🧠 Règles spéciales activables
- `Ordre` : les cartes doivent être jouées dans un ordre aléatoire
- `Open` : deck ennemi visible
(modification à venir concernant la difficulté de l'IA)
- `Élémentaire` : certaines cases ont un type qui donne :
  - `+1` si correspondance
  - `-1` si faiblesse
- `Mur` : les bords du plateau "regardent" à travers
- `Identique` : capture si deux valeurs adjacentes sont identiques
- `Plus` : capture si deux sommes de valeurs sont égales
- `Combo` : enchaînements de captures possibles
- `Chaos` : le joueur perd une carte en cas de défaite (à venir)

---

### 🏁 Fin de partie
- Fin automatique à 9 cartes jouées
- Affichage de :
  - 🏆 Victoire
  - 💀 Défaite
  - 🤝 Égalité
- En cas de victoire :
  - Sélection d’une **carte adverse à capturer**
  - Ajout au **Pokédex**

---

## 📘 Pokédex
- Affiche les **151 Pokémon de la 1ʳᵉ génération**
- Cartes **capturées** affichées avec nom + image
- Cartes **non capturées** cachées en face verso
- Affiche la **progression** (ex. : `48/151`)
- Déblocage progressif de **badges** (8) :
  - Chaque badge débloque une **règle spéciale**
  - Affichés avec état verrouillé / débloqué

---

## 🗃️ Decks 
- Affichage du deck par défaut avec un encadrement jaune
- Permet de modifier son jeu en séléctionnant ou en désélectionnant une carte
- Bouton Valider le deck et Réinitialiser le deck

---

## 🛠️ Installation

```bash
npm install
npm start

## 🛠️ Technologies utilisées

-React
-Redux + Redux Toolkit
-Axios (pour appeler la PokéAPI)
-PokéAPI (https://pokeapi.co)
-Redux Toolkit
-nanoid (identifiants uniques de decks)
-CSS Modules + Variables GBA
-Font : Press Start 2P + VT323 (rétro Game Boy)

## 📦 À venir

🌍 Débloquer la 2ᵉ génération de Pokémon après complétion de la 1ʳᵉ
📱 Responsive design pour mobile
🎵 Ajout d’une ambiance sonore GBA
🧠 IA plus intelligente (stratégie de jeu améliorée pour la règle OPEN)
💾 Système de sauvegarde/export de decks
🗃️ Export/sauvegarde locale de la progression
🃏 Règle Chaos : perte de carte à la défaite

## ✨ Auteur

Projet réalisé par Jordan dans le cadre d’un entraînement personnel en JavaScript & React.