import { useState, useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing audio playback with precise timestamp tracking
 * Designed for synced lyrics experiences
 * 
 * @param {string} audioSrc - Source URL for the audio file
 * @param {boolean} autoPlay - Whether to attempt autoplay on mount
 * @returns {Object} Audio control functions and state
 */
export function useAudio(audioSrc, autoPlay = false) {
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);
    const isPlayingRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);

    // Keep ref in sync with state
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Animation frame loop for real-time updates
    const startTimeLoop = useCallback(() => {
        const update = () => {
            if (audioRef.current && isPlayingRef.current) {
                setCurrentTime(audioRef.current.currentTime);
                animationFrameRef.current = requestAnimationFrame(update);
            }
        };
        animationFrameRef.current = requestAnimationFrame(update);
    }, []);

    const stopTimeLoop = useCallback(() => {
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
            animationFrameRef.current = null;
        }
    }, []);

    // Initialize audio element
    useEffect(() => {
        const audio = new Audio(audioSrc);
        audio.preload = 'auto';
        audio.loop = true;
        audioRef.current = audio;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoaded(true);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            setCurrentTime(0);
            stopTimeLoop();
        };

        const handleCanPlayThrough = () => {
            if (autoPlay && !isPlayingRef.current) {
                audio.play().then(() => {
                    setIsPlaying(true);
                    isPlayingRef.current = true;
                    setAutoPlayBlocked(false);
                    startTimeLoop();
                }).catch(() => {
                    setAutoPlayBlocked(true);
                });
            }
        };

        // Native play/pause events for sync
        const handlePlay = () => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            startTimeLoop();
        };

        const handlePause = () => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            stopTimeLoop();
            // Update time one more time when paused
            setCurrentTime(audio.currentTime);
        };

        // Seeking events
        const handleSeeked = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplaythrough', handleCanPlayThrough);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('seeked', handleSeeked);

        // Start loading
        audio.load();

        return () => {
            stopTimeLoop();
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('seeked', handleSeeked);
            audio.pause();
            audio.src = '';
        };
    }, [audioSrc, autoPlay, startTimeLoop, stopTimeLoop]);

    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().catch((error) => {
                console.warn('Play failed:', error);
            });
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const toggle = useCallback(() => {
        if (isPlayingRef.current) {
            pause();
        } else {
            play();
        }
    }, [play, pause]);

    const seek = useCallback((time) => {
        if (audioRef.current) {
            const clampedTime = Math.max(0, Math.min(time, audioRef.current.duration || 0));
            audioRef.current.currentTime = clampedTime;
            setCurrentTime(clampedTime);
        }
    }, []);

    const seekToPercent = useCallback((percent) => {
        if (audioRef.current && duration > 0) {
            const clampedPercent = Math.max(0, Math.min(100, percent));
            const time = (clampedPercent / 100) * duration;
            seek(time);
        }
    }, [duration, seek]);

    // Calculate progress percentage
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

    return {
        isPlaying,
        currentTime,
        duration,
        progress,
        isLoaded,
        autoPlayBlocked,
        play,
        pause,
        toggle,
        seek,
        seekToPercent,
        audioRef
    };
}
