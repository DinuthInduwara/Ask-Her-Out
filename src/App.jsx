import { AskOut } from "./AskOut";
import { LoveStoryPlayer } from "./LoveStoryPlayer";
import { useState, useEffect } from "react";
import { Login } from "./Login";
import { DirectToMusic } from "./DirectToMusic";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

function App() {
	const [isYes, setYes] = useState(window.location.pathname === "/music");
	const [authenticated, setAuthenticated] = useState(false);
	const [currentPath, setCurrentPath] = useState(window.location.pathname);
	const [isTransitioning, setIsTransitioning] = useState(false);
	const [directAccess] = useState(window.location.pathname === "/direct-to-music");
	const reduceMotion = useReducedMotion();
	const canAccessCurrentPage = authenticated || currentPath === "/direct-to-music" || (directAccess && isYes);
	const showAskOut = canAccessCurrentPage && !isYes && currentPath !== "/direct-to-music";

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
		}, reduceMotion ? 0 : 720);
		const finishTimer = window.setTimeout(() => {
			setIsTransitioning(false);
		}, reduceMotion ? 0 : 1550);

		return () => {
			window.clearTimeout(navigateTimer);
			window.clearTimeout(finishTimer);
		};
	}, [isTransitioning, reduceMotion]);

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
					<motion.div className="reunion-curtain" aria-hidden="true" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} exit={{ clipPath: "inset(0 0 0 100%)" }} transition={{ duration: .72, ease: [0.76, 0, 0.24, 1] }}>
						<div className="reunion-curtain-copy"><span>one more thing...</span><h2>A song for you.</h2></div>
					</motion.div>
				)}
			</AnimatePresence>

		</>
	);
}

export default App;
