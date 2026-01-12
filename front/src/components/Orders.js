import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  Divider, 
  Box, 
  Alert, 
  AlertTitle,
  Chip,
  Grid,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; 
import Header from './Header';
import Footer from './Footer';

// Thème de l'application pour la cohérence (similaire à Cart.js)
const appTheme = {
  primary: {
    main: '#7B3F00', // Marron foncé (thème principal librairie)
    light: '#A67C52',
    dark: '#4A2511',
  },
  secondary: {
    main: '#D81B60', // Rose vif (pour accents, actions)
    // Lighter and darker shades for secondary color if needed
    lighter: '#F48FB1', // Example: a lighter pink
    darker: '#C2185B',  // Example: a darker pink
  },
  accent: {
    main: '#D4AC0D', // Or (pour promotions, éléments spéciaux)
    dark: '#B8860B', // Or plus foncé
  },
  status: {
    delivered: { main: '#4CAF50', light: '#E8F5E9', dark: '#388E3C', contrastText: '#ffffff' }, // Vert
    shipped: { main: '#2196F3', light: '#E3F2FD', dark: '#1976D2', contrastText: '#ffffff' },   // Bleu
    pending: { main: '#FFC107', light: '#FFF8E1', dark: '#FFA000', contrastText: '#000000' },   // Ambre
    cancelled: { main: '#F44336', light: '#FFEBEE', dark: '#D32F2F', contrastText: '#ffffff' }, // Rouge
    default: { main: '#9E9E9E', light: '#F5F5F5', dark: '#616161', contrastText: '#000000' }    // Gris
  },
  background: {
    paper: '#ffffff',
    default: '#f5f7fa', // Gris clair pour fond général
    accordionDetails: '#fdfdfd', // Fond légèrement différent pour les détails de l'accordéon
  }
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const randomTime = (date) => {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    return new Date(date).setHours(hours, minutes);
  };
  
  const generateDemoOrders = () => {
    const today = new Date();
    return [
      {
        id: 1001,
        montant_total: 29.99,
        created_at: new Date(randomTime(today)).toISOString(),
        updated_at: new Date(randomTime(today)).toISOString(),
        status: 'en cours',
        ligne_ventes: [
          { 
            id: 1, 
            vente_id: 1001,
            ouvrage_id: 101, 
            utilisateur_id: 1,
            quantite: 1, 
            prix_unitaire: 29.99,
            ouvrage: {
              titre: 'Pâtisserie Gourmande Élite',
              auteur: 'Chef Marie Durand',
              editeur: 'Éditions Culinaires Prestige',
              prix: 29.99,
              image: 'https://source.unsplash.com/featured/?pastry,book,gourmet'
            }
          }
        ]
      },
      {
        id: 1002,
        montant_total: 44.98,
        created_at: new Date(randomTime(new Date(today).setDate(today.getDate() - 7))).toISOString(),
        updated_at: new Date(randomTime(new Date(today).setDate(today.getDate() - 7))).toISOString(),
        status: 'expédié',
        ligne_ventes: [
          { 
            id: 2, 
            vente_id: 1002,
            ouvrage_id: 102, 
            utilisateur_id: 1,
            quantite: 1, 
            prix_unitaire: 24.99,
            ouvrage: {
              titre: 'Secrets de la Cuisine Végétale',
              auteur: 'Jean Laforêt Vert',
              editeur: 'Éditions Planète Saine',
              prix: 24.99,
              image: 'https://source.unsplash.com/featured/?vegetarian,cookbook,healthy'
            }
          },
          { 
            id: 3, 
            vente_id: 1002,
            ouvrage_id: 103, 
            utilisateur_id: 1,
            quantite: 1, 
            prix_unitaire: 19.99,
            ouvrage: {
              titre: 'Desserts Express et Délicieux',
              auteur: 'Sophie Martin Douceur',
              editeur: 'Éditions Instant Plaisir',
              prix: 19.99,
              image: 'https://source.unsplash.com/featured/?dessert,book,quick'
            }
          }
        ]
      },
      {
        id: 1003,
        montant_total: 34.99,
        created_at: new Date(randomTime(new Date(today).setDate(today.getDate() - 30))).toISOString(),
        updated_at: new Date(randomTime(new Date(today).setDate(today.getDate() - 30))).toISOString(),
        status: 'livré',
        ligne_ventes: [
          { 
            id: 4, 
            vente_id: 1003,
            ouvrage_id: 104, 
            utilisateur_id: 1,
            quantite: 1, 
            prix_unitaire: 34.99,
            ouvrage: {
              titre: 'Grand Atlas des Recettes du Monde',
              auteur: 'Chef Michel Blanc International',
              editeur: 'Éditions Horizons Culinaires',
              prix: 34.99,
              image: 'https://source.unsplash.com/featured/?world,recipe,book,atlas'
            }
          }
        ]
      }
    ];
  };
  
  useEffect(() => {
    const fetchOrdersData = async () => {
      setLoading(true);
      try {
        const demoData = generateDemoOrders();
        setOrders(demoData);
        setError(null);
      } catch (err) {
        console.error("Erreur lors de la récupération des commandes:", err);
        setError("Impossible de charger l'historique des commandes. Veuillez réessayer plus tard.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersData();
  }, []);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'en cours': return <HourglassEmptyIcon />;
      case 'expédié': return <LocalShippingIcon />;
      case 'livré': return <CheckCircleIcon />;
      case 'annulé': return <CancelIcon />;
      default: return <ReceiptLongIcon />;
    }
  };

  const getStatusChipProps = (status) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'livré':
        return { label: 'Livré', colorName: 'delivered', icon: <CheckCircleIcon /> };
      case 'expédié':
        return { label: 'Expédié', colorName: 'shipped', icon: <LocalShippingIcon /> };
      case 'en attente':
      case 'en cours de traitement':
        return { label: 'En attente', colorName: 'pending', icon: <HourglassEmptyIcon /> };
      case 'annulé':
        return { label: 'Annulé', colorName: 'cancelled', icon: <CancelIcon /> };
      default:
        return { label: status || 'Inconnu', colorName: 'default', icon: <ReceiptLongIcon /> };
    }
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString; // fallback to original string if parsing fails
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} sx={{ color: appTheme.primary.main }} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>Chargement de vos commandes...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 2, p: 2 }}>
          <AlertTitle sx={{ fontWeight: 'bold' }}>Erreur de chargement</AlertTitle>
          {error}
        </Alert>
      );
    }

    if (!orders || orders.length === 0) {
      return (
        <Box textAlign="center" py={5}>
          <ReceiptLongIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>Aucune commande pour le moment</Typography>
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 3 }}>
            Il semble que vous n'ayez pas encore effectué d'achats. Parcourez nos collections !
          </Typography>
          <Button 
            variant="contained" 
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

    return (
      <Grid container spacing={3.5}>
        {orders.map((order) => {
          const statusProps = getStatusChipProps(order.status);
          const statusColorSet = appTheme.status[statusProps.colorName] || appTheme.status.default;
          return (
            <Grid item xs={12} key={order.id}>
              <Card sx={{ borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.07)' }}>
                <CardHeader
                  avatar={
                    <Box sx={{ 
                      backgroundColor: statusColorSet.light, 
                      p: 1.2, 
                      borderRadius: '50%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {getStatusIcon(order.status)} {/* L'icône prendra la couleur de son parent ou une couleur définie dans getStatusIcon */}
                    </Box>
                  }
                  title={`Commande N° ${order.id}`}
                  titleTypographyProps={{ variant: 'h6', fontWeight: 'bold', color: appTheme.primary.dark }}
                  subheader={`Passée le: ${formatDate(order.created_at)}`}
                  subheaderTypographyProps={{ variant: 'body2', color: 'text.secondary' }}
                  action={
                    <Chip 
                      label={statusProps.label}
                      size="medium"
                      sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: statusColorSet.main,
                        color: statusColorSet.contrastText,
                        // border: `1px solid ${statusColorSet.dark}` // Optionnel, peut surcharger
                      }}
                    />
                  }
                  sx={{ pb: 1.5, pt:2, px:2.5, borderBottom: `1px solid ${appTheme.background.default}`}}
                />
                <CardContent sx={{ pt: 2, px: 2.5, pb: '20px !important' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2.5}>
                    <Typography variant="body1" color="text.secondary">
                      {order.ligne_ventes?.length || 0} article{(order.ligne_ventes?.length || 0) > 1 ? 's' : ''} commandé{(order.ligne_ventes?.length || 0) > 1 ? 's' : ''}
                    </Typography>
                    <Typography variant="h5" color={appTheme.primary.main} fontWeight="bold">
                      Total : {order.montant_total ? `${parseFloat(order.montant_total).toFixed(2)} €` : 'N/A'}
                    </Typography>
                  </Box>
                  
                  <Accordion defaultExpanded={false} sx={{ boxShadow: 'none', '&:before': { display: 'none' }, border: `1px solid ${appTheme.background.default}`, borderRadius: '8px', overflow: 'hidden'}}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel-${order.id}-content`}
                      id={`panel-${order.id}-header`}
                      sx={{ backgroundColor: appTheme.background.default, borderBottom: `1px solid #e0e0e0`, '&:hover': {backgroundColor: '#f0f0f0'} }}
                    >
                      <Typography fontWeight="medium" color={appTheme.primary.dark}>Détails des articles</Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: {xs: 1, sm: 2}, backgroundColor: appTheme.background.accordionDetails }}>
                      <Grid container spacing={2}>
                        {order.ligne_ventes?.map((ligne, idx) => (
                          <Grid item xs={12} key={ligne.id || idx}>
                            <Card sx={{ 
                              display: 'flex', 
                              borderRadius: '8px', 
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)', 
                              overflow: 'hidden',
                              border: `1px solid ${appTheme.background.default}`
                            }}>
                              <CardMedia
                                component="img"
                                sx={{ 
                                  width: { xs: 80, sm: 100 }, 
                                  height: 'auto',
                                  objectFit: 'cover', 
                                  p: 0.5,
                                  borderRadius: '6px 0 0 6px'
                                }}
                                image={ligne.ouvrage?.image || `https://source.unsplash.com/featured/?book,${ligne.ouvrage?.titre?.replace(/\s+/g, ',')}`}
                                alt={ligne.ouvrage?.titre || 'Livre'}
                              />
                              <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                                <CardContent sx={{ flex: '1 0 auto', p: { xs: 1.5, sm: 2}, pb: '12px !important' }}>
                                  <Typography component="div" variant="h6" fontWeight="bold" sx={{ mb: 0.5, lineHeight: 1.3, fontSize: {xs: '1rem', sm: '1.15rem'}, color: appTheme.primary.dark }}>
                                    {ligne.ouvrage?.titre || 'Titre non disponible'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: {xs: '0.8rem', sm: '0.875rem'} }}>
                                    Par {ligne.ouvrage?.auteur || 'Auteur inconnu'}
                                  </Typography>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mt:1}}>
                                    <Box>
                                      <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: '0.8rem', sm: '0.875rem'}}}>
                                        Quantité: <Typography component="span" fontWeight="medium">{ligne.quantite}</Typography>
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary" sx={{fontSize: {xs: '0.8rem', sm: '0.875rem'}}}>
                                        Prix unit.: <Typography component="span" fontWeight="medium">{ligne.prix_unitaire ? `${parseFloat(ligne.prix_unitaire).toFixed(2)} €` : 'N/A'}</Typography>
                                      </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="bold" color={appTheme.secondary.main} sx={{ ml:1, whiteSpace: 'nowrap', fontSize: {xs: '0.95rem', sm: '1.1rem'} }}>
                                      {(ligne.prix_unitaire * ligne.quantite).toFixed(2)} €
                                    </Typography>
                                  </Box>
                                </CardContent>
                              </Box>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: { xs: 10, md: 12 }, mb: 8 }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, backgroundColor: 'transparent' }}>
          <Box display="flex" alignItems="center" mb={3}>
            <ReceiptLongIcon sx={{ fontSize: { xs: 28, md: 32 }, mr: 1.5, color: appTheme.primary.main }} />
            <Typography variant="h4" component="h1" fontWeight="bold" sx={{ color: appTheme.primary.dark }}>Mes Commandes</Typography>
          </Box>
          <Divider sx={{ mb: 3, borderColor: appTheme.background.default }} />
          {renderContent()}
        </Paper>
      </Container>
      <Footer />
    </>
  );
}

export default Orders;
