import { playHappyBirthday } from "./happyBirthday";

const SWITCH_MS = 15000;

const files = Object.entries(
  import.meta.glob("./assets/songs/*.{mp3,m4a,ogg,wav,MP3}", { eager: true, import: "default" })
)
  .map(([path, url]) => ({ name: path.split("/").pop().replace(/\.\w+$/, ""), url }))
  .sort((a, b) => a.name.localeCompare(b.name));

// Agar songs folder mein "happy-birthday.mp3" hai toh wahi pehle bajega, warna built-in dhun
const realHappyBirthday = files.find((t) => t.name.toLowerCase() === "happy-birthday");
export const tracks = [
  realHappyBirthday || { name: "happy-birthday", synth: true },
  ...files.filter((t) => t !== realHappyBirthday),
];

export const trackTitle = (t) =>
  t.synth ? "Happy Birthday 🎂" : t.name.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ");

const audio = new Audio();
const positions = {};
const listeners = new Set();
let ctx, synth, timer, currentUrl;
let state = { index: 0, playing: false };

const setState = (patch) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
export const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getState = () => state;

const getCtx = () => (ctx ||= new AudioContext());

export function unlock() {
  getCtx().resume();
}

function stopCurrent() {
  clearTimeout(timer);
  synth?.stop();
  synth = null;
  if (!audio.paused) {
    positions[currentUrl] = audio.currentTime;
    audio.pause();
  }
}

function playTrack(i) {
  stopCurrent();
  const index = (i + tracks.length) % tracks.length;
  const t = tracks[index];
  setState({ index, playing: true });

  if (t.synth) {
    const c = getCtx();
    c.resume();
    synth = playHappyBirthday(c);
  } else {
    currentUrl = t.url;
    audio.src = `${t.url}#t=${positions[t.url] || 0}`;
    audio.play().catch((e) => {
      if (e.name === "NotAllowedError") stop();
    });
  }
  timer = setTimeout(() => playTrack(index + 1), SWITCH_MS);
}

audio.addEventListener("ended", () => {
  positions[currentUrl] = 0;
  playTrack(state.index + 1);
});
audio.addEventListener("error", () => {
  if (state.playing) playTrack(state.index + 1);
});

export function start() {
  if (!state.playing) playTrack(0);
}

export function stop() {
  stopCurrent();
  setState({ playing: false });
}

export const toggle = () => (state.playing ? stop() : playTrack(state.index));
