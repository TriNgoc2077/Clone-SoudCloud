"use client";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useSession } from "next-auth/react";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});
export const ButtonFileAudioUpload = () => {
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<CloudUploadIcon />}
			onClick={(e) => e.preventDefault()}
			sx={{
				background: "pink",
				":hover": {
					background: "#ff69b4",
				},
			}}
		>
			Upload files
			<VisuallyHiddenInput
				type="file"
				accept="audio/*"
				onChange={(event) => console.log(event.target.files)}
			/>
		</Button>
	);
};

export const ButtonFileImageUpload = (props: any) => {
	const { info, setInfo } = props;
	const { data: session } = useSession();
	const handleImageUpload = async (image: any) => {
		const formData = new FormData();
		formData.append("fileUpload", image);
		try {
			const res = await axios.post(
				"http://localhost:8000/api/v1/files/upload",
				formData,
				{
					headers: {
						Authorization: `Bearer ${session?.access_token}`,
						target_type: "images",
					},
				}
			);
			setInfo({
				...info,
				imgUrl: res.data.data.fileName,
			});
			console.log(res.data.data.fileName);
		} catch (error: any) {
			console.log(error?.response?.data);
		}
	};
	return (
		<Button
			component="label"
			role={undefined}
			variant="contained"
			tabIndex={-1}
			startIcon={<CloudUploadIcon />}
			onClick={(e) => e.stopPropagation()}
			sx={{
				background: "pink",
				":hover": {
					background: "#ff69b4",
				},
			}}
		>
			Upload files
			<VisuallyHiddenInput
				type="file"
				accept="image/*"
				onChange={(event) => {
					const e = event.target as HTMLInputElement;
					if (e.files) {
						handleImageUpload(e.files[0]);
					}
				}}
			/>
		</Button>
	);
};
