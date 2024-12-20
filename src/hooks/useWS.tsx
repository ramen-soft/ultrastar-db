import { useCallback, useEffect, useState } from "react";
import { WS_HOST } from "../consts";

export interface Message {
	tid: string;
	progress: number;
	done: boolean;
}

export const useWS = () => {
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);

	const [status, setStatus] = useState<{
		[tid: string]: { tid: string; progress: number; done: boolean };
	}>();

	useEffect(() => {
		const ws = new WebSocket(WS_HOST);
		ws.onopen = () => {
			setIsConnected(true);
		};

		ws.onmessage = (event) => {
			const str = JSON.parse(event.data) as Message;
			if (str && typeof str.progress != "undefined") {
				/*onTorrentEvent({
					torrentId: str.tid,
					progress: Number((str.progress ?? 0).toFixed(2)),
					done: str.done,
				});*/

				if (str.done) {
					document.dispatchEvent(
						new CustomEvent("onDownloadComplete", {
							detail: { tid: str.tid },
						})
					);
				}

				setStatus((current) => ({
					...current,
					...{
						[str.tid]: {
							...{
								tid: str.tid,
								done: str.done,
								progress: Number(
									(str.progress ?? 0).toFixed(2)
								),
							},
						},
					},
				}));
			}
		};

		ws.onclose = () => {
			console.log("Desconectado.");
		};
		ws.onerror = (e) => {
			console.log("Error al conectar a WSS", JSON.stringify(e));
		};
		setSocket(ws);

		return () => ws.close();
	}, []);

	const sendMessage = useCallback(
		(msg: string) => {
			if (socket) {
				socket.send(msg);
			}
		},
		[socket]
	);

	return { sendMessage, isConnected, status };
};
