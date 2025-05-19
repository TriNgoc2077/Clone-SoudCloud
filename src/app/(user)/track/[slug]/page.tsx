import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { slug: string };
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
	{ params, searchParams }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const temp = params.slug.split(".html") ?? [];
	const temp1 = temp[0].split("-") ?? [];
	const id = temp1[temp1.length - 1];
	// fetch post information
	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `http://localhost:8000/api/v1/tracks/${id}`,
		method: "GET",
		nextOption: { cache: "no-store" },
	});

	return {
		title: res.data?.title,
		description: res.data?.description,
		openGraph: {
			title: "Soundcloud",
			description: "Vibe music, powered by Cao Tri Ngoc",
			type: "website",
			images: [`https://www.svgrepo.com/show/21451/soundcloud.svg`],
		},
	};
}

const DetailTrackPage = async (props: any) => {
	const { params } = props;
	const temp = params.slug.split(".html") ?? [];
	const temp1 = (temp[0].split("-") ?? []) as string[];
	const id = temp1[temp1.length - 1];
	console.log(id);
	//params: props.params, attribute nextjs provided
	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `http://localhost:8000/api/v1/tracks/${id}`,
		method: "GET",
		nextOption: { cache: "no-store" },
	});

	const resComments = await sendRequest<IBackendRes<any>>({
		url: `http://localhost:8000/api/v1/tracks/comments`,
		method: "POST",
		queryParams: {
			trackId: id,
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
