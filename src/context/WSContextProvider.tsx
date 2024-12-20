import { createContext, ReactNode, useEffect, useState } from "react";
import { useWS } from "../hooks/useWS";
import { ISong } from "../dto/song.dto";

export const WSContext_ = createContext<{
	sendMessage: (msg: string) => void;
	queue: IDownloadTask[];
	status:
		| {
				[tid: string]: { tid: string; progress: number; done: boolean };
		  }
		| undefined;
	isConnected: boolean;
	download: (song: ISong) => void;
}>({
	sendMessage: () => {},
	queue: [],
	status: {},
	isConnected: false,
	download: () => {},
});

export interface IDownloadTask {
	torrentId: string;
	progress: number;
	done: boolean;
	song: ISong;
}

export const WSContextProvider = ({ children }: { children: ReactNode }) => {
	const [queue, setQueue] = useState<IDownloadTask[]>([]);
	const { sendMessage, status, isConnected } = useWS();

	useEffect(() => {
		if (status) {
			Object.keys(status).forEach((tid) => {
				if (status[tid].done) {
					const qid = queue.findIndex(
						(task) => task.torrentId === tid && task.done == false
					);
					if (qid >= 0) {
						const newQueue = [...queue];
						newQueue.splice(qid, 1, {
							torrentId: queue[qid].torrentId,
							done: true,
							progress: 1,
							song: queue[qid].song,
						});
						setQueue(newQueue);
					}
				}
			});
		}
	}, [status]);

	const download = (song: ISong) => {
		if (!queue.find((task) => task.torrentId === song.id)) {
			setQueue([
				...queue,
				{ torrentId: song.id, progress: 0, done: false, song },
			]);
			sendMessage(song.id);
		}
	};

	return (
		<WSContext_.Provider
			value={{ status, sendMessage, isConnected, queue, download }}
		>
			{children}
		</WSContext_.Provider>
	);
};
