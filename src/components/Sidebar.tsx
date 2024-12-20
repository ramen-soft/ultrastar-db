import { useCallback, useEffect, useRef } from "react";
import { DownloadQueue } from "./DownloadQueue";

export const Sidebar = ({
	open = true,
	clickedOutside,
}: {
	open?: boolean;
	clickedOutside: () => void;
}) => {
	const clickListener = useCallback(
		(e: MouseEvent) => {
			if (!divRef.current?.contains(e.target as HTMLElement)) {
				clickedOutside();
			}
		},
		[clickedOutside]
	);
	const divRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		let _to: number;
		if (open) {
			_to = setTimeout(() => {
				document.addEventListener("click", clickListener);
			}, 100);
		}
		return () => {
			clearTimeout(_to);
			document.removeEventListener("click", clickListener);
		};
	}, [open, clickListener]);

	return (
		<>
			<div
				ref={divRef}
				className={`sidebar ${open ? "sidebar__open" : ""}`}
			>
				<h3>Cola de descargas</h3>
				<DownloadQueue />
			</div>
			<div className="sidebar-backdrop"></div>
		</>
	);
};
