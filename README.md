# Projet RWC

Ce projet est une application web avec une architecture client-serveur, composée d'une API en Python (FastAPI) et d'une interface utilisateur en React.

## 📋 Prérequis

- Python 3.8+
- Node.js 14+
- MySQL

## 🚀 Installation

### Backend (API)

1. Créez un environnement virtuel :
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # Sur Windows: .venv\Scripts\activate
   ```

2. Installez les dépendances :
   ```bash
   cd api
   pip install -r requirements.txt
   ```

3. Configurez les variables d'environnement :
   Créez un fichier `.env` dans le dossier `api` avec les variables nécessaires (voir la section Configuration).

### Frontend

1. Installez les dépendances :
   ```bash
   cd front
   npm install
   ```

## ⚙️ Configuration

### API
Créez un fichier `.env` dans le dossier `api` avec les variables suivantes :
```
DATABASE_URL=mysql+pymysql://utilisateur:motdepasse@localhost/nom_de_la_base
```

## 🏃 Exécution

### Développement

1. Démarrez le serveur backend :
   ```bash
   cd api
   uvicorn main:app --reload
   ```

2. Démarrez le serveur frontend :
   ```bash
   cd front
   npm start
   ```

Ou utilisez le script `start_dev.bat` pour démarrer les deux serveurs en même temps (Windows uniquement).

## 📁 Structure du projet

- `/api` - Code source du backend (FastAPI)
- `/front` - Code source du frontend (React)
- `/env` - Fichiers d'environnement (à ne pas versionner)

## 📚 Technologies utilisées

### Backend
- Python 3.8+
- FastAPI
- SQLAlchemy (ORM)
- MySQL (base de données)

### Frontend
- React
- Tailwind CSS
- Autres dépendances (voir `front/package.json`)

## 🔧 Dépendances principales

- Backend : Voir `api/requirements.txt`
- Frontend : Voir `front/package.json`

## 📝 Licence

Ce projet est sous licence MIT.
