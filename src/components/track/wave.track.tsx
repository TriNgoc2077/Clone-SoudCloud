"use client";
import { useHasMounted, useWavesurfer } from "@/utils/customHook";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Box, Chip, Tooltip } from "@mui/material";
import { TrackContext } from "@/lib/track.wrapper";
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import CommentTrack from "./comment.track";
import LikeTrack from "./like.track";
import Image from "next/image";

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
	const isIncrease = useRef(false);
	const router = useRouter();

	const { currentTrack, setCurrentTrack, currentTime, setCurrentTime, nextTrack } = React.useContext(
		TrackContext
	) as ITrackContext;

	const searchParams = useSearchParams();
	const fileName = searchParams.get("audio");

	const optionsMemo = useMemo((): Omit<WaveSurferOptions, "container"> => {
		let gradient, progressGradient;
		if (typeof window !== "undefined") {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d")!;
			// Define the waveform gradient - Pink theme
			gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.75);
			gradient.addColorStop(0, "rgba(255, 182, 193, 0.8)"); // Light pink top
			gradient.addColorStop(
				(canvas.height * 0.7) / canvas.height,
				"rgba(255, 105, 180, 0.4)"
			); // Hot pink middle
			gradient.addColorStop(
				(canvas.height * 0.7 + 1) / canvas.height,
				"rgba(255, 255, 255, 0.9)"
			); // White line
			gradient.addColorStop(
				(canvas.height * 0.7 + 2) / canvas.height,
				"rgba(255, 255, 255, 0.9)"
			); // White line
			gradient.addColorStop(
				(canvas.height * 0.7 + 3) / canvas.height,
				"rgba(255, 182, 193, 0.6)"
			); // Pink bottom
			gradient.addColorStop(1, "rgba(255, 182, 193, 0.6)"); // Pink bottom

			// Define the progress gradient - Bright pink theme
			progressGradient = ctx.createLinearGradient(
				0,
				0,
				0,
				canvas.height * 1.35
			);
			progressGradient.addColorStop(0, "rgba(255, 20, 147, 0.9)"); // Deep pink top
			progressGradient.addColorStop(
				(canvas.height * 0.7) / canvas.height,
				"rgba(255, 105, 180, 0.8)"
			); // Hot pink middle
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 1) / canvas.height,
				"rgba(255, 255, 255, 1)"
			); // White line
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 2) / canvas.height,
				"rgba(255, 255, 255, 1)"
			); // White line
			progressGradient.addColorStop(
				(canvas.height * 0.7 + 3) / canvas.height,
				"rgba(255, 105, 180, 0.7)"
			); // Hot pink bottom
			progressGradient.addColorStop(1, "rgba(255, 105, 180, 0.7)"); // Hot pink bottom
		}

		return {
			waveColor: gradient,
			progressColor: progressGradient,
			barWidth: 2,
			height: 100,
			url: `/api?audio=${fileName}`,
		};
	}, []);
	const wavesurfer = useWavesurfer(containerRef, optionsMemo);

	useEffect(() => {
		if (track?._id && currentTrack._id && track._id !== currentTrack._id) {
			return;
		}
		if (track?._id && !currentTrack._id) {
			setCurrentTrack({ ...track, isPlaying: false });
		}
	}, [track]);

	const calcLeft = (moment: number) => {
		const duration = wavesurfer?.getDuration() ?? 100;
		const percent = (moment / duration) * 100;
		return `${percent}%`;
	};

	const handleFirstPlay = async () => {
		if (!isIncrease.current) {
			const res = await sendRequest<IBackendRes<any>>({
				url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/increase-view`,
				method: "POST",
				body: {
					trackId: track?._id,
				},
			});
			isIncrease.current = true;
			
			await sendRequest<IBackendRes<any>>({
				url: `/api/revalidate`,
				method: "POST",
				queryParams: {
					tag: "track-by-id",
					secret: "justARandomString"
				}
			});

			router.refresh();
		}
	};

	// Current time & duration
	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

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
			wavesurfer.on("play", () => {
				setIsPlaying(true);
				//@ts-ignore
				setCurrentTrack((prev: any) => ({
					...prev,
					isPlaying: true,
				}));
				if (track?._id && currentTrack._id && track?._id !== currentTrack._id) {
					setCurrentTrack({ ...track, isPlaying: true });
				}
			}),
			wavesurfer.on("pause", () => {
				setIsPlaying(false);
				//@ts-ignore
				setCurrentTrack((prev: any) => ({
					...prev,
					isPlaying: false,
				}));
			}),
			wavesurfer.on("decode", (duration) => {
				setDuration(formatTime(duration));
			}),
			wavesurfer.on("timeupdate", (time) => {
				setTime(formatTime(time));
				setCurrentTime(time);
			}),
			// wavesurfer.on("finish", () => {
			// 	if (currentTrack._id === track?._id) {
			// 	}
			// 	nextTrack();
			// })
		];
		return () => {
			subscriptions.forEach((unsub) => unsub());
		};
	}, [wavesurfer]);

	useEffect(() => {
		if (wavesurfer && currentTrack._id && currentTrack._id !== track?._id) {
			return;
		}
		if (wavesurfer) {
			if (Math.abs(wavesurfer.getCurrentTime() - currentTime) > 0.1) {
				wavesurfer.seekTo(currentTime / wavesurfer.getDuration());
				wavesurfer.play();
			}
		}
	}, [currentTime]);

	useEffect(() => {
		if (wavesurfer && currentTrack._id && currentTrack._id !== track?._id) {
			return;
		}
		if (currentTrack.isPlaying && wavesurfer) {
			wavesurfer.play();
		} 
		if (!currentTrack.isPlaying && wavesurfer) {
			wavesurfer.pause();
		}
	}, [currentTrack]);

	const onPlayClick = useCallback(() => {
		if (!wavesurfer || !track) return;

		const isNowPlaying = wavesurfer.isPlaying();
	
		if (isNowPlaying) {
			wavesurfer.pause();
		} else {
			wavesurfer.play();
		}
	}, [wavesurfer]);

	const comments = props.comments ?? [];
	return (
		<div className="wave-track-container" style={{ marginTop: 20 }}>
			<div
				className="wave-track-main"
				style={{
					display: "flex",
					borderRadius: "12px",
					gap: 15,
					padding: 20,
					minHeight: 350,
					background:
						"linear-gradient(135deg, rgb(162, 139, 175)  0%, #FF69B4 100%)",
					flexDirection: "column",
					boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
				}}
				onClick={() => {
					onPlayClick();
					handleFirstPlay();
				}}
			>
				{/* Desktop Layout */}
				<div 
					className="desktop-layout"
					style={{
						display: "flex",
						gap: 20,
						height: "100%",
					}}
				>
					<div
						className="left-section"
						style={{
							flex: 1,
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							minWidth: 0,
						}}
					>
						{/* Track Info */}
						<div className="track-info" style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
							<div
								className="play-button"
								style={{
									borderRadius: "50%",
									background: "rgba(0, 0, 0, 0.8)",
									height: "60px",
									width: "60px",
									display: "flex",
									alignItems: "center",
									justifyContent: "center",
									cursor: "pointer",
									backdropFilter: "blur(10px)",
									border: "2px solid rgba(233, 223, 255, 0.3)",
									transition: "all 0.3s ease",
								}}
							>
								{isPlaying === true ? (
									<PauseIcon
										sx={{
											fontSize: 32,
											color: "rgb(233, 223, 255)",
										}}
									/>
								) : (
									<PlayArrowIcon
										sx={{
											fontSize: 32,
											color: "rgb(233, 223, 255)",
										}}
									/>
								)}
							</div>
							<div style={{ marginLeft: 20, flex: 1, minWidth: 0 }}>
								<div
									className="track-title"
									style={{
										fontSize: "clamp(20px, 4vw, 32px)",
										fontWeight: "700",
										color: "rgb(233, 223, 255)",
										marginBottom: 8,
										textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
										wordBreak: "break-word",
									}}
								>
									{track?.title || "Song Name"}
								</div>
								<div
									className="track-description"
									style={{
										fontSize: "clamp(16px, 3vw, 20px)",
										color: "rgba(233, 223, 255, 0.8)",
										fontWeight: "400",
										wordBreak: "break-word",
									}}
								>
									{track?.description || "Singer"}
								</div>
							</div>
						</div>

						{/* Waveform */}
						<div
							ref={containerRef}
							className="wave-form-container"
							style={{
								position: "relative",
								background: "rgba(0, 0, 0, 0.2)",
								borderRadius: "8px",
								padding: "10px",
								backdropFilter: "blur(5px)",
							}}
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<div className="time" style={{ 
								position: "absolute", 
								top: "5px", 
								left: "10px", 
								color: "rgb(233, 223, 255)",
								fontSize: "14px",
								fontWeight: "600",
								zIndex: 10
							}}>{time}</div>
							<div className="duration" style={{ 
								position: "absolute", 
								top: "5px", 
								right: "10px", 
								color: "rgb(233, 223, 255)",
								fontSize: "14px",
								fontWeight: "600",
								zIndex: 10
							}}>{duration}</div>
							<div className="hover-wave" ref={hoverRef}></div>
							<div
								className="overlay"
								style={{
									position: "absolute",
									height: "30px",
									bottom: 0,
									color: "rgb(162, 139, 175)",
									backdropFilter: "brightness(0.5)",
								}}
							></div>
							
							{/* Comments on waveform */}
							<div
								className="comments-on-wave"
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
														maxWidth: 200,
														fontSize: "14px",
														backgroundColor: "rgba(255, 255, 255, 0.95)",
														color: "rgb(116, 106, 124)",
														borderRadius: "8px",
														boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
														backdropFilter: "blur(10px)",
														border: "1px solid rgba(255, 255, 255, 0.2)",
													},
												},
											}}
										>
											<Image
												onPointerMove={(e) => {
													const hover = hoverRef.current!;
													hover.style.width = calcLeft(
														item.moment
													);
												}}
												onClick={(e) => {
													if (wavesurfer) {
														const duration = wavesurfer.getDuration();
														wavesurfer.seekTo(item.moment / duration);
														wavesurfer.play();
													}
												}}
												src={fetchDefaultImages(
													item.user.type
												)}
												alt=""
												style={{
													position: "absolute",
													top: "78px",
													zIndex: 20,
													left: calcLeft(item.moment),
													borderRadius: "50%",
													border: "2px solid rgba(255, 255, 255, 0.8)",
													cursor: "pointer",
													transition: "transform 0.2s ease",
												}}
												height={24}
												width={24}
											/>
										</Tooltip>
									);
								})}
							</div>
						</div>
					</div>

					{/* Album Art - Desktop */}
					<div
						className="album-art-desktop"
						style={{
							width: "280px",
							height: "280px",
							flexShrink: 0,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						<Box
							component="img"
							onClick={(e) => e.stopPropagation()}
							src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}/${track?.imgUrl}`}
							alt="Song image"
							sx={{
								width: "100%",
								height: "100%",
								objectFit: "cover",
								borderRadius: "12px",
								boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
								border: "3px solid rgba(255, 255, 255, 0.1)",
							}}
						/>
					</div>
				</div>

				{/* Mobile Album Art */}
				<div
					className="album-art-mobile"
					style={{
						display: "none",
						width: "100%",
						height: "200px",
						marginTop: 20,
					}}
				>
					<Box
						component="img"
						onClick={(e) => e.stopPropagation()}
						src={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}/${track?.imgUrl}`}
						alt="Song image"
						sx={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
							borderRadius: "12px",
							boxShadow: "0 8px 24px rgba(0, 0, 0, 0.4)",
							border: "3px solid rgba(255, 255, 255, 0.1)",
						}}
					/>
				</div>
			</div>

			<LikeTrack track={track!} />
			
			{/* Enhanced Comment Section */}
			<div 
				className="comment-section-enhanced"
				style={{
					marginTop: 24,
					background: "linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)",
					borderRadius: "16px",
					border: "1px solid rgba(255, 255, 255, 0.1)",
					backdropFilter: "blur(10px)",
					overflow: "hidden",
				}}
			>
				<CommentTrack
					comments={comments}
					track={track!}
					wavesurfer={wavesurfer}
				/>
			</div>

			{/* Responsive Styles */}
			<style jsx>{`
				@media (max-width: 768px) {
					.wave-track-main {
						padding: 16px !important;
						gap: 12px !important;
					}
					
					.desktop-layout {
						flex-direction: column !important;
						gap: 0 !important;
					}
					
					.album-art-desktop {
						display: none !important;
					}
					
					.album-art-mobile {
						display: block !important;
					}
					
					.track-info {
						margin-bottom: 16px !important;
					}
					
					.play-button {
						height: 50px !important;
						width: 50px !important;
					}
					
					.wave-form-container {
						margin-top: 16px;
					}
				}
				
				@media (max-width: 480px) {
					.wave-track-main {
						padding: 12px !important;
						margin: 0 -8px;
					}
					
					.track-info {
						flex-direction: column !important;
						text-align: center !important;
						gap: 12px !important;
					}
					
					.track-info > div:last-child {
						margin-left: 0 !important;
					}
					
					.album-art-mobile {
						height: 150px !important;
						margin-top: 12px !important;
					}
				}
				
				/* Hover effects */
				@media (hover: hover) {
					.play-button:hover {
						transform: scale(1.05);
						background: rgba(0, 0, 0, 0.9) !important;
						border-color: rgba(233, 223, 255, 0.5) !important;
					}
					
					.comments-on-wave img:hover {
						transform: scale(1.2);
					}
				}
			`}</style>
		</div>
	);
};

export default WaveTrack;