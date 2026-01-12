import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { OuvragesService, CategoriesService } from '../services/FastApiService';
import './BookList.css';
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
  Link,
  CircularProgress,
  Paper,
  TextField,
  InputAdornment,
  Avatar,
  CardActionArea,
  Rating,
  Stack,
  alpha,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  styled,
  Tab,
  Tabs,
  CardActions,
  Tooltip,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert as MuiAlert
} from '@mui/material';

// Importations d'icônes Material - Organisées par catégories
// Navigation et UI général
import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CategoryIcon from '@mui/icons-material/Category';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SendIcon from '@mui/icons-material/Send';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EastIcon from '@mui/icons-material/East';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Contact et personnes
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import GroupIcon from '@mui/icons-material/Group';

// Littérature et arts
import AutoStoriesIcon from '@mui/icons-material/AutoStories';  // Romans
import MenuBookIcon from '@mui/icons-material/MenuBook';        // Livres
import ImportContactsIcon from '@mui/icons-material/ImportContacts'; // Manga
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary'; // Bibliothèque
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';  // Fantastique
import MusicNoteIcon from '@mui/icons-material/MusicNote';      // Poésie
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy'; // Théâtre

// Cuisine et gastronomie
import RestaurantIcon from '@mui/icons-material/Restaurant';     // Cuisine
import LocalDiningIcon from '@mui/icons-material/LocalDining';   // Repas/Gastronomie
import BakeryDiningIcon from '@mui/icons-material/BakeryDining'; // Boulangerie
import LocalPizzaIcon from '@mui/icons-material/LocalPizza';    // Cuisine italienne
import RamenDiningIcon from '@mui/icons-material/RamenDining';  // Cuisine asiatique
import CakeIcon from '@mui/icons-material/Cake';               // Pâtisserie
import IcecreamIcon from '@mui/icons-material/Icecream';        // Desserts/Chocolat
import CookieIcon from '@mui/icons-material/Cookie';            // Biscuits
import LocalBarIcon from '@mui/icons-material/LocalBar';        // Vins

// Voyage et événements
import FlightIcon from '@mui/icons-material/Flight';            // Voyage
import LocationOnIcon from '@mui/icons-material/LocationOn';    // Lieux
import EventNoteIcon from '@mui/icons-material/EventNote';      // Événements
import EventAvailableIcon from '@mui/icons-material/EventAvailable'; // Réservations
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'; // Calendrier

// Sciences, éducation et affaires
import ScienceIcon from '@mui/icons-material/Science';          // Sciences
import SchoolIcon from '@mui/icons-material/School';            // Éducation
import ComputerIcon from '@mui/icons-material/Computer';        // Technologie
import TrendingUpIcon from '@mui/icons-material/TrendingUp';    // Économie/Business
import PsychologyIcon from '@mui/icons-material/Psychology';    // Psychologie
import HeadphonesIcon from '@mui/icons-material/Headphones';    // Audio
import AccessTimeIcon from '@mui/icons-material/AccessTime';    // Temps

// Services et produits
import RoomServiceIcon from '@mui/icons-material/RoomService';  // Services
import LocalOfferIcon from '@mui/icons-material/LocalOffer';    // Offres
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Panier
import NewReleasesIcon from '@mui/icons-material/NewReleases';  // Nouveautés
import ThumbUpIcon from '@mui/icons-material/ThumbUp';          // Appréciation
import StarIcon from '@mui/icons-material/Star';                // Évaluation
import MailOutlineIcon from '@mui/icons-material/MailOutline';  // Newsletter




import ErrorDisplay from './ErrorDisplay';
import Header from './Header';
import Footer from './Footer';


const vibrantSpines = [
  '#42a5f5',
  '#ec407a',
  '#66bb6a',  
  '#ffd54f',
  '#ab47bc',
  '#26c6da',
  '#ffa726',
  '#ef5350',
  '#d4e157',
  '#ba68c8',
  '#26a69a',
];



function groupByCategory(books, categoriesList = []) {
  const catIdToName = {};
  categoriesList.forEach(cat => {
    catIdToName[cat.id] = cat.nom;
  });

  const categories = {};
  books.forEach(book => {
    const catId = book.categorie_id;
    const catName = catIdToName[catId] || 'Divers';
    if (!categories[catName]) categories[catName] = [];
    categories[catName].push(book);
  });

  return categories;
}const appTheme = {
  primary: {
    main: '#7B3F00',
    light: '#A67C52',
    dark: '#4A2511',
    contrastText: '#fff'
  },
  secondary: {
    main: '#D81B60',
    light: '#F06292',
    dark: '#AD1457',
    contrastText: '#fff'
  },
  accent: {
    main: '#D4AC0D',
    light: '#F9E79F',
    dark: '#B7950B',
    contrastText: '#fff'
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#f5f5f5'
  },
  background: {
    paper: '#ffffff',
    default: '#f5f7fa',
    dark: '#121212',
  }
};

// Composant d'affichage des catégories avec icônes et style Material UI
const CategoriesSection = ({ categories, booksByCategory, onSelectCategory }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  // Palette de couleurs harmonieuse pour les icônes
  const iconColors = {
    literature: '#3f51b5',     // Bleu pour littérature
    fantasy: '#9c27b0',       // Violet pour fantastique
    comics: '#f50057',        // Rose pour manga/BD
    art: '#3f51b5',           // Bleu pour arts
    food: '#e91e63',          // Rose pour cuisine
    travel: '#2196f3',        // Bleu ciel pour voyage
    pastry: '#ec407a',        // Rose pour pâtisserie
    bakery: '#795548',        // Marron pour boulangerie
    chocolate: '#5d4037',     // Marron foncé pour chocolat
    wine: '#880e4f',          // Bordeaux pour vin
    gastronomy: '#d84315',    // Orange pour gastronomie
    science: '#0277bd',       // Bleu foncé pour sciences
    education: '#1565c0',     // Bleu médium pour formation
    business: '#2e7d32',      // Vert pour management/économie
    psychology: '#4a148c',    // Violet foncé pour psychologie
    philosophy: '#004d40',    // Vert foncé pour philosophie
    default: '#455a64',       // Gris bleu pour défaut
  };
  
  // Taille d'icône adaptative selon le périphérique
  const iconSize = isMobile ? 40 : isTablet ? 48 : 56;
  
  // Mapping complet des icônes pour toutes les catégories
  const categoryIcons = {
    // Littérature
    'Roman': <AutoStoriesIcon sx={{ fontSize: iconSize, color: iconColors.literature }} />,
    'Fantastique': <AutoAwesomeIcon sx={{ fontSize: iconSize, color: iconColors.fantasy }} />,
    'Manga': <ImportContactsIcon sx={{ fontSize: iconSize, color: iconColors.comics }} />,
    'Poésie': <MusicNoteIcon sx={{ fontSize: iconSize, color: iconColors.art }} />,
    'PoÃ©sie': <MusicNoteIcon sx={{ fontSize: iconSize, color: iconColors.art }} />, // Encodage alternatif
    'Théâtre': <TheaterComedyIcon sx={{ fontSize: iconSize, color: iconColors.art }} />,
    'ThÃ©Ã¢tre': <TheaterComedyIcon sx={{ fontSize: iconSize, color: iconColors.art }} />, // Encodage alternatif
    
    // Cuisine et gastronomie
    'Cuisine': <RestaurantIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Cuisine Italienne': <LocalPizzaIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Cuisine Asiatique': <RamenDiningIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Cuisine française': <LocalDiningIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Cuisine du monde': <RamenDiningIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Recettes traditionnelles': <MenuBookIcon sx={{ fontSize: iconSize, color: iconColors.food }} />,
    'Gastronomie': <LocalDiningIcon sx={{ fontSize: iconSize, color: iconColors.gastronomy }} />,
    
    // Pâtisserie et desserts
    'Pâtisserie': <CakeIcon sx={{ fontSize: iconSize, color: iconColors.pastry }} />,
    'PÃ¢tisserie': <CakeIcon sx={{ fontSize: iconSize, color: iconColors.pastry }} />, // Encodage alternatif
    'Gâteaux': <CakeIcon sx={{ fontSize: iconSize, color: iconColors.pastry }} />,
    'GÃ¢teaux': <CakeIcon sx={{ fontSize: iconSize, color: iconColors.pastry }} />, // Encodage alternatif
    'Biscuits': <CookieIcon sx={{ fontSize: iconSize, color: iconColors.bakery }} />,
    'Desserts': <IcecreamIcon sx={{ fontSize: iconSize, color: iconColors.pastry }} />,
    
    // Spécialités
    'Boulangerie': <BakeryDiningIcon sx={{ fontSize: iconSize, color: iconColors.bakery }} />,
    'Chocolats': <IcecreamIcon sx={{ fontSize: iconSize, color: iconColors.chocolate }} />,
    'Chocolat': <IcecreamIcon sx={{ fontSize: iconSize, color: iconColors.chocolate }} />,
    'Vins et Spiritueux': <LocalBarIcon sx={{ fontSize: iconSize, color: iconColors.wine }} />,
    'Vins': <LocalBarIcon sx={{ fontSize: iconSize, color: iconColors.wine }} />,
    
    // Voyage et lifestyle
    'Voyage': <FlightIcon sx={{ fontSize: iconSize, color: iconColors.travel }} />,
    
    // Sciences et éducation
    'Sciences': <ScienceIcon sx={{ fontSize: iconSize, color: iconColors.science }} />,
    'Formation': <SchoolIcon sx={{ fontSize: iconSize, color: iconColors.education }} />,
    'Économie': <TrendingUpIcon sx={{ fontSize: iconSize, color: iconColors.business }} />,
    'Ãconomie': <TrendingUpIcon sx={{ fontSize: iconSize, color: iconColors.business }} />, // Encodage alternatif
    'Management': <TrendingUpIcon sx={{ fontSize: iconSize, color: iconColors.business }} />,
    'Psychologie': <PsychologyIcon sx={{ fontSize: iconSize, color: iconColors.psychology }} />,
    'Philosophie': <SchoolIcon sx={{ fontSize: iconSize, color: iconColors.philosophy }} />,
    
    // Valeur par défaut
    'default': <CategoryIcon sx={{ fontSize: iconSize, color: iconColors.default }} />,
  };

  return (
    <Box component="section" sx={{ 
      py: { xs: 8, md: 12 },
      bgcolor: '#f8f9fa',
      backgroundImage: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
      borderRadius: { md: 3 },
      boxShadow: { md: 'inset 0 0 20px rgba(0,0,0,0.03)' }
    }}>
      <Container maxWidth="lg">
        {/* En-tête de section élégant */}
        <Box sx={{ 
          textAlign: { xs: 'center', md: 'left' },
          mb: { xs: 6, md: 8 }
        }}>
          <Typography 
            variant="overline" 
            sx={{ 
              color: 'text.secondary',
              fontWeight: 700, 
              letterSpacing: 1.5,
              fontSize: '0.85rem',
              display: 'inline-block',
              position: 'relative',
              pb: 1,
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: { xs: '30%', md: 0 },
                width: { xs: '40%', md: '60px' },
                height: '3px',
                borderRadius: '4px',
                backgroundColor: theme.palette.primary.main,
              }
            }}
          >
            EXPLOREZ SELON VOS PASSIONS
          </Typography>
          <Typography 
            variant="h3" 
            sx={{ 
              mt: 2,
              maxWidth: '800px', 
              fontWeight: 800,
              lineHeight: 1.2,
              fontSize: { xs: '2rem', md: '2.5rem' },
              mx: { xs: 'auto', md: 0 }
            }}
          >
            Des univers littéraires pour chaque curiosité
          </Typography>
          <Typography 
            variant="body1"
            color="text.secondary"
            sx={{ 
              mt: 2,
              maxWidth: '600px',
              fontSize: '1.1rem',
              mx: { xs: 'auto', md: 0 }
            }}
          >
            Découvrez notre collection par thématiques et plongez dans vos sujets favoris
          </Typography>
        </Box>
        
        {/* Grille de catégories avec design amélioré */}
        <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
          {categories.map(cat => {
            // Récupération de l'icône correspondante à la catégorie
            const categoryIcon = categoryIcons[cat.nom] || categoryIcons.default;
            // Détermination de la couleur principale basée sur l'icône
            const iconColor = categoryIcon.props.sx.color;
            
            return (
              <Grid item xs={6} sm={4} md={3} lg={2} key={cat.id}>
                <Card
                  onClick={() => onSelectCategory(cat)}
                  sx={{
                    position: 'relative',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    height: { xs: 160, sm: 180, md: 200 },
                    borderRadius: { xs: 3, md: 4 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: { xs: 1.5, sm: 2 },
                    boxShadow: '0 8px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: `linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(251,251,255,1) 100%)`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '5px',
                      background: iconColor,
                      opacity: 0.7,
                      transition: 'height 0.25s ease',
                    },
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 16px 30px rgba(0,0,0,0.1)',
                      '&::before': {
                        height: '7px',
                        opacity: 1,
                      },
                      '& .category-icon-wrapper': {
                        transform: 'scale(1.15) translateY(-5px)',
                        backgroundColor: `${iconColor}18`,
                      },
                      '& .category-title': {
                        color: iconColor
                      },
                      '& .category-chip': {
                        backgroundColor: `${iconColor}15`,
                        color: iconColor
                      }
                    }
                  }}
                >
                  {/* Wrapper d'icône avec style amélioré */}
                  <Box 
                    className="category-icon-wrapper"
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      mb: 2,
                      p: { xs: 1.5, md: 2 },
                      borderRadius: '50%',
                      backgroundColor: 'rgba(0,0,0,0.03)',
                    }}
                  >
                    {categoryIcon}
                  </Box>
                  
                  {/* Titre de catégorie */}
                  <Typography 
                    className="category-title"
                    variant="h6" 
                    align="center" 
                    sx={{ 
                      fontWeight: 700, 
                      fontSize: { xs: '0.95rem', sm: '1.1rem', md: '1.15rem' },
                      lineHeight: 1.2,
                      transition: 'color 0.3s ease',
                      maxWidth: '90%',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      display: '-webkit-box'
                    }}
                  >
                    {cat.nom}
                  </Typography>
                  
                  {/* Badge de nombre de livres */}
                  <Chip
                    className="category-chip"
                    label={`${(booksByCategory[cat.nom] || []).length} livre${(booksByCategory[cat.nom] || []).length > 1 ? 's' : ''}`}
                    size="small"
                    sx={{
                      mt: 1,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      bgcolor: 'rgba(0,0,0,0.04)',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                      transition: 'all 0.3s ease',
                      height: '22px',
                      '.MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
}

// Composant principal BookList avec design professionnel et sections améliorées
function BookList() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [categories, setCategories] = useState([]);
  const [livres, setLivres] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [readerChoice, setReaderChoice] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryBooks, setCategoryBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Section de bannière héroïque pour afficher des promotions ou messages importants
  const heroBannerContent = {
    title: "La connaissance à portée de main",
    subtitle: "Découvrez notre sélection littéraire soigneusement choisie pour nourrir votre curiosité",
    ctaText: "Explorez notre catalogue",
    ctaLink: "/catalogue",
  };

  const handlePurchaseBook = async (book, event) => {
    if (event) {
      event.stopPropagation();
    }
    
    try {
      await addToCart(
        book.id,
        1,
        book.prix || 0, // Utiliser le prix du livre
        {
          titre: book.titre,
          auteur: book.auteur,
          editeur: book.editeur,
          prix: book.prix,
          photo: book.photo,
          image: book.photo, // Ajout pour garantir la cohérence des images
          isbn: book.isbn
        },
        false // Explicitement pour achat, bien que CartContext le force déjà
      );
      
      // Utiliser setSnackbar si disponible, sinon utiliser une alerte
      if (typeof setSnackbar === 'function') {
        setSnackbar({ open: true, message: `"${book.titre}" a été ajouté à votre panier.`, severity: 'success' });
      } else {
        console.log(`"${book.titre}" a été ajouté à votre panier.`);
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout au panier:", error);
      
      // Utiliser setSnackbar si disponible, sinon utiliser une alerte
      if (typeof setSnackbar === 'function') {
        setSnackbar({ open: true, message: `Erreur lors de l'ajout au panier: ${error.message}`, severity: 'error' });
      } else {
        console.error(`Erreur lors de l'ajout au panier: ${error.message}`);
      }
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Fonction pour grouper les livres par catégorie
  const groupByCategory = (books, categories) => {
    const result = {};
    
    // Initialiser toutes les catégories avec un tableau vide
    categories.forEach(category => {
      result[category.nom] = [];
    });
    
    // Ajouter les livres à leurs catégories respectives
    books.forEach(book => {
      // Trouver la catégorie correspondant à l'ID de la catégorie du livre
      const category = categories.find(cat => cat.id === book.categorie_id);
      if (category && category.nom) {
        if (!result[category.nom]) {
          result[category.nom] = [];
        }
        result[category.nom].push(book);
      }
    });
    
    console.log("Livres groupés par catégorie:", result);
    return result;
  };

  const fetchCategories = async () => {
    try {
      const categoriesData = await CategoriesService.getAll();
      // Vérification que nous avons bien un tableau de catégories
      const categoriesArray = Array.isArray(categoriesData) ? categoriesData : [];
      console.log('Catégories récupérées:', categoriesArray);
      
      // Vérification détaillée des données de catégories
      if (categoriesArray.length > 0) {
        console.log('Exemple de catégorie:', categoriesArray[0]);
        console.log('Structure de la catégorie:', Object.keys(categoriesArray[0]));
      }

      // Ajout d'un traitement pour garantir que chaque catégorie a un attribut 'nom'
      const processedCategories = categoriesArray.map(cat => {
        // S'assurer que l'ID est correctement défini
        const id = cat.id || cat._id || cat.categoryId || Math.random().toString(36).substr(2, 9);
        
        // Si le nom est défini dans un autre attribut comme 'name' ou 'category'
        if (!cat.nom && cat.name) return { ...cat, id, nom: cat.name };
        if (!cat.nom && cat.category) return { ...cat, id, nom: cat.category };
        if (!cat.nom && cat.categoryName) return { ...cat, id, nom: cat.categoryName };
        // Si 'nom' est présent mais est un objet plutôt qu'une chaîne (cas où 'category' est affiché)
        if (cat.nom && typeof cat.nom === 'object') {
          return { ...cat, id, nom: cat.nom.name || cat.nom.category || "Catégorie" };
        }
        return { ...cat, id };
      });

      console.log('Catégories traitées:', processedCategories);
      setCategories(processedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Fonction pour naviguer vers la page CategoryBooks.js avec l'ID de la catégorie
  const handleCategoryClick = (category) => {
    console.log(`Navigation vers la catégorie: ${category.nom} (ID: ${category.id})`);
    // Utilisez navigate de react-router-dom pour rediriger vers la page de catégorie avec l'ID
    navigate(`/category/${category.id}`);
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    if (category) {
      const filtered = livres.filter(book => book.categorie_id === category.id);
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(livres);
    }
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      const filtered = livres.filter(book =>
        book.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.auteur.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.description && book.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredBooks(filtered);
    } else {
      setFilteredBooks(livres);
    }
  };

  // Pour les nouveaux livres affichés dans les composants enfants (version légère)
  const newBooks = livres.length > 0 ? livres.slice(0, 3) : []; // 3 derniers livres ajoutés
  
  // Définition de la fonction fetchBooks au niveau du composant pour qu'elle soit accessible partout
  const fetchBooks = async () => {
    setLoading(true);
    try {
      // FastAPI retourne directement le tableau de livres, pas besoin de .data
      const allBooks = await OuvragesService.getAll();
      
      // Vérification que les données sont bien un tableau
      const booksArray = Array.isArray(allBooks) ? allBooks : [];

      // Définir tous les livres
      setLivres(booksArray);
      setFilteredBooks(booksArray);

      // Livres en vedette : 1 sur 5 (max 6)
      const featured = booksArray.filter((_, idx) => idx % 5 === 0).slice(0, 6);
      setFeaturedBooks(featured);

      // Livres populaires : par prix décroissant (max 6)
      const popular = [...booksArray]
        .sort((a, b) => (b.prix || 0) - (a.prix || 0))
        .slice(0, 6);
      setPopularBooks(popular);

      // Nouveautés : tri par date d'ajout (max 6)
      const sortedByDate = [...booksArray].sort((a, b) => 
        new Date(b.date_ajout || '2000-01-01') - new Date(a.date_ajout || '2000-01-01')
      );
      setNewArrivals(sortedByDate.slice(0, 6));

      // Choix des lecteurs : aléatoire (max 6)
      const readerFavorites = [...booksArray]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6);
      setReaderChoice(readerFavorites);

      // Événements de la bibliothèque (données statiques en attendant l'API)
      // Utilisation de données statiques pour les événements, car ils ne proviennent pas de l'API
      const libraryEvents = [
        {
          id: 1,
          title: "Rencontre avec l'auteur Marc Dupont",
          date: "15 Juin",
          time: "18:00 - 20:00",
          location: "Salle Principale",
          image: "/img/event1.jpg"
        },
        {
          id: 2,
          title: "Atelier d'écriture créative",
          date: "22 Juin",
          time: "14:00 - 16:30",
          location: "Espace Ateliers",
          image: "/img/event2.jpg"
        },
        {
          id: 3,
          title: "Club de lecture: Les Misérables",
          date: "29 Juin",
          time: "17:00 - 19:00",
          location: "Café Littéraire",
          image: "/img/event3.jpg"
        }
      ];
      
      setEvents(libraryEvents);
      setError(null);
    } catch (error) {
      console.error('Erreur lors du chargement des ouvrages:', error);
      setError('Erreur lors du chargement du catalogue');
    } finally {
      setLoading(false);
    }
  };
  
  // Calcul des livres par catégorie
  const booksByCategory = useMemo(() => groupByCategory(livres, categories), [livres, categories]);

  return (
    <Container maxWidth="xl" sx={{ minHeight: '100vh' }}>
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}
        >
          <CircularProgress size={60} thickness={4} sx={{ color: appTheme.primary.main }} />
        </Box>
      ) : error ? (
        <ErrorDisplay message={error} />
      ) : (
        <>
          {/* En-tête Hero Banner avec recherche */}
          <HeroBannerSection 
            content={{
              title: "Bibliothèque Moderne",
              subtitle: "Découvrez notre collection de livres dans une interface moderne et intuitive. Recherchez, achetez et explorez nos rayons virtuels.",
              ctaText: "En savoir plus",
              ctaLink: "/about"
            }}
            onSearchSubmit={handleSearchSubmit}
            onSearchChange={handleSearchChange}
            searchQuery={searchQuery}
          />

          {/* Section des catégories */}
          <CategoriesSection 
            categories={categories} 
            booksByCategory={booksByCategory} 
            onSelectCategory={handleCategoryClick}
          />

          {/* Section newsletter avec formulaire d'inscription */}
          <NewsletterSection />

          {/* Section des livres en vedette */}
          <FeaturedBooksSection featuredBooks={featuredBooks} handlePurchaseBook={handlePurchaseBook} />
          
          {/* Section Nouveautés */}
          <NewArrivalsSection newBooks={newArrivals} handlePurchaseBook={handlePurchaseBook} />
          
          {/* Section Livres Populaires */}
          <PopularBooksSection popularBooks={popularBooks} handlePurchaseBook={handlePurchaseBook} />
          
          {/* Section des choix des lecteurs */}
          <ReadersChoiceSection books={readerChoice} handlePurchaseBook={handlePurchaseBook} />

          {/* Section Événements */}
          <EventsSection events={events} />
        </>
      )}
    </Container>
  );
}

// Section des livres en vedette avec design attrayant
function FeaturedBooksSection({ featuredBooks, handlePurchaseBook }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!featuredBooks || featuredBooks.length === 0) return null;
  
  return (
    <Box component="section" sx={{ py: 8, bgcolor: appTheme.background.featured, color: 'white' }}>
      <Container maxWidth="lg">
        {/* En-tête de section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Chip 
            icon={<StarIcon />} 
            label="SÉLECTION" 
            sx={{ 
              mb: 2, 
              fontSize: '0.75rem', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              fontWeight: 600
            }} 
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
            Nos livres en vedette
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, mx: 'auto', color: 'rgba(255,255,255,0.7)' }}>
            Découvrez notre sélection d'ouvrages particulièrement recommandés par notre équipe.
          </Typography>
        </Box>
        
        {/* Grille de livres en vedette */}
        <Grid container spacing={4}>
          {featuredBooks.slice(0, 6).map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                  },
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                  alt={book.titre}
                  sx={{ objectFit: 'cover' }}
                  onClick={() => navigate(`/book/${book.id}`)}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {book.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={1}>
                    {book.auteur}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {book.description || 'Un ouvrage fascinant qui vous transportera dans un monde extraordinaire de connaissances et d\'aventures.'}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Rating value={4.5} precision={0.5} size="small" readOnly />                   
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      4.5/5
                    </Typography>
                  </Box>
                </CardContent>
                <Box sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button 
                    size="small" 
                    variant="contained" 
                    onClick={(e) => {
                      e.stopPropagation();
                      try {
                        handlePurchaseBook(book, e);
                      } catch (error) {
                        console.error("Erreur lors de l'achat:", error);
                      }
                    }}
                    sx={{ 
                      textTransform: 'none', 
                      fontWeight: 600,
                      borderRadius: '20px',
                      backgroundColor: appTheme.primary.main
                    }}
                  >
                    Acheter
                  </Button>
                  <Chip 
                    label={book.categorie || 'Général'} 
                    size="small" 
                    sx={{ 
                      fontWeight: 500, 
                      bgcolor: 'rgba(0,0,0,0.05)' 
                    }} 
                  />
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Bouton pour voir tous les livres en vedette */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/vedettes')}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                borderColor: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Voir tous les livres en vedette
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section des livres populaires avec mise en page différente
function PopularBooksSection({ popularBooks, handlePurchaseBook }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!popularBooks || popularBooks.length === 0) return null;
  
  return (
    <Box component="section" sx={{ py: 8, bgcolor: appTheme.background.light }}>
      <Container maxWidth="lg">
        {/* En-tête de section */}
        <Box sx={{ mb: 6 }}>
          <Chip 
            icon={<TrendingUpIcon />} 
            label="POPULAIRES" 
            sx={{ 
              mb: 2, 
              fontSize: '0.75rem', 
              bgcolor: alpha(appTheme.accent.main, 0.1), 
              color: appTheme.accent.main, 
              fontWeight: 600
            }} 
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Nos livres les plus populaires
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
            Découvrez les ouvrages les plus demandés par nos lecteurs ces dernières semaines.
          </Typography>
        </Box>
        
        {/* Liste horizontale des livres populaires avec mise en page différente */}
        <Box sx={{ overflowX: 'auto', pb: 2 }}>
          <Grid container spacing={3} sx={{ flexWrap: isMobile ? 'nowrap' : 'wrap', pb: 2 }}>
            {popularBooks.slice(0, 8).map((book) => (
              <Grid item xs={11} sm={6} md={3} key={book.id} sx={{ minWidth: isMobile ? 280 : 'auto' }}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                    },
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                      alt={book.titre}
                      sx={{ objectFit: 'cover' }}
                      onClick={() => navigate(`/book/${book.id}`)}
                    />
                    <Chip 
                      label={`#${book.position || '1'}`} 
                      size="small" 
                      sx={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        bgcolor: appTheme.accent.main,
                        color: 'white',
                        fontWeight: 700
                      }} 
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                      {book.titre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={1}>
                      {book.auteur}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Rating value={book.rating || 4} precision={0.5} size="small" readOnly />                   
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {book.rating || '4.0'}/5
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <GroupIcon sx={{ fontSize: 16, mr: 0.5 }} /> {book.achats_count || 120} acheteurs
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Button 
                      size="small" 
                      variant="contained" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePurchaseBook(book, e);
                      }}
                      sx={{ 
                        textTransform: 'none', 
                        fontWeight: 600,
                        borderRadius: '20px',
                        backgroundColor: appTheme.primary.main
                      }}
                    >
                      Acheter
                    </Button>
                    <Tooltip title="Voir détails">
                      <IconButton 
                        size="small"
                        onClick={() => navigate(`/book/${book.id}`)}
                        sx={{ ml: 1 }}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* Lien vers tous les livres populaires */}
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button 
            variant="text" 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/popular')}
            sx={{
              fontWeight: 600,
              textTransform: 'none',
              color: appTheme.primary.main
            }}
          >
            Voir tous les livres populaires
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section des choix des lecteurs
function ReadersChoiceSection({ books, handlePurchaseBook }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!books || books.length === 0) return null;
  
  return (
    <Box component="section" sx={{ py: 8, bgcolor: alpha(appTheme.primary.light, 0.05) }}>
      <Container maxWidth="lg">
        {/* En-tête de section */}
        <Box sx={{ mb: 6 }}>
          <Chip 
            icon={<ThumbUpIcon />} 
            label="CHOIX DES LECTEURS" 
            sx={{ 
              mb: 2, 
              fontSize: '0.75rem', 
              bgcolor: alpha(appTheme.primary.main, 0.1), 
              color: appTheme.primary.main, 
              fontWeight: 600
            }} 
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Sélectionnés par nos lecteurs
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
            Les ouvrages plébiscités par notre communauté de lecteurs passionnés.
          </Typography>
        </Box>
        
        {/* Cartes de livres avec disposition en grille masonry */}
        <Grid container spacing={3}>
          {books.slice(0, 6).map((book, index) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: index % 3 === 0 ? 'column' : 'row',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}
                onClick={() => navigate(`/book/${book.id}`)}
              >
                <CardMedia
                  component="img"
                  sx={{
                    width: index % 3 === 0 ? '100%' : 120,
                    height: index % 3 === 0 ? 180 : '100%',
                    objectFit: 'cover'
                  }}
                  image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                  alt={book.titre}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Avatar 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        bgcolor: appTheme.primary.main,
                        fontSize: '0.75rem',
                        mr: 1 
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="caption" color="text.secondary">
                      Recommandé par {book.recommender || 'Alexandra M.'}
                    </Typography>
                  </Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1 }}>
                    {book.titre}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {book.auteur}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Button 
                      variant="contained" 
                      color="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        try { 
                          handlePurchaseBook(book, e);
                        } catch (error) {
                          console.error("Erreur lors de l'achat:", error);
                          // Implémentation alternative si handlePurchaseBook échoue
                          try {
                            addToCart(
                              book.id,
                              1,
                              book.prix || 0,
                              {
                                titre: book.titre,
                                auteur: book.auteur,
                                editeur: book.editeur,
                                prix: book.prix,
                                photo: book.photo,
                                isbn: book.isbn
                              },
                              false
                            );
                            alert(`"${book.titre}" a été ajouté à votre panier.`);
                          } catch (innerError) {
                            console.error("Erreur lors de l'ajout au panier:", innerError);
                            alert("Une erreur s'est produite lors de l'ajout au panier.");
                          }
                        }
                      }}
                      size="small"
                      startIcon={<ShoppingCartIcon />}
                      sx={{
                        borderRadius: '30px',
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 3px 10px rgba(216, 27, 96, 0.2)',
                        px: 2
                      }}
                    >
                      Acheter
                    </Button>
                    <Rating value={4.5} precision={0.5} size="small" readOnly />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Bouton pour voir tous les choix des lecteurs */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/readers-choice')}
            sx={{
              borderRadius: 50,
              px: 3,
              py: 1,
              borderColor: appTheme.primary.main,
              color: appTheme.primary.main,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                borderColor: appTheme.primary.dark,
                backgroundColor: alpha(appTheme.primary.light, 0.1)
              }
            }}
          >
            Explorer tous les choix des lecteurs
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section des événements à venir
function EventsSection({ events }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!events || events.length === 0) {
    // S'il n'y a pas d'événements, créons quelques exemples par défaut
    events = [
      {
        id: 1,
        titre: "Club de lecture : Romans policiers",
        date: "2023-06-15T18:00:00",
        lieu: "Salle René Char",
        description: "Discussion autour des meilleurs romans policiers contemporains.",
        image: "event1.jpg"
      },
      {
        id: 2,
        titre: "Atelier d'écriture créative",
        date: "2023-06-18T14:30:00",
        lieu: "Auditorium",
        description: "Venez développer votre créativité avec notre animatrice Léa Martin.",
        image: "event2.jpg"
      },
      {
        id: 3,
        titre: "Rencontre avec l'auteur Marc Dupont",
        date: "2023-06-22T19:00:00",
        lieu: "Grande salle",
        description: "Présentation de son dernier roman et séance de dédicace.",
        image: "event3.jpg"
      }
    ];
  }
  
  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
  };
  
  return (
    <Box component="section" sx={{ py: 8, bgcolor: appTheme.background.shelves, color: 'white' }}>
      <Container maxWidth="lg">
        {/* En-tête de section */}
        <Box sx={{ mb: 6, textAlign: isMobile ? 'center' : 'left' }}>
          <Chip 
            icon={<EventAvailableIcon />} 
            label="ÉVÉNEMENTS" 
            sx={{ 
              mb: 2, 
              fontSize: '0.75rem', 
              bgcolor: 'rgba(255,255,255,0.1)', 
              color: 'white', 
              fontWeight: 600
            }} 
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, color: 'white', mb: 2 }}>
            Nos prochains événements
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 700, color: 'rgba(255,255,255,0.7)' }}>
            Participez à nos rencontres, ateliers et clubs de lecture pour partager votre passion des livres.
          </Typography>
        </Box>
        
        {/* Liste des événements */}
        <Grid container spacing={4}>
          {events.slice(0, 3).map((event) => (
            <Grid item xs={12} sm={6} md={4} key={event.id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  bgcolor: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                  borderRadius: '12px',
                  overflow: 'hidden'
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={event.image ? `/img/events/${event.image}` : '/img/event-default.jpg'}
                  alt={event.titre}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <CalendarMonthIcon sx={{ mr: 1, color: appTheme.accent.main }} />
                    <Typography variant="body2" sx={{ color: appTheme.accent.light }}>
                      {formatDate(event.date)}
                    </Typography>
                  </Box>
                  <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1, color: 'white' }}>
                    {event.titre}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <LocationOnIcon sx={{ mr: 1, fontSize: 18, color: 'rgba(255,255,255,0.6)' }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      {event.lieu}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.8)' }}>
                    {event.description}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 3, pt: 0 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth
                    sx={{ 
                      color: 'white', 
                      borderColor: 'rgba(255,255,255,0.3)',
                      '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                      borderRadius: '8px',
                      textTransform: 'none',
                      py: 1
                    }}
                    onClick={() => navigate(`/event/${event.id}`)}
                  >
                    S'inscrire
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Bouton pour voir tous les événements */}
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/events')}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              color: 'white',
              borderColor: 'rgba(255,255,255,0.5)',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { 
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Voir tous les événements
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section newsletter avec formulaire d'inscription
function NewsletterSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  
  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      // Ici, on simulerait l'envoi vers une API
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };
  
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        backgroundColor: appTheme.primary.dark,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Formes décoratives en arrière-plan */}
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          backgroundColor: alpha('#fff', 0.03),
          top: '-100px',
          left: '-100px'
        }} 
      />
      <Box 
        sx={{ 
          position: 'absolute', 
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: alpha('#fff', 0.05),
          bottom: '-50px',
          right: '20%'
        }} 
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Chip
                label="RESTEZ INFORMÉ"
                icon={<MailOutlineIcon sx={{ fontSize: '1rem !important' }} />}
                sx={{
                  fontWeight: 600,
                  bgcolor: alpha('#fff', 0.1),
                  color: '#fff',
                  mb: 2
                }}
              />
              <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, color: '#fff' }}>
                Abonnez-vous à notre newsletter
              </Typography>
              <Typography variant="body1" sx={{ mb: 4, color: alpha('#fff', 0.8) }}>
                Recevez nos sélections de livres, les dernières acquisitions et événements directement dans votre boîte mail.
              </Typography>
              
              {/* Points clés de la newsletter */}
              <Grid container spacing={2} sx={{ mb: 4 }}>
                {[
                  { icon: <AutoStoriesIcon />, text: "Sélections thématiques mensuelles" },
                  { icon: <LocalOfferIcon />, text: "Offres exclusives pour les abonnés" },
                  { icon: <EventAvailableIcon />, text: "Invitations aux événements" }
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box 
                        sx={{ 
                          mr: 1.5, 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: alpha('#fff', 0.1),
                          borderRadius: '50%',
                          width: 40,
                          height: 40
                        }}
                      >
                        {React.cloneElement(item.icon, { sx: { fontSize: '1.2rem', color: '#fff' } })}
                      </Box>
                      <Typography variant="body2" sx={{ color: alpha('#fff', 0.9) }}>
                        {item.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card 
              elevation={10} 
              sx={{ 
                p: 4, 
                borderRadius: 4,
                backgroundColor: '#fff',
                boxShadow: '0 15px 50px rgba(0,0,0,0.1)'
              }}
            >
              {subscribed ? (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant="h5" sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}>
                    Merci pour votre inscription!
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Vous recevrez désormais nos meilleures sélections et actualités litéraires.
                  </Typography>
                </Box>
              ) : (
                <form onSubmit={handleSubscribe}>
                  <Typography variant="h5" sx={{ mb: 3, fontWeight: 700, color: 'text.primary' }}>
                    Rejoignez notre communauté de lecteurs
                  </Typography>
                  
                  <TextField
                    fullWidth
                    label="Votre adresse email"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    sx={{ mb: 3 }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color="primary" />
                        </InputAdornment>
                      )
                    }}
                  />
                  
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="J'accepte de recevoir la newsletter et les communications de la bibliothèque"
                    sx={{ mb: 3, '& .MuiFormControlLabel-label': { fontSize: '0.875rem', color: 'text.secondary' } }}
                  />
                  
                  <Button 
                    type="submit"
                    fullWidth 
                    variant="contained" 
                    color="primary"
                    size="large"
                    startIcon={<SendIcon />}
                    sx={{ 
                      py: 1.5,
                      textTransform: 'none',
                      borderRadius: 8,
                      fontWeight: 600
                    }}
                  >
                    S'abonner à la newsletter
                  </Button>
                  
                  <Typography variant="caption" align="center" sx={{ display: 'block', mt: 2, color: 'text.secondary' }}>
                    Nous respectons votre vie privée. Désabonnez-vous à tout moment.
                  </Typography>
                </form>
              )}
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

// Section des services de la bibliothèque
function LibraryServicesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const services = [
    {
      id: 1,
      title: "Prêt & Réservation",
      description: "Empruntez jusqu'à 5 ouvrages simultanément pour une durée de 3 semaines, avec possibilité de prolongation en ligne.",
      icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
      color: "#7B3F00"
    },
    {
      id: 2,
      title: "Espaces de lecture",
      description: "Découvrez nos espaces dédiés à la lecture et au travail, avec Wi-Fi gratuit et prises électriques.",
      icon: <SchoolIcon sx={{ fontSize: 40 }} />,
      color: "#D4AC0D"
    },
    {
      id: 3,
      title: "Assistance numérique",
      description: "Notre équipe est à votre disposition pour vous aider avec nos ressources numériques et nos applications.",
      icon: <ComputerIcon sx={{ fontSize: 40 }} />,
      color: "#2E7D32"
    },
    {
      id: 4,
      title: "Conseil personnalisé",
      description: "Nos bibliothécaires experts vous proposent des recommandations selon vos goûts et intérêts.",
      icon: <HeadphonesIcon sx={{ fontSize: 40 }} />,
      color: "#1565C0"
    }
  ];
  
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        backgroundColor: 'rgba(123,63,0,0.03)',
        borderTop: '1px solid rgba(0,0,0,0.05)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Chip
            label="NOS SERVICES"
            icon={<RoomServiceIcon sx={{ fontSize: '1rem !important' }} />}
            sx={{
              fontWeight: 600,
              bgcolor: alpha(appTheme.primary.main, 0.1),
              color: appTheme.primary.main,
              mb: 2
            }}
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2, maxWidth: 800, mx: 'auto' }}>
            Services de votre bibliothèque
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
            Nous mettons tout en œuvre pour rendre votre expérience de lecture et de découverte aussi enrichissante que possible.
          </Typography>
        </Box>
        
        <Grid container spacing={4}>
          {services.map((service) => (
            <Grid item xs={12} sm={6} md={3} key={service.id}>
              <Card
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 4,
                  bgcolor: alpha(service.color, 0.04),
                  border: '1px solid',
                  borderColor: alpha(service.color, 0.1),
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 10px 30px ${alpha(service.color, 0.15)}`,
                    bgcolor: alpha(service.color, 0.07),
                  }
                }}
              >
                <Box
                  sx={{
                    mb: 2.5,
                    width: 70,
                    height: 70,
                    display: 'flex',
                    borderRadius: '24px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    bgcolor: service.color,
                    boxShadow: `0 10px 20px ${alpha(service.color, 0.3)}`,
                  }}
                >
                  {service.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 700 }}>
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 'auto' }}>
                  {service.description}
                </Typography>
                <Button
                  variant="text"
                  endIcon={<EastIcon />}
                  sx={{
                    mt: 2,
                    alignSelf: 'flex-start',
                    color: service.color,
                    p: 0,
                    '&:hover': {
                      background: 'transparent',
                      '& .MuiSvgIcon-root': {
                        transform: 'translateX(5px)'
                      }
                    },
                    '& .MuiSvgIcon-root': {
                      transition: 'transform 0.3s ease'
                    }
                  }}
                >
                  En savoir plus
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<PhoneIcon />}
            href="/services"
            sx={{
              mt: 4,
              borderRadius: 50,
              px: 4,
              py: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              borderWidth: 2,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Contacter notre équipe
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section des nouveautés avec design moderne et cartes horizontales
function NewArrivalsSection({ newBooks, handlePurchaseBook }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  if (!newBooks || newBooks.length === 0) return null;
  
  return (
    <Box component="section" sx={{ py: 8, bgcolor: '#ffffff' }}>
      <Container maxWidth="lg">
        {/* En-tête de section */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Chip 
            icon={<NewReleasesIcon />} 
            label="NOUVEAUTÉS" 
            sx={{ 
              bgcolor: 'rgba(212, 172, 13, 0.1)', 
              color: appTheme.accent.dark,
              fontWeight: 600,
              fontSize: '0.75rem',
              mb: 2
            }} 
          />
          <Typography variant="h3" component="h2" sx={{ fontWeight: 800, mb: 2 }}>
            Nouvelles acquisitions
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            Découvrez les dernières œuvres ajoutées à notre collection, sélectionnées avec soin pour enrichir vos connaissances et votre imagination.
          </Typography>
        </Box>
        
        {/* Grille de cartes horizontales pour les nouveautés */}
        <Grid container spacing={3}>
          {newBooks.map((book, index) => (
            <Grid item xs={12} key={book.id}>
              <Card 
                className="horizontal-book-card"
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    transform: 'translateY(-4px)'
                  }
                }}
              >
                {/* Indicateur de nouveauté */}
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    zIndex: 2,
                    backgroundColor: appTheme.accent.main,
                    color: 'white',
                    py: 0.5,
                    px: 1.5,
                    borderRadius: 10,
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 10px rgba(212, 172, 13, 0.3)',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <NewReleasesIcon sx={{ fontSize: '0.875rem', mr: 0.5 }} /> Nouveauté
                </Box>
                
                {/* Image du livre */}
                <CardActionArea 
                  sx={{ 
                    width: isMobile ? '100%' : 200,
                    flexShrink: 0,
                    position: 'relative'
                  }}
                  onClick={() => navigate(`/book/${book.id}`)}
                >
                  <CardMedia
                    component="img"
                    sx={{
                      height: isMobile ? 200 : '100%',
                      width: isMobile ? '100%' : 200,
                      objectFit: 'cover'
                    }}
                    image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                    alt={book.titre}
                  />
                </CardActionArea>
                
                {/* Contenu du livre */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CardContent sx={{ flex: '1 0 auto', p: 3 }}>
                    <Typography variant="overline" sx={{ color: appTheme.primary.main, fontWeight: 600, mb: 0.5 }}>
                      {book.editeur || 'Littérature'}
                    </Typography>
                    
                    <Typography 
                      variant="h5" 
                      component="h3"
                      sx={{ 
                        fontWeight: 700, 
                        mb: 1,
                        '&:hover': { color: appTheme.primary.main },
                        cursor: 'pointer'
                      }}
                      onClick={() => navigate(`/book/${book.id}`)}
                    >
                      {book.titre}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PersonIcon sx={{ fontSize: '0.9rem', mr: 0.5, color: 'text.secondary' }} />
                      <span style={{ color: 'text.secondary' }}>{book.auteur}</span>
                    </Typography>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {book.description || 
                        'Un ouvrage fascinant qui propose une perspective unique et enrichissante. Un ajout récent à notre collection qui saura captiver votre attention.'}
                    </Typography>
                    
                    {/* Tags et prix */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                      {book.prix > 0 && (
                        <Chip 
                          label={`${book.prix.toFixed(2)} €`}
                          size="small"
                          sx={{ 
                            fontWeight: 'bold',
                            backgroundColor: appTheme.accent.light,
                            color: appTheme.accent.dark
                          }}
                        />
                      )}
                      <Chip 
                        label="Disponible"
                        size="small"
                        color="success"
                        variant="outlined"
                        sx={{ fontWeight: 600 }}
                      />
                      {/* Tags supplémentaires ici */}
                    </Box>
                  </CardContent>
                  
                  {/* Actions du livre */}
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button 
                      variant="contained" 
                      startIcon={<ShoppingCartIcon />}
                      onClick={(e) => { handlePurchaseBook(book, e); }}
                      sx={{ 
                        bgcolor: appTheme.primary.main,
                        '&:hover': { bgcolor: appTheme.primary.dark },
                        borderRadius: 50,
                        px: 3,
                        py: 1.5,
                        py: 1,
                        textTransform: 'none',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(123,63,0,0.2)',
                      }}
                    >
                      Acheter
                    </Button>
                    <Button 
                      variant="outlined"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => navigate(`/book/${book.id}`)}
                      sx={{
                        ml: 2,
                        color: appTheme.primary.main,
                        borderColor: appTheme.primary.main,
                        borderRadius: 50,
                        px: 3,
                        textTransform: 'none',
                        '&:hover': { borderColor: appTheme.primary.dark }
                      }}
                    >
                      Détails
                    </Button>
                  </CardActions>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Bouton pour voir toutes les nouveautés */}
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Button 
            variant="outlined" 
            color="primary"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/nouveautes')}
            sx={{
              borderRadius: 50,
              px: 4,
              py: 1.5,
              borderWidth: 2,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { borderWidth: 2 }
            }}
          >
            Voir toutes les nouveautés
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

// Section Bannière Héroïque avec barre de recherche intégrée
function HeroBannerSection({ content }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  // Gestion locale de la recherche
  const handleLocalSearchChange = (event) => {
    setLocalSearchQuery(event.target.value);
  };
  
  const handleLocalSearchSubmit = (event) => {
    event.preventDefault();
    // Ici vous pourriez ajouter une logique de recherche si nécessaire
    console.log('Recherche soumise:', localSearchQuery);
  };

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        height: isMobile ? '60vh' : '70vh',
        maxHeight: 700,
        minHeight: isMobile ? 450 : 500,
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.7)), url(${content.imageSrc || '/img/library-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        mb: 8
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8} lg={7}>
            <Box sx={{ color: 'white', textAlign: isMobile ? 'center' : 'left', mb: isMobile ? 4 : 0 }}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{
                  fontSize: isMobile ? '2.2rem' : isTablet ? '3rem' : '3.5rem',
                  fontWeight: 800,
                  mb: 2,
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(90deg, #ffffff 0%, #f5f5f5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {content.title}
              </Typography>

              <Typography 
                variant="h5" 
                component="h2"
                sx={{ 
                  mb: 4, 
                  fontWeight: 400,
                  opacity: 0.9,
                  maxWidth: 600,
                  mx: isMobile ? 'auto' : 0,
                  lineHeight: 1.5
                }}
              >
                {content.subtitle}
              </Typography>

              {/* Barre de recherche */}
              <Box 
                component="form" 
                onSubmit={handleLocalSearchSubmit}
                sx={{
                  display: 'flex',
                  flexDirection: isMobile ? 'column' : 'row',
                  alignItems: 'center',
                  gap: 1,
                  width: '100%',
                  maxWidth: 550,
                  mx: isMobile ? 'auto' : 0,
                  mt: 4,
                  mb: 2
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher par titre, auteur ou ISBN..."
                  value={localSearchQuery}
                  onChange={handleLocalSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: 'rgba(255,255,255,0.15)',
                      borderRadius: '8px',
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.3)'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.5)'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white'
                      },
                      '&::placeholder': {
                        color: 'rgba(255,255,255,0.7)',
                        opacity: 1
                      }
                    }
                  }}
                  sx={{
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255,255,255,0.7)'
                    }
                  }}
                />
                <Button 
                  type="submit" 
                  variant="contained"
                  color="primary"
                  sx={{
                    bgcolor: appTheme.accent.main,
                    color: 'white',
                    px: 3,
                    py: isMobile ? 1.5 : 1.75,
                    borderRadius: '8px',
                    fontWeight: 600,
                    boxShadow: '0 4px 14px rgba(212, 172, 13, 0.4)',
                    width: isMobile ? '100%' : 'auto',
                    '&:hover': {
                      bgcolor: appTheme.accent.dark,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(212, 172, 13, 0.6)'
                    }
                  }}
                >
                  <SearchIcon sx={{ mr: 1 }} /> Rechercher
                </Button>
              </Box>

              <Button
                variant="outlined"
                endIcon={<EastIcon />}
                href={content.ctaLink}
                sx={{
                  mt: 3,
                  color: 'white',
                  borderColor: 'rgba(255,255,255,0.5)',
                  '&:hover': {
                    borderColor: 'white',
                    bgcolor: 'rgba(255,255,255,0.1)'
                  },
                  px: 3,
                  py: 1.25,
                  borderRadius: 50,
                  fontWeight: 600,
                  textTransform: 'none'
                }}
              >
                {content.ctaText}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} lg={5} sx={{ display: isMobile ? 'none' : 'block' }}>
            {/* Statistiques ou graphique si nécessaire */}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
  // Fin des fonctions de gestion des événements

  // Rendu principal du composant BookList
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Header />
      
      {/* Hero Banner avec recherche */}
      <Box
        sx={{
          position: 'relative',
          bgcolor: appTheme.primary.main,
          color: 'white',
          py: { xs: 8, md: 12 },
          overflow: 'hidden',
          backgroundImage: `linear-gradient(to right, ${appTheme.primary.dark}, ${appTheme.primary.main})`
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={8} lg={7}>
              <Box sx={{ maxWidth: '650px' }}>
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    fontWeight: 800,
                    lineHeight: 1.1,
                    mb: 2
                  }}
                >
                  {heroBannerContent.title}
                </Typography>

                <Typography
                  variant="h2"
                  component="h2"
                  sx={{ 
                    mb: 4, 
                    fontWeight: 400,
                    opacity: 0.9,
                    maxWidth: 600,
                    lineHeight: 1.5
                  }}
                >
                  {heroBannerContent.subtitle}
                </Typography>

                <Box 
                  component="form" 
                  onSubmit={handleSearchSubmit}
                  sx={{
                    display: 'flex',
                    flexDirection: isMobile ? 'column' : 'row',
                    alignItems: 'center',
                    gap: 1,
                    width: '100%',
                    maxWidth: 550,
                    mx: isMobile ? 'auto' : 0,
                    mt: 4,
                    mb: 2
                  }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Rechercher par titre, auteur ou ISBN..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon sx={{ color: 'rgba(255,255,255,0.7)' }} />
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: 'rgba(255,255,255,0.15)',
                        borderRadius: '8px',
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.3)'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255,255,255,0.5)'
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'white'
                        }
                      }
                    }}
                  />
                  <Button 
                    type="submit" 
                    variant="contained"
                    color="primary"
                    sx={{
                      bgcolor: appTheme.accent.main,
                      color: 'white',
                      px: 3,
                      py: isMobile ? 1.5 : 1.75,
                      borderRadius: '8px',
                      fontWeight: 600,
                      boxShadow: '0 4px 14px rgba(212, 172, 13, 0.4)',
                      width: isMobile ? '100%' : 'auto'
                    }}
                  >
                    <SearchIcon sx={{ mr: 1 }} /> Rechercher
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Section des catégories */}
      {categories && categories.length > 0 && (
        <CategoriesSection 
          categories={categories} 
          booksByCategory={groupByCategory(livres, categories)}
          onSelectCategory={handleCategoryClick}
        />
      )}
      
      {/* Section des livres en vedette */}
      {featuredBooks && featuredBooks.length > 0 && (
        <Box sx={{ py: 8, bgcolor: 'background.paper' }}>
          <Container maxWidth="lg">
            <Typography variant="h4" component="h2" sx={{ mb: 4, fontWeight: 700 }}>
              Livres en vedette
            </Typography>
            <Grid container spacing={3}>
              {featuredBooks.slice(0, 4).map(book => (
                <Grid item key={book.id} xs={12} sm={6} md={3}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.photo || '/img/book-placeholder.jpg'}
                      alt={book.titre}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3" noWrap>
                        {book.titre}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {book.auteur}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => addToCart(book.id)}>Acheter</Button>
                      <Button size="small" onClick={() => navigate(`/book/${book.id}`)}>Détails</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}
      
      <Footer />
      
      {/* Snackbar pour les notifications */}
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
    </Box>
  );
}

export default BookList;