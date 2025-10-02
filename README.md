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

### 🧠 Règles spéciales activables *(en cours)* 
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
- Fin automatique à 9 cartes jouées (Système de point à revoir pour faire davantage Final Fantasy Triple Triad -> 5-5 au début et -1/+1 si capture)
- Affichage de :
  - 🏆 Victoire
  - 💀 Défaite
  - 🤝 Égalité (Impossible en état actuel de la version)
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
- Sélection/désélection des cartes
- Bouton “Valider le deck”

---

## 🔐 Authentification & Sauvegarde
Le jeu inclut désormais un **système de compte** optionnel via un backend Node.js/Express.

- **Sans compte** : progression stockée en **localStorage** (persiste au refresh, **non synchronisée entre appareils**).
- **Avec compte** : (option non fonctionnel à 100%)
  - Création de compte via formulaire (email + mot de passe).
  - Connexion persistante via cookies sécurisés (JWT httpOnly).
  - Sauvegarde automatique de la progression (Pokédex, deck, règles).
  - Récupération automatique des données à chaque connexion.

---

## 🛠️ Installation & Lancement

### Option A — depuis la **racine** (monorepo)
```bash
npm install
npm run dev          # lance frontend + backend
```

### Option B — par dossier

#### 1) Backend
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

#### 2) Frontend (CRA)
```bash
cd frontend
npm install
npm start
```

**Frontend `.env` (dev)**
```
VITE_API_URL=http://localhost:4000
```

---

## 📖 Guide rapide : créer un compte & sauvegarder

1) **Lancer en local**
   - Backend sur `http://localhost:4000`
   - Frontend sur `http://localhost:3000`

2) **Créer un compte**
   - Dans le widget “Compte” : **email** + **mot de passe** → **Register**  
   - Vous êtes connecté automatiquement (cookie httpOnly posé par l’API).

3) **Se connecter / se déconnecter**
   - **Login** : identifiants → **Login**
   - **Logout** : bouton **Logout**

4) **Sauvegarde de la progression**
   - **Invité (non connecté)** : localStorage
   - **Connecté** : côté serveur, déclenchée automatiquement :
     - à l’écran de fin (défaite/égalité),
     - après une **capture confirmée** (victoire),
     - au **Rejouer** (filet de sécurité).
   - Au démarrage, récupération via `GET /me`.

5) **Endpoints principaux**
   - `POST /auth/register` – créer un compte
   - `POST /auth/login` – connexion
   - `POST /auth/logout` – déconnexion
   - `GET /me` – infos utilisateur + progression
   - `GET /progress` / `PUT /progress` – lire/écrire la progression (connecté)

---

## 🧰 Scripts utiles
- **Racine**
  - `npm run dev` — lance tous les workspaces qui ont `dev`
  - `npm run build` — build des workspaces
- **Frontend**
  - `npm start` / `npm run dev` — CRA
  - `npm run build` — build CRA
- **Backend**
  - `npm run dev` — serveur dev
  - `npm start` — serveur prod

---

## 📦 Technologies
- React, React Router, Redux Toolkit, Axios
- Node.js, Express
- bcrypt, jsonwebtoken
- PokéAPI
- nanoid
- CSS Modules
- Fonts : Press Start 2P, VT323

---

## 📍 Roadmap
- 🌍 2ᵉ génération après complétion de la 1ʳᵉ
- 📱 Responsive mobile
- 🎵 Ambiance sonore GBA
- 🧠 IA améliorée + règles (dont `Open`)
- 💾 Sauvegarde cloud complète avec compte
- 🎨 Style des contours
- 🔧 Règles à revoir complètement (de A à Z, pour repartir sur de bonnes bases)

---

## ✨ Auteur
Projet réalisé par Jordan dans le cadre d’un entraînement personnel en JavaScript & React.
