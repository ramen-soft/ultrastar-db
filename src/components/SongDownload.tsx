import { useContext, useEffect, useMemo } from "react";
import { WSContext_ } from "../context/WSContextProvider";

export const SongDownload = ({ id }: { id: string }) => {
	const { sendMessage, status, isConnected } = useContext(WSContext_);

	const stat = useMemo(() => status, [status]);

	useEffect(() => {
		if (isConnected) sendMessage(id);
	}, [id, isConnected, sendMessage]);
	return <div>{stat && stat[id] && <p>{stat[id].progress}</p>}</div>;
};
