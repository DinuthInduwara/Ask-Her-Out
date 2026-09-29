import PropTypes from "prop-types";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PetalWeather } from "./components/PetalWeather";
import { MoonGarden } from "./components/MoonGarden";

export function Login({ setAuthenticated }) {
  const [password, setPassword] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();
  const name = import.meta.env.VITE_NAME?.trim() || "you";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (attempts > 0) {
      setAuthenticated(true);
      return;
    }
    setAttempts(1);
    setError("Wrong password. Try once more?");
  };

  return (
    <motion.main className="love-letter-login" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }} transition={{ duration: reduceMotion ? 0 : .55 }}>
      <PetalWeather />
      <div className="love-letter-login-shell">
        <header className="love-letter-header"><span className="love-letter-monogram" aria-hidden="true">✳</span><span>a little note for {name}</span></header>
        <div className="love-letter-login-hero">
          <MoonGarden />
          <motion.div className="love-letter-login-copy" initial={reduceMotion ? false : { opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .2 }}>
            <span className="love-letter-login-kicker">for your eyes only</span>
            <h1>There’s something<br /><em>I’d like to ask you.</em></h1>
          </motion.div>
        </div>
        <motion.form className="love-letter-login-note" onSubmit={handleSubmit} initial={reduceMotion ? false : { opacity: 0, y: 28, rotate: 2 }} animate={{ opacity: 1, y: 0, rotate: 1 }} transition={{ duration: reduceMotion ? 0 : .8, delay: reduceMotion ? 0 : .4 }}>
          <span className="love-letter-seal" aria-hidden="true">♡</span>
          <p className="love-letter-login-prompt">a tiny secret before the question...</p>
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
          <button type="submit">Open the note <span aria-hidden="true">↗</span></button>
        </motion.form>
        <footer className="love-letter-footer">a little something, just for you <span aria-hidden="true">✳</span></footer>
      </div>
    </motion.main>
  );
}

Login.propTypes = { setAuthenticated: PropTypes.func.isRequired };
