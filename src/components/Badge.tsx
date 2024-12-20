import { ReactNode } from "react";

export const Badge = ({ children }: { children?: ReactNode }) => {
	return <div className="badge">{children}</div>;
};
