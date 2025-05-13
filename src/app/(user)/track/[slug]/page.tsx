import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";

const DetailTrackPage = async (props: any) => {
	const { params } = props;
	//params: props.params, attribute nextjs provided
	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `http://localhost:8000/api/v1/tracks/${params.slug}`,
		method: "GET",
		nextOption: { cache: "no-store" }
	});

	const resComments = await sendRequest<IBackendRes<any>>({
		url: `http://localhost:8000/api/v1/tracks/comments`,
		method: "POST",
		queryParams: {
			trackId: params.slug,
			pageSize: 25,
			current: 1,
			sort: "-createdAt",
		},
	});
	return (
		<Container>
			<div>
				<WaveTrack
					track={res.data ?? null}
					comments={resComments.data?.result ?? null}
				/>
			</div>
		</Container>
	);
};

export default DetailTrackPage;
