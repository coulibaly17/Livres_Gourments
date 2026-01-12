import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';

// Icônes
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box 
      component="footer" 
      sx={{ 
        background: 'linear-gradient(135deg, #303f9f 0%, #3949ab 100%)',
        color: '#fff', 
        py: 8, 
        mt: 10,
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -4px 20px rgba(0,0,0,0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          {/* Coordonnées */}
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Box 
                sx={{ 
                  width: 48, 
                  height: 48, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}
              >
                <MenuBookIcon sx={{ color: '#fff', fontSize: 28 }} />
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ letterSpacing: 0.5 }}>
                Livres Gourmands
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LocationOnIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: '1.2rem' }} />
              <Typography color="rgba(255,255,255,0.7)" variant="body2">
                22 Rue de la Gastronomie, 75006 Paris
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmailIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: '1.2rem' }} />
              <Typography color="rgba(255,255,255,0.7)" variant="body2">
                contact@livresgourmands.fr
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PhoneIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: '1.2rem' }} />
              <Typography color="rgba(255,255,255,0.7)" variant="body2">
                +33 1 23 45 67 89
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccessTimeIcon sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: '1.2rem' }} />
              <Typography color="rgba(255,255,255,0.7)" variant="body2">
                Lun-Sam : 9h-19h
              </Typography>
            </Box>
            
            {/* Réseaux sociaux */}
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: '#4267B2', transform: 'translateY(-3px)' }
                }}>
                  <FacebookIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
                </Box>
              </Link>
              
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: '#1DA1F2', transform: 'translateY(-3px)' }
                }}>
                  <TwitterIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
                </Box>
              </Link>
              
              <Link href="#" target="_blank" rel="noopener noreferrer">
                <Box sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: '50%',
                  width: 36,
                  height: 36,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: '#E1306C', transform: 'translateY(-3px)' }
                }}>
                  <InstagramIcon sx={{ color: '#fff', fontSize: '1.2rem' }} />
                </Box>
              </Link>
            </Box>
          </Grid>
          
          {/* Liens rapides */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography 
              variant="subtitle1" 
              fontWeight={700} 
              mb={3} 
              sx={{ letterSpacing: 0.5, fontSize: '1.1rem' }}
            >
              Liens rapides
            </Typography>
            
            <Box component="ul" sx={{ listStyle: 'none', p: 0, m: 0 }}>
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/ouvrages" 
                  color="rgba(255,255,255,0.7)" 
                  underline="hover" 
                  sx={{ 
                    ':hover': { color: '#fff' }, 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <LibraryBooksIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                  Catalogue
                </Link>
              </li>
              
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/cart" 
                  color="rgba(255,255,255,0.7)" 
                  underline="hover" 
                  sx={{ 
                    ':hover': { color: '#fff' }, 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'all 0.2s ease' 
                  }}
                >
                  <ShoppingCartIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                  Panier
                </Link>
              </li>
              
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/orders" 
                  color="rgba(255,255,255,0.7)" 
                  underline="hover" 
                  sx={{ 
                    ':hover': { color: '#fff' }, 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'all 0.2s ease' 
                  }}
                >
                  <ReceiptLongIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                  Commandes
                </Link>
              </li>
              
              <li style={{ marginBottom: '12px' }}>
                <Link 
                  href="/chatbot" 
                  color="rgba(255,255,255,0.7)" 
                  underline="hover" 
                  sx={{ 
                    ':hover': { color: '#fff' }, 
                    display: 'flex', 
                    alignItems: 'center',
                    transition: 'all 0.2s ease' 
                  }}
                >
                  <SmartToyIcon sx={{ fontSize: '0.9rem', mr: 1 }} />
                  Assistant
                </Link>
              </li>
            </Box>
          </Grid>
          
          {/* Newsletter - seulement sur les écrans plus larges */}
          {!isMobile && (
            <Grid item xs={12} sm={6} md={4}>
              <Typography 
                variant="subtitle1" 
                fontWeight={700} 
                mb={3} 
                sx={{ letterSpacing: 0.5, fontSize: '1.1rem' }}
              >
                Notre newsletter
              </Typography>
              
              <Typography color="rgba(255,255,255,0.7)" variant="body2" mb={2}>
                Inscrivez-vous pour recevoir nos nouvelles recettes et promotions.
              </Typography>
              
              <Box 
                component="form" 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: 2,
                  width: '100%'
                }}
              >
                <input 
                  type="email" 
                  placeholder="Votre email" 
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 15px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '0.9rem'
                  }}
                />
                
                <button 
                  type="submit" 
                  style={{
                    backgroundColor: '#fff',
                    color: '#3f51b5',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '10px 15px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '0.9rem'
                  }}
                >
                  S'inscrire
                </button>
              </Box>
            </Grid>
          )}
        </Grid>
        
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)', my: 5 }} />
        
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap',
          flexDirection: isMobile ? 'column' : 'row',
          gap: isMobile ? 2 : 0
        }}>
          <Typography color="rgba(255,255,255,0.5)" variant="caption">
            &copy; {new Date().getFullYear()} Livres Gourmands. Tous droits réservés.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: isMobile ? 2 : 0, sm: 0 } }}>
            <Link href="#" color="rgba(255,255,255,0.5)" underline="hover" sx={{ ':hover': { color: '#fff' } }}>
              Conditions générales
            </Link>
            <Link href="#" color="rgba(255,255,255,0.5)" underline="hover" sx={{ ':hover': { color: '#fff' } }}>
              Politique de confidentialité
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
