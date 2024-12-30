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
		<div className={`download-task ${task.error ? "error" : ""}`}>
			<Progress value={progress * 100} error={task.error} />
			<div className="task-info">
				<strong>
					{task.song.title} - {task.song.artist_name}
				</strong>
				{task.error && (
					<small style={{ color: "red", fontSize: "12px" }}>
						{task.errormessage}
					</small>
				)}
				{!task.error && <small>{task.torrentId}</small>}
			</div>
		</div>
	);
};
