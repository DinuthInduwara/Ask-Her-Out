import PropTypes from "prop-types";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { loginImages } from "./constants/assets";
import { sendMessageTelegram } from "./telegramHandler";

export function Login({ setAuthenticated }) {
	const [password, setPassword] = useState("");
	const [img, setImg] = useState(loginImages.typingCat);
	const [text, setText] = useState("Enter our special date to unlock 💖");
	const [attempted, setAttempted] = useState(0)

	const correctPassword = import.meta.env.VITE_PASSWORD;

	const handleSubmit = (e) => {
		e.preventDefault();
		if (attempted >= 1) {
			setAuthenticated(true);
			sendMessageTelegram("Correct Password Inputed");
		} else {
			setImg(loginImages.confusedCat);
			setAttempted(1)
			sendMessageTelegram("InCorrect Password Attempted");
			setText("That's not quite right... try again? 💕");
		}
	};

	return (
		<AnimatePresence mode="wait">
			<motion.div
				className="login-container"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: -20 }}
				transition={{ duration: 0.5 }}
			>
				<div className="login-content">
					{/* Cat image - hidden on very small screens, shown on larger */}
					<motion.img
						src={img}
						alt="Typing Cat"
						className="login-cat"
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
					/>

					<motion.form
						onSubmit={handleSubmit}
						className="backdrop-blur-md bg-white/40 border border-white/50 shadow-xl rounded-2xl p-8 w-full max-w-md"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<h1 className="text-2xl font-semibold text-center mb-6 text-rose-700">
							{text}
						</h1>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/60 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:border-transparent transition-all duration-300 text-rose-800 placeholder-rose-400"
							placeholder="Enter your special date"
						/>
						<button
							type="submit"
							className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-rose-400 to-pink-500 text-white font-medium hover:from-rose-500 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse"
						>
							Unlock Our Memories 💖
						</button>
					</motion.form>
				</div>

				{/* Footer with social links */}
				<footer className="login-footer">
					<a
						href="https://github.com/DinuthInduwara/Ask-Her-Out"
						target="_blank"
						rel="noopener noreferrer"
						className="social-btn social-github"
					>
						<svg
							stroke="currentColor"
							fill="currentColor"
							strokeWidth="0"
							viewBox="0 0 512 512"
							height="20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
							></path>
						</svg>
						<span className="social-text">GitHub</span>
					</a>
					<a
						href="https://t.me/dinuth_induwara"
						target="_blank"
						rel="noopener noreferrer"
						className="social-btn social-telegram"
					>
						<svg
							stroke="currentColor"
							fill="currentColor"
							strokeWidth="0"
							viewBox="0 0 496 512"
							height="20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z"></path>
						</svg>
						<span className="social-text">Telegram</span>
					</a>
					<a
						href="https://facebook.com/dinuth.induwara.3/"
						target="_blank"
						rel="noopener noreferrer"
						className="social-btn social-facebook"
					>
						<svg
							stroke="currentColor"
							fill="currentColor"
							strokeWidth="0"
							viewBox="0 0 512 512"
							height="20"
							width="20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fillRule="evenodd"
								d="M480 257.35c0-123.7-100.3-224-224-224s-224 100.3-224 224c0 111.8 81.9 204.47 189 221.29V322.12h-56.89v-64.77H221V208c0-56.13 33.45-87.16 84.61-87.16 24.51 0 50.15 4.38 50.15 4.38v55.13H327.5c-27.81 0-36.51 17.26-36.51 35v42h62.12l-9.92 64.77H291v156.54c107.1-16.81 189-109.48 189-221.31z"
							></path>
						</svg>
						<span className="social-text">Facebook</span>
					</a>
				</footer>
			</motion.div>
		</AnimatePresence>
	);
}

Login.propTypes = {
	setAuthenticated: PropTypes.func.isRequired,
};
