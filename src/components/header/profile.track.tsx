"use client";
import { rgbToHex, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { convertSlugUrl } from "@/utils/api";
import { TrackContext } from "@/lib/track.wrapper";
import { useContext, useState } from "react";

interface IProps {
	track: IShareTrack;
	tracks: IShareTrack[];
}

const ProfileTrack = (props: IProps) => {
	const { track, tracks } = props;
	const theme = useTheme();
	const { currentTrack, setCurrentTrack, setPlaylist, nextTrack, prevTrack } = useContext(
		TrackContext
	) as ITrackContext;

	const [isHovered, setIsHovered] = useState(false);
	const isCurrentTrack = track._id === currentTrack._id;
	const isPlaying = isCurrentTrack && currentTrack.isPlaying;

	return (
		<Card
			sx={{
				display: "flex",
				flexDirection: { xs: "column", sm: "row" }, // Stack vertically on mobile
				background: "linear-gradient(135deg, #ffeef8 0%, #fff0f8 50%, #ffe8f5 100%)",
				backdropFilter: "blur(10px)",
				border: "1px solid rgba(255, 107, 157, 0.1)",
				borderRadius: "20px",
				marginTop: 3,
				marginBottom: 2,
				overflow: "hidden",
				position: "relative",
				transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
				cursor: "pointer",
				"&:hover": {
					transform: "translateY(-4px)",
					boxShadow: "0 15px 35px rgba(255, 107, 157, 0.15)",
					border: "1px solid rgba(255, 107, 157, 0.2)",
				},
				...(isPlaying && {
					background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)",
					color: "white",
					boxShadow: "0 10px 30px rgba(255, 107, 157, 0.3)",
					"& .MuiTypography-root": {
						color: "white",
					},
					"& .MuiIconButton-root": {
						color: "white",
						"&:hover": {
							backgroundColor: "rgba(255, 255, 255, 0.1)",
						},
					},
				}),
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Animated Background Pattern */}
			<Box
				sx={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					opacity: isPlaying ? 0.1 : 0.03,
					background: `
						radial-gradient(circle at 20% 50%, #ff6b9d 0%, transparent 50%),
						radial-gradient(circle at 80% 20%, #ff8a9b 0%, transparent 50%),
						radial-gradient(circle at 40% 80%, #ffb3c6 0%, transparent 50%)
					`,
					transition: "opacity 0.3s ease",
				}}
			/>

			{/* Album Art - Show first on mobile */}
			<Box
				sx={{
					position: "relative",
					width: { 
						xs: "100%", // Full width on mobile
						sm: 180 
					},
					height: { 
						xs: 200, // Fixed height on mobile
						sm: 180 
					},
					margin: { 
						xs: 0, // No margin on mobile
						sm: 2 
					},
					borderRadius: { 
						xs: 0, // No border radius on mobile for seamless look
						sm: "16px" 
					},
					overflow: "hidden",
					flexShrink: 0,
					transition: "all 0.4s ease",
					order: { xs: -1, sm: 1 }, // Show first on mobile, last on desktop
					"&:hover": {
						transform: { 
							xs: "none", // Disable transform on mobile to prevent layout issues
							sm: "scale(1.05)" 
						},
					},
				}}
			>
				<CardMedia
					component="img"
					sx={{
						width: "100%",
						height: "100%",
						objectFit: "cover",
						transition: "all 0.4s ease",
					}}
					image={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
					alt={track.title}
				/>

				{/* Overlay for playing state */}
				{isPlaying && (
					<Box
						sx={{
							position: "absolute",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							background: "linear-gradient(45deg, rgba(255, 107, 157, 0.3), rgba(255, 138, 155, 0.3))",
							backdropFilter: "blur(2px)",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Box
							sx={{
								width: 60,
								height: 60,
								borderRadius: "50%",
								background: "rgba(255, 255, 255, 0.9)",
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
								animation: "musicPulse 2s infinite",
							}}
						>
							<Box
								sx={{
									width: 4,
									height: 20,
									background: "#ff6b9d",
									margin: "0 2px",
									borderRadius: "2px",
									animation: "musicBar1 1s infinite",
								}}
							/>
							<Box
								sx={{
									width: 4,
									height: 16,
									background: "#ff8a9b",
									margin: "0 2px",
									borderRadius: "2px",
									animation: "musicBar2 1s infinite 0.2s",
								}}
							/>
							<Box
								sx={{
									width: 4,
									height: 24,
									background: "#ff6b9d",
									margin: "0 2px",
									borderRadius: "2px",
									animation: "musicBar3 1s infinite 0.4s",
								}}
							/>
						</Box>
					</Box>
				)}
			</Box>

			{/* Content Section */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flex: 1,
					position: "relative",
					zIndex: 2,
					minWidth: 0, // Prevent flex item from overflowing
				}}
			>
				<CardContent sx={{ 
					flex: "1 0 auto", 
					padding: { 
						xs: "16px", // Reduced padding on mobile
						sm: "24px" 
					} 
				}}>
					{/* Track Status Chip */}
					{isPlaying && (
						<Chip
							label="Now Playing"
							size="small"
							sx={{
								mb: 2,
								background: "rgba(255, 255, 255, 0.2)",
								color: "white",
								fontSize: "0.75rem",
								fontWeight: 600,
								backdropFilter: "blur(10px)",
								animation: "pulse 2s infinite",
							}}
						/>
					)}

					{/* Track Title */}
					<Typography
						component="a"
						variant="h5"
						href={`/track/${convertSlugUrl(track.title)}-${
							track._id
						}.html?audio=${track.trackUrl}`}
						sx={{
							textDecoration: "none",
							color: isPlaying ? "white" : "#2d3748",
							fontWeight: 700,
							fontSize: { 
								xs: "1.25rem", // Smaller on mobile
								sm: "1.5rem" 
							},
							lineHeight: 1.3,
							marginBottom: 1,
							display: "block",
							transition: "all 0.3s ease",
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: { xs: "nowrap", sm: "normal" }, // Prevent wrapping on mobile
							"&:hover": {
								color: isPlaying ? "#ffe8f5" : "#ff6b9d",
								textShadow: isPlaying ? "0 2px 10px rgba(255, 255, 255, 0.3)" : "none",
							},
						}}
					>
						{track.title}
					</Typography>

					{/* Track Description */}
					<Typography
						variant="subtitle1"
						component="div"
						sx={{
							color: isPlaying ? "rgba(255, 255, 255, 0.9)" : "#718096",
							fontSize: { 
								xs: "0.875rem", // Smaller on mobile
								sm: "1rem" 
							},
							lineHeight: 1.5,
							marginBottom: 2,
							overflow: "hidden",
							textOverflow: "ellipsis",
							display: "-webkit-box",
							WebkitLineClamp: { xs: 2, sm: 3 }, // Limit lines on mobile
							WebkitBoxOrient: "vertical",
						}}
					>
						{track.description}
					</Typography>

					{/* Action Buttons Row */}
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
							marginTop: "auto",
							flexWrap: { xs: "wrap", sm: "nowrap" }, // Allow wrapping on mobile
							gap: { xs: 1, sm: 0 },
						}}
					>
						{/* Playback Controls */}
						<Box sx={{ 
							display: "flex", 
							alignItems: "center",
							width: { xs: "100%", sm: "auto" }, // Full width on mobile
							justifyContent: { xs: "center", sm: "flex-start" },
						}}>
							<IconButton
								aria-label="previous"
								sx={{
									color: isPlaying ? "white" : "#ff6b9d",
									transition: "all 0.3s ease",
									padding: { xs: "6px", sm: "8px" }, // Smaller padding on mobile
									"&:hover": {
										backgroundColor: isPlaying 
											? "rgba(255, 255, 255, 0.1)" 
											: "rgba(255, 107, 157, 0.1)",
										transform: "scale(1.1)",
									},
								}}
							>
								{theme.direction === "rtl" ? (
									<SkipNextIcon onClick={() => {nextTrack()}}/>
								) : (
									<SkipPreviousIcon onClick={() => {prevTrack()}} />
								)}
							</IconButton>

							{/* Main Play/Pause Button */}
							<IconButton
								aria-label="play/pause"
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
									  setCurrentTrack({ ...track, isPlaying: true });
								}}
								sx={{
									width: { xs: 50, sm: 60 }, // Smaller on mobile
									height: { xs: 50, sm: 60 },
									margin: "0 8px",
									background: isPlaying 
										? "rgba(255, 255, 255, 0.2)" 
										: "linear-gradient(135deg, #ff6b9d, #ff8a9b)",
									color: isPlaying ? "white" : "white",
									backdropFilter: "blur(10px)",
									transition: "all 0.3s ease",
									"&:hover": {
										transform: "scale(1.1)",
										background: isPlaying 
											? "rgba(255, 255, 255, 0.3)" 
											: "linear-gradient(135deg, #ff8a9b, #ff6b9d)",
										boxShadow: "0 8px 25px rgba(255, 107, 157, 0.4)",
									},
								}}
							>
								{isPlaying ? (
									<PauseIcon sx={{ 
										height: { xs: 24, sm: 32 }, 
										width: { xs: 24, sm: 32 } 
									}} />
								) : (
									<PlayArrowIcon sx={{ 
										height: { xs: 24, sm: 32 }, 
										width: { xs: 24, sm: 32 }, 
										marginLeft: "2px" 
									}} />
								)}
							</IconButton>

							<IconButton
								aria-label="next"
								sx={{
									color: isPlaying ? "white" : "#ff6b9d",
									transition: "all 0.3s ease",
									padding: { xs: "6px", sm: "8px" },
									"&:hover": {
										backgroundColor: isPlaying 
											? "rgba(255, 255, 255, 0.1)" 
											: "rgba(255, 107, 157, 0.1)",
										transform: "scale(1.1)",
									},
								}}
							>
								{theme.direction === "rtl" ? (
									<SkipPreviousIcon onClick={() => {prevTrack()}} />
								) : (
									<SkipNextIcon onClick={() => {nextTrack()}}/>
								)}
							</IconButton>
						</Box>

						{/* Secondary Actions */}
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								opacity: { 
									xs: 1, // Always visible on mobile
									sm: isHovered || isPlaying ? 1 : 0 
								},
								transition: "opacity 0.3s ease",
								width: { xs: "100%", sm: "auto" },
								justifyContent: { xs: "center", sm: "flex-end" },
								marginTop: { xs: 1, sm: 0 },
							}}
						>
							<IconButton
								size="small"
								sx={{
									color: isPlaying ? "white" : "#ff6b9d",
									marginLeft: 1,
									"&:hover": {
										backgroundColor: isPlaying 
											? "rgba(255, 255, 255, 0.1)" 
											: "rgba(255, 107, 157, 0.1)",
									},
								}}
							>
								<FavoriteIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								sx={{
									color: isPlaying ? "white" : "#ff6b9d",
									marginLeft: 1,
									"&:hover": {
										backgroundColor: isPlaying 
											? "rgba(255, 255, 255, 0.1)" 
											: "rgba(255, 107, 157, 0.1)",
									},
								}}
							>
								<ShareIcon fontSize="small" />
							</IconButton>
							<IconButton
								size="small"
								sx={{
									color: isPlaying ? "white" : "#ff6b9d",
									marginLeft: 1,
									"&:hover": {
										backgroundColor: isPlaying 
											? "rgba(255, 255, 255, 0.1)" 
											: "rgba(255, 107, 157, 0.1)",
									},
								}}
							>
								<MoreVertIcon fontSize="small" />
							</IconButton>
						</Box>
					</Box>
				</CardContent>
			</Box>

			{/* Custom Styles */}
			<style jsx global>{`
				@keyframes pulse {
					0%, 100% { opacity: 1; }
					50% { opacity: 0.7; }
				}

				@keyframes musicPulse {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.1); }
				}

				@keyframes musicBar1 {
					0%, 100% { height: 20px; }
					50% { height: 8px; }
				}

				@keyframes musicBar2 {
					0%, 100% { height: 16px; }
					50% { height: 24px; }
				}

				@keyframes musicBar3 {
					0%, 100% { height: 24px; }
					50% { height: 12px; }
				}
			`}</style>
		</Card>
	);
};

export default ProfileTrack;