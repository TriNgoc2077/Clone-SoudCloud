import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { AuthOptions } from "next-auth";
import { sendRequest } from "@/utils/api";
import { JWT } from "next-auth/jwt";
import { TokenOutlined } from "@mui/icons-material";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
	// Configure one or more authentication providers
	secret: process.env.NO_SECRET,
	providers: [
		// ...add more providers here
		CredentialsProvider({
			// The name to display on the sign in form (e.g. 'Sign in with...')
			name: "Soudcloud",
			// The credentials is used to generate a suitable form on the sign in page.
			// You can specify whatever fields you are expecting to be submitted.
			// e.g. domain, username, password, 2FA token, etc.
			// You can pass any HTML attribute to the <input> tag through the object.
			credentials: {
				username: {
					label: "Username",
					type: "text",
					placeholder: "jsmith@example.com",
				},
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials, req) {
				// You need to provide your own logic here that takes the credentials
				// submitted and returns either a object representing a user or value
				// that is false/null if the credentials are invalid.
				// e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
				// You can also use the `req` object to obtain additional parameters
				// (i.e., the request IP address)
				const res = await sendRequest<IBackendRes<JWT>>({
					url: "http://localhost:8000/api/v1/auth/login",
					method: "POST",
					body: {
						username: credentials?.username,
						password: credentials?.password,
					},
				});
				// If no error and we have user data, return it
				if (res && res.data) {
					return res.data as any;
				}
				// Return null if user data could not be retrieved
				throw new Error(res.message as string);
			},
		}),
		GithubProvider({
			clientId: process.env.GITHUB_ID!,
			clientSecret: process.env.GITHUB_SECRET!,
		}),
	],
	callbacks: {
		async jwt({ token, user, account, profile, trigger }) {
			if (trigger === "signIn" && account?.provider !== "credentials") {
				const res = await sendRequest<IBackendRes<JWT>>({
					url: "http://localhost:8000/api/v1/auth/social-media",
					method: "POST",
					body: {
						type: account?.provider.toLocaleUpperCase(),
						username: user.email,
					},
				});

				if (res.data) {
					token.access_token = res.data.access_token;
					token.refresh_token = res.data.refresh_token;
					token.user = res.data.user;
				}
			}

			if (trigger === "signIn" && account?.provider === "credentials") {
				//local data
				//@ts-ignore
				token.access_token = user.access_token;
				//@ts-ignore
				token.refresh_token = user.refresh_token;
				//@ts-ignore
				token.user = user.user;
			}
			return token;
		},
		session({ session, user, token }) {
			if (token) {
				session.access_token = token.access_token;
				session.refresh_token = token.refresh_token;
				session.user = token.user;
			}
			// session.address = token.address;
			return session;
		},
	},
	// pages: {
	// 	signIn: "auth/signin",
	// },
};
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
