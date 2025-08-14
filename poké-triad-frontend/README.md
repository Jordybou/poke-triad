# 🎮 Poké-Triad

Un jeu de **cartes stratégique** en React mêlant les mécaniques de **Triple Triad** (Final Fantasy VIII) à l’univers de **Pokémon** (1ʳᵉ génération), avec un style visuel **rétro Game Boy Advance**.

---

## 🚀 Fonctionnalités

### 🧭 Navigation
- Menu principal avec 5 onglets :
  - `▶️ Jouer` : Lancer une partie contre l'IA
  - `🃏 Decks` : Gérer son deck
  - `📘 Pokédex` : Visualiser sa collection de cartes capturées ou non
  - `📜 Règles` : Activer ou non les règles spéciales avec explications (en cours de réalisation)
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

### 🧠 Règles spéciales activables (en cours, non utilisable pour le moment)
- `Ordre` : les cartes doivent être jouées dans un ordre aléatoire
- `Open` : deck ennemi visible
- `Élémentaire` : certaines cases ont un type qui donne :
  - `+1` si correspondance
  - `-1` si faiblesse
  - Rien si aucune corresponce
- `Mur` : les bords du plateau ont une valeur de 10
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
- Permet de modifier son jeu en sélectionnant/désélectionnant une carte
- Bouton “Valider le deck”

---

## 🔐 Authentification & Sauvegarde
Le jeu inclut désormais un **système de compte** optionnel via un backend Node.js/Express.

- **Sans compte** : progression sauvegardée uniquement en localStorage (perdue en cas de refresh ou changement d’appareil).
- **Avec compte** :
  - Création de compte via formulaire (email + mot de passe).
  - Connexion persistante via cookies sécurisés (JWT httpOnly).
  - Sauvegarde automatique de la progression (Pokédex, deck, règles).
  - Récupération automatique des données à chaque connexion.

---

## 🛠️ Installation & Lancement

### 1) Backend
```bash
cd backend
npm install
npm run dev
```

**Backend `.env` (dev)**
```
NODE_ENV=development
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=ma-cle-tres-secrete-en-dev
```
---

### 2) Frontend
```bash
cd frontend
npm install
npm start
```

**Frontend `.env` (dev)**
```
REACT_APP_API_URL=http://localhost:4000
```
---

## 📖 Guide rapide : créer un compte & sauvegarder

### 1) Lancer en local
- **Backend**
  ```bash
  cd backend
  # Créez .env avec les variables ci-dessus (dans le terminal, touch .env) (modifiez JWT_SECRET) 
  npm install
  npm run dev
  ```
  L’API écoute sur `http://localhost:4000`.

- **Frontend**
  ```bash
  cd frontend
  # Créez .env avec REACT_APP_API_URL=http://localhost:4000 (dans le terminal, touch .env)
  npm install
  npm start
  ```
  L’app tourne sur `http://localhost:3000`.

### 2) Créer un compte
- Ouvrez l’app, en haut (widget “Compte”) saisissez **email** + **mot de passe** puis cliquez **Register**.
- Vous êtes automatiquement **connecté** (un cookie httpOnly est posé par l’API).

### 3) Se connecter / se déconnecter
- **Login** : entrez vos identifiants puis cliquez **Login**.
- **Logout** : bouton **Logout** pour fermer la session.

### 4) Sauvegarde de la progression
- **Invité (non connecté)** : sauvegarde locale (localStorage) uniquement.
- **Connecté** : la progression (Pokédex, deck, règles) est **enregistrée côté serveur** automatiquement :
  - à l’ouverture de l’écran de fin (défaite/égalité),
  - après une **capture confirmée** (victoire),
  - au moment de **Rejouer** (filet de sécurité).
- Au prochain démarrage, l’app récupère votre session et progression via `GET /me`.

### 5) Endpoints principaux (pour curieux)
- `POST /auth/register` – création de compte (email + password)
- `POST /auth/login` – connexion
- `POST /auth/logout` – déconnexion
- `GET /me` – infos utilisateur + progression
- `GET /progress` / `PUT /progress` – lire/écrire la progression (connecté)

---

## 📦 Technologies utilisées
- React
- Redux + Redux Toolkit
- Axios
- Node.js + Express
- bcrypt + jsonwebtoken
- PokéAPI (https://pokeapi.co)
- nanoid
- CSS Modules
- Fonts : Press Start 2P, VT323

---

## 📦 À venir
- 🌍 2ème génération après complétion de la 1ère
- 📱 Responsive design mobile
- 🎵 Ambiance sonore GBA
- 🧠 Règles corrigées et améliorées avec IA plus intelligente
- 💾 Sauvegarde cloud complète avec compte

---

## ✨ Auteur
Projet réalisé par Jordan dans le cadre d’un entraînement personnel en JavaScript & React.
