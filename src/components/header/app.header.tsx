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
import { Divider, ListItemIcon } from "@mui/material";
import { Logout, PersonAdd, Settings } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { fetchDefaultImages } from "@/utils/api";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
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
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
		[theme.breakpoints.up("md")]: {
			width: "400px",
		},
	},
}));

export default function AppHeader() {
	const { data: session } = useSession(); //session := data in useSession

	const router = useRouter();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
		React.useState<null | HTMLElement>(null);

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
		<Menu
			anchorEl={anchorEl}
			anchorOrigin={{
				vertical: "top",
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
		>
			{/* <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem> */}
			<MenuItem onClick={handleClose}>
				<Avatar />
				<Link
					href={`/profile/${session?.user._id}`}
					style={{
						color: "unset",
						textDecoration: "none",
						marginLeft: "15px",
					}}
				>
					My account
				</Link>
			</MenuItem>
			<Divider />
			<MenuItem onClick={handleClose}>
				<ListItemIcon>
					<PersonAdd fontSize="small" />
				</ListItemIcon>
				Add another account
			</MenuItem>
			<MenuItem onClick={handleClose}>
				<ListItemIcon>
					<Settings fontSize="small" />
				</ListItemIcon>
				Settings
			</MenuItem>
			<MenuItem
				onClick={() => {
					handleClose();
					signOut();
				}}
			>
				<ListItemIcon>
					<Logout fontSize="small" />
				</ListItemIcon>
				Logout
			</MenuItem>
		</Menu>
	);

	const mobileMenuId = "primary-search-account-menu-mobile";
	const renderMobileMenu = (
		<Menu
			anchorEl={mobileMoreAnchorEl}
			anchorOrigin={{
				vertical: "top",
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
		>
			<MenuItem>
				<IconButton
					size="large"
					aria-label="show 4 new mails"
					color="inherit"
				>
					<Badge badgeContent={4} color="error">
						<MailIcon />
					</Badge>
				</IconButton>
				<p>Messages</p>
			</MenuItem>
			<MenuItem>
				<IconButton
					size="large"
					aria-label="show 17 new notifications"
					color="inherit"
				>
					<Badge badgeContent={17} color="error">
						<NotificationsIcon />
					</Badge>
				</IconButton>
				<p>Notifications</p>
			</MenuItem>
			<MenuItem onClick={handleProfileMenuOpen}>
				<IconButton
					size="large"
					aria-label="account of current user"
					aria-controls="primary-search-account-menu"
					aria-haspopup="true"
					color="inherit"
				>
					<AccountCircle />
				</IconButton>
				<p>Profile</p>
			</MenuItem>
		</Menu>
	);

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar
				position="static"
				sx={{
					backgroundColor: "#6a284c",
				}}
			>
				<Container>
					<Toolbar>
						<Typography
							variant="h6"
							noWrap
							component="div"
							sx={{
								display: { xs: "none", sm: "block" },
								cursor: "pointer",
							}}
							onClick={() => handleRedirectHome()}
						>
							Sound Cloud
						</Typography>
						<Search>
							<SearchIconWrapper>
								<SearchIcon />
							</SearchIconWrapper>
							<StyledInputBase
								placeholder="Search…"
								inputProps={{ "aria-label": "search" }}
							/>
						</Search>
						<Box sx={{ flexGrow: 1 }} />
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								gap: "20px",
								justifyContent: "center",
								alignItems: "center",
								cursor: "pointer",
								"> a": {
									color: "unset",
									textDecoration: "none",
								},
							}}
						>
							{session ? (
								<>
									<Link href={"/playlist"}>Playlists</Link>
									<Link href={"/like"}>Likes</Link>
									<Link href={"/track/upload"}>Upload</Link>
									<Avatar
										onClick={handleProfileMenuOpen}
										src={fetchDefaultImages(
											session.user.type
										)}
									></Avatar>
								</>
							) : (
								<>
									<Link href="auth/signIn">Login</Link>
								</>
							)}
						</Box>
						<Box sx={{ display: { xs: "flex", md: "none" } }}>
							<IconButton
								size="large"
								aria-label="show more"
								aria-controls={mobileMenuId}
								aria-haspopup="true"
								onClick={handleMobileMenuOpen}
								color="inherit"
							>
								<MoreIcon />
							</IconButton>
						</Box>
					</Toolbar>
				</Container>
			</AppBar>
			{renderMobileMenu}
			{renderMenu}
		</Box>
	);
}
