import React, { useState, useEffect } from 'react';
import { 
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Alert,
  AlertTitle,
  CircularProgress,
  Card,
  CardContent,
  CardHeader,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  InputAdornment,
  FormHelperText,
  Tooltip,
  Fade,
  Zoom,
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HomeIcon from '@mui/icons-material/Home';
import SecurityIcon from '@mui/icons-material/Security';
import LogoutIcon from '@mui/icons-material/Logout';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EventIcon from '@mui/icons-material/Event';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import StorefrontIcon from '@mui/icons-material/Storefront';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code';
import SendIcon from '@mui/icons-material/Send';
import Header from './Header';
import Footer from './Footer';
import FastApiService, { AuthService, OrdersService } from '../services/FastApiService';

// Composant Avatar stylisé pour le profil
const ProfileAvatar = styled(Avatar)(() => ({
  width: 96, // 12 * 8px
  height: 96, // 12 * 8px
  marginBottom: 16, // 2 * 8px
  fontSize: '2.5rem',
  backgroundColor: '#8B4513', // Couleur caramel foncé au lieu de theme.palette.primary.main
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
}));

// Style pour les sections de profil
const ProfileSection = styled(Box)(() => ({
  marginBottom: 32, // 4 * 8px
  padding: 24, // 3 * 8px
  borderRadius: 8, // valeur standard pour borderRadius
  backgroundColor: '#ffffff', // au lieu de theme.palette.background.paper
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  position: 'relative'
}));

// Création d'un thème personnalisé avec notre couleur caramel foncé
const caramelTheme = createTheme({
  palette: {
    primary: {
      main: '#8B4513', // Caramel foncé
      light: '#A0522D',
      dark: '#704214',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#795548', // Marron complémentaire
      light: '#a98274',
      dark: '#4b2c20',
      contrastText: '#ffffff'
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff'
    },
    divider: '#e0e0e0',
    action: {
      active: '#8B4513',
      hover: 'rgba(139, 69, 19, 0.08)'
    }
  }
});

function Profile() {
  // États de base pour les données utilisateur
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  
  // États pour les modifications de profil
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // États pour l'interface
  const [tabValue, setTabValue] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  // États pour la gestion du mot de passe
  const [passwordEditMode, setPasswordEditMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  
  // États pour la vérification par code email
  const [resetPasswordMode, setResetPasswordMode] = useState(false); // Mode de réinitialisation par code
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationDialogOpen, setVerificationDialogOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [verificationError, setVerificationError] = useState('');
  
  // Gestion de la fermeture des notifications
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  // Récupérer les informations de l'utilisateur
  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        setError('Vous devez être connecté pour accéder à cette page');
        return;
      }

      try {
        setLoading(true);
        // Utilisation du service AuthService pour récupérer le profil
        const userData = await AuthService.getProfile();
        
        setUser(userData);
        setFormData({
          nom: userData.nom || '',
          prenom: userData.prenom || '',
          email: userData.email || '',
          adresse: userData.adresse || '',
          telephone: userData.telephone || ''
        });
      } catch (err) {
        console.error('Erreur lors du chargement du profil:', err);
        // Afficher plus de détails sur l'erreur
        const errorDetails = `Erreur: ${err.status || 'Inconnue'} - ${err.message || 'Pas de message'}`;
        console.log('Détails de l\'erreur:', errorDetails);
        setError(errorDetails);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Récupérer les commandes de l'utilisateur pour l'onglet Commandes
  const fetchUserOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setOrdersLoading(true);
      // Utilisation du service OrdersService pour récupérer les commandes
      const ordersData = await OrdersService.getAll();
      setOrders(ordersData);
    } catch (err) {
      console.error('Erreur lors du chargement des commandes:', err);
    } finally {
      setOrdersLoading(false);
    }
  };

  // Charger les commandes quand on change d'onglet pour l'onglet Commandes
  useEffect(() => {
    if (tabValue === 2) {
      fetchUserOrders();
    }
  }, [tabValue]);

  // Gérer le changement d'onglet
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Gérer les changements dans le formulaire de profil
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Gérer les changements dans le formulaire de mot de passe
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  // Valider les données du formulaire de profil
  const validateProfileData = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9\s+()-]{8,15}$/;
    
    if (!formData.nom || formData.nom.trim() === "") errors.nom = "Le nom est requis";
    if (!formData.prenom || formData.prenom.trim() === "") errors.prenom = "Le prénom est requis";
    
    if (!formData.email || !emailRegex.test(formData.email)) {
      errors.email = "Format d'email invalide";
    }
    
    if (formData.telephone && !phoneRegex.test(formData.telephone)) {
      errors.telephone = "Format de téléphone invalide";
    }
    
    return errors;
  };

  // Mettre à jour le profil
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    
    // Valider les données avant envoi
    const errors = validateProfileData();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      setUpdateSuccess(false); // Réinitialiser l'état de succès
      
      // Animation de chargement subtile pendant la mise à jour
      const updatedData = { ...formData };
      
      // Utiliser la méthode updateProfile de l'AuthService
      await AuthService.updateProfile(updatedData);
      
      // Mettre à jour le state local avec les nouvelles données
      setUser(prev => ({
        ...prev,
        ...updatedData
      }));
      
      setEditMode(false);
      setFormErrors({});
      setUpdateSuccess(true);
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' });
      setSnackbarOpen(true);
      
      // Masquer l'animation de succès après 3 secondes
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour du profil' });
      setSnackbarOpen(true);
    }
  };

  // Mettre à jour le mot de passe (méthode classique)
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setSnackbarOpen(true);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      // Utiliser la méthode updatePassword de l'AuthService
      await AuthService.updatePassword({
        current_password: passwordData.current_password,
        new_password: passwordData.new_password
      });

      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setPasswordEditMode(false);
      setMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès!' });
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du mot de passe:', err);
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la mise à jour du mot de passe' });
      setSnackbarOpen(true);
    }
  };

  // Demander un code de vérification par email
  const handleRequestVerificationCode = async () => {
    if (!user?.email) return;
    
    try {
      setVerificationError('');
      setVerificationEmail(user.email);
      
      // Envoyer une vraie demande de code de vérification
      const response = await AuthService.requestPasswordReset(user.email);
      console.log("Réponse de l'API:", response);
      
      // Afficher le message de confirmation
      setMessage({ 
        type: 'caramel', // Utilisation de notre nouvelle couleur caramel
        text: `Code envoyé: Un code de vérification à 5 chiffres a été envoyé à ${user.email}`
      });
      setSnackbarOpen(true);
      
      // Ouvrir le dialogue de vérification
      setCodeSent(true);
      setVerificationDialogOpen(true);
      
      // Démarrer le compte à rebours pour la réexpédition
      setResendCooldown(30); // 30 secondes avant de pouvoir demander un nouveau code
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Erreur lors de la demande du code:', err);
      setVerificationError(err.message || "Erreur lors de l'envoi du code");
      
      // Afficher un message d'erreur
      setMessage({ 
        type: 'error',
        text: "Erreur: Impossible d'envoyer le code de vérification. Veuillez réessayer."
      });
      setSnackbarOpen(true);
    }
  };

  // Vérifier le code et permettre la réinitialisation du mot de passe
  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 5) {
      setVerificationError('Le code doit être composé de 5 chiffres');
      return;
    }
    
    try {
      // Vérifier le code via l'API
      const response = await AuthService.verifyResetCode(verificationEmail, verificationCode);
      console.log("Réponse de vérification:", response);
      
      if (response.canResetPassword) {
        // Code correct
        setVerificationDialogOpen(false);
        setResetPasswordMode(true);
        setPasswordEditMode(true);
        setPasswordData({
          current_password: '', // Pas nécessaire dans ce mode
          new_password: '',
          confirm_password: ''
        });
        
        setMessage({ 
          type: 'caramel', // Utilisation de notre couleur caramel
          text: (
            <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.05rem' }}>
              <CheckCircleIcon style={{ marginRight: '12px', fontSize: '1.3rem' }} />
              <span>
                <strong>Vérification réussie!</strong> Vous pouvez maintenant définir votre nouveau mot de passe.
              </span>
            </div>
          )
        });
        setSnackbarOpen(true);
      }
    } catch (err) {
      console.error('Erreur lors de la vérification du code:', err);
      // Code incorrect ou erreur
      setVerificationError(err.message || 'Code incorrect. Veuillez réessayer.');
      
      // Afficher également un message d'erreur en bas de page
      setMessage({ 
        type: 'error', 
        text: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CancelIcon style={{ marginRight: '8px' }} />
            <span>
              <strong>Code incorrect:</strong> Le code saisi ne correspond pas au code envoyé. Veuillez vérifier et réessayer.
            </span>
          </div>
        )
      });
      setSnackbarOpen(true);
    }
  };

  // Réinitialiser le mot de passe après vérification du code
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setSnackbarOpen(true);
      return;
    }

    try {
      // Appeler l'API pour réinitialiser le mot de passe avec le code vérifié
      await AuthService.resetPassword(verificationEmail, verificationCode, passwordData.new_password);
      
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setResetPasswordMode(false);
      setPasswordEditMode(false);
      setVerificationCode('');
      setCodeSent(false);
      
      setMessage({ type: 'success', text: 'Mot de passe réinitialisé avec succès!' });
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', err);
      setMessage({ type: 'error', text: err.message || 'Erreur lors de la réinitialisation du mot de passe' });
      setSnackbarOpen(true);
    }
  };

  // La fonction handleSnackbarClose est déjà déclarée plus haut

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_role');
    window.location.href = '/';
  };

  // Format d'affichage des dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non disponible';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Contenu de l'onglet Profil
  const renderProfileTab = () => (
    <ProfileSection>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2" sx={{ 
          display: 'flex', 
          alignItems: 'center',
          fontWeight: 500,
          color: 'primary.main'
        }}>
          <PersonIcon sx={{ mr: 1 }} /> Informations personnelles
        </Typography>
        {!editMode ? (
          <Tooltip title="Modifier vos informations" arrow placement="top">
            <Button 
              startIcon={<EditIcon />} 
              variant="outlined" 
              color="primary"
              onClick={() => setEditMode(true)}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              Modifier
            </Button>
          </Tooltip>
        ) : (
          <Box>
            <Button 
              startIcon={<CancelIcon />} 
              variant="outlined" 
              color="error"
              onClick={() => {
                setEditMode(false);
                setFormData({
                  nom: user?.nom || '',
                  prenom: user?.prenom || '',
                  email: user?.email || '',
                  adresse: user?.adresse || '',
                  telephone: user?.telephone || ''
                });
                setFormErrors({});
              }}
              sx={{ mr: 1, borderRadius: '20px', textTransform: 'none' }}
            >
              Annuler
            </Button>
            <Button 
              startIcon={<SaveIcon />} 
              variant="contained" 
              color="primary"
              onClick={handleProfileUpdate}
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none',
                boxShadow: '0 4px 10px rgba(25, 118, 210, 0.3)'
              }}
            >
              Enregistrer
            </Button>
          </Box>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />
      
      {updateSuccess && (
        <Zoom in={updateSuccess}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
            <AlertTitle>Modifications enregistrées!</AlertTitle>
            Vos informations ont été mises à jour avec succès.
          </Alert>
        </Zoom>
      )}

      {editMode ? (
        <form onSubmit={handleProfileUpdate}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prénom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!formErrors.prenom}
                helperText={formErrors.prenom || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                variant="outlined"
                required
                error={!!formErrors.nom}
                helperText={formErrors.nom || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
                required
                disabled
                error={!!formErrors.email}
                helperText={formErrors.email || 'Votre adresse email ne peut pas être modifiée'}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Adresse"
                name="adresse"
                value={formData.adresse || ''}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                name="telephone"
                value={formData.telephone || ''}
                onChange={handleChange}
                variant="outlined"
                error={!!formErrors.telephone}
                helperText={formErrors.telephone || ''}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
              />
            </Grid>
          </Grid>
        </form>
      ) : (
        <Fade in={!editMode}>
          <Card variant="outlined" sx={{ 
            mb: 2, 
            borderRadius: '16px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            overflow: 'hidden' 
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'stretch'
            }}>
              {/* Colonne de gauche */}
              <Box sx={{
                flex: 1,
                p: 3,
                borderRight: { xs: 0, md: 1 },
                borderBottom: { xs: 1, md: 0 },
                borderColor: 'divider'
              }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500
                }}>
                  <PersonIcon sx={{ mr: 1 }} /> Informations personnelles
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 2,
                        backgroundColor: 'background.default',
                        borderRadius: '12px'
                      }}>
                        <Avatar sx={{ 
                          bgcolor: 'primary.main', 
                          mr: 2,
                          width: 48,
                          height: 48
                        }}>
                          {user?.prenom ? user.prenom.charAt(0).toUpperCase() : 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            {user?.prenom || ''} {user?.nom || ''}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {user?.role === 'admin' ? 'Administrateur' : 'Client'}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Adresse email
                      </Typography>
                      <Typography variant="body1" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500
                      }}>
                        <EmailIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                        {user?.email || 'Non renseigné'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
              
              {/* Colonne de droite */}
              <Box sx={{ flex: 1, p: 3 }}>
                <Typography variant="h6" color="primary" gutterBottom sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  fontWeight: 500
                }}>
                  <LocationOnIcon sx={{ mr: 1 }} /> Coordonnées
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Adresse postale
                      </Typography>
                      <Typography variant="body1" sx={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        fontWeight: 500
                      }}>
                        <LocationOnIcon sx={{ mr: 1, mt: 0.3, fontSize: 20, color: user?.adresse ? 'primary.main' : 'text.disabled' }} />
                        {user?.adresse || 'Non renseignée'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Téléphone
                      </Typography>
                      <Typography variant="body1" sx={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500
                      }}>
                        <PhoneIcon sx={{ mr: 1, fontSize: 20, color: user?.telephone ? 'primary.main' : 'text.disabled' }} />
                        {user?.telephone || 'Non renseigné'}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            </Box>
          </Card>
        </Fade>
      )}
    </ProfileSection>
  );

  // Contenu de l'onglet Sécurité
  const renderSecurityTab = () => (
    <ProfileSection>
      <div style={styles.headerContainer}>
        <h2 style={styles.header}>
          <SecurityIcon style={styles.icon} /> Sécurité du compte
        </h2>
        {!passwordEditMode ? (
          <div title="Modifier votre mot de passe" style={styles.buttonContainer}>
            <button onClick={handleRequestVerificationCode} style={styles.modifyButton}>
              <VpnKeyIcon style={styles.icon} />
              Changer le mot de passe
            </button>
          </div>
        ) : (
          <div style={styles.editButtonContainer}>
            <button onClick={handleCancelEdit} style={styles.cancelButton}>
              <CancelIcon style={styles.icon} />
              Annuler
            </button>
            <button onClick={resetPasswordMode ? handleResetPassword : handlePasswordUpdate} style={styles.saveButton}>
              <SaveIcon style={styles.icon} />
              Enregistrer
            </button>
          </div>
        )}
      </div>
  
      <div style={styles.divider} />
  
      {passwordEditMode ? (
        <form onSubmit={resetPasswordMode ? handleResetPassword : handlePasswordUpdate}>
          <div style={styles.formContainer}>
            <div style={styles.formHeader}>
              <LockIcon style={styles.icon} />
              <h6 style={styles.formTitle}>
                {resetPasswordMode ? "Créer un nouveau mot de passe" : "Changer votre mot de passe"}
              </h6>
            </div>
  
            {!resetPasswordMode && (
              <div style={styles.verificationInfo}>
                <div style={styles.verificationBold}>Mode de vérification activé</div>
                <div>Un code à 5 chiffres a été envoyé à votre adresse email. Ce code est nécessaire pour modifier votre mot de passe.</div>
              </div>
            )}
  
            <div style={styles.inputGrid}>
              {!resetPasswordMode && (
                <InputField
                  placeholder="Mot de passe actuel"
                  name="current_password"
                  type="password"
                  value={passwordData.current_password}
                  onChange={handlePasswordChange}
                  required
                />
              )}
              <InputField
                placeholder="Nouveau mot de passe"
                name="new_password"
                type="password"
                value={passwordData.new_password}
                onChange={handlePasswordChange}
                required
                helperText="Au moins 8 caractères avec lettres et chiffres"
              />
              <InputField
                placeholder="Confirmer le mot de passe"
                name="confirm_password"
                type="password"
                value={passwordData.confirm_password}
                onChange={handlePasswordChange}
                required
                error={passwordData.new_password !== passwordData.confirm_password && passwordData.confirm_password !== ''}
                errorMessage="Les mots de passe ne correspondent pas"
              />
            </div>
          </div>
        </form>
      ) : (
        <div style={styles.infoContainer}>
          <div style={styles.infoHeader}>
            <VerifiedUserIcon style={styles.icon} />
            <h6 style={styles.infoTitle}>Informations de sécurité</h6>
          </div>
  
          <div style={styles.securityInfo}>
            <div style={styles.securityBold}>Protection de votre compte</div>
            <div>Votre mot de passe doit être fort et unique. Ne le partagez jamais avec personne.</div>
          </div>
  
          <UserInfo label="Dernière connexion" value={user?.last_login ? formatDate(user.last_login) : 'Information non disponible'} />
          <UserInfo label="Activité récente" value={user?.last_activity ? formatDate(user.last_activity) : 'Information non disponible'} />
          
          <div style={styles.secureConnection}>
            <VerifiedUserIcon style={styles.icon} />
            <span>Connexion sécurisée</span>
          </div>
  
          <EmailVerification email={user?.email || 'Non disponible'} />
        </div>
      )}
  
      <div style={styles.divider} />
  
      <div style={styles.buttonGroup}>
        <button onClick={handleLogout} style={styles.logoutButton}>
          <LogoutIcon style={styles.icon} />
          Déconnexion
        </button>
        <div title="Obtenir un code de vérification par email" style={styles.buttonContainer}>
          <button onClick={handleRequestVerificationCode} style={styles.verificationButton}>
            <CodeIcon style={styles.icon} />
            Changer mot de passe avec code
          </button>
        </div>
      </div>
  
      {/* Dialogue de vérification par code avec design amélioré */}
      {verificationDialogOpen && (
        <VerificationDialog 
          verificationEmail={verificationEmail}
          verificationCode={verificationCode}
          setVerificationCode={setVerificationCode}
          handleVerifyCode={handleVerifyCode}
          handleRequestVerificationCode={handleRequestVerificationCode}
          verificationError={verificationError}
          setVerificationDialogOpen={setVerificationDialogOpen}
        />
      )}
    </ProfileSection>
  );
  
  // Styles définis séparément pour une meilleure organisation
  const styles = {
    headerContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      fontWeight: 500,
      color: '#8B4513',
      fontSize: '1.25rem',
      margin: 0,
    },
    icon: {
      marginRight: '8px',
      color: '#8B4513',
    },
    buttonContainer: {
      position: 'relative',
    },
    modifyButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '6px 16px',
      borderRadius: '20px',
      textTransform: 'none',
      border: '1px solid #8B4513',
      color: '#8B4513',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontSize: '0.875rem',
      fontFamily: 'inherit',
    },
    editButtonContainer: {
      display: 'flex',
    },
    cancelButton: {
      // définir les styles pour le bouton annuler
    },
    saveButton: {
      // définir les styles pour le bouton enregistrer
    },
    divider: {
      height: '1px',
      backgroundColor: '#e0e0e0',
      marginBottom: '24px',
    },
    formContainer: {
      marginBottom: '24px',
      borderRadius: '10px',
      backgroundColor: '#f9f9f9',
      border: '1px solid #e0e0e0',
      padding: '16px',
    },
    formHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '16px',
    },
    formTitle: {
      margin: 0,
      color: '#8B4513',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    verificationInfo: {
      backgroundColor: '#e1f5fe',
      color: '#0277bd',
      padding: '12px 16px',
      marginBottom: '16px',
      borderRadius: '8px',
      border: '1px solid #b3e5fc',
    },
    verificationBold: {
      fontWeight: 'bold',
      marginBottom: '4px',
    },
    inputGrid: {
      display: 'grid',
      gridGap: '24px',
    },
    infoContainer: {
      padding: '16px',
    },
    infoHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '24px',
    },
    infoTitle: {
      margin: 0,
      color: '#8B4513',
      fontSize: '1.25rem',
      fontWeight: 500,
    },
    securityInfo: {
      backgroundColor: '#e1f5fe',
      color: '#0277bd',
      padding: '12px 16px',
      marginBottom: '24px',
      borderRadius: '8px',
      border: '1px solid #b3e5fc',
    },
    secureConnection: {
      display: 'flex',
      alignItems: 'center',
      padding: '4px 10px',
      border: '1px solid #4caf50',
      borderRadius: '8px',
      color: '#4caf50',
      fontSize: '0.875rem',
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '24px',
    },
    logoutButton: {
      backgroundColor: 'transparent',
      color: '#d32f2f',
      border: '1px solid #d32f2f',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
    },
    verificationButton: {
      backgroundColor: 'transparent',
      color: '#8B4513',
      border: '1px solid #8B4513',
      padding: '8px 16px',
      borderRadius: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.875rem',
    },
  };
  
  // Définition des composants utilisés dans renderSecurityTab
  const InputField = ({ placeholder, name, type, value, onChange, required, helperText, error, errorMessage }) => (
    <div>
      <div style={{ 
        position: 'relative', 
        width: '100%',
        marginBottom: '8px'
      }}>
        <div style={{ 
          position: 'absolute', 
          left: '12px',
          top: '50%', 
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center'
        }}>
          {name === 'current_password' && <LockIcon style={{ color: '#757575' }} />}
          {name === 'new_password' && <VpnKeyIcon style={{ color: '#757575' }} />}
          {name === 'confirm_password' && <VerifiedUserIcon style={{ color: '#757575' }} />}
        </div>
        <input
          style={{
            width: '100%',
            padding: '12px 14px 12px 40px',
            fontSize: '1rem',
            borderRadius: '10px',
            border: error ? '1px solid #d32f2f' : '1px solid #c4c4c4',
            boxSizing: 'border-box'
          }}
          placeholder={placeholder}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
        />
      </div>
      {helperText && !error && (
        <div style={{ fontSize: '0.75rem', color: '#666', marginLeft: '8px', marginTop: '4px' }}>
          {helperText}
        </div>
      )}
      {error && errorMessage && (
        <div style={{ fontSize: '0.75rem', color: '#d32f2f', marginLeft: '8px', marginTop: '4px' }}>
          {errorMessage}
        </div>
      )}
    </div>
  );

  const UserInfo = ({ label, value, badge }) => (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '10px', 
      marginBottom: '16px',
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 500 }}>
          {value}
        </div>
      </div>
      {badge && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 10px',
          border: '1px solid #4caf50',
          borderRadius: '8px',
          color: '#4caf50',
          fontSize: '0.875rem'
        }}>
          <VerifiedUserIcon style={{ fontSize: '16px', marginRight: '4px' }} />
          <span>{badge}</span>
        </div>
      )}
    </div>
  );

  const EmailVerification = ({ email }) => (
    <div style={{ 
      backgroundColor: '#f5f5f5',
      padding: '16px',
      borderRadius: '10px', 
      marginBottom: '24px',
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <div>
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '4px' }}>
          Email de vérification
        </div>
        <div style={{ 
          fontSize: '1rem', 
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center'
        }}>
          <EmailIcon style={{ marginRight: '8px', fontSize: '18px', color: '#8B4513' }} />
          {email}
        </div>
      </div>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        padding: '4px 10px',
        border: '1px solid #4caf50',
        borderRadius: '8px',
        color: '#4caf50',
        fontSize: '0.875rem'
      }}>
        <VerifiedUserIcon style={{ fontSize: '16px', marginRight: '4px' }} />
        <span>Vérifié</span>
      </div>
    </div>
  );

  const VerificationDialog = ({ 
    verificationEmail, 
    verificationCode, 
    setVerificationCode, 
    handleVerifyCode, 
    handleRequestVerificationCode, 
    verificationError, 
    setVerificationDialogOpen,
    resendCooldown = 0,
    codeSent = true
  }) => (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1300
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '500px',
        backgroundColor: 'white',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        padding: '24px',
        position: 'relative'
      }}>
        <div 
          style={{
            position: 'absolute',
            right: '8px',
            top: '8px',
            zIndex: 1,
            cursor: 'pointer',
            display: 'flex'
          }} 
          onClick={() => setVerificationDialogOpen(false)}
        >
          <CloseIcon style={{ fontSize: '24px' }} />
        </div>
        
        <div style={{ 
          padding: '24px', 
          paddingBottom: '32px', 
          paddingTop: '48px', 
          position: 'relative', 
          zIndex: 1 
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            marginBottom: '24px'
          }}>
            <div style={{
              width: '80px', 
              height: '80px',
              backgroundColor: '#8B4513',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              marginBottom: '16px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LockIcon style={{ fontSize: '40px', color: 'white' }} />
            </div>
            
            <h5 style={{ 
              fontWeight: 'bold', 
              textAlign: 'center', 
              marginBottom: '8px',
              fontSize: '1.5rem'
            }}>
              Vérification par code
            </h5>
            
            <div style={{ 
              color: '#666', 
              textAlign: 'center', 
              maxWidth: '400px', 
              marginBottom: '16px',
              fontSize: '1rem'
            }}>
              Un code à 5 chiffres a été envoyé à <strong>{verificationEmail}</strong>. Veuillez entrer ce code pour continuer.
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center',
              padding: '8px 0'
            }}>
              <EmailIcon style={{ color: '#8B4513', marginRight: '8px' }} />
              <span style={{ 
                fontSize: '1.25rem', 
                color: '#8B4513', 
                fontWeight: 500 
              }}>
                {verificationEmail}
              </span>
            </div>
          </div>
          
          {/* Info Alert */}
          <div
            style={{
              backgroundColor: '#e3f2fd',
              borderRadius: '8px',
              padding: '8px 16px',
              marginBottom: '20px',
              border: '1px solid #90caf9',
            }}
          >
            <div style={{ color: '#0d47a1', fontWeight: 600, marginBottom: '4px', fontSize: '1rem' }}>
              Simulation
            </div>
            <div style={{ color: '#014361', fontSize: '0.875rem' }}>
              Pour cette démonstration, le code est toujours <strong>12345</strong>. Dans un environnement réel,
              un code unique serait envoyé par email.
            </div>
          </div>

          <div style={{ marginBottom: '16px', fontSize: '1rem' }}>
            Un code de vérification a été envoyé à <strong>{verificationEmail}</strong>
          </div>

          <div style={{ marginBottom: '8px', position: 'relative' }}>
            <input
              style={{
                width: '100%',
                padding: '12px 14px',
                fontSize: '1rem',
                borderRadius: '8px',
                border: verificationError ? '1px solid #d32f2f' : '1px solid #c4c4c4',
                boxSizing: 'border-box',
              }}
              placeholder="Entrez le code à 5 chiffres"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              maxLength={5}
            />
            {verificationError && (
              <div style={{ color: '#d32f2f', fontSize: '0.75rem', marginTop: '4px' }}>
                {verificationError}
              </div>
            )}
          </div>

          <div style={{ marginTop: '8px', color: '#666666', marginBottom: '16px', fontSize: '0.875rem' }}>
            Le code est valide pendant 30 minutes.
          </div>

          {/* Actions */}
          <div
            style={{
              padding: '16px 24px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              onClick={() => setVerificationDialogOpen(false)}
              style={{
                borderRadius: '20px',
                textTransform: 'none',
                color: '#666666',
                marginRight: '8px',
                padding: '8px 16px',
                background: 'none',
                border: '1px solid #dddddd',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Annuler
            </button>

            <button
              onClick={handleVerifyCode}
              disabled={!verificationCode || verificationCode.length !== 5}
              style={{
                borderRadius: '20px',
                textTransform: 'none',
                padding: '8px 16px',
                border: 'none',
                backgroundColor: !verificationCode || verificationCode.length !== 5 ? 'rgba(139, 69, 19, 0.3)' : '#8B4513',
                color: !verificationCode || verificationCode.length !== 5 ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
                boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)',
                marginRight: '8px',
                cursor: !verificationCode || verificationCode.length !== 5 ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Vérifier
            </button>

            {resendCooldown > 0 ? (
              <button
                disabled
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  padding: '8px 16px',
                  background: 'none',
                  border: '1px solid #dddddd',
                  color: '#aaaaaa',
                  cursor: 'not-allowed',
                  fontSize: '0.875rem',
                }}
              >
                Renvoyer ({resendCooldown}s)
              </button>
            ) : (
              <button
                onClick={handleRequestVerificationCode}
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  color: '#8B4513',
                  padding: '8px 16px',
                  background: 'none',
                  border: '1px solid #8B4513',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Renvoyer le code
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Définition d'une fonction handleCancelEdit manquante référencée dans le JSX
  const handleCancelEdit = () => {
    setPasswordEditMode(false);
    setResetPasswordMode(false);
    setPasswordData({
      current_password: '',
      new_password: '',
      confirm_password: ''
    });
  };

// Contenu de l'onglet Commandes
// Rendu de l'onglet Commandes avec design moderne et amélioré
const renderOrdersTab = () => {
  // Fonction pour obtenir la couleur et l'icône en fonction du statut
  const getStatusInfo = (status) => {
    switch(status?.toLowerCase()) {
      case 'en préparation':
        return { color: 'info', icon: <InventoryIcon />, bg: 'rgba(25, 118, 210, 0.1)' };
      case 'expédiée':
        return { color: 'primary', icon: <LocalShippingIcon />, bg: 'rgba(25, 118, 210, 0.1)' };
      case 'livrée':
        return { color: 'success', icon: <CheckCircleIcon />, bg: 'rgba(76, 175, 80, 0.1)' };
      case 'annulée':
        return { color: 'error', icon: <CancelIcon />, bg: 'rgba(211, 47, 47, 0.1)' };
      case 'en attente':
      default:
        return { color: 'warning', icon: <AccessTimeIcon />, bg: 'rgba(255, 167, 38, 0.1)' };
    }
  };
  
  return (
    <ProfileSection>
      {ordersLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress size={40} thickness={4} />
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 500 }}>
            Chargement de vos commandes...
          </Typography>
        </Box>
      ) : orders.length > 0 ? (
        <Box>
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3
          }}>
            <Typography variant="h5" fontWeight="500" sx={{ display: 'flex', alignItems: 'center' }}>
              <ReceiptLongIcon sx={{ mr: 1 }} />
              Historique des commandes
              <Chip 
                label={orders.length} 
                size="small" 
                color="primary" 
                sx={{ ml: 1, height: 20, minWidth: 20, fontSize: '0.75rem' }} 
              />
              </Typography>
              <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
                <InputLabel id="filter-orders-label">Filtrer par</InputLabel>
                <Select
                  labelId="filter-orders-label"
                  id="filter-orders"
                  label="Filtrer par"
                  defaultValue="all"
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="all">Toutes</MenuItem>
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="processing">En préparation</MenuItem>
                  <MenuItem value="shipped">Expédiées</MenuItem>
                  <MenuItem value="delivered">Livrées</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Divider sx={{ mb: 3 }} />
            
            {/* Liste des commandes avec design amélioré */}
            <Box sx={{ mb: 4 }}>
              {orders.map((order, index) => {
                const statusInfo = getStatusInfo(order.status);
                
                return (
                  <Zoom key={order.id} in={true} style={{ transitionDelay: `${index * 100}ms` }}>
                    <Card 
                      elevation={1} 
                      sx={{ 
                        mb: 2, 
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-3px)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      {/* Barre de statut en haut */}
                      <Box 
                        sx={{ 
                          bgcolor: statusInfo.bg,
                          color: `${statusInfo.color}.main`,
                          py: 0.75, 
                          px: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          {statusInfo.icon}
                          <Typography variant="subtitle2" fontWeight="500" sx={{ ml: 1 }}>
                            {order.status || 'En attente'}
                          </Typography>
                        </Box>
                        <Typography variant="caption" fontWeight="500">
                          Commande #{order.id}
                        </Typography>
                      </Box>
                      
                      <CardContent sx={{ p: 2 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={7}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <EventIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                Commandé le {formatDate(order.created_at) || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                              <LocalMallIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                              <Typography variant="body2" color="text.secondary">
                                {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                              </Typography>
                            </Box>
                            
                            {order.delivery_date && (
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <HomeIcon fontSize="small" sx={{ color: 'text.secondary', mr: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                  Livraison prévue le {new Date(order.delivery_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                                </Typography>
                              </Box>
                            )}
                          </Grid>
                          
                          <Grid item xs={12} sm={5}>
                            <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: { xs: 'flex-start', sm: 'flex-end' } 
                            }}>
                              <Typography variant="h6" component="div" color="primary" fontWeight="700" gutterBottom>
                                {typeof order.total === 'number' ? `${order.total.toFixed(2)} €` : 'Prix non disponible'}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Button 
                                  size="small" 
                                  variant="outlined"
                                  startIcon={<VisibilityIcon />}
                                  sx={{ 
                                    borderRadius: '20px',
                                    textTransform: 'none'
                                  }}
                                >
                                  Détails
                                </Button>
                                
                                <Button 
                                  size="small" 
                                  color="primary"
                                  startIcon={<ContentCopyIcon />}
                                  sx={{ 
                                    borderRadius: '20px',
                                    textTransform: 'none'
                                  }}
                                >
                                  Facture
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                        
                        {/* Barre de progression pour les commandes en cours */}
                        {['en attente', 'en préparation', 'expédiée'].includes(order.status?.toLowerCase()) && (
                          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                            <Box sx={{ 
                              display: 'flex', 
                              justifyContent: 'space-between',
                              mb: 1
                            }}>
                              <Typography variant="caption">
                                Commande
                              </Typography>
                              <Typography variant="caption">
                                Préparation
                              </Typography>
                              <Typography variant="caption">
                                En route
                              </Typography>
                              <Typography variant="caption">
                                Livrée
                              </Typography>
                            </Box>
                            <LinearProgress 
                              variant="determinate" 
                              value={
                                order.status?.toLowerCase() === 'en attente' ? 25 : 
                                order.status?.toLowerCase() === 'en préparation' ? 50 :
                                order.status?.toLowerCase() === 'expédiée' ? 75 : 100
                              } 
                              sx={{ 
                                height: 8, 
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.05)'
                              }} 
                            />
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  </Zoom>
                );
              })}
            </Box>
            
            {/* Pagination */}
            {orders.length > 5 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination 
                  count={Math.ceil(orders.length / 5)} 
                  shape="rounded" 
                  sx={{ 
                    '& .MuiPaginationItem-root.Mui-selected': {
                      bgcolor: '#8B4513',
                      color: '#ffffff'
                    }
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          <Fade in={true}>
            <div>
              <div style={{ textAlign: 'center', paddingTop: '64px', paddingBottom: '64px' }}>
                <div style={{ 
                  backgroundColor: '#f5f5f5', 
                  margin: '0 auto', 
                  width: '70px', 
                  height: '70px', 
                  borderRadius: '50%', 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <ShoppingCartIcon style={{ fontSize: '36px', color: '#757575' }} />
                </div>
                <h6 style={{ fontSize: '1.25rem', fontWeight: '500', marginBottom: '8px' }}>
                  Aucune commande trouvée
                </h6>
                <div style={{ color: '#666', maxWidth: '80%', margin: '0 auto', marginBottom: '24px' }}>
                  Vous n'avez pas encore passé de commande. Parcourez notre catalogue pour trouver des produits qui vous plaisent.
                </div>
                <Link 
                  to="/ouvrages"
                  style={{ 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '8px 24px',
                    backgroundColor: '#8B4513',
                    color: 'white',
                    borderRadius: '24px',
                    border: 'none',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  <StorefrontIcon style={{ marginRight: '8px', fontSize: '20px' }} />
                  Découvrir nos produits
                </Link>
              </div>
            </div>
          </Fade>
        )}
      </ProfileSection>
    );
  };


  if (loading) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
            <Typography variant="h6" sx={{ ml: 2 }}>Chargement du profil...</Typography>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <Container maxWidth="md" sx={{ mt: 12, mb: 8 }}>
          <Alert severity="error">
            <AlertTitle>Erreur</AlertTitle>
            {error}
          </Alert>
          <Box textAlign="center" mt={4}>
            <Button 
              variant="contained" 
              color="primary"
              component={Link}
              to="/login"
            >
              Se connecter
            </Button>
          </Box>
        </Container>
        <Footer />
      </>
    );
  }

  return (
    <ThemeProvider theme={caramelTheme}>
      <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 12, mb: 8, position: 'relative' }}>
        {/* Éléments décoratifs flottants */}
        <Box sx={{ 
          position: 'absolute',
          top: -70,
          right: -30,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,69,19,0.15) 0%, rgba(160,82,45,0.05) 70%, rgba(160,82,45,0) 100%)',
          animation: 'pulse 10s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }} />
        
        <Box sx={{ 
          position: 'absolute',
          bottom: -40,
          left: -20,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,82,45,0.18) 0%, rgba(139,69,19,0.08) 60%, rgba(160,82,45,0) 100%)',
          animation: 'float 15s infinite ease-in-out',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px) rotate(0deg)' },
            '50%': { transform: 'translateY(-15px) rotate(5deg)' },
            '100%': { transform: 'translateY(0px) rotate(0deg)' },
          },
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }} />
        
        <Box sx={{ 
          position: 'absolute',
          top: -50,
          right: -30,
          width: 180,
          height: 180,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(66,165,245,0.15) 0%, rgba(25,118,210,0.05) 70%, rgba(25,118,210,0) 100%)',
          animation: 'pulse 10s infinite ease-in-out',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.1)' },
            '100%': { transform: 'scale(1)' },
          },
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }} />
        
        <Box sx={{ 
          position: 'absolute',
          bottom: 50,
          left: -40,
          width: 140,
          height: 140,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,124,66,0.1) 0%, rgba(210,77,25,0.03) 70%, rgba(210,77,25,0) 100%)',
          animation: 'float 8s infinite ease-in-out',
          '@keyframes float': {
            '0%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-15px)' },
            '100%': { transform: 'translateY(0px)' },
          },
          zIndex: -1,
          display: { xs: 'none', md: 'block' }
        }} />
        
        <Zoom in={true} style={{ transitionDelay: '100ms' }}>
          <Paper 
            elevation={5} 
            sx={{ 
              p: 0, 
              borderRadius: 4, 
              overflow: 'hidden',
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            }}
          >
            {/* En-tête du profil avec design amélioré */}
            <Box sx={{ 
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', 
              color: 'white', 
              pt: 6,
              pb: 5, 
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Motif décoratif */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                opacity: 0.2,
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                zIndex: 0
              }} />
              
              <Box position="relative" zIndex={1}>
                <Fade in={true} timeout={1000}>
                  <Box>
                    <Avatar 
                      sx={{
                        width: 100,
                        height: 100,
                        bgcolor: 'white',
                        color: '#8B4513', // Couleur caramel foncé en remplacement de primary.main
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        margin: '0 auto',
                        marginBottom: 2,
                        border: '4px solid white',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
                      }}
                    >
                      {user?.prenom ? user.prenom.charAt(0).toUpperCase() : <PersonIcon fontSize="large" />}
                    </Avatar>
                    <Typography 
                      variant="h4" 
                      component="h1" 
                      gutterBottom 
                      sx={{ 
                        fontWeight: 700, 
                        textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                        letterSpacing: '0.5px'
                      }}
                    >
                      {user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : 'Utilisateur'}
                    </Typography>
                    
                    <Typography 
                      variant="subtitle1"
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        mb: 2
                      }}
                    >
                      <EmailIcon fontSize="small" sx={{ mr: 0.5, opacity: 0.8 }} />
                      {user?.email || ''}
                    </Typography>
                    
                    <Chip 
                      label={user?.role === 'admin' ? 'Administrateur' : 'Client Premium'} 
                      icon={user?.role === 'admin' ? <SecurityIcon /> : <VerifiedUserIcon />}
                      sx={{ 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        backdropFilter: 'blur(10px)',
                        fontWeight: 500,
                        px: 1,
                        color: '#ffffff',
                        '& .MuiChip-icon': {
                          color: '#ffffff'
                        }
                      }}
                    />
                  </Box>
                </Fade>
              </Box>
            </Box>
            
            {/* Onglets avec design amélioré */}
            <Box sx={{ 
              borderBottom: 1, 
              borderColor: '#e0e0e0', // Remplacement de 'divider'
              position: 'sticky',
              top: 0,
              bgcolor: '#ffffff', // Remplacement de 'background.paper'
              zIndex: 10,
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}>
              <Tabs 
                value={tabValue} 
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{
                  mb: 2,
                  '& .MuiTab-root': {
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    transition: 'all 0.3s',
                    '&:hover': {
                      color: '#8B4513', // Couleur caramel foncé au survol
                      opacity: 1,
                    },
                  },
                  '& .Mui-selected': {
                    color: '#8B4513 !important', // Onglet sélectionné en caramel foncé
                    fontWeight: 700,
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: '#8B4513', // Indicateur en caramel foncé
                    height: 3,
                    borderRadius: '2px'
                  },
                }}
              >
                <Tab 
                  icon={<PersonIcon />} 
                  label="Profil" 
                  sx={tabValue === 0 ? { fontWeight: 600 } : {}} 
                />
                <Tab 
                  icon={<SecurityIcon />} 
                  label="Sécurité" 
                  sx={tabValue === 1 ? { fontWeight: 600 } : {}} 
                />
                <Tab 
                  icon={<ReceiptLongIcon />} 
                  label="Commandes" 
                  sx={tabValue === 2 ? { fontWeight: 600 } : {}} 
                />
              </Tabs>
            </Box>
            
            {/* Contenu des onglets avec animation de transition */}
            <Box sx={{ p: { xs: 2, sm: 3 } }}>
              <Fade key={tabValue} in={true} timeout={500}>
                <Box>
                  {tabValue === 0 && renderProfileTab()}
                  {tabValue === 1 && renderSecurityTab()}
                  {tabValue === 2 && renderOrdersTab()}
                </Box>
              </Fade>
            </Box>
          </Paper>
        </Zoom>
      </Container>
      
      {/* Notification personnalisée sans composants MUI */}
      {snackbarOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: message.type === 'caramel' ? '#A0522D' : 
                            message.type === 'error' ? '#d32f2f' : 
                            message.type === 'success' ? '#2e7d32' : 
                            message.type === 'info' ? '#0288d1' : 
                            message.type === 'warning' ? '#ed6c02' : '#333333',
            color: '#ffffff',
            padding: '12px 16px',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px',
            maxWidth: '80%',
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ padding: '8px' }}>
            {message.text}
          </div>
          <button
            onClick={handleSnackbarClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              marginLeft: '8px',
              padding: '4px'
            }}
          >
            <CloseIcon style={{ fontSize: '20px' }} />
          </button>
        </div>
      )}
      
      {/* Dialogue de vérification */}
      {verificationDialogOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1300,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              width: '100%',
              maxWidth: '450px',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                backgroundColor: '#8B4513',
                color: '#ffffff',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <LockIcon style={{ marginRight: '12px' }} />
              <Typography
                variant="h6"
                style={{ fontWeight: 600, fontSize: '1.25rem' }}
              >
                Vérification par code
              </Typography>
            </div>

            {/* Content */}
            <div style={{ padding: '20px 24px 10px' }}>
              {/* Info Alert */}
              <div
                style={{
                  backgroundColor: '#e3f2fd',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  marginBottom: '20px',
                  border: '1px solid #90caf9',
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{ color: '#0d47a1', fontWeight: 600, marginBottom: '4px' }}
                >
                  Simulation
                </Typography>
                <Typography variant="body2" style={{ color: '#014361' }}>
                  Pour cette démonstration, le code est toujours <strong>12345</strong>. Dans un environnement réel,
                  un code unique serait envoyé par email.
                </Typography>
              </div>

              <Typography variant="body1" style={{ marginBottom: '16px' }}>
                Un code de vérification a été envoyé à <strong>{verificationEmail}</strong>
              </Typography>

              <TextField
                fullWidth
                label="Code de vérification"
                placeholder="Entrez le code à 5 chiffres"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                margin="normal"
                error={Boolean(verificationError)}
                helperText={verificationError}
                inputProps={{ maxLength: 5 }}
                sx={{
                  marginBottom: '8px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              <Typography
                variant="body2"
                style={{ marginTop: '8px', color: '#666666', marginBottom: '16px' }}
              >
                Le code est valide pendant 30 minutes.
              </Typography>
            </div>

            {/* Actions */}
            <div
              style={{
                padding: '16px 24px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Button
                onClick={() => setVerificationDialogOpen(false)}
                style={{
                  borderRadius: '20px',
                  textTransform: 'none',
                  color: '#666666',
                  marginRight: '8px',
                }}
              >
                Annuler
              </Button>

              <Button
                variant="contained"
                onClick={handleVerifyCode}
                disabled={!verificationCode || verificationCode.length !== 5}
                style={{
                  backgroundColor: !verificationCode || verificationCode.length !== 5 ? 'rgba(139, 69, 19, 0.3)' : '#8B4513',
                  color: !verificationCode || verificationCode.length !== 5 ? 'rgba(255, 255, 255, 0.7)' : '#ffffff',
                  borderRadius: '20px',
                  textTransform: 'none',
                  boxShadow: '0 4px 10px rgba(139, 69, 19, 0.3)',
                  marginRight: '8px',
                }}
              >
                Vérifier
              </Button>

              {resendCooldown > 0 ? (
                <Button
                  disabled
                  style={{
                    borderRadius: '20px',
                    textTransform: 'none',
                  }}
                >
                  Renvoyer ({resendCooldown}s)
                </Button>
              ) : (
                <Button
                  onClick={handleRequestVerificationCode}
                  style={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    color: '#8B4513',
                  }}
                >
                  Renvoyer le code
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <Footer />
      </>
    </ThemeProvider>
  );
}
export default Profile;
