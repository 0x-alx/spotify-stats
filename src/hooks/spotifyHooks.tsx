import axios from "axios";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

export const getSpotifyProfile = async ({
	accessToken,
}: {
	accessToken: string;
}) => {
	const response = await axios.get(`${SPOTIFY_API_URL}/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
};

export const getSpotifyTopTracks = async ({
	accessToken,
	timeRange,
}: {
	accessToken: string;
	timeRange: string;
}) => {
	const response = await axios.get(`${SPOTIFY_API_URL}/me/top/tracks`, {
		params: {
			time_range: timeRange,
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
};

export const getSpotifyTopArtists = async ({
	accessToken,
	timeRange,
}: {
	accessToken: string;
	timeRange: string;
}) => {
	const response = await axios.get(`${SPOTIFY_API_URL}/me/top/artists`, {
		params: {
			time_range: timeRange,
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
};
