import express from "express";
import http from "http";
import cors from "cors";
import pkg from "sqlite3";
import url from "url";
import { SongRepository } from "./repositories/SongRepository.js";
import {
	addClient,
	callMe,
	clientExists,
	connectedClients,
	getClient,
} from "./util.js";
import { WebSocketServer } from "ws";
import { TorrentHelper } from "./helpers/TorrentHelper.js";

const { Database } = pkg;

const db = new Database("ultra.db");
const sr = new SongRepository(db);
const tor = new TorrentHelper();
const app = express();
app.use(cors());

const port = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on("connection", (sck, req) => {
	const params = new URLSearchParams(url.parse(req.url).query);
	const wid = params.get("token");
	sck.id = wid;
	sck.on("message", (message) => {
		console.log(`Mensaje recibido ${message}`);
		try {
			tor.addTorrent(sck, message.toString());
		} catch (e) {
			console.error(e.message);
		}
	});

	sck.on("close", () => {
		console.log("Cliente desconectado");
	});

	let client;
	if (!clientExists(wid)) {
		console.log(`Nuevo cliente conectado: ${wid}`);
		client = addClient(wid, sck);
	} else {
		console.log(`Cliente reconectado: ${wid}`);
		client = getClient(wid);
		client.socket = sck;
		console.log(client.socket.listeners());
	}
});

app.get("/songs", async (req, res) => {
	const { s } = req.query;
	try {
		const results = await sr.find(s);

		res.send(results);
	} catch (e) {
		console.log(e);
	}
});

server.listen(port, () => {
	console.info(`Servidor escuchando en el puerto ${port}`);
});
