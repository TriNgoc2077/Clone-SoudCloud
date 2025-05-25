"use client";
import { sendRequest } from "@/utils/api";
import { Box, Card, CardContent, CardMedia, CircularProgress, Divider, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Search = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [tracks, setTracks] = useState<ITrackTop[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
                url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
                method: "POST",
                body: {
                    current: 1,
                    pageSize: 15,
                    title: query
                }
            });
            if (res.data) {
                setTracks(res.data.result);
            }
        } catch (error) {
            console.error("Error fetching search results:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        document.title = `"${query}" on Soundcloud`;
        if (query) {
            fetchData();
        }
    }, [query]);

    return (
        <Box sx={{ p: 3, maxWidth: 1200, margin: '0 auto' }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                Search results for: "{query}"
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : tracks.length === 0 ? (
                <Typography variant="h6" color="textSecondary" textAlign="center" py={4}>
                    No tracks found matching "{query}"
                </Typography>
            ) : (
                <Stack spacing={2}>
                    {tracks.map((track) => (
                        <Card key={track._id} sx={{ 
                            display: 'flex', 
                            flexDirection: 'row', 
                            alignItems: 'center',
                            p: 1,
                            backgroundColor: "#fddeff",
                            '&:hover': { 
                                backgroundColor: 'action.hover',
                                transform: 'translateX(4px)'
                            },
                            transition: 'all 0.2s ease'
                        }}>
                            <CardMedia
                                component="img"
                                sx={{ width: 80, height: 80, borderRadius: 1 }}
                                image={`${process.env.NEXT_PUBLIC_BACKEND_URL_IMAGES}/${track.imgUrl}`}
                                alt={track.title}
                            />
                            <CardContent sx={{ flex: 1 }}>
                                <Typography variant="h6" noWrap>
                                    <Link 
                                        href={`/track/${track.title}-${track._id}.html?audio=${track.trackUrl}`} 
                                        style={{ 
                                            textDecoration: 'none', 
                                            color: 'inherit',
                                            // '&:hover': {
                                            //     textDecoration: 'underline'
                                            // }
                                        }}
                                    >
                                        {track.title}
                                    </Link>
                                </Typography>
                                <Typography variant="body2" color="text.secondary" noWrap>
                                    {track.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default Search;