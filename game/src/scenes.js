// Twin Scenes: the six scene painters — all art is procedural canvas drawing.
// One job: paintScene(ctx, levelIndex, applied) draws one 560x560 panel.
// applied is the Set of difference ids to apply (right panel only);
// the left panel always passes an empty Set, so it is the pure base scene.
// Decorative scatter is computed from the level seed BEFORE any difference
// branch runs, so both panels stay identical except for real differences.

import { scatter } from "./random.js";

function sky(ctx, top, bottom) {
  const g = ctx.createLinearGradient(0, 0, 0, 560);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 560, 560);
}

function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

function poly(ctx, pts, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
  ctx.fill();
}

function cloud(ctx, x, y, s, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 22 * s, 0, Math.PI * 2);
  ctx.arc(x + 24 * s, y - 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.arc(x + 48 * s, y, 20 * s, 0, Math.PI * 2);
  ctx.fill();
}

function gull(ctx, x, y, s) {
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x - 12 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 9 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 9 * s, x + 12 * s, y);
  ctx.stroke();
}

function pine(ctx, x, y, s) {
  ctx.fillStyle = "#5b3a1e";
  ctx.fillRect(x - 4 * s, y - 8 * s, 8 * s, 22 * s);
  ctx.fillStyle = "#166534";
  poly(ctx, [[x - 26 * s, y - 6 * s], [x, y - 62 * s], [x + 26 * s, y - 6 * s]], "#166534");
  poly(ctx, [[x - 20 * s, y - 34 * s], [x, y - 84 * s], [x + 20 * s, y - 34 * s]], "#15803d");
}

function star4(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

// ---- Level 1: Harbor at Dawn ----
function paintHarbor(ctx, applied) {
  sky(ctx, "#fda4af", "#fef3c7");
  const pebbles = scatter(101, 26, 20, 420, 520, 120);
  circle(ctx, 452, 82, 46, applied.has("sun-color") ? "#fde68a" : "#f97316");
  circle(ctx, 452, 82, 30, applied.has("sun-color") ? "#fef9c3" : "#fb923c");
  cloud(ctx, 90, 90, 1.1, "rgba(255,255,255,0.85)");
  cloud(ctx, 330, 60, 0.8, "rgba(255,255,255,0.7)");
  // distant mountains
  poly(ctx, [[0, 330], [120, 210], [240, 330]], "#94a3b8");
  poly(ctx, [[180, 330], [320, 190], [470, 330]], "#7d8aa0");
  poly(ctx, [[380, 330], [490, 230], [560, 330]], "#94a3b8");
  // sea
  rect(ctx, 0, 330, 560, 230, "#0e7490");
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(30 + i * 90, 360 + i * 32);
    ctx.lineTo(110 + i * 90, 360 + i * 32);
    ctx.stroke();
  }
  // lighthouse (left side)
  rect(ctx, 62, 300, 56, 180, "#f8fafc");
  rect(ctx, 62, 330, 56, 18, "#dc2626");
  rect(ctx, 62, 380, 56, 18, "#dc2626");
  rect(ctx, 62, 430, 56, 18, "#dc2626");
  rect(ctx, 74, 282, 32, 22, "#334155");
  circle(ctx, 90, 293, 10, "#fde047");
  if (!applied.has("beam-missing")) {
    ctx.fillStyle = "rgba(253,224,71,0.45)";
    poly(ctx, [[100, 288], [250, 250], [250, 292]], "rgba(253,224,71,0.45)");
  }
  // pier
  rect(ctx, 180, 470, 220, 16, "#92400e");
  for (let i = 0; i < 6; i++) rect(ctx, 195 + i * 34, 486, 10, 40, "#78350f");
  // sailboat (missing diff)
  if (!applied.has("boat-missing")) {
    poly(ctx, [[300, 432], [300, 380], [338, 432]], "#f8fafc");
    poly(ctx, [[296, 432], [296, 392], [268, 432]], "#fca5a5");
    ctx.fillStyle = "#7c2d12";
    ctx.beginPath();
    ctx.moveTo(258, 432);
    ctx.lineTo(342, 432);
    ctx.lineTo(330, 448);
    ctx.lineTo(270, 448);
    ctx.closePath();
    ctx.fill();
  }
  // second boat, always there
  poly(ctx, [[430, 470], [430, 430], [462, 470]], "#e0f2fe");
  ctx.fillStyle = "#155e75";
  ctx.beginPath();
  ctx.moveTo(420, 470);
  ctx.lineTo(472, 470);
  ctx.lineTo(462, 482);
  ctx.lineTo(430, 482);
  ctx.closePath();
  ctx.fill();
  // gulls (moved diff)
  const gx = applied.has("gull-moved") ? 268 : 205;
  const gy = applied.has("gull-moved") ? 158 : 118;
  gull(ctx, gx, gy, 1);
  gull(ctx, 150, 150, 0.8);
  gull(ctx, 330, 100, 0.9);
  // pebbles on the shore
  for (const p of pebbles) circle(ctx, p.x, p.y, 3 * p.s, "#e7e5e4");
  // buoy (added diff)
  if (applied.has("buoy-added")) {
    circle(ctx, 478, 472, 14, "#dc2626");
    rect(ctx, 474, 448, 8, 12, "#dc2626");
    circle(ctx, 478, 446, 4, "#fde047");
  }
}

// ---- Level 2: Night Market ----
function paintMarket(ctx, applied) {
  sky(ctx, "#0f172a", "#1e3a5f");
  const stars = scatter(202, 40, 10, 10, 540, 180);
  for (const s of stars) {
    if (Math.abs(s.x - 418) < 12 && Math.abs(s.y - 58) < 12 && applied.has("star-missing")) continue;
    star4(ctx, s.x, s.y, 2.2 * s.s + 1, "#fde68a");
  }
  circle(ctx, 500, 66, 26, "#fef3c7");
  circle(ctx, 492, 60, 6, "#e2e8f0");
  // string lights
  ctx.strokeStyle = "#fbbf24";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 120);
  ctx.quadraticCurveTo(280, 190, 560, 110);
  ctx.stroke();
  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = t * 560;
    const y = 120 + Math.sin(t * Math.PI) * 55 - t * 10;
    circle(ctx, x, y + 8, 5, i % 3 === 0 ? "#f87171" : i % 3 === 1 ? "#fbbf24" : "#34d399");
  }
  // balloon (moved diff)
  const bx = applied.has("balloon-moved") ? 142 : 88;
  const by = applied.has("balloon-moved") ? 128 : 88;
  circle(ctx, bx, by, 16, "#ec4899");
  ctx.strokeStyle = "#f9a8d4";
  ctx.beginPath();
  ctx.moveTo(bx, by + 16);
  ctx.lineTo(bx + 6, by + 44);
  ctx.stroke();
  // stalls
  const stalls = [
    { x: 40,  awn: "#dc2626", sign: "TEA" },
    { x: 210, awn: "#16a34a", sign: "NOODLES" },
    { x: 380, awn: "#d97706", sign: "SWEETS" },
  ];
  for (const st of stalls) {
    rect(ctx, st.x, 300, 140, 130, "#78350f");
    rect(ctx, st.x, 300, 140, 26, "#451a03");
    // awning with stripes; middle stall flips when applied
    const flip = applied.has("awning-flipped") && st.x === 210;
    for (let i = 0; i < 7; i++) {
      const stripe = flip ? (i % 2 === 0 ? "#f8fafc" : st.awn) : (i % 2 === 0 ? st.awn : "#f8fafc");
      rect(ctx, st.x + i * 20, 258, 20, 42, stripe);
    }
    // stall sign; middle stall's sign goes missing when applied
    if (!(applied.has("sign-missing") && st.x === 210)) {
      rect(ctx, st.x + 25, 330, 90, 26, "#fef3c7");
      ctx.fillStyle = "#78350f";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(st.sign, st.x + 70, 348);
    }
    // goods on the counter
    circle(ctx, st.x + 30, 300, 10, "#fbbf24");
    circle(ctx, st.x + 70, 300, 10, "#f87171");
    circle(ctx, st.x + 110, 300, 10, "#34d399");
  }
  // lantern (color diff) hangs from the first stall
  circle(ctx, 148, 178, 18, applied.has("lantern-color") ? "#22c55e" : "#ef4444");
  circle(ctx, 148, 178, 9, "#fde68a");
  rect(ctx, 144, 158, 8, 6, "#fbbf24");
  // crates + cat (added diff)
  rect(ctx, 430, 440, 70, 50, "#92400e");
  rect(ctx, 440, 420, 50, 22, "#78350f");
  if (applied.has("cat-added")) {
    ellipse(ctx, 472, 428, 20, 12, "#1f2937");
    circle(ctx, 490, 416, 9, "#1f2937");
    poly(ctx, [[484, 409], [487, 400], [491, 408]], "#1f2937");
    poly(ctx, [[494, 408], [498, 400], [499, 409]], "#1f2937");
    ctx.strokeStyle = "#1f2937";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(454, 424);
    ctx.quadraticCurveTo(442, 414, 446, 402);
    ctx.stroke();
  }
  // crowd silhouettes
  for (let i = 0; i < 6; i++) {
    const x = 60 + i * 80;
    circle(ctx, x, 500, 16, "#0f172a");
    ellipse(ctx, x, 545, 22, 26, "#0f172a");
  }
  // ground
  rect(ctx, 0, 520, 560, 40, "#1c1917");
}

// ---- Level 3: Garden Party ----
function paintGarden(ctx, applied) {
  sky(ctx, "#bae6fd", "#fef9c3");
  circle(ctx, 480, 70, 34, "#fde047");
  cloud(ctx, 80, 70, 1, "rgba(255,255,255,0.9)");
  cloud(ctx, 380, 50, 0.7, "rgba(255,255,255,0.8)");
  // lawn + fence
  rect(ctx, 0, 330, 560, 230, "#4ade80");
  rect(ctx, 0, 330, 560, 10, "#16a34a");
  for (let i = 0; i < 9; i++) {
    rect(ctx, 20 + i * 62, 300, 14, 40, "#f8fafc");
    poly(ctx, [[20 + i * 62, 300], [27 + i * 62, 288], [34 + i * 62, 300]], "#f8fafc");
  }
  // tree (apple missing diff)
  ctx.fillStyle = "#5b3a1e";
  ctx.fillRect(78, 240, 20, 100);
  circle(ctx, 88, 190, 52, "#22c55e");
  circle(ctx, 60, 220, 34, "#16a34a");
  circle(ctx, 118, 220, 34, "#16a34a");
  if (!applied.has("apple-missing")) {
    circle(ctx, 88, 198, 8, "#dc2626");
    circle(ctx, 118, 168, 7, "#dc2626");
  }
  // bunting (flag flipped diff)
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 60);
  ctx.quadraticCurveTo(280, 110, 420, 60);
  ctx.stroke();
  const flagCols = ["#ef4444", "#f59e0b", "#22c55e", "#3b82f6", "#a855f7"];
  for (let i = 0; i < 5; i++) {
    const t = i / 4;
    const fx = 170 + t * 230;
    const fy = 66 + Math.sin(t * Math.PI) * 32;
    const flip = applied.has("flag-flipped") && i === 1;
    if (flip) poly(ctx, [[fx - 11, fy], [fx + 11, fy], [fx, fy + 22]], flagCols[i]);
    else poly(ctx, [[fx - 11, fy], [fx + 11, fy], [fx, fy - 22]], flagCols[i]);
  }
  // picnic table with cake
  rect(ctx, 200, 360, 180, 14, "#92400e");
  rect(ctx, 214, 374, 12, 60, "#78350f");
  rect(ctx, 354, 374, 12, 60, "#78350f");
  rect(ctx, 240, 330, 100, 30, "#f8fafc");
  rect(ctx, 240, 330, 100, 10, "#f472b6");
  if (!applied.has("candle-missing")) {
    rect(ctx, 278, 300, 6, 16, "#fde047");
    circle(ctx, 281, 296, 6, "#fb923c");
  }
  rect(ctx, 316, 306, 6, 16, "#60a5fa");
  circle(ctx, 319, 302, 5, "#fb923c");
  // teapot (color diff)
  const teaCol = applied.has("teapot-color") ? "#8b5cf6" : "#0ea5e9";
  ellipse(ctx, 352, 382, 24, 16, teaCol);
  poly(ctx, [[352, 366], [362, 356], [372, 366]], teaCol);
  ctx.strokeStyle = teaCol;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(376, 380, 10, -1.2, 1.2);
  ctx.stroke();
  // balloon (added diff)
  if (applied.has("balloon-added")) {
    circle(ctx, 498, 118, 18, "#f97316");
    ctx.strokeStyle = "#fdba74";
    ctx.beginPath();
    ctx.moveTo(498, 136);
    ctx.lineTo(502, 166);
    ctx.stroke();
  }
  // butterfly (moved diff)
  const bfx = applied.has("butterfly-moved") ? 432 : 382;
  const bfy = applied.has("butterfly-moved") ? 222 : 178;
  ellipse(ctx, bfx - 8, bfy, 9, 6, "#a855f7");
  ellipse(ctx, bfx + 8, bfy, 9, 6, "#c084fc");
  ctx.fillStyle = "#1f2937";
  ctx.fillRect(bfx - 1, bfy - 8, 2, 16);
  // roses (color diff)
  for (const [rx, ry] of [[118, 418], [150, 440], [90, 448]]) {
    circle(ctx, rx, ry, 12, applied.has("rose-color") && rx === 118 ? "#3b82f6" : "#e11d48");
    circle(ctx, rx, ry, 5, "#fde68a");
  }
  // blanket + sunflowers
  poly(ctx, [[380, 480], [520, 480], [500, 540], [400, 540]], "#f59e0b");
  poly(ctx, [[380, 480], [450, 480], [450, 540], [400, 540]], "#ef4444");
  for (const [sx, sy] of [[60, 500], [540, 500], [520, 420]]) {
    circle(ctx, sx, sy, 14, "#facc15");
    circle(ctx, sx, sy, 6, "#78350f");
    ctx.strokeStyle = "#16a34a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(sx, sy + 14);
    ctx.lineTo(sx, sy + 44);
    ctx.stroke();
  }
}

// ---- Level 4: Mountain Cabin ----
function paintCabin(ctx, applied) {
  sky(ctx, "#1e293b", "#64748b");
  const stars = scatter(404, 36, 10, 10, 540, 160);
  for (const s of stars) {
    if (Math.abs(s.x - 468) < 12 && Math.abs(s.y - 72) < 12 && applied.has("star-moved")) continue;
    star4(ctx, s.x, s.y, 2 * s.s + 1, "#fde68a");
  }
  // moved star's new home
  if (applied.has("star-moved")) star4(ctx, 420, 110, 3, "#fde68a");
  circle(ctx, 90, 80, 28, "#fef3c7");
  // mountains + snow ground
  poly(ctx, [[0, 360], [140, 180], [300, 360]], "#475569");
  poly(ctx, [[120, 220], [140, 180], [165, 220]], "#f8fafc");
  poly(ctx, [[220, 360], [380, 150], [560, 360]], "#334155");
  poly(ctx, [[355, 200], [380, 150], [408, 200]], "#f8fafc");
  rect(ctx, 0, 360, 560, 200, "#f8fafc");
  // pines (one missing diff)
  if (!applied.has("pine-missing")) pine(ctx, 88, 430, 1.1);
  pine(ctx, 480, 420, 1);
  pine(ctx, 520, 460, 0.8);
  pine(ctx, 40, 480, 0.8);
  // cabin
  rect(ctx, 220, 300, 140, 110, "#92400e");
  poly(ctx, [[205, 305], [290, 235], [375, 305]], "#7c2d12");
  rect(ctx, 300, 280, 18, 40, "#57534e");
  // chimney smoke (missing diff)
  if (!applied.has("smoke-missing")) {
    circle(ctx, 298, 118, 12, "rgba(255,255,255,0.75)");
    circle(ctx, 306, 96, 16, "rgba(255,255,255,0.6)");
    circle(ctx, 292, 74, 20, "rgba(255,255,255,0.45)");
  }
  // windows (color diff: warm light goes dark)
  rect(ctx, 238, 330, 34, 30, applied.has("window-color") ? "#1e293b" : "#fde047");
  rect(ctx, 308, 330, 34, 30, "#fde047");
  ctx.strokeStyle = "#451a03";
  ctx.lineWidth = 2;
  ctx.strokeRect(238, 330, 34, 30);
  ctx.strokeRect(308, 330, 34, 30);
  // door + wreath (flipped diff)
  rect(ctx, 272, 350, 36, 60, "#451a03");
  circle(ctx, 280, 352, 12, "#16a34a");
  if (applied.has("wreath-flipped")) {
    circle(ctx, 280, 352, 12, "#16a34a");
    circle(ctx, 280, 340, 4, "#dc2626");
  } else {
    circle(ctx, 280, 364, 4, "#dc2626");
  }
  circle(ctx, 304, 380, 3, "#fde047");
  // path
  poly(ctx, [[272, 410], [308, 410], [340, 540], [240, 540]], "#d6d3d1");
  // firewood stack (missing diff)
  if (!applied.has("firewood-missing")) {
    for (let i = 0; i < 3; i++) {
      ellipse(ctx, 402, 424 + i * 12, 22, 7, "#78350f");
      ellipse(ctx, 402, 424 + i * 12, 22, 7, "#92400e");
    }
    circle(ctx, 386, 424, 6, "#fbbf24");
    circle(ctx, 418, 436, 6, "#fbbf24");
  }
  // snowman (added diff)
  if (applied.has("snowman-added")) {
    circle(ctx, 452, 470, 22, "#ffffff");
    circle(ctx, 452, 436, 16, "#ffffff");
    circle(ctx, 452, 412, 12, "#ffffff");
    circle(ctx, 447, 410, 2, "#111827");
    circle(ctx, 457, 410, 2, "#111827");
    poly(ctx, [[452, 413], [470, 416], [452, 419]], "#f97316");
    rect(ctx, 440, 396, 24, 6, "#111827");
    rect(ctx, 446, 384, 12, 12, "#111827");
  }
}

// ---- Level 5: Space Station ----
function paintSpace(ctx, applied) {
  sky(ctx, "#020617", "#1e1b4b");
  const stars = scatter(505, 60, 10, 10, 540, 400);
  for (const s of stars) {
    const isTarget = Math.abs(s.x - 90) < 12 && Math.abs(s.y - 90) < 12;
    star4(ctx, s.x, s.y, 2 * s.s + 1, isTarget && applied.has("star-color") ? "#38bdf8" : "#fde68a");
  }
  // planet with ring (flipped diff)
  circle(ctx, 300, 120, 46, "#c084fc");
  ellipse(ctx, 300, 120, 30, 14, "#a855f7");
  ctx.strokeStyle = "#e9d5ff";
  ctx.lineWidth = 5;
  ctx.beginPath();
  if (applied.has("ring-flipped")) ctx.ellipse(300, 120, 78, 18, -0.4, 0, Math.PI * 2);
  else ctx.ellipse(300, 120, 78, 18, 0.4, 0, Math.PI * 2);
  ctx.stroke();
  // station body
  rect(ctx, 150, 270, 260, 70, "#cbd5e1");
  rect(ctx, 150, 270, 260, 12, "#94a3b8");
  circle(ctx, 150, 305, 34, "#94a3b8");
  circle(ctx, 410, 305, 34, "#94a3b8");
  // solar panels (color diff on the right panel)
  const panelCol = applied.has("panel-color") ? "#f97316" : "#1d4ed8";
  rect(ctx, 60, 250, 80, 110, panelCol);
  rect(ctx, 420, 250, 80, 110, panelCol);
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo(60 + i * 20, 250); ctx.lineTo(60 + i * 20, 360); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(420 + i * 20, 250); ctx.lineTo(420 + i * 20, 360); ctx.stroke();
  }
  // antenna (missing diff)
  if (!applied.has("antenna-missing")) {
    ctx.strokeStyle = "#e2e8f0";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(140, 270);
    ctx.lineTo(140, 150);
    ctx.stroke();
    circle(ctx, 140, 146, 6, "#f87171");
  }
  // portholes (color diff: one goes dark)
  for (const px of [200, 260, 330, 380]) {
    const dark = applied.has("porthole-color") && px === 330;
    circle(ctx, px, 300, 12, dark ? "#0f172a" : "#fde047");
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, 300, 12, 0, Math.PI * 2); ctx.stroke();
  }
  // robot arm (missing diff)
  if (!applied.has("arm-missing")) {
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(410, 340);
    ctx.lineTo(440, 320);
    ctx.lineTo(420, 300);
    ctx.stroke();
    circle(ctx, 420, 298, 8, "#f59e0b");
  }
  // astronaut (moved diff)
  const ax = applied.has("astronaut-moved") ? 260 : 200;
  const ay = applied.has("astronaut-moved") ? 340 : 380;
  circle(ctx, ax, ay - 22, 13, "#f8fafc");
  ellipse(ctx, ax, ay, 18, 22, "#f8fafc");
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(ax, ay - 22, 13, 0, Math.PI * 2); ctx.stroke();
  rect(ctx, ax - 6, ay - 26, 12, 6, "#38bdf8");
  // satellite (added diff)
  if (applied.has("satellite-added")) {
    rect(ctx, 452, 128, 36, 24, "#94a3b8");
    rect(ctx, 436, 134, 14, 12, "#1d4ed8");
    rect(ctx, 490, 134, 14, 12, "#1d4ed8");
    circle(ctx, 470, 122, 5, "#f87171");
  }
  // Earth glow at the bottom
  const g = ctx.createLinearGradient(0, 460, 0, 560);
  g.addColorStop(0, "rgba(56,189,248,0)");
  g.addColorStop(1, "rgba(56,189,248,0.55)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 460, 560, 100);
}

// ---- Level 6: Beach Day ----
function paintBeach(ctx, applied) {
  sky(ctx, "#7dd3fc", "#fef9c3");
  circle(ctx, 480, 80, 38, "#fde047");
  circle(ctx, 480, 80, 26, "#fef08a");
  // sunglasses on the sun (added diff)
  if (applied.has("shades-added")) {
    ctx.fillStyle = "#111827";
    ctx.fillRect(458, 72, 20, 12);
    ctx.fillRect(484, 72, 20, 12);
    ctx.fillRect(476, 76, 10, 3);
  }
  cloud(ctx, 90, 70, 1, "rgba(255,255,255,0.9)");
  cloud(ctx, 300, 50, 0.7, "rgba(255,255,255,0.8)");
  // sea + sand
  rect(ctx, 0, 240, 560, 150, "#0ea5e9");
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 3;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(40 + i * 120, 280 + i * 24);
    ctx.quadraticCurveTo(90 + i * 120, 268 + i * 24, 140 + i * 120, 280 + i * 24);
    ctx.stroke();
  }
  rect(ctx, 0, 390, 560, 170, "#fde68a");
  const shells = scatter(606, 18, 20, 500, 520, 50);
  for (const s of shells) circle(ctx, s.x, s.y, 3 * s.s, "#fca5a5");
  // palm tree (coconut missing diff)
  ctx.fillStyle = "#92400e";
  ctx.beginPath();
  ctx.moveTo(84, 390);
  ctx.quadraticCurveTo(96, 300, 84, 220);
  ctx.lineTo(96, 220);
  ctx.quadraticCurveTo(108, 300, 100, 390);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#16a34a";
  ctx.lineWidth = 8;
  for (const [dx, dy] of [[-40, -14], [-30, -30], [30, -30], [44, -10], [0, -38]]) {
    ctx.beginPath();
    ctx.moveTo(90, 222);
    ctx.quadraticCurveTo(90 + dx, 222 + dy, 90 + dx * 1.5, 222 + dy + 14);
    ctx.stroke();
  }
  if (!applied.has("coconut-missing")) {
    circle(ctx, 90, 220, 9, "#78350f");
    circle(ctx, 104, 228, 8, "#78350f");
  }
  // umbrella (color diff)
  const umb = applied.has("umbrella-color") ? "#22c55e" : "#ef4444";
  ctx.beginPath();
  ctx.arc(150, 210, 62, Math.PI, 0);
  ctx.closePath();
  ctx.fillStyle = umb;
  ctx.fill();
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(150, 210);
  ctx.lineTo(150, 330);
  ctx.stroke();
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(150, 150);
    ctx.lineTo(150 + i * 24, 210);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // ice cream (missing diff)
  if (!applied.has("icecream-missing")) {
    poly(ctx, [[172, 392], [188, 392], [180, 416]], "#d97706");
    circle(ctx, 180, 386, 10, "#f472b6");
    circle(ctx, 180, 378, 4, "#dc2626");
  }
  // sandcastle + flag (flipped diff)
  rect(ctx, 220, 340, 60, 50, "#fcd34d");
  poly(ctx, [[220, 340], [250, 306], [280, 340]], "#fcd34d");
  ctx.fillStyle = "#92400e";
  ctx.fillRect(248, 276, 4, 32);
  const flip = applied.has("flag-flipped");
  poly(ctx, flip ? [[252, 280], [252, 296], [232, 288]] : [[252, 280], [252, 296], [272, 288]], "#dc2626");
  // beach ball (missing diff)
  if (!applied.has("ball-missing")) {
    circle(ctx, 300, 420, 20, "#f8fafc");
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.moveTo(300, 420);
    ctx.arc(300, 420, 20, -0.6, 0.6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#3b82f6";
    ctx.beginPath();
    ctx.moveTo(300, 420);
    ctx.arc(300, 420, 20, Math.PI - 0.6, Math.PI + 0.6);
    ctx.closePath();
    ctx.fill();
  }
  // towel (color diff)
  const towel = applied.has("towel-color") ? "#a855f7" : "#f59e0b";
  rect(ctx, 320, 450, 90, 40, towel);
  rect(ctx, 320, 462, 90, 8, "#f8fafc");
  rect(ctx, 320, 478, 90, 8, "#f8fafc");
  // surfboard (added diff)
  if (applied.has("surfboard-added")) {
    ctx.save();
    ctx.translate(505, 400);
    ctx.rotate(0.5);
    ellipse(ctx, 0, 0, 12, 44, "#0ea5e9");
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(-12, -8, 24, 6);
    ctx.restore();
  }
  // crab (moved diff)
  const cx = applied.has("crab-moved") ? 380 : 430;
  const cy = applied.has("crab-moved") ? 500 : 470;
  ellipse(ctx, cx, cy, 14, 10, "#ef4444");
  circle(ctx, cx - 8, cy - 10, 4, "#ef4444");
  circle(ctx, cx + 8, cy - 10, 4, "#ef4444");
  ctx.strokeStyle = "#ef4444";
  ctx.lineWidth = 2;
  for (const s of [-1, 1]) {
    ctx.beginPath(); ctx.moveTo(cx + s * 12, cy + 2); ctx.lineTo(cx + s * 22, cy + 8); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx + s * 12, cy + 6); ctx.lineTo(cx + s * 22, cy + 12); ctx.stroke();
  }
}

export function paintScene(ctx, levelIndex, applied) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 560, 560);
  ctx.clip();
  switch (levelIndex) {
    case 0: paintHarbor(ctx, applied); break;
    case 1: paintMarket(ctx, applied); break;
    case 2: paintGarden(ctx, applied); break;
    case 3: paintCabin(ctx, applied); break;
    case 4: paintSpace(ctx, applied); break;
    default: paintBeach(ctx, applied); break;
  }
  ctx.restore();
}
