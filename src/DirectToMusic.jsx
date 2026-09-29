import PropTypes from "prop-types";
import { motion, useReducedMotion } from "framer-motion";
import { PetalWeather } from "./components/PetalWeather";
import { MoonGarden } from "./components/MoonGarden";

export function DirectToMusic({ onYes }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.main className="song-note-page" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .5 }}>
      <PetalWeather />
      <div className="song-note-shell">
        <header className="love-letter-header"><span className="love-letter-monogram" aria-hidden="true">✳</span><span>something for you</span></header>
        <div className="song-note-scene"><MoonGarden /></div>
        <motion.div className="song-note-letter" initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: -2 }} animate={{ opacity: 1, y: 0, rotate: -1 }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .3 }}>
          <span className="love-letter-seal" aria-hidden="true">♪</span>
          <p className="song-note-kicker">a little detour...</p>
          <h1>I have a song for you.</h1>
          <p>Press play when you’re ready.</p>
          <button type="button" onClick={onYes}>Take me to the song <span aria-hidden="true">↗</span></button>
        </motion.div>
      </div>
    </motion.main>
  );
}

DirectToMusic.propTypes = { onYes: PropTypes.func.isRequired };
