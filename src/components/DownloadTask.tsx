import { useContext, useEffect, useState } from "react";
import { Progress } from "./Progress";
import { IDownloadTask, WSContext_ } from "../context/WSContextProvider";

export const DownloadTask = ({ task }: { task: IDownloadTask }) => {
	const { status } = useContext(WSContext_);
	const [progress, setProgress] = useState<number>(0);

	useEffect(() => {
		if (status && status[task.torrentId]) {
			setProgress(status[task.torrentId].progress);
		}
	}, [status, task.torrentId]);

	return (
		<div className="download-task">
			<Progress value={progress * 100} />
			<div className="task-info">
				<strong>
					{task.song.title} - {task.song.artist_name}
				</strong>
				<small>{task.torrentId}</small>
			</div>
		</div>
	);
};
