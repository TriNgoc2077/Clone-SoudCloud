import ProfileTrack from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "My profile",
  description: "profile"
}
const ProfilePage = async ({ params }: { params: { slug: string } }) => {
	const res = await sendRequest<IBackendRes<IModelPaginate<IShareTrack>>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/users?pageSize=5000&current=1`,
		method: "POST",
		body: { id: params.slug },
		nextOption: {
			next: { tags: ['track-by-profile'] }
		}
	});
	const tracks = res.data?.result ?? [];
	return (
		<Container>
			<Grid container spacing={5}>
				{tracks.map((track: IShareTrack, index: number) => {
					return (
						<Grid item xs={12} md={6} key={index}>
							<ProfileTrack track={track} tracks={tracks}  />
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
};

export default ProfilePage;
