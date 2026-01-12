import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartService } from '../services/FastApiService';

const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  // Structure adaptée selon le modèle de données (Vente et LigneVente)
  const [cart, setCart] = useState({ 
    montant_total: 0,
    ligne_ventes: [] 
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Fonction pour calculer le total du panier (tous les articles sont des achats)
  const calculateTotal = (ligneVentes) => {
    return ligneVentes
      // .filter(ligne => !ligne.est_emprunt) // Tous les articles sont des achats, donc ce filtre n'est plus nécessaire si le panier est nettoyé des anciens emprunts.
      .reduce((total, ligne) => {
        return total + (ligne.quantite * ligne.prix_unitaire);
      }, 0).toFixed(2);
  };

  // Utilisez le stockage local au lieu des appels API qui n'existent pas actuellement
  const fetchCart = async () => {
    const token = localStorage.getItem('token');
    if (!token) { 
      setCart({ montant_total: 0, ligne_ventes: [] }); 
      setLoading(false); 
      return; 
    }
    
    setLoading(true);
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        const cartData = JSON.parse(savedCart);
        setCart(cartData);
      } else {
        // Initialiser un panier vide selon le modèle Vente
        const emptyCart = {
          montant_total: 0,
          ligne_ventes: []
        };
        setCart(emptyCart);
        localStorage.setItem('cart', JSON.stringify(emptyCart));
      }
    } catch (err) {
      console.error('Erreur lors du chargement du panier:', err);
      setError(err.message || 'Erreur lors du chargement du panier');
      setCart({ montant_total: 0, ligne_ventes: [] });
    } finally {
      setLoading(false);
    }
  };

  // Ajout d'un ouvrage au panier (achat uniquement) en utilisant localStorage
  const addToCart = async (ouvrage_id, quantite, prix_unitaire, ouvrageInfo, estEmpruntParam = false) => {
    const estEmprunt = false; // Forcer tous les ajouts à être des achats
    const token = localStorage.getItem('token');
    if (!token) throw new Error('Vous devez vous connecter pour ajouter au panier');
    
    try {
      // Afficher les données reçues pour le débogage
      console.log('CartContext - addToCart - Données reçues:', {
        ouvrage_id,
        quantite,
        prix_unitaire,
        ouvrageInfo
      });
      
      // Récupérer le panier actuel
      const savedCart = localStorage.getItem('cart');
      let currentCart = savedCart ? JSON.parse(savedCart) : { montant_total: 0, ligne_ventes: [] };

      // S'assurer que ligne_ventes est un tableau
      if (!currentCart || !Array.isArray(currentCart.ligne_ventes)) {
        currentCart = { montant_total: 0, ligne_ventes: [] };
      }
      
      // Conversion pour s'assurer que les valeurs sont numériques
      const quantiteNum = Number(quantite);
      
      // IMPORTANT: Utiliser le prix exact du livre, sans valeur par défaut
      // On le conserve tel que reçu de l'API, converti en nombre pour les calculs
      let prixUnitaireExact;
      
      // Ordre de priorité pour le prix: paramètre prix_unitaire > ouvrageInfo.prix_unitaire
      if (prix_unitaire !== undefined && prix_unitaire !== null) {
        prixUnitaireExact = Number(prix_unitaire);
      } else if (ouvrageInfo?.prix_unitaire !== undefined && ouvrageInfo?.prix_unitaire !== null) {
        prixUnitaireExact = Number(ouvrageInfo.prix_unitaire);
      } else {
        // Si aucun prix n'est défini, utiliser 0 (prix réel)
        prixUnitaireExact = 0;
      }
      
      console.log('CartContext - addToCart - Prix final:', {
        prix_original: prix_unitaire,
        prix_du_livre: ouvrageInfo?.prix_unitaire,
        prix_final: prixUnitaireExact
      });
      
      // Vérifier si l'ouvrage (en tant qu'achat) est déjà dans le panier
      const existingItemIndex = currentCart.ligne_ventes.findIndex(ligne => 
        ligne.ouvrage_id === ouvrage_id && ligne.est_emprunt === false
      );
      
      if (existingItemIndex >= 0) {
        // Si l'ouvrage existe déjà, mettre à jour la quantité mais GARDER le prix d'origine
        currentCart.ligne_ventes[existingItemIndex].quantite += quantiteNum;
      } else {
        // Plus de date de retour car ce sont des achats
        const dateRetour = null;
        
        // Préparer un objet ouvrage complet en s'assurant de conserver le prix exact
        const ouvrageComplet = {
          titre: ouvrageInfo?.titre || 'Ouvrage ' + ouvrage_id,
          auteur: ouvrageInfo?.auteur || 'Auteur non spécifié',
          editeur: ouvrageInfo?.editeur || 'Éditeur non spécifié',
          prix_unitaire: prixUnitaireExact, // Utiliser le prix exact du livre
          image: ouvrageInfo?.image || (ouvrageInfo?.photo || 'default-book.jpg') // Utiliser la bonne propriété d'image
        };
        
        // Conserver aussi l'ID et l'ISBN si disponibles
        if (ouvrageInfo?.id) ouvrageComplet.id = ouvrageInfo.id;
        if (ouvrageInfo?.isbn) ouvrageComplet.isbn = ouvrageInfo.isbn;
        
        // Créer la nouvelle ligne de vente avec le prix exact
        const nouvelleVente = { 
          id: Date.now(), // Générer un ID unique temporaire
          ouvrage_id: ouvrage_id,
          utilisateur_id: localStorage.getItem('userId') || null, // Si disponible
          quantite: quantiteNum,
          prix_unitaire: prixUnitaireExact, // Utiliser le prix exact du livre
          est_emprunt: false,
          date_retour: dateRetour,
          ouvrage: ouvrageComplet // Utiliser l'objet ouvrage complet
        };
        
        currentCart.ligne_ventes.push(nouvelleVente);
      }
      
      // Mettre à jour le montant total du panier (uniquement pour les achats)
      currentCart.montant_total = calculateTotal(currentCart.ligne_ventes);
      
      // Sauvegarder le panier mis à jour
      localStorage.setItem('cart', JSON.stringify(currentCart));
      await fetchCart(); // Recharger le panier après ajout
    } catch (err) {
      console.error('Erreur lors de l\'ajout au panier:', err);
      throw new Error(err.message || 'Erreur lors de l\'ajout au panier');
    }
  };

  // Suppression d'un article du panier en utilisant localStorage
  const removeFromCart = async (itemId) => {
    try {
      // Récupérer le panier actuel
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return;
      
      const currentCart = JSON.parse(savedCart);
      
      // Filtrer l'article à supprimer
      currentCart.ligne_ventes = currentCart.ligne_ventes.filter(ligne => ligne.id !== itemId);
      
      // Recalculer le montant total
      currentCart.montant_total = calculateTotal(currentCart.ligne_ventes);
      
      // Sauvegarder le panier mis à jour
      localStorage.setItem('cart', JSON.stringify(currentCart));
      await fetchCart(); // Recharger le panier après suppression
    } catch (err) {
      console.error('Erreur lors de la suppression de l\'article:', err);
      throw new Error(err.message || 'Erreur lors de la suppression de l\'article');
    }
  };

  // Mise à jour de la quantité d'un article en utilisant localStorage
  const updateQuantity = async (itemId, quantite) => {
    try {
      // Récupérer le panier actuel
      const savedCart = localStorage.getItem('cart');
      if (!savedCart) return;
      
      const currentCart = JSON.parse(savedCart);
      
      // Trouver l'article à mettre à jour
      const itemIndex = currentCart.ligne_ventes.findIndex(ligne => ligne.id === itemId);
      
      if (itemIndex >= 0) {
        // Mettre à jour la quantité
        currentCart.ligne_ventes[itemIndex].quantite = Number(quantite);
        
        // Recalculer le montant total
        currentCart.montant_total = calculateTotal(currentCart.ligne_ventes);
        
        // Sauvegarder le panier mis à jour
        localStorage.setItem('cart', JSON.stringify(currentCart));
        await fetchCart(); // Recharger le panier après mise à jour
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité:', err);
      throw new Error(err.message || 'Erreur lors de la mise à jour de la quantité');
    }
  };

  // On recharge le panier au chargement du provider
  useEffect(() => {
    fetchCart();
    // eslint-disable-next-line
  }, []);

  return (
    <CartContext.Provider value={{
      cart, 
      loading, 
      error, 
      fetchCart, 
      addToCart, 
      removeFromCart, 
      updateQuantity,
      calculateTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}
