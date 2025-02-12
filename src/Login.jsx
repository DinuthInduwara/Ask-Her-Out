import PropTypes from "prop-types";
import { useState } from "react";
import { TypingEffect } from "./TypingBox";
import tcat from "./assets/typingcat.gif";
import ccat from "./assets/confcat.gif";
import { sendMessageTelegram } from "./telegramHandlre";



export function Login({ setAuthenticated }) {
	const [password, setPassword] = useState("");
	const [img, setImg] = useState(tcat);
	const [text, setText] = useState(
		"Enter password 🔐 to prove you're Ayathnaaa... or what? 👀🕵️‍♂️"
	);

	// Change this to the password you want to use
	const correctPassword = "OcDevsJ";

	const handleSubmit = (e) => {
		e.preventDefault();
		if (password === correctPassword) {
			setAuthenticated(true);
			sendMessageTelegram("Correct Password Inputed");
		} else {
			setImg(ccat);
			sendMessageTelegram("InCorrect Password Attempted");
			setText(
				"Incorrect password. 🔐 Are you truly Ayathna, or are you an imposter? 🕵️‍♂️🤔"
			);
		}
	};

	return (
		<div className="relative min-h-screen">
			<div className="flex items-center justify-center min-h-screen">
				<img src={img} width="20%" alt="Typing Cat" />
				<form
					onSubmit={handleSubmit}
					className="p-8 mx-4 bg-gray-600 rounded shadow-2xl"
				>
					<h1 className="mb-4 text-xl font-bold">
						<TypingEffect text={text} />
					</h1>
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full p-2 mb-4 border border-gray-300 rounded"
						placeholder="Enter password"
					/>
					<button
						type="submit"
						className="w-full p-2 text-white bg-blue-500 rounded"
					>
						Submit
					</button>
				</form>
			</div>
			{/* Fixed footer with PNG social buttons */}
			<footer className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 p-4 ">
				<a
					href="https://github.com/DinuthInduwara/AyathnaAskout"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center px-4 py-2 text-white bg-gray-800 rounded hover:bg-gray-700"
				>
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 512 512"
						height="25"
						className="mx-1"
						width="25"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
						></path>
					</svg>
					GitHub
				</a>
				<a
					href="https://t.me/dinuth_induwara"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-400"
				>
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 496 512"
						height="25"
						className="mx-1"
						width="25"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"></path>
					</svg>
					Telegram
				</a>
				<a
					href="https://facebook.com/dinuth.induwara.3/"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center px-4 py-2 text-white bg-blue-800 rounded hover:bg-blue-700"
				>
					<svg
						stroke="currentColor"
						fill="currentColor"
						stroke-width="0"
						viewBox="0 0 512 512"
						height="25"
						className="mx-1"
						width="25"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							fill-rule="evenodd"
							d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
						></path>
					</svg>
					Facebook
				</a>
			</footer>
		</div>
	);
}

Login.propTypes = {
	setAuthenticated: PropTypes.func.isRequired,
};
