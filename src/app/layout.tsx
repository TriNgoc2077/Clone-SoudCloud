import Footer from "@/components/footer/app.footer";
import AppHeader from "@/components/header/app.header";
import ThemeRegistry from "@/components/theme-registry/theme.registry";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<ThemeRegistry>
					<AppHeader />
					{children}
					<Footer />
				</ThemeRegistry>
			</body>
		</html>
	);
}
