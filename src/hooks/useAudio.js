import { useState, useRef, useEffect, useCallback } from 'react';
import { releasePreparedAudio, takePreparedAudio } from '../audioPreload';

/**
 * Custom hook for managing audio playback with precise timestamp tracking
 * Designed for synced lyrics experiences
 * 
 * @param {string} audioSrc - Source URL for the audio file
 * @param {boolean} autoPlay - Whether to attempt autoplay on mount
 * @param {number} fadeInMs - Duration of the first-play volume fade
 * @returns {Object} Audio control functions and state
 */
export function useAudio(audioSrc, autoPlay = false, fadeInMs = 0) {
    const audioRef = useRef(null);
    const animationFrameRef = useRef(null);
    const volumeFrameRef = useRef(null);
    const isPlayingRef = useRef(false);
    const firstPlayRef = useRef(true);

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

    const stopVolumeFade = useCallback(() => {
        if (volumeFrameRef.current) cancelAnimationFrame(volumeFrameRef.current);
        volumeFrameRef.current = null;
    }, []);

    const fadeIn = useCallback((audio) => {
        if (!fadeInMs) {
            audio.volume = 1;
            return;
        }
        const startedAt = performance.now();
        const step = (now) => {
            audio.volume = Math.min(1, (now - startedAt) / fadeInMs);
            if (audio.volume < 1 && !audio.paused) volumeFrameRef.current = requestAnimationFrame(step);
            else volumeFrameRef.current = null;
        };
        volumeFrameRef.current = requestAnimationFrame(step);
    }, [fadeInMs]);

    // Initialize audio element
    useEffect(() => {
        const audio = takePreparedAudio(audioSrc);
        audio.preload = 'auto';
        audio.loop = false;
        audio.volume = fadeInMs ? 0 : 1;
        audioRef.current = audio;
        firstPlayRef.current = true;
        let attemptedAutoPlay = false;

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
            setIsLoaded(true);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            setCurrentTime(audio.duration);
            stopTimeLoop();
            stopVolumeFade();
            audio.volume = 1;
        };

        const attemptAutoPlay = () => {
            if (!autoPlay || attemptedAutoPlay) return;
            attemptedAutoPlay = true;
            audio.play().catch(() => setAutoPlayBlocked(true));
        };

        // Native play/pause events for sync
        const handlePlay = () => {
            setIsPlaying(true);
            isPlayingRef.current = true;
            setAutoPlayBlocked(false);
            if (firstPlayRef.current) {
                firstPlayRef.current = false;
                fadeIn(audio);
            }
            startTimeLoop();
        };

        const handlePause = () => {
            setIsPlaying(false);
            isPlayingRef.current = false;
            stopTimeLoop();
            stopVolumeFade();
            audio.volume = 1;
            // Update time one more time when paused
            setCurrentTime(audio.currentTime);
        };

        // Seeking events
        const handleSeeked = () => {
            setCurrentTime(audio.currentTime);
        };

        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('canplay', attemptAutoPlay);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);
        audio.addEventListener('seeked', handleSeeked);

        // Preloading may finish before this component mounts.
        if (audio.readyState >= 1) handleLoadedMetadata();
        if (audio.readyState >= 3) attemptAutoPlay();
        if (audio.readyState === 0 && audio.networkState !== HTMLMediaElement.NETWORK_LOADING) audio.load();

        return () => {
            stopTimeLoop();
            stopVolumeFade();
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('canplay', attemptAutoPlay);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
            audio.removeEventListener('seeked', handleSeeked);
            releasePreparedAudio(audioSrc, audio);
        };
    }, [audioSrc, autoPlay, fadeInMs, fadeIn, startTimeLoop, stopTimeLoop, stopVolumeFade]);

    const play = useCallback(() => {
        if (audioRef.current) {
            if (audioRef.current.ended) {
                audioRef.current.currentTime = 0;
                setCurrentTime(0);
            }
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
