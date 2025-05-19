"use client";

import { useEffect } from "react";
import {
	Box,
	Container,
	Typography,
	Paper,
	Button,
	Avatar,
	styled,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Custom styled components
const ErrorContainer = styled(Box)(({ theme }) => ({
	minHeight: "100vh",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	backgroundColor: "#fce7f3", // Pink background
	padding: theme.spacing(3),
}));

const ErrorCard = styled(Paper)(({ theme }) => ({
	padding: theme.spacing(4),
	borderRadius: theme.shape.borderRadius,
	maxWidth: 500,
	width: "100%",
	textAlign: "center",
	position: "relative",
	overflow: "hidden",
	"&::before": {
		content: '""',
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: "8px",
		backgroundColor: "#ec4899", // Pink border top
	},
}));

const ErrorAvatar = styled(Avatar)(({ theme }) => ({
	backgroundColor: "#fdf2f8",
	color: "#ec4899",
	width: 80,
	height: 80,
	margin: "0 auto",
	marginBottom: theme.spacing(3),
}));

const ErrorDetails = styled(Box)(({ theme }) => ({
	backgroundColor: "#fdf2f8",
	borderRadius: theme.shape.borderRadius,
	padding: theme.spacing(2),
	marginTop: theme.spacing(3),
	marginBottom: theme.spacing(3),
	textAlign: "left",
	overflow: "auto",
	maxHeight: 150,
	fontSize: "0.875rem",
	color: "#be185d",
	fontFamily: "monospace",
}));

const RetryButton = styled(Button)(({ theme }) => ({
	backgroundColor: "#ec4899",
	color: "white",
	"&:hover": {
		backgroundColor: "#db2777",
	},
	padding: theme.spacing(1, 3),
}));

export default function Error({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		// Log the error to an error reporting service
		console.error(error);
	}, [error]);

	return (
		<ErrorContainer>
			<Container maxWidth="sm">
				<ErrorCard elevation={4}>
					<ErrorAvatar>
						<ErrorOutlineIcon fontSize="large" />
					</ErrorAvatar>

					<Typography
						variant="h5"
						component="h2"
						gutterBottom
						fontWeight="bold"
					>
						Oops! Something went wrong
					</Typography>

					<Typography
						variant="body1"
						color="text.secondary"
						paragraph
					>
						We encountered an unexpected error while processing your
						request. Please try again or contact support if the
						problem persists.
					</Typography>

					<ErrorDetails>
						<Typography variant="body2">
							{error.message || "Unknown error occurred"}
						</Typography>
						{error.digest && (
							<Typography
								variant="caption"
								color="#db2777"
								sx={{ display: "block", mt: 1 }}
							>
								Reference: {error.digest}
							</Typography>
						)}
					</ErrorDetails>

					<RetryButton
						variant="contained"
						startIcon={<RefreshIcon />}
						onClick={() => reset()}
						fullWidth
						size="large"
					>
						Try Again
					</RetryButton>
				</ErrorCard>
			</Container>
		</ErrorContainer>
	);
}
