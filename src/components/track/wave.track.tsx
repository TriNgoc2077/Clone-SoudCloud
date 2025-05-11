"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import React, {
	useEffect,
	useRef,
	useState,
	useMemo,
	useCallback,
} from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import "./wave.scss";
import { Box, Tooltip } from "@mui/material";
import { TrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImages } from "@/utils/api";
import CommentTrack from "./comment.track";

interface IProps {
	track: ITrackTop | null;
	comments: IComment[] | null;
}
const WaveTrack = (props: IProps) => {
	const { track } = props;
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const hoverRef = useRef<HTMLDivElement>(null);
	const [time, setTime] = useState<string>("0:00");
	const [duration, setDuration] = useState<string>("0:00");

	const { currentTrack, setCurrentTrack } = React.useContext(
		TrackContext
	) as ITrackContext;

	const searchParams = useSearchParams();
	const fileName = searchParams.get("audio");

	const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
		let gradient, progressGradient;
		if (typeof window !== "undefined") {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;
			// Define the waveform gradient
			gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.75);
			gradient.addColorStop(0, "rgb(145, 108, 167)"); // Top color
			gradient.addColorStop(
				(canvas.height * 0.7) / canvas.height,
				"rgb(161, 159, 176)"
			); // Top color
			gradient.addColorStop(
				(canvas.height * 0.7 + 1) / canvas.height,
				"#ffffff"
			); // White line
			gradient.addColorStop(
				(canvas.height * 0.7 + 2) / canvas.height,
				"#ffffff"
			); // White line
			gradient.addColorStop(
				(canvas.height * 0.7 + 3) / canvas.height,
				"#B1B1B1"
			); // Bottom color
			gradient.addColorStop(1, "#B1B1B1"); // Bottom color

			// Define the progress gradient
			progressGradient = ctx.createLinearGradient(
				0,
				0,
				0,
				canvas.height * 1.35
			);
			progressGradient.addColorStop(0, "rgb(85, 175, 139)"); // Top color
			progressGradient.addColorStop(
				(canvas.height * 0.7) / canvas.height,
				"rgb(184, 137, 94)"
			); // Top color
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 1) / canvas.height,
				"rgb(131, 103, 72)"
			); // White line
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 2) / canvas.height,
				"#ffffff"
			); // White line
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 3) / canvas.height,
				"#F6B094"
			); // Bottom color
			progressGradient.addColorStop(1, "#F6B094"); // Bottom color
		}

		return {
			waveColor: gradient,
			// progressColor: "rgba(0, 0, 100, 0.5)",
			progressColor: progressGradient,
			barWidth: 2,
			height: 100,
			url: `/api?audio=${fileName}`,
		};
	}, []);
	const wavesurfer = useWavesurfer(containerRef, optionsMemo);

	useEffect(() => {
		if (!wavesurfer) return;
		setIsPlaying(false);

		const hover = hoverRef.current!;
		const waveform = containerRef.current!;
		waveform.addEventListener(
			"pointermove",
			(e) => (hover.style.width = `${e.offsetX}px`)
		);
		const subscriptions = [
			wavesurfer.once("interaction", () => {
				wavesurfer.play();
			}),
			wavesurfer.on("play", () => setIsPlaying(true)),
			wavesurfer.on("pause", () => setIsPlaying(false)),
			wavesurfer.on("decode", (duration) => {
				setDuration(formatTime(duration));
			}),
			wavesurfer.on("timeupdate", (currentTime) => {
				setTime(formatTime(currentTime));
			}),
		];
		return () => {
			subscriptions.forEach((unsub) => unsub());
		};
	}, [wavesurfer]);

	useEffect(() => {
		if (currentTrack.isPlaying && wavesurfer) {
			wavesurfer.pause();
		}
	}, [currentTrack]);

	useEffect(() => {
		if (track?._id && !currentTrack._id) {
			setCurrentTrack({ ...track, isPlaying: false });
		}
	}, [track]);

	const onPlayClick = useCallback(() => {
		if (wavesurfer && track) {
			wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
			setCurrentTrack({ ...currentTrack, isPlaying: false });
		}
	}, [wavesurfer]);

	// Current time & duration
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};
	const comments = props.comments ?? [];

	const calcLeft = (moment: number) => {
		const duration = wavesurfer?.getDuration() ?? 100;
		const percent = (moment / duration) * 100;
		return `${percent}%`;
	};

	return (
		<div style={{ marginTop: 20 }}>
			<div
				style={{
					display: "flex",
					gap: 15,
					padding: 20,
					height: 400,
					background:
						"linear-gradient(135deg, rgb(162, 139, 175) 0%, rgb(16, 11, 19) 100%",
				}}
				onClick={() => {
					onPlayClick();
				}}
			>
				<div
					className="left"
					style={{
						width: "75%",
						height: "calc(100% - 10px)",
						display: "flex",
						flexDirection: "column",
						justifyContent: "space-between",
					}}
				>
					<div className="info" style={{ display: "flex" }}>
						<div>
							<div
								style={{
									borderRadius: "50%",
									background: "rgb(0, 0, 0)",
									height: "50px",
									width: "50px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
								}}
							>
								{isPlaying === true ? (
									<PauseIcon
										sx={{ fontSize: 30, color: "white" }}
									/>
								) : (
									<PlayArrowIcon
										sx={{ fontSize: 30, color: "white" }}
									/>
								)}
							</div>
						</div>
						<div style={{ marginLeft: 20 }}>
							<div
								style={{
									padding: "0 5px",
									background: "#333",
									fontSize: 30,
									width: "fit-content",
									color: "white",
								}}
							>
								{track?.title || "Song Name"}
							</div>
							<div
								style={{
									padding: "0 5px",
									marginTop: 10,
									background: "#333",
									fontSize: 20,
									width: "fit-content",
									color: "white",
								}}
							>
								{track?.description || "Singer"}
							</div>
						</div>
					</div>
					<div
						ref={containerRef}
						className="wave-form-container"
						onClick={(e) => {
							e.stopPropagation();
						}}
					>
						<div className="time">{time}</div>
						<div className="duration">{duration}</div>
						<div className="hover-wave" ref={hoverRef}></div>
						<div
							className="overlay"
							style={{
								position: "absolute",
								height: "30px",
								// width: "100%",
								bottom: 0,
								color: "rgb(162, 139, 175)",
								backdropFilter: "brightness(0.5)",
							}}
						></div>
						<div
							className="comments"
							style={{ position: "relative" }}
						>
							{comments.map((item) => {
								return (
									<Tooltip
										key={item._id}
										title={item.content}
										componentsProps={{
											tooltip: {
												sx: {
													width: 170,
													height: 70,
													fontSize: "18px",
													backgroundColor: "pink",
													color: "rgb(116, 106, 124)",
												},
											},
										}}
									>
										<img
											onPointerMove={(e) => {
												const hover = hoverRef.current!;
												hover.style.width = calcLeft(
													item.moment
												);
											}}
											src={fetchDefaultImages(
												item.user.type
											)}
											alt=""
											style={{
												height: 20,
												width: 20,
												position: "absolute",
												top: "78px",
												zIndex: 20,
												left: calcLeft(item.moment),
												borderRadius: "50%"
											}}
										/>
									</Tooltip>
								);
							})}
						</div>
					</div>
				</div>
				<div
					className="right"
					style={{
						width: "25%",
						padding: 15,
						display: "flex",
						alignItems: "center",
					}}
				>
					<div
						style={{ background: "#ccc", width: 250, height: 250 }}
					>
						<Box
							component="img"
							onClick={(e) => e.stopPropagation()}
							src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}/${track?.imgUrl}`}
							alt="Song image"
							sx={{
								width: "100%",
								maxWidth: 250,
								height: "auto",
								background: "0$",
							}}
						/>
					</div>
				</div>
			</div>
			<CommentTrack comments={comments} track={track!} wavesurfer={wavesurfer} />
		</div>
	);
};

export default WaveTrack;
