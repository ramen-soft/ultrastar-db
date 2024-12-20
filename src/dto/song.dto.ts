export interface ISong {
	id: string;
	title: string;
	description: string;
	cover: string;
	artist_id: number;
	artist_name: string;
}

export type ISongs = ISong[];
