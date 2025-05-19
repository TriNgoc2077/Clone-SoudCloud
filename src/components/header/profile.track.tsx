"use client";
import * as React from "react";
import { rgbToHex, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import { TrackContext } from "@/lib/track.wrapper";
import { convertSlugUrl } from "@/utils/api";
interface IProps {
	data: ITrackTop;
}
const ProfileTrack = (props: IProps) => {
	const { data } = props;
	const theme = useTheme();
	const { currentTrack, setCurrentTrack } = React.useContext(
		TrackContext
	) as ITrackContext;
	return (
		<Card
			sx={{
				display: "flex",
				justifyContent: "space-between",
				background: "rgb(246, 217, 255)",
				marginTop: 5,
			}}
		>
			<Box
				sx={{ display: "flex", flexDirection: "column", marginLeft: 3 }}
			>
				<CardContent sx={{ flex: "1 0 auto" }}>
					<Typography
						component="a"
						variant="h5"
						href={`/track/${convertSlugUrl(data.title)}-${
							data._id
						}.html?audio=${data.trackUrl}`}
						style={{
							textDecoration: "none",
							color: "rgb(52, 52, 52)",
						}}
					>
						{data.title}
					</Typography>
					<Typography
						variant="subtitle1"
						component="div"
						sx={{ color: "text.secondary" }}
					>
						{data.description}
					</Typography>
				</CardContent>
				<Box
					sx={{ display: "flex", alignItems: "center", pl: 1, pb: 1 }}
				>
					<IconButton aria-label="previous">
						{theme.direction === "rtl" ? (
							<SkipNextIcon />
						) : (
							<SkipPreviousIcon />
						)}
					</IconButton>
					<IconButton
						aria-label="play/pause"
						onClick={() => {
							if (data._id !== currentTrack._id) {
								currentTrack.isPlaying = false;
							}
							setCurrentTrack({
								...data,
								isPlaying: !currentTrack.isPlaying,
							});
						}}
					>
						{data._id === currentTrack._id &&
						currentTrack.isPlaying ? (
							<PauseIcon sx={{ height: 38, width: 38 }} />
						) : (
							<PlayArrowIcon sx={{ height: 38, width: 38 }} />
						)}
					</IconButton>
					<IconButton aria-label="next">
						{theme.direction === "rtl" ? (
							<SkipPreviousIcon />
						) : (
							<SkipNextIcon />
						)}
					</IconButton>
				</Box>
			</Box>
			<CardMedia
				component="img"
				sx={{ width: 151, marginRight: 4 }}
				image={`http://localhost:8000/images/${data.imgUrl}`}
				alt="Song image"
			/>
		</Card>
	);
};

export default ProfileTrack;
