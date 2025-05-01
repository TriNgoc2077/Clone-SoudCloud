"use client";

import WaveTrack from "@/components/track/wave.track";
import Container from "@mui/material/Container";
import { useSearchParams } from "next/navigation";

const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
	//params: props.params, attribute nextjs provided

	const searchParams = useSearchParams();

	const search = searchParams.get("audio");

	return (
		<Container>
			<div>
				<WaveTrack />
			</div>
		</Container>
	);
};

export default DetailTrackPage;
