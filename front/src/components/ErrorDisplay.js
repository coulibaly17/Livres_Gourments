import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

/**
 * Composant pour afficher les erreurs avec un style attrayant et professionnel
 */
function ErrorDisplay({ message, onRetry }) {
  return (
    <Paper 
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 3,
        textAlign: 'center',
        maxWidth: 600,
        mx: 'auto',
        my: 5,
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15)'
        }
      }}
    >
      {/* Bandes colorées sur le côté, comme pour les livres */}
      <Box 
        sx={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          width: 8,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ height: '25%', bgcolor: '#f44336' }} />
        <Box sx={{ height: '15%', bgcolor: '#2196f3' }} />
        <Box sx={{ height: '20%', bgcolor: '#4caf50' }} />
        <Box sx={{ height: '15%', bgcolor: '#ff9800' }} />
        <Box sx={{ height: '25%', bgcolor: '#9c27b0' }} />
      </Box>
      
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          justifyContent: 'center',
          transform: 'translateZ(0)',
          '&:hover': {
            '& .error-icon': {
              transform: 'scale(1.1) rotate(5deg)',
              color: '#f44336'
            }
          }
        }}
      >
        <ErrorOutlineIcon 
          className="error-icon"
          sx={{ 
            fontSize: 80, 
            color: '#e91e63',
            transition: 'transform 0.3s, color 0.3s',
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.2))'
          }} 
        />
      </Box>
      
      <Typography 
        variant="h5" 
        component="h2" 
        gutterBottom
        sx={{ 
          fontWeight: 700,
          mb: 2,
          textShadow: '0 1px 2px rgba(0,0,0,0.1)'
        }}
      >
        Oups, une erreur est survenue
      </Typography>
      
      <Typography 
        variant="body1" 
        color="text.secondary"
        sx={{ mb: 4 }}
      >
        {message || "Erreur lors du chargement du catalogue"}
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<RefreshIcon />}
        onClick={onRetry}
        sx={{ 
          borderRadius: 8,
          px: 4,
          py: 1.5,
          fontWeight: 600,
          boxShadow: '0 4px 10px rgba(63, 81, 181, 0.4)',
          transition: 'all 0.3s',
          '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 6px 15px rgba(63, 81, 181, 0.6)'
          }
        }}
      >
        Réessayer
      </Button>
    </Paper>
  );
}

export default ErrorDisplay;
