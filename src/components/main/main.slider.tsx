"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider, Paper, Typography } from "@mui/material";
import { ChevronLeft, ChevronRight, PlayArrow } from "@mui/icons-material";
import PauseIcon from "@mui/icons-material/Pause";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";
import { useContext } from "react";
import { TrackContext } from "@/lib/track.wrapper";

interface IProps {
	title: string;
	data: ITrackTop[];
}

const MainSlider = (props: IProps) => {
	const { currentTrack, setCurrentTrack } = useContext(
			TrackContext
		) as ITrackContext;
	const NextArrow = (props: any) => {
		return (
			<Button
				color="primary"
				variant="contained"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					right: -25,
					top: "50%",
					zIndex: 2,
					minWidth: 50,
					width: 50,
					height: 50,
					borderRadius: "50%",
					background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)",
					boxShadow: "0 8px 25px rgba(255, 107, 157, 0.3)",
					transform: "translateY(-50%)",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-50%) scale(1.1)",
						boxShadow: "0 12px 35px rgba(255, 107, 157, 0.4)",
					},
				}}
			>
				<ChevronRight />
			</Button>
		);
	};

	const PrevArrow = (props: any) => {
		return (
			<Button
				color="primary"
				variant="contained"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					left: -25,
					top: "50%",
					zIndex: 2,
					minWidth: 50,
					width: 50,
					height: 50,
					borderRadius: "50%",
					background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)",
					boxShadow: "0 8px 25px rgba(255, 107, 157, 0.3)",
					transform: "translateY(-50%)",
					transition: "all 0.3s ease",
					"&:hover": {
						transform: "translateY(-50%) scale(1.1)",
						boxShadow: "0 12px 35px rgba(255, 107, 157, 0.4)",
					},
				}}
			>
				<ChevronLeft />
			</Button>
		);
	};

	const settings: Settings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		nextArrow: <NextArrow />,
		prevArrow: <PrevArrow />,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
				},
			},
		],
	};

	return (
		<Box
			sx={{
				margin: "0 50px",
				padding: "40px 0",
				position: "relative",
			}}
		>
			{/* Section Title */}
			<Typography
				variant="h4"
				component="h2"
				sx={{
					marginBottom: 4,
					fontWeight: 700,
					background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)",
					backgroundClip: "text",
					WebkitBackgroundClip: "text",
					WebkitTextFillColor: "transparent",
					textAlign: "center",
					position: "relative",
					"&::after": {
						content: '""',
						position: "absolute",
						bottom: -10,
						left: "50%",
						transform: "translateX(-50%)",
						width: "80px",
						height: "4px",
						background: "linear-gradient(135deg, #ff6b9d 0%, #ff8a9b 100%)",
						borderRadius: "2px",
					},
				}}
			>
				{props.title}
			</Typography>

			{/* Slider */}
			<Box sx={{ position: "relative", padding: "0 30px" }}>
				<Slider {...settings}>
					{props.data.map((item) => (
						<Box key={item._id} sx={{ padding: "0 12px" }}>

								<Paper
									elevation={0}
									sx={{
										borderRadius: "20px",
										overflow: "hidden",
										background: "linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)",
										border: "1px solid rgba(102, 126, 234, 0.1)",
										transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
										cursor: "pointer",
										position: "relative",
										"&:hover": {
											transform: "translateY(-8px) scale(1.02)",
											boxShadow: "0 20px 40px rgba(102, 126, 234, 0.15)",
											"& .track-image": {
												transform: "scale(1.1)",
											},
											"& .play-overlay": {
												opacity: 1,
											},
											"& .track-title": {
												color: "#ff6b9d",
											},
										},
									}}
								>
									{/* Image Container */}
									<Box
										sx={{
											position: "relative",
											height: "200px",
											overflow: "hidden",
											borderRadius: "20px 20px 0 0",
											background: "linear-gradient(135deg, #ff6b9d20, #ff8a9b20)",
										}}
									>
										<Image
											src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
											alt={item.title}
											fill
											className="track-image"
											style={{
												objectFit: "cover",
												transition: "transform 0.4s ease",
											}}
										/>
										
										{/* Play Overlay */}
										<Box
											className="play-overlay"
											sx={{
												position: "absolute",
												top: 0,
												left: 0,
												right: 0,
												bottom: 0,
												background: "rgba(255, 107, 157, 0.8)",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												opacity: 0,
												transition: "opacity 0.3s ease",
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
													backdropFilter: "blur(10px)",
													animation: "pulse 2s infinite",
												}}
												onClick={(e) => {
													e.stopPropagation();
													if (item._id !== currentTrack._id) {
														currentTrack.isPlaying = false;
													}
													setCurrentTrack({
														...item,
														isPlaying: !currentTrack.isPlaying,
													});
												}}
											>	
												{(currentTrack._id === null || (currentTrack._id === item._id && currentTrack.isPlaying)) ? <PauseIcon sx={{ fontSize: 32, color: "#ff6b9d", marginLeft: "4px" }} /> : <PlayArrow sx={{ fontSize: 32, color: "#ff6b9d", marginLeft: "4px" }} />}
											</Box>
										</Box>
									</Box>
									<Link
									href={`/track/${convertSlugUrl(item.title)}-${
										item._id
									}.html?audio=${item.trackUrl}`}
									style={{ textDecoration: "none" }}
									>
										{/* Content */}
										<Box sx={{ padding: "20px 16px" }}>
											<Typography
												className="track-title"
												variant="h6"
												sx={{
													fontWeight: 600,
													marginBottom: 1,
													color: "#2d3748",
													fontSize: "1.1rem",
													lineHeight: 1.3,
													overflow: "hidden",
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
													transition: "color 0.3s ease",
												}}
											>
												{item.title}
											</Typography>
											
											<Typography
												variant="body2"
												sx={{
													color: "#718096",
													fontSize: "0.9rem",
													lineHeight: 1.4,
													overflow: "hidden",
													display: "-webkit-box",
													WebkitLineClamp: 2,
													WebkitBoxOrient: "vertical",
												}}
											>
												{item.description}
											</Typography>
										</Box>
									</Link>


									{/* Gradient Border Effect */}
									<Box
										sx={{
											position: "absolute",
											top: 0,
											left: 0,
											right: 0,
											bottom: 0,
											background: "linear-gradient(135deg, #ff6b9d, #ff8a9b)",
											borderRadius: "20px",
											padding: "2px",
											zIndex: -1,
											opacity: 0,
											transition: "opacity 0.3s ease",
											"&:hover": {
												opacity: 1,
											},
										}}
									/>
								</Paper>
						</Box>
					))}
				</Slider>
			</Box>

			{/* Custom Styles */}
			<style jsx global>{`
				@keyframes pulse {
					0% {
						transform: scale(1);
						box-shadow: 0 0 0 0 rgba(255, 107, 157, 0.4);
					}
					70% {
						transform: scale(1.05);
						box-shadow: 0 0 0 10px rgba(255, 107, 157, 0);
					}
					100% {
						transform: scale(1);
						box-shadow: 0 0 0 0 rgba(255, 107, 157, 0);
					}
				}

				.slick-dots {
					bottom: -50px !important;
				}

				.slick-dots li button:before {
					color: #ff6b9d !important;
					font-size: 12px !important;
				}

				.slick-dots li.slick-active button:before {
					color: #ff8a9b !important;
				}
			`}</style>

			<Divider
				sx={{
					marginTop: 6,
					background: "linear-gradient(90deg, transparent, #ff6b9d, transparent)",
					height: "2px",
					border: "none",
				}}
			/>
		</Box>
	);
};

export default MainSlider;