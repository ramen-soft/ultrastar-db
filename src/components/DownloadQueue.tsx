import { useContext } from "react";
import { DownloadTask } from "./DownloadTask";
import { WSContext_ } from "../context/WSContextProvider";

export const DownloadQueue = () => {
	const { queue } = useContext(WSContext_);

	return (
		<div className="download-queue">
			{queue.map((task) => (
				<DownloadTask key={task.torrentId} task={task} />
			))}

			{!queue.length && <p>No hay ninguna canción en la cola.</p>}
		</div>
	);
};
