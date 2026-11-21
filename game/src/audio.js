// Twin Scenes: all sound is synthesized with WebAudio — no audio files.
// One job: short beeps and chimes for find / wrong / hint / win.

export class SoundBank {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  ensure() {
    if (!this.ctx) {
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      } catch (e) {
        this.ctx = null;
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  tone(freq, dur, type, gain, when = 0) {
    if (this.muted) return;
    const ctx = this.ensure();
    if (!ctx) return;
    try {
      const t0 = ctx.currentTime + when;
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(gain, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.05);
    } catch (e) {
      // Headless or blocked audio must never break the game.
    }
  }

  find(comboMult) {
    this.tone(660, 0.14, "sine", 0.16);
    this.tone(880, 0.18, "sine", 0.16, 0.08);
    if (comboMult >= 2) this.tone(1320, 0.2, "sine", 0.14, 0.16);
  }

  wrong() {
    this.tone(160, 0.25, "sawtooth", 0.1);
    this.tone(110, 0.3, "sawtooth", 0.08, 0.05);
  }

  hint() {
    this.tone(1046, 0.16, "triangle", 0.12);
    this.tone(1318, 0.2, "triangle", 0.1, 0.1);
  }

  win() {
    [523, 659, 784, 1046].forEach((f, i) => this.tone(f, 0.22, "triangle", 0.14, i * 0.11));
  }
}
