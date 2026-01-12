/**
 * Thème central de l'application RWC
 * Chocolat et Caramel - Style élégant et chaleureux
 */

const appTheme = {
  primary: {
    main: '#7B3F00',      // Chocolat principal
    light: '#A67C52',    // Chocolat au lait
    dark: '#4A2511',     // Chocolat noir
    contrastText: '#FFFFFF'
  },
  secondary: {
    main: '#D84315',      // Orange épicé
    light: '#FF7D47',    // Orange clair
    dark: '#9F0000',     // Orange foncé
    contrastText: '#FFFFFF'
  },
  accent: {
    main: '#D4AC0D',     // Or / Caramel
    light: '#F9E79F',    // Or clair
    dark: '#B7950B',     // Or foncé
    contrastText: '#FFFFFF'
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    light: '#f5f5f5'
  },
  background: {
    paper: '#FFFFFF',
    default: '#F5F5F5',
    dark: '#121212',
    light: '#f8f9fa',
    featured: '#0a1929',  // Fond foncé pour les sections en vedette
    shelves: '#263238',   // Fond foncé pour les rayons
    gradient: 'linear-gradient(135deg, #4A2511 0%, #7B3F00 100%)'
  },
  // Styles communs pour les composants
  components: {
    // Style commun pour les cartes
    card: {
      standard: {
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        hoverEffect: {
          transform: 'translateY(-5px)',
          boxShadow: '0 12px 28px rgba(0,0,0,0.15), 0 0 10px rgba(212,172,13,0.3) inset'
        }
      },
      featured: {
        borderRadius: 8,
        boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        border: '1px solid rgba(212,172,13,0.3)'
      }
    },
    // Style commun pour les boutons
    button: {
      primary: {
        background: 'linear-gradient(45deg, #7B3F00 0%, #A67C52 100%)',
        hoverBackground: 'linear-gradient(45deg, #4A2511 0%, #7B3F00 100%)',
        borderRadius: 4,
        padding: '8px 20px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.2s ease-in-out'
      },
      secondary: {
        background: 'linear-gradient(45deg, #D4AC0D 0%, #F9E79F 100%)',
        hoverBackground: 'linear-gradient(45deg, #B7950B 0%, #D4AC0D 100%)',
        borderRadius: 4,
        padding: '8px 20px'
      }
    },
    // Style commun pour les conteneurs
    container: {
      main: {
        padding: { xs: 2, sm: 3, md: 4, lg: 5 },
        minHeight: 'calc(100vh - 64px)',
        backgroundColor: '#F5F5F5',
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.7), rgba(255,255,255,0.7))'
      },
      card: {
        padding: { xs: 2, sm: 3, md: 4 },
        marginBottom: 4,
        backgroundColor: '#FFFFFF',
        borderRadius: 2
      }
    },
    // Style commun pour le texte
    typography: {
      sectionTitle: {
        fontWeight: 700,
        marginBottom: 3,
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          bottom: -8,
          left: 0,
          width: 40,
          height: 3,
          backgroundColor: '#D4AC0D'
        }
      },
      cardTitle: {
        fontWeight: 600,
        fontSize: '1.25rem',
        marginBottom: 1
      }
    },
    // Style commun pour les éléments de navigation
    navigation: {
      breadcrumbs: {
        padding: '10px 0',
        '& .MuiTypography-root': {
          fontWeight: 500,
          fontSize: '0.85rem'
        },
        '& .MuiLink-root': {
          color: '#7B3F00',
          '&:hover': {
            textDecoration: 'none',
            color: '#D4AC0D'
          }
        }
      }
    }
  }
};

export default appTheme;
