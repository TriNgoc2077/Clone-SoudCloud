"use client";
import { Box, Button, Container, Typography, useTheme } from "@mui/material";
import Link from "next/link";
import { Home as HomeIcon } from "@mui/icons-material";

export default function NotFound() {
	const theme = useTheme();

	return (
		<Container
			maxWidth="md"
			sx={{
				height: "100vh",
				display: "flex",
				flexDirection: "column",
				alignItems: "center",
				justifyContent: "center",
				textAlign: "center",
				py: 8,
			}}
		>
			<Box sx={{ position: "relative", mb: 4 }}>
				<Typography
					variant="h1"
					sx={{
						fontSize: { xs: "8rem", sm: "12rem" },
						fontWeight: 900,
						color:
							theme.palette.mode === "dark"
								? theme.palette.grey[800]
								: theme.palette.grey[100],
						letterSpacing: "0.1em",
						lineHeight: 1,
						position: "relative",
						zIndex: 0,
					}}
				>
					404
				</Typography>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						zIndex: 1,
						width: "100%",
						textAlign: "center",
					}}
				>
					<Typography
						variant="h4"
						sx={{
							fontWeight: 700,
							color: theme.palette.error.main,
							textTransform: "uppercase",
							mb: 2,
						}}
					>
						Page Not Found
					</Typography>
					<Typography
						variant="body1"
						sx={{
							color:
								theme.palette.mode === "dark"
									? theme.palette.grey[400]
									: theme.palette.grey[700],
							maxWidth: "500px",
							mx: "auto",
							mb: 4,
						}}
					>
						Oops! The page you're looking for doesn't exist or has
						been moved.
					</Typography>
					<Link href="/" passHref legacyBehavior>
						<Button
							variant="contained"
							startIcon={<HomeIcon />}
							sx={{
								backgroundColor: theme.palette.secondary.main,
								color: "#fff",
								px: 4,
								py: 1.5,
								borderRadius: "50px",
								"&:hover": {
									backgroundColor:
										theme.palette.secondary.dark,
									transform: "translateY(-2px)",
									boxShadow: `0 4px 12px ${theme.palette.secondary.light}`,
								},
								transition: "all 0.3s ease",
							}}
						>
							Return Home
						</Button>
					</Link>
				</Box>
			</Box>

			<Box sx={{ mt: 8 }}>
				<Typography
					variant="caption"
					sx={{
						color:
							theme.palette.mode === "dark"
								? theme.palette.grey[500]
								: theme.palette.grey[600],
						fontStyle: "italic",
					}}
				>
					"Not all who wander are lost, but you might be."
				</Typography>
			</Box>
		</Container>
	);
}
