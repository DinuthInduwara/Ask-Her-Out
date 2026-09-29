import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useAudio } from "./hooks/useAudio";
import { useLyricParser } from "./hooks/useLyricParser";
import { PetalWeather } from "./components/PetalWeather";
import { MoonGarden } from "./components/MoonGarden";
import { RoseGardenFinale } from "./components/RoseGardenFinale";
import romanticMusic from "./assets/music/romantic.mp3";

const lyricsData = `
[00:17.12]So the world goes 'round and 'round (ඔය විදිහටම මේ ලෝකය කැරකෙමින් පවතිනවා...)
[00:21.16]With all you ever knew (ඔයා දන්න හැම දේමත් එක්ක...)
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


export function LoveStoryPlayer() {
  const reduceMotion = useReducedMotion();
  const lyrics = useLyricParser(lyricsData);
  const { isPlaying, currentTime, duration, progress, isLoaded, toggle, seekToPercent } = useAudio(romanticMusic, false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const lyricsContainerRef = useRef(null);
  const activeLineRef = useRef(null);
  const showFinale = currentTime >= 200;

  useEffect(() => {
    if (!lyrics.length) return;
    let nextIndex = -1;
    for (let index = lyrics.length - 1; index >= 0; index--) {
      if (currentTime >= lyrics[index].time) {
        nextIndex = index;
        break;
      }
    }
    setActiveIndex(nextIndex);
  }, [currentTime, lyrics]);

  useEffect(() => {
    if (!activeLineRef.current || !lyricsContainerRef.current) return;
    const line = activeLineRef.current;
    const container = lyricsContainerRef.current;
    container.scrollTo({
      top: line.offsetTop - container.clientHeight / 2 + line.clientHeight / 2,
      behavior: reduceMotion ? "instant" : "smooth",
    });
  }, [activeIndex, reduceMotion]);

  const formatTime = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const minutes = Math.floor(seconds / 60);
    return `${minutes}:${String(Math.floor(seconds % 60)).padStart(2, "0")}`;
  };

  return (
    <motion.main className={`song-garden-page ${showFinale ? "song-garden-page--finale" : ""}`} initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : .55 }}>
      <PetalWeather />
      <div className="song-garden-shell">
        <header className="song-garden-header"><span aria-hidden="true">✳</span> a little song for you</header>
        <div className={`song-garden-cover ${isPlaying ? "song-garden-cover--playing" : ""}`} aria-hidden={showFinale}>
          <MoonGarden />
          <p className="song-garden-kicker">for you, after all this time</p>
          <h1>A song for you.</h1>
          <span className="song-garden-handnote">I’m glad I saw you again ♡</span>
        </div>
        <div className="song-garden-lyrics" ref={lyricsContainerRef} aria-label="Song lyrics" aria-hidden={showFinale}>
          <div className="song-garden-lyric-spacer" />
          {lyrics.map((lyric, index) => (
            <div key={`${lyric.time}-${index}`} ref={index === activeIndex ? activeLineRef : null} className={`song-garden-lyric ${index === activeIndex ? "song-garden-lyric--active" : ""} ${index < activeIndex ? "song-garden-lyric--past" : ""}`}>
              <div className="song-garden-lyric-english">{lyric.englishText}</div>
              {lyric.sinhalaText && <div className="song-garden-lyric-sinhala">{lyric.sinhalaText}</div>}
            </div>
          ))}
          <div className="song-garden-lyric-spacer" />
        </div>
        {showFinale && <RoseGardenFinale />}
        <div className="song-garden-controls">
          <div className="song-garden-progress">
            <span>{formatTime(currentTime)}</span>
            <input type="range" min="0" max="100" step="0.1" value={progress} onChange={(event) => seekToPercent(Number(event.target.value))} aria-label="Song position" style={{ "--song-progress": `${progress}%` }} />
            <span>{formatTime(duration)}</span>
          </div>
          <button type="button" className="song-garden-toggle" onClick={toggle} disabled={!isLoaded} aria-label={isPlaying ? "Pause song" : "Play song"}>
            {isPlaying ? <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M8 5v14M16 5v14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg> : <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m8 5 11 7-11 7V5Z" fill="currentColor" /></svg>}
          </button>
        </div>
      </div>
    </motion.main>
  );
}
