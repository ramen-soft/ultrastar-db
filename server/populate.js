import pkg from "sqlite3";
const { Database } = pkg;

const db = new Database("ultra.db");
import songs from "./songs.json" assert { type: "json" };

db.exec(`DROP TABLE songs`);
db.exec(`
    CREATE TABLE IF NOT EXISTS artists (
        id INTEGER PRIMARY KEY,
        name VARCHAR2(255)
    );

    CREATE TABLE IF NOT EXISTS songs (
        id CHAR(32) PRIMARY KEY,
        title VARCHAR2(255),
        artist_id INT
    );
`);

function runAsync(db, query, params = []) {
	return new Promise((resolve, reject) => {
		db.run(query, params, function (err) {
			if (err) reject(err);
			else resolve(this);
		});
	});
}

// Función para promisificar db.get
function getAsync(db, query, params = []) {
	return new Promise((resolve, reject) => {
		db.get(query, params, function (err, row) {
			if (err) reject(err);
			else resolve(row);
		});
	});
}

const artists = [...new Set(songs.map((song) => song.artista))];
console.log(artists.length);

function insertarArtistas(artistas) {
	return new Promise((resolve, reject) => {
		const query = `INSERT INTO artists (name) VALUES (?)`;

		// Iniciar transacción para eficiencia
		db.serialize(() => {
			db.run("BEGIN TRANSACTION");

			artistas.forEach((artista) => {
				db.run(query, [artista], function (err) {
					if (err) {
						console.error("Error al insertar:", err.message);
						reject(err);
					} else {
						console.log(`Artista insertado con ID: ${this.lastID}`);
					}
				});
			});

			db.run("COMMIT", (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(
						"Todos los artistas fueron insertados correctamente."
					);
				}
			});
		});
	});
}

function insertarCanciones(canciones) {
	return new Promise((resolve, reject) => {
		const query = `INSERT INTO songs (id, title, artist_id) VALUES (?, ?, ?)`;

		// Iniciar transacción para eficiencia
		db.serialize(async () => {
			try {
				await runAsync(db, "BEGIN TRANSACTION");

				for (const cancion of canciones) {
					const row = await getAsync(
						db,
						`SELECT id FROM artists WHERE name = ?`,
						[cancion.artista]
					);
					if (row) {
						await runAsync(db, query, [
							cancion.id,
							cancion.titulo,
							row.id,
						]);
						console.log("Cancion insertada");
					}
				}

				await runAsync(db, "COMMIT");
				resolve("Todas las canciones se han insertado");
			} catch (err) {
				reject("Error al cargar canciones");
			}
		});
	});
}
/*
insertarArtistas(artists)
	.then((msg) => {
		console.log(msg);
	})
	.catch((err) => console.error(err));
*/

insertarCanciones(songs)
	.then((msg) => console.log(msg))
	.catch((err) => console.error(err));
/*
songs.forEach((song) => {
	const artist = song.artista;
	let artistId;
	db.run(`SELECT id FROM artist WHERE name = ?`, [artist], (err, row) => {
		if (!row) {
			const query = `INSERT INTO artist (name) VALUES (?)`;
			const params = [artist];
			console.log(artist);
			db.run(query, params, function (err) {
				console.log(this.lastID, err);
				artistId = this.lastID;
				console.log(artistId);
				db.run(
					`INSERT INTO songs (id, title, artist_id) VALUES (?, ?)`,
					[song.id, song.titulo, artistId]
				);
			});
		} else {
			artistId = row.id;
			db.run(`INSERT INTO songs (id, title, artist_id) VALUES (?, ?)`, [
				song.id,
				song.titulo,
				artistId,
			]);
		}
	});
});
*/
