import React, { useEffect, useState } from 'react';
import { Box, Container, Grid, Paper, Typography, CircularProgress, Card, CardContent, CardHeader, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';
import PeopleIcon from '@mui/icons-material/People';
import { AdminService } from '../../services/ApiService';

// Style personnalisé pour les cartes avec animation au survol - effet 3D subtil
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
  overflow: 'hidden',
  position: 'relative',
  borderRadius: 16,
  perspective: '1500px',
  transformStyle: 'preserve-3d',
  '&:hover': {
    transform: 'translateY(-8px) rotateX(3deg) rotateY(3deg)',
    boxShadow: '0 16px 40px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
    '& .card-gradient': {
      opacity: 0.8,
    },
    '& .card-icon': {
      transform: 'scale(1.1) translateY(-5px) translateZ(20px)',
    },
    '& .card-band': {
      height: '110%',
    }
  },
}));

// Style pour l'icône animée avec effet 3D
const IconWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 16,
  right: 16,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
  zIndex: 1,
  transformStyle: 'preserve-3d',
  transform: 'translateZ(10px)',
}));

// Composant pour le gradient de couleur
const CardGradient = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: `linear-gradient(135deg, ${color}20 0%, ${color}50 100%)`,
  opacity: 0.5,
  transition: 'opacity 0.4s ease',
  zIndex: 0,
}));

// Bandes colorées sur le côté (comme dans le design des livres)
const ColorBand = styled(Box)(({ theme, colors }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: 8,
  height: '100%',
  transition: 'height 0.4s ease',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
}));

// Fonction pour générer des couleurs aléatoires pour les bandes
const generateBandColors = () => {
  const colors = [
    '#f44336', // rouge
    '#2196f3', // bleu
    '#4caf50', // vert
    '#ffeb3b', // jaune
    '#9c27b0', // violet
    '#00bcd4', // cyan
    '#ff9800', // orange
    '#e91e63', // rose
    '#3f51b5'  // indigo
  ];
  
  // Créer une combinaison aléatoire de 4-7 couleurs
  return colors.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 4);
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userRole = localStorage.getItem('userRole') || 'client';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await AdminService.getDashboardStats();
        setStats(data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
        setError('Impossible de charger les statistiques du tableau de bord');
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" color="error">{error}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.reload()}>
            Réessayer
          </Button>
        </Paper>
      </Container>
    );
  }
  
  // Statistiques fictives pour démonstration (à remplacer par les données réelles de stats)
  const mockStats = {
    books: { count: 152, recent: 8 },
    inventory: { lowStock: 12, outOfStock: 3 },
    sales: { today: 1250, week: 8520 },
    comments: { pending: 7, approved: 124 },
    users: { count: 87, newToday: 5 }
  };
  
  const dashboardData = stats || mockStats;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h3" fontWeight="800" color="primary.dark" gutterBottom sx={{ position: 'relative', display: 'inline-block' }}>
          Tableau de bord
          <Box sx={{ position: 'absolute', height: 4, width: '40%', bottom: -8, left: 0, bgcolor: 'secondary.main', borderRadius: 2 }} />
        </Typography>
        <Typography variant="h6" fontWeight="400" color="text.secondary" sx={{ mt: 2 }}>
          Bienvenue dans votre espace d'administration. Vous êtes connecté en tant que <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>{userRole}</Box>.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        {/* Cartes de statistiques - affichées selon le rôle */}
        
        {/* Carte Catalogue - visible pour éditeur et gestionnaire */}
        {(userRole === 'editeur' || userRole === 'gestionnaire' || userRole === 'admin') && (
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardGradient color="#3f51b5" className="card-gradient" />
              <ColorBand className="card-band">
                {generateBandColors().map((color, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      width: '100%', 
                      height: `${100 / generateBandColors().length}%`, 
                      bgcolor: color,
                      '&:hover': { transform: 'scaleX(1.2)' },
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ))}
              </ColorBand>
              <IconWrapper className="card-icon">
                <LibraryBooksIcon sx={{ fontSize: 40, color: '#3f51b5' }} />
              </IconWrapper>
              <CardHeader title="Catalogue" sx={{ zIndex: 1, ml: 2, pb: 0 }} />
              <CardContent sx={{ zIndex: 1, mt: 'auto', ml: 2 }}>
                <Typography variant="h3" fontWeight="bold">{dashboardData.books.count}</Typography>
                <Typography variant="body2">Ouvrages disponibles</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                  +{dashboardData.books.recent} nouveaux cette semaine
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}
        
        {/* Carte Stock - visible pour gestionnaire */}
        {(userRole === 'gestionnaire' || userRole === 'admin') && (
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardGradient color="#f50057" className="card-gradient" />
              <ColorBand className="card-band">
                {generateBandColors().map((color, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      width: '100%', 
                      height: `${100 / generateBandColors().length}%`, 
                      bgcolor: color,
                      '&:hover': { transform: 'scaleX(1.2)' },
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ))}
              </ColorBand>
              <IconWrapper className="card-icon">
                <InventoryIcon sx={{ fontSize: 40, color: '#f50057' }} />
              </IconWrapper>
              <CardHeader title="Stock" sx={{ zIndex: 1, ml: 2, pb: 0 }} />
              <CardContent sx={{ zIndex: 1, mt: 'auto', ml: 2 }}>
                <Typography variant="h5" fontWeight="bold" color="error">
                  {dashboardData.inventory.lowStock} produits en stock faible
                </Typography>
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                  {dashboardData.inventory.outOfStock} produits en rupture
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}
        
        {/* Carte Ventes - visible pour gestionnaire */}
        {(userRole === 'gestionnaire' || userRole === 'admin') && (
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardGradient color="#4caf50" className="card-gradient" />
              <ColorBand className="card-band">
                {generateBandColors().map((color, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      width: '100%', 
                      height: `${100 / generateBandColors().length}%`, 
                      bgcolor: color,
                      '&:hover': { transform: 'scaleX(1.2)' },
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ))}
              </ColorBand>
              <IconWrapper className="card-icon">
                <BarChartIcon sx={{ fontSize: 40, color: '#4caf50' }} />
              </IconWrapper>
              <CardHeader title="Ventes" sx={{ zIndex: 1, ml: 2, pb: 0 }} />
              <CardContent sx={{ zIndex: 1, mt: 'auto', ml: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData.sales.today} € aujourd'hui
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                  {dashboardData.sales.week} € cette semaine
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}
        
        {/* Carte Commentaires - visible pour éditeur */}
        {(userRole === 'editeur' || userRole === 'admin') && (
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardGradient color="#ff9800" className="card-gradient" />
              <ColorBand className="card-band">
                {generateBandColors().map((color, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      width: '100%', 
                      height: `${100 / generateBandColors().length}%`, 
                      bgcolor: color,
                      '&:hover': { transform: 'scaleX(1.2)' },
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ))}
              </ColorBand>
              <IconWrapper className="card-icon">
                <CommentIcon sx={{ fontSize: 40, color: '#ff9800' }} />
              </IconWrapper>
              <CardHeader title="Commentaires" sx={{ zIndex: 1, ml: 2, pb: 0 }} />
              <CardContent sx={{ zIndex: 1, mt: 'auto', ml: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData.comments.pending} en attente
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {dashboardData.comments.approved} approuvés au total
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}
        
        {/* Carte Utilisateurs - visible pour admin */}
        {userRole === 'admin' && (
          <Grid item xs={12} sm={6} md={4}>
            <StyledCard>
              <CardGradient color="#9c27b0" className="card-gradient" />
              <ColorBand className="card-band">
                {generateBandColors().map((color, idx) => (
                  <Box 
                    key={idx} 
                    sx={{ 
                      width: '100%', 
                      height: `${100 / generateBandColors().length}%`, 
                      bgcolor: color,
                      '&:hover': { transform: 'scaleX(1.2)' },
                      transition: 'transform 0.3s ease'
                    }} 
                  />
                ))}
              </ColorBand>
              <IconWrapper className="card-icon">
                <PeopleIcon sx={{ fontSize: 40, color: '#9c27b0' }} />
              </IconWrapper>
              <CardHeader title="Utilisateurs" sx={{ zIndex: 1, ml: 2, pb: 0 }} />
              <CardContent sx={{ zIndex: 1, mt: 'auto', ml: 2 }}>
                <Typography variant="h5" fontWeight="bold">
                  {dashboardData.users.count} utilisateurs
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'success.main' }}>
                  +{dashboardData.users.newToday} nouveaux aujourd'hui
                </Typography>
              </CardContent>
            </StyledCard>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default Dashboard;
