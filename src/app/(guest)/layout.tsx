import "@/styles/app.css";
import type { Metadata } from 'next';

export const metadata: Metadata = {
	title: "Sign In",
	description: "start your enjoy !",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>{children}</>;
}
