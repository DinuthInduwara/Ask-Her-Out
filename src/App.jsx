import { AskOut } from "./AskOut";
import { LoveStoryPlayer } from "./LoveStoryPlayer";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { DirectToMusic } from "./DirectToMusic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { preloadAudio } from "./audioPreload";
import { OpeningMusicGate } from "./components/OpeningMusicGate";
import { useOpeningMusic } from "./hooks/useOpeningMusic";
import openingMusic from "./assets/music/music-1.mp3";
import romanticMusic from "./assets/music/romantic.mp3";

function App() {
	const [isYes, setYes] = useState(window.location.pathname === "/music");
	const [authenticated, setAuthenticated] = useState(false);
	const [currentPath, setCurrentPath] = useState(window.location.pathname);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [directAccess] = useState(window.location.pathname === "/direct-to-music");
	const reduceMotion = useReducedMotion();
	const { phase: openingPhase, progress: openingProgress, startOnGesture, fadeOut, resume, retry } = useOpeningMusic(openingMusic);
	const canAccessCurrentPage = authenticated || currentPath === "/direct-to-music" || (directAccess && isYes);
	const showAskOut = canAccessCurrentPage && !isYes && currentPath !== "/direct-to-music";

	useEffect(() => {
		if (isYes) return undefined;
		let idleId;
		let fallbackId;
		if ("requestIdleCallback" in window) {
			idleId = window.requestIdleCallback(() => preloadAudio(romanticMusic), { timeout: 1800 });
		} else {
			fallbackId = window.setTimeout(() => preloadAudio(romanticMusic), 800);
		}
		return () => {
			if (idleId !== undefined) window.cancelIdleCallback(idleId);
			window.clearTimeout(fallbackId);
		};
	}, [isYes]);

	useEffect(() => {
		if (openingPhase !== "ready") return;
		if (canAccessCurrentPage && isYes) fadeOut();
		else resume();
	}, [openingPhase, canAccessCurrentPage, isYes, fadeOut, resume]);

	useEffect(() => {
		const handlePopState = () => {
			const nextPath = window.location.pathname;
			setCurrentPath(nextPath);
			setYes(nextPath === "/music");
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, []);

	const goToMusicPage = () => {
		fadeOut();
		setIsTransitioning(true);
	};

	useEffect(() => {
		if (!isTransitioning) return undefined;

		const navigateTimer = window.setTimeout(() => {
			setYes(true);
			if (window.location.pathname !== "/music") {
				window.history.pushState({}, "", "/music");
				setCurrentPath("/music");
			}
		}, reduceMotion ? 0 : 900);
		const finishTimer = window.setTimeout(() => {
			setIsTransitioning(false);
		}, reduceMotion ? 0 : 1680);

		return () => {
			window.clearTimeout(navigateTimer);
			window.clearTimeout(finishTimer);
		};
	}, [isTransitioning, reduceMotion]);

  if (openingPhase !== "ready") {
		return <OpeningMusicGate phase={openingPhase} progress={openingProgress} onStart={startOnGesture} onRetry={retry} />;
	}

  return (
    <>
			{/* Main content */}
			<AnimatePresence mode="wait">
				{!canAccessCurrentPage && <Login key="login" setAuthenticated={setAuthenticated} />}
				{canAccessCurrentPage && !isYes && currentPath === "/direct-to-music" && (
					<DirectToMusic key="direct-to-music" onYes={goToMusicPage} />
				)}
				{showAskOut && (
					<AskOut key="askout" setYes={goToMusicPage} />
				)}
				{canAccessCurrentPage && isYes && <LoveStoryPlayer key="love-story" />}
			</AnimatePresence>

			<AnimatePresence>
				{isTransitioning && !reduceMotion && (
					<motion.div className="song-bloom-transition" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: .4 }}>
						<div className="song-bloom-disc"><span /><span /><span /><span /><span /><span /><i>♪</i></div>
						<p>let the music speak...</p>
					</motion.div>
				)}
			</AnimatePresence>

		</>
	);
}

export default App;
