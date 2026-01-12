import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import FastApiService from '../services/FastApiService';

// Material UI components
import { 
  AppBar, 
  Box, 
  Toolbar, 
  IconButton, 
  Typography, 
  Menu, 
  Container, 
  Avatar, 
  Button, 
  Tooltip, 
  MenuItem, 
  Divider,
  ListItemIcon,
  Badge
} from '@mui/material';

// Material UI icons
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import InventoryIcon from '@mui/icons-material/Inventory';
import BarChartIcon from '@mui/icons-material/BarChart';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SmartToyIcon from '@mui/icons-material/SmartToy';

function Navbar() {
  const { cart, loading } = useCart();
  const token = localStorage.getItem('token');
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // États pour les menus
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [backOfficeMenuAnchorEl, setBackOfficeMenuAnchorEl] = useState(null);
  
  // Gestion des menus
  const isMobileMenuOpen = Boolean(mobileMenuAnchorEl);
  const userMenuOpen = Boolean(userMenuAnchorEl);
  const open = Boolean(backOfficeMenuAnchorEl); // Pour compatibilité avec le code existant
  
  // Référence pour le collapse du menu (pour compatibilité avec Bootstrap)
  const navbarCollapseRef = useRef();
  
  // Récupération du rôle utilisateur depuis l'API FastAPI
  useEffect(() => {
    const getUserRole = async () => {
      if (token) {
        try {
          // Tenter de récupérer le rôle depuis le service API
          const role = await FastApiService.getUserRole();
          setUserRole(role || 'client');
        } catch (error) {
          console.error('Erreur lors de la récupération du rôle:', error);
          // Utiliser le rôle stocké localement comme fallback
          const localRole = localStorage.getItem('userRole') || 'client';
          setUserRole(localRole);
        }
      }
    };
    
    getUserRole();
  }, [token]);
  
  // Gestion des menus
  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchorEl(null);
  };
  
  const handleBackOfficeMenuOpen = (event) => {
    setBackOfficeMenuAnchorEl(event.currentTarget);
  };

  const handleBackOfficeMenuClose = () => {
    setBackOfficeMenuAnchorEl(null);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUserRole(null);
    handleUserMenuClose();
    navigate('/login');
  };
  
  // Fonction pour déterminer si un lien est actif
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // URL de base du back office Laravel et de l'API
  const backOfficeUrl = '/monprojet-copie/public';
  const apiBaseUrl = 'http://localhost:8000';
  
  return (
    <>
      <AppBar position="fixed" sx={{ background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
          {/* Logo pour desktop */}
          <MenuBookIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1, fontSize: '1.8rem' }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/ouvrages"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              letterSpacing: '.5px',
              color: 'white',
              textDecoration: 'none',
            }}
          >
            Livres Gourmands
          </Typography>

          {/* Menu mobile */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu principal"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={mobileMenuAnchorEl}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={isMobileMenuOpen}
              onClose={handleMobileMenuClose}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiPaper-root': { width: 250, mt: 1, borderRadius: 2 }
              }}
            >
              <MenuItem component={Link} to="/ouvrages" onClick={handleMobileMenuClose} selected={isActive('/ouvrages')}>
                <ListItemIcon>
                  <LibraryBooksIcon fontSize="small" color="primary" />
                </ListItemIcon>
                Catalogue
              </MenuItem>
              
              <MenuItem component={Link} to="/cart" onClick={handleMobileMenuClose} selected={isActive('/cart')}>
                <ListItemIcon>
                  <Badge badgeContent={!loading && cart && cart.ligne_ventes ? cart.ligne_ventes.length : 0} color="secondary" overlap="circular">
                    <ShoppingCartIcon fontSize="small" color="primary" />
                  </Badge>
                </ListItemIcon>
                Panier
              </MenuItem>
              
              {token && (
                <MenuItem component={Link} to="/chatbot" onClick={handleMobileMenuClose} selected={isActive('/chatbot')}>
                  <ListItemIcon>
                    <SmartToyIcon fontSize="small" color="primary" />
                  </ListItemIcon>
                  Assistant
                </MenuItem>
              )}
              
              {token ? (
                <>
                  <Divider />
                  <MenuItem component={Link} to="/profile" onClick={handleMobileMenuClose}>
                    <ListItemIcon>
                      <PersonIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Mon profil
                  </MenuItem>
                  
                  <MenuItem component={Link} to="/orders" onClick={handleMobileMenuClose}>
                    <ListItemIcon>
                      <ReceiptLongIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Mes commandes
                  </MenuItem>
                  
                  {(userRole === 'admin' || userRole === 'gestionnaire' || userRole === 'editeur') && (
                    <MenuItem onClick={(e) => {
                      handleMobileMenuClose();
                      handleBackOfficeMenuOpen(e);
                    }}>
                      <ListItemIcon>
                        <DashboardIcon fontSize="small" color="primary" />
                      </ListItemIcon>
                      Back Office
                    </MenuItem>
                  )}
                  
                  <Divider />
                  
                  <MenuItem onClick={() => {
                    handleMobileMenuClose();
                    logout();
                  }}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <Typography color="error">Déconnexion</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <Divider />
                  <MenuItem component={Link} to="/login" onClick={handleMobileMenuClose}>
                    <ListItemIcon>
                      <LoginIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    Connexion
                  </MenuItem>
                  
                  <MenuItem component={Link} to="/register" onClick={handleMobileMenuClose}>
                    <ListItemIcon>
                      <AppRegistrationIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    S'inscrire
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Logo pour mobile */}
          <MenuBookIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/ouvrages"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: '"Poppins", sans-serif',
              fontWeight: 700,
              letterSpacing: '.3px',
              color: 'white',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}
          >
            Livres Gourmands
          </Typography>

          {/* Navigation desktop */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            <Button
              component={Link}
              to="/ouvrages"
              onClick={handleMobileMenuClose}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                ...(isActive('/ouvrages') && { 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  fontWeight: 'bold'
                })
              }}
              startIcon={<LibraryBooksIcon />}
            >
              Catalogue
            </Button>
            
            <Button
              component={Link}
              to="/cart"
              onClick={handleMobileMenuClose}
              sx={{ 
                my: 2, 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                ...(isActive('/cart') && { 
                  backgroundColor: 'rgba(255,255,255,0.1)', 
                  fontWeight: 'bold'
                })
              }}
              startIcon={
                <Badge badgeContent={!loading && cart && cart.ligne_ventes ? cart.ligne_ventes.length : 0} color="secondary" overlap="circular">
                  <ShoppingCartIcon />
                </Badge>
              }
            >
              Panier
            </Button>
            
            {token && (
              <Button
                component={Link}
                to="/chatbot"
                onClick={handleMobileMenuClose}
                sx={{ 
                  my: 2, 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                  ...(isActive('/chatbot') && { 
                    backgroundColor: 'rgba(255,255,255,0.1)', 
                    fontWeight: 'bold'
                  })
                }}
                startIcon={<SmartToyIcon />}
              >
                Assistant
              </Button>
            )}
          </Box>

          {/* Boutons de droite */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            {token ? (
              <>
                {/* Menu back office */}
                {(userRole === 'admin' || userRole === 'gestionnaire' || userRole === 'editeur') && (
                  <Tooltip title="Back Office">
                    <Button
                      color="inherit"
                      onClick={handleBackOfficeMenuOpen}
                      startIcon={<DashboardIcon />}
                      sx={{ 
                        mr: 1,
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }}
                    >
                      Admin
                    </Button>
                  </Tooltip>
                )}
                
                {/* Menu utilisateur */}
                <Tooltip title="Mon compte">
                  <IconButton onClick={handleUserMenuOpen} sx={{ p: 0, ml: 1 }}>
                    <Avatar sx={{ bgcolor: '#e91e63', width: 36, height: 36 }}>
                      <PersonIcon />
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  sx={{ 
                    color: 'white', 
                    borderColor: 'rgba(255,255,255,0.5)',
                    mr: 1,
                    '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' }
                  }}
                  startIcon={<LoginIcon />}
                >
                  Connexion
                </Button>
                
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: '#e0e0e0' }
                  }}
                  startIcon={<AppRegistrationIcon />}
                >
                  S'inscrire
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      
    {/* Menu Back Office */}
    <Menu
      id="back-office-menu"
      anchorEl={backOfficeMenuAnchorEl}
      open={open}
      onClose={handleBackOfficeMenuClose}
      onClick={handleBackOfficeMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          mt: 1.5,
          borderRadius: 2,
          width: 220,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            margin: '2px 5px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 255, 0.08)',
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem component="a" href={`${backOfficeUrl}/dashboard`}>
        <ListItemIcon>
          <DashboardIcon fontSize="small" color="primary" />
        </ListItemIcon>
        Tableau de bord
      </MenuItem>
      
      {/* Options pour l'éditeur */}
      {userRole === 'editeur' && (
        <>
          <MenuItem component="a" href={`${backOfficeUrl}/categories`}>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Gérer les catégories
          </MenuItem>
          <MenuItem component="a" href={`${backOfficeUrl}/comments`}>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Valider les commentaires
          </MenuItem>
        </>
      )}
      
      {/* Options pour le gestionnaire */}
      {userRole === 'gestionnaire' && (
        <>
          <MenuItem component="a" href={`${backOfficeUrl}/catalog`}>
            <ListItemIcon>
              <LibraryBooksIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Gérer le catalogue
          </MenuItem>
          <MenuItem component="a" href={`${backOfficeUrl}/inventory`}>
            <ListItemIcon>
              <InventoryIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Gérer le stock
          </MenuItem>
          <MenuItem component="a" href={`${backOfficeUrl}/sales`}>
            <ListItemIcon>
              <BarChartIcon fontSize="small" color="primary" />
            </ListItemIcon>
            Suivi des ventes
          </MenuItem>
        </>
      )}
      
      {/* Options pour l'administrateur */}
      {userRole === 'admin' && (
        <>
          <Divider sx={{ my: 1 }} />
          <MenuItem component="a" href={`${backOfficeUrl}/users`}>
            <ListItemIcon>
              <AdminPanelSettingsIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            Gérer les utilisateurs
          </MenuItem>
          <MenuItem component="a" href={`${backOfficeUrl}/settings`}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" color="secondary" />
            </ListItemIcon>
            Maintenance du site
          </MenuItem>
        </>
      )}
    </Menu>
    
    {/* Menu utilisateur */}
    <Menu
      id="user-menu"
      anchorEl={userMenuAnchorEl}
      open={userMenuOpen}
      onClose={handleUserMenuClose}
      onClick={handleUserMenuClose}
      PaperProps={{
        elevation: 3,
        sx: {
          overflow: 'visible',
          filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
          mt: 1.5,
          borderRadius: 2,
          width: 200,
          '& .MuiMenuItem-root': {
            px: 2,
            py: 1.5,
            borderRadius: 1,
            margin: '2px 5px',
            '&:hover': {
              backgroundColor: 'rgba(245, 0, 87, 0.08)',
            },
          },
        },
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      <MenuItem component={Link} to="/profile">
        <ListItemIcon>
          <PersonIcon fontSize="small" color="secondary" />
        </ListItemIcon>
        Mon profil
      </MenuItem>
      
      <MenuItem component={Link} to="/orders">
        <ListItemIcon>
          <ReceiptLongIcon fontSize="small" color="secondary" />
        </ListItemIcon>
        Mes commandes
      </MenuItem>
      
      <Divider sx={{ my: 1 }} />
      
      <MenuItem onClick={logout} sx={{ color: '#f44336' }}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" sx={{ color: '#f44336' }} />
        </ListItemIcon>
        Déconnexion
      </MenuItem>
    </Menu>
  </>
  );
}

export default Navbar;
