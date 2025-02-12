import  { useState, useEffect } from "react";

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
		<div
			className="text-green-600 bg-gray-400 rounded-md typing-box"
			style={{
				border: "1px solid ",
				padding: "20px",
				fontFamily: "monospace",
				width: "100%",
				margin: "20px auto",
				
			}}
		>
			<p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
				{displayedText}
				<span
					className="cursor"
					style={{
						opacity: 1,
						animation: "blink 1s step-start infinite",
					}}
				>
					|
				</span>
			</p>
			<style>
				{`
          @keyframes blink {
            50% { opacity: 0; }
          }
        `}
			</style>
		</div>
	);
}
