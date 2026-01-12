import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import appTheme from '../theme/appTheme'; // Import du thème central
import {
  Container,
  Box,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  CircularProgress,
  Rating,
  Paper,
  Snackbar,
  Alert as MuiAlert,
  Fade,
  Avatar,
  Tooltip
} from '@mui/material';

// Icônes Material UI
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonIcon from '@mui/icons-material/Person';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import HomeIcon from '@mui/icons-material/Home';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';
import LocalDiningIcon from '@mui/icons-material/LocalDining';
import BakeryDiningIcon from '@mui/icons-material/BakeryDining';
import CakeIcon from '@mui/icons-material/Cake';
import CookieIcon from '@mui/icons-material/Cookie';
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import LocalBarIcon from '@mui/icons-material/LocalBar';
import IcecreamIcon from '@mui/icons-material/Icecream';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import FlightIcon from '@mui/icons-material/Flight';

// Services API
import { OuvragesService, CategoriesService } from '../services/FastApiService';

// Thème de l'application - Cohérent avec BookList.js
// Le thème est maintenant importé depuis '../theme/appTheme'

// Fonction pour obtenir l'icône correspondant à une catégorie - Reprise de BookList.js
function getCategoryIcon(catName) {
  const icons = {
    'Cuisine française': <LocalDiningIcon />,
    'Pâtisserie': <CakeIcon />,
    'Cuisine du monde': <RamenDiningIcon />,
    'Boulangerie': <BakeryDiningIcon />,
    'Recettes traditionnelles': <MenuBookIcon />,
    'Desserts': <CookieIcon />,
    'Cuisine végétarienne': <LocalPizzaIcon />,
    'Chocolats': <IcecreamIcon />,
    'Vins et spiritueux': <LocalBarIcon />,
    'Fantastique': <AutoAwesomeIcon />,
    'Manga': <ImportContactsIcon />,
    'Poésie': <MusicNoteIcon />,
    'Théâtre': <TheaterComedyIcon />,
    'Voyage': <FlightIcon />
  };
  
  return icons[catName] || <CategoryIcon />;
}

// Nouveau composant pour afficher toutes les catégories disponibles
function AllCategories() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState(null);

  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        setLoadingCategories(true);
        const categoriesData = await CategoriesService.getAll();
        console.log('Catégories chargées avec succès:', categoriesData);
        setCategories(categoriesData || []);
      } catch (err) {
        console.error("Erreur lors du chargement des catégories:", err);
        setErrorCategories(`Impossible de charger les catégories: ${err.message || 'Erreur inconnue'}`);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchAllCategories();
  }, []);

  // Mise en valeur spéciale des catégories chocolat et fantastique
  const isHighlighted = (categoryName) => {
    return categoryName === 'Chocolats' || categoryName === 'Fantastique';
  };

  return (
    <Box sx={{ mt: 4, mb: 6 }}>
      <Typography 
        variant="h4" 
        component="h2" 
        sx={{ 
          fontWeight: 700, 
          mb: 4, 
          textAlign: 'center',
          color: appTheme.primary.main,
          position: 'relative',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 80,
            height: 3,
            background: appTheme.accent.main,
            borderRadius: '2px'
          }
        }}
      >
        Nos Catégories
      </Typography>

      {loadingCategories ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress size={60} thickness={4} sx={{ color: appTheme.primary.main }} />
        </Box>
      ) : errorCategories ? (
        <Alert severity="error" sx={{ mt: 4 }}>{errorCategories}</Alert>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {categories.map((cat) => {
            const isSpecial = isHighlighted(cat.nom);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={cat.id}>
                <Card 
                  onClick={() => navigate(`/category/${cat.id}`)}
                  sx={{ 
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    overflow: 'hidden',
                    borderRadius: '16px',
                    boxShadow: isSpecial 
                      ? `0 8px 25px ${appTheme.accent.main}40` 
                      : '0 4px 15px rgba(0,0,0,0.08)',
                    border: isSpecial 
                      ? `2px solid ${appTheme.accent.main}70` 
                      : '1px solid rgba(230,230,230,0.6)',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isSpecial 
                        ? `0 12px 30px ${appTheme.accent.main}60` 
                        : '0 8px 25px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Box sx={{ 
                    p: 3, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                    background: isSpecial 
                      ? `linear-gradient(145deg, ${appTheme.primary.light}20, ${appTheme.accent.light}50)` 
                      : 'white',
                    '&::before': isSpecial ? {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      backgroundImage: 'url("/images/pattern-special.png")',
                      backgroundSize: 'cover',
                      opacity: 0.07,
                      zIndex: 0
                    } : {}
                  }}>
                    <Avatar 
                      sx={{ 
                        width: 100, 
                        height: 100, 
                        mb: 3,
                        backgroundColor: isSpecial 
                          ? appTheme.accent.main 
                          : `${appTheme.primary.light}60`,
                        border: isSpecial 
                          ? `3px solid ${appTheme.accent.dark}` 
                          : `2px solid ${appTheme.primary.light}90`,
                        boxShadow: isSpecial 
                          ? `0 8px 20px ${appTheme.accent.main}50` 
                          : '0 5px 15px rgba(0,0,0,0.1)',
                        transform: isSpecial ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        '&:hover': {
                          transform: 'scale(1.15) rotate(5deg)'
                        }
                      }}
                    >
                      {getCategoryIcon(cat.nom)}
                    </Avatar>
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700,
                        mb: 1,
                        color: isSpecial ? appTheme.primary.dark : appTheme.primary.main,
                        textAlign: 'center',
                        position: 'relative',
                        zIndex: 1
                      }}
                    >
                      {cat.nom}
                    </Typography>
                    {isSpecial && (
                      <Chip
                        size="small"
                        label="Catégorie spéciale"
                        sx={{
                          mt: 1,
                          backgroundColor: appTheme.accent.main,
                          color: 'white',
                          fontWeight: 600,
                          '& .MuiChip-label': { px: 1 }
                        }}
                      />
                    )}
                  </Box>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}

function CategoryBooks() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [books, setBooks] = useState([]);
  const [category, setCategory] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [showAllCategories, setShowAllCategories] = useState(!categoryId); // Afficher toutes les catégories si pas d'ID spécifié

  // Utilisation des breakpoints Material UI pour le responsive
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Naviguer vers la page de détail d'un livre
  const navigateToBookDetail = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  // Naviguer vers la page d'accueil
  const navigateToHome = () => {
    navigate('/');
  };

  useEffect(() => {
    // Si pas d'ID de catégorie, afficher toutes les catégories
    if (!categoryId) {
      setShowAllCategories(true);
      setLoading(false);
      return;
    }

    setShowAllCategories(false);
    
    // Fonction pour charger les détails de la catégorie
    const fetchCategory = async () => {
      try {
        console.log('Tentative de chargement de la catégorie:', categoryId);
        const categoryData = await CategoriesService.getById(categoryId);
        console.log('Catégorie chargée avec succès:', categoryData);
        
        // Si les données de catégorie sont vides ou nulles, tenter de récupérer toutes les catégories
        if (!categoryData || !categoryData.nom) {
          console.log('Données de catégorie incomplètes, tentative de récupération de toutes les catégories');
          const allCategories = await CategoriesService.getAllCategories();
          const foundCategory = allCategories.find(cat => cat.id === parseInt(categoryId) || cat.id === categoryId);
          
          if (foundCategory) {
            console.log('Catégorie trouvée dans la liste complète:', foundCategory);
            setCategory(foundCategory);
          } else {
            // Créer une catégorie par défaut si non trouvée
            console.log('Utilisation d\'une catégorie par défaut');
            setCategory({ id: categoryId, nom: 'Catégorie', description: 'Livres de cette catégorie' });
          }
        } else {
          setCategory(categoryData);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la catégorie:", err);
        // Même en cas d'erreur, définir une catégorie par défaut pour l'affichage
        setCategory({ id: categoryId, nom: 'Catégorie', description: 'Livres de cette catégorie' });
        setError(`Impossible de charger les détails de la catégorie: ${err.message || 'Erreur inconnue'}`);
      }
    };

    // Fonction pour charger les livres de la catégorie
    const fetchBooksByCategory = async () => {
      setLoading(true);
      try {
        // Tenter d'abord d'utiliser l'API dédiée si elle existe
        try {
          const booksData = await OuvragesService.getBooksByCategory(categoryId);
          if (Array.isArray(booksData) && booksData.length > 0) {
            console.log('Livres récupérés par l\'API dédiée:', booksData.length);
            setBooks(booksData);
            setLoading(false);
            return;
          }
        } catch (apiError) {
          console.log('L\'API dédiée n\'est pas disponible, filtrage côté client');
        }
        
        // Récupération de tous les livres et filtrage côté client
        const allBooks = await OuvragesService.getAll();
        
        // Vérification que les données sont bien un tableau
        if (Array.isArray(allBooks)) {
          // Filtrage des livres par catégorie (conversion categoryId en nombre si possible)
          const catIdAsNumber = !isNaN(parseInt(categoryId)) ? parseInt(categoryId) : categoryId;
          const filteredBooks = allBooks.filter(book => {
            // Convertir également book.categorie_id en nombre si c'est une chaîne
            const bookCatId = !isNaN(parseInt(book.categorie_id)) ? parseInt(book.categorie_id) : book.categorie_id;
            return bookCatId === catIdAsNumber;
          });
          console.log(`Filtrage côté client: ${filteredBooks.length} livres trouvés pour la catégorie ${categoryId}`);
          setBooks(filteredBooks);
        } else {
          console.log('Les données récupérées ne sont pas un tableau:', allBooks);
          setBooks([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des livres:', error);
        setError('Erreur lors du chargement des livres');
      } finally {
        setLoading(false);
      }
    };

    // Charger les données au chargement du composant
    const loadCategoryData = async () => {
      if (categoryId) {
        await fetchCategory();
        await fetchBooksByCategory();
      } else {
        setError('ID de catégorie non fourni');
        setLoading(false);
      }
    };
    
    loadCategoryData();
  }, [categoryId]);

  // Gérer l'achat d'un livre
  const handlePurchaseBook = async (book, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      const ouvrageDetails = {
        titre: book.titre || "Titre inconnu",
        auteur: book.auteur || "Auteur inconnu",
        photo: book.photo || book.image_url || '/images/default-book.jpg',
        image: book.photo || book.image_url || '/images/default-book.jpg'
      };

      await addToCart(
        book.id,
        1, 
        book.prix || 0,
        ouvrageDetails,
        false 
      );
      
      setSnackbar({
        open: true,
        message: `"${book.titre}" a été ajouté à votre panier`,
        severity: 'success'
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      setSnackbar({
        open: true,
        message: `Erreur lors de l'ajout au panier: ${error.message || 'Veuillez réessayer.'}`,
        severity: 'error'
      });
    }
  };

  // Fermer le snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {showAllCategories ? (
        <Container maxWidth="xl" sx={{ ...appTheme.components.container.main }}>
          <Box sx={{ my: 4 }}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 800, 
                textAlign: 'center',
                mb: 3,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                color: appTheme.primary.dark,
                textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
              }}
            >
              Explorez nos catégories
            </Typography>
            
            <Typography 
              variant="h6"
              sx={{ 
                textAlign: 'center',
                mb: 6,
                maxWidth: 800,
                mx: 'auto',
                color: appTheme.text.secondary,
                fontWeight: 400
              }}
            >
              Découvrez notre sélection exclusive de livres organisés par thématiques, 
              avec une mise en valeur spéciale pour nos catégories Chocolat et Fantastique.
            </Typography>
          </Box>
          
          <AllCategories />
        </Container>
      ) : loading ? (
        <Container maxWidth="lg" sx={{ 
          ...appTheme.components.container.main, 
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh" gap={3}>
            <CircularProgress size={60} thickness={4} sx={{ 
              color: appTheme.primary.main,
              '& .MuiCircularProgress-circle': {
                strokeLinecap: 'round',
              }
            }} />
            <Typography variant="h6" sx={{ 
              fontWeight: 500, 
              animation: 'fadeInOut 1.5s infinite ease-in-out',
              '@keyframes fadeInOut': {
                '0%': { opacity: 0.6 },
                '50%': { opacity: 1 },
                '100%': { opacity: 0.6 }
              }
            }}>
              Chargement des livres de la catégorie...
            </Typography>
          </Box>
        </Container>
      ) : error ? (
        <Container maxWidth="md" sx={{ ...appTheme.components.container.main }}>
          <Paper 
            elevation={3} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              mt: 6, 
              mb: 6, 
              borderRadius: 2,
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.98)',
              backgroundImage: 'linear-gradient(to bottom, #fff, #f9f9f9)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
              border: `1px solid ${appTheme.accent.light}40`
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              py: 3 
            }}>
              <Box 
                sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: `${appTheme.accent.light}50`,
                  mb: 3,
                  border: `2px solid ${appTheme.accent.main}40`
                }}
              >
                <ErrorOutlineIcon sx={{ fontSize: 42, color: appTheme.secondary.main }} />
              </Box>
              
              <Typography 
                variant="h4" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 3,
                  color: appTheme.primary.main,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 60,
                    height: 3,
                    backgroundColor: appTheme.accent.main
                  }
                }}
              >
                Oups, un problème est survenu
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: appTheme.text.secondary, 
                  maxWidth: 480, 
                  mx: 'auto',
                  mt: 3,
                  mb: 4,
                  lineHeight: 1.6,
                  fontSize: '1.05rem'
                }}
              >
                {error}
              </Typography>
              
              <Button 
                variant="contained" 
                startIcon={<ArrowBackIcon />}
                size="large"
                onClick={navigateToHome}
                sx={{ 
                  background: appTheme.components.button.primary.background,
                  '&:hover': {
                    background: appTheme.components.button.primary.hoverBackground,
                    boxShadow: '0 6px 20px rgba(123, 63, 0, 0.35)',
                    transform: 'translateY(-2px)'
                  },
                  borderRadius: 2, 
                  py: 1.5, 
                  px: 4,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1rem',
                  boxShadow: '0 4px 14px rgba(123, 63, 0, 0.25)',
                  transition: 'all 0.2s ease-in-out'
                }}
              >
                Retour à l'accueil
              </Button>
            </Box>
          </Paper>
        </Container>
      ) : (
        <Container maxWidth="xl" sx={{ ...appTheme.components.container.main }}>
        {/* En-tête de catégorie premium avec style chocolat/caramel */}
        <Box 
          sx={{
            position: 'relative',
            mt: 4,
            mb: 6,
            height: { xs: '220px', md: '280px' },
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 12px 36px rgba(0,0,0,0.18)',
            background: appTheme.background.gradient,
            border: `1px solid ${appTheme.primary.light}30`,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: 'url("/images/pattern-books.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          opacity: 0.15
        }
      }}
    >
      {/* Fil d'Ariane Premium */}
      <Paper
        elevation={0}
        sx={{
          py: 1.5,
          px: 3,
          my: 3,
          backgroundColor: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          border: '1px solid rgba(240,240,240,0.8)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
            zIndex: 0,
            opacity: 0.6,
            animation: 'shimmer 3s infinite',
            '@keyframes shimmer': {
              '0%': { transform: 'translateX(-100%)' },
              '100%': { transform: 'translateX(100%)' }
            }
          }
        }}
      >
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: appTheme.primary.light }} />} 
          aria-label="breadcrumb"
        >
          <Link 
            underline="hover" 
            color="inherit" 
            onClick={navigateToHome}
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '0.95rem',
              color: appTheme.primary.main,
              transition: 'all 0.2s ease',
              '&:hover': {
                color: appTheme.accent.main,
                transform: 'translateX(-2px)'
              }
            }}
          >
            <HomeIcon sx={{ mr: 0.7, fontSize: '1.1rem' }} />
            Accueil
          </Link>
          <Typography 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              color: appTheme.primary.dark,
              fontWeight: 600,
              fontSize: '0.95rem'
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 0.7,
                color: appTheme.accent.main
              }}
            >
              {(category && getCategoryIcon(category.nom)) || <CategoryIcon fontSize="small" />}
            </Box>
            {category ? category.nom : 'Catégorie'}
          </Typography>
        </Breadcrumbs>
      </Paper>
    </Box>

    {/* En-tête premium de la catégorie */}
    <Box 
      sx={{ 
        mb: { xs: 5, md: 7 }, 
        pt: 5,
        pb: 6,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'url("/img/pattern-bg.svg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay',
          opacity: 0.08,
          zIndex: 0
        },
        background: `linear-gradient(135deg, ${appTheme.primary.dark} 0%, ${appTheme.primary.main} 70%, ${appTheme.accent.dark} 100%)`,
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '40%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
          zIndex: 1
        },
        borderRadius: '20px',
        boxShadow: '0 20px 50px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.08)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.1)',
        transform: 'translateY(0)',
        transition: 'transform 0.3s ease-out',
        '&:hover': {
          transform: 'translateY(-5px)'
        }
      }}
    >
      {/* Pattern d'arrière-plan */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.12'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          zIndex: 1
        }} 
      />
      {/* Gradient overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3))',
          zIndex: 1
        }} 
      />
      <Container sx={{ position: 'relative', zIndex: 2 }}>
        {/* Cercle décoratif en arrière-plan */}
        <Box
          sx={{
            position: 'absolute',
            right: { xs: '-80px', md: '-120px' },
            top: { xs: '-40px', md: '-60px' },
            width: { xs: '150px', md: '250px' },
            height: { xs: '150px', md: '250px' },
            borderRadius: '50%',
            background: `radial-gradient(circle, ${appTheme.accent.main}40 0%, ${appTheme.accent.main}10 70%, transparent 100%)`,
            zIndex: 0
          }}
        />
        
        {/* En-tête de catégorie avec animation subtile */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center',
            position: 'relative',
            zIndex: 1,
            animation: 'fadeIn 0.5s ease-out',
            '@keyframes fadeIn': {
              '0%': { opacity: 0, transform: 'translateY(10px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        >
          <Box 
            sx={{ 
              mr: { xs: 0, sm: 3 },
              mb: { xs: 2, sm: 0 },
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'rgba(255,255,255,0.15)', 
              p: 2.5, 
              borderRadius: '50%',
              boxShadow: '0 8px 20px rgba(0,0,0,0.25), 0 4px 10px rgba(0,0,0,0.15)',
              border: `2px solid ${appTheme.accent.main}40`,
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              '&:hover': {
                transform: 'scale(1.08) rotate(5deg)',
                backgroundColor: 'rgba(255,255,255,0.2)',
                boxShadow: `0 12px 28px rgba(0,0,0,0.3), 0 0 10px ${appTheme.accent.main}60 inset`
              }
            }}
          >
            {category && getCategoryIcon(category.nom) || <CategoryIcon sx={{ fontSize: { xs: '2.5rem', md: '3rem' }, color: 'white' }} />}
          </Box>
          
          <Box>
            <Typography 
              variant="h3" 
              component="h1"
              sx={{ 
                fontWeight: 800, 
                textShadow: '0 3px 10px rgba(0,0,0,0.4)',
                fontSize: { xs: '2rem', sm: '2.3rem', md: '2.8rem' },
                position: 'relative',
                letterSpacing: '-0.5px',
                '&::after': {
                  content: '""',
                  display: 'block',
                  mt: 1.5,
                  width: { xs: '80px', md: '100px' },
                  height: '4px',
                  background: `linear-gradient(90deg, ${appTheme.accent.main}, transparent)`,
                  borderRadius: '4px'
                }
              }}
            >
              {category ? category.nom : 'Catégorie'}
            </Typography>
          </Box>
        </Box>
        
        <Box
          sx={{
            mt: 4,
            position: 'relative',
            zIndex: 2,
            maxWidth: { xs: '100%', md: '80%' },
            pl: { xs: 0, sm: 2 },
            animation: 'slideUp 0.6s ease-out forwards',
            animationDelay: '0.2s',
            opacity: 0,
            '@keyframes slideUp': {
              '0%': { opacity: 0, transform: 'translateY(20px)' },
              '100%': { opacity: 1, transform: 'translateY(0)' }
            }
          }}
        ></Box>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              maxWidth: { xs: '100%', md: '90%' }, 
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 500,
              lineHeight: 1.7,
              textShadow: '0 1px 3px rgba(0,0,0,0.3)',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              p: 2.5,
              borderLeft: `4px solid ${appTheme.accent.main}`,
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to right, rgba(255,255,255,0.05), transparent)',
                zIndex: -1
              }
            }}
          >
            {category && category.description 
              ? category.description 
              : 'Découvrez notre sélection de livres dans cette catégorie spécialement choisie pour vous satisfaire. Des ouvrages sélectionnés avec soin pour offrir une expérience de lecture enrichissante et inspirante.'}
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 1.5, flexWrap: 'wrap', pl: 1 }}>
            <Chip 
              icon={<MenuBookIcon sx={{ color: 'white !important' }} />}
              label={`${books.length} livres`} 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.18)', 
                color: 'white',
                backdropFilter: 'blur(8px)',
                fontWeight: 600,
                borderRadius: '50px',
                border: `1px solid ${appTheme.accent.main}30`,
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                '& .MuiChip-icon': { color: 'white' },
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                }
              }}
            size="medium" 
          />
          <Chip 
            icon={<MenuBookIcon />} 
            label="Collection" 
            sx={{ 
              backgroundColor: appTheme.accent.main, 
              color: 'white',
              fontWeight: 500
            }} 
            size="medium" 
          />
        </Box>
      </Container>
    </Box>

    {/* Section d'introduction pour la catégorie */}
    {category && books.length > 0 && (
      <Box
        sx={{
          mt: 4,
          mb: 2,
          position: 'relative',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212,172,13,0.05) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            zIndex: 0
          }
        }}
      >
        {/* Gradient overlay */}
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            background: 'linear-gradient(rgba(0,0,0,0), rgba(0,0,0,0.3))',
            zIndex: 1
          }} 
        />
        <Container sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h3" 
            component="h1"
            sx={{ 
              fontWeight: 800, 
              textShadow: '0 2px 8px rgba(0,0,0,0.4)',
              display: 'flex',
              alignItems: 'center',
              fontSize: { xs: '2rem', md: '2.5rem' },
              position: 'relative',
              letterSpacing: '-0.5px',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: 70,
                width: 60,
                height: 3,
                background: appTheme.accent.main,
                borderRadius: '4px'
              }
            }}
          >
            <Box 
              sx={{ 
                mr: 2, 
                display: 'flex', 
                alignItems: 'center', 
                backgroundColor: 'rgba(255,255,255,0.2)', 
                p: 1.5, 
                borderRadius: '50%',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                border: '2px solid rgba(255,255,255,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  backgroundColor: 'rgba(255,255,255,0.25)'
                }
              }}
            >
              {category && getCategoryIcon(category.nom) || <CategoryIcon sx={{ fontSize: '2.2rem', color: appTheme.accent.light }} />}
            </Box>
            {category ? category.nom : 'Catégorie'}
          </Typography>
          
          <Typography 
            variant="subtitle1" 
            sx={{ 
              opacity: 0.95, 
              maxWidth: { xs: '100%', md: '70%' }, 
              mt: 2,
              fontSize: { xs: '1rem', md: '1.1rem' },
              fontWeight: 500,
              lineHeight: 1.6,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
              borderLeft: `4px solid ${appTheme.accent.main}`,
              paddingLeft: 2,
              marginLeft: 1,
              letterSpacing: '0.2px'
            }}
          >
            {category && category.description 
              ? category.description 
              : 'Découvrez notre sélection de livres dans cette catégorie spécialement choisie pour vous satisfaire.'}
          </Typography>
          
          <Box sx={{ mt: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              label={`${books.length} livres`} 
              sx={{ 
                backgroundColor: 'rgba(255,255,255,0.15)', 
                color: 'white',
                backdropFilter: 'blur(4px)',
                fontWeight: 500
              }} 
              size="medium" 
            />
            <Chip 
              icon={<MenuBookIcon />} 
              label="Collection" 
              sx={{ 
                backgroundColor: appTheme.accent.main, 
                color: 'white',
                fontWeight: 500
              }} 
              size="medium" 
            />
          </Box>
        </Container>
      </Box>
    )}

    {/* Section des livres de la catégorie */}
    {category && books.length > 0 && (
      <Box
        sx={{
          mt: 4,
          mb: 2,
          position: 'relative',
          textAlign: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(212,172,13,0.05) 0%, rgba(255,255,255,0) 70%)',
            borderRadius: '50%',
            zIndex: 0
          }
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontWeight: 700,
            color: appTheme.primary.main,
            mb: 2
          }}
        >
          Notre Sélection
        </Typography>
        
        <Typography
          variant="h6"
          component="p"
          sx={{
            maxWidth: '800px',
            mx: 'auto',
            color: 'text.secondary',
            fontWeight: 400,
            fontStyle: 'italic',
            mb: 5,
            px: 2,
            lineHeight: 1.6
          }}
        >
          Découvrez notre sélection spéciale dans la catégorie <strong>{category?.nom}</strong>. 
          Un choix exceptionnel qui saura vous transporter et éveiller vos sens.
        </Typography>
        </Box>
      )}

      {/* Livre mis en avant avec design ultra premium */}
      {category && books.length > 0 && (
        <Box
          sx={{
            mb: 8,
            mt: 0,
            display: 'flex',
            justifyContent: 'center',
            position: 'relative',
            transition: 'all 0.3s ease',
            transform: 'perspective(1000px)',
            animation: 'fadeInSlideUp 1s ease-out',
            '@keyframes fadeInSlideUp': {
              '0%': { opacity: 0, transform: 'perspective(1000px) translateY(20px)' },
              '100%': { opacity: 1, transform: 'perspective(1000px) translateY(0)' }
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -30,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              height: '110%',
              background: 'radial-gradient(ellipse at center, rgba(212,172,13,0.1) 0%, rgba(212,172,13,0) 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '500px',
              height: '40px',
              backgroundColor: 'rgba(0,0,0,0.05)',
              filter: 'blur(20px)',
              borderRadius: '50%',
              zIndex: -1
            }
          }}
        >
          <Card
            elevation={8}
            sx={{
              width: { xs: 320, sm: 450, md: 550 },
              minHeight: 600,
              display: 'flex',
              flexDirection: 'column',
              borderRadius: '20px',
              overflow: 'hidden',
              cursor: 'pointer',
              background: 'linear-gradient(165deg, #ffffff 0%, #fafafa 100%)',
              border: '1px solid rgba(230,230,230,0.5)',
              position: 'relative',
              transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 15px 35px rgba(0,0,0,0.1), 0 3px 10px rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'translateY(-10px) scale(1.02) rotateY(2deg)',
                boxShadow: '0 30px 70px rgba(0,0,0,0.15), 0 10px 30px rgba(0,0,0,0.07)'
              },
              '&::after': {
                content: '"À DÉCOUVRIR"',
                position: 'absolute',
                top: 20,
                right: 0,
                backgroundColor: appTheme.accent.main,
                color: 'white',
                padding: '8px 15px 8px 25px',
                fontWeight: 'bold',
                fontSize: '0.75rem',
                letterSpacing: '1px',
                clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 8% 100%, 0% 50%)',
                boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
                zIndex: 5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateX(-3px)',
                  boxShadow: '0 6px 15px rgba(0,0,0,0.2)'
                }
              }
            }}
            onClick={() => navigate(`/book/${books[0].id}`)}
          >
          <Box sx={{ position: 'relative', overflow: 'hidden', borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
            <CardMedia
              component="img"
              height="380"
              image={books[0].photo ? `/img/${books[0].photo}` : '/img/default-book.jpg'}
              alt={books[0].titre}
              sx={{
                transition: 'all 1s cubic-bezier(0.33, 1, 0.68, 1)',
                transform: 'scale(1.01)',
                filter: 'brightness(1.02) contrast(1.05)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0,0,0,0.03)',
                  zIndex: 2
                },
                '&:hover': {
                  transform: 'scale(1.07)',
                  filter: 'brightness(1.05) contrast(1.07)'
                }
              }}
            />
            {/* Overlay avec effet cinématique */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '70%',
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0) 100%)',
                zIndex: 1,
                opacity: 0.9,
                transition: 'opacity 0.5s ease',
                '&:hover': {
                  opacity: 0.7
                }
              }}
            />
            
            {/* Titre sur l'image pour effet cinématique */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 30,
                left: 0,
                width: '100%',
                padding: '0 30px',
                zIndex: 3,
                textAlign: 'left',
                transform: 'translateY(5px)',
                opacity: 0.95,
                transition: 'all 0.4s ease',
                '&:hover': {
                  transform: 'translateY(0)',
                  opacity: 1
                }
              }}
            >
              <Typography
                variant="h5"
                component="div"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                  mb: 1,
                  fontSize: { xs: '1.4rem', sm: '1.6rem', md: '1.8rem' }
                }}
              >
                {books[0].titre}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    textShadow: '0 1px 3px rgba(0,0,0,0.6)'
                  }}
                >
                  par {books[0].auteur}
                </Typography>
                
                {books[0].date_publication && (
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.95rem',
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      padding: '3px 10px',
                      borderRadius: '4px'
                    }}
                  >
                    {new Date(books[0].date_publication).getFullYear()}
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Badge prix premium flottant */}
            {books[0].prix && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 25,
                  left: 25,
                  color: 'white',
                  borderRadius: '50px',
                  padding: '12px 22px',
                  fontWeight: 700,
                  fontSize: { xs: '1.1rem', sm: '1.2rem' },
                  letterSpacing: '0.5px',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.25)',
                  zIndex: 5,
                  border: '2px solid rgba(255,255,255,0.25)',
                  background: 'linear-gradient(45deg, rgba(123,63,0,0.95) 0%, rgba(212,172,13,0.95) 100%)',
                  backdropFilter: 'blur(5px)',
                  transition: 'all 0.3s ease',
                  transform: 'rotate(-3deg)',
                  '&:hover': {
                    transform: 'rotate(0deg) scale(1.05)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                  }
                }}
              >
                {books[0].prix.toFixed(2)} €
              </Box>
            )}
          </Box>
          <CardContent sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column',
            p: { xs: 3, sm: 4 },
            background: 'linear-gradient(0deg, rgba(252,252,252,1) 0%, rgba(255,255,255,1) 100%)'
          }}>
            {/* Badges de catégorie et disponibilité */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1.5,
              mb: 3,
              mt: 0.5
            }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(123,63,0,0.06)',
                  color: appTheme.primary.dark,
                  borderRadius: '30px',
                  padding: '7px 14px',
                  border: '1px solid rgba(123,63,0,0.1)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(123,63,0,0.09)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <CategoryIcon sx={{ fontSize: '0.95rem', mr: 1, color: appTheme.primary.main }} />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  {category?.nom}
                </Typography>
              </Box>
              
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(46,125,50,0.06)',
                  color: 'success.dark',
                  borderRadius: '30px',
                  padding: '7px 14px',
                  border: '1px solid rgba(46,125,50,0.15)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(46,125,50,0.09)',
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 8,
                    height: 8,
                    backgroundColor: 'success.main',
                    borderRadius: '50%',
                    mr: 1,
                    boxShadow: '0 0 0 3px rgba(46,125,50,0.2)'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  Disponible
                </Typography>
              </Box>
            </Box>
            
            {/* Caractéristiques du livre avec icones */}
            <Box sx={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 3,
              mb: 3,
              mt: 1
            }}>
              {/* Notes des lecteurs */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Rating
                  value={4.5}
                  precision={0.5}
                  readOnly
                  size="small"
                  sx={{
                    color: appTheme.accent.main,
                    mr: 1
                  }}
                />
                <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  4.5
                </Typography>
              </Box>
              
              {/* Nombre de pages */}
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <MenuBookIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {books[0].nombre_pages || 256} pages
                </Typography>
              </Box>
            </Box>
            
            {/* Description avec style premium */}
            <Box sx={{ 
              mb: 3, 
              backgroundColor: 'rgba(250,250,250,0.7)',
              borderRadius: '10px',
              p: 2,
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '5px',
                height: '100%',
                background: `linear-gradient(to bottom, ${appTheme.primary.light}, ${appTheme.accent.main})`,
                borderTopLeftRadius: '10px',
                borderBottomLeftRadius: '10px'
              }
            }}>
              <Typography 
                variant="body1" 
                color="text.primary"
                sx={{ 
                  lineHeight: 1.7,
                  pl: 1,
                  fontSize: '0.95rem'
                }}
              >
                {books[0].description ? 
                  (books[0].description.length > 150 ? 
                    `${books[0].description.substring(0, 150)}...` : books[0].description) 
                  : "Un ouvrage exceptionnel qui vous transportera dans un univers gourmand. À découvrir sans plus attendre dans notre collection exclusive."}
              </Typography>
            </Box>
            
            <Divider sx={{ mt: 'auto', mb: 3, opacity: 0.6 }} />
            
            {/* Boutons d'action premium */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 0
            }}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<ShoppingCartIcon sx={{ fontSize: '1.3rem' }} />}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePurchaseBook(books[0], e);
                }}
                sx={{
                  borderRadius: '50px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(123,63,0,0.25)',
                  background: `linear-gradient(45deg, ${appTheme.primary.dark} 0%, ${appTheme.primary.main} 100%)`,
                  border: '1px solid rgba(255,255,255,0.2)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': {
                    transform: 'translateY(-4px) scale(1.05)',
                    boxShadow: '0 10px 30px rgba(123,63,0,0.3)',
                    background: `linear-gradient(45deg, ${appTheme.primary.main} 0%, ${appTheme.primary.dark} 100%)`
                  }
                }}
              >
                Acheter maintenant
              </Button>
              
              <Button
                variant="outlined"
                onClick={(e) => {
                  e.stopPropagation();
                  navigateToBookDetail(books[0].id);
                }}
                endIcon={<ArrowForwardIcon sx={{ transition: 'transform 0.3s ease', '.MuiButton-root:hover &': { transform: 'translateX(4px)' } }} />}
                sx={{
                  borderRadius: '50px',
                  px: 3,
                  py: 1.2,
                  color: appTheme.primary.dark,
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  borderColor: 'rgba(123,63,0,0.2)',
                  borderWidth: '1.5px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    borderColor: appTheme.accent.main,
                    color: appTheme.accent.dark,
                    transform: 'translateY(-3px)',
                    boxShadow: '0 8px 20px rgba(212,172,13,0.2)'
                  }
                }}
              >
                Voir les détails
              </Button>
            </Box>
          </CardContent>
          
          {/* Badge Populaire flottant avec style premium */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              backgroundColor: 'transparent',
              width: 140,
              height: 140,
              overflow: 'hidden',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 30,
                left: -35,
                transform: 'rotate(-45deg)',
                backgroundColor: appTheme.accent.main,
                color: 'white',
                padding: '6px 50px',
                fontWeight: 'bold',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                boxShadow: '0 3px 10px rgba(0,0,0,0.15)',
                border: '1px dashed rgba(255,255,255,0.5)',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'rotate(-45deg) scale(1)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                  },
                  '50%': {
                    transform: 'rotate(-45deg) scale(1.05)',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.25)'
                  },
                  '100%': {
                    transform: 'rotate(-45deg) scale(1)',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.15)'
                  }
                }
              }}
            >
              POPULAIRE
            </Box>
          </Box>
        </Card>
      </Box>
    )}

    {/* Grille de livres avec design moderne et cohérent */}
    {books.length > 1 && (
        <Box sx={{ mt: 6, mb: 4 }}>
          {/* En-tête premium pour la section Collection */}
          <Box 
            sx={{
              mb: 5,
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography
              variant="overline"
              sx={{
                color: appTheme.accent.main,
                fontWeight: 600,
                letterSpacing: 2,
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                mb: 1,
                opacity: 0,
                animation: 'fadeInUp 0.8s forwards',
                '@keyframes fadeInUp': {
                  '0%': { opacity: 0, transform: 'translateY(20px)' },
                  '100%': { opacity: 1, transform: 'translateY(0)' }
                }
              }}
            >
              Enrichissez votre expérience
            </Typography>
            
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                position: 'relative',
                fontWeight: 800,
                textAlign: 'center',
                background: `linear-gradient(45deg, ${appTheme.primary.dark}, ${appTheme.primary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: 3,
                padding: '0 20px',
                letterSpacing: '-0.5px',
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.4rem' },
                opacity: 0,
                animation: 'fadeInUp 0.8s forwards 0.2s',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 3,
                  background: appTheme.accent.main,
                  borderRadius: '4px',
                  opacity: 0,
                  animation: 'fadeIn 1.2s forwards 0.6s',
                  '@keyframes fadeIn': {
                    '0%': { opacity: 0, width: '0px' },
                    '100%': { opacity: 1, width: '80px' }
                  }
                }
              }}
            >
              Collection complète
            </Typography>
            
            <Typography 
              variant="subtitle1" 
              sx={{ 
                textAlign: 'center',
                color: appTheme.text.secondary,
                maxWidth: 800,
                mx: 'auto',
                mt: 3,
                fontWeight: 500,
                fontSize: '1.05rem',
                lineHeight: 1.6,
                opacity: 0,
                animation: 'fadeInUp 0.8s forwards 0.4s'
              }}
            >
              Découvrez notre sélection exceptionnelle de {books.length - 1} autres {books.length - 1 > 1 ? 'livres' : 'livre'} dans la catégorie <strong style={{ color: appTheme.primary.main }}>{category?.nom}</strong>. Chaque ouvrage a été soigneusement sélectionné pour enrichir votre bibliothèque.
            </Typography>
          </Box>

          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)',
              },
              gap: { xs: 3, sm: 4 },
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: -20,
                left: 0,
                width: '100%',
                height: 'calc(100% + 40px)',
                background: 'radial-gradient(circle at 80% 70%, rgba(212,172,13,0.03) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none',
                zIndex: 0
              },
              '& > div': {
                opacity: 0,
                animation: 'fadeInUp 0.6s ease forwards',
                animationDelay: 'calc(0.1s * var(--index))'
              },
              '@keyframes fadeInUp': {
                '0%': {
                  opacity: 0,
                  transform: 'translateY(20px)'
                },
                '100%': {
                  opacity: 1,
                  transform: 'translateY(0)'
                }
              }
            }}
          >
            {books.slice(1).map((book, index) => (
              <Box 
                key={book.id} 
                sx={{ 
                  height: '100%',
                  position: 'relative',
                  transition: 'transform 0.3s ease',
                  '--index': index,
                  '&:hover': {
                    transform: 'translateY(-8px)'
                  }
                }}
              >
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    ...appTheme.components.card.standard,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: `linear-gradient(90deg, ${appTheme.primary.dark} 0%, ${appTheme.accent.main} 100%)`,
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover': {
                      ...appTheme.components.card.standard.hoverEffect,
                      '&::before': {
                        opacity: 1
                      }
                    }
                  }}
                  onClick={() => navigateToBookDetail(book.id)}
                >
                  {/* Image du livre avec dimensions responsives et effet de zoom hover */}
                  <Box sx={{ 
                    position: 'relative', 
                    height: { xs: 220, sm: 280, md: 320 }, /* Hauteur responsive */
                    overflow: 'hidden'
                  }}>
                    <CardMedia
                      component="img"
                      image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                      alt={book.titre}
                      sx={{ 
                        height: '100%',
                        width: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease, filter 0.3s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                          filter: 'brightness(1.05) contrast(1.05)'
                        }
                      }}
                    />
                    {/* Overlay gradient pour améliorer la lisibilité des badges */}
                    <Box sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 40%)',
                      opacity: 0.6,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: 0.8
                      }
                    }}/>
                    
                    {/* Badge auteur avec effet de verre */}
                    <Chip
                      icon={<PersonIcon />}
                      label={book.auteur || 'Auteur inconnu'}
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        backgroundColor: 'rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        color: 'white',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontWeight: 500,
                        '& .MuiChip-icon': {
                          color: 'white'
                        }
                      }}
                    />
                    {/* Overlay avec gradient */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 50%)',
                        opacity: 0.7,
                        transition: 'opacity 0.3s ease',
                        '&:hover': {
                          opacity: 0.9
                        }
                      }}
                    />
                    
                    {/* Badge populaire standardisu00e9 - positionnement fixe */}
                    {book.populaire && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: 150,
                          backgroundColor: '#7B3F00',
                          color: 'white',
                          transform: 'rotate(-45deg) translateX(-50px) translateY(-10px)',
                          padding: '5px 0',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '0.75rem',
                          textTransform: 'uppercase',
                          letterSpacing: 1,
                          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                          zIndex: 3,
                          background: 'linear-gradient(45deg, #7B3F00 30%, #D4AC0D 90%)'
                        }}
                      >
                        Populaire
                      </Box>
                    )}
                    
                    {/* Badge prix avec style premium */}
                    {book.prix && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          backgroundColor: 'secondary.main',
                          color: 'white',
                          borderRadius: '50px',
                          padding: '8px 14px',
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          letterSpacing: '0.5px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
                          zIndex: 2,
                          border: '1px solid rgba(255,255,255,0.2)',
                          background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: '0 6px 15px rgba(0,0,0,0.3)'
                          }
                        }}
                      >
                        {book.prix.toFixed(2)} €
                      </Box>
                    )}

                    {/* Bouton de détail */}
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        zIndex: 2,
                        display: 'flex',
                        gap: '10px'
                      }}
                    >
                      <Tooltip title="Voir détails">
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToBookDetail(book.id);
                          }}
                          sx={{ 
                            backgroundColor: 'rgba(255,255,255,0.85)',
                            color: appTheme.primary.main,
                            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                            '&:hover': {
                              backgroundColor: 'white',
                              color: appTheme.accent.main,
                              transform: 'scale(1.1)',
                            }
                          }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Button 
                        size="small" 
                        variant="contained" 
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => { e.stopPropagation(); handlePurchaseBook(book, e); }}
                        sx={{ 
                          textTransform: 'none', 
                          fontWeight: 600,
                          borderRadius: '20px',
                          backgroundColor: appTheme.primary.main,
                          boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
                          '&:hover': {
                            backgroundColor: appTheme.primary.dark,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        Acheter
                      </Button>
                    </Box>
                  </Box>
                  
                  <CardContent sx={{ 
                    flexGrow: 1, 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: 'linear-gradient(0deg, rgba(252,252,252,1) 0%, rgba(255,255,255,1) 100%)',
                    borderTop: '1px solid rgba(0,0,0,0.05)'
                  }}>
                    {/* Titre avec meilleure typographie */}
                    <Box sx={{ px: 2.5, py: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      {/* Titre et auteur */}
                      <Typography 
                        variant="h6" 
                        component="h3" 
                        sx={{ 
                          ...appTheme.components.typography.cardTitle,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          color: appTheme.primary.dark,
                          transition: 'color 0.2s ease',
                          '&:hover': {
                            color: appTheme.accent.main
                          }
                        }}
                      >
                        {book.titre}
                      </Typography>
                    </Box>
                    <Divider sx={{ mt: 'auto', mb: 2, opacity: 0.6 }} />
                    
                    <Button
                      variant="contained"
                      color="primary"
                      size="medium"
                      fullWidth
                      startIcon={<ShoppingCartIcon />}
                      onClick={() => handlePurchaseBook(book)}
                      sx={{
                        borderRadius: '50px',
                        boxShadow: '0 4px 12px rgba(123,63,0,0.2)',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        padding: '10px 0',
                        background: `linear-gradient(45deg, ${appTheme.primary.dark} 0%, ${appTheme.primary.main} 100%)`,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 16px rgba(123,63,0,0.25)',
                          background: `linear-gradient(45deg, ${appTheme.primary.main} 0%, ${appTheme.accent.main} 100%)`
                        }
                      }}
                    >
                      Acheter
                    </Button>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      {/* Bouton de retour en haut de page fixe avec style premium */}
      <Box 
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={navigateToHome}
          startIcon={<ArrowBackIcon />}
          sx={{
            borderRadius: '50px',
            padding: '10px 20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            background: `linear-gradient(45deg, ${appTheme.primary.dark} 0%, ${appTheme.primary.main} 100%)`,
            fontWeight: 600,
            letterSpacing: '0.5px',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 6px 25px rgba(0,0,0,0.2)',
              transform: 'translateY(-3px)'
            }
          }}
        >
          Retour
        </Button>
      </Box>

      {/* Message de notification avec style premium */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Fade}
        sx={{
          '& .MuiSnackbarContent-root': {
            borderRadius: '10px'
          }
        }}
      >
        <MuiAlert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled"
          icon={snackbar.severity === 'success' ? <CheckCircleIcon fontSize="inherit" /> : 
                 snackbar.severity === 'error' ? <ErrorIcon fontSize="inherit" /> : 
                 snackbar.severity === 'warning' ? <WarningIcon fontSize="inherit" /> : 
                 <InfoIcon fontSize="inherit" />}
          sx={{ 
            width: '100%',
            borderRadius: '8px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
            '& .MuiAlert-icon': {
              fontSize: '1.5rem',
              opacity: 0.9
            },
            '& .MuiAlert-message': {
              fontSize: '0.95rem',
              fontWeight: 500,
              paddingTop: '3px',
              paddingBottom: '3px'
            }
          }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Container>
      )}
    </>
  );
}

export default CategoryBooks;
