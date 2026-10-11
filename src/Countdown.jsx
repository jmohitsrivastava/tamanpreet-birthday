import { useState } from "react";
import { unlock } from "./player";

export default function Countdown({ msLeft }) {
  const [ready, setReady] = useState(false);
  const s = Math.floor(msLeft / 1000);
  const units = [
    ["Days", Math.floor(s / 86400)],
    ["Hours", Math.floor(s / 3600) % 24],
    ["Minutes", Math.floor(s / 60) % 60],
    ["Seconds", s % 60],
  ];

  return (
    <div className="screen countdown">
      {Array.from({ length: 40 }).map((_, k) => (
        <span
          key={k}
          className="star"
          style={{
            left: `${(k * 37) % 100}%`,
            top: `${(k * 53) % 100}%`,
            animationDelay: `${(k % 7) * 0.4}s`,
          }}
        />
      ))}

      <p className="eyebrow">For Tamanpreet ❤️</p>
      <h2 className="teaser">Something special is coming...</h2>
      <div className="boxes">
        {units.map(([label, val]) => (
          <div className="box" key={label}>
            <span key={val} className="num">{String(val).padStart(2, "0")}</span>
            <small>{label}</small>
          </div>
        ))}
      </div>
      <p className="date">12 · 10 · 2026</p>
      {ready ? (
        <p className="ready">🎵 Music ready! Bas page khula rakho...</p>
      ) : (
        <button
          className="btn"
          onClick={() => {
            unlock();
            setReady(true);
          }}
        >
          🔔 Tap once to enable music
        </button>
      )}
    </div>
  );
}
