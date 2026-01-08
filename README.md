# 🎴 Poké-Triad

**Poké-Triad** est un jeu inspiré du **Triple Triad**, revisité dans l’univers Pokémon.  
Le projet est développé en **JavaScript**, avec un **frontend Vite** et un **backend Node.js**.

L’objectif est de proposer un jeu de cartes stratégique jouable localement, avec une progression et une sauvegarde des données.

---

## 🧩 Stack technique

### Frontend
- Vite
- JavaScript
- HTML / CSS

### Backend
- Node.js
- Express
- Nodemon (développement)

---

## 🗂 Architecture du projet

poke-triad/
├── frontend/ # Interface du jeu
│ ├── index.html
│ ├── main.js
│ └── styles/
│
├── backend/ # Serveur Node.js
│ ├── server.js
│ ├── data/ # Données (utilisateurs, progression)
│ └── .env.example # Variables d’environnement (exemple)
│
├── package.json # Scripts & dépendances globales
├── package-lock.json
├── .gitignore
└── README.md

---

## 🚀 Installation

### Prérequis
- Node.js **>= 18**
- npm
- Git

---

### Setup

1️⃣ Cloner le projet

git clone https://github.com/TON-PSEUDO/poke-triad.git
cd poke-triad

2️⃣ Installer les dépendances
npm install


Les dépendances frontend et backend sont installées depuis la racine.

3️⃣ Configuration de l’environnement

Dans le dossier backend/ :

cp .env.example .env


Puis adapter les variables si nécessaire.

4️⃣ Lancer le projet en développement
npm run dev


Frontend : http://localhost:5173
 (par défaut)

Backend : http://localhost:3000
 (selon configuration)

🛠 Scripts disponibles
npm run dev        # Lance frontend + backend
npm run server     # Lance uniquement le backend
npm run client     # Lance uniquement le frontend

⚠️ Notes importantes

node_modules n’est jamais versionné

Le fichier .env ne doit pas être commité

Les fichiers backend/data/*.json peuvent être remplacés par des versions .example.json si nécessaire

🤝 Contribuer au projet

Forker le dépôt

Cloner le fork

Créer une branche (feature/ma-feature)

Installer les dépendances (npm install)

Développer et tester

Commit et push

Ouvrir une Pull Request

👨‍💻 Auteur

Projet développé par GERARD Jordan
(alias Jordybou)