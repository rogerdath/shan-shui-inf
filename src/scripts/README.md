# Script loading order

The application intentionally uses classic browser scripts and shared globals. Files must remain in the order shown in `index.html` until the globals are replaced by explicit modules.

| Order | File | Responsibility |
| ---: | --- | --- |
| 1 | `src/scripts/01-prng.js` | Deterministic random number generator |
| 2 | `src/profiles/original.js` | Original upstream scene profile |
| 3 | `src/profiles/norway.js` | Norway profile scaffold |
| 4 | `src/profiles/profile-manager.js` | Profile registry, inheritance, validation, and activation |
| 5 | `src/scripts/02-seed-and-query.js` | Seed and profile query handling |
| 6 | `src/scripts/03-perlin-noise.js` | Perlin noise |
| 7 | `src/scripts/04-poly-tools.js` | Polygon utilities |
| 8 | `src/scripts/05-util.js` | Shared geometry helpers |
| 9 | `src/scripts/generator/01-drawing-primitives.js` | SVG strokes, blobs, and texture |
| 10 | `src/scripts/generator/02-trees.js` | Tree generators |
| 11 | `src/scripts/generator/03-mountains.js` | Mountain and rock generators |
| 12 | `src/scripts/generator/04-architecture.js` | Buildings, boats, and structures |
| 13 | `src/scripts/generator/05-people.js` | Human figures |
| 14 | `src/scripts/generator/06-water.js` | Water strokes |
| 15 | `src/scripts/generator/07-world-planner.js` | Procedural placement planning |
| 16 | `src/scripts/generator/08-world-runtime.js` | Chunk loading and SVG rendering |
| 17 | `src/scripts/07-downloader.js` | SVG download helper |
| 18 | `src/scripts/08-ui.js` | Navigation and seed controls |
| 19 | `src/scripts/09-scroll-position.js` | Settings control positioning |
| 20 | `src/scripts/10-scroll-position-2.js` | Source control positioning |
| 21 | `src/scripts/11-left-control-init.js` | Left navigation initialization |
| 22 | `src/scripts/12-application-start.js` | Application startup |
| 23 | `src/scripts/13-right-control-init.js` | Right navigation initialization |
| 24 | `src/scripts/14-paper-texture.js` | Paper background texture |

## Profile contract

- `original` is the default and must preserve upstream rendering.
- Profiles are immutable after registration.
- A profile may inherit from another profile through `extends`.
- Selecting a profile must not consume random numbers before `Math.seed(SEED)`.
- New regional behavior should be added behind profile configuration or dedicated generators.

## Generator boundaries

The `generator/` directory follows the existing dependency direction: drawing primitives, trees, mountains, architecture, people, water, planning, and runtime.

## Maintenance rules

- Keep script tags synchronous; adding `defer` changes when DOM-dependent scripts run.
- Do not reorder files without checking seeded output. The generator replaces `Math.random`, so call order is part of the result.
- Test `?profile=original` against the upstream visual baseline before merging profile-related changes.
