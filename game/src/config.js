// Twin Scenes — Spot the Difference: shared constants and level metadata.
// One job: every number the rest of the game agrees on lives here.

export const CANVAS_W = 1280;
export const CANVAS_H = 800;

// Two play panels, 560x560 each, side by side.
export const PANEL_W = 560;
export const PANEL_H = 560;
export const PANEL_Y = 110;
export const LEFT_X = 40;
export const RIGHT_X = 680;

// Footer HUD strip.
export const FOOTER_Y = 686;
export const FOOTER_H = 96;

// Scoring.
export const FIND_POINTS = 100;
export const COMBO_WINDOW_SEC = 5; // finds closer than this keep the streak alive
export const WRONG_TIME_PENALTY_SEC = 5;
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 50;
export const HINT_PULSE_SEC = 2;
export const TIME_BONUS_PER_SEC = 5; // level-complete bonus per second left

// Levels: difficulty rises — later levels hide smaller, subtler differences.
export const LEVELS = [
  { name: "Harbor at Dawn",  sub: "Morning boats and gulls",   time: 120, seed: 101 },
  { name: "Night Market",    sub: "Lanterns and stalls",       time: 110, seed: 202 },
  { name: "Garden Party",    sub: "Cake, balloons and bees",   time: 100, seed: 303 },
  { name: "Mountain Cabin",  sub: "Snow, pines and smoke",     time: 95,  seed: 404 },
  { name: "Space Station",   sub: "Orbit, panels and stars",   time: 90,  seed: 505 },
  { name: "Beach Day",       sub: "Sun, sand and surf",        time: 90,  seed: 606 },
];

// Footer buttons (canvas coordinates, shared by render and input).
export const BUTTONS = [
  { id: "hint",    label: "Hint (H)",    x: 700,  y: 700, w: 120, h: 44 },
  { id: "pause",   label: "Pause (P)",   x: 832,  y: 700, w: 120, h: 44 },
  { id: "mute",    label: "Mute (M)",    x: 964,  y: 700, w: 120, h: 44 },
  { id: "restart", label: "Restart (R)", x: 1096, y: 700, w: 120, h: 44 },
];

// Menu level cards (canvas coordinates).
export const MENU_CARDS = LEVELS.map((lv, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  return { level: i, x: 90 + col * 390, y: 300 + row * 190, w: 360, h: 160 };
});

export function starsFor(timeLeft, timeTotal) {
  const frac = timeLeft / timeTotal;
  if (frac >= 0.5) return 3;
  if (frac >= 0.25) return 2;
  return 1;
}

export function titleFor(totalScore, levelsDone) {
  if (levelsDone >= 6 && totalScore >= 4500) return "Eagle Eye";
  if (levelsDone >= 6 && totalScore >= 3500) return "Sharp Spotter";
  if (levelsDone >= 4) return "Keen Observer";
  if (levelsDone >= 2) return "Curious Looker";
  return "Rookie Spotter";
}
