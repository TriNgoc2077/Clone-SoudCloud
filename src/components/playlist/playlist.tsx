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
  alpha
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { TrackContext } from "@/lib/track.wrapper";
import { pink } from "@mui/material/colors";

interface IProps {
  playlists: IPlaylist[];
  session: any;
  tracks: ITrackTop[];
}

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
  const { currentTrack, setCurrentTrack } =
    React.useContext(TrackContext) as ITrackContext;

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250
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
  }
  const handleChangeTracks = (event: SelectChangeEvent<typeof tracksSelected>) => {
    const {
      target: { value }
    } = event;
    setTracksSelected(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <Box p={3}>
      <Stack direction="row" spacing={2} mb={3} justifyContent="space-between">
        <Typography variant="h4" color="hotpink">My Playlists</Typography>
        <Box>
          <Button variant="contained" sx={{ bgcolor: "hotpink", mr: 1 }} onClick={handleAddPlaylist}>+ Playlist</Button>
          <Button variant="outlined" sx={{ borderColor: "hotpink", color: "hotpink" }} onClick={handleAddTrack}>+ Track</Button>
        </Box>
      </Stack>

      {playlists.map((playlist) => (
        <Card sx={{ mb: 2, border: "1px solid hotpink", borderRadius: 2 }} key={playlist._id}>
          <CardContent>
            <Typography variant="h6" color="hotpink">{playlist.title}</Typography>
            <Divider sx={{ my: 1 }} />
            {playlist.tracks.length === 0 ? (
              <Typography color="text.secondary">No tracks yet.</Typography>
            ) : (
              playlist.tracks.map((track) => (
                <Stack direction="row" spacing={1} alignItems="center" key={track._id}>
                  <Typography>{track.title}</Typography>
                  <IconButton
                    onClick={() => {
                      if (track._id !== currentTrack._id) {
                        currentTrack.isPlaying = false;
                      }
                      setCurrentTrack({ ...track, isPlaying: !currentTrack.isPlaying });
                    }}
                    sx={{ color: "hotpink" }}
                  >
                    {track._id === currentTrack._id && currentTrack.isPlaying ? (
                      <PauseIcon />
                    ) : (
                      <PlayArrowIcon />
                    )}
                  </IconButton>
                </Stack>
              ))
            )}
          </CardContent>
        </Card>
      ))}

      {/* Dialogs */}
      <Dialog open={isAddPlaylist} onClose={(event, reason) => {
        if (reason !== "backdropClick") handleClosePlaylist()
      }}>
        <DialogTitle sx={{ color: "hotpink" }}>Create Playlist</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            required
            margin="dense"
            label="Title"
            variant="standard"
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 3 }}
          />
          <FormControlLabel
            control={<Switch defaultChecked onChange={() => setIsPublic(!isPublic)} sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                color: pink[600],
                '&:hover': {
                    backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
                },
                },
                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: pink[600],
                },
            }}/>}
            label={isPublic ? "Public" : "Private"}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWithoutAddPlaylist} sx={{ color: "hotpink" }}>Cancel</Button>
          <Button onClick={handleClosePlaylist} sx={{ color: "hotpink" }}>Add</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isAddTrack}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") handleCloseAddTrack();
        }}
      >
        <DialogTitle sx={{ color: "hotpink" }}>Add Track to Playlist</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Playlist</InputLabel>
            <Select
              value={playlistSelected}
              label="Playlist"
              onChange={(e) => setPlaylistSelected(e.target.value)}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {playlists.map((playlist) => (
                <MenuItem key={playlist._id} value={playlist._id}>{playlist.title}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Tracks</InputLabel>
            <Select
              multiple
              value={tracksSelected}
              onChange={handleChangeTracks}
              input={<OutlinedInput label="Tracks" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={tracks.find((track) => value === track._id)?.title ?? value}
                      sx={{ bgcolor: "hotpink", color: "white" }}
                    />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {tracks.map((track) => (
                <MenuItem key={track._id} value={track._id}>{track.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeWithoutUpdatePlaylist} sx={{ color: "hotpink" }}>Cancel</Button>
          <Button onClick={handleCloseAddTrack} sx={{ color: "hotpink" }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Playlist;