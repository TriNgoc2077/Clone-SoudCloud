"use client";
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./style.css";
const Footer = () => {
	const hasMounted = useHasMounted();
	if (!hasMounted) return <></>;
	console.log(">> check backend", process.env.NEXT_PUBLIC_BACKEND_URL);
	return (
		<AppBar
			position="fixed"
			color="primary"
			sx={{ top: "auto", bottom: 0, backgroundColor: "#6a284c" }}
		>
			<Container sx={{ display: "flex", gap: "10px" }}>
				<AudioPlayer
					src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
					onPlay={(e) => console.log("onPlay")}
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
					<div style={{ color: "white" }}>Singer</div>
					<div style={{ color: "white" }}>Song</div>
				</div>
			</Container>
		</AppBar>
	);
};

export default Footer;
