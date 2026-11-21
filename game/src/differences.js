// Twin Scenes: the definition of every difference, per level.
// One job: data only. Coordinates live in the 560x560 panel space and
// match the objects the scene painters draw at those exact spots.
// kind: missing | color | added | moved | flipped.
// moved diffs carry an alternate position (x2, y2) used on the right panel.

export const DIFFERENCES = {
  // 1 — Harbor at Dawn — 5 differences, 120 s
  0: [
    { id: "sun-color",    x: 452, y: 82,  r: 30, kind: "color",   label: "The sun changed colour" },
    { id: "beam-missing", x: 150, y: 268, r: 30, kind: "missing", label: "The lighthouse beam is gone" },
    { id: "boat-missing", x: 300, y: 432, r: 26, kind: "missing", label: "The little sailboat is gone" },
    { id: "buoy-added",   x: 478, y: 472, r: 20, kind: "added",   label: "An extra buoy appeared" },
    { id: "gull-moved",   x: 205, y: 118, r: 22, kind: "moved",   x2: 268, y2: 158, label: "A gull moved" },
  ],
  // 2 — Night Market — 6 differences, 110 s
  1: [
    { id: "lantern-color", x: 148, y: 178, r: 22, kind: "color",   label: "A lantern changed colour" },
    { id: "sign-missing",  x: 332, y: 148, r: 26, kind: "missing", label: "A stall sign is gone" },
    { id: "cat-added",     x: 472, y: 438, r: 24, kind: "added",   label: "A cat appeared on a crate" },
    { id: "balloon-moved", x: 88,  y: 88,  r: 22, kind: "moved",   x2: 142, y2: 128, label: "A balloon drifted away" },
    { id: "awning-flipped",x: 252, y: 222, r: 30, kind: "flipped", label: "An awning pattern flipped" },
    { id: "star-missing",  x: 418, y: 58,  r: 16, kind: "missing", label: "A star went out" },
  ],
  // 3 — Garden Party — 7 differences, 100 s
  2: [
    { id: "candle-missing", x: 282, y: 296, r: 22, kind: "missing", label: "A cake candle is gone" },
    { id: "rose-color",     x: 118, y: 418, r: 20, kind: "color",   label: "A rose changed colour" },
    { id: "balloon-added",  x: 498, y: 118, r: 22, kind: "added",   label: "An extra balloon appeared" },
    { id: "butterfly-moved",x: 382, y: 178, r: 20, kind: "moved",   x2: 432, y2: 222, label: "A butterfly fluttered off" },
    { id: "flag-flipped",   x: 202, y: 88,  r: 24, kind: "flipped", label: "A bunting flag flipped" },
    { id: "apple-missing",  x: 88,  y: 198, r: 18, kind: "missing", label: "An apple is gone from the tree" },
    { id: "teapot-color",   x: 352, y: 382, r: 26, kind: "color",   label: "The teapot changed colour" },
  ],
  // 4 — Mountain Cabin — 7 differences, 95 s
  3: [
    { id: "smoke-missing",   x: 298, y: 118, r: 26, kind: "missing", label: "The chimney smoke is gone" },
    { id: "window-color",    x: 282, y: 302, r: 24, kind: "color",   label: "A cabin window went dark" },
    { id: "pine-missing",    x: 88,  y: 382, r: 28, kind: "missing", label: "A pine tree is gone" },
    { id: "snowman-added",   x: 452, y: 452, r: 26, kind: "added",   label: "A snowman appeared" },
    { id: "star-moved",      x: 468, y: 72,  r: 16, kind: "moved",   x2: 420, y2: 110, label: "A star moved" },
    { id: "wreath-flipped",  x: 280, y: 352, r: 20, kind: "flipped", label: "The door wreath flipped" },
    { id: "firewood-missing",x: 402, y: 432, r: 24, kind: "missing", label: "The firewood stack is gone" },
  ],
  // 5 — Space Station — 8 differences, 90 s
  4: [
    { id: "antenna-missing", x: 140, y: 150, r: 22, kind: "missing", label: "An antenna is gone" },
    { id: "panel-color",     x: 380, y: 250, r: 28, kind: "color",   label: "A solar panel changed colour" },
    { id: "astronaut-moved", x: 200, y: 380, r: 26, kind: "moved",   x2: 260, y2: 340, label: "The astronaut drifted" },
    { id: "satellite-added", x: 470, y: 140, r: 24, kind: "added",   label: "A satellite appeared" },
    { id: "ring-flipped",    x: 300, y: 120, r: 30, kind: "flipped", label: "The planet ring tilted the other way" },
    { id: "porthole-color",  x: 330, y: 300, r: 18, kind: "color",   label: "A porthole went dark" },
    { id: "arm-missing",     x: 420, y: 330, r: 24, kind: "missing", label: "The robot arm is gone" },
    { id: "star-color",      x: 90,  y: 90,  r: 16, kind: "color",   label: "A star changed colour" },
  ],
  // 6 — Beach Day — 9 differences, 90 s
  5: [
    { id: "umbrella-color",  x: 150, y: 180, r: 30, kind: "color",   label: "The umbrella changed colour" },
    { id: "ball-missing",    x: 300, y: 420, r: 22, kind: "missing", label: "The beach ball is gone" },
    { id: "crab-moved",      x: 430, y: 470, r: 20, kind: "moved",   x2: 380, y2: 500, label: "The crab scuttled away" },
    { id: "flag-flipped",    x: 250, y: 300, r: 20, kind: "flipped", label: "The sandcastle flag flipped" },
    { id: "surfboard-added", x: 505, y: 400, r: 24, kind: "added",   label: "A surfboard appeared" },
    { id: "shades-added",    x: 480, y: 80,  r: 22, kind: "added",   label: "The sun put on sunglasses" },
    { id: "coconut-missing", x: 90,  y: 220, r: 16, kind: "missing", label: "A coconut is gone" },
    { id: "towel-color",     x: 350, y: 470, r: 26, kind: "color",   label: "A beach towel changed colour" },
    { id: "icecream-missing",x: 180, y: 380, r: 22, kind: "missing", label: "An ice cream is gone" },
  ],
};

export function diffsFor(levelIndex) {
  return DIFFERENCES[levelIndex] || [];
}

export function totalDiffs() {
  return Object.values(DIFFERENCES).reduce((n, list) => n + list.length, 0);
}
