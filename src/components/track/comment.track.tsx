import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";
import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";
interface IProps {
	comments: IComment[];
	track: ITrackTop;
	wavesurfer: WaveSurfer | null;
}
const CommentTrack = (props: IProps) => {
	const {comments, track, wavesurfer} = props;
	const router = useRouter();
	const toast = useToast();
	dayjs.extend(relativeTime);
	const {data: session} = useSession();
	const [commentContent, setCommentContent] = useState("");

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const secondsRemainder = Math.round(seconds) % 60;
		const paddedSeconds = `0${secondsRemainder}`.slice(-2);
		return `${minutes}:${paddedSeconds}`;
	};

	const handleJumpTrack = (moment: number) => {
		if (wavesurfer) {
			const duration = wavesurfer.getDuration();
			wavesurfer.seekTo(moment / duration);
			wavesurfer.play();
		}
	}

	const handleSubmit = async () => {
		const res = await sendRequest<IBackendRes<IComment>>({
			url: "http://localhost:8000/api/v1/comments",
			method: "POST",
			headers: {
				Authorization: `Bearer ${session?.access_token}`
			},
			body: {
				content: commentContent,
				moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
				track: track._id
			}
		})
		if (res.data) {
			setCommentContent("");
			router.refresh();
		}
	}
	return (
		<Grid sx={{ marginTop: "70px" }}>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					gap: 2,
					marginBottom: "40px",
				}}
			>
				<TextField
					value={commentContent}
					onChange={(e) => setCommentContent(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							handleSubmit();
						}
					}}
					variant="standard"
					label="Comment"
					sx={{
						flexGrow: 1,
						"& label.Mui-focused": {
							color: "#ff69b4",
						},
						"& .MuiInput-underline:after": {
							borderBottomColor: "#ff69b4",
						},
						"& .MuiInputBase-input": {
							color: "rgb(152, 115, 154)",
						},
					}}
				></TextField>
				<Button
					sx={{ color: "rgb(178, 114, 167)" }}
					onClick={() => handleSubmit()}
				>
					Send
				</Button>
			</Box>

			<Box sx={{ display: "flex", width: "100%" }}>
				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						padding: 2,
						width: 150,
						marginRight: "20px"
					}}
					className="left"
				>
					<Avatar
						src={fetchDefaultImages(session?.user.type || "")}
						alt="avatar"
						sx={{ width: 80, height: 80 }}
					/>
					<Typography
						variant="body2"
						sx={{
							marginTop: 1,
							color: "gray",
							// wordBreak: "break-word",
							textAlign: "center",
						}}
					>
						{session?.user.email}
					</Typography>
				</Box>
				<Box
					sx={{ display: "flex", flexDirection: "column", flex: 1 }}
					className="right"
				>
					{comments.map((comment) => (
						<Box
							key={comment._id}
							sx={{
								display: "flex",
								alignItems: "flex-start",
								gap: 2,
								marginBottom: 2,
							}}
						>
							<Box>
								<img
									src={fetchDefaultImages(comment.user.type)}
									alt="avatar"
									style={{
										width: 40,
										height: 40,
										borderRadius: "50%",
										objectFit: "cover",
									}}
								/>
							</Box>

							<Box sx={{ flex: 1 }}>
								<Box
									sx={{
										backgroundColor: "rgb(210, 169, 210)",
										padding: 1.5,
										borderRadius: 2,
										maxWidth: "100%",
									}}
								>
									<strong>{comment.user.email}</strong> at <span 
										onClick={() => handleJumpTrack(comment.moment)}
										style={{
											color: "rgb(100, 19, 77)",
											cursor: "pointer"
										}}
									>
										{formatTime(comment.moment)}
									</span>
									<Box>{comment.content}</Box>
								</Box>
								<Box
									sx={{
										fontSize: 12,
										color: "gray",
										marginTop: 0.5,
									}}
								>
									{dayjs(comment.createdAt).fromNow()}
								</Box>
							</Box>
						</Box>
					))}
				</Box>
			</Box>
		</Grid>
	);
};

export default CommentTrack;
