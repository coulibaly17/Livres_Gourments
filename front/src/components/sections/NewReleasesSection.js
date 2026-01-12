import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button,
  IconButton,
  Chip,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { appTheme } from '../../theme/appTheme';
import { useNavigate } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

const NewReleasesSection = ({ newReleases, handlePurchaseBook }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  if (!newReleases || newReleases.length === 0) {
    return null;
  }

  return (
    <Box 
      component="section" 
      sx={{ 
        py: { xs: 8, md: 10 },
        background: 'linear-gradient(to bottom, #FFF8E1, #FFFFFF)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Décoration d'arrière-plan */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${appTheme.accent.light}22 0%, ${appTheme.accent.main}11 100%)`,
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* En-tête de section */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: { xs: 4, md: 6 },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, mb: 1 }}>
              <NewReleasesIcon sx={{ color: appTheme.accent.main, mr: 1 }} />
              <Typography 
                variant="overline"
                sx={{ 
                  color: appTheme.accent.main,
                  fontWeight: 600,
                  letterSpacing: 1.5
                }}
              >
                FRAÎCHEMENT ARRIVÉS
              </Typography>
            </Box>
            
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 800,
                mb: { xs: 2, sm: 0 },
                background: `linear-gradient(45deg, ${appTheme.primary.main}, ${appTheme.accent.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Nos dernières nouveautés
            </Typography>
          </Box>

          <Button 
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/catalog')}
            sx={{
              borderColor: appTheme.primary.main,
              color: appTheme.primary.main,
              borderRadius: '50px',
              px: 3,
              py: 1,
              mt: { xs: 2, sm: 0 },
              '&:hover': {
                borderColor: appTheme.primary.dark,
                backgroundColor: 'rgba(123,63,0,0.05)',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Voir toutes les nouveautés
          </Button>
        </Box>

        {/* Grille des livres */}
        <Grid container spacing={3} justifyContent="center">
          {newReleases.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={4} key={book.id}>
              <Card 
                className="card-hover"
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  animation: 'fadeInUp 0.8s forwards',
                  opacity: 0
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.image || `https://source.unsplash.com/featured/?cooking,book&sig=${book.id}`}
                    alt={book.titre}
                    sx={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease',
                      '&:hover': {
                        transform: 'scale(1.05)'
                      }
                    }}
                  />
                  <Chip 
                    label="Nouveau"
                    size="small"
                    icon={<LocalShippingIcon fontSize="small" />}
                    sx={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      bgcolor: appTheme.accent.main,
                      color: '#fff',
                      fontWeight: 600
                    }}
                  />
                </Box>

                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography 
                    gutterBottom 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      fontWeight: 700, 
                      mb: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      color: appTheme.primary.dark
                    }}
                  >
                    {book.titre}
                  </Typography>

                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ 
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {book.description || "Un ouvrage fascinant qui vous transportera dans le monde de la gastronomie."}
                  </Typography>

                  <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                      {book.auteur}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                  <Button 
                    size="small" 
                    variant="contained"
                    onClick={() => handlePurchaseBook(book)}
                    sx={{
                      bgcolor: appTheme.primary.main,
                      color: '#fff',
                      '&:hover': {
                        bgcolor: appTheme.primary.dark,
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 12px rgba(123,63,0,0.2)'
                      }
                    }}
                  >
                    Acheter
                  </Button>
                  
                  <IconButton 
                    size="small" 
                    onClick={() => navigate(`/book/${book.id}`)}
                    sx={{
                      color: appTheme.primary.main,
                      '&:hover': {
                        bgcolor: 'rgba(123,63,0,0.08)'
                      }
                    }}
                  >
                    <ArrowForwardIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default NewReleasesSection;
