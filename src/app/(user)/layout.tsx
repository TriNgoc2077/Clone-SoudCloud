import Footer from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import type { Metadata } from "next";
import Script from "next/script";

export const metadata: Metadata = {
	metadataBase: new URL('https://clone-soundcloud.vercel.app'),
	title: "Home page",
	description: "Vibe music",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const idJsonObject = {
		"@context": "https://schema.org",
		"@type": "Store",
		name: "Soundcloud",
		image: {
			"@type": "ImageObject",
			url: "https://fabrikbrands.com/wp-content/uploads/Soundcloud-Logo-History-1-1155x770.png",
			width: 1080,
			height: 1080,
		},
		telephone: "19006035",
		url: "https://soundcloud.com/",
		address: {
			"@type": "PostalAddress",
			streetAddress: "2 Vo Oanh, 25 District, Ho Chi Minh City",
			addressLocality: "Ho Chi Minh",
			postalCode: "700000",
			addressRegion: "Ho Chi Minh",
			addressCountry: "VN",
		},
		priceRange: "1000 - 1000000000",
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: [
					"Monday",
					"Tuesday",
					"Wednesday",
					"Thursday",
					"Friday",
					"Saturday",
					"Sunday",
				],
				opens: "08:00",
				closes: "21:00",
			},
		],
		geo: {
			"@type": "GeoCoordinates",
			latitude: "10.79664498748942",
			longitude: "106.65856519879867",
		},
	};
	return (
		<>
			<AppHeader />
			{children}
			<div style={{ marginBottom: "100px" }}></div>
			<Footer />
			<Script
				type="application/ld+json"
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(idJsonObject),
				}}
			/>
		</>
	);
}
