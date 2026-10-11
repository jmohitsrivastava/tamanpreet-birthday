const FREQ = {
  G4: 392, A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
  C3: 130.81, F3: 174.61, G3: 196,
};
const BEAT = 0.55;

const MELODY = [
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
  ["G4", 0.75], ["G4", 0.25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
  ["G4", 0.75], ["G4", 0.25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
  ["F5", 0.75], ["F5", 0.25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3],
];
const BARS = ["C3", "G3", "G3", "C3", "C3", "F3", "G3", "C3"];

function tone(ctx, out, freq, t, dur, gain, type = "sine") {
  const osc = ctx.createOscillator();
  const env = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  env.gain.setValueAtTime(0, t);
  env.gain.linearRampToValueAtTime(gain, t + 0.02);
  env.gain.exponentialRampToValueAtTime(0.001, t + dur);
  osc.connect(env).connect(out);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

export function playHappyBirthday(ctx) {
  const master = ctx.createGain();
  master.gain.value = 0.8;
  master.connect(ctx.destination);

  const delay = ctx.createDelay();
  const feedback = ctx.createGain();
  delay.delayTime.value = 0.28;
  feedback.gain.value = 0.25;
  master.connect(delay).connect(feedback).connect(delay);
  feedback.connect(ctx.destination);

  let t = ctx.currentTime + 0.1;
  const start = t;
  for (const [note, beats] of MELODY) {
    const dur = Math.max(beats * BEAT * 1.6, 0.6);
    tone(ctx, master, FREQ[note], t, dur, 0.3);
    tone(ctx, master, FREQ[note] * 2, t, dur * 0.6, 0.05, "triangle");
    t += beats * BEAT;
  }

  BARS.forEach((root, i) => {
    const bt = start + (1 + i * 3) * BEAT;
    const f = FREQ[root];
    for (const ratio of [1, 1.26, 1.5]) tone(ctx, master, f * ratio, bt, 3 * BEAT, 0.07, "triangle");
  });

  return {
    stop() {
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(0, now + 0.3);
      setTimeout(() => master.disconnect(), 400);
    },
  };
}
