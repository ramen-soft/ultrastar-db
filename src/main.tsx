import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { WSContextProvider } from "./context/WSContextProvider.tsx";

createRoot(document.getElementById("root")!).render(
	<WSContextProvider>
		<App />
	</WSContextProvider>
);
