# Livres Gourmets

Application web de gestion de bibliothèque avec une interface utilisateur moderne.

## Fonctionnalités

- Gestion des livres (ajout, modification, suppression)
- Système d'emprunt de livres
- Interface utilisateur réactive
- Authentification des utilisateurs
- Gestion des catégories de livres

## Technologies utilisées

### Backend
- Python (FastAPI)
- MySQL

### Frontend
- React.js
- Tailwind CSS
- React Router

## Installation

### Prérequis
- Python 3.8+
- Node.js 14+
- npm ou yarn

### Configuration

1. **Backend**
   ```bash
   cd api
   python -m venv venv
   source venv/bin/activate  # Sur Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend**
   ```bash
   cd front
   npm install
   npm start
   ```

## Structure du projet

```
projet_RWC/
├── api/                 # Backend FastAPI
│   ├── app.py           # Application principale
│   ├── db.py            # Configuration de la base de données
│   └── requirements.txt # Dépendances Python
│
└── front/               # Frontend React
    ├── public/          # Fichiers statiques
    ├── src/             # Code source React
    └── package.json     # Dépendances Node.js
```

## Contribution

1. Forkez le projet
2. Créez une branche (`git checkout -b feature/ma-nouvelle-fonctionnalite`)
3. Committez vos changements (`git commit -m 'Ajout d\'une nouvelle fonctionnalité'`)
4. Poussez vers la branche (`git push origin feature/ma-nouvelle-fonctionnalite`)
5. Créez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Auteur

- [Votre nom](https://github.com/coulibaly17)
