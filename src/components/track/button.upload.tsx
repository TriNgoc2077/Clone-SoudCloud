"use client";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

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
export default function ButtonFileUpload() {
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
				accept="audio/*"
				onChange={(event) => console.log(event.target.files)}
			/>
		</Button>
	);
}
