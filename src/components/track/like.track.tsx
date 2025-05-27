import { Box, Chip } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { sendRequest } from "@/utils/api";
import { useRouter } from "next/navigation";
import { handleLikeTrackAction } from "@/utils/actions/actions";
const pinkColor = '#ec407a';
const lightPinkBackground = '#fce4ec';

const LikeTrack = (props: any) => {
    const router = useRouter();
    const {data: session} = useSession();
    const {track} = props;
    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);
    useEffect(() => {
        fetchData();
    }, [session]);
    const fetchData = async () => {
        if (session?.access_token) {
            const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: "-createdAt"
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            })
            if (res2.data?.result) {
                setTrackLikes(res2.data.result);
            }
        }
    } 
    const handleLike = async () => {
        const id = track?._id;
        const quantity = trackLikes?.some(t => t._id === track?._id) ? -1 : 1;
        await handleLikeTrackAction(id, quantity)
        fetchData();
        router.refresh();
	}
    return (
        <>
            <Box
                className="like"
                marginTop="15px"
                display="flex"
                justifyContent="space-between"
                >
                <Chip
                    label={trackLikes?.some(t => t._id === track?._id) ? "Liked" : "Like"}
                    variant="outlined"
                    onClick={handleLike}
                    icon={trackLikes?.some(t => t._id === track?._id) ? <FavoriteIcon sx={{ color: `${pinkColor} !important` }} /> : <FavoriteBorderIcon sx={{ color: `${pinkColor} !important` }} />}
                    sx={{
                    borderColor: pinkColor,
                    color: pinkColor,
                    backgroundColor: lightPinkBackground,
                    '&:hover': {
                        backgroundColor: '#f8bbd0',
                    },
                    borderRadius: "15px"
                    }}
                />

                <Box>
                    <Chip
                    variant="outlined"
                    icon={<PlayArrowIcon sx={{ color: `${pinkColor} !important` }} />}
                    label={track?.countPlay}
                    sx={{
                        borderColor: pinkColor,
                        color: pinkColor,
                        backgroundColor: lightPinkBackground,
                    }}
                    />

                    <Chip
                    variant="outlined"
                    icon={<FavoriteIcon sx={{ color: `${pinkColor} !important` }} />}
                    label={track?.countLike}
                    sx={{
                        borderColor: pinkColor,
                        color: pinkColor,
                        backgroundColor: lightPinkBackground,
                    }}
                    />
                </Box>
            </Box>
        </>
    )
}

export default LikeTrack;