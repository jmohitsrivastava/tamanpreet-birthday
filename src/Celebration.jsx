import { useEffect, useState, useSyncExternalStore } from "react";
import confetti from "canvas-confetti";
import { getState, subscribe, toggle, trackTitle, tracks } from "./player";

// src/assets/photos mein jitni bhi photos daalo, sab naam ke order mein slide hongi
const PHOTOS = Object.entries(
  import.meta.glob("./assets/photos/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG}", {
    eager: true,
    import: "default",
  })
)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, url]) => url);

const INTRO_MS = 7500;
const SLIDE_MS = 4000;
const WISH_MS = 30000;

const WISHES = [
  [
    "My love, ever since you came into my life, every morning feels more beautiful. Your smile is my biggest happiness, and your laugh is my favourite sound in the world.",
    "Happy Birthday, my love. I love you, today and always. ❤️",
  ],
  [
    "On your special day, I just want to thank you for being you: kind, beautiful, and the best part of every single day of mine.",
    "May all your dreams come true, Tamanpreet. 🌸",
  ],
  [
    "Some people search their whole lives for the one who makes their heart feel at home. I found mine in you.",
    "You are my today and all of my tomorrows. 💖",
  ],
  [
    "I promise to hold your hand through every high and low, to make you laugh on your hardest days, and to celebrate every birthday right by your side.",
    "Here's to us, and to forever. 🥂",
  ],
  [
    "If I had to choose again, a million times over, I would still choose you. Every single time, without a second thought.",
    "Happy Birthday to the love of my life. ❤️",
  ],
  [
    "May this year bring you endless smiles, beautiful surprises, and all the love you so truly deserve. You make the world brighter just by being in it.",
    "Stay happy, stay mine. Happy Birthday! 🎂",
  ],
];
const COLORS = ["#f3d27a", "#e8b04b", "#fff1c1", "#ff6b8b", "#ff2e63"];
const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });

const firework = () =>
  confetti({
    particleCount: 70,
    spread: 360,
    startVelocity: 28,
    ticks: 90,
    gravity: 0.7,
    scalar: 0.9,
    colors: COLORS,
    shapes: ["circle", "star"],
    origin: { x: 0.15 + Math.random() * 0.7, y: 0.15 + Math.random() * 0.35 },
  });

const heartBurst = () =>
  confetti({
    particleCount: 10,
    angle: 90,
    spread: 70,
    startVelocity: 45,
    ticks: 220,
    scalar: 2,
    shapes: [heart],
    origin: { x: Math.random(), y: 1 },
  });

function Letters({ text, baseDelay = 0 }) {
  let i = 0;
  return text.split(" ").map((word, w) => (
    <span key={w} className="word">
      {[...word].map((ch, k) => (
        <span key={k} className="letter" style={{ animationDelay: `${baseDelay + i++ * 0.07}s` }}>
          {ch}
        </span>
      ))}
    </span>
  ));
}

function Intro() {
  return (
    <div className="intro">
      <p className="intro-date">12 · 10 · 2026</p>
      <h1 className="gold-title">
        <Letters text="Happy Birthday" baseDelay={0.6} />
      </h1>
      <h2 className="script-name intro-name">Tamanpreet</h2>
      <p className="intro-love">my love ❤️</p>
      <p className="intro-from">from Jayansh</p>
    </div>
  );
}

const cardPos = (k, i, n) => {
  const d = (k - i + n) % n;
  if (d === 0) return "center";
  if (d === 1) return "right";
  if (d === n - 1) return "left";
  return "hidden";
};

function Main() {
  const [index, setIndex] = useState(0);
  const n = PHOTOS.length;

  useEffect(() => {
    if (n < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % n), SLIDE_MS);
    return () => clearInterval(id);
  }, [n]);

  return (
    <>
      <div className="bg">
        {PHOTOS.map((src, k) => (
          <img key={src} src={src} alt="" className={k === index ? "show" : ""} />
        ))}
      </div>

      <div className="main">
        <header className="main-head">
          <p className="eyebrow">Janamdin diyan lakh lakh vadhaiyaan 🎉</p>
          <h1 className="gold-title small">
            <Letters text="Happy Birthday" />
          </h1>
          <h2 className="script-name">Tamanpreet, my love ❤️</h2>
        </header>

        <div className="stage">
          {PHOTOS.map((src, k) => (
            <img key={src} src={src} alt="" className="card" data-pos={cardPos(k, index, n)} />
          ))}
        </div>

        <WishCard />
      </div>
    </>
  );
}

function WishCard() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % WISHES.length), WISH_MS);
    return () => clearInterval(id);
  }, []);

  const [message, closing] = WISHES[index];
  return (
    <div className="wish-card">
      <div key={index} className="wish-text">
        <p>{message}</p>
        <p>{closing}</p>
      </div>
      <p className="signature">Forever yours, Jayansh 💌</p>
    </div>
  );
}

function Hearts() {
  return (
    <div className="hearts">
      {Array.from({ length: 16 }).map((_, k) => (
        <span
          key={k}
          className="float-heart"
          style={{
            left: `${(k * 61) % 100}%`,
            animationDuration: `${9 + (k % 5) * 2}s`,
            animationDelay: `${(k * 1.3) % 10}s`,
            "--s": 0.6 + (k % 4) * 0.25,
          }}
        >
          {k % 3 ? "❤" : "💖"}
        </span>
      ))}
    </div>
  );
}

function MusicPill() {
  const { index, playing } = useSyncExternalStore(subscribe, getState);
  return (
    <button className="music-pill" onClick={toggle}>
      <span className={`eq ${playing ? "on" : ""}`}>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="track">{playing ? trackTitle(tracks[index]) : "Tap to play music"}</span>
      <span className="pp">{playing ? "❚❚" : "▶"}</span>
    </button>
  );
}

export default function Celebration() {
  const [phase, setPhase] = useState("intro");

  useEffect(() => {
    const id = setTimeout(() => setPhase("main"), INTRO_MS);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase === "intro") {
      const id = setInterval(firework, 600);
      return () => clearInterval(id);
    }
    const a = setInterval(firework, 5000);
    const b = setInterval(heartBurst, 3000);
    return () => {
      clearInterval(a);
      clearInterval(b);
    };
  }, [phase]);

  return (
    <div className="celebration">
      <Hearts />
      {phase === "intro" ? <Intro /> : <Main />}
      <MusicPill />
    </div>
  );
}
