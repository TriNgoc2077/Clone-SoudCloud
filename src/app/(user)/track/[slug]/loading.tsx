'use client';
import { Skeleton, Box, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: 'auto',
        mt: 4,
        p: 2,
      }}
    >
      {/* Track + Waveform container */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          borderRadius: 3,
          background: 'linear-gradient(135deg, #a28baf 0%, #100b13 100%)',
          p: 3,
          mb: 4,
        }}
      >
        {/* Left: Info + waveform */}
        <Box sx={{ flex: 1, pr: 2 }}>
          <Skeleton variant="text" width="60%" height={35} />
          <Skeleton variant="text" width="40%" height={25} sx={{ mb: 3 }} />
          <Skeleton variant="rectangular" width="100%" height={100} />
        </Box>

        {/* Right: Cover Image */}
        <Box
          sx={{
            width: 250,
            height: 250,
            mt: { xs: 3, md: 0 },
            ml: { md: 2 },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Skeleton variant="rectangular" width={250} height={250} sx={{ borderRadius: 2 }} />
        </Box>
      </Box>

      {/* Comment section */}
      <Box>
        <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>
          Comments
        </Typography>

        {[1, 2, 3].map((i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              gap: 2,
              mb: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Avatar */}
            <Skeleton variant="circular" width={50} height={50} />

            {/* Comment box */}
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" height={20} />
              <Skeleton variant="rectangular" width="100%" height={40} />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
