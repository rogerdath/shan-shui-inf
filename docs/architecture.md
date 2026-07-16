# Architecture

Shan Shui is a dependency-free browser application that generates SVG from classic JavaScript files. The refactor separates executable code from the HTML without changing global names, load order, or generation logic.

## Layers

1. **Randomness and noise** — deterministic PRNG, query seed handling, and Perlin noise.
2. **Geometry and drawing** — polygon helpers, strokes, blobs, subdivision, and texture.
3. **Scene generators** — trees, mountains, architecture, people, and water.
4. **World planning and rendering** — chunk planning, depth ordering, view box, and SVG assembly.
5. **Browser controls** — navigation, seed controls, export, startup, and paper texture.

## Compatibility contract

This first refactor is structural only. It deliberately retains classic scripts and shared globals. That keeps the original execution order and avoids changing the random-number sequence used by a seed.

## Next refactor boundary

The next safe step is to introduce a read-only scene profile object for palette, terrain, vegetation, and architecture. The original profile should remain the default while a Norway profile is developed alongside it.
