import { ENDPOINT_URL } from "../consts";

export const getSongs = async () => {
	const res = await fetch(`${ENDPOINT_URL}/songs`);
	const songs = await res.json();
	return songs;
};

export const searchSongs = async (q: string) => {
	const res = await fetch(`${ENDPOINT_URL}/songs?s=${q}`);
	const songs = await res.json();
	return songs;
};
