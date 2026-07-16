# Architecture

Shan Shui is a dependency-free browser application that generates SVG from classic JavaScript files. Executable code is separated from the HTML while retaining the original global names and synchronous load order.

## Layers

1. **Deterministic runtime** — pseudorandom generator and seed handling.
2. **Scene profiles** — immutable regional configuration, inheritance, selection, and fallback.
3. **Noise and geometry** — Perlin noise, polygon helpers, strokes, blobs, subdivision, and texture.
4. **Scene generators** — trees, mountains, architecture, people, and water.
5. **World planning and rendering** — chunk planning, depth ordering, view box, and SVG assembly.
6. **Browser controls** — navigation, seed controls, export, startup, and paper texture.

## Scene profiles

Profiles are registered before the seed is initialized. Profile registration and selection must not call `Math.random`, because the random-call sequence is part of the visual output for a seed.

The active profile is available globally as `ACTIVE_PROFILE` and through `SceneProfiles.getActive()`. The selected profile id is exposed as `PROFILE`.

Current profiles:

- `original` — the unchanged upstream behavior and default profile.
- `norway` — a configuration scaffold that currently inherits original behavior.

A profile can extend another profile. Nested objects are merged, arrays are replaced, and the resolved profile is recursively frozen.

## URL selection

```text
?seed=1234
?seed=1234&profile=original
?seed=1234&profile=norway
```

Unknown profile ids fall back to `original` and emit a browser warning.

## Compatibility contract

Until a generator explicitly reads profile configuration, both profiles must render identically for the same seed. The `original` profile remains the visual regression baseline while Norwegian generators are introduced incrementally.

## Next boundary

The next safe step is to connect one narrow generator category to the profile system. Vegetation is the preferred first category because Norwegian spruce, pine, and birch can be introduced without changing world planning or mountain geometry.
