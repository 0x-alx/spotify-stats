"use client";

import { useState } from "react";
import { Input } from "../input";
import Image from "next/image";
import { Button } from "../button";
import { OpenAI } from "openai";
import {
	addTrackToPlaylist,
	createPlaylist,
	getSpotifyProfile,
	getTracks,
	searchSpotifyTrack,
} from "@/hooks/spotifyHooks";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "../table";
// import data from "../../../data/tracks.json";

const Frame = ({ userAccount }: { userAccount: any }) => {
	const openai = new OpenAI({
		apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
		dangerouslyAllowBrowser: true,
	});
	const [tracksInfos, setTracksInfos] = useState([]);
	const [prompt, setPrompt] = useState("");
	const [loading, setLoading] = useState(false);

	const generatePlaylist = async () => {
		setLoading(true);
		const GPTResponse = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{
					role: "system",
					content:
						"You are a music suggester. You love music, and you love to advice people about it. ",
				},
				{
					role: "user",
					content: `${prompt}. T'as réponse doit être un JSON au format suivant : {titles: [{title: 'title', artist: 'artist'}]}`,
				},
			],
			response_format: { type: "json_object" },
		});

		const GPTGeneratedTracklist = JSON.parse(
			GPTResponse.choices[0].message.content!
		);

		let trackListIds: string[] = [];

		const trackSearchPromises = GPTGeneratedTracklist.titles.map(
			async (track: any) => {
				const result = await searchSpotifyTrack({
					accessToken: userAccount?.access_token!,
					query: track.title,
				});
				trackListIds.push(result.tracks.items[0].id);
			}
		);

		await Promise.all(trackSearchPromises);

		const tracksInformations = await getTracks({
			accessToken: userAccount?.access_token!,
			trackIds: trackListIds,
		});
		console.log(tracksInformations.tracks);
		setTracksInfos(tracksInformations.tracks);
		setLoading(false);
	};

	const addPlaylistToSpotify = async () => {
		const spotifyProfile = await getSpotifyProfile({
			accessToken: userAccount?.access_token!,
		});

		const playlist = await createPlaylist({
			accessToken: userAccount?.access_token!,
			userId: spotifyProfile.id,
			name: "SpotifAI PLaylist",
		});

		const trackListIds = tracksInfos.map((track: any) => track.uri);

		await addTrackToPlaylist({
			accessToken: userAccount?.access_token!,
			playlistId: playlist.id,
			trackId: trackListIds,
		});
	};

	function millisToMinutesAndSeconds(millis: number) {
		var minutes = Math.floor(millis / 60000);
		var seconds = Math.round((millis % 60000) / 1000);
		return seconds === 60
			? minutes + 1 + ":00"
			: minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
	}
	return (
		<div className='max-w-[80%] flew-wrap z-10 flex w-full flex-col items-start justify-between gap-8 font-mono text-sm lg:flex'>
			<div>
				<h1 className='text-2xl font-bold'>SpotifAI</h1>
				<p className='text-sm'>
					Your personalized playlist, generated by GPT-3.5
				</p>
			</div>
			<div className='flex flex-col lg:flex-row w-full gap-4 self-center'>
				<Input
					type='text'
					placeholder='Search'
					className='w-full'
					onChange={(e) => setPrompt(e.target.value)}
				/>
				<Button onClick={generatePlaylist}>Generate</Button>
			</div>
			{tracksInfos.length > 0 && (
				<Button onClick={addPlaylistToSpotify}>
					Add Playlist to Spotify
				</Button>
			)}

			<div className='flex flex-wrap self-center'>
				{loading ? (
					<div className='flex size-10 animate-spin rounded-full border-y-4 border-blue-500'></div>
				) : (
					tracksInfos.length > 0 && (
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>#</TableHead>
									<TableHead>Titre</TableHead>
									{/* <TableHead>Album</TableHead>
								<TableHead>Durée</TableHead> */}
								</TableRow>
							</TableHeader>

							<TableBody className='overflow-y-scroll'>
								{tracksInfos.map(
									(track: any, index: number) => (
										<TableRow key={track.id}>
											<TableCell>{index + 1}</TableCell>
											<TableCell className='flex flex-row gap-2'>
												<Image
													src={
														track.album.images[0]
															.url
													}
													alt={track.name}
													width={50}
													height={50}
													className='rounded-md'
												/>
												<div>
													<p className='text-sm'>
														{track.name}
													</p>
													<p className='text-xs'>
														{track.artists[0].name}
													</p>
												</div>
											</TableCell>
											{/* <TableCell>{track.album.name}</TableCell>
									<TableCell>
										{millisToMinutesAndSeconds(
											track.duration_ms
										)}
									</TableCell> */}
										</TableRow>
									)
								)}
							</TableBody>
						</Table>
					)
				)}
			</div>
		</div>
	);
};

export default Frame;
