export default function Gift({ onOpen }) {
  return (
    <div className="screen gift-screen" onClick={onOpen}>
      <div className="gift">🎁</div>
      <p className="script-name">Tamanpreet ❤️</p>
      <p className="gift-text">Tap to open your surprise</p>
    </div>
  );
}
