import { getServerSession } from "next-auth";
import { authConfig } from "../pages/api/auth/[...nextauth]";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import {
	getSpotifyProfile,
	getSpotifyTopArtists,
	getSpotifyTopTracks,
} from "@/hooks/spotifyHooks";

export default async function Home() {
	const session = await getServerSession(authConfig);
	console.log(session);

	const prisma = new PrismaClient();

	const getUserInfos = async () => {
		if (session && session.user) {
			const findUserInfo = await prisma.user.findUnique({
				where: { email: session.user.email },
			});
			return findUserInfo;
		}
	};

	const userInfos = await getUserInfos();

	const userAccount = await prisma.account.findFirst({
		where: { userId: userInfos?.id },
	});

	const data = await getSpotifyProfile({
		accessToken: userAccount?.access_token!,
	});

	const topTracks = await getSpotifyTopTracks({
		accessToken: userAccount?.access_token!,
		timeRange: "short_term",
	});

	const topArtists = await getSpotifyTopArtists({
		accessToken: userAccount?.access_token!,
		timeRange: "short_term",
	});

	console.log(data);
	console.log(topTracks.items);
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<div className='z-10 flex w-full max-w-5xl flex-col  items-center justify-between gap-8 font-mono text-sm lg:flex'>
				<h1>ONE MONTH RECORD</h1>
				<div className='flex flex-wrap gap-10'>
					<div>
						<h1 className='font-bold'>TOP TRACKS</h1>
						<ul>
							{topTracks.items
								.sort(
									(a: any, b: any) =>
										b.popularity - a.popularity
								)
								.map((track: any) => (
									<li key={track.id}>
										{track.name} / Popularity:{" "}
										{track.popularity}
									</li>
								))}
						</ul>
					</div>
					<div>
						<h1 className='font-bold'>TOP ARTISTS</h1>
						<ul>
							{topArtists.items
								.sort(
									(a: any, b: any) =>
										b.popularity - a.popularity
								)
								.map((track: any) => (
									<li key={track.id}>
										{track.name} / Popularity:{" "}
										{track.popularity}
									</li>
								))}
						</ul>
					</div>
				</div>
			</div>
		</main>
	);
}
