// Twin Scenes: mouse + keyboard input and the hit test.
// One job: turn a click or a crosshair check into a found difference
// (or a miss), and turn keys/buttons into game actions.
// A click counts on EITHER panel — coordinates are mirrored across panels.

import { LEFT_X, RIGHT_X, PANEL_W, PANEL_H, PANEL_Y, BUTTONS, MENU_CARDS } from "./config.js";
import { registerFind, registerWrong, useHint, togglePause, toggleMute, startLevel, backToMenu, nextLevel, levelDiffs } from "./state.js";

const HIT_TOLERANCE = 6; // small forgiveness on top of each difference radius

// Pure hit test: local panel coords -> the unfound difference hit, or null.
// Moved differences accept a click on either their old or their new spot.
export function hitTest(diffs, lx, ly, found) {
  let best = null;
  let bestD = Infinity;
  for (const d of diffs) {
    if (found.has(d.id)) continue;
    const spots = [{ x: d.x, y: d.y }];
    if (d.x2 !== undefined) spots.push({ x: d.x2, y: d.y2 });
    for (const s of spots) {
      const dist = Math.hypot(lx - s.x, ly - s.y);
      const reach = d.r + HIT_TOLERANCE;
      if (dist <= reach && dist < bestD) {
        best = d;
        bestD = dist;
      }
    }
  }
  return best;
}

// Canvas coords -> {panel, lx, ly} in 560x560 panel space, or null.
export function panelFromPoint(x, y) {
  if (y < PANEL_Y || y > PANEL_Y + PANEL_H) return null;
  if (x >= LEFT_X && x <= LEFT_X + PANEL_W) return { panel: "left", lx: x - LEFT_X, ly: y - PANEL_Y };
  if (x >= RIGHT_X && x <= RIGHT_X + PANEL_W) return { panel: "right", lx: x - RIGHT_X, ly: y - PANEL_Y };
  return null;
}

function buttonAt(x, y) {
  return BUTTONS.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) || null;
}

function menuCardAt(x, y) {
  return MENU_CARDS.find((c) => x >= c.x && x <= c.x + c.w && y >= c.y && y <= c.y + c.h) || null;
}

// Handle one panel click. Returns "find" | "wrong" | null.
export function handlePanelClick(state, sounds, x, y) {
  const hit = panelFromPoint(x, y);
  if (!hit || state.screen !== "play" || state.paused) return null;
  const diff = hitTest(levelDiffs(state), hit.lx, hit.ly, state.found);
  if (diff) {
    const res = registerFind(state, diff, hit.lx, hit.ly);
    if (res) sounds.find(res.mult);
    return "find";
  }
  registerWrong(state, hit.lx, hit.ly, hit.panel);
  sounds.wrong();
  return "wrong";
}

export function attachInput(canvas, state, sounds) {
  function toCanvas(e) {
    const r = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (canvas.width / r.width),
      y: (e.clientY - r.top) * (canvas.height / r.height),
    };
  }

  canvas.addEventListener("click", (e) => {
    const { x, y } = toCanvas(e);
    sounds.ensure();
    if (state.screen === "menu") {
      const card = menuCardAt(x, y);
      if (card) {
        startLevel(state, card.level);
        sounds.hint();
      }
      return;
    }
    if (state.screen === "levelComplete") {
      nextLevel(state);
      return;
    }
    if (state.screen === "failed") {
      startLevel(state, state.levelIndex);
      return;
    }
    if (state.screen === "results") {
      backToMenu(state);
      return;
    }
    if (state.screen !== "play") return;
    const btn = buttonAt(x, y);
    if (btn) {
      if (btn.id === "hint") {
        const d = useHint(state);
        if (d) sounds.hint();
      } else if (btn.id === "pause") togglePause(state);
      else if (btn.id === "mute") {
        toggleMute(state);
        sounds.muted = state.muted;
      } else if (btn.id === "restart") startLevel(state, state.levelIndex);
      return;
    }
    handlePanelClick(state, sounds, x, y);
  });

  canvas.addEventListener("mousemove", (e) => {
    const { x, y } = toCanvas(e);
    const hit = panelFromPoint(x, y);
    if (hit) {
      state.crosshair = { x: hit.lx, y: hit.ly, panel: hit.panel, visible: true };
    } else {
      state.crosshair.visible = false;
    }
  });

  window.addEventListener("keydown", (e) => {
    const k = e.key;
    if (state.screen === "menu" && /^[1-6]$/.test(k)) {
      startLevel(state, Number(k) - 1);
      sounds.ensure();
      return;
    }
    if (state.screen !== "play") {
      if (k === "Enter" && (state.screen === "levelComplete" || state.screen === "failed" || state.screen === "results")) {
        if (state.screen === "levelComplete") nextLevel(state);
        else if (state.screen === "failed") startLevel(state, state.levelIndex);
        else backToMenu(state);
      }
      return;
    }
    if (k === "h" || k === "H") {
      const d = useHint(state);
      if (d) sounds.hint();
    } else if (k === "p" || k === "P") togglePause(state);
    else if (k === "m" || k === "M") {
      toggleMute(state);
      sounds.muted = state.muted;
    } else if (k === "r" || k === "R") startLevel(state, state.levelIndex);
    else if (k.startsWith("Arrow")) {
      e.preventDefault();
      const step = e.shiftKey ? 24 : 8;
      const c = state.crosshair;
      c.visible = true;
      if (k === "ArrowLeft") c.x = Math.max(0, c.x - step);
      if (k === "ArrowRight") c.x = Math.min(PANEL_W, c.x + step);
      if (k === "ArrowUp") c.y = Math.max(0, c.y - step);
      if (k === "ArrowDown") c.y = Math.min(PANEL_H, c.y + step);
    } else if (k === "Enter" || k === " ") {
      e.preventDefault();
      const c = state.crosshair;
      const px = (c.panel === "left" ? LEFT_X : RIGHT_X) + c.x;
      handlePanelClick(state, sounds, px, PANEL_Y + c.y);
    }
  });
}
