import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { appTheme } from '../../theme/appTheme';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SearchIcon from '@mui/icons-material/Search';

const HeroSection = ({ onExploreClick }) => {
  return (
    <Box 
      sx={{ 
        position: 'relative',
        background: `linear-gradient(135deg, ${appTheme.primary.main} 0%, ${appTheme.primary.dark} 100%)`,
        color: 'white',
        pt: { xs: 10, md: 15 },
        pb: { xs: 12, md: 18 },
        overflow: 'hidden'
      }}
    >
      {/* Overlay décoratif */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(/img/pattern-books.png)',
        backgroundSize: 'cover',
        opacity: 0.1,
        zIndex: 0
      }} />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Box sx={{ animation: 'fadeInUp 0.8s forwards' }}>
              <Typography 
                variant="overline" 
                component="div" 
                sx={{ 
                  color: appTheme.accent.light, 
                  fontWeight: 600, 
                  mb: 1,
                  letterSpacing: 2,
                  animation: 'fadeInUp 0.8s forwards 0.2s',
                  opacity: 0
                }}
              >
                BIBLIOTHÈQUE GOURMANDE
              </Typography>

              <Typography 
                variant="h2" 
                component="h1"
                sx={{ 
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                  mb: 2,
                  background: `linear-gradient(90deg, white, ${appTheme.accent.light})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'fadeInUp 0.8s forwards 0.4s',
                  opacity: 0
                }}
              >
                Découvrez des saveurs littéraires exquises
              </Typography>

              <Typography 
                variant="h6"
                sx={{ 
                  fontWeight: 400,
                  mb: 4,
                  maxWidth: '600px',
                  lineHeight: 1.6,
                  color: 'rgba(255,255,255,0.85)',
                  animation: 'fadeInUp 0.8s forwards 0.6s',
                  opacity: 0
                }}
              >
                Plongez dans notre collection de livres gastronomiques, techniques culinaires et récits gourmands. Des pages qui éveillent tous vos sens.
              </Typography>

              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: 'wrap',
                animation: 'fadeInUp 0.8s forwards 0.8s',
                opacity: 0
              }}>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={onExploreClick}
                  startIcon={<MenuBookIcon />}
                  sx={{ 
                    borderRadius: '50px',
                    boxShadow: '0 4px 12px rgba(123,63,0,0.2)',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    background: `linear-gradient(45deg, ${appTheme.primary.dark} 0%, ${appTheme.primary.main} 100%)`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(123,63,0,0.25)',
                      background: `linear-gradient(45deg, ${appTheme.primary.main} 0%, ${appTheme.accent.main} 100%)`
                    }
                  }}
                >
                  Explorer le catalogue
                </Button>

                <Button 
                  variant="outlined" 
                  size="large"
                  startIcon={<SearchIcon />}
                  sx={{ 
                    borderColor: 'rgba(255,255,255,0.5)',
                    color: 'white',
                    borderRadius: '50px',
                    py: 1.5,
                    px: 4,
                    fontSize: '1rem',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: 'white',
                      bgcolor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Rechercher
                </Button>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={5} sx={{ display: { xs: 'none', md: 'block' } }}>
            <Box
              sx={{
                animation: 'fadeInRight 1s forwards 0.5s',
                opacity: 0
              }}
            >
              <Paper 
                elevation={16} 
                sx={{ 
                  borderRadius: 4, 
                  overflow: 'hidden',
                  transform: 'rotate(2deg)',
                  boxShadow: `0 20px 80px rgba(0,0,0,0.3)`,
                  position: 'relative'
                }}
              >
                <img 
                  src="/img/featured-books.jpg" 
                  alt="Livres de cuisine" 
                  style={{ 
                    width: '100%', 
                    height: 'auto', 
                    display: 'block',
                    objectFit: 'cover'
                  }} 
                />
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroSection;
