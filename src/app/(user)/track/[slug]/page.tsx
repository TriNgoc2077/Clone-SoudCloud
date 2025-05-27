import WaveTrack from "@/components/track/wave.track";
import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";
import type { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";

type Props = {
	params: { slug: string };
};

export async function generateStaticParams() {
	return [
		{ slug: "noi-nho-vo-han-683403924cdd422b64fb19f5.html" },
		{ slug: "tinh-yeu-buong-tha-cho-chung-ta-6833fe394cdd422b64fb198d.html" },
		{ slug: "los-voltaje-(slowed)-683401f64cdd422b64fb19c2.html" },
		{ slug: "pho-cu-con-anh-683407da4cdd422b64fb1bf7.html" }
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
	//params: props.params, attribute nextjs provided
	const res = await sendRequest<IBackendRes<ITrackTop>>({
		url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
		method: "GET",
		nextOption: { 
			// cache: "no-store"
			next: { tags: ['track-by-id'] }
		},
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
	// await new Promise(resolve => setTimeout(resolve, 3000))

	return (
		<Suspense>
			<Container>
				<div>
					<WaveTrack
						track={res.data ?? null}
						comments={resComments.data?.result ?? null}
					/>
				</div>
			</Container>
		</Suspense>
	);
};

export default DetailTrackPage;
