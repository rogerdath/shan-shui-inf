# {Shan, Shui}*

Procedurally-generated vector-format infinitely-scrolling landscape for the browser.

This fork keeps the original generator as the visual reference while preparing the codebase for regional scene profiles, beginning with Norway.

## Run locally

The extracted scripts are loaded as ordinary browser files, so serve the repository through a small local HTTP server rather than opening `index.html` directly:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

Use a deterministic seed with:

```text
http://localhost:8000/?seed=mo-i-rana
```

Select a scene profile with:

```text
http://localhost:8000/?seed=mo-i-rana&profile=original
http://localhost:8000/?seed=mo-i-rana&profile=norway
```

`original` remains the default. The current `norway` profile is a scaffold and deliberately renders with inherited original behavior until Norwegian generators are connected.

## Validate the refactor and profiles

```bash
node scripts/verify-refactor.mjs
node scripts/verify-profiles.mjs
```

The checks verify script existence and order, JavaScript syntax, absence of executable inline scripts, profile registration, inheritance, immutability, activation, and safe fallback.

The browser regression report is available in [`docs/refactor-browser-test.md`](docs/refactor-browser-test.md). It compares the original and refactored generator byte for byte across fixed seeds and scrolling.

## Architecture

See [`docs/architecture.md`](docs/architecture.md) and [`src/scripts/README.md`](src/scripts/README.md).

## Original project

The original project was created by Lingdong Huang and is inspired by traditional Chinese landscape scrolls. It models mountains and trees from noise and mathematical functions, is written in JavaScript, and outputs SVG.

Original repository: `LingDong-/shan-shui-inf`

## License

MIT. Keep the original copyright and license notice when redistributing substantial portions of the software.
