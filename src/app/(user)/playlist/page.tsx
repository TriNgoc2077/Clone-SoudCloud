import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Playlist from '@/components/playlist/playlist';
import { sendRequest } from '@/utils/api';
import Container from '@mui/material/Container';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';

export const metadata: Metadata = {
  title: "Playlist",
  description: "playlist"
}
const PlaylistPage = async () => {
  const session = await getServerSession(authOptions);
  const playlist = await sendRequest<IBackendRes<IModelPaginate<IPlaylist>>>({
      url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/playlists/by-user`,
      method: "POST",
      queryParams: {
        current: 1,
        pageSize: 100
      },
      headers: {
        Authorization: `Bearer ${session?.access_token}`
      },
      nextOption: {
        next: { tags: ['playlist-by-user'] }
      }
    });
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    },
  })
  return (
    <Container sx={{ mt: 15 }}>
      <Playlist 
        playlists={playlist.data?.result ?? []}
        tracks={tracks.data?.result ?? []}
        session={session}
      />
    </Container>
  )
}
export default PlaylistPage