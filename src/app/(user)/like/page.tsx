import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Like from '@/components/like/like';
import { sendRequest } from '@/utils/api';
import { Container } from '@mui/material';
import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
 
export const metadata: Metadata = {
  title: "Like page",
  description: "Your tracks"
}

const LikePage = async () => {
  const session = await getServerSession(authOptions);
  const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
    method: "GET",
    queryParams: { current: 1, pageSize: 100 },
    headers: {
      Authorization: `Bearer ${session?.access_token}`
    },
    nextOption: {
      next: { tags: ['liked-by-user'] }
    }
  })
  return <Container>
    <Like tracks={tracks.data?.result ?? []} />
  </Container>;
}
export default LikePage;