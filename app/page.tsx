import { getServerSession } from "next-auth";
import { authConfig } from "../pages/api/auth/[...nextauth]";
import OpenAI from "openai";
import axios from "axios";
import { PrismaClient } from "@prisma/client";
import {
	addTrackToPlaylist,
	createPlaylist,
	getSpotifyProfile,
	getTracks,
	searchSpotifyTrack,
} from "@/hooks/spotifyHooks";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Frame from "@/components/ui/custom/Frame";

export default async function Home() {
	const session = await getServerSession(authConfig);
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

	return (
		<main className='flex min-h-screen flex-col items-center justify-between p-4 lg:p-48'>
			<Frame userAccount={userAccount} />
		</main>
	);
}
