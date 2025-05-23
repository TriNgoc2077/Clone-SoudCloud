import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
	params: { slug: string };
};

export async function generateStaticParams() {
	return [
		{ slug: "le-luu-ly-68092eeb7e5e033f9976b4ff.html" },
		{ slug: "tinh-co-yeu-em-68092eeb7e5e033f9976b502.html" },
		{ slug: "song-cho-het-doi-thanh-xuan-68092eeb7e5e033f9976b503.html" },
	]
}

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
): Promise<Metadata> {
	const temp = params.slug.split(".html") ?? [];
	const temp1 = temp[0].split("-") ?? [];
	const id = temp1[temp1.length - 1];
	// fetch post information
	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
		method: "GET",
		// nextOption: { cache: "no-store" },
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
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
		method: "GET",
		// nextOption: { cache: "no-store" },
	});

	const resComments = await sendRequest<IBackendRes<any>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
		method: "POST",
		queryParams: {
			trackId: id,
			pageSize: 25,
			current: 1,
			sort: "-createdAt",
		},
	});
	await new Promise(resolve => setTimeout(resolve, 3000))

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
