"use client";
import { useHasMounted } from "@/utils/customHook";
import { 
  AppBar, 
  Box, 
  Container, 
  Typography, 
  IconButton, 
  Slider, 
  Avatar,
  Fade,
  Slide,
  Tooltip
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./style.css";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TrackContext } from "@/lib/track.wrapper";
import { pink, purple } from "@mui/material/colors";
// Removed unused imports since we're using the original AudioPlayer

// Enhanced Styled Components
const GlassFooter = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(pink[400], 0.95)} 0%, 
    ${alpha(purple[500], 0.9)} 50%, 
    ${alpha(pink[500], 0.95)} 100%)`,
  backdropFilter: 'blur(25px)',
  boxShadow: `0 -8px 32px ${alpha(pink[500], 0.4)}`,
  border: `1px solid ${alpha('#ffffff', 0.15)}`,
  borderBottom: 'none',
  position: 'fixed',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, 
      ${alpha('#ffffff', 0.1)} 0%, 
      transparent 50%, 
      ${alpha('#ffffff', 0.05)} 100%)`,
    animation: 'shimmerFooter 4s ease-in-out infinite',
  },
  '@keyframes shimmerFooter': {
    '0%, 100%': { opacity: 0.3 },
    '50%': { opacity: 0.8 },
  },
}));

const PlayerContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(3),
  padding: theme.spacing(2, 3),
  position: 'relative',
  zIndex: 2,
  [theme.breakpoints.down('md')]: {
    gap: theme.spacing(2),
    padding: theme.spacing(1.5, 2),
  },
}));

const TrackInfoSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  minWidth: 280,
  maxWidth: 280,
  [theme.breakpoints.down('md')]: {
    minWidth: 200,
    maxWidth: 200,
  },
  [theme.breakpoints.down('sm')]: {
    minWidth: 150,
    maxWidth: 150,
  },
}));

const EnhancedTrackAvatar = styled(Avatar)(({ theme }) => ({
  width: 56,
  height: 56,
  borderRadius: '12px',
  border: `2px solid ${alpha('#ffffff', 0.3)}`,
  boxShadow: `0 4px 16px ${alpha('#000000', 0.2)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 8px 24px ${alpha('#ffffff', 0.3)}`,
    border: `2px solid ${alpha('#ffffff', 0.5)}`,
  },
  [theme.breakpoints.down('sm')]: {
    width: 44,
    height: 44,
  },
}));

const ControlsSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flex: 1,
  gap: theme.spacing(1),
}));

const MainControls = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const PlayButton = styled(IconButton)(({ theme }) => ({
  width: 48,
  height: 48,
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.25)} 0%, ${alpha('#ffffff', 0.15)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha('#ffffff', 0.3)}`,
  color: '#ffffff',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: `linear-gradient(135deg, ${alpha('#ffffff', 0.35)} 0%, ${alpha('#ffffff', 0.25)} 100%)`,
    transform: 'scale(1.1)',
    boxShadow: `0 8px 24px ${alpha('#ffffff', 0.3)}`,
  },
  '&:active': {
    transform: 'scale(0.95)',
  },
}));

const ControlButton = styled(IconButton)(({ theme }) => ({
  color: alpha('#ffffff', 0.8),
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    color: '#ffffff',
    background: alpha('#ffffff', 0.15),
    transform: 'scale(1.1)',
  },
  '&.active': {
    color: '#ffffff',
    background: alpha('#ffffff', 0.2),
  },
}));

const ProgressSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  width: '100%',
  maxWidth: 500,
  [theme.breakpoints.down('sm')]: {
    gap: theme.spacing(1),
  },
}));

const StyledSlider = styled(Slider)(({ theme }) => ({
  color: '#ffffff',
  height: 6,
  '& .MuiSlider-track': {
    background: `linear-gradient(90deg, #ffffff 0%, ${alpha('#ffffff', 0.8)} 100%)`,
    border: 'none',
    borderRadius: 3,
  },
  '& .MuiSlider-rail': {
    backgroundColor: alpha('#ffffff', 0.3),
    borderRadius: 3,
  },
  '& .MuiSlider-thumb': {
    height: 16,
    width: 16,
    backgroundColor: '#ffffff',
    border: `2px solid ${alpha('#ffffff', 0.8)}`,
    boxShadow: `0 4px 12px ${alpha('#000000', 0.3)}`,
    '&:hover': {
      boxShadow: `0 0 0 8px ${alpha('#ffffff', 0.16)}`,
    },
    '&.Mui-focusVisible': {
      boxShadow: `0 0 0 8px ${alpha('#ffffff', 0.16)}`,
    },
  },
}));

const VolumeSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  minWidth: 160,
  [theme.breakpoints.down('md')]: {
    minWidth: 120,
  },
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const TimeDisplay = styled(Typography)(({ theme }) => ({
  color: alpha('#ffffff', 0.9),
  fontSize: '0.75rem',
  fontWeight: 500,
  minWidth: 40,
  textAlign: 'center',
  fontFamily: 'monospace',
}));

const Footer = () => {
	const { currentTrack, setCurrentTrack, currentTime, setCurrentTime } = useContext(
        TrackContext
    ) as ITrackContext;
    const playerRef = useRef(null);
    const hasMounted = useHasMounted();

    //sync with wavesurfer
    useEffect(() => {
      //@ts-ignore
      const audio = playerRef?.current?.audio.current;
      if (!audio) return;
      if (currentTrack.isPlaying) {
          audio.play();
        } else {
          audio.pause();
        }
    }, [currentTrack]);
    
    //sync jump with wavesurfer
    useEffect(() => {
      console.log(currentTime);
      //@ts-ignore
      const audio = playerRef?.current?.audio.current;
      if (!audio) return;
      if (Math.abs(audio.currentTime - currentTime) > 1) {
        audio.currentTime = currentTime;
      }
    }, [currentTime]);

  return (
    <>
      {currentTrack._id && (
        <Slide direction="up" in timeout={600}>
          <div style={{ marginTop: 75 }}>
            <GlassFooter position="fixed" sx={{ top: "auto", bottom: 0 }}>
              <PlayerContainer disableGutters maxWidth={false}>
                {/* Track Info Section */}
                <Fade in timeout={800}>
                  <TrackInfoSection>
                    <EnhancedTrackAvatar
                      src={currentTrack.imgUrl || "/default-album.jpg"}
                      variant="rounded"
                    />
                    <Box sx={{ flex: 1, overflow: 'hidden' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: '#ffffff',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          mb: 0.5,
                        }}
                      >
                        {currentTrack.title || ""}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha('#ffffff', 0.8),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {currentTrack.description || ""}
                      </Typography>
                    </Box>
                  </TrackInfoSection>
                </Fade>

                {/* Audio Player Section - Styled to blend with design */}
                <Fade in timeout={1000}>
                  <Box 
                    sx={{ 
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      '& .rhap_container': {
                        backgroundColor: 'transparent !important',
                        boxShadow: 'none !important',
                        padding: 0,
                      },
                      '& .rhap_main': {
                        gap: '20px !important',
                      },
                      '& .rhap_controls-section': {
                        flex: 'unset !important',
                      },
                      '& .rhap_play-pause-button': {
                        width: '48px !important',
                        height: '48px !important',
                        background: `linear-gradient(135deg, ${alpha('#ffffff', 0.25)} 0%, ${alpha('#ffffff', 0.15)} 100%) !important`,
                        backdropFilter: 'blur(10px) !important',
                        border: `1px solid ${alpha('#ffffff', 0.3)} !important`,
                        borderRadius: '50% !important',
                        color: '#ffffff !important',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important',
                        '&:hover': {
                          background: `linear-gradient(135deg, ${alpha('#ffffff', 0.35)} 0%, ${alpha('#ffffff', 0.25)} 100%) !important`,
                          transform: 'scale(1.1) !important',
                          boxShadow: `0 8px 24px ${alpha('#ffffff', 0.3)} !important`,
                        },
                      },
                      '& .rhap_button-clear': {
                        color: `${alpha('#ffffff', 0.8)} !important`,
                        transition: 'all 0.3s ease !important',
                        '&:hover': {
                          color: '#ffffff !important',
                          background: `${alpha('#ffffff', 0.15)} !important`,
                          transform: 'scale(1.1) !important',
                        },
                      },
                      '& .rhap_progress-bar': {
                        background: `${alpha('#ffffff', 0.3)} !important`,
                        borderRadius: '3px !important',
                        height: '6px !important',
                      },
                      '& .rhap_progress-filled': {
                        background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.8) 100%) !important',
                        borderRadius: '3px !important',
                      },
                      '& .rhap_progress-indicator': {
                        background: '#ffffff !important',
                        width: '16px !important',
                        height: '16px !important',
                        border: `2px solid ${alpha('#ffffff', 0.8)} !important`,
                        boxShadow: `0 4px 12px ${alpha('#000000', 0.3)} !important`,
                        top: '-5px !important',
                      },
                      '& .rhap_time': {
                        color: `${alpha('#ffffff', 0.9)} !important`,
                        fontSize: '0.75rem !important',
                        fontWeight: '500 !important',
                        fontFamily: 'monospace !important',
                      },
                      '& .rhap_volume-bar': {
                        background: `${alpha('#ffffff', 0.3)} !important`,
                        borderRadius: '3px !important',
                        height: '6px !important',
                      },
                      '& .rhap_volume-filled': {
                        background: 'linear-gradient(90deg, #ffffff 0%, rgba(255,255,255,0.8) 100%) !important',
                        borderRadius: '3px !important',
                      },
                      '& .rhap_volume-indicator': {
                        background: '#ffffff !important',
                        width: '16px !important',
                        height: '16px !important',
                        border: `2px solid ${alpha('#ffffff', 0.8)} !important`,
                        boxShadow: `0 4px 12px ${alpha('#000000', 0.3)} !important`,
                        top: '-5px !important',
                      },
                    }}
                  >
                    <AudioPlayer
                      ref={playerRef}
                      layout="horizontal-reverse"
                      src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                      onSeeking={(e: any) => {
                        setCurrentTime(e.target.currentTime);
                      }}
                      onPlay={() => {
                        setCurrentTrack({
                          ...currentTrack,
                          isPlaying: true,
                        });
                      }}
                      onPause={() => {
                        setCurrentTrack({
                          ...currentTrack,
                          isPlaying: false,
                        });
                      }}
                      style={{
                        backgroundColor: "transparent",
                        boxShadow: "unset",
                      }}
                    />
                  </Box>
                </Fade>
              </PlayerContainer>
            </GlassFooter>
          </div>
        </Slide>
      )}
    </>
  );
};

export default Footer;