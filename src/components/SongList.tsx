import { ISong } from "../dto/song.dto";
import { Song } from "./Song";

export const SongList = ({ songs }: { songs: ISong[] }) => {
	return (
		<>
			<div className="song-list">
				{songs.map((song) => (
					<Song key={song.id} song={song} />
				))}
			</div>
		</>
	);
};
