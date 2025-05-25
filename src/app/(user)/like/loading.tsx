import { Box, CircularProgress, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

export default function Loading() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: 3,
        // background: 'linear-gradient(to bottom, #f8f9fa, #ffffff)',
      }}
    >
      {/* Animated heart icon with pulse effect */}
      <Box
        sx={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FavoriteIcon
          sx={{
            fontSize: 60,
            color: '#ff4081',
            animation: 'pulse 1.5s infinite',
            '@keyframes pulse': {
              '0%': { transform: 'scale(1)', opacity: 0.8 },
              '50%': { transform: 'scale(1.2)', opacity: 1 },
              '100%': { transform: 'scale(1)', opacity: 0.8 },
            },
          }}
        />
        <CircularProgress
          size={80}
          thickness={2}
          sx={{
            position: 'absolute',
            color: 'rgba(255, 64, 129, 0.2)',
          }}
        />
      </Box>

      {/* Loading text with gradient */}
      <Typography
        variant="h5"
        component="div"
        sx={{
          fontWeight: 600,
          background: 'linear-gradient(to right, #3f51b5, #ff4081)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textAlign: 'center',
        }}
      >
        Loading your favorite tracks...
      </Typography>

      {/* Subtle progress indicator */}
      <CircularProgress
        size={50}
        thickness={4}
        color="secondary"
        sx={{
          animationDuration: '1.5s',
        }}
      />
    </Box>
  );
}