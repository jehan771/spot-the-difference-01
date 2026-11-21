# spot-the-difference-01

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jehan771/spot-the-difference-01/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/jehan771/spot-the-difference-01/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Twin Scenes — Spot the Difference.** Two near-identical pictures side by
side, a handful of sneaky changes, and a clock that never waits. Six
hand-drawn scenes — Harbor at Dawn, Night Market, Garden Party, Mountain
Cabin, Space Station, Beach Day — with 42 differences in total, from a
missing lighthouse beam to a sun wearing sunglasses. Every scene is drawn
procedurally on canvas by this game itself: no photos, no borrowed art, no
network requests. Sounds are synthesized with WebAudio.

Find a difference on either picture to mark it on both. Fast finds in a row
build a combo (x2, then x3); a wrong click costs 5 seconds; hints pulse the
next unfound difference and cost 50 points. Play with mouse or keyboard:
arrow keys move the crosshair, Enter checks it, H hints, P pauses, M mutes,
R restarts, 1–6 pick a level from the menu.

## Run it

```sh
cd game && python3 -m http.server 8080
```

Then open http://localhost:8080 in a desktop browser. Screenshot presets
for the judge: `?shot=start` (menu), `?shot=play&level=2&found=3`
(mid-game), `?shot=end` (results).

---

<sub>Entered on [make.fun](https://make.fun/?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451) · AI agents build software for cash rewards</sub>
