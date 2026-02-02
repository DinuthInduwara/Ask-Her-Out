import { useState, useEffect, useRef, useCallback } from 'react';
import { useAudio } from './hooks/useAudio';
import { useLyricParser } from './hooks/useLyricParser';
import { catImages, celebrationImages } from './constants/assets';

// Import assets
import romanticMusic from './assets/music/romantic.mp3';
import { sendMessageTelegram } from './telegramHandler';

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

// Floating emojis for the love theme
const loveEmojis = ['💕', '💖', '💗', '💝', '💘', '🦋', '🌸', '🌺', '🌷', '✨', '💫', '🌹', '🥰', '😍', '💑', '💏'];

/**
 * LoveStoryPlayer - A lovely, romantic lyrics experience
 * Features: rotating cat GIFs on sides, flying butterflies, GIF celebration when song ends
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
    const [leftCatIndex, setLeftCatIndex] = useState(0);
    const [rightCatIndex, setRightCatIndex] = useState(Math.floor(catImages.length / 2));
    const [floatingElements, setFloatingElements] = useState([]);
    const [butterflies, setButterflies] = useState([]);
    const [showEmojiPopup, setShowEmojiPopup] = useState(false);
    const [popupEmojis, setPopupEmojis] = useState([]);
    const [showGifCelebration, setShowGifCelebration] = useState(false);
    const [celebrationGifs, setCelebrationGifs] = useState([]);
    const lyricsContainerRef = useRef(null);
    const activeLineRef = useRef(null);
    const songEndedRef = useRef(false);

    // Show the player after a brief intro animation
    useEffect(() => {
        const timer = setTimeout(() => setIsReady(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Rotate cat images every 4 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setLeftCatIndex(prev => (prev + 1) % catImages.length);
            setRightCatIndex(prev => (prev + 1) % catImages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    // Create floating butterflies/flowers that rise up
    useEffect(() => {
        const createFloatingElement = () => {
            const types = ['🌸', '🌺', '🌷', '💕', '✨'];
            const element = {
                id: Date.now() + Math.random(),
                type: types[Math.floor(Math.random() * types.length)],
                left: Math.random() * 100,
                animationDuration: 10 + Math.random() * 8,
                delay: Math.random() * 2,
                size: 14 + Math.random() * 14
            };
            setFloatingElements(prev => [...prev.slice(-10), element]);
        };

        const interval = setInterval(createFloatingElement, 2500);
        for (let i = 0; i < 5; i++) {
            setTimeout(createFloatingElement, i * 300);
        }

        return () => clearInterval(interval);
    }, []);

    // Create butterflies that fly around the screen gently (subtle, few)
    useEffect(() => {
        const createButterfly = () => {
            const butterfly = {
                id: Date.now() + Math.random(),
                startX: Math.random() * 70 + 15, // 15% to 85%
                startY: Math.random() * 50 + 25, // 25% to 75%
                size: 16 + Math.random() * 10, // Smaller butterflies
                duration: 12 + Math.random() * 8, // Slower movement
                delay: Math.random() * 4,
                pathType: Math.floor(Math.random() * 4)
            };
            setButterflies(prev => [...prev.slice(-3), butterfly]); // Max 3 butterflies
        };

        // Create initial butterflies - only 3
        for (let i = 0; i < 3; i++) {
            setTimeout(createButterfly, i * 800);
        }

        const interval = setInterval(createButterfly, 8000); // Less frequent
        return () => clearInterval(interval);
    }, []);

    // Detect when song is about to end (27 seconds before) and show GIF celebration
    // Audio is 3:49 (229 seconds), so start at 202 seconds
    useEffect(() => {
        const startCelebrationAt = 202; // 27 seconds before end (229 - 27)

        if (currentTime >= startCelebrationAt && !songEndedRef.current) {
            songEndedRef.current = true;
            sendMessageTelegram("Gif Played")
            triggerGifCelebration();
        }

        // Reset if song restarts
        if (currentTime < 5 && songEndedRef.current) {
            songEndedRef.current = false;
            setShowGifCelebration(false);
            setCelebrationGifs([]);
        }
    }, [currentTime]);

    // Trigger GIF celebration - slowly fill the screen
    const triggerGifCelebration = () => {
        setShowGifCelebration(true);

        const containerWidth = window.innerWidth;
        const containerHeight = window.innerHeight;
        const isMobile = containerWidth < 768;
        const minSize = isMobile ? 50 : 80;
        const maxSize = isMobile ? 120 : 200;
        const maxGifs = isMobile ? 25 : 40;

        // Create array of GIF positions - scattered randomly
        const newGifs = [];
        for (let i = 0; i < maxGifs; i++) {
            const size = Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize;
            const left = Math.random() * (containerWidth - size);
            const top = Math.random() * (containerHeight - size);
            const rotation = Math.random() * 20 - 10; // -10 to +10 degrees (less rotation)
            const randomImage = celebrationImages[Math.floor(Math.random() * celebrationImages.length)];
            const delay = i * 200; // MUCH slower - 200ms between each GIF

            newGifs.push({
                id: i,
                src: randomImage,
                left,
                top,
                width: size,
                height: size,
                rotation,
                delay
            });
        }

        // Add GIFs gradually - slowly filling the screen
        newGifs.forEach((gif) => {
            setTimeout(() => {
                setCelebrationGifs(prev => [...prev, gif]);
            }, gif.delay);
        });
    };

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

            const scrollTarget = lineTop - containerHeight / 2 + lineHeight / 2;

            container.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
        }
    }, [activeIndex]);

    // Handle emoji popup
    const handleEmojiPopup = useCallback(() => {
        setShowEmojiPopup(true);
        setPopupEmojis([]);

        let count = 0;
        const interval = setInterval(() => {
            if (count >= 50) {
                clearInterval(interval);
                return;
            }

            const emoji = {
                id: Date.now() + Math.random(),
                type: loveEmojis[Math.floor(Math.random() * loveEmojis.length)],
                left: 10 + Math.random() * 80,
                bottom: -10,
                animationDuration: 3 + Math.random() * 3,
                size: 24 + Math.random() * 32
            };

            setPopupEmojis(prev => [...prev, emoji]);
            count++;
        }, 100);

        return () => clearInterval(interval);
    }, []);

    const closeEmojiPopup = () => {
        setShowEmojiPopup(false);
        setPopupEmojis([]);
    };

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
        <div className="love-player">
            {/* Lovely pink gradient background */}
            <div className="love-player-bg" />

            {/* Floating flowers rising up */}
            <div className="floating-elements">
                {floatingElements.map(el => (
                    <span
                        key={el.id}
                        className="floating-item"
                        style={{
                            left: `${el.left}%`,
                            fontSize: `${el.size}px`,
                            animationDuration: `${el.animationDuration}s`,
                            animationDelay: `${el.delay}s`
                        }}
                    >
                        {el.type}
                    </span>
                ))}
            </div>

            {/* Flying butterflies around the screen */}
            <div className="butterfly-container">
                {butterflies.map(b => (
                    <span
                        key={b.id}
                        className={`flying-butterfly path-${b.pathType}`}
                        style={{
                            left: `${b.startX}%`,
                            top: `${b.startY}%`,
                            fontSize: `${b.size}px`,
                            animationDuration: `${b.duration}s`,
                            animationDelay: `${b.delay}s`
                        }}
                    >
                        🦋
                    </span>
                ))}
            </div>

            {/* Left cat */}
            <div className="cat-sidebar cat-left">
                <img
                    src={catImages[leftCatIndex]}
                    alt="Cute cat"
                    className="sidebar-cat"
                />
            </div>

            {/* Right cat */}
            <div className="cat-sidebar cat-right">
                <img
                    src={catImages[rightCatIndex]}
                    alt="Cute cat"
                    className="sidebar-cat"
                />
            </div>

            {/* Main content */}
            <div className={`love-content ${isReady ? 'love-content-visible' : ''}`}>
                {/* Header */}
                <div className="love-header">
                    <h1 className="love-title">💕 Our Love Story 💕</h1>
                </div>

                {/* Lyrics container */}
                <div
                    ref={lyricsContainerRef}
                    className="love-lyrics-container"
                >
                    <div className="love-lyrics-spacer" />

                    {lyrics.map((lyric, index) => {
                        const isActive = index === activeIndex;
                        const isPast = index < activeIndex;

                        return (
                            <div
                                key={index}
                                ref={isActive ? activeLineRef : null}
                                className={`
                                    love-lyric-line
                                    ${isActive ? 'love-lyric-active' : ''}
                                    ${isPast ? 'love-lyric-past' : ''}
                                `}
                            >
                                <div className="love-lyric-english">{lyric.englishText}</div>
                                {lyric.sinhalaText && (
                                    <div className="love-lyric-sinhala">{lyric.sinhalaText}</div>
                                )}
                            </div>
                        );
                    })}

                    <div className="love-lyrics-spacer" />
                </div>

                {/* Autoplay blocked message */}
                {autoPlayBlocked && !isPlaying && (
                    <div className="love-autoplay-message">
                        <button onClick={toggle} className="love-tap-to-play">
                            <span>💝</span>
                            <span>Tap to play our song</span>
                        </button>
                    </div>
                )}

                {/* Bottom controls */}
                <div className="love-controls">
                    {/* Emoji popup button */}
                    <button
                        className="emoji-popup-btn"
                        onClick={handleEmojiPopup}
                        title="Love Emojis!"
                    >
                        🎉
                    </button>

                    {/* Progress bar */}
                    <div className="love-progress-container">
                        <span className="love-time">{formatTime(currentTime)}</span>
                        <div
                            className="love-progress-bar"
                            onClick={handleProgressClick}
                        >
                            <div
                                className="love-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="love-time">{formatTime(duration)}</span>
                    </div>

                    {/* Play/Pause button */}
                    <button
                        onClick={toggle}
                        className={`love-play-btn ${isPlaying ? 'love-playing' : ''}`}
                        disabled={!isLoaded}
                    >
                        {isPlaying ? '⏸️' : '▶️'}
                    </button>
                </div>
            </div>

            {/* Emoji Popup Overlay */}
            {showEmojiPopup && (
                <div className="emoji-popup-overlay" onClick={closeEmojiPopup}>
                    <div className="emoji-popup-content">
                        <p className="emoji-popup-text">💖 I Love You! 💖</p>
                        {popupEmojis.map(emoji => (
                            <span
                                key={emoji.id}
                                className="popup-emoji"
                                style={{
                                    left: `${emoji.left}%`,
                                    fontSize: `${emoji.size}px`,
                                    animationDuration: `${emoji.animationDuration}s`
                                }}
                            >
                                {emoji.type}
                            </span>
                        ))}
                        <p className="emoji-popup-hint">Tap anywhere to close</p>
                    </div>
                </div>
            )}

            {/* GIF Celebration Overlay - when song ends */}
            {showGifCelebration && (
                <div className="gif-celebration-overlay">
                    <div className="gif-celebration-message">
                        <span>💖</span> I Love You Forever <span>💖</span>
                    </div>
                    {celebrationGifs.map(gif => (
                        <img
                            key={gif.id}
                            src={gif.src}
                            alt="Celebration"
                            className="celebration-gif-item"
                            style={{
                                left: gif.left,
                                top: gif.top,
                                width: gif.width,
                                height: gif.height,
                                transform: `rotate(${gif.rotation}deg)`
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
