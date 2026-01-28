import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to preload images and audio in the background
 * without interrupting the current page experience
 */
export function useAssetPreloader(assets = []) {
    const [progress, setProgress] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    const [loadedAssets, setLoadedAssets] = useState(new Map());

    const preloadImage = useCallback((src) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve({ src, success: true });
            img.onerror = () => resolve({ src, success: false });
            img.src = src;
        });
    }, []);

    const preloadAudio = useCallback((src) => {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve({ src, success: true, audio });
            audio.onerror = () => resolve({ src, success: false });
            audio.src = src;
            audio.load();
        });
    }, []);

    useEffect(() => {
        if (assets.length === 0) {
            setIsComplete(true);
            return;
        }

        let cancelled = false;
        const loaded = new Map();

        const loadAssets = async () => {
            for (let i = 0; i < assets.length; i++) {
                if (cancelled) break;

                const asset = assets[i];
                const isAudio = asset.endsWith('.mp3') || asset.endsWith('.wav') || asset.endsWith('.ogg');

                const result = isAudio
                    ? await preloadAudio(asset)
                    : await preloadImage(asset);

                if (result.success) {
                    loaded.set(asset, result);
                }

                if (!cancelled) {
                    setProgress(Math.round(((i + 1) / assets.length) * 100));
                    setLoadedAssets(new Map(loaded));
                }
            }

            if (!cancelled) {
                setIsComplete(true);
            }
        };

        // Start loading after a small delay to not block initial render
        const timeoutId = setTimeout(loadAssets, 100);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
        };
    }, [assets, preloadImage, preloadAudio]);

    return { progress, isComplete, loadedAssets };
}
