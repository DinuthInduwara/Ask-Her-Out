import { useCallback, useEffect, useRef, useState } from "react";

export function useOpeningMusic(source) {
  const [phase, setPhase] = useState("loading");
  const [progress, setProgress] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const audioRef = useRef(null);
  const fadeFrameRef = useRef(null);
  const isFadingRef = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl;
    let audio;

    const prepare = async () => {
      try {
        const response = await fetch(source, { signal: controller.signal });
        if (!response.ok) throw new Error("Opening music could not be loaded");

        const totalBytes = Number(response.headers.get("content-length")) || 0;
        const chunks = [];
        let loadedBytes = 0;

        if (response.body) {
          const reader = response.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            loadedBytes += value.byteLength;
            if (totalBytes) setProgress(Math.min(94, Math.round((loadedBytes / totalBytes) * 94)));
          }
        } else {
          chunks.push(await response.arrayBuffer());
        }

        if (controller.signal.aborted) return;
        setProgress(96);
        objectUrl = URL.createObjectURL(new Blob(chunks, { type: "audio/mpeg" }));
        audio = new Audio(objectUrl);
        audio.loop = true;
        audio.volume = 1;
        audio.preload = "auto";
        audioRef.current = audio;

        await new Promise((resolve, reject) => {
          const cleanup = () => {
            audio.removeEventListener("canplay", onReady);
            audio.removeEventListener("error", onError);
            controller.signal.removeEventListener("abort", onAbort);
          };
          const onReady = () => { cleanup(); resolve(); };
          const onError = () => { cleanup(); reject(new Error("Opening music could not be played")); };
          const onAbort = () => { cleanup(); reject(new DOMException("Aborted", "AbortError")); };
          audio.addEventListener("canplay", onReady, { once: true });
          audio.addEventListener("error", onError, { once: true });
          controller.signal.addEventListener("abort", onAbort, { once: true });
          audio.load();
        });

        if (controller.signal.aborted) return;
        setProgress(100);
        try {
          await audio.play();
          if (!controller.signal.aborted) setPhase("ready");
        } catch {
          if (!controller.signal.aborted) setPhase("gesture");
        }
      } catch (error) {
        if (error.name !== "AbortError" && !controller.signal.aborted) setPhase("error");
      }
    };

    prepare();
    return () => {
      controller.abort();
      if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);
      fadeFrameRef.current = null;
      isFadingRef.current = false;
      audio?.pause();
      if (audioRef.current === audio) audioRef.current = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [source, retryCount]);

  const startOnGesture = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.volume = 1;
      await audio.play();
      setPhase("ready");
    } catch {
      setPhase("gesture");
    }
  }, []);

  const fadeOut = useCallback((duration = 1400) => {
    const audio = audioRef.current;
    if (!audio || audio.paused || isFadingRef.current) return;
    isFadingRef.current = true;
    const initialVolume = audio.volume;
    const startedAt = performance.now();
    const step = (now) => {
      const fraction = Math.min(1, (now - startedAt) / duration);
      audio.volume = Math.max(0, initialVolume * (1 - fraction));
      if (fraction < 1) {
        fadeFrameRef.current = requestAnimationFrame(step);
      } else {
        audio.pause();
        audio.currentTime = 0;
        fadeFrameRef.current = null;
        isFadingRef.current = false;
      }
    };
    fadeFrameRef.current = requestAnimationFrame(step);
  }, []);

  const resume = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (fadeFrameRef.current) cancelAnimationFrame(fadeFrameRef.current);
    fadeFrameRef.current = null;
    isFadingRef.current = false;
    audio.volume = 1;
    if (audio.paused) audio.play().catch(() => {});
  }, []);

  const retry = useCallback(() => {
    setProgress(0);
    setPhase("loading");
    setRetryCount((count) => count + 1);
  }, []);

  return { phase, progress, startOnGesture, fadeOut, resume, retry };
}
