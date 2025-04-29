"use client";

import WaveTrack from "@/components/track/wave.track";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
	//params: props.params, attribute nextjs provided

	const searchParams = useSearchParams();

	const search = searchParams.get("audio");

	return (
		<div>
			Detail Track Page
			<div>
				<WaveTrack />
			</div>
		</div>
	);
};

export default DetailTrackPage;
