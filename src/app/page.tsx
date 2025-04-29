import Footer from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
import {sendRequestJS} from '@/utils/old.api';
import { sendRequest } from "@/utils/api";

export default async function HomePage() {
	// const res = await fetch("http://localhost:8000/api/v1/tracks/top", {
	// 	method: 'POST',
	// 	headers: {
	// 		"Content-Type": "application/json"
	// 	},
	// 	body: JSON.stringify({
	// 		category: "CHILL",
	// 		limit: 10
	// 	})
	// })
	// console.log('>> check response server: ', await res.json());

	const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
		url: "http://localhost:8000/api/v1/tracks/top",
		method: "POST",
		body: {
			category: 'CHILL',
			limit: 10
		}
	});

		const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
		url: "http://localhost:8000/api/v1/tracks/top",
		method: "POST",
		body: {
			category: 'WORKOUT',
			limit: 10
		}
	});

		const party = await sendRequest<IBackendRes<ITrackTop[]>>({
		url: "http://localhost:8000/api/v1/tracks/top",
		method: "POST",
		body: {
			category: 'PARTY',
			limit: 10
		}
	});
	
	return (
		<Container>
			<MainSlider 
				title={"Top Chill"}
				data={chills?.data ?? []}
			/>
			<MainSlider 
				title={"Top Workout"}
				data={workouts?.data ?? []}
			/>
			<MainSlider 
				title={"Top Party"}
				data={party?.data ?? []}
			/>
		</Container>
	);
}

