import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { DaySky } from "./components/DaySky";

export function Login({ setAuthenticated }) {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const [isSunsetting, setIsSunsetting] = useState(false);
  const unlockTimer = useRef(null);
  const reduceMotion = useReducedMotion();
  const name = import.meta.env.VITE_NAME?.trim() || "you";

  useEffect(() => () => window.clearTimeout(unlockTimer.current), []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isSunsetting) return;
    if (attempts > 0) {
      setIsSunsetting(true);
      unlockTimer.current = window.setTimeout(() => setAuthenticated(true), reduceMotion ? 0 : 1450);
      return;
    }
    setAttempts(1);
    setError("Wrong password. Try once more?");
  };

  return (
    <motion.main className={`love-letter-login day-letter-login ${isSunsetting ? "day-letter-login--sunset" : ""}`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .4 }}>
      <div className="love-letter-login-shell">
        <header className="love-letter-header"><span className="love-letter-monogram" aria-hidden="true">✳</span><span>a little note for {name}</span></header>
        <div className="love-letter-login-hero">
          <DaySky />
          <motion.div className="love-letter-login-copy" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .2 }}>
            <span className="love-letter-login-kicker">one bright little secret</span>
            <h1>Before the sun sets,<br /><em>one little guess.</em></h1>
          </motion.div>
        </div>
        <motion.form className="love-letter-login-note" onSubmit={handleSubmit} initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 1 }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .4 }}>
          <span className="love-letter-seal" aria-hidden="true">♡</span>
          <p className="love-letter-login-prompt">a little secret for you...</p>
          <label htmlFor="letter-password">Your guess</label>
          <input
            id="letter-password"
            type="password"
            value={password}
            onChange={(event) => { setPassword(event.target.value); if (error) setError(""); }}
            autoComplete="off"
            placeholder="Type a little guess"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? "password-error" : undefined}
          />
          {error && <p className="love-letter-login-error" id="password-error" role="alert">{error}</p>}
          <button type="submit" disabled={isSunsetting}>{isSunsetting ? "Opening the night..." : "Open the note"} <span aria-hidden="true">↗</span></button>
        </motion.form>
        <footer className="love-letter-footer">a little something, just for you <span aria-hidden="true">✳</span></footer>
      </div>
    </motion.main>
  );
}

Login.propTypes = { setAuthenticated: PropTypes.func.isRequired };
