/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	// output: "standalone",
	swcMinify: true,
	modularizeImports: {
		"@mui/icons-material": {
			transform: "@mui/icons-material/{{member}}",
		},
	},
	// images: {
	// 	remotePatterns: [
	// 		{
	// 			protocol: "https",
	// 			hostname: "backend-soundcloud.onrender.com",
	// 			port: "8000",
	// 			pathname: "/images/**",
	// 		},
	// 		// {
	// 		// 	protocol: "http",
	// 		// 	hostname: "host.docker.internal",
	// 		// 	port: "8001",
	// 		// 	pathname: "/images/**",
	// 		// },
	// 	],
	// },
	images: {
		domains: ['backend-soundcloud.onrender.com'],
	},
	experimental: {
		missingSuspenseWithCSRBailout: false,
	},
};

module.exports = nextConfig;
