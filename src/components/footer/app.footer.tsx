"use client";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Box, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./style.css";
import { useContext, useRef } from "react";
import { TrackContext } from "@/lib/track.wrapper";
const Footer = () => {
	const playerRef = useRef(null);
	const hasMounted = useHasMounted();
	if (!hasMounted) return <></>;
	console.log(">> check backend", process.env.NEXT_PUBLIC_BACKEND_URL);
	const { currentTrack, setCurrentTrack } = useContext(
		TrackContext
	) as ITrackContext;
	console.log(currentTrack);
	//@ts-ignore
	if (currentTrack.isPlaying) {
		//@ts-ignore
		playerRef?.current?.audio.current.play();
	} else {
		//@ts-ignore
		playerRef?.current?.audio.current.pause();
	}
	return (
		<div style={{ marginTop: 75 }}>
			<AppBar
				position="fixed"
				color="primary"
				sx={{
					top: "auto",
					bottom: 0,
					backgroundColor: "#6a284c",
				}}
			>
				<Container
					sx={{
						display: "flex",
						gap: "10px",
						".rhap_main": {
							gap: "50px",
						},
					}}
				>
					<AudioPlayer
						ref={playerRef}
						layout="horizontal-reverse"
						src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
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
							backgroundColor: "#6a284c",
							boxShadow: "unset",
						}}
					/>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "start",
							justifyContent: "center",
							minWidth: 100,
						}}
					>
						<Box style={{ color: "white" }}>
							{currentTrack.title || ""}
						</Box>
						<div style={{ color: "white" }}>
							{currentTrack.description || ""}
						</div>
					</div>
				</Container>
			</AppBar>
		</div>
	);
};

export default Footer;
