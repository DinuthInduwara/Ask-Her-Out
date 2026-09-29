let preparedAudio = null;
let preparedSource = null;

export function preloadAudio(source) {
  if (preparedAudio && preparedSource === source) return;
  preparedAudio = new Audio(source);
  preparedAudio.preload = "auto";
  preparedSource = source;
  preparedAudio.load();
}

export function takePreparedAudio(source) {
  if (preparedAudio && preparedSource === source) {
    const audio = preparedAudio;
    preparedAudio = null;
    preparedSource = null;
    return audio;
  }

  const audio = new Audio(source);
  audio.preload = "auto";
  return audio;
}

export function releasePreparedAudio(source, audio) {
  audio.pause();
  if (audio.readyState > 0) audio.currentTime = 0;
  preparedAudio = audio;
  preparedSource = source;
}
