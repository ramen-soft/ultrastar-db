import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const Progress = ({
	value,
	error = false,
}: {
	value: number;
	error?: boolean;
}) => {
	const style = error
		? { text: { stroke: "red" }, trail: { stroke: "red" } }
		: {};

	return (
		<div style={{ flex: "0 0 auto", width: "64px" }}>
			<CircularProgressbar
				styles={style}
				value={value}
				text={`${value.toFixed(0)}%`}
			/>
		</div>
	);
};
