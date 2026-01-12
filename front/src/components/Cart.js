import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext';
import { 
  Container, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction,
  Button, 
  Divider, 
  Box,
  Alert,
  AlertTitle,
  Chip,
  Grid,
  IconButton,
  CircularProgress,
  Snackbar,
  Card, 
  CardMedia,
  CardContent,
  // Import de MuiAlert sans conflit de nom
  Alert as MuiAlert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmptyCartIcon from '@mui/icons-material/RemoveShoppingCart';
import Header from './Header';
import Footer from './Footer';
import { CartService } from '../services/FastApiService';

// Définition de appTheme
const appTheme = {
  primary: {
    main: '#6D4C41', // Brun principal
    light: '#9C786C',
    dark: '#402719',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FFCA28', // Or / Ambre pour les accents
    light: '#FFDD71',
    dark: '#C79A00',
    contrastText: '#000000',
  },
  accent: { // Couleur d'accentuation pour les boutons importants ou les badges
    main: '#D81B60', // Rose vif / Magenta
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F5F5F5', // Gris clair pour le fond général
    paper: '#FFFFFF', // Blanc pour les cartes et surfaces
    tableHeader: '#E0E0E0', // Gris pour les en-têtes de tableau/section
  },
  status: {
    success: { main: '#4CAF50', light: '#E8F5E9', dark: '#388E3C', contrastText: '#FFFFFF' }, // Vert
    warning: { main: '#FF9800', light: '#FFF3E0', dark: '#F57C00', contrastText: '#000000' }, // Orange
    error: { main: '#F44336', light: '#FFEBEE', dark: '#D32F2F', contrastText: '#FFFFFF' },   // Rouge
    info: { main: '#2196F3', light: '#E3F2FD', dark: '#1976D2', contrastText: '#FFFFFF' },     // Bleu
    delivered: { main: '#4CAF50', light: '#E8F5E9', dark: '#388E3C', contrastText: '#FFFFFF' }, // Vert pour Orders.js
    shipped: { main: '#2196F3', light: '#E3F2FD', dark: '#1976D2', contrastText: '#FFFFFF' },   // Bleu pour Orders.js
    pending: { main: '#FFC107', light: '#FFF8E1', dark: '#FFA000', contrastText: '#000000' },   // Ambre pour Orders.js
    cancelled: { main: '#757575', light: '#F5F5F5', dark: '#424242', contrastText: '#FFFFFF' }, // Gris pour Orders.js
  },
  text: {
    primary: '#212121', // Noir / Gris foncé pour le texte principal
    secondary: '#757575', // Gris moyen pour le texte secondaire
    disabled: '#BDBDBD',   // Gris clair pour le texte désactivé
    hint: '#9E9E9E',       // Gris pour les indices
  },
  common: {
    black: '#000000',
    white: '#FFFFFF',
  },
};

// Nous utiliserons directement MuiAlert pour les notifications

function Cart() {
  const { cart, loading, error, fetchCart, removeFromCart, updateQuantity, addToCart } = useCart();
  const [message, setMessage] = useState('');
  const [orderProcessing, setOrderProcessing] = useState(false);
  // Ajout de l'état pour les notifications snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Fonction pour fermer les notifications snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  // Implémentation de handlePurchaseBook utilisée par les composants qui l'appellent
  const handlePurchaseBook = async (book, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      // S'assurer que book a les bonnes propriétés
      await addToCart(
        book.id,
        1,
        book.prix || 0, // Utiliser le prix exact du livre
        {
          titre: book.titre,
          auteur: book.auteur,
          editeur: book.editeur,
          prix_unitaire: book.prix,
          image: book.photo || 'default-book.jpg',
          isbn: book.isbn
        },
        false // Explicitement pour achat
      );
      setSnackbar({ 
        open: true, 
        message: `"${book.titre}" a été ajouté à votre panier.`, 
        severity: 'success' 
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      setSnackbar({ 
        open: true, 
        message: `Erreur lors de l'ajout au panier: ${error.message || 'Erreur inconnue'}`, 
        severity: 'error' 
      });
    }
  };

  const order = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('not-logged-in');
      return;
    }
    
    setMessage('');
    setOrderProcessing(true);
    try {
      const result = await CartService.checkout();
      console.log('Commande passée avec succès:', result);
      setMessage('success');
      fetchCart(); 
    } catch (err) {
      console.error('Erreur détaillée lors de la commande:', err);
      setMessage('error');
      if (err.response) { 
        if (err.response.status === 400) {
          setMessage('invalid-items');
        } else if (err.response.status === 401) {
          setMessage('not-logged-in');
        }
      } else if (err.message.includes('Network Error')) {
        setMessage('server-error'); 
      }
    } finally {
      setOrderProcessing(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      // Vérifier si cart et cart.achats existent avant d'utiliser find()
      let articleName = '';
      if (cart && cart.achats && Array.isArray(cart.achats)) {
        // Trouver le titre de l'article avant de le supprimer
        const itemToRemove = cart.achats.find(item => 
          (item.id_ligne_vente === itemId || item.id === itemId)
        );
        
        if (itemToRemove && itemToRemove.ouvrage && itemToRemove.ouvrage.titre) {
          articleName = `"${itemToRemove.ouvrage.titre}"`;
        }
      }
      
      // Supprimer l'article du panier
      await removeFromCart(itemId);
      
      // Afficher une notification de succès
      setSnackbar({
        open: true,
        message: `Article ${articleName} supprimé du panier`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      setSnackbar({
        open: true,
        message: `Erreur lors de la suppression: ${err.message || 'Veuillez réessayer'}`,
        severity: 'error'
      });
    }
  };

  const handleQuantityChange = async (itemId, currentQuantity, change) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    if (newQuantity === currentQuantity) return;
    
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la quantité:', err);
    }
  };

  const fixCartData = () => {
    try {
      // Si le panier n'existe pas ou n'a pas de ligne_ventes
      if (!cart || !Array.isArray(cart.ligne_ventes)) return;
      
      console.log('Analyse des données du panier...');
      console.log('État actuel du panier:', cart);
      
      // Créer une copie profonde du panier pour éviter de modifier l'état directement
      let updatedCart = JSON.parse(JSON.stringify(cart));
      
      // Observer chaque ligne de vente sans modifier les prix
      updatedCart.ligne_ventes.forEach(ligne => {
        // Conversion du prix en nombre pour assurer la cohérence du type
        // MAIS conserver le prix exact tel qu'il est enregistré
        if (ligne.prix_unitaire !== undefined && ligne.prix_unitaire !== null) {
          ligne.prix_unitaire = parseFloat(ligne.prix_unitaire);
          console.log(`Article: ${ligne.ouvrage?.titre}, Prix unitaire: ${ligne.prix_unitaire}`);
        } else {
          console.log(`Article sans prix: ${ligne.ouvrage?.titre}`);
        }         
        // S'assurer que ouvrage existe
        if (!ligne.ouvrage) {
          ligne.ouvrage = {
            titre: `Livre ${ligne.ouvrage_id || 'inconnu'}`,
            auteur: 'Auteur inconnu',
            image: 'default-book.jpg',
            prix_unitaire: ligne.prix_unitaire
          };
        } else {
          // Assurer que l'image existe
          if (!ligne.ouvrage.image) {
            ligne.ouvrage.image = ligne.ouvrage.photo || 'default-book.jpg';
          }
          
          // Copier le prix_unitaire dans l'objet ouvrage
          ligne.ouvrage.prix_unitaire = ligne.prix_unitaire;
        }
      });
      
      // Sauvegarder dans localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      console.log('Panier corrigé:', updatedCart);
      
      return updatedCart;
    } catch (err) {
      console.error('Erreur lors de la correction du panier:', err);
      return cart;
    }
  };

  const renderContent = () => {
    // Si le chargement est en cours, afficher le spinner
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress size={60} thickness={4} />
        </Box>
      );
    }

    // Si une erreur est survenue
    if (error) {
      return (
        <Alert severity="error" variant="filled" sx={{ py: 2, borderRadius: 2 }}>
          <AlertTitle>Erreur</AlertTitle>
          {error}
        </Alert>
      );
    }
    
    // Corriger les données avant de les utiliser
    const correctedCart = fixCartData() || cart;

    console.log('[Cart.renderContent] Start. Loading:', loading, 'Error:', error, 'Cart:', correctedCart);
    console.log('[Cart.renderContent] Before emprunts/achats. correctedCart?.ligne_ventes:', correctedCart?.ligne_ventes);
    const emprunts = correctedCart?.ligne_ventes?.filter(ligne => ligne.est_emprunt) || [];
    const achats = correctedCart?.ligne_ventes?.filter(ligne => !ligne.est_emprunt) || [];
    console.log('[Cart.renderContent] After emprunts/achats. Emprunts:', emprunts, 'Achats:', achats);
    
    if (!correctedCart || (!Array.isArray(correctedCart.ligne_ventes) || correctedCart.ligne_ventes.length === 0)) {
      return (
        <Box textAlign="center" py={5}>
          <EmptyCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Votre panier est tristement vide</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Parcourez nos rayons virtuels pour trouver votre prochaine lecture passionnante !
          </Typography>
          <Button 
            variant="contained" 
            // color="primary" // Sera défini par sx
            component={Link} 
            to="/ouvrages"
            startIcon={<ShoppingCartIcon />}
            sx={{
              backgroundColor: appTheme.accent.main,
              color: 'white',
              '&:hover': {
                backgroundColor: appTheme.accent.dark,
              },
              borderRadius: '20px', 
              px: 3, 
              py: 1.2, 
              textTransform: 'none', 
              fontSize: '1rem',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            Explorer les ouvrages
          </Button>
        </Box>
      );
    }

    console.log("Détails des articles pour calcul:", achats.map(a => ({ 
      id: a.id_ligne_vente || a.id,
      prix: a.prix_unitaire, 
      quantite: a.quantite,
      ouvrage: a.ouvrage
    })));
    
    // Utiliser exactement le prix défini pour chaque article, même si c'est 0
    const subTotal = achats.reduce((acc, ligne) => {
      // Utiliser le prix exact tel qu'il est défini, converti en nombre pour les calculs
      const prix = typeof ligne.prix_unitaire === 'string' ? parseFloat(ligne.prix_unitaire) : ligne.prix_unitaire;
      // Notez qu'on n'utilise pas de valeur par défaut ici - c'est le prix exact qui compte
      console.log(`Article ${ligne.ouvrage?.titre} - Prix original: ${ligne.prix_unitaire}, Prix calculé: ${prix} x Quantité: ${ligne.quantite} = ${prix * ligne.quantite}`);
      return acc + (prix * ligne.quantite);
    }, 0);
    const cartTotal = subTotal; 

    return (
      <Box sx={{ 
        backgroundColor: '#fcf5e9', /* Fond caramel très clair */
        borderRadius: '16px', 
        p: 3,
        boxShadow: 'inset 0 0 15px rgba(139, 69, 19, 0.1)',
        border: '1px solid #e6ccb3'
      }}>
        {achats.length > 0 && (
          <Box mb={4}>
            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2.5, color: appTheme.primary.dark }}>
              Vos articles ({achats.length})
            </Typography>
            <Grid container spacing={3}>
              {achats.map((ligne) => {
              // AJOUT DES LOGS DE DÉBOGAGE
              console.log('------------------------------------');
              console.log('Ligne ID:', ligne.id_ligne_vente || ligne.ouvrage_id);
              console.log('Ouvrage:', ligne.ouvrage);
              console.log('Image URL:', ligne.ouvrage?.image);
              console.log('Typeof Image URL:', typeof ligne.ouvrage?.image);
              console.log('Titre:', ligne.ouvrage?.titre);
              console.log('Typeof Titre:', typeof ligne.ouvrage?.titre);
              console.log('------------------------------------');
              return (
                <Grid item xs={12} key={ligne.id_ligne_vente || ligne.ouvrage_id}>
                  <Card sx={{ 
                    display: 'flex', 
                    borderRadius: '12px', 
                    boxShadow: '0 6px 20px rgba(0,0,0,0.07)', 
                    overflow: 'hidden',
                    transition: 'box-shadow 0.3s ease-in-out',
                    '&:hover': {
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        width: { xs: 100, sm: 130 }, 
                        height: 'auto', // Permet de garder le ratio de l'image
                        objectFit: 'cover', 
                        // borderRight: `1px solid ${appTheme.background.default}`,
                        p: 0.5, // Petit padding pour l'image
                        borderRadius: '8px 0 0 8px' // Arrondir seulement le coin de l'image
                      }}
                      image={ligne.ouvrage?.image ? 
                        (ligne.ouvrage.image.startsWith('/') ? ligne.ouvrage.image : `/img/${ligne.ouvrage.image}`) : 
                        `/img/default-book.jpg`}
                      onError={(e) => {
                        console.log('Image error, falling back to default');
                        e.target.src = '/img/default-book.jpg';
                      }}
                      alt={ligne.ouvrage?.titre || 'Livre'}
                    />
                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, flexGrow: 1 }}>
                      <CardContent sx={{ flex: '1 1 auto', p: { xs: 1.5, sm: 2, md: 2.5 }, pb: {xs: 1, sm: '12px !important'} }}>
                        <Typography component="div" variant="h6" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.3, color: appTheme.primary.dark }}>
                          {ligne.ouvrage?.titre || 'Titre non disponible'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Par {ligne.ouvrage?.auteur || 'Auteur inconnu'}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight="bold" sx={{ color: appTheme.primary.main }}>
                            Prix unitaire :
                          </Typography>
                          <Box sx={{ 
                            backgroundColor: '#f5e9d4', /* Couleur caramel clair */
                            px: 1.5, 
                            py: 0.5, 
                            borderRadius: '8px',
                            ml: 1
                          }}>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#8B5A2B' /* Caramel foncé */ }}>
                              {parseFloat(ligne.prix_unitaire || 0).toFixed(2)} €
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box display="flex" alignItems="center" sx={{ mb: { xs: 1.5, sm: 0 } }}>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(ligne.id_ligne_vente, ligne.quantite, -1)} 
                            disabled={ligne.quantite <= 1}
                            aria-label="diminuer quantité"
                            sx={{ border: `1px solid #ddd`, borderRadius: '4px', mr: 1, p:0.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)'} }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography variant="body1" sx={{ mx: 1, fontWeight: 'medium', minWidth: '20px', textAlign: 'center' }}>{ligne.quantite}</Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleQuantityChange(ligne.id_ligne_vente, ligne.quantite, 1)} 
                            aria-label="augmenter quantité"
                            sx={{ border: `1px solid #ddd`, borderRadius: '4px', ml: 1, p:0.5, '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)'} }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: { xs: 'row', sm: 'column' }, 
                        justifyContent: { xs: 'space-between', sm: 'center' }, 
                        alignItems: 'center', 
                        p: { xs: 1.5, sm: 2, md: 2.5 }, 
                        pt: {xs: 1, sm: 2}, 
                        borderLeft: { sm: `1px solid ${appTheme.background.default}` },
                        backgroundColor: { xs: 'transparent', sm: '#fdfdfd'}
                      }}>
                        <Box sx={{ 
                          backgroundColor: '#f0e6d2', /* Caramel très clair */
                          borderRadius: '10px', 
                          px: 2, 
                          py: 1,
                          textAlign: 'center', 
                          mb: { sm: 1 },
                          border: '1px solid #d4a76a'
                        }}>
                          <Typography variant="h6" fontWeight="bold" color="#8B4513" /* Caramel foncé (SaddleBrown) */>
                            {(parseFloat(ligne.prix_unitaire || 0) * ligne.quantite).toFixed(2)} €
                          </Typography>
                          <Typography variant="caption" sx={{ display: 'block', mt: 0.2, color: '#a67c52' /* Caramel moyen */ }}>
                            Total
                          </Typography>
                        </Box>
                        <IconButton 
                          color="error" 
                          onClick={() => handleRemoveItem(ligne.id || ligne.id_ligne_vente)} 
                          aria-label="supprimer l'article"
                          sx={{ '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.08)' } }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Card>
                </Grid>
              ); })}
            </Grid>
          </Box>
        )}

        {emprunts.length > 0 && (
          <Box mb={4} mt={achats.length > 0 ? 5 : 0}>
            <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 2, fontStyle: 'italic' }}>
              Articles de l'ancien système d'emprunt (pour information)
            </Typography>
            <Paper elevation={0} sx={{ p: 2, borderRadius: 2, backgroundColor: '#f0f0f0', border: '1px dashed #ccc' }}>
              <Box p={2} textAlign="center">
                <InfoIcon sx={{ fontSize: 36, color: appTheme.info.main, mb: 1 }} />
                <Typography variant="body1" sx={{ mb: 1 }}>
                  {emprunts.length} article(s) de l'ancien système d'emprunt présent(s) dans le panier.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ces articles ne sont plus pris en charge dans le système d'achat actuel.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 2 }}
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    // Vous pouvez implémenter une fonction pour supprimer tous les emprunts
                    console.log('Suppression des emprunts demandée');
                    // Code pour supprimer les emprunts
                  }}
                >
                  Vider les anciens emprunts
                </Button>
              </Box>
            </Paper>
          </Box>
        )}

        {(achats.length > 0 || emprunts.length > 0) && (
            <Paper elevation={3} sx={{ 
                p: { xs: 2, sm: 3, md: 3.5 }, 
                borderRadius: '16px', 
                mt: 4, 
                boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                border: `1px solid ${appTheme.background.default}`
            }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 2.5, textAlign: 'center', color: appTheme.primary.dark }}>
                    Récapitulatif de votre commande
                </Typography>
                {achats.length > 0 && (
                    <>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                            <Typography variant="body1" color="text.secondary">Sous-total ({achats.length} article{achats.length > 1 ? 's' : ''})</Typography>
                            <Typography variant="body1" fontWeight="medium" sx={{ 
                              backgroundColor: '#f8f1e4', /* Caramel très clair */
                              px: 1.5, 
                              py: 0.5, 
                              borderRadius: '6px',
                              border: '1px solid #d4a76a', /* Bordure caramel */
                              color: '#8B5A2B' /* Texte caramel foncé */
                            }}>
                              {subTotal.toFixed(2)} €
                            </Typography>
                        </Box>
                        {/* Possibilité d'ajouter des frais de port ici plus tard */} 
                        <Divider sx={{ my: 2, borderColor: appTheme.background.default }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} mb={1}>
                            <Typography variant="h6" fontWeight="bold">Total à régler</Typography>
                            <Box sx={{ 
                              backgroundColor: '#e6ccb3', /* Caramel moyen clair */
                              px: 2, 
                              py: 1, 
                              borderRadius: '10px', 
                              minWidth: '100px', 
                              textAlign: 'center',
                              border: '1px solid #b38867', /* Bordure caramel foncé */
                              boxShadow: '0 2px 8px rgba(139, 69, 19, 0.15)' /* Ombre caramel */
                            }}>
                              <Typography variant="h6" fontWeight="bold" color="#8B4513" /* Caramel foncé (SaddleBrown) */>
                                  {cartTotal.toFixed(2)} €
                              </Typography>
                            </Box>
                        </Box>
                        <Button 
                            variant="contained" 
                            fullWidth 
                            size="large" 
                            onClick={order} 
                            disabled={orderProcessing || achats.length === 0}
                            startIcon={<LocalShippingIcon />}
                            sx={{ 
                                mt: 3, 
                                py: 1.5, 
                                fontSize: '1.1rem', 
                                fontWeight: 'bold', 
                                borderRadius: '10px', 
                                textTransform: 'none', 
                                backgroundColor: '#D2691E', /* Caramel (Chocolat) */
                                color: 'white',
                                boxShadow: '0 4px 14px rgba(139, 69, 19, 0.35)',
                                '&:hover': {
                                    backgroundColor: '#A0522D', /* Caramel plus foncé au survol (Sienna) */
                                    boxShadow: '0 6px 18px rgba(139, 69, 19, 0.5)'
                                },
                                '&.Mui-disabled': {
                                  backgroundColor: '#bdc3c7',
                                  color: '#7f8c8d',
                                  boxShadow: 'none'
                                }
                            }}
                        >
                            {orderProcessing ? 'Validation en cours...' : 'Passer au paiement'}
                        </Button>
                    </>
                )}
                {emprunts.length > 0 && achats.length === 0 && (
                    <Alert severity="info" icon={<MenuBookIcon />} sx={{ mt: 0, borderRadius: 2, backgroundColor: '#e9ecef', color: '#495057' }}>
                        <AlertTitle sx={{ fontWeight: 'bold' }}>Articles d'emprunt</AlertTitle>
                        Votre panier contient uniquement des articles de l'ancien système d'emprunt. Ceux-ci sont conservés à titre informatif mais ne peuvent être payés.
                        Pour passer une commande, veuillez ajouter des articles disponibles à l'achat.
                    </Alert>
                )}
            </Paper>
        )}

        {message && !orderProcessing && (
            <Box mt={3}>
                {message === 'success' && (
                <Alert severity="success" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Commande validée avec succès !</AlertTitle>
                    Votre commande a bien été enregistrée. Vous allez bientôt recevoir une confirmation par email. Vous pouvez consulter son statut dans "Mes Commandes".
                </Alert>
                )}
                {message === 'error' && (
                <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Oups, une erreur est survenue</AlertTitle>
                    Impossible de valider votre commande pour le moment. Veuillez vérifier les articles de votre panier et réessayer. Si le problème persiste, contactez notre support.
                </Alert>
                )}
                {message === 'not-logged-in' && (
                <Alert severity="warning" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Connexion requise</AlertTitle>
                    Pour finaliser votre commande, veuillez vous connecter à votre compte. <Link to="/login" style={{ color: 'inherit', fontWeight: 'bold' }}>Se connecter ici</Link>
                </Alert>
                )}
                {message === 'invalid-items' && (
                <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Articles non disponibles</AlertTitle>
                    Certains articles de votre panier ont peut-être été modifiés ou ne sont plus disponibles. Veuillez rafraîchir la page ou vérifier votre panier.
                </Alert>
                )}
                {message === 'server-error' && (
                <Alert severity="error" sx={{ borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <AlertTitle sx={{ fontWeight: 'bold' }}>Problème de serveur</AlertTitle>
                    Nous rencontrons un souci technique. Votre commande n'a pas pu être traitée. Veuillez réessayer dans quelques instants.
                </Alert>
                )}
            </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: { xs: 10, md: 12 }, mb: 8 }}> 
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, backgroundColor: 'transparent' }}> 
          <Box display="flex" alignItems="center" mb={3}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: { xs: 28, md: 32 }, mr: 1.5 }} />
            <Typography variant="h4" component="h1" fontWeight="bold">Mon Panier</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          {renderContent()}
        </Paper>
      </Container>
      <Footer />
      
      {/* Composant Snackbar pour les notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert 
          elevation={6} 
          variant="filled" 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  );
}

export default Cart;
