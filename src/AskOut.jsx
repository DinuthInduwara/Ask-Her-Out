import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { sendMessageTelegram } from "./telegramHandler";
import { PetalWeather } from "./components/PetalWeather";
import { MoonGarden } from "./components/MoonGarden";

export function AskOut({ setYes }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const lastDodgeRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const name = import.meta.env.VITE_NAME?.trim() || "you";

  const handleYes = () => {
    sendMessageTelegram("She said yes to a date.");
    setYes();
  };

  const dodgeMaybe = () => {
    if (reduceMotion || Date.now() - lastDodgeRef.current < 260) return;
    lastDodgeRef.current = Date.now();
    setDodgeCount((count) => count + 1);
  };

  const handleMaybePointerDown = (event) => {
    if (event.pointerType !== "touch") return;
    event.preventDefault();
    dodgeMaybe();
  };

  const handleMaybeClick = (event) => {
    event.preventDefault();
    dodgeMaybe();
  };

  return (
    <motion.main className="love-letter-page" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }} transition={{ duration: reduceMotion ? 0 : .55 }}>
      <PetalWeather />
      <div className="love-letter-shell">
        <header className="love-letter-header">
          <span className="love-letter-monogram" aria-hidden="true">✳</span>
          <span>a little note for {name}</span>
        </header>

        <section className="love-letter-hero">
          <MoonGarden />
          <motion.div className="love-letter-hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .85, delay: reduceMotion ? 0 : .2 }}>
            <p className="love-letter-overline">after thirteen years</p>
            <h1>Somehow, <em>here you are</em> again.</h1>
            <p className="love-letter-memory">We knew each other in 4th and 5th grade.<br />Then I saw you again last week.</p>
            <span className="love-letter-script">I’ve liked you for a long time ♡</span>
          </motion.div>
          <div className="love-letter-scroll" aria-hidden="true"><span />a little further</div>
        </section>

        <motion.section className="love-letter-note" aria-labelledby="reunion-question" initial={reduceMotion ? false : { opacity: 0, y: 30, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: -1 }} viewport={{ once: true, amount: .25 }} transition={{ duration: reduceMotion ? 0 : .8, ease: [0.22, 1, 0.36, 1] }}>
          <span className="love-letter-seal" aria-hidden="true">♡</span>
          <p className="love-letter-note-kicker">so, one small question...</p>
          <h2 id="reunion-question">Would you go on a date with me?</h2>
          <div className="reunion-actions">
            <button type="button" className="reunion-yes" onClick={handleYes}>Yes, I’d like that <span aria-hidden="true">↗</span></button>
            <div className="reunion-maybe-zone">
              <button
                type="button"
                tabIndex={-1}
                aria-disabled="true"
                className={`reunion-later reunion-later--${dodgeCount % 4}`}
                onMouseEnter={dodgeMaybe}
                onPointerDown={handleMaybePointerDown}
                onClick={handleMaybeClick}
              >Maybe another time</button>
              {dodgeCount > 0 && <span className="reunion-dodge-note" aria-hidden="true">can’t catch me ♡</span>}
            </div>
          </div>
        </motion.section>
        <footer className="love-letter-footer">no matter what, it was lovely to see you again. <span aria-hidden="true">✳</span></footer>
      </div>
    </motion.main>
  );
}

AskOut.propTypes = { setYes: PropTypes.func.isRequired };
