import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export const Progress = ({ value }: { value: number }) => {
	return (
		<div style={{ flex: "0 0 auto", width: "64px" }}>
			<CircularProgressbar value={value} text={`${value.toFixed(0)}%`} />
		</div>
	);
};
