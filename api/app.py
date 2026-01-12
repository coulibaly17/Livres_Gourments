# Squelette FastAPI complet pour livresgourmands.net
from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func
from db import SessionLocal
from models import Utilisateur
import datetime
import bcrypt
import random
import string
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from datetime import timedelta

# Import du bridge Laravel
from laravel_bridge import router as laravel_router

app = FastAPI(title="API livresgourmands.net")

# CORS pour React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusion du routeur Laravel Bridge
app.include_router(laravel_router)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# --- SCHEMAS PYDANTIC SYNCHRONISES ---
class UtilisateurSchema(BaseModel):
    id: int
    nom: str
    prenom: str
    adresse: str
    telephone: str
    photo: Optional[str]
    role: str
    email: str
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]
    model_config = {"from_attributes": True}

class UtilisateurCreateSchema(BaseModel):
    nom: str
    prenom: str
    adresse: str
    telephone: str
    photo: Optional[str] = None
    role: Optional[str] = 'client'
    email: str
    password: str

class CategorieSchema(BaseModel):
    id: int
    nom: str
    description: Optional[str]
    model_config = {"from_attributes": True}

class CategorieCreateSchema(BaseModel):
    nom: str
    description: Optional[str] = None

class OuvrageSchema(BaseModel):
    id: int
    titre: str
    description: str
    auteur: str
    editeur: str
    isbn: str
    prix: float
    date_publication: datetime.date
    niveau: str
    photo: Optional[str]
    categorie_id: int
    model_config = {"from_attributes": True}

class OuvrageCreateSchema(BaseModel):
    titre: str
    description: str
    auteur: str
    editeur: str
    isbn: str
    prix: float
    date_publication: datetime.date
    niveau: str = 'debutant'
    photo: Optional[str] = None
    categorie_id: int

class VenteSchema(BaseModel):
    id: int
    montant_total: float
    created_at: Optional[datetime.datetime]
    updated_at: Optional[datetime.datetime]
    model_config = {"from_attributes": True}

class VenteCreateSchema(BaseModel):
    montant_total: float

class LigneVenteSchema(BaseModel):
    id: int
    vente_id: int
    ouvrage_id: int
    utilisateur_id: int
    quantite: int
    prix_unitaire: float
    model_config = {"from_attributes": True}

class LigneVenteCreateSchema(BaseModel):
    vente_id: int
    ouvrage_id: int
    utilisateur_id: int
    quantite: int
    prix_unitaire: float

class StockSchema(BaseModel):
    id: int
    ouvrage_id: int
    quantite: int
    prix_achat: float
    prix_vente: float
    model_config = {"from_attributes": True}

class StockCreateSchema(BaseModel):
    ouvrage_id: int
    quantite: int
    prix_achat: float
    prix_vente: float

class CommentaireSchema(BaseModel):
    id: int
    contenu: str
    utilisateur_id: int
    ouvrage_id: int
    note: int
    model_config = {"from_attributes": True}

class CommentaireCreateSchema(BaseModel):
    contenu: str
    utilisateur_id: int
    ouvrage_id: int
    note: int = 0


class OuvrageStockSchema(BaseModel):
    ouvrage_id: int
    total_quantity: int
    model_config = {"from_attributes": True}

# --- AUTH ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

# Fonction pour extraire le token du format "Bearer <token>"
async def get_current_user(authorization: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        # Si le token commence par "Bearer ", on extrait le token
        if authorization.startswith("Bearer "):
            token = authorization.replace("Bearer ", "")
        else:
            token = authorization
            
        # Recherche de l'utilisateur par email
        user = db.query(Utilisateur).filter(Utilisateur.email == token).first()
        if not user:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user
    except Exception as e:
        print(f"Erreur d'authentification: {str(e)}")
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    db_user = db.query(Utilisateur).filter(Utilisateur.email == form_data.username).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="Identifiants invalides")
    if not bcrypt.checkpw(form_data.password.encode('utf-8'), db_user.password.encode('utf-8')):
        raise HTTPException(status_code=400, detail="Identifiants invalides")
    return {"access_token": db_user.email, "token_type": "bearer"}

# --- UTILISATEURS ---
@app.post("/users/", response_model=UtilisateurSchema)
def create_user(user: UtilisateurCreateSchema, db: Session = Depends(get_db)):
    db_user = db.query(Utilisateur).filter(Utilisateur.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email déjà utilisé")
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    new_user = Utilisateur(
        nom=user.nom,
        prenom=user.prenom,
        adresse=user.adresse,
        telephone=user.telephone,
        photo=user.photo,
        role=user.role if hasattr(user, 'role') else 'client',
        email=user.email,
        password=hashed_password,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

# ...existing code...

@app.get("/catalogue", response_model=List[OuvrageSchema])
def catalogue_alias(db: Session = Depends(get_db)):
    return db.query(Ouvrage).all()

# ...existing code...

@app.get("/users/me", response_model=UtilisateurSchema)
async def read_users_me(current_user: Utilisateur = Depends(get_current_user)):
    # Nous avons déjà l'utilisateur grâce à get_current_user
    return current_user

# --- CATEGORIES ---
from models import Utilisateur, Categorie, Ouvrage, Vente, LigneVente, Stock, Commentaire

@app.get("/categories/", response_model=List[CategorieSchema])
def list_categories(db: Session = Depends(get_db)):
    return db.query(Categorie).all()

@app.post("/categories/", response_model=CategorieSchema)
def create_categorie(cat: CategorieCreateSchema, db: Session = Depends(get_db)):
    categorie = Categorie(**cat.dict())
    db.add(categorie)
    db.commit()
    db.refresh(categorie)
    return categorie

@app.get("/categories/{cat_id}", response_model=CategorieSchema)
def get_categorie(cat_id: int, db: Session = Depends(get_db)):
    categorie = db.query(Categorie).get(cat_id)
    if not categorie:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    return categorie

@app.put("/categories/{cat_id}", response_model=CategorieSchema)
def update_categorie(cat_id: int, cat: CategorieCreateSchema, db: Session = Depends(get_db)):
    categorie = db.query(Categorie).get(cat_id)
    if not categorie:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    for k, v in cat.dict().items():
        setattr(categorie, k, v)
    db.commit()
    db.refresh(categorie)
    return categorie

@app.delete("/categories/{cat_id}")
def delete_categorie(cat_id: int, db: Session = Depends(get_db)):
    categorie = db.query(Categorie).get(cat_id)
    if not categorie:
        raise HTTPException(status_code=404, detail="Catégorie non trouvée")
    db.delete(categorie)
    db.commit()
    return {"ok": True}

# --- OUVRAGES ---
@app.get("/ouvrages/", response_model=List[OuvrageSchema])
def list_ouvrages(db: Session = Depends(get_db)):
    return db.query(Ouvrage).all()

@app.post("/ouvrages/", response_model=OuvrageSchema)
def create_ouvrage(ouvrage: OuvrageCreateSchema, db: Session = Depends(get_db)):
    obj = Ouvrage(**ouvrage.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.get("/ouvrages/{ouvrage_id}", response_model=OuvrageSchema)
def get_ouvrage(ouvrage_id: int, db: Session = Depends(get_db)):
    obj = db.query(Ouvrage).get(ouvrage_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    return obj

@app.put("/ouvrages/{ouvrage_id}", response_model=OuvrageSchema)
def update_ouvrage(ouvrage_id: int, ouvrage: OuvrageCreateSchema, db: Session = Depends(get_db)):
    obj = db.query(Ouvrage).get(ouvrage_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    for k, v in ouvrage.dict().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@app.delete("/ouvrages/{ouvrage_id}")
def delete_ouvrage(ouvrage_id: int, db: Session = Depends(get_db)):
    obj = db.query(Ouvrage).get(ouvrage_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Ouvrage non trouvé")
    db.delete(obj)
    db.commit()
    return {"ok": True}


@app.get("/ouvrages/{ouvrage_id}/stock/", response_model=OuvrageStockSchema)
def get_ouvrage_stock(ouvrage_id: int, db: Session = Depends(get_db)):
    # First, check if the ouvrage exists
    db_ouvrage = db.query(Ouvrage).filter(Ouvrage.id == ouvrage_id).first()
    if not db_ouvrage:
        raise HTTPException(status_code=404, detail="Ouvrage not found")

    # Query to sum quantities from the Stock table for the given ouvrage_id
    # The result of sum() can be None if there are no matching rows, so coalesce to 0
    total_quantity_result = db.query(func.coalesce(func.sum(Stock.quantite), 0)).filter(Stock.ouvrage_id == ouvrage_id).scalar()
    
    return OuvrageStockSchema(ouvrage_id=ouvrage_id, total_quantity=total_quantity_result)

# --- VENTES ---
@app.get("/ventes/", response_model=List[VenteSchema])
def list_ventes(db: Session = Depends(get_db)):
    return db.query(Vente).all()

@app.post("/ventes/", response_model=VenteSchema)
def create_vente(vente: VenteCreateSchema, db: Session = Depends(get_db)):
    obj = Vente(**vente.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@app.get("/ventes/{vente_id}", response_model=VenteSchema)
def get_vente(vente_id: int, db: Session = Depends(get_db)):
    obj = db.query(Vente).get(vente_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
    return obj

@app.delete("/ventes/{vente_id}")
def delete_vente(vente_id: int, db: Session = Depends(get_db)):
    obj = db.query(Vente).get(vente_id)
    if not obj:
        raise HTTPException(status_code=404, detail="Vente non trouvée")
    db.delete(obj)
    db.commit()
    return {"ok": True}

# --- LIGNE VENTES ---
@app.get("/ligneventes/", response_model=List[LigneVenteSchema])
def list_ligneventes(db: Session = Depends(get_db)):
    return db.query(LigneVente).all()

@app.post("/ligneventes/", response_model=LigneVenteSchema)
def create_lignevente(lv: LigneVenteCreateSchema, db: Session = Depends(get_db)):
    obj = LigneVente(**lv.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# --- STOCKS ---
@app.get("/stocks/", response_model=List[StockSchema])
def list_stocks(db: Session = Depends(get_db)):
    return db.query(Stock).all()

@app.post("/stocks/", response_model=StockSchema)
def create_stock(stock: StockCreateSchema, db: Session = Depends(get_db)):
    obj = Stock(**stock.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# --- COMMENTAIRES ---
@app.get("/commentaires/", response_model=List[CommentaireSchema])
def list_commentaires(db: Session = Depends(get_db)):
    return db.query(Commentaire).all()

@app.post("/commentaires/", response_model=CommentaireSchema)
def create_commentaire(com: CommentaireCreateSchema, db: Session = Depends(get_db)):
    obj = Commentaire(**com.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

# --- PANIER (désactivé, à réimplémenter avec la nouvelle logique SQLAlchemy/Laravel) ---
# @app.get("/cart/", response_model=Cart)
# def get_cart(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     user = db.query(Utilisateur).filter(Utilisateur.email == token).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     cart = fake_carts.get(user.id, Cart(user_id=user.id, items=[]))
#     return cart

# @app.post("/cart/add", response_model=Cart)
# def add_to_cart(item: CartItem, token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     user = db.query(Utilisateur).filter(Utilisateur.email == token).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     cart = fake_carts.get(user.id, Cart(user_id=user.id, items=[]))
#     cart.items.append(item)
#     fake_carts[user.id] = cart
#     return cart

# --- COMMANDES (désactivé, à réimplémenter avec la nouvelle logique SQLAlchemy/Laravel) ---
# @app.post("/orders/", response_model=Order)
# def create_order(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     user = db.query(Utilisateur).filter(Utilisateur.email == token).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     cart = fake_carts.get(user.id)
#     if not cart or not cart.items:
#         raise HTTPException(status_code=400, detail="Cart is empty")
#     total = sum(next((b.price for b in fake_books if b.id == item.book_id), 0) * item.quantity for item in cart.items)
#     order = Order(id=len(fake_orders)+1, user_id=user.id, items=cart.items, total=total, status="pending")
#     fake_orders.append(order)
#     fake_carts[user.id] = Cart(user_id=user.id, items=[])
#     return order

# @app.get("/orders/", response_model=List[Order])
# def list_orders(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
#     user = db.query(Utilisateur).filter(Utilisateur.email == token).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return [o for o in fake_orders if o.user_id == user.id]

# --- GESTION DES CODES DE VÉRIFICATION ---
# Stocker les codes de vérification temporaires (en production, utiliser une BD)
verification_codes: Dict[str, Dict] = {}

# Configuration email (à configurer selon votre fournisseur d'email)
# Pour Gmail: activez l'authentification à deux facteurs et créez un "mot de passe d'application"
# https://myaccount.google.com/apppasswords
EMAIL_HOST = "smtp.gmail.com"  # Serveur SMTP (Gmail par défaut)
EMAIL_PORT = 587  # Port TLS standard
EMAIL_USER = "ecomalexkevin@gmail.com"  # IMPORTANT: Remplacez par votre email réel
EMAIL_PASSWORD = "fwww azyd ihjl upii"  # IMPORTANT: Remplacez par votre mot de passe d'application
EMAIL_FROM = "support@livresgourmands.net"  # L'adresse qui apparaîtra comme expéditeur

# Schéma pour la demande de code de vérification
class VerificationRequest(BaseModel):
    email: EmailStr

# Schéma pour la vérification du code
class VerificationCheck(BaseModel):
    email: EmailStr
    code: str
    
# Schéma pour la réinitialisation du mot de passe
class PasswordReset(BaseModel):
    email: EmailStr
    code: str
    new_password: str

# Fonction d'envoi d'email asynchrone
def send_email(email_to: str, subject: str, body: str):
    try:
        print(f"Tentative d'envoi d'email à {email_to}...")
        print(f"Config SMTP: {EMAIL_HOST}:{EMAIL_PORT}, utilisateur: {EMAIL_USER}")
        
        msg = MIMEMultipart()
        msg["From"] = EMAIL_FROM
        msg["To"] = email_to
        msg["Subject"] = subject
        
        msg.attach(MIMEText(body, "html"))
        
        print("Connexion au serveur SMTP...")
        with smtplib.SMTP(EMAIL_HOST, EMAIL_PORT) as server:
            print("Démarrage TLS...")
            server.starttls()
            print(f"Authentification avec {EMAIL_USER}...")
            server.login(EMAIL_USER, EMAIL_PASSWORD)
            print("Envoi du message...")
            server.send_message(msg)
            print("Message envoyé avec succès!")
        
        print(f"Email envoyé avec succès à {email_to}")
        return True
    except Exception as e:
        print(f"ERREUR D'ENVOI D'EMAIL: {str(e)}")
        # Afficher plus d'informations sur l'erreur pour faciliter le débogage
        import traceback
        print(traceback.format_exc())
        return False

# Générer un code aléatoire à 5 chiffres
def generate_verification_code():
    return ''.join(random.choice(string.digits) for _ in range(5))

@app.post("/password-reset/request")
async def request_password_reset(request: VerificationRequest, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    # Vérifier si l'email existe
    user = db.query(Utilisateur).filter(Utilisateur.email == request.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Générer un code de vérification à 5 chiffres
    code = generate_verification_code()
    
    # Stocker le code avec un délai d'expiration (30 minutes)
    verification_codes[request.email] = {
        "code": code,
        "expires": datetime.datetime.now() + timedelta(minutes=30)
    }
    
    # Créer le contenu de l'email
    email_subject = "Votre code de vérification Livres Gourmands"
    email_body = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #8B4513; color: white; padding: 15px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .code {{ font-size: 24px; font-weight: bold; text-align: center; color: #8B4513; 
                     padding: 15px; margin: 20px 0; background-color: #f0f0f0; border-radius: 5px; }}
            .footer {{ text-align: center; font-size: 12px; color: #999; margin-top: 20px; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h2>Livres Gourmands</h2>
            </div>
            <div class="content">
                <p>Bonjour,</p>
                <p>Vous avez demandé un code de vérification pour réinitialiser votre mot de passe.</p>
                <p>Voici votre code de vérification:</p>
                <div class="code">{code}</div>
                <p>Ce code est valable pendant 30 minutes.</p>
                <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
            </div>
            <div class="footer">
                <p>© {datetime.datetime.now().year} Livres Gourmands - Tous droits réservés</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Envoyer l'email en arrière-plan
    # En mode développement, imprimer le code dans la console pour le débogage
    print(f"Code de vérification pour {request.email}: {code}")
    
    # Envoyer l'email (activé)
    try:
        # Si les paramètres d'email ne sont pas configurés, afficher un message d'erreur
        if EMAIL_USER == "votre_email@gmail.com" or EMAIL_PASSWORD == "votre_mot_de_passe_app":
            print("ATTENTION: Configuration email non complétée. Modifiez EMAIL_USER et EMAIL_PASSWORD dans app.py")
        else:
            print("\n==== ENVOI D'EMAIL =====")
            print(f"De: {EMAIL_FROM}")
            print(f"\u00c0: {request.email}")
            print(f"Sujet: {email_subject}")
            print(f"Code: {code}")
            # Pour Gmail: vérifier si c'est un mot de passe d'application
            if EMAIL_HOST == "smtp.gmail.com" and len(EMAIL_PASSWORD) != 16:
                print("ATTENTION: Pour Gmail, vous devez utiliser un mot de passe d'application de 16 caractères")
                print("Visitez https://myaccount.google.com/apppasswords pour en créer un")
            
            # Tenter d'envoyer directement pour voir les erreurs en temps réel
            email_result = send_email(request.email, email_subject, email_body)
            if not email_result:
                print("\u00c9chec de l'envoi direct de l'email - voir erreur au-dessus")
            else:
                print("Email envoyé avec succès en mode direct")
    except Exception as e:
        print(f"ERREUR CRITIQUE lors de la tentative d'envoi d'email: {str(e)}")
        import traceback
        print(traceback.format_exc())
    
    return {"message": f"Code de vérification envoyé à {request.email}", "debug_code": code}  # Inclure le code en mode debug

@app.post("/password-reset/verify")
def verify_reset_code(verification: VerificationCheck):
    # Vérifier si un code existe pour cet email
    if verification.email not in verification_codes:
        raise HTTPException(status_code=400, detail="Code de vérification non demandé ou expiré")
    
    stored_data = verification_codes[verification.email]
    
    # Vérifier si le code est expiré
    if datetime.datetime.now() > stored_data["expires"]:
        del verification_codes[verification.email]
        raise HTTPException(status_code=400, detail="Code de vérification expiré")
    
    # Vérifier si le code est correct
    if verification.code != stored_data["code"]:
        raise HTTPException(status_code=400, detail="Code de vérification incorrect")
    
    # Code valide, retourner un token temporaire pour la réinitialisation
    return {"message": "Code vérifié avec succès", "canResetPassword": True}

@app.post("/password-reset/reset")
def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    # Vérifier si un code existe pour cet email et s'il est valide
    if reset_data.email not in verification_codes:
        raise HTTPException(status_code=400, detail="Code de vérification non demandé ou expiré")
    
    stored_data = verification_codes[reset_data.email]
    
    # Vérifier si le code est expiré
    if datetime.datetime.now() > stored_data["expires"]:
        del verification_codes[reset_data.email]
        raise HTTPException(status_code=400, detail="Code de vérification expiré")
    
    # Vérifier si le code est correct
    if reset_data.code != stored_data["code"]:
        raise HTTPException(status_code=400, detail="Code de vérification incorrect")
    
    # Trouver l'utilisateur par email
    user = db.query(Utilisateur).filter(Utilisateur.email == reset_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    
    # Hasher le nouveau mot de passe
    hashed_password = bcrypt.hashpw(reset_data.new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    # Mettre à jour le mot de passe
    user.password = hashed_password
    user.updated_at = datetime.datetime.now()
    db.commit()
    
    # Supprimer le code de vérification puisqu'il a été utilisé
    del verification_codes[reset_data.email]
    
    return {"message": "Mot de passe réinitialisé avec succès"}

# --- CHATBOT (SIMPLE) ---
@app.post("/chatbot/")
def chatbot(question: str):
    # Réponse simple, à remplacer par IA ou règles
    if "debutant" in question.lower():
        return {"answer": "Essayez 'Livre Gourmand' pour débutants !"}
    if "commande" in question.lower():
        return {"answer": "Consultez vos commandes dans votre espace client."}
    return {"answer": "Je suis là pour vous aider avec vos livres gourmands !"}

# --- ROUTE RACINE ET FAVICON ---
from fastapi.responses import PlainTextResponse, Response

@app.get("/", response_class=PlainTextResponse)
def root():
    return "Bienvenue sur l'API livresgourmands.net !"

@app.get("/favicon.ico")
def favicon():
    # Retourne un statut 204 (No Content) pour éviter l'erreur 404 si pas de favicon
    return Response(status_code=204)
