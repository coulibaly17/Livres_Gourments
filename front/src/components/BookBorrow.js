// DEPRECATED: This file and the useBookBorrow hook are deprecated as the borrowing system is being replaced by a purchase-only system. This file is scheduled for removal.
// BookBorrow.js - Fonctionnalité d'emprunt de livres (maintenant achat)
import React, { useState } from 'react';
import { useCart } from './CartContext';
import { Snackbar, Alert, AlertTitle, Box, Typography, Fade, Paper } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';

/**
 * DEPRECATED Hook: Was for borrowing, now ensures purchase if called.
 * Uses CartContext to add books as purchases.
 */
export function useBookBorrow() { // DEPRECATED
  const [showPurchaseSuccess, setShowPurchaseSuccess] = useState(false);
  const [purchasedBook, setPurchasedBook] = useState(null);
  const { addToCart } = useCart();

  /**
   * DEPRECATED: Adds a book as a purchase if called.
   * @param {Object} book - The book to purchase (legacy call).
   */
  const purchaseBookLegacy = async (book) => { // Renamed to reflect it's a legacy borrow function now acting as purchase
    try {
      // DEPRECATED: Adding the book to the cart as a purchase.
      await addToCart(
        book.id,
        1, // quantité par défaut
        book.prix || 0, // prix pour achat
        {
          titre: book.titre,
          auteur: book.auteur,
          editeur: book.editeur,
          prix: book.prix,
          photo: book.photo,
          isbn: book.isbn
        },
        false // indiquer que c'est un achat
      );
      
      // Mettre à jour l'état pour afficher la notification
      setPurchasedBook(book);
      setShowPurchaseSuccess(true);
      
      // Fermer la notification après 3 secondes
      setTimeout(() => {
        setShowPurchaseSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.error('DEPRECATED: Erreur lors de l\'ajout pour achat (via borrowBook):', err);
      alert(err.message || 'DEPRECATED: Erreur lors de l\'ajout pour achat (via borrowBook)');
    }
  };

  /**
   * DEPRECATED: Notification component for successful purchase (legacy).
   */
  const PurchaseSuccessNotification = () => { // DEPRECATED
    if (!showPurchaseSuccess || !purchasedBook) return null;
    
    return (
      <Snackbar
        open={showPurchaseSuccess}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Fade}
      >
        <Alert 
          severity="success" 
          icon={<LibraryAddCheckIcon fontSize="inherit" />}
          variant="filled"
          elevation={6}
          sx={{ 
            width: '100%', 
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)', 
            borderRadius: 2,
            '& .MuiAlert-icon': {
              fontSize: 28,
              opacity: 0.9
            }
          }}
        >
          <Box display="flex" alignItems="center">
            <Box>
              <AlertTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>
                Livre ajouté au panier
              </AlertTitle>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                <strong>{purchasedBook.titre}</strong> a été ajouté à votre panier
              </Typography>
            </Box>
          </Box>
        </Alert>
      </Snackbar>
    );
  };

  return { purchaseBookLegacy, PurchaseSuccessNotification, showPurchaseSuccess, purchasedBook };
}

/**
 * Fonction utilitaire simple pour emprunter un livre sans utiliser le hook
 * @param {Object} book - Le livre à emprunter
 * @param {Function} addToCart - Fonction du CartContext
 */
export async function borrowBookDirect(book, addToCart) {
  try {
    await addToCart(
      book.id,
      1,
      0,
      {
        titre: book.titre,
        auteur: book.auteur,
        editeur: book.editeur,
        prix: book.prix,
        photo: book.photo,
        isbn: book.isbn
      },
      true
    );
    
    // Create and show a professional notification instead of alert
    const notificationRoot = document.createElement('div');
    notificationRoot.style.position = 'fixed';
    notificationRoot.style.bottom = '20px';
    notificationRoot.style.right = '20px';
    notificationRoot.style.zIndex = '9999';
    document.body.appendChild(notificationRoot);
    
    // Create the notification content
    const notification = document.createElement('div');
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
    notification.style.padding = '16px 24px';
    notification.style.borderRadius = '8px';
    notification.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '12px';
    notification.style.maxWidth = '400px';
    notification.style.animation = 'fadeIn 0.3s ease-out';
    notification.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
    
    notification.innerHTML = `
      <div>
        <div style="font-weight: 600; font-size: 16px; margin-bottom: 4px">Livre ajouté à vos emprunts</div>
        <div style="font-size: 14px">${book.titre} a été ajouté à votre liste d'emprunts</div>
      </div>
    `;
    
    notificationRoot.appendChild(notification);
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: translateY(0); }
        to { opacity: 0; transform: translateY(20px); }
      }
    `;
    document.head.appendChild(style);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease-in';
      setTimeout(() => {
        document.body.removeChild(notificationRoot);
      }, 300);
    }, 3000);
  } catch (err) {
    console.error('Erreur:', err);
    
    // Show error notification instead of alert
    const errorNotification = document.createElement('div');
    errorNotification.style.position = 'fixed';
    errorNotification.style.bottom = '20px';
    errorNotification.style.right = '20px';
    errorNotification.style.backgroundColor = '#f44336';
    errorNotification.style.color = 'white';
    errorNotification.style.padding = '16px 24px';
    errorNotification.style.borderRadius = '8px';
    errorNotification.style.boxShadow = '0 8px 32px rgba(0,0,0,0.15)';
    errorNotification.style.zIndex = '9999';
    errorNotification.style.fontFamily = '"Roboto", "Helvetica", "Arial", sans-serif';
    errorNotification.innerHTML = '<strong>Erreur</strong><br>Erreur lors de l\'ajout à la liste d\'emprunts';
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
      document.body.removeChild(errorNotification);
    }, 3000);
  }
}
