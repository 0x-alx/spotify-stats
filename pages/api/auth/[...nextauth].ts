import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()
const scope = "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";
export const authConfig = {
    providers: [
        SpotifyProvider({
            clientId: process.env.SPOTIFY_CLIENT_ID!,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
            authorization: {
                params: { scope },
            },
        }),

    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, user }: { session: any, user: any }) {
            const [spotifyAccount] = await prisma.account.findMany({
                where: { userId: user.id, provider: "spotify" },
            })

            if (spotifyAccount.expires_at !== null && spotifyAccount.expires_at * 1000 < Date.now()) {
                // If the access token has expired, try to refresh it
                try {
                    const params = {
                        client_id: process.env.SPOTIFY_CLIENT_ID,
                        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
                        grant_type: "refresh_token",
                        refresh_token: spotifyAccount.refresh_token,
                    };

                    const response = await axios.post("https://accounts.spotify.com/api/token", params, {
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    })
                    console.log('response:', response.data)
                    const tokens = response.data


                    if (response.status !== 200) throw tokens

                    await prisma.account.update({
                        data: {
                            access_token: tokens.access_token,
                            expires_at: Math.floor(Date.now() / 1000 + tokens.expires_in),
                            refresh_token:
                                tokens.refresh_token ?? spotifyAccount.refresh_token,
                        },
                        where: {
                            provider_providerAccountId: {
                                provider: "spotify",
                                providerAccountId: spotifyAccount.providerAccountId,
                            },
                        },
                    })
                } catch (error) {
                    console.error("Error refreshing access token")
                    // The error property will be used client-side to handle the refresh token error
                    session.error = "RefreshAccessTokenError"
                }
            }
            return session
        },
    },

}

export default NextAuth(authConfig)

