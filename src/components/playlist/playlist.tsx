"use client";
import Button from "@mui/material/Button";
import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import {
  Box,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Switch,
  TextField,
  IconButton,
  useTheme,
  Stack,
  Card,
  CardContent,
  Divider,
  styled,
  alpha,
  Container,
  Fade,
  Slide,
  Zoom,
  Avatar,
  Tooltip,
  Backdrop
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import AddIcon from "@mui/icons-material/Add";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PublicIcon from "@mui/icons-material/Public";
import LockIcon from "@mui/icons-material/Lock";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { TrackContext } from "@/lib/track.wrapper";
import { pink, purple } from "@mui/material/colors";

interface IProps {
  playlists: IPlaylist[];
  session: any;
  tracks: ITrackTop[];
}

// Styled Components with Enhanced Animations
const GradientBackground = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${pink[50]} 0%, 
    ${pink[100]} 25%, 
    ${purple[50]} 50%, 
    ${pink[50]} 75%, 
    ${pink[100]} 100%)`,
  minHeight: '100vh',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at 20% 80%, ${alpha(pink[200], 0.3)} 0%, transparent 50%),
                 radial-gradient(circle at 80% 20%, ${alpha(purple[200], 0.3)} 0%, transparent 50%),
                 radial-gradient(circle at 40% 40%, ${alpha(pink[100], 0.2)} 0%, transparent 50%)`,
    animation: 'float 20s ease-in-out infinite',
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '33%': { transform: 'translateY(-20px) rotate(2deg)' },
    '66%': { transform: 'translateY(10px) rotate(-1deg)' },
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: `linear-gradient(145deg, 
    ${alpha('#ffffff', 0.9)} 0%, 
    ${alpha(pink[50], 0.8)} 100%)`,
  backdropFilter: 'blur(20px)',
  border: `1px solid ${alpha(pink[200], 0.3)}`,
  borderRadius: '20px',
  boxShadow: `0 8px 32px ${alpha(pink[500], 0.15)}, 
              0 4px 16px ${alpha(pink[300], 0.1)}`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, 
      transparent 0%, 
      ${alpha(pink[200], 0.2)} 50%, 
      transparent 100%)`,
    transition: 'left 0.6s ease',
  },
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${alpha(pink[500], 0.25)}, 
                0 8px 24px ${alpha(pink[300], 0.15)}`,
    '&::before': {
      left: '100%',
    },
  },
}));

const GlassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: `linear-gradient(145deg, 
      ${alpha('#ffffff', 0.95)} 0%, 
      ${alpha(pink[50], 0.9)} 100%)`,
    backdropFilter: 'blur(30px)',
    borderRadius: '24px',
    border: `1px solid ${alpha(pink[200], 0.3)}`,
    boxShadow: `0 24px 48px ${alpha(pink[500], 0.2)}`,
  },
}));

const AnimatedButton = styled(Button)(({ theme }) => ({
  borderRadius: '16px',
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '14px',
  padding: '12px 24px',
  position: 'relative',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha(pink[500], 0.3)}`,
    '&::before': {
      left: '100%',
    },
  },
}));

const FloatingActionButton = styled(IconButton)(({ theme }) => ({
  background: `linear-gradient(135deg, ${pink[400]} 0%, ${pink[600]} 100%)`,
  color: 'white',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  boxShadow: `0 8px 24px ${alpha(pink[500], 0.4)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: `linear-gradient(135deg, ${pink[500]} 0%, ${pink[700]} 100%)`,
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: `0 12px 32px ${alpha(pink[500], 0.5)}`,
  },
}));

const PlaylistHeader = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(pink[400], 0.9)} 0%, 
    ${alpha(purple[400], 0.8)} 100%)`,
  padding: '32px',
  borderRadius: '24px 24px 0 0',
  color: 'white',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-10%',
    width: '200px',
    height: '200px',
    borderRadius: '50%',
    background: alpha('#ffffff', 0.1),
    animation: 'pulse 4s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.05)' },
  },
}));

const TrackItem = styled(Box)(({ theme }) => ({
  padding: '16px 20px',
  borderRadius: '12px',
  margin: '8px 0',
  background: alpha('#ffffff', 0.5),
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha(pink[200], 0.2)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(90deg, 
      ${alpha(pink[300], 0)} 0%, 
      ${alpha(pink[300], 0.1)} 50%, 
      ${alpha(pink[300], 0)} 100%)`,
    transform: 'translateX(-100%)',
    transition: 'transform 0.6s ease',
  },
  '&:hover': {
    transform: 'translateX(8px)',
    background: alpha(pink[50], 0.8),
    boxShadow: `0 4px 16px ${alpha(pink[300], 0.2)}`,
    '&::before': {
      transform: 'translateX(100%)',
    },
  },
}));

const Playlist = ({ playlists, session, tracks }: IProps) => {
  const toast = useToast();
  const router = useRouter();
  const theme = useTheme();
  const [isAddPlaylist, setIsAddPlaylist] = React.useState(false);
  const [isAddTrack, setIsAddTrack] = React.useState(false);
  const [playlistSelected, setPlaylistSelected] = React.useState("");
  const [tracksSelected, setTracksSelected] = React.useState<string[]>([]);
  const [title, setTitle] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(true);
  const { currentTrack, setCurrentTrack, setPlaylist } = React.useContext(TrackContext) as ITrackContext;
  // const [currentTrack, setCurrentTrack] = React.useState({ _id: '', isPlaying: false });

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
        borderRadius: '16px',
        background: `linear-gradient(145deg, ${alpha('#ffffff', 0.95)} 0%, ${alpha(pink[50], 0.9)} 100%)`,
        backdropFilter: 'blur(20px)',
      }
    }
  };

  const handleAddPlaylist = () => setIsAddPlaylist(true);
  const handleAddTrack = () => setIsAddTrack(true);

  const handleClosePlaylist = async () => {
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/empty`,
      method: "POST",
      body: { title, isPublic },
      headers: {
        Authorization: `Bearer ${session.access_token}`
      }
    });
    res.data ? toast.success("Playlist created!") : toast.error(res.message);
    await sendRequest<IBackendRes<any>>({
      url: `/api/revalidate`,
      method: "POST",
      queryParams: { tag: "playlist-by-user", secret: "justARandomString" }
    });
    router.refresh();
    setIsAddPlaylist(false);
    setTitle("");
  };

  const handleCloseAddTrack = async () => {
    const chosenPlaylist = playlists.find((p) => p._id === playlistSelected);
    const res = await sendRequest<IBackendRes<any>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists`,
      method: "PATCH",
      body: {
        id: chosenPlaylist?._id,
        title: chosenPlaylist?.title,
        isPublic: chosenPlaylist?.isPublic,
        tracks: tracksSelected
      },
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    res.data
      ? toast.success("Added track to your playlist!")
      : toast.error(res.message);
    router.refresh();
    setIsAddTrack(false);
    setTracksSelected([]);
    setPlaylistSelected("");
  };

  const closeWithoutUpdatePlaylist = () => setIsAddTrack(false);
  const closeWithoutAddPlaylist = () => {
    setIsAddPlaylist(false);
    setTitle("");
  };

  const handleChangeTracks = (event: SelectChangeEvent<typeof tracksSelected>) => {
    const { target: { value } } = event;
    setTracksSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <GradientBackground>
      <Container maxWidth="lg">
        <Box pt={4} pb={6}>
          {/* Header Section */}
          <Fade in timeout={800}>
            <PlaylistHeader>
              <Stack direction="row" spacing={3} alignItems="center" mb={2}>
                <Avatar sx={{ 
                  width: 64, 
                  height: 64, 
                  bgcolor: alpha('#ffffff', 0.2),
                  fontSize: '28px'
                }}>
                  <QueueMusicIcon fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h3" fontWeight={700} mb={1}>
                    My Playlists
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9 }}>
                    {playlists?.length || 0} playlists • {playlists.reduce((accumulator, playlist) => {return accumulator + playlist.tracks.length}, 0) || 0} tracks available
                  </Typography>
                </Box>
              </Stack>
              
              <Stack direction="row" spacing={2} mt={3}>
                <AnimatedButton
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddPlaylist}
                  sx={{
                    bgcolor: alpha('#ffffff', 0.2),
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#ffffff', 0.3)}`,
                    '&:hover': {
                      bgcolor: alpha('#ffffff', 0.3),
                    }
                  }}
                >
                  Create Playlist
                </AnimatedButton>
                <AnimatedButton
                  variant="outlined"
                  startIcon={<MusicNoteIcon />}
                  onClick={handleAddTrack}
                  sx={{
                    borderColor: alpha('#ffffff', 0.5),
                    color: 'white',
                    backdropFilter: 'blur(10px)',
                    '&:hover': {
                      borderColor: '#ffffff',
                      bgcolor: alpha('#ffffff', 0.1),
                    }
                  }}
                >
                  Add Track
                </AnimatedButton>
              </Stack>
            </PlaylistHeader>
          </Fade>

          {/* Playlists Grid */}
          <Box mt={4}>
            <Stack spacing={3}>
              {playlists?.map((playlist, index) => (
                <Slide key={playlist._id} direction="up" in timeout={600 + index * 100}>
                  <StyledCard>
                    <CardContent sx={{ p: 0 }}>
                      {/* Playlist Header */}
                      <Box sx={{ 
                        background: `linear-gradient(135deg, ${alpha(pink[300], 0.1)} 0%, ${alpha(purple[300], 0.05)} 100%)`,
                        p: 3,
                        borderBottom: `1px solid ${alpha(pink[200], 0.2)}`
                      }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ 
                              bgcolor: `linear-gradient(135deg, ${pink[400]} 0%, ${pink[600]} 100%)`,
                              width: 48,
                              height: 48
                            }}>
                              <QueueMusicIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h5" fontWeight={600} color={pink[700]}>
                                {playlist.title}
                              </Typography>
                              <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
                                {playlist.isPublic ? (
                                  <>
                                    <PublicIcon fontSize="small" sx={{ color: pink[400] }} />
                                    <Typography variant="body2" color={pink[600]}>Public</Typography>
                                  </>
                                ) : (
                                  <>
                                    <LockIcon fontSize="small" sx={{ color: pink[400] }} />
                                    <Typography variant="body2" color={pink[600]}>Private</Typography>
                                  </>
                                )}
                                <Typography variant="body2" color="text.secondary">
                                  • {playlist.tracks?.length || 0} tracks
                                </Typography>
                              </Stack>
                            </Box>
                          </Stack>
                          
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Share Playlist" onClick={() => toast.warning("Under development !")}>
                              <IconButton sx={{ color: pink[400] }}>
                                <ShareIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Add to Favorites" onClick={() => toast.warning("Under development !")}>
                              <IconButton sx={{ color: pink[400] }}>
                                <FavoriteIcon />
                              </IconButton>
                            </Tooltip>
                            <IconButton sx={{ color: pink[400] }} onClick={() => toast.warning("Under development !")}>
                              <MoreVertIcon />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Tracks List */}
                      <Box sx={{ p: 2 }}>
                        {!playlist.tracks || playlist.tracks.length === 0 ? (
                          <Box textAlign="center" py={4}>
                            <MusicNoteIcon sx={{ fontSize: 48, color: pink[200], mb: 2 }} />
                            <Typography color="text.secondary" variant="h6">
                              No tracks yet
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              Add some tracks to get started
                            </Typography>
                          </Box>
                        ) : (
                          playlist.tracks.map((track, trackIndex) => (
                            <Zoom key={track._id} in timeout={400 + trackIndex * 50}>
                              <TrackItem>
                                <Stack direction="row" alignItems="center" justifyContent="space-between">
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="h6" sx={{ 
                                      minWidth: '24px',
                                      color: pink[400],
                                      fontWeight: 600
                                    }}>
                                      {trackIndex + 1}
                                    </Typography>
                                    <Box>
                                      <Typography variant="subtitle1" fontWeight={500}>
                                        {track.title}
                                      </Typography>
                                      <Typography variant="body2" color="text.secondary">
                                        {track.description || 'No description'}
                                      </Typography>
                                    </Box>
                                  </Stack>
                                  
                                  <FloatingActionButton
                                    size="small"
                                    onClick={() => {
                                      if (track._id !== currentTrack._id) {
                                        setCurrentTrack({...currentTrack, isPlaying: false})
                                      }
                                      const updatedTracks = tracks.map(track => ({
                                        ...track,
                                        isPlaying: false,
                                      }));
                                
                                      const reorderedTracks = [
                                        track,
                                        ...updatedTracks.filter(t => t._id !== track._id),
                                      ];
                                      setPlaylist(reorderedTracks);
                                      setCurrentTrack({ ...track, isPlaying: !currentTrack.isPlaying });
                                    }}
                                    sx={{ width: 40, height: 40 }}
                                  >
                                    {track._id === currentTrack._id && currentTrack.isPlaying ? (
                                      <PauseIcon />
                                    ) : (
                                      <PlayArrowIcon />
                                    )}
                                  </FloatingActionButton>
                                </Stack>
                              </TrackItem>
                            </Zoom>
                          ))
                        )}
                      </Box>
                    </CardContent>
                  </StyledCard>
                </Slide>
              ))}
            </Stack>
          </Box>

          {/* Create Playlist Dialog */}
          <GlassDialog 
            open={isAddPlaylist} 
            onClose={(event, reason) => {
              if (reason !== "backdropClick") handleClosePlaylist();
            }}
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 400 }}
          >
            <DialogTitle sx={{ 
              color: pink[700], 
              fontSize: '24px', 
              fontWeight: 600,
              textAlign: 'center',
              pb: 1
            }}>
              <QueueMusicIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Create New Playlist
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <TextField
                fullWidth
                required
                margin="normal"
                label="Playlist Title"
                variant="outlined"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    '&:hover fieldset': { borderColor: pink[400] },
                    '&.Mui-focused fieldset': { borderColor: pink[500] },
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: pink[500] },
                }}
              />
              <FormControlLabel
                control={
                  <Switch 
                    checked={isPublic}
                    onChange={() => setIsPublic(!isPublic)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: pink[600],
                        '&:hover': {
                          backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
                        },
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: pink[600],
                      },
                    }}
                  />
                }
                label={
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {isPublic ? <PublicIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                    <Typography>{isPublic ? "Public Playlist" : "Private Playlist"}</Typography>
                  </Stack>
                }
              />
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <AnimatedButton onClick={closeWithoutAddPlaylist} sx={{ color: pink[500] }}>
                Cancel
              </AnimatedButton>
              <AnimatedButton 
                onClick={handleClosePlaylist} 
                variant="contained"
                sx={{ 
                  bgcolor: pink[500],
                  '&:hover': { bgcolor: pink[600] }
                }}
              >
                Create Playlist
              </AnimatedButton>
            </DialogActions>
          </GlassDialog>

          {/* Add Track Dialog */}
          <GlassDialog 
            open={isAddTrack}
            onClose={(event, reason) => {
              if (reason !== "backdropClick") handleCloseAddTrack();
            }}
            TransitionComponent={Zoom}
            TransitionProps={{ timeout: 400 }}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ 
              color: pink[700], 
              fontSize: '24px', 
              fontWeight: 600,
              textAlign: 'center',
              pb: 1
            }}>
              <MusicNoteIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Add Track to Playlist
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel sx={{ '&.Mui-focused': { color: pink[500] } }}>
                  Select Playlist
                </InputLabel>
                <Select
                  value={playlistSelected}
                  label="Select Playlist"
                  onChange={(e) => setPlaylistSelected(e.target.value)}
                  sx={{
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: pink[400] },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: pink[500] },
                  }}
                >
                  <MenuItem value=""><em>Choose a playlist</em></MenuItem>
                  {playlists?.map((playlist) => (
                    <MenuItem key={playlist._id} value={playlist._id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <QueueMusicIcon fontSize="small" sx={{ color: pink[400] }} />
                        <Typography>{playlist.title}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel sx={{ '&.Mui-focused': { color: pink[500] } }}>
                  Select Tracks
                </InputLabel>
                <Select
                  multiple
                  value={tracksSelected}
                  onChange={handleChangeTracks}
                  input={<OutlinedInput label="Select Tracks" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={tracks?.find((track) => value === track._id)?.title ?? value}
                          sx={{ 
                            bgcolor: pink[500], 
                            color: 'white',
                            '&:hover': { bgcolor: pink[600] }
                          }}
                          size="small"
                        />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                  sx={{
                    borderRadius: '12px',
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: pink[400] },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: pink[500] },
                  }}
                >
                  {tracks?.map((track) => (
                    <MenuItem key={track._id} value={track._id}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <MusicNoteIcon fontSize="small" sx={{ color: pink[400] }} />
                        <Typography>{track.title}</Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions sx={{ p: 3, gap: 1 }}>
              <AnimatedButton onClick={closeWithoutUpdatePlaylist} sx={{ color: pink[500] }}>
                Cancel
              </AnimatedButton>
              <AnimatedButton 
                onClick={handleCloseAddTrack} 
                variant="contained"
                sx={{ 
                  bgcolor: pink[500],
                  '&:hover': { bgcolor: pink[600] }
                }}
              >
                Add Tracks
              </AnimatedButton>
            </DialogActions>
          </GlassDialog>
        </Box>
      </Container>
    </GradientBackground>
  );
};

export default Playlist;