// Twin Scenes: deterministic screenshot presets, driven by URL parameters.
// One job: turn ?shot=start | ?shot=play&level=2&found=3 | ?shot=end into
// a frozen, repeatable game state the judge's screenshots are taken from.
// The timer never runs in shot mode, so every capture looks the same.

import { LEVELS } from "./config.js";
import { startLevel, registerFind, completeLevel } from "./state.js";
import { diffsFor } from "./differences.js";

export function applyShot(state, search) {
  const params = new URLSearchParams(search);
  const shot = params.get("shot");
  if (!shot) return false;
  state.shotMode = true;
  if (shot === "start") {
    state.screen = "menu";
    return true;
  }
  if (shot === "play") {
    const level = Math.min(6, Math.max(1, Number(params.get("level") || 2))) - 1;
    const found = Math.min(9, Math.max(0, Number(params.get("found") || 3)));
    startLevel(state, level);
    state.shotMode = true;
    // Mark the first `found` differences as found, in definition order,
    // with the same combo scoring real play would award.
    const diffs = diffsFor(level);
    for (let i = 0; i < found && i < diffs.length; i++) {
      registerFind(state, diffs[i], diffs[i].x, diffs[i].y);
    }
    state.screen = "play";
    state.timeLeft = Math.round(LEVELS[level].time * 0.68);
    return true;
  }
  if (shot === "end") {
    // A finished run: every level cleared, fixed totals, fixed stars.
    state.screen = "results";
    state.stars = [3, 3, 2, 3, 2, 3];
    state.levelScores = [820, 940, 1010, 880, 960, 1140];
    state.totalScore = state.levelScores.reduce((a, b) => a + b, 0);
    return true;
  }
  return false;
}

// Headless self-test (?selftest=1): play every level to completion through
// the same click path a mouse uses, then report the result into the DOM
// so a headless run can read it back without a debugger attached.
export function runSelfTest(state, sounds, handlePanelClick) {  const report = { levels: [], errors: [] };
  try {
    for (let lv = 0; lv < LEVELS.length; lv++) {
      startLevel(state, lv);
      state.shotMode = true;
      const diffs = diffsFor(lv);
      let found = 0;
      // One deliberate wrong click first: must cost 5s and never crash.
      const tBefore = state.timeLeft;
      const wrongRes = handlePanelClick(state, sounds, 40 + 10, 110 + 550);
      const wrongOk = wrongRes === "wrong" && Math.abs(state.timeLeft - (tBefore - 5)) < 0.01;
      for (const d of diffs) {
        const px = 40 + d.x; // left panel
        const before = state.found.size;
        const res = handlePanelClick(state, sounds, px, 110 + d.y);
        if (res === "find" && state.found.size === before + 1) found++;
        else report.errors.push(`level ${lv + 1} diff ${d.id}: click returned ${res}`);
      }
      report.levels.push({
        level: lv + 1,
        diffs: diffs.length,
        found,
        screenAfter: state.screen,
        wrongClickCost5s: wrongOk,
        score: state.levelScores[lv] ?? state.score,
      });
      if (state.screen !== "levelComplete") {
        report.errors.push(`level ${lv + 1}: expected levelComplete, got ${state.screen}`);
      }
    }
    report.allLevelsComplete = report.levels.every((l) => l.found === l.diffs && l.screenAfter === "levelComplete");
    report.totalScore = state.totalScore;
  } catch (e) {
    report.errors.push(`exception: ${e && e.message}`);
  }
  const el = document.getElementById("selftest");
  if (el) el.textContent = JSON.stringify(report);
  document.title = `SELFTEST ${report.allLevelsComplete ? "PASS" : "FAIL"}`;
  return report;
}
