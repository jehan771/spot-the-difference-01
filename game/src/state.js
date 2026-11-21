// Twin Scenes: the game state machine plus scoring and the timer.
// One job: pure state transitions — no canvas, no DOM, no audio here,
// so the rules can be tested on their own.

import {
  LEVELS, FIND_POINTS, COMBO_WINDOW_SEC, WRONG_TIME_PENALTY_SEC,
  HINTS_PER_LEVEL, HINT_COST, HINT_PULSE_SEC, TIME_BONUS_PER_SEC, starsFor,
} from "./config.js";
import { diffsFor } from "./differences.js";

export function createState() {
  return {
    screen: "menu", // menu | play | levelComplete | failed | results
    levelIndex: 0,
    score: 0,          // score inside the current level
    totalScore: 0,     // banked score across finished levels
    streak: 0,         // finds inside the combo window
    comboMult: 1,
    lastFindAt: -Infinity,
    found: new Set(),  // difference ids found in this level
    hintsLeft: HINTS_PER_LEVEL,
    hintTarget: null,  // diff id being pulsed, or null
    hintPulseLeft: 0,
    timeLeft: LEVELS[0].time,
    paused: false,
    muted: false,
    shotMode: false,   // screenshot presets freeze the timer
    popups: [],        // {x, y, text, color, born, life}
    wrongMarks: [],    // {x, y, panel, born}
    crosshair: { x: 280, y: 280, panel: "left", visible: false },
    stars: [],         // stars earned per finished level
    levelScores: [],   // banked score per finished level
    failedLevel: false,
    message: "",
    messageUntil: 0,
    now: 0,            // seconds since this state was created (game clock)
  };
}

export function startLevel(state, levelIndex) {
  state.screen = "play";
  state.levelIndex = levelIndex;
  state.score = 0;
  state.streak = 0;
  state.comboMult = 1;
  state.lastFindAt = -Infinity;
  state.found = new Set();
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintTarget = null;
  state.hintPulseLeft = 0;
  state.timeLeft = LEVELS[levelIndex].time;
  state.paused = false;
  state.failedLevel = false;
  state.popups = [];
  state.wrongMarks = [];
  state.message = "";
}

export function levelDiffs(state) {
  return diffsFor(state.levelIndex);
}

export function remainingCount(state) {
  return levelDiffs(state).length - state.found.size;
}

// Register a correct find. Returns {points, mult, done} or null.
export function registerFind(state, diff, panelX, panelY) {
  if (state.found.has(diff.id)) return null;
  const gap = state.now - state.lastFindAt;
  state.streak = gap <= COMBO_WINDOW_SEC ? state.streak + 1 : 1;
  state.lastFindAt = state.now;
  state.comboMult = state.streak >= 4 ? 3 : state.streak >= 2 ? 2 : 1;
  const points = FIND_POINTS * state.comboMult;
  state.score += points;
  state.found.add(diff.id);
  state.hintTarget = null;
  state.hintPulseLeft = 0;
  state.popups.push({
    x: panelX, y: panelY,
    text: `+${points}${state.comboMult > 1 ? `  x${state.comboMult}` : ""}`,
    color: "#fbbf24", born: state.now, life: 1.2,
  });
  const done = state.found.size === levelDiffs(state).length;
  if (done) completeLevel(state);
  return { points, mult: state.comboMult, done };
}

export function completeLevel(state) {
  const lv = LEVELS[state.levelIndex];
  const bonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SEC;
  const stars = starsFor(state.timeLeft, lv.time);
  state.stars[state.levelIndex] = stars;
  state.levelScores[state.levelIndex] = state.score + bonus;
  state.totalScore += state.score + bonus;
  state.screen = "levelComplete";
  state.message = `Time bonus +${bonus}`;
}

export function failLevel(state) {
  state.screen = "failed";
  state.failedLevel = true;
  state.score = 0; // the level's score is lost on retry
  state.streak = 0;
  state.comboMult = 1;
}

export function registerWrong(state, panelX, panelY, panel) {
  state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME_PENALTY_SEC);
  state.streak = 0;
  state.comboMult = 1;
  state.wrongMarks.push({ x: panelX, y: panelY, panel, born: state.now });
  state.message = "Not a difference!  -5s";
  state.messageUntil = state.now + 1.2;
  if (state.timeLeft <= 0) failLevel(state);
}

export function useHint(state) {
  if (state.screen !== "play" || state.paused || state.hintsLeft <= 0) return null;
  const next = levelDiffs(state).find((d) => !state.found.has(d.id));
  if (!next) return null;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintTarget = next.id;
  state.hintPulseLeft = HINT_PULSE_SEC;
  return next;
}

export function togglePause(state) {
  if (state.screen !== "play") return;
  state.paused = !state.paused;
}

export function toggleMute(state) {
  state.muted = !state.muted;
}

export function nextLevel(state) {
  if (state.levelIndex + 1 < LEVELS.length) {
    startLevel(state, state.levelIndex + 1);
  } else {
    state.screen = "results";
  }
}

export function backToMenu(state) {
  state.screen = "menu";
  state.paused = false;
}

// Advance the game clock by dt seconds (timer, popups, pulses).
export function tick(state, dt) {
  state.now += dt;
  if (state.screen === "play" && !state.paused && !state.shotMode) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      failLevel(state);
    }
  }
  if (state.hintPulseLeft > 0) {
    state.hintPulseLeft -= dt;
    if (state.hintPulseLeft <= 0) state.hintTarget = null;
  }
  state.popups = state.popups.filter((p) => state.now - p.born < p.life);
  state.wrongMarks = state.wrongMarks.filter((m) => state.now - m.born < 0.9);
  if (state.message && state.now > state.messageUntil) state.message = "";
}
