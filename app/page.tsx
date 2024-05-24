import { getServerSession } from "next-auth";
import { authConfig } from "../pages/api/auth/[...nextauth]";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

export default async function Home() {
	const session = await getServerSession(authConfig);
	console.log(session);

	const prisma = new PrismaClient();

	const getUserInfos = async () => {
		if (session && session.user) {
			const findUserInfo = await prisma.user.findUnique({
				where: { email: session.user.email! },
			});
			return findUserInfo;
		}
	};

	const userInfos = await getUserInfos();

	const userAccount = await prisma.account.findFirst({
		where: { userId: userInfos?.id },
	});

	const fetchSpotifyProfile = async () => {
		if (session && session.user) {
			try {
				const response = await axios.get(
					"https://api.spotify.com/v1/me",
					{
						headers: {
							Authorization: `Bearer ${userAccount?.access_token}`,
						},
					}
				);
				console.log(response.data);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération du profil Spotify",
					error
				);
			}
		}
	};

	await fetchSpotifyProfile();

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<div className='z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex'></div>
		</main>
	);
}
