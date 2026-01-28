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

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [autoPlayBlocked, setAutoPlayBlocked] = useState(false);

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
            setCurrentTime(0);
        };

        const handleCanPlayThrough = () => {
            if (autoPlay && !isPlaying) {
                audio.play().then(() => {
                    setIsPlaying(true);
                    setAutoPlayBlocked(false);
                }).catch(() => {
                    // Autoplay was blocked by browser
                    setAutoPlayBlocked(true);
                });
            }
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplaythrough', handleCanPlayThrough);

        // Start loading
        audio.load();

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplaythrough', handleCanPlayThrough);
            audio.pause();
            audio.src = '';
        };
    }, [audioSrc, autoPlay]);

    // Update current time using requestAnimationFrame for smooth updates
    useEffect(() => {
        const updateTime = () => {
            if (audioRef.current && isPlaying) {
                setCurrentTime(audioRef.current.currentTime);
                animationFrameRef.current = requestAnimationFrame(updateTime);
            }
        };

        if (isPlaying) {
            animationFrameRef.current = requestAnimationFrame(updateTime);
        }

        return () => {
            cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying]);

    const play = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setAutoPlayBlocked(false);
            }).catch((error) => {
                console.warn('Play failed:', error);
            });
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
        }
    }, []);

    const toggle = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    const seek = useCallback((time) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    }, []);

    const seekToPercent = useCallback((percent) => {
        if (audioRef.current && duration > 0) {
            const time = (percent / 100) * duration;
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
