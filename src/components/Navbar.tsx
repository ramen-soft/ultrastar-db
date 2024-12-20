import { useContext, useEffect, useRef } from "react";
import { Badge } from "./Badge";
import { WSContext_ } from "../context/WSContextProvider";

export const Navbar = ({
	onSidebarToggle = () => {},
}: {
	onSidebarToggle: () => void;
}) => {
	const { queue } = useContext(WSContext_);
	const queueRef = useRef<HTMLLIElement>(null);
	const lastQueueLength = useRef(0);

	useEffect(() => {
		if (queue.length > lastQueueLength.current) {
			queueRef.current
				?.querySelector(".badge")
				?.classList.add("updated-animation");
			const _to = setTimeout(
				() =>
					queueRef.current
						?.querySelector(".badge")
						?.classList.remove("updated-animation"),
				500
			);
			lastQueueLength.current = queue.length;
			return () => clearTimeout(_to);
		}
	}, [queue.length]);

	return (
		<div className="navbar">
			<h1>Canciones Karaoke</h1>
			<ul>
				<li onClick={() => onSidebarToggle()} ref={queueRef}>
					<span>Cola de descargas</span>
					<Badge>
						{queue.filter((item) => item.done == false).length}
					</Badge>
				</li>
			</ul>
		</div>
	);
};
