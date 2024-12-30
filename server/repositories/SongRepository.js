export class SongRepository {
	constructor(db) {
		this.db = db;
	}

	async find(titleOrArtist) {
		return new Promise((resolve, reject) => {
			const params = [];
			const where = titleOrArtist
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
			if (titleOrArtist) {
				params.push("%" + titleOrArtist + "%");
				params.push("%" + titleOrArtist + "%");
				params.push("%" + titleOrArtist + "%");
				params.push("%" + titleOrArtist + "%");
			}

			this.db.all(
				`SELECT s.*, a.name artist_name FROM songs s JOIN artists a on a.id = s.artist_id ${where} LIMIT 0, 48 COLLATE NOACCENTS`,
				params,
				(err, row) => {
					if (!err) {
						resolve(row);
					} else {
						reject(err);
					}
				}
			);
		});
	}
}
