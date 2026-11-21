// Twin Scenes: deterministic seeded RNG (mulberry32).
// One job: the same seed always deals the same decorative scatter,
// so the left and right panels match except for the real differences.

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Scatter n points inside a rectangle, deterministically from a seed.
export function scatter(seed, n, x0, y0, w, h) {
  const rng = mulberry32(seed);
  const pts = [];
  for (let i = 0; i < n; i++) {
    pts.push({ x: x0 + rng() * w, y: y0 + rng() * h, s: 0.5 + rng() });
  }
  return pts;
}
