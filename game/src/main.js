// Twin Scenes — Spot the Difference: bootstrap and game loop.
// One job: wire the canvas, state, input, sound and renderer together
// and run the animation loop. No game logic lives here.

import { CANVAS_W, CANVAS_H } from "./config.js";
import { createState, tick } from "./state.js";
import { attachInput, handlePanelClick } from "./input.js";
import { render } from "./render.js";
import { SoundBank } from "./audio.js";
import { applyShot, runSelfTest } from "./shots.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const state = createState();
const sounds = new SoundBank();

// Exposed for debugging and for the headless self-test only.
window.__twin = { state, sounds };

const params = new URLSearchParams(window.location.search);
applyShot(state, window.location.search);
attachInput(canvas, state, sounds);

// Self-test mode: play the whole game headlessly and report into the DOM.
if (params.get("selftest") === "1") {
  // Let one frame render first so any startup error surfaces before the test.
  requestAnimationFrame(() => {
    runSelfTest(state, sounds, handlePanelClick);
  });
}

let last = performance.now();
function loop(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  tick(state, dt);
  render(ctx, state);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// Keep the canvas exactly 1280x800 in the layout the screenshots expect.
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;
