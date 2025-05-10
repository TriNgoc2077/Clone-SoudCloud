import ProfileTrack from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api";
import { Container, Grid } from "@mui/material";

const ProfilePage = async ({ params }: { params: { slug: string } }) => {
	const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
		url: "http://localhost:8000/api/v1/tracks/users?pageSize=5000&current=1",
		method: "POST",
		body: { id: params.slug },
	});
	const tracks = res.data?.result ?? [];
	return (
		<Container>
			<Grid container spacing={5}>
				{tracks.map((track: ITrackTop, index: number) => {
					return (
						<Grid item xs={12} md={6} key={index}>
							<ProfileTrack data={track} />
						</Grid>
					);
				})}
			</Grid>
		</Container>
	);
};

export default ProfilePage;
