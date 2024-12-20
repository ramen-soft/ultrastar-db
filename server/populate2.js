import pkg from "sqlite3";
const { Database } = pkg;

const db = new Database("ultra.db");
import info from "./info.json" assert { type: "json" };

function addInfo(info) {
	return new Promise((resolve, reject) => {
		const query = `UPDATE songs SET description = ?, cover = ? WHERE id = ?`;

		// Iniciar transacción para eficiencia
		db.serialize(() => {
			db.run("BEGIN TRANSACTION");

			info.forEach((entry) => {
				db.run(
					query,
					[entry.descripcion, entry.portada, entry.id],
					function (err) {
						if (err) {
							console.error("Error al actualizar:", err.message);
							reject(err);
						} else {
							console.log(
								`Cancion actualizada con ID: ${entry.id}`
							);
						}
					}
				);
			});

			db.run("COMMIT", (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(
						"Todas las canciones fueron actualizadas correctamente."
					);
				}
			});
		});
	});
}

addInfo(info);
