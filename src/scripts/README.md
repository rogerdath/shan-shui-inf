# Script loading order

The application intentionally uses classic browser scripts and shared globals. Files must remain in the order shown in `index.html` until the globals are replaced by explicit modules.

| Order | File | Bytes |
| ---: | --- | ---: |
| 1 | `src/scripts/01-prng.js` | 1,460 |
| 2 | `src/scripts/02-seed-and-query.js` | 496 |
| 3 | `src/scripts/03-perlin-noise.js` | 3,102 |
| 4 | `src/scripts/04-poly-tools.js` | 5,447 |
| 5 | `src/scripts/05-util.js` | 3,172 |
| 6 | `src/scripts/generator/01-drawing-primitives.js` | 6,626 |
| 7 | `src/scripts/generator/02-trees.js` | 30,539 |
| 8 | `src/scripts/generator/03-mountains.js` | 23,963 |
| 9 | `src/scripts/generator/04-architecture.js` | 23,713 |
| 10 | `src/scripts/generator/05-people.js` | 9,224 |
| 11 | `src/scripts/generator/06-water.js` | 1,049 |
| 12 | `src/scripts/generator/07-world-planner.js` | 2,806 |
| 13 | `src/scripts/generator/08-world-runtime.js` | 6,287 |
| 14 | `src/scripts/07-downloader.js` | 388 |
| 15 | `src/scripts/08-ui.js` | 1,904 |
| 16 | `src/scripts/09-scroll-position.js` | 196 |
| 17 | `src/scripts/10-scroll-position-2.js` | 188 |
| 18 | `src/scripts/11-left-control-init.js` | 32 |
| 19 | `src/scripts/12-application-start.js` | 398 |
| 20 | `src/scripts/13-right-control-init.js` | 32 |
| 21 | `src/scripts/14-paper-texture.js` | 820 |

## Generator boundaries

The `generator/` directory follows the existing dependency direction: drawing primitives, trees, mountains, architecture, people, water, planning, and runtime.

## Maintenance rules

- Keep script tags synchronous; adding `defer` changes when DOM-dependent scripts run.
- Do not reorder files without checking seeded output. The generator replaces `Math.random`, so call order is part of the result.
- Add regional behavior behind configuration or dedicated generators rather than editing drawing primitives indiscriminately.
