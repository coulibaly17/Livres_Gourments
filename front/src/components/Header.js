import React from 'react';
import { Box, Container, Typography, useMediaQuery, useTheme } from '@mui/material';

const Header = ({ title, subtitle, showBanner = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      {/* Banner conditionnelle */}
      {showBanner && (
        <Box
          sx={{
            width: '100%',
            background: 'linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%)',
            color: 'white',
            py: { xs: 4, md: 6 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            borderBottom: '1px solid rgba(255,255,255,0.1)'
            // Retrait de la marge supérieure qui compensait la navbar
          }}
        >
          {/* Éléments décoratifs */}
          <Box sx={{ 
            position: 'absolute', 
            top: -50, 
            left: -50, 
            width: 200, 
            height: 200, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)', 
            filter: 'blur(30px)' 
          }} />
          
          <Box sx={{ 
            position: 'absolute', 
            bottom: -30, 
            right: -30, 
            width: 150, 
            height: 150, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)', 
            filter: 'blur(20px)' 
          }} />
          
          <Container maxWidth="lg">
            {title && (
              <Typography 
                variant={isMobile ? "h4" : "h3"} 
                component="h1" 
                fontWeight="800"
                mb={2}
                sx={{ 
                  textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  fontSize: { xs: '1.75rem', sm: '2.25rem', md: '3rem' } // Responsive font size
                }}
              >
                {title}
              </Typography>
            )}
            
            {subtitle && (
              <Typography 
                variant="h6" 
                component="p" 
                fontWeight="400"
                maxWidth="800px"
                mx="auto"
                mb={4}
                sx={{ 
                  opacity: 0.9, 
                  fontSize: { xs: '0.9rem', sm: '1rem', md: '1.25rem' },
                  px: 2
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Container>
        </Box>
      )}
    </>
  );
};

export default Header;
