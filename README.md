# Poké-Triad

Un jeu de cartes en React mêlant le concept de **Triple Triad** et l’univers **Pokémon**, en se basant sur la **1ʳᵉ génération** via la [PokéAPI](https://pokeapi.co/).

---

## 🎮 Fonctionnalités actuelles

### 🧭 Navigation
- Menu principal avec 5 onglets : `JOUER`, `DECKS`, `POKÉDEX`, `RÈGLES`, `QUITTER`
- Navigation fluide entre les écrans sans rechargement

### 🎴 Partie
- Plateau 3x3 avec système de jeu au **tour par tour**
- Deux decks aléatoires de 5 cartes générés (joueur et IA)
- Chaque carte a :
  - Son nom
  - Une image Pokémon
  - 4 valeurs directionnelles (haut, bas, gauche, droite)
  - Un type affiché avec une icône (ex: 🔥 pour feu)
- Système de **capture** selon les règles classiques de Triple Triad
- Compteur de points : `🟦 Joueur 4 - 5 Ennemi 🟥`
- Fin automatique de la partie avec message :
  - `Victoire`, `Défaite` ou `Égalité`
- Si victoire : **choix d’une carte à capturer** parmi les 5 cartes initiales de l’adversaire

### 📘 Pokédex
- Affiche les **151 Pokémon de la 1ʳᵉ génération**
- Chaque carte capturée s’affiche normalement
- Les cartes non capturées apparaissent :
  - 🔒 Verrouillées (grisées ou avec un cadenas)
- **Progression affichée** :  
  Exemple → `Progression : 24/151 cartes capturées (15.8%)`

---

## 🔧 Installation

```bash
npm install
npm start

## 🛠️ Technologies utilisées

-React
-Redux (pour le Pokédex)
-Axios (pour appeler la PokéAPI)
-PokéAPI (https://pokeapi.co)

## 📦 À venir

🔖 Ajout de badges ou règles supplémentaires tous les X % de progression
🧩 Création de decks personnalisés (dans l’onglet DECKS)
📜 Activation des règles spéciales (Combo, Plus, Aléatoire...)
🎨 Thème visuel Pokémon GBA rétro
🌐 Passage à la 2ᵉ génération une fois la 1ʳᵉ complétée

## ✨ Auteur

Projet réalisé par Jordan dans le cadre d’un entraînement personnel en JavaScript & React.