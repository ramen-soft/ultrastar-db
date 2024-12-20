import { ChangeEventHandler } from "react";

export const SearchBar = ({
	onChange,
}: {
	onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
	return (
		<div className="search-bar">
			<input
				type="text"
				placeholder="Buscar por canción, artista..."
				onChange={onChange}
			/>
		</div>
	);
};
