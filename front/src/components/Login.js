import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography, Paper, Grid, Link } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import CircularProgress from '@mui/material/CircularProgress';
import FastApiService, { AuthService } from '../services/FastApiService';
import Header from './Header';
import Footer from './Footer';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Utilisation du service d'authentification FastAPI
      const credentials = { email, password };
      const data = await AuthService.login(credentials);
      
      if (data.access_token) {
        // Stocker le token d'authentification
        localStorage.setItem('token', data.access_token);
        
        // Récupérer et stocker le rôle de l'utilisateur
        const userRole = await AuthService.getUserRole();
        console.log('Utilisateur connecté avec le rôle:', userRole);
        
        // Redirection vers la page d'accueil
        navigate('/ouvrages');
      } else {
        setError('Identifiants invalides');
      }
    } catch (err) {
      console.error('Erreur de connexion:', err);
      // Amélioration du message d'erreur pour faciliter le débogage
      if (err.status === 401) {
        setError('Identifiants invalides');
      } else if (err.status === 500) {
        setError('Erreur serveur. Veuillez réessayer plus tard.');
      } else {
        setError(err.data?.detail || 'Erreur de connexion. Veuillez vérifier vos identifiants ou réessayer plus tard.');
      }
    }
    setLoading(false);
  };

  return (
    <>
      {/* Utilisation du Header sans bannière, adapté pour fonctionner avec la navbar dans App.js */}
      <Header showBanner={false} />
      
      <Container sx={{ mt: 4, mb: 8, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)' }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 450, 
            borderRadius: 2,
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)'
          }}
        >
          <Typography variant="h4" component="h1" align="center" fontWeight={700} mb={3} color="primary.dark">
            Connexion
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="email"
                  label="Email"
                  variant="outlined"
                  type="email"
                  placeholder="Votre adresse email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="password"
                  label="Mot de passe"
                  variant="outlined"
                  type="password"
                  placeholder="Votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  variant="contained"
                  size="large"
                  sx={{
                    py: 1.5,
                    background: 'linear-gradient(45deg, #3f51b5 30%, #5c6bc0 90%)',
                    color: 'white',
                    boxShadow: '0 3px 5px 2px rgba(63, 81, 181, 0.3)',
                    transition: 'all 0.3s ease',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} color="inherit" />
                      <span>Connexion en cours...</span>
                    </>
                  ) : (
                    <>
                      <LoginIcon sx={{ fontSize: '1.2rem' }} />
                      <span>Se connecter</span>
                    </>
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
          
          {error && (
            <Box sx={{ mt: 3, p: 2, bgcolor: '#ffebee', borderRadius: 1, color: '#c62828' }}>
              <Typography variant="body2">{error}</Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Pas encore de compte ? 
              <Link 
                href="/register"
                sx={{ 
                  ml: 1, 
                  color: 'primary.main', 
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' } 
                }}
              >
                Créer un compte
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
      
      {/* Ajout du Footer */}
      <Footer />
    </>
  );
};

export default Login;
