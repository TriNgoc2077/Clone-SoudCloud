"use client";
import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MailIcon from "@mui/icons-material/Mail";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import { Divider, ListItemIcon, Fade, Slide, Zoom, Tooltip } from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import LoginIcon from "@mui/icons-material/Login";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";
// import ActiveLink from "./active.link";
import { pink, purple } from "@mui/material/colors";

const ActiveLink = ({ href, children, ...props }: any) => (
  <Link href={href} {...props} style={{ textDecoration: 'none', color: 'inherit' }}>
    {children}
  </Link>
);

// Enhanced Styled Components
const GlassAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, 
    ${alpha(pink[400], 0.95)} 0%, 
    ${alpha(purple[500], 0.9)} 50%, 
    ${alpha(pink[500], 0.95)} 100%)`,
  backdropFilter: 'blur(20px)',
  boxShadow: `0 8px 32px ${alpha(pink[500], 0.3)}`,
  border: `1px solid ${alpha('#ffffff', 0.1)}`,
  position: 'relative',
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
    animation: 'shimmer 3s ease-in-out infinite',
  },
  '@keyframes shimmer': {
    '0%, 100%': { opacity: 0.5 },
    '50%': { opacity: 1 },
  },
}));

const EnhancedSearch = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: "24px",
  background: `linear-gradient(135deg, ${alpha('#ffffff', 0.2)} 0%, ${alpha('#ffffff', 0.1)} 100%)`,
  backdropFilter: 'blur(10px)',
  border: `1px solid ${alpha('#ffffff', 0.3)}`,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  "&:hover": {
    background: `linear-gradient(135deg, ${alpha('#ffffff', 0.3)} 0%, ${alpha('#ffffff', 0.2)} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha('#ffffff', 0.3)}`,
  },
  "&:focus-within": {
    background: `linear-gradient(135deg, ${alpha('#ffffff', 0.4)} 0%, ${alpha('#ffffff', 0.3)} 100%)`,
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha('#ffffff', 0.4)}`,
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: '#ffffff',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#ffffff",
  width: '100%',
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    fontSize: '14px',
    fontWeight: 500,
    "&::placeholder": {
      color: alpha('#ffffff', 0.8),
      opacity: 1,
    },
    [theme.breakpoints.up("md")]: {
      width: "400px",
    },
  },
}));

const LogoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  padding: theme.spacing(1),
  borderRadius: '16px',
  '&:hover': {
    background: alpha('#ffffff', 0.1),
    transform: 'scale(1.05)',
  },
}));

const NavLink = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2.5),
  borderRadius: '20px',
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  background: alpha('#ffffff', 0.1),
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  color: '#ffffff',
  fontSize: '14px',
  fontWeight: 500,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, transparent 0%, ${alpha('#ffffff', 0.2)} 50%, transparent 100%)`,
    transition: 'left 0.5s ease',
  },
  '&:hover': {
    background: alpha('#ffffff', 0.25),
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 25px ${alpha('#ffffff', 0.2)}`,
    '&::before': {
      left: '100%',
    },
  },
  '&.active': {
    background: `linear-gradient(135deg, ${alpha('#ffffff', 0.3)} 0%, ${alpha('#ffffff', 0.2)} 100%)`,
    color: '#ffffff',
    fontWeight: 600,
    boxShadow: `0 4px 15px ${alpha('#ffffff', 0.3)}`,
  }
}));

const EnhancedAvatar = styled(Avatar)(({ theme }) => ({
  width: 40,
  height: 40,
  cursor: 'pointer',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: `2px solid ${alpha('#ffffff', 0.3)}`,
  boxShadow: `0 4px 12px ${alpha('#000000', 0.1)}`,
  '&:hover': {
    transform: 'scale(1.1) rotate(5deg)',
    boxShadow: `0 8px 24px ${alpha('#ffffff', 0.3)}`,
    border: `2px solid ${alpha('#ffffff', 0.6)}`,
  },
}));

const GlassMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    background: `linear-gradient(145deg, 
      ${alpha('#ffffff', 0.95)} 0%, 
      ${alpha(pink[50], 0.9)} 100%)`,
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    border: `1px solid ${alpha(pink[200], 0.3)}`,
    boxShadow: `0 20px 40px ${alpha(pink[500], 0.2)}`,
    minWidth: '220px',
    '& .MuiMenuItem-root': {
      borderRadius: '12px',
      margin: '4px 8px',
      transition: 'all 0.2s ease',
      '&:hover': {
        background: `linear-gradient(135deg, ${alpha(pink[100], 0.8)} 0%, ${alpha(pink[50], 0.6)} 100%)`,
        transform: 'translateX(4px)',
      },
    },
  },
}));

const AnimatedBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    background: `linear-gradient(135deg, ${pink[400]} 0%, ${pink[600]} 100%)`,
    color: 'white',
    fontWeight: 600,
    animation: 'pulse 2s ease-in-out infinite',
  },
  '@keyframes pulse': {
    '0%, 100%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
  },
}));

export default function AppHeader() {
  const { data: session } = useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleRedirectHome = () => {
    router.push("/");
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <GlassMenu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
      TransitionComponent={Zoom}
      TransitionProps={{ timeout: 300 }}
    >
      <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
        <EnhancedAvatar 
          src={fetchDefaultImages(session?.user?.type || 'default')}
          sx={{ width: 32, height: 32, mr: 1.5 }}
        />
        <Link
          href={`/profile/${session?.user?._id}`}
          style={{
            color: "unset",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          My account
        </Link>
      </MenuItem>
      <Divider sx={{ mx: 1, borderColor: alpha(pink[300], 0.3) }} />
      <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <PersonAdd fontSize="small" sx={{ color: pink[500] }} />
        </ListItemIcon>
        <Typography variant="body2" fontWeight={500}>
          Add another account
        </Typography>
      </MenuItem>
      <MenuItem onClick={handleClose} sx={{ py: 1.5 }}>
        <ListItemIcon>
          <Settings fontSize="small" sx={{ color: pink[500] }} />
        </ListItemIcon>
        <Typography variant="body2" fontWeight={500}>
          Settings
        </Typography>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleClose();
          signOut();
        }}
        sx={{ py: 1.5, color: pink[600] }}
      >
        <ListItemIcon>
          <Logout fontSize="small" sx={{ color: pink[500] }} />
        </ListItemIcon>
        <Typography variant="body2" fontWeight={500}>
          Logout
        </Typography>
      </MenuItem>
    </GlassMenu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <GlassMenu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
      TransitionComponent={Fade}
    >
      <MenuItem onClick={handleMobileMenuClose} sx={{ py: 1.5 }}>
        <IconButton size="large" color="inherit" sx={{ color: pink[500] }}>
          <AnimatedBadge badgeContent={4} color="error">
            <MailIcon />
          </AnimatedBadge>
        </IconButton>
        <Typography ml={1} fontWeight={500}>Messages</Typography>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose} sx={{ py: 1.5 }}>
        <IconButton size="large" color="inherit" sx={{ color: pink[500] }}>
          <AnimatedBadge badgeContent={17} color="error">
            <NotificationsIcon />
          </AnimatedBadge>
        </IconButton>
        <Typography ml={1} fontWeight={500}>Notifications</Typography>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen} sx={{ py: 1.5 }}>
        <IconButton size="large" color="inherit" sx={{ color: pink[500] }}>
          <AccountCircle />
        </IconButton>
        <Typography ml={1} fontWeight={500}>Profile</Typography>
      </MenuItem>
    </GlassMenu>
  );

  return (
    <Slide direction="down" in timeout={600}>
      <Box sx={{ flexGrow: 1 }}>
        <GlassAppBar position="static">
          <Container>
            <Toolbar sx={{ py: 1 }}>
              {/* Logo Section */}
              <Fade in timeout={800}>
                <LogoBox onClick={handleRedirectHome}>
                  <AudiotrackIcon sx={{ fontSize: 28, color: '#ffffff' }} />
                  <Typography
                    variant="h5"
                    noWrap
                    sx={{
                      display: { xs: "none", sm: "block" },
                      fontWeight: 700,
                      background: 'linear-gradient(45deg, #ffffff 30%, #f8f8f8 90%)',
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      textShadow: `0 2px 4px ${alpha('#000000', 0.1)}`,
                    }}
                  >
                    Sound Cloud
                  </Typography>
                </LogoBox>
              </Fade>

              {/* Search Section */}
              <Fade in timeout={1000}>
                <EnhancedSearch>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    placeholder="Search for tracks, artists, playlists..."
                    inputProps={{ "aria-label": "search" }}
                    onKeyDown={(e: any) => {
                      if (e.key === "Enter") {
                        if (e.target.value) {
                          router.push(`/search?q=${e.target.value}`);
                        }
                      }
                    }}
                  />
                </EnhancedSearch>
              </Fade>

              <Box sx={{ flexGrow: 1 }} />

              {/* Navigation Links */}
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  gap: 2,
                  alignItems: "center",
                }}
              >
                {session ? (
                  <Fade in timeout={1200}>
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Tooltip title="My Playlists" arrow>
                        <NavLink>
                          <ActiveLink href="/playlist">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <QueueMusicIcon fontSize="small" />
                              Playlists
                            </Box>
                          </ActiveLink>
                        </NavLink>
                      </Tooltip>

                      <Tooltip title="Liked Tracks" arrow>
                        <NavLink>
                          <ActiveLink href="/like">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FavoriteIcon fontSize="small" />
                              Likes
                            </Box>
                          </ActiveLink>
                        </NavLink>
                      </Tooltip>

                      <Tooltip title="Upload Music" arrow>
                        <NavLink>
                          <ActiveLink href="/track/upload">
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <CloudUploadIcon fontSize="small" />
                              Upload
                            </Box>
                          </ActiveLink>
                        </NavLink>
                      </Tooltip>

                      <Tooltip title="Profile Menu" arrow>
                        <EnhancedAvatar
                          onClick={handleProfileMenuOpen}
                          src={fetchDefaultImages(session.user?.type || 'default')}
                        />
                      </Tooltip>
                    </Box>
                  </Fade>
                ) : (
                  <Fade in timeout={1200}>
                    <Tooltip title="Sign In" arrow>
                      <NavLink>
                        <Link href="/auth/signIn" style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <LoginIcon fontSize="small" />
                            Login
                          </Box>
                        </Link>
                      </NavLink>
                    </Tooltip>
                  </Fade>
                )}
              </Box>

              {/* Mobile Menu */}
              <Box sx={{ display: { xs: "flex", md: "none" } }}>
                <Tooltip title="More options" arrow>
                  <IconButton
                    size="large"
                    aria-label="show more"
                    aria-controls={mobileMenuId}
                    aria-haspopup="true"
                    onClick={handleMobileMenuOpen}
                    sx={{
                      color: '#ffffff',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha('#ffffff', 0.2),
                        transform: 'rotate(90deg)',
                      }
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Toolbar>
          </Container>
        </GlassAppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </Slide>
  );
}