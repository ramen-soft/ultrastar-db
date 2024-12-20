import { useContext } from "react";
import { ISong } from "../dto/song.dto";
import { WSContext_ } from "../context/WSContextProvider";

export const Song = ({ song }: { song: ISong }) => {
	const { download } = useContext(WSContext_);
	const handleSongClick = () => {
		//setIsDownloading(true);
		download(song);
	};
	return (
		<>
			<article className="song">
				<img src={"http:" + song.cover} width="100%" />
				<div className="info">
					<h3>{song.title}</h3>
					<em>{song.artist_name}</em>
					<p>{song.description}</p>
					<button onClick={() => handleSongClick()}>Descargar</button>
				</div>
			</article>
		</>
	);
};
