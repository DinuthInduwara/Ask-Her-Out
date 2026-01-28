import { useState, useEffect, useRef, useMemo } from 'react';
import { useAudio } from './hooks/useAudio';
import { useLyricParser } from './hooks/useLyricParser';

// Import assets
import romanticMusic from './assets/music/romantic.mp3';

// The LRC formatted lyrics with English and Sinhala meanings
const lyricsData = `
[00:17.12]So the world goes 'round and 'round (ඔය විදිහටම මේ ලෝකය කැරකෙමින් පවතිනවා...)
[00:21.16]With all you ever knew (ඔයා දන්න හැම දේමත් එක්කම...)
[00:25.76]They say the sky high above is Caribbean blue (ඈත ඉහළ අහස කැරිබියන් නිල් පාටයි කියලා හැමෝම කියනවා...)
[00:55.13]If every man says all he can, If every man is true (හැමෝම ඇත්තම කියනවා නම්, හැම හිතක්ම අවංක නම්...)
[01:04.34]Do I believe the sky above is Caribbean blue? (මාත් විශ්වාස කරන්නද ඒ අහස ඇත්තටම ඒ තරම් ලස්සනයි කියලා?)
[01:13.60]OH, Do you Feel The Pain I Feel YOU (මට දැනෙන මේ ආදරණීය වේදනාව ඔයාටත් දැනෙනවා නේද?)
[01:58.67]Never a frown (never a frown)(රන්වන් පැහැති ඒ මතකයන් එක්ක, අපේ හිත්වල කවදාවත් අඳුරක් නැහැ...)
[02:06.50]Never a frown with golden brown (ඒ සොඳුරු මොහොතවල් අපේ ලෝකය හැමදාම සතුටින් පුරවනවා...)
[02:16.47]Never a frown (never a frown)(රන්වන් පැහැති ඒ මතකයන් එක්ක, අපේ හිත්වල කවදාවත් අඳුරක් නැහැ...)
[02:24.47]Never a frown with golden brown (ඒ සොඳුරු මොහොතවල් අපේ ලෝකය හැමදාම සතුටින් පුරවනවා...)
[02:33.37]Never a frown (never a frown)(රන්වන් පැහැති ඒ මතකයන් එක්ක, අපේ හිත්වල කවදාවත් අඳුරක් නැහැ...)
[02:42.97]Never a frown with golden brown (ඒ සොඳුරු මොහොතවල් අපේ ලෝකය හැමදාම සතුටින් පුරවනවා...)
[02:51.40]Never a frown (never a frown)(රන්වන් පැහැති ඒ මතකයන් එක්ක, අපේ හිත්වල කවදාවත් අඳුරක් නැහැ...)
[03:00.53]Des cris de joie (සතුටින් පිරුණු ඒ හිනා හඬවල් මැද)
[03:04.91]Quelques larmes, on s'en va (සතුටු කඳුළු බිඳක් හංගගෙන, අපි අපේම ලෝකයකට පියමනිනවා)
[03:09.48]On vit dans cette love story (අපි දෙන්නා මේ ලස්සන ආදර කතාව ඇතුළේ ජීවත් වෙනවා)
[03:18.30]Love story... (අපේම ආදර කතාව...)
`;

/**
 * LoveStoryPlayer - A Spotify-style immersive lyrics experience
 * Features synced lyrics with auto-scroll, smooth animations, and romantic aesthetics
 */
export function LoveStoryPlayer() {
    const lyrics = useLyricParser(lyricsData);
    const {
        isPlaying,
        currentTime,
        duration,
        progress,
        isLoaded,
        autoPlayBlocked,
        toggle,
        seekToPercent
    } = useAudio(romanticMusic, true);

    const [activeIndex, setActiveIndex] = useState(-1);
    const [isReady, setIsReady] = useState(false);
    const lyricsContainerRef = useRef(null);
    const activeLineRef = useRef(null);

    // Show the player after a brief intro animation
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Find the current active lyric based on audio time
    useEffect(() => {
        if (!lyrics.length) return;

        let newActiveIndex = -1;
        for (let i = lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= lyrics[i].time) {
                newActiveIndex = i;
                break;
            }
        }

        if (newActiveIndex !== activeIndex) {
            setActiveIndex(newActiveIndex);
        }
    }, [currentTime, lyrics, activeIndex]);

    // Auto-scroll to center the active lyric
    useEffect(() => {
        if (activeLineRef.current && lyricsContainerRef.current) {
            const container = lyricsContainerRef.current;
            const activeLine = activeLineRef.current;

            const containerHeight = container.clientHeight;
            const lineTop = activeLine.offsetTop;
            const lineHeight = activeLine.clientHeight;

            // Scroll to center the active line
            const scrollTarget = lineTop - containerHeight / 2 + lineHeight / 2;

            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    // Format time as mm:ss
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle progress bar click for seeking
    const handleProgressClick = (e) => {
        const bar = e.currentTarget;
        const rect = bar.getBoundingClientRect();
        const percent = ((e.clientX - rect.left) / rect.width) * 100;
        seekToPercent(Math.max(0, Math.min(100, percent)));
    };

    return (
        <div className="lyrics-player">
            {/* Background with blur effect */}
            <div className="lyrics-player-bg" />
            <div className="lyrics-player-overlay" />

            {/* Main content */}
            <div className={`lyrics-content ${isReady ? 'lyrics-content-visible' : ''}`}>
                {/* Header */}
                <div className="lyrics-header">
                    <div className="lyrics-now-playing">
                        <span className="lyrics-playing-icon">♫</span>
                        <span>Now Playing</span>
                    </div>
                    <h1 className="lyrics-title">Our Love Story</h1>
                </div>

                {/* Lyrics container */}
                <div
                    ref={lyricsContainerRef}
                    className="lyrics-container"
                >
                    {/* Top spacer for centering first lyrics */}
                    <div className="lyrics-spacer" />

                    {lyrics.map((lyric, index) => {
                        const isActive = index === activeIndex;
                        const isPast = index < activeIndex;

                        return (
                            <div
                                key={index}
                                ref={isActive ? activeLineRef : null}
                                className={`
                                    lyric-line
                                    ${isActive ? 'lyric-line-active' : ''}
                                    ${isPast ? 'lyric-line-past' : ''}
                                    ${!isActive && !isPast ? 'lyric-line-future' : ''}
                                `}
                            >
                                <div className="lyric-english">{lyric.englishText}</div>
                                {lyric.sinhalaText && (
                                    <div className="lyric-sinhala">{lyric.sinhalaText}</div>
                                )}
                            </div>
                        );
                    })}

                    {/* Bottom spacer for centering last lyrics */}
                    <div className="lyrics-spacer" />
                </div>

                {/* Autoplay blocked message */}
                {autoPlayBlocked && !isPlaying && (
                    <div className="lyrics-autoplay-message">
                        <button onClick={toggle} className="lyrics-tap-to-play">
                            <span className="lyrics-play-icon">▶</span>
                            <span>Tap to play our song</span>
                        </button>
                    </div>
                )}

                {/* Bottom controls */}
                <div className="lyrics-controls">
                    {/* Progress bar */}
                    <div className="lyrics-progress-container">
                        <span className="lyrics-time">{formatTime(currentTime)}</span>
                        <div
                            className="lyrics-progress-bar"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="lyrics-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                            <div
                                className="lyrics-progress-thumb"
                                style={{ left: `${progress}%` }}
                            />
                        </div>
                        <span className="lyrics-time">{formatTime(duration)}</span>
                    </div>

                    {/* Play/Pause button */}
                    <button
                        onClick={toggle}
                        className={`lyrics-play-btn ${isPlaying ? 'lyrics-playing' : ''}`}
                        disabled={!isLoaded}
                    >
                        {isPlaying ? (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="lyrics-icon">
                                <rect x="6" y="4" width="4" height="16" rx="1" />
                                <rect x="14" y="4" width="4" height="16" rx="1" />
                            </svg>
                        ) : (
                            <svg viewBox="0 0 24 24" fill="currentColor" className="lyrics-icon">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
