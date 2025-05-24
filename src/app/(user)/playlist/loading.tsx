// Loading.tsx
import { Box, CircularProgress, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(to bottom right, #ffe0f0, #fff0f5)',
      }}
    >
      <CircularProgress
        sx={{ color: '#ff69b4', mb: 2 }}
        size={60}
        thickness={4}
      />
      <Typography
        variant="h5"
        sx={{ color: '#ff69b4', fontWeight: 'bold', fontFamily: 'sans-serif' }}
      >
        Loading your lovely playlists...
      </Typography>
    </Box>
  );
}
