import express from "express";
import pkg from "sqlite3";
import WebTorrent from "webtorrent";
import fs from "fs-extra";
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";

const { Database } = pkg;
const db = new Database("ultra.db");
const app = express();
app.use(cors());
const port = 3000;

//const DOWNLOAD_FOLDER = "D:/songs/";
const DOWNLOAD_FOLDER = "./downloads/";
const SONGS_FOLDER = "D:/Juegos/Ultrastar/songs/";

const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const client = new WebTorrent();

const downloadSong = (ws, tid) => {
	try {
			console.log(tid, './torrents/'+tid+'.torrent');
		if (fs.existsSync("./torrents/" + tid + ".torrent")) {
			fs.readFile("./torrents/" + tid + ".torrent", (err, data) => {
				if (!err) {
					client.add(data, { path: DOWNLOAD_FOLDER }, (torrent) => {
						console.log(
							torrent.name,
							torrent.files.map((file) => file.name)
						);
						let progress = 0;
						torrent.on("done", () => {
							progress = 1;

							ws.send(
								JSON.stringify({
									tid: String(tid),
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
										`Error al mover la cancion al destino:`,
										e
									);
								}
							});
						});
						torrent.on("download", (bytes) => {
							if (torrent.progress - progress >= 0.01) {
								ws.send(
									JSON.stringify({
										tid: String(tid),
										progress: torrent.progress,
										done: false,
									})
								);
								progress = torrent.progress;
							}
						});
					});
				} else {
					throw err;
				}
			});
		} else {
			throw new Error("file does not exists.");
		}
	} catch (e) {
		throw e;
	}
};

wss.on("connection", (ws) => {
	console.log("cliente conectado");

	ws.on("message", (message) => {
		console.log(`Mensaje recibido ${message}`);
		try {
			downloadSong(ws, message.toString());
		} catch (e) {
			console.error(e);
		}
		//ws.send(`Echo: ${message}`);
	});

	ws.on("close", () => {
		console.log("Cliente desconectado");
	});
});

app.get("/songs", (req, res) => {
	const { s } = req.query;
	const params = [];
	const where = s
		? ` WHERE LOWER(s.title) LIKE ? OR REPLACE(
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(LOWER(s.title), 'á', 'a'), 'é', 'e'
            ), 'í', 'i'
        ), 'ó', 'o'
    ), 'ú', 'u'
) LIKE ? OR LOWER(a.name) LIKE ? OR REPLACE(
    REPLACE(
        REPLACE(
            REPLACE(
                REPLACE(LOWER(a.name), 'á', 'a'), 'é', 'e'
            ), 'í', 'i'
        ), 'ó', 'o'
    ), 'ú', 'u'
) LIKE ?`
		: "";
	if (s) {
		params.push("%" + s + "%");
		params.push("%" + s + "%");
		params.push("%" + s + "%");
		params.push("%" + s + "%");
	}

	db.all(
		`SELECT s.*, a.name artist_name FROM songs s JOIN artists a on a.id = s.artist_id ${where} LIMIT 0, 48 COLLATE NOACCENTS`,
		params,
		(err, row) => res.send(row)
	);
});
/*
app.get("/songs/:tid", async (req, res) => {
	const { tid } = req.params;
	try {
		if (tid) {
			const client = new WebTorrent();
			fs.readFile("./torrents/" + tid + ".torrent", (err, data) => {
				if (!err) {
					client.add(data, { path: "./downloads/" }, (torrent) => {
						torrent.on("done", () => res.send({ done: true }));
						torrent.on("download", (bytes) => {
							console.log(
								"[" +
									torrent.progress * 100 +
									"%] downloaded " +
									bytes +
									" of " +
									torrent.downloaded +
									" @ " +
									torrent.downloadSpeed
							);
						});
					});
				} else {
					throw err;
				}
			});
		} else {
			throw new Error("Torrent Id not found");
		}
	} catch (e) {
		res.status(401).end(e);
	}
});
*/
server.listen(port, () => {
	console.log("Servidor escuchando en el puerto", port);
});
