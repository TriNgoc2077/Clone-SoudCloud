"use client";
import { useWavesurfer } from "@/utils/customHook";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { WaveSurferOptions } from "wavesurfer.js";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import "./wave.scss";

const WaveTrack = () => {
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const containerRef = useRef<HTMLDivElement>(null);
	const hoverRef = useRef<HTMLDivElement>(null);
	const [time, setTime] = useState<string>("0:00");
	const [duration, setDuration] = useState<string>("0:00");

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

	const onPlayClick = useCallback(() => {
		if (wavesurfer) {
			wavesurfer.isPlaying() ? wavesurfer.pause() : wavesurfer.play();
		}
	}, [wavesurfer]);

	// Current time & duration
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
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
				onClick={() => onPlayClick()}
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
								onClick={() => onPlayClick}
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
								Song...
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
								Singer
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
						<div className="comments">
							<img
								src={`http://localhost:8000/images/chill1.png`}
								alt=""
								style={{
									height: 20,
									width: 20,
									position: "relative",
									top: "100px",
									zIndex: 20,
								}}
							/>
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
						<img
							// src={
							// 	process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES +
							// 	currentTrack.imgUrl
							// }
							alt=""
							style={{
								width: 250,
								height: 250,
								overflow: "hidden",
								background: "white",
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WaveTrack;
