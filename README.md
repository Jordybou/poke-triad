# Poké-Triad

Un jeu de cartes en React mêlant le concept de **Triple Triad** (Final Fantasy VIII) et l’univers **Pokémon**, en se basant sur la **1ʳᵉ génération** via la [PokéAPI](https://pokeapi.co/).

---

## 🎮 Fonctionnalités actuelles

### 🧭 Navigation
- Menu principal avec 5 onglets : `JOUER`, `DECKS`, `POKÉDEX`, `RÈGLES`, `QUITTER`
- Navigation fluide entre les écrans sans rechargement

### 🎴 Partie
- Plateau 3x3 avec système de jeu **au tour par tour**
- Deux decks de 5 cartes (joueur et IA) utilisés en jeu
- Chaque carte possède :
  - Son **nom**
  - Une **image** Pokémon
  - 4 **valeurs directionnelles** (haut, bas, gauche, droite)
  - Un **type élémentaire** (feu, eau, plante, etc.)
- Système de **capture de cartes** selon plusieurs règles :
  - **Classique** (valeur plus haute)
  - **Mur étendu**
  - **Identique**
  - **Plus**
  - **Combo**
- Règle **"Élémental"** : certaines cases du plateau influencent les cartes
- Règle **"Ordre"** : les cartes doivent être jouées dans l’ordre du deck
- Règle **"Open"** : le deck de l’adversaire est visible
- Compteur de score : `🟦 Joueur 4 - 5 Ennemi 🟥`
- Fin automatique de la partie avec message :
  - 🏆 `Victoire`, 💀 `Défaite` ou 🤝 `Égalité`
- En cas de victoire : **capture** d’une carte du deck initial adverse

---

### 📘 Pokédex
- Affiche les **151 Pokémon de la 1ʳᵉ génération**
- Chaque carte capturée est visible avec son image et ses stats
- Les cartes non capturées sont **verrouillées** (affichées grisées ou avec un cadenas)
- **Progression affichée** :
  - Exemple → `Progression : 24/151 cartes capturées (15.8%)`

---

### 🗃️ Decks personnalisés
- Onglet `DECKS` pour gérer ses decks :
  - 📦 Liste de tous les decks créés
  - ✏️ Renommer un deck
  - 📄 Dupliquer un deck
  - 🗑️ Supprimer un ou plusieurs decks
  - ✅ Définir un **deck actif**
- 🆕 Création d’un nouveau deck depuis les cartes capturées (Pokédex) :
  - ✅ Sélection jusqu’à 5 cartes
  - 🔍 Tri par **élément**, **force** ou **ordre alphabétique**
- 💾 Le deck actif est utilisé lors des prochaines parties

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
-Redux Toolkit
-nanoid (identifiants uniques de decks)

## 📦 À venir

🥇 Déblocage progressif des badges et des règles avancées (tous les X% de progression)
🌍 Débloquer la 2ᵉ génération de Pokémon après complétion de la 1ʳᵉ
📱 Responsive design pour mobile
🎵 Ajout d’une ambiance sonore GBA
🧠 IA plus intelligente (stratégie de jeu améliorée)
💾 Système de sauvegarde/export de decks

## ✨ Auteur

Projet réalisé par Jordan dans le cadre d’un entraînement personnel en JavaScript & React.