import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Soundcloud",
		short_name: "Soundcloud",
		description: "Enjoy your music",
		icons: [
			{
				src: "https://fabrikbrands.com/wp-content/uploads/Soundcloud-Logo-History-1-1155x770.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "https://fabrikbrands.com/wp-content/uploads/Soundcloud-Logo-History-1-1155x770.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
		theme_color: "#1A94FF",
		background_color: "#1A94FF",
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		related_applications: [
			{
				platform: "play",
				url: "https://play.google.com/store/apps/details?id=vn.tiki.app.tikiandroid",
				id: "vn.tiki.app.tikiandroid",
			},
			{
				platform: "itunes",
				url: "https://apps.apple.com/vn/app/tiki-shopping-fast-shipping/id958100553",
			},
			{
				platform: "webapp",
				url: "https://tiki.vn/manifest.json",
			},
		],
		scope: "/",
	};
}
