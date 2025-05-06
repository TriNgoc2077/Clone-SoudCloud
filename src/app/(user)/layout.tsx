import Footer from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<AppHeader />
			{children}
			<Footer />
		</>
	);
}
