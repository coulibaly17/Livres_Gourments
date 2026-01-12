# Bridge pour connecter l'API FastAPI existante avec le back office Laravel
from fastapi import APIRouter, Depends, HTTPException, status
import requests
import json
import os
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
# Pas besoin de la base de données pour ce bridge qui est juste un proxy vers l'API Laravel

# Configuration de l'URL du back office Laravel
LARAVEL_API_URL = "http://localhost/projet/monprojet - Copie/monprojet - Copie/public/api"

# Création du routeur FastAPI
router = APIRouter(prefix="/laravel", tags=["Laravel Bridge"])

# Fonction utilitaire pour faire des requêtes vers l'API Laravel
def make_laravel_request(endpoint: str, method: str = "GET", data: Optional[Dict[str, Any]] = None, token: Optional[str] = None) -> Dict[str, Any]:
    """Fonction pour effectuer des requêtes vers l'API Laravel"""
    url = f"{LARAVEL_API_URL}/{endpoint}"
    headers = {}
    
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    if method == "GET":
        response = requests.get(url, headers=headers)
    elif method == "POST":
        headers["Content-Type"] = "application/json"
        response = requests.post(url, data=json.dumps(data), headers=headers)
    elif method == "PUT":
        headers["Content-Type"] = "application/json"
        response = requests.put(url, data=json.dumps(data), headers=headers)
    elif method == "DELETE":
        response = requests.delete(url, headers=headers)
    else:
        raise ValueError(f"Méthode HTTP non supportée: {method}")
    
    if response.status_code >= 400:
        # Gérer les erreurs Laravel
        try:
            error_data = response.json()
            message = error_data.get("message", "Erreur inconnue de l'API Laravel")
        except:
            message = f"Erreur {response.status_code} de l'API Laravel"
        
        raise HTTPException(
            status_code=response.status_code,
            detail=message
        )
    
    return response.json()

# Endpoints pour authentification
@router.post("/login")
async def login(username: str, password: str):
    """Endpoint pour se connecter via l'API Laravel"""
    try:
        response = make_laravel_request(
            "login",
            method="POST",
            data={"email": username, "password": password}
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )

@router.post("/register")
async def register(user_data: Dict[str, Any]):
    """Endpoint pour s'inscrire via l'API Laravel"""
    try:
        response = make_laravel_request(
            "register",
            method="POST",
            data=user_data
        )
        return response
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

# Endpoints pour les ouvrages
@router.get("/ouvrages")
async def get_ouvrages(token: Optional[str] = None):
    """Récupérer tous les ouvrages via l'API Laravel"""
    return make_laravel_request("ouvrages", token=token)

@router.get("/ouvrages/{ouvrage_id}")
async def get_ouvrage(ouvrage_id: int, token: Optional[str] = None):
    """Récupérer un ouvrage spécifique via l'API Laravel"""
    return make_laravel_request(f"ouvrages/{ouvrage_id}", token=token)

# Endpoints pour les catégories
@router.get("/categories")
async def get_categories(token: Optional[str] = None):
    """Récupérer toutes les catégories via l'API Laravel"""
    return make_laravel_request("categories", token=token)

# Endpoints pour les stocks
@router.get("/stocks")
async def get_stocks(token: Optional[str] = None):
    """Récupérer tous les stocks via l'API Laravel"""
    return make_laravel_request("stocks", token=token)

# Endpoints pour les ventes
@router.get("/ventes")
async def get_ventes(token: Optional[str] = None):
    """Récupérer toutes les ventes via l'API Laravel"""
    return make_laravel_request("ventes", token=token)

# Endpoints pour les commentaires
@router.get("/commentaires")
async def get_commentaires(token: Optional[str] = None):
    """Récupérer tous les commentaires via l'API Laravel"""
    return make_laravel_request("commentaires", token=token)

# Endpoints pour le tableau de bord administratif
@router.get("/dashboard/stats")
async def get_dashboard_stats(token: str):
    """Récupérer les statistiques pour le tableau de bord via l'API Laravel"""
    return make_laravel_request("dashboard/stats", token=token)
