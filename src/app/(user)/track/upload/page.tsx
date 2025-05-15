import UploadTabs from "@/components/track/upload.tabs";
import { Container } from "@mui/material";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Upload track",
  description: "Upload a track"
}
const UploadPage = () => {
	return (
		<Container>
			<UploadTabs />
		</Container>
	);
};
export default UploadPage;
