import { useState, useRef, useEffect } from "react";

/**
 * Simple floating music player with play/pause button
 * Design kept minimal and cute to match the theme
 */
export function MusicPlayer({ audioSrc }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [showVolume, setShowVolume] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const togglePlay = () => {
        if (!audioRef.current) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(() => {
                // Autoplay blocked, user needs to click again
            });
        }
        setIsPlaying(!isPlaying);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <div className="music-player">
            <audio ref={audioRef} src={audioSrc} loop preload="auto" />

            <button
                onClick={togglePlay}
                className="music-btn"
                title={isPlaying ? "Pause music" : "Play music"}
            >
                {isPlaying ? "🎵" : "🔇"}
            </button>

            <button
                onClick={() => setShowVolume(!showVolume)}
                className="volume-toggle"
                title="Volume"
            >
                🔊
            </button>

            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                />
            )}
        </div>
    );
}
