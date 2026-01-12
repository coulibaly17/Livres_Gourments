@echo off
echo Demarrage de l'environnement de developpement Livres Gourmands
echo =========================================================

REM Demarrage de l'API FastAPI dans un terminal
start cmd /k "cd api && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

REM Attente pour s'assurer que l'API démarre avant le frontend
timeout /t 2 /nobreak

REM Demarrage du frontend React dans un autre terminal
start cmd /k "cd front && npm start"

echo L'API est disponible sur http://localhost:8000
echo Le frontend est disponible sur http://localhost:3000
echo Le backoffice est disponible via votre instance WAMP
