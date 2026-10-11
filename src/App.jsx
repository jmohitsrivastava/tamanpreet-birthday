import { useEffect, useState } from "react";
import Countdown from "./Countdown";
import Gift from "./Gift";
import Celebration from "./Celebration";
import { start, unlock } from "./player";
import "./App.css";

// Month 0 se start hota hai: 9 = October
const TARGET = new Date(2026, 9, 12, 0, 0, 0).getTime();
// Sirf local (npm run dev) pe: link ke end mein ?preview lagao toh seedha birthday screen khulegi
const PREVIEW = import.meta.env.DEV && new URLSearchParams(location.search).has("preview");

const hasInteracted = () => navigator.userActivation?.hasBeenActive ?? false;

export default function App() {
  const [now, setNow] = useState(Date.now());
  const [opened, setOpened] = useState(false);
  const isBirthday = PREVIEW || now >= TARGET;

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const keepAwake = () => navigator.wakeLock?.request("screen").catch(() => {});
    keepAwake();
    document.addEventListener("visibilitychange", keepAwake);
    return () => document.removeEventListener("visibilitychange", keepAwake);
  }, []);

  const open = () => {
    unlock();
    start();
    setOpened(true);
  };

  useEffect(() => {
    if (isBirthday && hasInteracted()) open();
  }, [isBirthday]);

  if (!isBirthday) return <Countdown msLeft={TARGET - now} />;
  if (!opened) return <Gift onOpen={open} />;
  return <Celebration />;
}
