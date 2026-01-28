import { useState, useEffect } from "react";
import PropTypes from "prop-types";

export function TypingEffect({ text, speed = 50 }) {
	const [displayedText, setDisplayedText] = useState("");

	useEffect(() => {
		let index = 0;
		const intervalId = setInterval(() => {
			setDisplayedText(text.slice(0, index + 1));
			index++;
			if (index === text.length) {
				clearInterval(intervalId);
			}
		}, speed);

		return () => clearInterval(intervalId);
	}, [text, speed]);

	return (
		<div className="text-green-600 bg-gray-400 rounded-md typing-box">
			<p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
				{displayedText}
				<span className="cursor">|</span>
			</p>
		</div>
	);
}

TypingEffect.propTypes = {
	text: PropTypes.string.isRequired,
	speed: PropTypes.number,
};
