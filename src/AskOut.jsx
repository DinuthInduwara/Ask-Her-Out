import { useState, useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { reactionImages } from "./constants/assets";
import { sendMessageTelegram } from "./telegramHandler";

export function AskOut({ setYes }) {
  const [step, setStep] = useState(0);
  const [noText, setNoText] = useState("No");
  const [catImg, setCat] = useState(reactionImages.hug);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [dodgeCount, setDodgeCount] = useState(0);
  const noButtonRef = useRef(null);
  const [buttonDimensions, setButtonDimensions] = useState({ width: 120, height: 50 });
  const [initialPosition, setInitialPosition] = useState({ x: 0, y: 0 });
  const [isPositionSet, setIsPositionSet] = useState(false);

  const dodgeMessages = [
    "Are you sure? 🤔",
    "Think again 🥺",
    "Please? 🥺",
    "No way! 😤",
    "Really? 💔",
    "Come on! 🙏",
    "Don't do this! 😢",
    "Give it another chance! 💕",
    "You know you want to! 😊",
    "Please reconsider! 🥺",
    "Are you sure? 🤨",
    "Last chance! ⏳",
    "Think again... 🧠",
    "Don't do this... 😨",
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

  // Capture initial position on mount and update button dimensions when it changes
  useEffect(() => {
    if (noButtonRef.current) {
      const rect = noButtonRef.current.getBoundingClientRect();
      setButtonDimensions({ width: rect.width, height: rect.height });

      // Store the initial position only once
      if (!isPositionSet) {
        setInitialPosition({ x: rect.left, y: rect.top });
        setIsPositionSet(true);
      }
    }
  }, [noText, isPositionSet]);

  // Reset button position when window is resized (keeps it in bounds)
  useEffect(() => {
    const handleResize = () => {
      // Reset position to ensure button is visible after resize
      setNoButtonPosition({ x: 0, y: 0 });
      setIsPositionSet(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Calculates a random X and Y position strictly within the window bounds.
   * Subtracts the button's width and height from max boundaries to prevent overflow.
   * All positions are calculated relative to the button's INITIAL position in the layout.
   */
  const calculateSafePosition = useCallback(() => {
    const { width: buttonWidth, height: buttonHeight } = buttonDimensions;
    const safePadding = 16; // Minimum padding from edges (in pixels)
    const scrollbarBuffer = 20; // Extra buffer for potential scrollbars

    // Calculate maximum allowed positions within viewport
    // Subtract button size and padding to ensure button stays fully visible
    const maxX = Math.max(0, window.innerWidth - buttonWidth - safePadding - scrollbarBuffer);
    const maxY = Math.max(0, window.innerHeight - buttonHeight - safePadding - scrollbarBuffer);
    const minX = safePadding;
    const minY = safePadding;

    // Generate random position within safe bounds
    const randomX = Math.random() * (maxX - minX) + minX;
    const randomY = Math.random() * (maxY - minY) + minY;

    // Calculate the translation needed from the INITIAL position to reach the random position
    // This ensures the button always moves to an absolute position within viewport
    const translateX = randomX - initialPosition.x;
    const translateY = randomY - initialPosition.y;

    return {
      x: translateX,
      y: translateY,
    };
  }, [buttonDimensions, initialPosition]);

  /**
   * Handle button dodge - triggers on both desktop (onMouseEnter) and mobile (onTouchStart).
   * Updates position dynamically every time the user tries to interact with the button.
   * Changes button text sequentially from dodgeMessages array.
   */
  const handleNoDodge = useCallback((e) => {
    // Prevent default touch behavior to ensure smooth interaction
    if (e?.preventDefault) {
      e.preventDefault();
    }

    // Calculate new safe position
    const newPosition = calculateSafePosition();

    // Get next message in sequence (cycles through array)
    const messageIndex = dodgeCount % dodgeMessages.length;

    // Update state
    setNoText(dodgeMessages[messageIndex]);
    setNoButtonPosition(newPosition);
    setDodgeCount((prev) => prev + 1);
  }, [calculateSafePosition, dodgeCount, dodgeMessages]);

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
					<motion.button
						ref={noButtonRef}
						className="askout-no-btn"
						onClick={handleNoClick}
						onMouseEnter={handleNoDodge}
						onTouchStart={handleNoDodge}
						animate={{
							x: noButtonPosition.x,
							y: noButtonPosition.y
						}}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 20
						}}
					>
						{noText}
					</motion.button>
				</motion.div>
			</motion.div>
		</AnimatePresence>
	);
}

AskOut.propTypes = {
	setYes: PropTypes.func.isRequired,
};
