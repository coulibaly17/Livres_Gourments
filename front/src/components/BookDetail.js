import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  Grid, 
  Button, 
  TextField, 
  Divider,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Rating,
  Alert,
  AlertTitle,
  Snackbar,
  MuiAlert,
  CircularProgress,
  IconButton,
  Breadcrumbs,
  Stack,
  Fade,
  Link, // Ajout de l'import pour MUI Link
  List,
  ListItem,
  ListItemText,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CategoryIcon from '@mui/icons-material/Category';
import PersonIcon from '@mui/icons-material/Person';
import PublishIcon from '@mui/icons-material/Publish';
import InventoryIcon from '@mui/icons-material/Inventory';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import StarIcon from '@mui/icons-material/Star';
import VerifiedIcon from '@mui/icons-material/Verified';
import StorefrontIcon from '@mui/icons-material/Storefront';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ForumIcon from '@mui/icons-material/Forum';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Header from './Header';
import Footer from './Footer';
import { OuvragesService, CommentairesService } from '../services/FastApiService';

// Styles personnalisés pour les éléments avec effets de survol
const HoverableImage = styled('img')(({ theme }) => ({
  transition: 'transform 0.4s ease, filter 0.4s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    filter: 'brightness(1.1)'
  }
}));

// Composant pour les cartes avec effet de survol
const HoverCard = styled(Paper)(({ theme }) => ({
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  borderRadius: '12px',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(139, 90, 43, 0.15)'
  }
}));

// Composant pour les boutons avec effet de survol élégant
const HoverButton = styled(Button)(({ theme, color = 'primary' }) => ({
  transition: 'all 0.3s ease',
  borderRadius: '28px',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.7s ease'
  },
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 7px 15px rgba(${color === 'primary' ? '139, 90, 43' : '211, 47, 47'}, 0.3)`,
    '&::before': {
      left: '100%'
    }
  },
  '&:active': {
    transform: 'translateY(1px)'
  }
}));

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // État pour Snackbar (notification)
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [message, setMessage] = useState('success');
  
  // États pour les commentaires
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentError, setCommentError] = useState(null);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [stockLoading, setStockLoading] = useState(true);
  const [stockError, setStockError] = useState('');
  const [stockQuantity, setStockQuantity] = useState(null);

  useEffect(() => {
    setLoading(true);
    setStockLoading(true);
    setError('');
    setStockError('');
    
    // Chargement des détails du livre
    OuvragesService.getById(id)
      .then(data => {
        console.log('Données du livre reçues de l\'API:', data);
        setBook(data);
        setLoading(false);
        // After fetching book details, fetch stock quantity
        return OuvragesService.getOuvrageStock(id);
      })
      .then(stockData => {
        setStockQuantity(stockData.total_quantity);
        setStockLoading(false);
      })
      .catch(err => {
        console.error('Erreur lors de la récupération des détails du livre ou du stock:', err);
        if (loading) { // Error occurred while fetching book details
          setError(err.data?.detail || err.message || 'Erreur de chargement du livre.');
          setLoading(false);
        }
        // If book details loaded but stock failed, stockError will be set
        setStockError(err.data?.detail || err.message || 'Erreur de chargement du stock.');
        setStockLoading(false);
      });
      
    // Chargement des commentaires
    fetchComments();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      // Afficher toutes les infos du livre pour débogage
      console.log('Ajout au panier - Détails complets du livre:', book);
      console.log('Prix du livre:', book.prix);
      
      // Vérifier explicitement si le prix est défini
      if (book.prix === undefined || book.prix === null) {
        console.error('ATTENTION: Le prix du livre est manquant!', book.id, book.titre);
      }
      
      // Utiliser le prix exact tel que défini dans le livre
      // On le garde tel quel sans valeur par défaut ni conversion
      const bookPrice = book.prix;
      
      // Préparer un objet complet avec toutes les données importantes du livre
      // notamment le prix exact et l'image
      const bookInfo = {
        titre: book.titre,
        auteur: book.auteur,
        editeur: book.editeur,
        prix_unitaire: bookPrice,
        image: book.photo, 
        isbn: book.isbn,
        id: book.id
      };
      
      console.log('Données envoyées au panier:', {
        id: book.id,
        quantite: quantity,
        prix: bookPrice,
        infos: bookInfo
      });
      
      // Appel à la fonction d'ajout au panier avec les données complètes
      await addToCart(
        book.id, 
        quantity, 
        bookPrice,
        bookInfo,
        false // indiquer que c'est un achat
      );
      setMessage('success');
      setSnackbarOpen(true);
    } catch (e) {
      setMessage('error');
      setSnackbarOpen(true);
      console.error('Erreur lors de l\'ajout au panier pour achat:', e);
    }
  };

  // Fonctions pour gérer les commentaires
  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      setCommentError(null);
      
      if (!id) {
        throw new Error('ID du livre non défini');
      }
      
      // Convertir l'ID en nombre pour s'assurer du bon format
      const numericId = parseInt(id, 10);
      
      // Appel API réel pour récupérer les commentaires
      console.log('Récupération des commentaires pour le livre ID:', numericId);
      const commentsData = await CommentairesService.getByOuvrage(numericId);
      
      console.log('Commentaires chargés:', commentsData);
      
      // Si l'API renvoie null ou undefined, considérer comme une liste vide
      if (!commentsData) {
        setComments([]);
        console.log('Aucun commentaire trouvé pour ce livre');
      } else {
        setComments(Array.isArray(commentsData) ? commentsData : []);
      }
      setLoadingComments(false);
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
      // Initialiser les commentaires comme un tableau vide en cas d'erreur
      setComments([]);
      setCommentError(
        error.response?.data?.detail || 
        error.data?.detail || 
        error.message ||
        'Impossible de charger les commentaires. Veuillez réessayer plus tard.'
      );
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    try {
      if (!commentContent.trim()) {
        setCommentError('Veuillez entrer un commentaire');
        return;
      }
      
      if (!id) {
        setCommentError('Identifiant du livre non disponible');
        return;
      }
      
      setCommentError(null);

      // Récupérer l'ID utilisateur du localStorage (ou d'un contexte d'authentification)
    const userData = localStorage.getItem('user');
    console.log('Données utilisateur dans localStorage:', userData);
    
    // Essayer différentes méthodes pour récupérer les informations utilisateur
    let user = null;
    
    // Méthode 1: Utiliser localStorage.getItem('user')
    if (userData) {
      try {
        user = JSON.parse(userData);
        console.log('Utilisateur récupéré du localStorage:', user);
      } catch (err) {
        console.error('Erreur de parsing des données utilisateur:', err);
      }
    }
    
    // Si aucun utilisateur n'est trouvé, essayer avec sessionStorage
    if (!user || !user.id) {
      const sessionUserData = sessionStorage.getItem('user');
      console.log('Données utilisateur dans sessionStorage:', sessionUserData);
      if (sessionUserData) {
        try {
          user = JSON.parse(sessionUserData);
          console.log('Utilisateur récupéré du sessionStorage:', user);
        } catch (err) {
          console.error('Erreur de parsing des données sessionStorage:', err);
        }
      }
    }
    
    // Méthode 3: Essayer avec différentes clés de stockage
    const possibleKeys = ['utilisateur', 'user', 'currentUser', 'userData'];
    if (!user || !user.id) {
      for (const key of possibleKeys) {
        if (!user || !user.id) {
          const altUserData = localStorage.getItem(key);
          if (altUserData) {
            try {
              user = JSON.parse(altUserData);
              console.log(`Utilisateur récupéré avec clé ${key}:`, user);
              if (user && user.id) break;
            } catch (err) {}
          }
        }
      }
    }
    
    // Si toujours aucun utilisateur, créer un utilisateur temporaire pour le test (seulement pour débogage)
    if (!user || !user.id) {
      // Simulation d'un utilisateur pour déboguer
      user = {
        id: 1, // ID utilisateur simulé
        nom: 'Utilisateur Test',
        email: 'test@example.com'
      };
      console.log('⚠️ DÉBOGAGE: Utilisation d\'un utilisateur simulé pour test:', user);
      // Sauvegarder cet utilisateur dans localStorage pour les futurs commentaires
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    // Si l'utilisateur est connecté, on peut continuer
    if (!user || !user.id) {
      setCommentError('Vous devez être connecté pour laisser un commentaire');
      console.error('Impossible de trouver les informations utilisateur');
      return;
    }  
      
      // Préparer les données du commentaire
      const commentData = {
        utilisateur_id: parseInt(user.id, 10),
        ouvrage_id: parseInt(id, 10),
        note: parseInt(commentRating, 10),
        contenu: commentContent.trim(),
        // Valeurs par défaut pour s'assurer que toutes les données requises sont présentes
        statut: 'en_attente'
      };
      
      console.log('Envoi du commentaire:', commentData);
      
      // Envoyer le commentaire à l'API
      const newComment = await CommentairesService.create(commentData);
      
      console.log('Commentaire créé avec succès:', newComment);
      
      // Actualiser la liste des commentaires
      await fetchComments();
      
      // Réinitialiser le formulaire
      setCommentContent('');
      setCommentRating(5);
      setCommentSuccess(true);
      
      // Afficher un message de succès temporaire
      setTimeout(() => setCommentSuccess(false), 5000);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
      setCommentSuccess(false);
      setCommentError(
        error.response?.data?.detail || 
        error.data?.detail ||
        error.message ||
        'Une erreur est survenue lors de l\'ajout du commentaire. Veuillez réessayer.'
      );
    }
  };

  const handleCommentChange = (event) => {
    setCommentContent(event.target.value);
    setCommentError(null); // Effacer les erreurs quand l'utilisateur commence à écrire
  };

  const handleRatingChange = (event) => {
    setCommentRating(event.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleQuantityChange = (event) => {
    let value = parseInt(event.target.value, 10);
    const maxAllowed = stockQuantity !== null && stockQuantity > 0 ? Math.min(stockQuantity, 3) : 1;

    if (isNaN(value) || value < 1) {
      value = 1;
    } else if (value > maxAllowed) {
      value = maxAllowed;
    }
    setQuantity(value);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="calc(100vh - 200px)">
          <CircularProgress size={60} />
          <Typography variant="h6" sx={{ ml: 2 }}>Chargement des détails du livre...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Paper elevation={1} sx={{ 
          p: 2, 
          mt: 2, 
          borderRadius: 2, 
          backgroundColor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(139,90,43,0.15)',
            backgroundColor: '#fcfaf7'
          }
        }}>
          <Alert severity="error" variant="filled">
            <AlertTitle>Erreur de chargement</AlertTitle>
            {error} — Veuillez réessayer ou contacter le support.
          </Alert>
        </Paper>
      );
    }

    const isInStock = !stockLoading && stockQuantity !== null && stockQuantity > 0;

    if (!book) {
      return (
        <Paper elevation={1} sx={{ 
          p: 2, 
          mt: 2, 
          borderRadius: 2, 
          backgroundColor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(139,90,43,0.15)',
            backgroundColor: '#fcfaf7'
          }
        }}>
          <Alert severity="warning" variant="filled">
            <AlertTitle>Livre non trouvé</AlertTitle>
            Le livre que vous cherchez n'est pas disponible ou a été retiré.
          </Alert>
        </Paper>
      );
    }

    return (
      <Fade in={true} timeout={500}>
        <Paper elevation={2} sx={{ 
          p: { xs: 2, md: 4 }, 
          borderRadius: 3, 
          overflow: 'hidden',
          backgroundImage: 'linear-gradient(to bottom right, #f5f0ea, #ffffff)',
          border: '1px solid #e6d7c3',
          transition: 'all 0.4s ease',
          boxShadow: '0 10px 30px rgba(139, 90, 43, 0.1)',
          '&:hover': {
            boxShadow: '0 15px 35px rgba(139, 90, 43, 0.15)',
            transform: 'translateY(-5px)',
            backgroundImage: 'linear-gradient(to bottom right, #f7f3ee, #ffffff)'
          }
        }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3, fontSize: '0.9rem' }}>
            <Link component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Accueil
            </Link>
            <Link component={RouterLink} to="/ouvrages" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
              <MenuBookIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Catalogue
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 500 }}>{book.titre}</Typography>
          </Breadcrumbs>

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {/* Colonne Image */}
            <Grid item xs={12} md={5}>
              <Card 
                elevation={3} 
                className="book-cover-card"
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'hidden', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  p: 1,
                  background: (theme) => `linear-gradient(145deg, ${theme.palette.grey[200]}, ${theme.palette.grey[400]})`,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                  },
                  position: 'relative'
                }}
              >
                <CardMedia
                  component="img"
                  image={(book.photo && book.photo.startsWith('/')) ? book.photo : (book.photo ? `/img/${book.photo}` : '/img/default-book.jpg')}
                  alt={`Couverture de ${book.titre}`}
                  sx={{
                    width: '100%',
                    maxWidth: 350,
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'contain',
                    borderRadius: 1.5,
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      filter: 'brightness(1.05)',
                      transform: 'translateY(-5px)'
                    }
                  }}
                />  
              </Card>
            </Grid>

            {/* Colonne Détails */}
            <Grid item xs={12} md={7}>
              <Stack spacing={2} sx={{ height: '100%', p: { xs: 1, md: 2 }, borderRadius: 2 }}>
                <Typography 
                  variant="h3" 
                  component="h1" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    color: 'primary.dark', 
                    letterSpacing: 0.5,
                    position: 'relative',
                    display: 'inline-block',
                    '&:after': {
                      content: '""',
                      position: 'absolute',
                      width: '60px',
                      height: '4px',
                      bottom: '-8px',
                      left: '0',
                      backgroundColor: 'primary.main',
                      borderRadius: '2px',
                      transition: 'width 0.3s ease-in-out'
                    },
                    '&:hover:after': {
                      width: '100px'
                    }
                  }}
                >
                  {book.titre}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ 
                  color: 'text.secondary', 
                  p: 1, 
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(5px)'
                  }
                }}>
                  <PersonIcon fontSize="small" />
                  <Typography variant="subtitle1"><strong>Auteur :</strong> {book.auteur || 'Non spécifié'}</Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ 
                  color: 'text.secondary', 
                  p: 1, 
                  borderRadius: 1,
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    backgroundColor: 'rgba(0, 0, 0, 0.04)',
                    transform: 'translateX(5px)'
                  }
                }}>
                  <PublishIcon fontSize="small" />
                  <Typography variant="subtitle1"><strong>Éditeur :</strong> {book.editeur || 'Non spécifié'}</Typography>
                </Stack>

                {book.annee_publication && (
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ 
                    color: 'text.secondary', 
                    p: 1, 
                    borderRadius: 1,
                    transition: 'all 0.2s ease',
                    '&:hover': { 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      transform: 'translateX(5px)'
                    }
                  }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="subtitle1"><strong>Publié en :</strong> {book.annee_publication}</Typography>
                  </Stack>
                )}

                {book.categorie && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CategoryIcon fontSize="small" color="primary" />
                    <Chip label={book.categorie} color="primary" variant="outlined" size="small" sx={{ fontWeight: 500 }} />
                  </Stack>
                )}
                
                {book.isbn && (
                  <Typography variant="body2" color="text.secondary">ISBN: {book.isbn}</Typography>
                )}

                <Divider sx={{ my: 2, borderColor: 'grey.300' }} />

                <Typography variant="h4" color="secondary.main" sx={{ fontWeight: 600, mb: 1 }}>
                  {book.prix ? `${book.prix.toFixed(2)} €` : 'Prix non disponible'}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                  <InventoryIcon color={isInStock ? 'success' : 'error'} />
                  <Typography 
                    color={isInStock ? 'success.main' : 'error.main'} 
                    sx={{ fontWeight: 'bold' }}
                  >
                    {stockLoading 
                      ? 'Vérification...'
                      : stockError 
                        ? 'Erreur stock'
                        : isInStock 
                          ? `En stock` 
                          : 'Rupture de stock'}
                  </Typography>
                </Stack>

                {book.description && (
                  <Paper elevation={0} sx={{ p: 2, backgroundColor: 'grey.50', borderRadius: 1.5, mt: 1 }}>
                    <Typography variant="body1" paragraph sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
                      {book.description}
                    </Typography>
                  </Paper>
                )}

                {/* Section Achat */}
                <Paper 
                  elevation={3} 
                  sx={{ 
                    mb: 3, 
                    overflow: 'hidden', 
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Typography variant="h6" color="primary.main" gutterBottom sx={{ fontWeight: 600 }}>
                    Acheter ce livre
                  </Typography>
                  <Alert severity="info" icon={<LocalShippingIcon />} sx={{ mb: 2, fontSize: '0.95rem' }}>
                    Ajoutez ce livre à votre panier pour l'acheter et profiter de sa lecture.
                  </Alert>
                  
                  <Box my={2}>
                    {stockLoading && <Typography variant="body2" color="text.secondary"><CircularProgress size={16} sx={{mr:1, verticalAlign: 'middle'}} />Chargement du stock...</Typography>}
                    {stockError && !stockLoading && <Alert severity="warning" sx={{mb:1, fontSize: '0.9rem'}}>Impossible de charger le stock: {stockError}</Alert>}
                    {!stockLoading && stockQuantity !== null && (
                      <Typography variant="body1" component="div" sx={{ fontWeight: 'bold', color: stockQuantity > 0 ? 'success.main' : 'error.main' }}>
                        {stockQuantity > 0 ? `Disponible : ${stockQuantity} unité(s)` : 'Rupture de stock'}
                      </Typography>
                    )}
                  </Box>

                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                      <TextField
                        label="Quantité"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1, max: (stockQuantity !== null && stockQuantity > 0) ? Math.min(stockQuantity, 3) : 1 }}
                        disabled={stockLoading || stockQuantity === null || stockQuantity === 0 || quantity <= 0 || (stockQuantity > 0 && quantity > stockQuantity)}
                        helperText={(stockQuantity !== null && stockQuantity > 0) ? `Max. 3 (Stock: ${stockQuantity})` : (stockQuantity === 0 ? 'Épuisé' : (stockLoading ? 'Vérification...' : ''))}
                        sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8} md={9}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={<AddShoppingCartIcon />}
                        onClick={handleAddToCart}
                        disabled={stockLoading || stockQuantity <= 0}
                        sx={{ 
                          mt: 3, 
                          mb: 2, 
                          width: { xs: '100%', sm: 'auto' },
                          borderRadius: '30px',
                          backgroundSize: '200% auto',
                          background: 'linear-gradient(90deg, #8B5A2B 0%, #A67C52 50%, #8B5A2B 100%)',
                          backgroundPosition: 'left center',
                          transition: 'all 0.5s ease',
                          transform: 'translateY(0)',
                          boxShadow: '0 4px 15px rgba(139,90,43,0.3)',
                          '&:hover': {
                            backgroundPosition: 'right center',
                            transform: 'translateY(-3px)',
                            boxShadow: '0 7px 20px rgba(139,90,43,0.4)'
                          },
                          '&:active': {
                            transform: 'translateY(1px)',
                            boxShadow: '0 3px 10px rgba(139,90,43,0.3)'
                          }
                        }}
                      >
                        Ajouter au panier
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Boutons d'action supplémentaires */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={3}>
                  <Button
                    variant="outlined"
                    startIcon={<BookmarkIcon />}
                    sx={{ flexGrow: 1, borderRadius: 1.5 }}
                  >
                    Ajouter aux favoris
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    startIcon={<PersonIcon />}
                    sx={{ flexGrow: 1, borderRadius: 1.5 }}
                    component={RouterLink} // Utiliser RouterLink pour la navigation
                    to={`/ouvrages?auteur=${encodeURIComponent(book.auteur || '')}`}
                  >
                    Plus de cet auteur
                  </Button>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Fade>
     );
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 12, mb: 8 }}>
        <Box mb={2}>
          <Button 
            component={Link} 
            to="/ouvrages" 
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 2 }}
          >
            Retour au catalogue
          </Button>
        </Box>
        
        <Paper elevation={3} sx={{ 
          p: 4, 
          borderRadius: 2, 
          backgroundImage: 'linear-gradient(to bottom right, #f5f0ea, #ffffff)', 
          border: '1px solid #e6d7c3',
          transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
          boxShadow: '0 10px 30px rgba(139, 90, 43, 0.1)',
          '&:hover': {
            boxShadow: '0 15px 35px rgba(139, 90, 43, 0.15)',
            transform: 'translateY(-5px)'
          }
        }}>
          {renderContent()}
        </Paper>
        {/* Section de commentaires */}
        <Paper 
          elevation={4} 
          sx={{ 
            mt: 8, 
            mb: 4, 
            borderRadius: '16px', 
            overflow: 'hidden',
            border: '1px solid #d4b894',
            backgroundImage: 'linear-gradient(to bottom right, #fcf8f3, #ffffff)',
            transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
            '&:hover': {
              boxShadow: '0 15px 35px rgba(139, 90, 43, 0.15)',
              transform: 'translateY(-5px)'
            }
          }}>
          <Box sx={{ 
            bgcolor: '#8B5A2B', 
            color: 'white', 
            py: 2.5, 
            px: 4,
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            backgroundImage: 'linear-gradient(135deg, #a67c52 0%, #8B5A2B 100%)',
            boxShadow: '0 4px 20px rgba(139, 90, 43, 0.3)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              backgroundColor: 'rgba(255,255,255,0.05)',
              transform: 'rotate(45deg)',
              zIndex: 0,
              transition: 'transform 0.6s ease',
            },
            '&:hover::before': {
              transform: 'rotate(45deg) translate(10%, 10%)'
            }
          }}>
            <CommentIcon sx={{ fontSize: '2rem', color: '#fff' }} />
            <Typography variant="h5" component="h2" sx={{ 
              fontWeight: 700, 
              letterSpacing: '0.5px',
              textShadow: '0 2px 4px rgba(0,0,0,0.18)',
              color: '#ffffff'
            }}>
              Avis des clients
            </Typography>
          </Box>
          
          <Box sx={{ px: 4, py: 4 }}>


          {/* Formulaire d'ajout de commentaire */}
          <Paper 
            id="comment-form"
            elevation={2} 
            sx={{ 
              p: 0, 
              mb: 5, 
              borderRadius: '12px',
              border: '1px solid #d4b894',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              backgroundImage: 'linear-gradient(to bottom, #fffaf5, #ffffff)',
              '&:hover': {
                boxShadow: (theme) => `0 8px 24px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.08)'}`
              }
            }}
          >
            {/* En-tête du formulaire */}
            <Box sx={{
              bgcolor: '#d9c2a3', 
              py: 2.5,
              px: 3,
              borderBottom: '1px solid #d4b894',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              backgroundImage: 'linear-gradient(to right, #e8d6b9, #d9c2a3)'
            }}>
              <RateReviewIcon sx={{ fontSize: '1.5rem', color: '#8B5A2B' }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#5a391c' }}>
                Partagez votre expérience d'achat
              </Typography>
            </Box>
            <Box sx={{ p: 3, pt: 2.5 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                      Votre évaluation
                    </Typography>
                    
                    {commentRating > 0 && (
                      <Chip 
                        label={commentRating === 5 ? 'Excellent' : 
                               commentRating === 4 ? 'Très bien' : 
                               commentRating === 3 ? 'Moyen' : 
                               commentRating === 2 ? 'Médiocre' : 'Décevant'}
                        size="small"
                        color={commentRating >= 4 ? 'success' : commentRating >= 3 ? 'info' : 'warning'}
                        variant="outlined"
                        sx={{ 
                          height: 24, 
                          fontSize: '0.7rem', 
                          fontWeight: 600,
                          transition: 'all 0.2s ease'
                        }}
                      />
                    )}
                  </Box>
                  
                  <Box sx={{ 
                    p: 2.5, 
                    backgroundColor: 'rgba(0,0,0,0.02)', 
                    borderRadius: '10px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100px'
                  }}>
                    <Rating
                      name="rating"
                      value={commentRating}
                      onChange={(event, newValue) => {
                        setCommentRating(newValue || 1);
                      }}
                      size="large"
                      precision={1}
                      sx={{ 
                        fontSize: '2.5rem', 
                        '& .MuiRating-iconFilled': {
                          color: '#FFB400',
                          filter: 'drop-shadow(0 2px 4px rgba(255, 180, 0, 0.4))',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        },
                        '& .MuiRating-iconEmpty': {
                          color: 'rgba(0,0,0,0.15)',
                          transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                        },
                        '& .MuiRating-iconHover': {
                          color: '#FFA000',
                          transform: 'scale(1.2) rotate(5deg)',
                          filter: 'drop-shadow(0 3px 5px rgba(255, 160, 0, 0.5))'
                        },
                        '&:hover .MuiRating-iconFilled': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </Box>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Votre commentaire
                  </Typography>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    placeholder="Partagez votre avis sur ce livre..."
                    value={commentContent}
                    onChange={handleCommentChange}
                    variant="outlined"
                    sx={{ 
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 0 8px rgba(139,90,43,0.25)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 0 12px rgba(139,90,43,0.3)'
                        },
                        '& fieldset': {
                          transition: 'all 0.3s ease'
                        }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mt: 2,
                  pt: 2,
                  borderTop: '1px solid',
                  borderColor: 'divider',
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.02)', py: 1, px: 2, borderRadius: '50px' }}>
                    <VerifiedIcon sx={{ fontSize: '1rem', color: 'info.main', mr: 1 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                      Votre avis sera publié après vérification par notre équipe
                    </Typography>
                  </Box>
                                    <Button 
                    variant="contained" 
                    size="large"
                    endIcon={<SendIcon sx={{ transform: 'rotate(-15deg)', transition: 'all 0.4s ease' }} />}
                    onClick={submitComment}
                    disabled={!commentContent.trim()}
                    sx={{
                      borderRadius: '50px',
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                      backgroundColor: '#8B5A2B',
                      boxShadow: '0 4px 12px rgba(139, 90, 43, 0.25)',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      position: 'relative',
                      overflow: 'hidden',
                      zIndex: 1,
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '0%',
                        backgroundColor: 'rgba(0,0,0,0.1)',
                        transition: 'height 0.4s ease',
                        zIndex: -1,
                      },
                      '&:hover': {
                        backgroundColor: '#a67c52',
                        boxShadow: '0 8px 20px rgba(139, 90, 43, 0.35)',
                        transform: 'translateY(-3px)',
                        '& .MuiSvgIcon-root': {
                          transform: 'rotate(0deg) translateX(3px)'
                        },
                        '&::after': {
                          height: '100%'
                        }
                      },
                      '&:active': {
                        backgroundColor: '#704626',
                        transform: 'translateY(1px)',
                        boxShadow: '0 4px 12px rgba(139, 90, 43, 0.2)',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(139, 90, 43, 0.12)',
                        color: 'rgba(0,0,0,0.26)',
                        boxShadow: 'none'
                      }
                    }}
                  >
                    Publier votre avis
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {commentSuccess && (
              <Fade in={commentSuccess}>
                <Alert 
                  severity="success" 
                  variant="filled"
                  sx={{ 
                    mt: 3, 
                    borderRadius: 2,
                    boxShadow: 2
                  }}
                >
                  <AlertTitle>Merci pour votre avis !</AlertTitle>
                  Votre commentaire a été enregistré avec succès et sera visible après validation.
                </Alert>
              </Fade>
            )}
          </Box>
          </Paper>

          {/* Liste des commentaires */}
          <Box sx={{ mt: 5 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4, 
              pb: 2.5, 
              borderBottom: '1px solid', 
              borderColor: 'divider' 
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ForumIcon sx={{ fontSize: '1.8rem', color: '#8B5A2B' }} />
                <Typography variant="h6" sx={{ 
                  color: '#5a391c', 
                  fontWeight: 700,
                  letterSpacing: '0.3px'
                }}>
                  {comments.length} avis client{comments.length !== 1 ? 's' : ''}
                </Typography>
                
                {comments.length > 0 && (
                  <Chip 
                    label={`Publiés: ${comments.filter(c => c.statut === 'approuvé').length}/${comments.length}`}
                    size="small"
                    color="default"
                    variant="outlined"
                    sx={{ ml: 1, height: 24, fontSize: '0.7rem' }}
                  />
                )}
              </Box>
              
              {/* Info sur la note moyenne si des commentaires existent */}
              {comments.length > 0 && (
                <Paper
                  elevation={0}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    py: 0.8,
                    px: 2,
                    borderRadius: '40px',
                    bgcolor: 'white',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Typography variant="subtitle2" sx={{ mr: 1, fontWeight: 700, color: '#424242' }}>
                    Note moyenne:
                  </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 0.8,
                    px: 1.2,
                    py: 0.5,
                    bgcolor: 'white',
                    borderRadius: '30px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                  }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.main', lineHeight: 1 }}>
                      {(comments.reduce((acc, comment) => acc + comment.note, 0) / comments.length).toFixed(1)}
                    </Typography>
                    <Rating 
                      value={comments.reduce((acc, comment) => acc + comment.note, 0) / comments.length} 
                      readOnly 
                      precision={0.5}
                      sx={{ fontSize: '0.9rem', color: '#FFB400' }}
                    />
                  </Box>
                </Paper>
              )}
            </Box>
            
            {loadingComments ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6, flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={40} thickness={4} />
                <Typography color="text.secondary" variant="body2">
                  Chargement des avis clients...
                </Typography>
              </Box>
            ) : commentError ? (
              <Alert 
                severity="error" 
                sx={{ mb: 2, borderRadius: 2 }}
                action={
                  <Button color="error" size="small" onClick={fetchComments}>
                    Réessayer
                  </Button>
                }
              >
                <AlertTitle>Erreur</AlertTitle>
                {commentError}
              </Alert>
            ) : comments.length === 0 ? (
              <Paper 
                elevation={0} 
                sx={{ 
                  py: 5,
                  px: 3,
                  textAlign: 'center', 
                  backgroundColor: 'rgba(0,0,0,0.01)', 
                  borderRadius: '16px',
                  border: '1px dashed', 
                  borderColor: 'divider',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: -60, 
                    left: -60, 
                    width: 150, 
                    height: 150, 
                    backgroundColor: 'primary.light', 
                    opacity: 0.04, 
                    borderRadius: '50%' 
                  }} 
                />
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    bottom: -30, 
                    right: -30, 
                    width: 120, 
                    height: 120, 
                    backgroundColor: 'secondary.light', 
                    opacity: 0.06, 
                    borderRadius: '50%' 
                  }} 
                />
                
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, position: 'relative', zIndex: 2 }}>
                  <Box 
                    sx={{ 
                      width: 80, 
                      height: 80, 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(63, 81, 181, 0.08)', 
                      display: 'flex', 
                      justifyContent: 'center', 
                      alignItems: 'center'
                    }}
                  >
                    <RateReviewIcon sx={{ fontSize: 42, color: 'primary.main', opacity: 0.8 }} />
                  </Box>
                  
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
                      Aucun avis disponible
                    </Typography>
                    <Typography color="text.secondary" variant="body1" sx={{ maxWidth: 500, mx: 'auto', lineHeight: 1.6 }}>
                      Ce livre n'a pas encore reçu d'avis client. Soyez le premier à partager votre expérience d'achat et aidez les autres lecteurs !
                    </Typography>
                  </Box>
                  
                  <Button 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<RateReviewIcon />}
                    sx={{ 
                      mt: 1, 
                      borderRadius: '50px',
                      px: 4,
                      py: 1.2,
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => window.scrollTo({ top: document.getElementById('comment-form').offsetTop - 100, behavior: 'smooth' })}
                  >
                    Rédiger votre avis
                  </Button>
                </Box>
              </Paper>
            ) : (
              <Box sx={{ mt: 3 }}>
                {comments.map((comment, index) => {
                  // Déterminer le statut du commentaire (approuvé par défaut si non spécifié)
                  const statut = comment.statut || 'approuvé';
                  // Déterminer l'avatar et le nom de l'utilisateur en tenant compte des différentes structures possibles
                  const userAvatar = comment.utilisateur?.avatar || comment.avatar || `/img/avatars/user${index % 5 + 1}.jpg`;
                  const userName = comment.utilisateur?.nom || comment.utilisateur?.username || comment.username || comment.nom || 'Client';
                  // Formater la date en fonction de la structure
                  const commentDate = comment.created_at || comment.date_creation || new Date().toISOString();
                  
                  return (
                    <Paper 
                      elevation={1}
                      key={comment.id || index} 
                      sx={{ 
                        mb: 3, 
                        borderRadius: '12px',
                        overflow: 'hidden',
                        backgroundImage: 'linear-gradient(to bottom right, #fffaf5, #ffffff)',
                        border: '1px solid #e6d7c3',
                        borderLeft: '4px solid',
                        borderLeftColor: 
                          comment.note >= 4 ? '#8B5A2B' : 
                          comment.note >= 3 ? '#c17f16' : 
                          '#b54f4f',
                        position: 'relative',
                        transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
                        '&:before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'radial-gradient(circle at center, rgba(255,255,255,0) 0%, rgba(139, 90, 43, 0.03) 100%)',
                          opacity: 0,
                          transition: 'opacity 0.5s ease',
                          zIndex: 0,
                          pointerEvents: 'none'
                        },
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 12px 28px rgba(139, 90, 43, 0.15)',
                          '&:before': {
                            opacity: 1
                          }
                        }
                      }}
                    >
                      <Box sx={{
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          height: '100%',
                          width: '4px',
                          backgroundColor: comment.note >= 4 ? '#4CAF50' : 
                                          comment.note >= 3 ? '#FF9800' : '#F44336',
                        }
                      }}>
                        {/* En-tête du commentaire */}
                        <Box 
                          sx={{ 
                            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(66,66,66,0.85)' : 'rgba(245,247,250,0.85)', 
                            py: 2, 
                            pl: 3,
                            pr: 2.5,
                            display: 'flex', 
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderBottom: '1px solid',
                            borderColor: 'divider'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar 
                              src={userAvatar} 
                              alt={userName}
                              sx={{ 
                                width: 48, 
                                height: 48, 
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '2px solid white'
                              }}
                            />
                            
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2, mb: 0.3 }}>
                                {userName}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarTodayIcon sx={{ fontSize: '0.8rem', color: 'text.secondary', opacity: 0.7 }} />
                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                                  {new Date(commentDate).toLocaleDateString('fr-FR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Box sx={{ 
                              bgcolor: 'white',
                              px: 1.5, 
                              py: 0.8, 
                              borderRadius: '30px',
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                              border: '1px solid',
                              borderColor: 'divider'
                            }}>
                              <Typography variant="body2" sx={{ fontWeight: 600, color: comment.note >= 4 ? '#4CAF50' : comment.note >= 3 ? '#FF9800' : '#F44336', mr: 1 }}>
                                {comment.note}/5
                              </Typography>
                              <Rating 
                                value={comment.note} 
                                readOnly 
                                sx={{ fontSize: '0.95rem', color: '#FFB400' }}
                              />
                            </Box>
                            <Box sx={{ mt: 1 }}>
                              {statut === 'approuvé' && (
                                <Chip 
                                  icon={<VerifiedIcon sx={{ fontSize: '0.9rem' }} />} 
                                  label="Vérifié" 
                                  size="small" 
                                  color="success" 
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600 }}
                                />
                              )}
                              {statut === 'en_attente' && (
                                <Chip 
                                  label="En attente" 
                                  size="small" 
                                  color="warning" 
                                  variant="outlined"
                                  sx={{ height: 24, fontSize: '0.7rem', fontWeight: 600 }}
                                />
                              )}
                            </Box>
                          </Box>
                        </Box>
                        
                        {/* Contenu du commentaire */}
                        <Box sx={{ 
                        p: 3, 
                        bgcolor: theme => bgcolor(theme),
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          bgcolor: theme => theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(139,90,43,0.03)'
                        }
                      }}>
                          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: 'pre-line', color: '#333' }}>
                            {comment.contenu}
                          </Typography>
                          
                          {/* Actions sur le commentaire (optionnel, visible uniquement pour l'auteur) */}
                          {comment.isOwner && (
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'flex-end', 
                              mt: 3, 
                              pt: 2, 
                              borderTop: '1px solid', 
                              borderColor: 'divider',
                              opacity: 0.9,
                              transition: 'opacity 0.3s ease',
                              '&:hover': {
                                opacity: 1
                              }
                            }}>
                              <Button 
                                size="small" 
                                startIcon={<EditIcon />} 
                                color="primary"
                                variant="text"
                                sx={{ 
                                  borderRadius: '20px', 
                                  textTransform: 'none',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: 'rgba(139,90,43,0.1)',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                Modifier
                              </Button>
                              <Button 
                                size="small" 
                                startIcon={<DeleteIcon />} 
                                color="error" 
                                variant="text"
                                sx={{ 
                                  ml: 2, 
                                  borderRadius: '20px', 
                                  textTransform: 'none',
                                  transition: 'all 0.2s ease',
                                  '&:hover': {
                                    backgroundColor: 'rgba(211,47,47,0.1)',
                                    transform: 'translateY(-2px)'
                                  }
                                }}
                              >
                                Supprimer
                              </Button>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Paper>
                  );
                })}
              </Box>
            )}
          </Box>
        </Box>
        </Paper>
      </Container>
      {/* Message de succès */}
      <Snackbar
        open={commentSuccess}
        autoHideDuration={6000}
        onClose={() => setCommentSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 16, sm: 24 } }}
        TransitionComponent={Fade}
      >
        <Alert 
          onClose={() => setCommentSuccess(false)} 
          severity="success" 
          variant="filled"
          icon={<CheckCircleIcon fontSize="inherit" />}
          sx={{ 
            width: '100%', 
            boxShadow: '0 4px 12px rgba(139, 90, 43, 0.15)',
            backgroundColor: '#8B5A2B',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem'
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Votre avis a été soumis avec succès
            <Chip 
              label="En attente de vérification" 
              size="small" 
              color="info" 
              sx={{ height: 24, fontSize: '0.7rem', ml: 1, fontWeight: 600 }}
            />
          </Box>
        </Alert>
      </Snackbar>
      <Snackbar 
        open={snackbarOpen} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={message === 'success' ? 'success' : 'error'} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message === 'success' 
            ? 'Article ajouté au panier avec succès!' 
            : 'Erreur lors de l\'ajout au panier. Veuillez réessayer.'}
        </Alert>
      </Snackbar>
      
      <Footer />
    </>
  );
}

export default BookDetail;
