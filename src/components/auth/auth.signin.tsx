"use client";
import {
	Box,
	Button,
	Divider,
	Paper,
	Stack,
	TextField,
	Typography,
	InputAdornment,
	IconButton,
	Grow,
	Zoom,
	Avatar,
	useTheme,
	useMediaQuery,
	Alert,
	Snackbar,
} from "@mui/material";
import {
	GitHub,
	Facebook,
	Twitter,
	Google,
	Visibility,
	VisibilityOff,
	Email,
	Lock,
	AccountCircle,
	ArrowBack,
} from "@mui/icons-material";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@mui/lab";

const AuthSignIn = () => {
	const router = useRouter();
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const [isErrorUsername, setIsErrorUsername] = useState<boolean>(false);
	const [isErrorPassword, setIsErrorPassword] = useState<boolean>(false);

	const [errorUsername, setErrorUsername] = useState<string>("");
	const [errorPassword, setErrorPassword] = useState<string>("");

	const [openMessage, setOpenMessage] = useState<boolean>(false);
	const [resMessage, setResMessage] = useState<string>("");

	const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

	const handleClickShowPassword = () => setShowPassword(!showPassword);

	const handleSubmit = async () => {
		setIsLoadingBtn(true);
		setIsErrorUsername(false);
		setIsErrorPassword(false);
		setErrorUsername("");
		setErrorPassword("");

		if (!username) {
			setIsErrorUsername(true);
			setErrorUsername("Username is not empty !");
			setIsLoadingBtn(false);
			return;
		}

		if (!password) {
			setIsErrorPassword(true);
			setErrorPassword("Password is not empty !");
			setIsLoadingBtn(false);
			return;
		}

		const res = await signIn("credentials", {
			username: username,
			password: password,
			redirect: false,
		});
		if (!res?.error) {
			router.push("/");
		} else {
			setIsLoadingBtn(false);
			setOpenMessage(true);
			setTimeout(() => {
				setOpenMessage(false);
			}, 3500);
			setResMessage(res.error);
			// alert("error");
		}
	};
	return (
		<Box
			sx={{
				height: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				background:
					"linear-gradient(135deg, rgb(58, 31, 195) 0%, rgb(195, 80, 203) 100%)",
				p: isMobile ? 1 : 2,
			}}
		>
			<Grow in={true} timeout={800}>
				<Paper
					elevation={10}
					sx={{
						p: isMobile ? 3 : 4,
						width: "100%",
						maxWidth: 450,
						borderRadius: 4,
						backgroundColor: "rgba(255, 255, 255, 0.96)",
						boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
						transition: "transform 0.3s, box-shadow 0.3s",
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.5)",
						},
						mx: isMobile ? 1 : 0,
					}}
				>
					<Box textAlign="center" mb={isMobile ? 2 : 4}>
						<Zoom
							in={true}
							timeout={500}
							style={{ transitionDelay: "100ms" }}
						>
							<Avatar
								sx={{
									width: isMobile ? 60 : 80,
									height: isMobile ? 60 : 80,
									bgcolor: "rgb(117, 45, 206)",
									mb: isMobile ? 1 : 2,
									mx: "auto",
								}}
							>
								<AccountCircle
									sx={{ fontSize: isMobile ? 40 : 60 }}
								/>
							</Avatar>
						</Zoom>
						<Typography
							variant={isMobile ? "h5" : "h4"}
							component="h1"
							fontWeight="bold"
							color="rgb(117, 45, 206)"
							gutterBottom
						>
							Welcome Back
						</Typography>
						<Typography variant="body2" color="text.secondary">
							Sign in to access your account
						</Typography>
					</Box>

					<Stack spacing={isMobile ? 2 : 3}>
						<TextField
							fullWidth
							type="email"
							error={isErrorUsername}
							helperText={errorUsername}
							label="Username"
							variant="outlined"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							size={isMobile ? "small" : "medium"}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Email
											color="primary"
											sx={{ color: "rgb(117, 45, 206)" }}
										/>
									</InputAdornment>
								),
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: 2,
									transition: "box-shadow 0.3s",
									"&:hover": {
										boxShadow:
											"0 0 0 2px rgba(102, 126, 234, 0.2)",
									},
									"&.Mui-focused": {
										boxShadow:
											"0 0 0 2px rgba(102, 126, 234, 0.5)",
									},
								},
							}}
						/>

						<TextField
							fullWidth
							label="Password"
							error={isErrorPassword}
							helperText={errorPassword}
							variant="outlined"
							type={showPassword ? "text" : "password"}
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									handleSubmit();
								}
							}}
							size={isMobile ? "small" : "medium"}
							InputProps={{
								startAdornment: (
									<InputAdornment position="start">
										<Lock
											color="primary"
											sx={{ color: "rgb(117, 45, 206)" }}
										/>
									</InputAdornment>
								),
								endAdornment: (
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={handleClickShowPassword}
											edge="end"
											size={isMobile ? "small" : "medium"}
										>
											{showPassword ? (
												<Visibility />
											) : (
												<VisibilityOff />
											)}
										</IconButton>
									</InputAdornment>
								),
							}}
							sx={{
								"& .MuiOutlinedInput-root": {
									borderRadius: 2,
									transition: "box-shadow 0.3s",
									"&:hover": {
										boxShadow:
											"0 0 0 2px rgba(102, 126, 234, 0.2)",
									},
									"&.Mui-focused": {
										boxShadow:
											"0 0 0 2px rgba(102, 126, 234, 0.5)",
									},
								},
							}}
						/>
						<Box display={"flex"} justifyContent={"space-between"}>
							<Link
								href="/"
								style={{
									textDecoration: "none",
									color: "rgb(117, 45, 206)",
								}}
								// variant="text"
								// size="small"
								color="primary"
								// sx={{
								// 	color: "rgb(117, 45, 206)",
								// 	display: "inline",
								// }}
							>
								Back to Homepage
							</Link>
							<Link
								href="password/forgot"
								style={{
									textDecoration: "none",
									color: "rgb(117, 45, 206)",
								}}
								// variant="text"
								// size="small"
								color="primary"
								// sx={{
								// 	color: "rgb(117, 45, 206)",
								// 	display: "inline",
								// }}
							>
								Forgot Password?
							</Link>
						</Box>

						<LoadingButton
							fullWidth
							variant="contained"
							loading={isLoadingBtn}
							loadingIndicator={
								isLoadingBtn ? "Sign In....." : "Sign In"
							}
							size={isMobile ? "medium" : "large"}
							sx={{
								py: isMobile ? 1 : 1.5,
								borderRadius: 2,
								fontWeight: "bold",
								fontSize: isMobile ? "0.9rem" : "1rem",
								textTransform: "none",
								boxShadow:
									"0 4px 14px 0 rgba(67, 60, 194, 0.39)",
								transition: "transform 0.3s, box-shadow 0.3s",
								"&:hover": {
									transform: "translateY(-1px)",
									boxShadow:
										"0 6px 20px 0 rgba(102, 49, 208, 0.5)",
								},
								background:
									"linear-gradient(135deg, rgb(58, 31, 195) 0%, rgb(195, 80, 203) 100%)",
							}}
							onClick={handleSubmit}
						>
							Sign In
						</LoadingButton>

						<Divider sx={{ my: isMobile ? 1 : 2 }}>
							<Typography variant="body2" color="text.secondary">
								Or using
							</Typography>
						</Divider>

						<Box
							display="flex"
							justifyContent="center"
							gap={isMobile ? 2 : 3}
							sx={{ mt: isMobile ? 1 : 2 }}
						>
							{[
								{
									icon: (
										<GitHub
											fontSize={
												isMobile ? "medium" : "large"
											}
											onClick={() => {
												signIn("github");
											}}
										/>
									),
									color: "#333",
								},
								{
									icon: (
										<Google
											fontSize={
												isMobile ? "medium" : "large"
											}
											onClick={() => {
												signIn("google");
											}}
										/>
									),
									color: "#DB4437",
								},
								{
									icon: (
										<Facebook
											fontSize={
												isMobile ? "medium" : "large"
											}
										/>
									),
									color: "#4267B2",
								},
								{
									icon: (
										<Twitter
											fontSize={
												isMobile ? "medium" : "large"
											}
										/>
									),
									color: "#1DA1F2",
								},
							].map((social, index) => (
								<IconButton
									key={index}
									size={isMobile ? "small" : "medium"}
									sx={{
										backgroundColor: `${social.color}20`,
										transition:
											"transform 0.3s, background-color 0.3s",
										"&:hover": {
											backgroundColor: `${social.color}30`,
											transform: "scale(1.1)",
										},
									}}
								>
									{social.icon}
								</IconButton>
							))}
						</Box>

						<Box textAlign="center" mt={isMobile ? 2 : 3}>
							<Typography variant="body2">
								Don't have an account?{" "}
								<Button
									variant="text"
									size="small"
									color="primary"
									sx={{ color: "rgb(117, 45, 206)" }}
								>
									Sign Up
								</Button>
							</Typography>
						</Box>
					</Stack>
				</Paper>
			</Grow>
			<Snackbar
				open={openMessage}
				// autoHideDuration={4000}
				// onClose={handleClose}
				message="Note archived"
				// action={action}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert severity="error" onClose={() => setOpenMessage(false)}>
					{resMessage}
				</Alert>
			</Snackbar>
		</Box>
	);
};

export default AuthSignIn;
