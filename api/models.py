from sqlalchemy import Column, BigInteger, String, DateTime, Integer, Float, Enum, Text, DECIMAL, ForeignKey, Date
from sqlalchemy.orm import relationship
from db import Base
import datetime
import enum

# --- ENUMS ---
class RoleEnum(enum.Enum):
    client = 'client'
    editeur = 'editeur'
    gestionnaire = 'gestionnaire'
    administrateur = 'administrateur'

class NiveauEnum(enum.Enum):
    debutant = "débutant"
    amateur = "amateur"
    chef = "chef"

# --- MODELES ---
class Utilisateur(Base):
    __tablename__ = 'utilisateurs'
    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    nom = Column(String(191), nullable=False)
    prenom = Column(String(191), nullable=False)
    adresse = Column(String(191), nullable=False)
    telephone = Column(String(191), nullable=False)
    photo = Column(String(191), nullable=True)
    role = Column(Enum(RoleEnum), nullable=False, default='client')
    email = Column(String(191), unique=True, index=True, nullable=False)
    password = Column(String(191), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    commentaires = relationship('Commentaire', back_populates='utilisateur')
    ligne_ventes = relationship('LigneVente', back_populates='utilisateur')

class Categorie(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nom = Column(String(191), nullable=False)
    description = Column(String(191), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    ouvrages = relationship('Ouvrage', back_populates='categorie')

class Ouvrage(Base):
    __tablename__ = 'ouvrages'
    id = Column(Integer, primary_key=True, autoincrement=True)
    titre = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    auteur = Column(String(255), nullable=False)
    editeur = Column(String(255), nullable=False)
    isbn = Column(String(255), unique=True, nullable=False)
    prix = Column(DECIMAL(8, 2), nullable=False)
    date_publication = Column(Date, nullable=False)
    niveau = Column(Enum(NiveauEnum, name="niveauenum", native_enum=False), nullable=False, default="débutant")
    photo = Column(String(255), nullable=True)
    categorie_id = Column(Integer, ForeignKey('categories.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    categorie = relationship('Categorie', back_populates='ouvrages')
    stocks = relationship('Stock', back_populates='ouvrage')
    commentaires = relationship('Commentaire', back_populates='ouvrage')
    ligne_ventes = relationship('LigneVente', back_populates='ouvrage')

class Vente(Base):
    __tablename__ = 'ventes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    montant_total = Column(DECIMAL(8, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    ligne_ventes = relationship('LigneVente', back_populates='vente')

class LigneVente(Base):
    __tablename__ = 'ligne_ventes'
    id = Column(Integer, primary_key=True, autoincrement=True)
    vente_id = Column(Integer, ForeignKey('ventes.id'), nullable=False)
    ouvrage_id = Column(Integer, ForeignKey('ouvrages.id'), nullable=False)
    utilisateur_id = Column(BigInteger, ForeignKey('utilisateurs.id'), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_unitaire = Column(DECIMAL(8, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    vente = relationship('Vente', back_populates='ligne_ventes')
    ouvrage = relationship('Ouvrage', back_populates='ligne_ventes')
    utilisateur = relationship('Utilisateur', back_populates='ligne_ventes')

class Stock(Base):
    __tablename__ = 'stocks'
    id = Column(Integer, primary_key=True, autoincrement=True)
    ouvrage_id = Column(Integer, ForeignKey('ouvrages.id'), nullable=False)
    quantite = Column(Integer, nullable=False)
    prix_achat = Column(DECIMAL(8, 2), nullable=False)
    prix_vente = Column(DECIMAL(8, 2), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    ouvrage = relationship('Ouvrage', back_populates='stocks')

class Commentaire(Base):
    __tablename__ = 'commentaires'
    id = Column(Integer, primary_key=True, autoincrement=True)
    contenu = Column(Text, nullable=False)
    utilisateur_id = Column(BigInteger, ForeignKey('utilisateurs.id'), nullable=False)
    ouvrage_id = Column(Integer, ForeignKey('ouvrages.id'), nullable=False)
    note = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
    utilisateur = relationship('Utilisateur', back_populates='commentaires')
    ouvrage = relationship('Ouvrage', back_populates='commentaires')

class Livre(Base):
    __tablename__ = 'livres'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(191), nullable=False)
    author = Column(String(191), nullable=False)
    price = Column(Float, nullable=False)
    stock = Column(Integer, nullable=False)
