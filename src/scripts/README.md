# Script loading order

The application intentionally uses classic browser scripts and shared globals. Files must remain in the order shown in `index.html` until the globals are replaced by explicit modules.

| Order | File | Original script id | Bytes |
| ---: | --- | --- | ---: |
| 1 | `01-prng.js` | `PRNG` | 1,460 |
| 2 | `02-seed-and-query.js` | `—` | 496 |
| 3 | `03-perlin-noise.js` | `PerlinNoise` | 3,102 |
| 4 | `04-poly-tools.js` | `PolyTools` | 5,447 |
| 5 | `05-util.js` | `Util` | 3,172 |
| 6 | `06-drawing-primitives.js` | `—` | 104,228 |
| 7 | `07-downloader.js` | `downloader` | 388 |
| 8 | `08-ui.js` | `UI` | 1,904 |
| 9 | `09-scroll-position.js` | `—` | 196 |
| 10 | `10-scroll-position-2.js` | `—` | 188 |
| 11 | `11-left-control-init.js` | `—` | 32 |
| 12 | `12-application-start.js` | `—` | 398 |
| 13 | `13-right-control-init.js` | `—` | 32 |
| 14 | `14-paper-texture.js` | `—` | 820 |

## Maintenance rules

- Keep script tags synchronous; adding `defer` changes when DOM-dependent scripts run.
- Do not reorder files without checking seeded output. The generator replaces `Math.random`, so call order is part of the result.
- Add new regional behavior behind configuration or dedicated generators rather than editing drawing primitives indiscriminately.
