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

export const searchSpotifyTrack = async ({
	accessToken,
	query,
}: {
	accessToken: string;
	query: string;
}) => {
	const response = await axios.get(`${SPOTIFY_API_URL}/search`, {
		params: {
			q: `track:${query}`,
			type: "track",
			limit: 1,
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
};

export const getTracks = async ({
	accessToken,
	trackIds,
}: {
	accessToken: string;
	trackIds: string[];
}) => {
	const response = await axios.get(`${SPOTIFY_API_URL}/tracks`, {
		params: {
			ids: trackIds.join(","),
		},
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	});
	return response.data;
};

export const createPlaylist = async ({
	accessToken,
	name,
	userId,
}: {
	accessToken: string;
	name: string;
	userId: string;
}) => {
	const response = await axios.post(
		`${SPOTIFY_API_URL}/users/${userId}/playlists`,
		{
			name: name,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	return response.data;
};

export const addTrackToPlaylist = async ({
	accessToken,
	playlistId,
	trackId,
}: {
	accessToken: string;
	playlistId: string;
	trackId: string[];
}) => {
	const response = await axios.post(
		`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
		{
			uris: trackId,
		},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		}
	);
	return response.data;
};
