import PropTypes from "prop-types";

export function OpeningMusicGate({ phase, progress, onStart, onRetry }) {
  const isLoading = phase === "loading";
  return (
    <main className="opening-music-gate" aria-busy={isLoading}>
      <div className="opening-music-gate-inner">
        <div className="opening-music-gate-disc" aria-hidden="true"><span>♪</span></div>
        <span className="opening-music-gate-kicker">a little something for you</span>
        <h1>{phase === "error" ? "One more moment..." : "A little music, then your note."}</h1>
        {isLoading && (
          <div className="opening-music-gate-progress" role="progressbar" aria-label="Loading the opening music" aria-valuemin="0" aria-valuemax="100" aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
        )}
        {isLoading && <p className="opening-music-gate-status">Getting the music ready · {progress}%</p>}
        {phase === "gesture" && <button type="button" onClick={onStart}>Open the note <span aria-hidden="true">♪</span></button>}
        {phase === "error" && <button type="button" onClick={onRetry}>Try the music again <span aria-hidden="true">↗</span></button>}
      </div>
    </main>
  );
}

OpeningMusicGate.propTypes = {
  phase: PropTypes.oneOf(["loading", "gesture", "error"]).isRequired,
  progress: PropTypes.number.isRequired,
  onStart: PropTypes.func.isRequired,
  onRetry: PropTypes.func.isRequired,
};
