import { fetchDefaultImages } from "@/utils/api";
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
interface IProps {
	comments: IComment[];
	track: ITrackTop | null;
}
const CommentTrack = (props: IProps) => {
	const toast = useToast();
	dayjs.extend(relativeTime);
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
					onClick={() =>
						toast.warning("Not handle yet. Use enter pls :)")
					}
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
					}}
					className="left"
				>
					<Avatar
						src="/user/avatar.jpg"
						alt="avatar"
						sx={{ width: 80, height: 80 }}
					/>
					<Typography
						variant="body2"
						sx={{
							marginTop: 1,
							color: "gray",
							wordBreak: "break-word",
							textAlign: "center",
						}}
					>
						admin@gmail.com
					</Typography>
				</Box>
				<Box
					sx={{ display: "flex", flexDirection: "column", flex: 1 }}
					className="right"
				>
					{props.comments.map((comment) => (
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
									<strong>{comment.user.email}</strong>
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
