"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box, Button, Divider } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
interface IProps {
	title: string;
	data: ITrackTop[];
}
const MainSlider = (props: IProps) => {
	const NextArrow = (props: any) => {
		return (
			<Button
				color="inherit"
				variant="contained"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					right: 0,
					top: "25%",
					zIndex: 2,
					minWidth: 30,
					width: 35,
				}}
			>
				<ChevronRight />
			</Button>
		);
	};

	const PrevArrow = (props: any) => {
		return (
			<Button
				color="inherit"
				variant="contained"
				onClick={props.onClick}
				sx={{
					position: "absolute",
					top: "25%",
					zIndex: 2,
					minWidth: 30,
					width: 35,
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
	};
	return (
		<Box
			sx={{
				margin: "0 50px",
				".track": {
					padding: "0 10px",

					img: {
						height: "150px",
						width: "150px",
					},
				},
			}}
		>
			<h2>{props.title}</h2>
			<Slider {...settings}>
				{props.data.map((item) => {
					return (
						<Link
							href={`/track/${convertSlugUrl(item.title)}-${
								item._id
							}.html?audio=${item.trackUrl}`}
						>
							<div className="track" key={item._id}>
								<img
									src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${item.imgUrl}`}
									alt={item.title}
								/>
								<h4>{item.title}</h4>
								<h5>{item.description}</h5>
							</div>
						</Link>
					);
				})}
			</Slider>
			<Divider />
		</Box>
	);
};

export default MainSlider;
