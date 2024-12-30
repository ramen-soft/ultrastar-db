export const callMe = (str) => {
	console.log(str);
};

export const connectedClients = [];

export const clientExists = (wid) => {
	return connectedClients.find((cc) => cc.id === wid) ? true : false;
};

export const addClient = (wid, sck) => {
	connectedClients.push({
		id: wid,
		socket: sck,
		tasks: [],
	});
	return sck;
};

export const getClient = (wid) => {
	return connectedClients.find((cc) => cc.id === wid) ?? null;
};
