"use client";
import {
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
	Typography,
} from "@mui/material";
import LinearProgress, {
	LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import ButtonFileUpload from "./button.upload";
import { SmartButtonOutlined } from "@mui/icons-material";

function LinearProgressWithLabel(
	props: LinearProgressProps & { value: number }
) {
	return (
		<Box sx={{ display: "flex", alignItems: "center" }}>
			<Box sx={{ width: "100%", mr: 1 }}>
				<LinearProgress
					variant="determinate"
					sx={{
						// height: 10,
						borderRadius: 5,
						"& .MuiLinearProgress-bar": {
							backgroundColor: "rgb(230, 68, 197)",
						},
						"&.MuiLinearProgress-root": {
							backgroundColor: "rgb(222, 176, 216)",
						},
					}}
					{...props}
				/>
			</Box>
			<Box sx={{ minWidth: 35 }}>
				<Typography
					variant="body2"
					sx={{ color: "text.secondary" }}
				>{`${Math.round(props.value)}%`}</Typography>
			</Box>
		</Box>
	);
}
interface IProps {
	trackUpload: {
		fileName: string;
		percent: number;
	};
}
const Step2 = (props: IProps) => {
	const { trackUpload } = props;
	const [progress, setProgress] = useState(10);
	const [category, setCategory] = useState("");

	const handleChange = (event: SelectChangeEvent) => {
		setCategory(event.target.value as string);
	};
	useEffect(() => {
		const timer = setInterval(() => {
			setProgress((prevProgress) =>
				prevProgress >= 100 ? 10 : prevProgress + 10
			);
		}, 800);
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<>
			<div>
				{trackUpload.percent === 100
					? trackUpload.fileName
					: "Uploading your track..."}
			</div>
			<LinearProgressWithLabel value={trackUpload.percent} />
			<Grid container spacing={2} mt={5}>
				<Grid
					item
					xs={6}
					lg={4}
					mt={5}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						gap: "10px",
					}}
					gap={4}
				>
					<div
						style={{
							height: "250px",
							width: "250px",
							background: "#ddd",
						}}
					></div>
					<ButtonFileUpload />
				</Grid>
				<Grid item xs={6} lg={8} mt={5}>
					<TextField
						fullWidth
						label="Title"
						variant="outlined"
						margin="dense"
						sx={{
							"& label.Mui-focused": {
								color: "#ff69b4",
							},
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
								"&.Mui-focused fieldset": {
									borderColor: "#ff69b4",
								},
								"&:hover fieldset": {
									borderColor: "#f7a8d6",
								},
							},
						}}
					/>
					<TextField
						fullWidth
						label="Description"
						variant="outlined"
						margin="dense"
						sx={{
							mt: 3,
							"& label.Mui-focused": {
								color: "#ff69b4",
							},
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
								"&.Mui-focused fieldset": {
									borderColor: "#ff69b4",
								},
								"&:hover fieldset": {
									borderColor: "#f7a8d6",
								},
							},
						}}
					/>
					<FormControl
						fullWidth
						sx={{
							mt: 3,
							"& label.Mui-focused": {
								color: "#ff69b4",
							},
							"& .MuiOutlinedInput-root": {
								borderRadius: 2,
								"&.Mui-focused fieldset": {
									borderColor: "#ff69b4",
								},
								"&:hover fieldset": {
									borderColor: "#f7a8d6",
								},
							},
						}}
					>
						<InputLabel id="demo-simple-select-label">
							Category
						</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={category}
							label="Category"
							onChange={handleChange}
						>
							<MenuItem value={10}>Chill</MenuItem>
							<MenuItem value={20}>Rock</MenuItem>
							<MenuItem value={30}>Party</MenuItem>
						</Select>
					</FormControl>
					<Button
						variant="outlined"
						sx={{
							mt: 5,
							borderColor: "pink",
							color: "rgb(101, 58, 111)",
							":hover": {
								borderColor: "#ff69b4",
								backgroundColor: "#ff69b4",
								color: "rgb(101, 58, 111)",
							},
						}}
					>
						SAVE
					</Button>
				</Grid>
			</Grid>
		</>
	);
};
export default Step2;
