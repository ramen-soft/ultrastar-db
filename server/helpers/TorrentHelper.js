import fs from "fs-extra";
import WebTorrent from "webtorrent";
import { DOWNLOAD_FOLDER, SERVER_PATH, SONGS_FOLDER } from "../consts.js";

export class TorrentHelper {
	constructor() {
		this.client = new WebTorrent();
	}

	addTorrent(ws, torrentId) {
		try {
			if (fs.existsSync(`${SERVER_PATH}/torrents/${torrentId}.torrent`)) {
				fs.readFile(
					`${SERVER_PATH}/torrents/${torrentId}.torrent`,
					(err, data) => {
						if (!err) {
							this.client.add(
								data,
								{ path: DOWNLOAD_FOLDER },
								(torrent) => {
									let progress = 0;
									torrent.on("done", () => {
										progress = 1;

										ws.send(
											JSON.stringify({
												event: "torrentDone",
												tid: String(torrentId),
												progress: 1,
												done: true,
											})
										);

										torrent.destroy(() => {
											try {
												if (
													!fs.existsSync(
														`${SONGS_FOLDER}${torrent.name}`
													)
												) {
													fs.moveSync(
														`${DOWNLOAD_FOLDER}${torrent.name}`,
														`${SONGS_FOLDER}${torrent.name}`
													);
												}
											} catch (e) {
												console.error(
													`Error al mover la cancion al destino: ${e.message}`
												);
											}
										});
									});

									torrent.on("download", (bytes) => {
										if (
											torrent.progress - progress >=
											0.01
										) {
											ws.send(
												JSON.stringify({
													event: "download",
													tid: String(torrentId),
													progress: torrent.progress,
													done: false,
												})
											);
											progress = torrent.progress;
										}
									});
								}
							);
						} else {
							throw err;
						}
					}
				);
			} else {
				ws.send(
					JSON.stringify({
						event: "error",
						tid: String(torrentId),
						progress: 0,
						done: false,
						message: "File not found",
					})
				);
				throw new Error(`File ${torrentId}.torrent does not exists.`);
			}
		} catch (e) {
			throw e;
		}
	}
}
