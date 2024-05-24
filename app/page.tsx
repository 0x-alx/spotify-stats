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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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

	const topTracksLongTerm = await getSpotifyTopTracks({
		accessToken: userAccount?.access_token!,
		timeRange: "long_term",
	});

	const topArtistsLongTerm = await getSpotifyTopArtists({
		accessToken: userAccount?.access_token!,
		timeRange: "long_term",
	});

	const topTracksMediumTerm = await getSpotifyTopTracks({
		accessToken: userAccount?.access_token!,
		timeRange: "medium_term",
	});

	const topArtistsMediumTerm = await getSpotifyTopArtists({
		accessToken: userAccount?.access_token!,
		timeRange: "medium_term",
	});

	const topTracksShortTerm = await getSpotifyTopTracks({
		accessToken: userAccount?.access_token!,
		timeRange: "short_term",
	});

	const topArtistsShortTerm = await getSpotifyTopArtists({
		accessToken: userAccount?.access_token!,
		timeRange: "short_term",
	});

	console.log(data);
	// console.log(topTracks.items);
	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-24'>
			<div className='z-10 flex w-full max-w-5xl flex-col  items-center justify-between gap-8 font-mono text-sm lg:flex'>
				<Tabs
					defaultValue='short_term'
					className='flex flex-col'
				>
					<TabsList>
						<TabsTrigger value='short_term'>1 Month</TabsTrigger>
						<TabsTrigger value='medium_term'>6 Months</TabsTrigger>
						<TabsTrigger value='long_term'>1 Year</TabsTrigger>
					</TabsList>
					<TabsContent
						value='short_term'
						className='flex gap-10 flex-wrap'
					>
						<div>
							<h3 className='text-lg font-bold'>Top Tracks</h3>
							<ul>
								{topTracksShortTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-bold'>Top Artists</h3>
							<ul>
								{topArtistsShortTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
					</TabsContent>
					<TabsContent
						value='medium_term'
						className='flex gap-10 flex-wrap'
					>
						<div>
							<h3 className='text-lg font-bold'>Top Tracks</h3>
							<ul>
								{topTracksMediumTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-bold'>Top Artists</h3>
							<ul>
								{topArtistsMediumTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
					</TabsContent>
					<TabsContent
						value='long_term'
						className='flex flex-wrap gap-10'
					>
						<div>
							<h3 className='text-lg font-bold'>Top Tracks</h3>
							<ul>
								{topTracksLongTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
						<div>
							<h3 className='text-lg font-bold'>Top Artists</h3>
							<ul>
								{topArtistsLongTerm.items
									.sort(
										(a: any, b: any) =>
											b.popularity - a.popularity
									)
									.map((track: any) => (
										<li key={track.id}>{track.name}</li>
									))}
							</ul>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</main>
	);
}
