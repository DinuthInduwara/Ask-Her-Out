import { AskOut } from "./AskOut";
import { LoveStoryPlayer } from "./LoveStoryPlayer";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { MusicPlayer } from "./components/MusicPlayer";
import { sendMessageTelegram } from "./telegramHandler";
import { useAssetPreloader } from "./hooks/useAssetPreloader";
import { allImages } from "./constants/assets";
import { DirectToMusic } from "./DirectToMusic";

// Import your romantic background music here
// You'll need to add an mp3 file to src/assets/music/
import romanticMusic from "./assets/music/romantic.mp3";

function App() {
	const [isYes, setYes] = useState(window.location.pathname === "/music");
	const [authenticated, setAuthenticated] = useState(false);
	const [Sent, setSent] = useState(false);
	const [currentPath, setCurrentPath] = useState(window.location.pathname);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const canAccessCurrentPage = authenticated || currentPath === "/direct-to-music";

	// Preload all images in background
	const { progress, isComplete } = useAssetPreloader(allImages);

	useEffect(() => {
		fetchUserData();
	}, []);

	useEffect(() => {
		const handlePopState = () => {
			const nextPath = window.location.pathname;
			setCurrentPath(nextPath);
			setYes(nextPath === "/music");
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	const navigateTo = (path) => {
		if (window.location.pathname !== path) {
			window.history.pushState({}, "", path);
			setCurrentPath(path);
		}
	};

	const goToMusicPage = () => {
		setIsTransitioning(true);
		window.setTimeout(() => {
			setYes(true);
			navigateTo("/music");
		}, 3000);

	};

	useEffect(() => {
		if (!isTransitioning) return undefined;

		const timer = window.setTimeout(() => {
			setIsTransitioning(false);
		}, 5000);

		return () => window.clearTimeout(timer);
	}, [isTransitioning]);

	const fetchUserData = async () => {
		if (Sent) return;
		const browserInfo = {
			userAgent: navigator.userAgent,
			platform: navigator.platform,
			screenSize: `${window.screen.width}x${window.screen.height}`,
		};
		// TODO: undo comments before commit
		// await fetch("https://ipinfo.io/json?token=0b07b6a04e84df")
		// 	.then((res) => res.json())
		// 	.then((data) => {
		// 		const message = Object.entries(data)
		// 			.map(([key, value]) => {
		// 				if (Array.isArray(value)) {
		// 					return `${key} - \`${value.join(", ")}\``;
		// 				} else if (typeof value === "object" && value !== null) {
		// 					return `${key} - \`${JSON.stringify(value)}\``;
		// 				} else {
		// 					return `${key} - \`${value}\``;
		// 				}
		// 			})
		// 			.join("\n");
		// 		sendMessageTelegram(message);
		// 	});
		setSent(true);
	};

	return (
		<>
			{/* Loading indicator - shows while preloading */}
			{!isComplete && (
				<div className="loading-bar" style={{ width: `${progress}%` }} />
			)}

			{/* Main content */}
			{!canAccessCurrentPage && <Login setAuthenticated={setAuthenticated} />}
			{canAccessCurrentPage && !isYes && currentPath === "/direct-to-music" && (
				<DirectToMusic onYes={goToMusicPage} />
			)}
			{canAccessCurrentPage && !isYes && currentPath !== "/direct-to-music" && (
				<AskOut setYes={goToMusicPage} />
			)}
			{isYes && <LoveStoryPlayer />}

			{isTransitioning && (
				<div className="page-transition-overlay" aria-hidden="true">
					<div className="page-transition-glow" />
					<div className="page-transition-copy">
						<span className="page-transition-kicker">One little yes</span>
						<h2>Taking you to the sweetest part</h2>
						<p>Let the music do the rest.</p>
					</div>
				</div>
			)}

			{/* Music player - only show when NOT in lyrics player mode */}
			{!isYes && <MusicPlayer audioSrc={romanticMusic} />}
		</>
	);
}

export default App;
