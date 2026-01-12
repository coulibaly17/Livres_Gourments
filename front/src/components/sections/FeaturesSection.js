import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper,
  Avatar,
  useTheme
} from '@mui/material';
import { appTheme } from '../../theme/appTheme';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';
import EmojiObjectsIcon from '@mui/icons-material/EmojiObjects';
import GroupsIcon from '@mui/icons-material/Groups';

const features = [
  {
    icon: <LocalLibraryIcon sx={{ fontSize: 40 }} />,
    title: 'Collection Variée',
    description: 'Découvrez une vaste sélection de livres culinaires, techniques gastronomiques, et récits gourmands adaptés à tous les niveaux.'
  },
  {
    icon: <BookmarkAddedIcon sx={{ fontSize: 40 }} />,
    title: 'Achats Faciles',
    description: 'Un système d\'achat intuitif qui vous permet d\'acquérir facilement vos livres préférés en quelques clics.'
  },
  {
    icon: <EmojiObjectsIcon sx={{ fontSize: 40 }} />,
    title: 'Conseils Personnalisés',
    description: 'Recevez des recommandations sur mesure basées sur vos préférences et votre historique de lecture.'
  },
  {
    icon: <GroupsIcon sx={{ fontSize: 40 }} />,
    title: 'Communauté Active',
    description: 'Rejoignez une communauté passionnée de lecteurs et partagez vos découvertes littéraires et culinaires.'
  }
];

const FeatureCard = ({ feature, index }) => {
  const theme = useTheme();
  
  return (
    <Grid item xs={12} sm={6} md={3}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          borderRadius: 2,
          transition: 'all 0.3s ease',
          animation: `fadeInUp 0.8s forwards ${0.2 + index * 0.15}s`,
          opacity: 0,
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: `0 8px 24px rgba(123, 63, 0, 0.15)`,
            '& .icon-wrapper': {
              background: `linear-gradient(45deg, ${appTheme.primary.main}, ${appTheme.primary.light})`,
              transform: 'scale(1.1)',
            }
          }
        }}
      >
        <Avatar 
          className="icon-wrapper"
          sx={{
            width: 80,
            height: 80,
            bgcolor: 'rgba(123, 63, 0, 0.1)',
            color: appTheme.primary.main,
            mb: 3,
            transition: 'all 0.3s ease',
            '& svg': {
              transition: 'all 0.3s ease',
            }
          }}
        >
          {feature.icon}
        </Avatar>
        <Typography 
          variant="h6" 
          component="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 700,
            mb: 1.5,
            color: appTheme.primary.dark
          }}
        >
          {feature.title}
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ flexGrow: 1 }}
        >
          {feature.description}
        </Typography>
      </Paper>
    </Grid>
  );
};

const FeaturesSection = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        bgcolor: 'background.paper'
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ 
          textAlign: 'center', 
          mb: { xs: 6, md: 8 },
          animation: 'fadeInUp 0.8s forwards',
        }}>
          <Typography 
            variant="overline" 
            component="div"
            sx={{ 
              color: appTheme.primary.main, 
              fontWeight: 600,
              letterSpacing: 2,
              mb: 1
            }}
          >
            AVANTAGES EXCLUSIFS
          </Typography>
          <Typography 
            variant="h3" 
            component="h2"
            gutterBottom
            sx={{ 
              fontWeight: 800,
              mb: 2,
              background: `linear-gradient(45deg, ${appTheme.primary.dark}, ${appTheme.accent.main})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Une expérience littéraire enrichissante
          </Typography>
          <Typography 
            variant="body1"
            color="text.secondary"
            sx={{ 
              maxWidth: '700px',
              mx: 'auto',
              fontSize: '1.1rem',
              lineHeight: 1.6
            }}
          >
            Notre bibliothèque gourmande vous offre bien plus que de simples livres. Découvrez tous les avantages que nous proposons pour enrichir votre passion pour la gastronomie.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FeaturesSection;
