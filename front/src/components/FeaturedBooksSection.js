import React from 'react';
import { Box, Container, Typography, Grid, Card, CardMedia, CardContent, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';

// Palette de dégradés/couleurs vives pour FeaturedBooksSection
const vibrantSpines = [
  '#42a5f5', // blue
  '#ec407a', // pink
  '#66bb6a', // green
  '#ffd54f', // yellow
  '#ab47bc', // purple
  '#26c6da', // cyan
  '#ffa726', // orange
  '#ef5350', // red
  '#d4e157', // lime
  '#ba68c8', // fuchsia
  '#26a69a', // teal
];

// Thème principal de l'application repris pour cohérence
const appTheme = {
  primary: {
    main: '#7B3F00',      // Chocolat principal
    light: '#A67C52',    // Chocolat au lait
    dark: '#4A2511',     // Chocolat noir
    contrastText: '#fff' // Texte en contraste
  },
  secondary: {
    main: '#D81B60',     // Framboise
    light: '#F06292',    // Rose pâtisserie
    dark: '#AD1457',     // Framboise foncée
    contrastText: '#fff'
  },
  background: {
    featured: '#0a1929',  // Fond foncé pour les sections en vedette
  }
};

export default function FeaturedBooksSection({ featuredBooks, handlePurchaseBook }) {
  const navigate = useNavigate();
  
  // const handleBorrowBook = async (book) => {
  //   // console.log('Emprunt du livre:', book.titre);
  // };

  if (!featuredBooks || featuredBooks.length === 0) {
    return null; // Ne rien afficher s'il n'y a pas de livres vedettes
  }
  
  return (
    <Box component="section" sx={{ 
      py: 6, 
      bgcolor: appTheme.background.featured, 
      color: 'white',
      borderRadius: 2,
      mb: 4,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Effet décoratif */}
      <Box sx={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${appTheme.secondary.light}30 0%, ${appTheme.secondary.main}10 70%)`,
        filter: 'blur(60px)',
      }} />
      
      <Container maxWidth="lg">
        <Typography 
          variant="overline" 
          component="div" 
          sx={{ 
            color: appTheme.secondary.light,
            fontWeight: 'bold',
            letterSpacing: 2,
            mb: 1,
            textAlign: 'center'
          }}
        >
          SÉLECTION SPÉCIALE
        </Typography>
        
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          gutterBottom 
          textAlign="center"
          sx={{ mb: 3 }}
        >
          Livres Vedettes
          <Box sx={{ width: 80, height: 3, bgcolor: appTheme.secondary.main, mx: 'auto', mt: 1, borderRadius: 3 }} />
        </Typography>
        
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
          {featuredBooks.map((book, index) => (
            <Grid item key={book.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                elevation={4}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-8px)',
                    boxShadow: `0 12px 20px -5px ${appTheme.primary.main}50`
                  },
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: '#121c24',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                {/* Ruban vedette */}
                <Box sx={{
                  position: 'absolute',
                  top: 15,
                  right: -30,
                  transform: 'rotate(45deg)',
                  bgcolor: appTheme.secondary.main,
                  color: 'white',
                  py: 0.5,
                  px: 4,
                  zIndex: 2,
                  fontWeight: 'bold',
                  fontSize: '0.7rem',
                  letterSpacing: 1,
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  VEDETTE
                </Box>
                
                {/* Bordure colorée sur le côté gauche */}
                <Box sx={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 5,
                  height: '100%',
                  bgcolor: vibrantSpines[index % vibrantSpines.length]
                }} />
                
                <CardMedia
                  component="img"
                  height="200"
                  image={book.photo ? `/img/${book.photo}` : '/img/default-book.jpg'}
                  alt={book.titre}
                  onClick={() => navigate(`/books/${book.id}`)}
                  sx={{ 
                    cursor: 'pointer',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.5s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                />
                <CardContent sx={{ 
                  flexGrow: 1,
                  position: 'relative',
                  zIndex: 1,
                  pt: 2,
                  px: 2,
                  pb: 2
                }}>
                  <Box sx={{ 
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}>
                    <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
                    <StarIcon fontSize="small" sx={{ color: '#FFD700' }} />
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="div" 
                    gutterBottom
                    onClick={() => navigate(`/books/${book.id}`)}
                    sx={{ 
                      cursor: 'pointer',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      lineHeight: 1.2,
                      mb: 1,
                      '&:hover': {
                        color: appTheme.secondary.light
                      }
                    }}
                  >
                    {book.titre}
                  </Typography>
                  
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(255,255,255,0.7)',
                      fontStyle: 'italic',
                      mb: 2,
                      fontSize: '0.85rem'
                    }}
                  >
                    {book.auteur}
                  </Typography>
                  
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                    {book.prix && (
                      <Chip 
                        label={`${book.prix.toFixed(2)} €`}
                        size="small"
                        sx={{ 
                          bgcolor: 'rgba(255,255,255,0.1)', 
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    )}
                    <Button
                      size="small"
                      variant="contained"
                      color="secondary"
                      onClick={() => handlePurchaseBook(book)}
                      startIcon={<ShoppingCartIcon />}
                      sx={{ 
                        borderRadius: 50,
                        textTransform: 'none',
                        px: 2,
                        py: 0.5
                      }}
                    >
                      Acheter
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
