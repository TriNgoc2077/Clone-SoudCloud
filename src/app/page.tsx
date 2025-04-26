import Footer from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
export default function HomePage() {
	return (
		<Container>
			<MainSlider />
			<MainSlider />
			<MainSlider />
		</Container>
	);
}
