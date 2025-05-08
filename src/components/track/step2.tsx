"use client";
import {
	Alert,
	Box,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	SelectChangeEvent,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import LinearProgress, {
	LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { ButtonFileImageUpload } from "./button.upload";
import { SmartButtonOutlined } from "@mui/icons-material";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";
import axios from "axios";
import { sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";

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
		uploadedTrackName: string;
	};
}

interface INewTrack {
	title: string;
	description: string;
	trackUrl: string;
	imgUrl: string;
	category: string;
}
const Step2 = (props: IProps) => {
	const { data: session } = useSession();
	const [info, setInfo] = useState<INewTrack>({
		title: "",
		description: "",
		trackUrl: "",
		imgUrl: "",
		category: "",
	});
	const { trackUpload } = props;
	const [progress, setProgress] = useState(10);
	const [resMessage, setResMessage] = useState<string>("");
	const [openMessage, setOpenMessage] = useState<boolean>(false);

	const [errMessage, seterrMessage] = useState<string>("");
	const [openError, setOpenError] = useState<boolean>(false);
	// const [category, setCategory] = useState("");
	const catergory = [
		{
			value: "CHILL",
			label: "Chill",
		},
		{
			value: "WORKOUT",
			label: "Workout",
		},
		{
			value: "PARTY",
			label: "Party",
		},
	];
	useEffect(() => {
		if (trackUpload.uploadedTrackName) {
			setInfo({
				...info,
				trackUrl: trackUpload.uploadedTrackName,
			});
		}
	}, [trackUpload]);
	const handleSubmitForm = async () => {
		const res = await sendRequest<IBackendRes<ITrackTop[]>>({
			url: "http://localhost:8000/api/v1/tracks",
			method: "POST",
			headers: {
				Authorization: `Bearer ${session?.access_token}`,
			},
			body: {
				title: info.title,
				description: info.description,
				trackUrl: info.trackUrl,
				imgUrl: info.imgUrl,
				category: info.category,
			},
		});
		if (res.data) {
			setResMessage("You added new track. Enjoy !");
			setOpenMessage(true);
			setTimeout(() => {
				setOpenMessage(false);
			}, 3500);
		} else {
			seterrMessage(res.message[0]);
			setOpenError(true);
			setTimeout(() => {
				setOpenError(false);
			}, 3500);
		}
	};
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
					<Box
						sx={{
							width: { xs: "200px", sm: "220px", md: "250px" },
							aspectRatio: "1 / 1",
							borderRadius: 2,
							overflow: "hidden",
							bgcolor: "#f0f0f0",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
						}}
					>
						{info.imgUrl ? (
							<img
								src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`}
								alt="Track Cover"
								style={{
									width: "100%",
									height: "100%",
									objectFit: "cover",
								}}
							/>
						) : (
							<Typography variant="body2" color="text.secondary">
								No image selected
							</Typography>
						)}
					</Box>
					<ButtonFileImageUpload setInfo={setInfo} info={info} />
				</Grid>
				<Grid item xs={6} lg={8} mt={5}>
					<TextField
						fullWidth
						value={info?.title}
						onChange={(e) =>
							setInfo({
								...info,
								title: e.target.value,
							})
						}
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
						value={info?.description}
						onChange={(e) =>
							setInfo({
								...info,
								description: e.target.value,
							})
						}
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
							value={info.category}
							label="Category"
							onChange={(e) => {
								setInfo({ ...info, category: e.target.value });
							}}
						>
							{catergory.map((item) => (
								<MenuItem value={item.value}>
									{item.label}
								</MenuItem>
							))}
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
						onClick={() => handleSubmitForm()}
					>
						SAVE
					</Button>
				</Grid>
			</Grid>
			<Snackbar
				open={openMessage}
				// autoHideDuration={4000}
				// onClose={handleClose}
				message="Note archived"
				// action={action}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert severity="success" onClose={() => setOpenMessage(false)}>
					{resMessage}
				</Alert>
			</Snackbar>
			<Snackbar
				open={openError}
				// autoHideDuration={4000}
				// onClose={handleClose}
				message="Note archived"
				// action={action}
				anchorOrigin={{ vertical: "top", horizontal: "center" }}
			>
				<Alert severity="error" onClose={() => setOpenError(false)}>
					{errMessage}
				</Alert>
			</Snackbar>
		</>
	);
};
export default Step2;
