import { useEffect, useState } from "react";
import "./App.css";
import { getSongs, searchSongs } from "./lib/server";
import { ISong } from "./dto/song.dto";
import { useDebounce } from "@uidotdev/usehooks";
import { SongList } from "./components/SongList";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";

function App() {
	const [songs, setSongs] = useState<ISong[]>([]);
	const [search, setSearch] = useState<string>("");
	const [showSidebar, setShowSidebar] = useState<boolean>(false);
	const [isSearching, setIsSearching] = useState<boolean>(false);

	const debouncedSearch = useDebounce(search, 150);

	useEffect(() => {
		setIsSearching(true);
		getSongs().then((songs) => {
			setIsSearching(false);
			setSongs(songs);
		});
	}, []);

	useEffect(() => {
		setIsSearching(true);
		searchSongs(debouncedSearch).then((songs) => {
			setIsSearching(false);
			setSongs(songs);
		});
	}, [debouncedSearch]);

	return (
		<>
			<Navbar onSidebarToggle={() => setShowSidebar(!showSidebar)} />

			<Sidebar
				clickedOutside={() => setShowSidebar(false)}
				open={showSidebar}
			/>
			<SearchBar onChange={(e) => setSearch(e.target.value)} />
			<main>
				{!isSearching && songs.length ? (
					<SongList songs={songs} />
				) : (
					<p>No se han encontrado canciones.</p>
				)}
				{isSearching && <p>Buscando...</p>}
			</main>
		</>
	);
}

export default App;
