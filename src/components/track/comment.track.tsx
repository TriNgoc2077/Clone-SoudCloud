import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useHasMounted } from "@/utils/customHook";
import { useToast } from "@/utils/toast";
import {
	Avatar,
	Box,
	Button,
	Container,
	Grid,
	TextField,
	Typography,
	IconButton,
	Paper,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { getSession, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import WaveSurfer from "wavesurfer.js";

interface IProps {
	comments: IComment[];
	track: ITrackTop;
	wavesurfer: WaveSurfer | null;
}

const CommentTrack = (props: IProps) => {
	const { comments, track, wavesurfer } = props;
	const router = useRouter();
	const hasMounted = useHasMounted();
	const toast = useToast();
	dayjs.extend(relativeTime);
	const { data: session } = useSession();
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
	};

	const handleSubmit = async () => {
		const res = await sendRequest<IBackendRes<IComment>>({
			url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
			method: "POST",
			headers: {
				Authorization: `Bearer ${session?.access_token}`,
			},
			body: {
				content: commentContent,
				moment: Math.round(wavesurfer?.getCurrentTime() ?? 0),
				track: track._id,
			},
		});
		if (res.data) {
			setCommentContent("");
		}
		router.refresh();
	};

	return (
		<Box 
			className="comment-track-container"
			sx={{ 
				mt: 4,
				background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.1) 0%, rgba(255, 105, 180, 0.05) 100%)',
				borderRadius: '20px',
				p: { xs: 2, md: 3 },
				backdropFilter: 'blur(10px)',
				border: '1px solid rgba(255, 182, 193, 0.2)',
			}}
		>
			{/* Header */}
			<Typography 
				variant="h5" 
				sx={{ 
					mb: 3,
					background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
					backgroundClip: 'text',
					WebkitBackgroundClip: 'text',
					WebkitTextFillColor: 'transparent',
					fontWeight: 700,
					textAlign: { xs: 'center', md: 'left' },
					fontSize: { xs: '1.5rem', md: '2rem' }
				}}
			>
				💬 Comments ({comments.length})
			</Typography>

			{/* Comment Input Section */}
			<Paper
				elevation={0}
				sx={{
					background: 'linear-gradient(135deg, rgba(255, 182, 193, 0.15) 0%, rgba(255, 105, 180, 0.1) 100%)',
					borderRadius: '16px',
					p: { xs: 2, md: 3 },
					mb: 3,
					border: '1px solid rgba(255, 182, 193, 0.3)',
				}}
			>
				<Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, alignItems: { md: 'flex-start' } }}>
					{/* User Avatar Section */}
					<Box
						sx={{
							display: 'flex',
							flexDirection: { xs: 'row', md: 'column' },
							alignItems: 'center',
							gap: { xs: 2, md: 1 },
							minWidth: { md: 120 },
							p: { xs: 0, md: 1 },
						}}
					>
						<Avatar
							src={fetchDefaultImages(session?.user.type || "")}
							alt="avatar"
							sx={{ 
								width: { xs: 50, md: 70 }, 
								height: { xs: 50, md: 70 },
								border: '3px solid rgba(255, 105, 180, 0.3)',
								boxShadow: '0 4px 12px rgba(255, 105, 180, 0.2)',
							}}
						/>
						<Typography
							variant="body2"
							sx={{
								color: '#D946EF',
								fontWeight: 600,
								textAlign: 'center',
								fontSize: { xs: '0.875rem', md: '0.75rem' },
								wordBreak: 'break-word',
								maxWidth: { xs: 'none', md: 120 },
							}}
						>
							{session?.user.email}
						</Typography>
					</Box>

					{/* Comment Input */}
					<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
						<TextField
							value={commentContent}
							onChange={(e) => setCommentContent(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit();
								}
							}}
							variant="outlined"
							placeholder="Share your thoughts about this track..."
							multiline
							maxRows={4}
							fullWidth
							sx={{
								'& .MuiOutlinedInput-root': {
									background: 'rgba(255, 255, 255, 0.8)',
									borderRadius: '12px',
									'& fieldset': {
										borderColor: 'rgba(255, 105, 180, 0.3)',
									},
									'&:hover fieldset': {
										borderColor: 'rgba(255, 105, 180, 0.5)',
									},
									'&.Mui-focused fieldset': {
										borderColor: '#FF69B4',
										borderWidth: '2px',
									},
								},
								'& .MuiInputBase-input': {
									color: '#8B5A8C',
									fontSize: { xs: '0.875rem', md: '1rem' },
								},
								'& .MuiInputBase-input::placeholder': {
									color: 'rgba(139, 90, 140, 0.6)',
									opacity: 1,
								},
							}}
						/>
						
						<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<Typography 
								variant="caption" 
								sx={{ 
									color: 'rgba(255, 105, 180, 0.7)',
									display: 'flex',
									alignItems: 'center',
									gap: 0.5,
								}}
							>
								<AccessTimeIcon sx={{ fontSize: 14 }} />
								at {formatTime(wavesurfer?.getCurrentTime() ?? 0)}
							</Typography>
							
							<Button
								onClick={() => handleSubmit()}
								disabled={!commentContent.trim()}
								variant="contained"
								endIcon={<SendIcon />}
								sx={{
									background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
									borderRadius: '25px',
									px: 3,
									py: 1,
									textTransform: 'none',
									fontWeight: 600,
									boxShadow: '0 4px 15px rgba(255, 105, 180, 0.3)',
									'&:hover': {
										background: 'linear-gradient(45deg, #FF1493, #DC143C)',
										boxShadow: '0 6px 20px rgba(255, 105, 180, 0.4)',
										transform: 'translateY(-1px)',
									},
									'&:disabled': {
										background: 'rgba(255, 105, 180, 0.3)',
										color: 'rgba(255, 255, 255, 0.5)',
									},
									transition: 'all 0.3s ease',
								}}
							>
								Send
							</Button>
						</Box>
					</Box>
				</Box>
			</Paper>

			{/* Comments List */}
			<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
				{comments.length === 0 ? (
					<Paper
						elevation={0}
						sx={{
							background: 'rgba(255, 182, 193, 0.1)',
							borderRadius: '12px',
							p: 4,
							textAlign: 'center',
							border: '1px dashed rgba(255, 105, 180, 0.3)',
						}}
					>
						<Typography 
							variant="body1" 
							sx={{ 
								color: 'rgba(255, 105, 180, 0.7)',
								fontStyle: 'italic',
							}}
						>
							🎵 Be the first to comment on this track!
						</Typography>
					</Paper>
				) : (
					comments.map((comment) => (
						<Paper
							key={comment._id}
							elevation={0}
							sx={{
								background: 'rgba(255, 255, 255, 0.6)',
								borderRadius: '16px',
								p: { xs: 2, md: 3 },
								border: '1px solid rgba(255, 182, 193, 0.2)',
								backdropFilter: 'blur(5px)',
								transition: 'all 0.3s ease',
								'&:hover': {
									background: 'rgba(255, 255, 255, 0.8)',
									transform: 'translateY(-2px)',
									boxShadow: '0 8px 25px rgba(255, 105, 180, 0.15)',
								},
							}}
						>
							<Box sx={{ display: 'flex', gap: { xs: 2, md: 3 }, alignItems: 'flex-start' }}>
								{/* Comment Avatar */}
								<Avatar
									src={fetchDefaultImages(comment.user.type)}
									alt="avatar"
									sx={{
										width: { xs: 40, md: 50 },
										height: { xs: 40, md: 50 },
										border: '2px solid rgba(255, 105, 180, 0.3)',
										flexShrink: 0,
									}}
								/>

								{/* Comment Content */}
								<Box sx={{ flex: 1, minWidth: 0 }}>
									{/* Comment Header */}
									<Box 
										sx={{ 
											display: 'flex', 
											flexDirection: { xs: 'column', sm: 'row' },
											alignItems: { sm: 'center' },
											gap: { xs: 0.5, sm: 2 },
											mb: 1.5,
										}}
									>
										<Typography
											variant="subtitle1"
											sx={{
												color: '#8B5A8C',
												fontWeight: 700,
												fontSize: { xs: '0.875rem', md: '1rem' },
												wordBreak: 'break-word',
											}}
										>
											{comment.user.email}
										</Typography>
										
										<Box
											onClick={() => handleJumpTrack(comment.moment)}
											sx={{
												display: 'inline-flex',
												alignItems: 'center',
												gap: 0.5,
												background: 'linear-gradient(45deg, #FF69B4, #FF1493)',
												color: 'white',
												px: 2,
												py: 0.5,
												borderRadius: '20px',
												cursor: 'pointer',
												fontSize: { xs: '0.75rem', md: '0.875rem' },
												fontWeight: 600,
												transition: 'all 0.3s ease',
												alignSelf: { xs: 'flex-start', sm: 'center' },
												'&:hover': {
													background: 'linear-gradient(45deg, #FF1493, #DC143C)',
													transform: 'scale(1.05)',
												},
											}}
										>
											<AccessTimeIcon sx={{ fontSize: { xs: 12, md: 14 } }} />
											{formatTime(comment.moment)}
										</Box>
									</Box>

									{/* Comment Text */}
									<Typography
										variant="body1"
										sx={{
											color: '#4A5568',
											fontSize: { xs: '0.875rem', md: '1rem' },
											lineHeight: 1.6,
											mb: 1,
											wordBreak: 'break-word',
										}}
									>
										{comment.content}
									</Typography>

									{/* Comment Time */}
									<Typography
										variant="caption"
										sx={{
											color: 'rgba(255, 105, 180, 0.6)',
											fontSize: { xs: '0.75rem', md: '0.875rem' },
											fontStyle: 'italic',
										}}
									>
										{hasMounted && dayjs(comment.createdAt).fromNow()}
									</Typography>
								</Box>
							</Box>
						</Paper>
					))
				)}
			</Box>

			{/* Custom Styles for Mobile */}
			<style jsx global>{`
				@media (max-width: 600px) {
					.comment-track-container .MuiTextField-root {
						font-size: 16px; /* Prevents zoom on iOS */
					}
				}
			`}</style>
		</Box>
	);
};

export default CommentTrack;