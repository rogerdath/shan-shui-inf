# {Shan, Shui}*

Procedurally-generated vector-format infinitely-scrolling Chinese landscape for the browser.

Generate the original project on https://lingdong-.github.io/shan-shui-inf/ (or the [alternative link](https://shan-shui-inf.glitch.me)).

Some examples:

![Screenshot1](/screenshots/screen001.jpg?raw=true "")
![Screenshot2](/screenshots/screen002.jpg?raw=true "")

{Shan, Shui}\* is inspired by [traditional Chinese landscape scrolls](https://en.wikipedia.org/wiki/Shan_shui) (such as [this](https://en.wikipedia.org/wiki/Dwelling_in_the_Fuchun_Mountains) and [this](https://en.wikipedia.org/wiki/Wang_Ximeng)) and uses noise and mathematical functions to model mountains and trees from scratch. It is written entirely in JavaScript and outputs Scalable Vector Graphics (SVG).

## This fork

This fork is being prepared for regional scene profiles, beginning with Norwegian terrain, vegetation, architecture, and settlements. The original visual behavior remains the default reference.

## Project structure

- `index.html` contains the document structure and preserves synchronous script order.
- `src/scripts/` contains random generation, noise, geometry, controls, and startup code.
- `src/scripts/generator/` separates drawing primitives, trees, mountains, architecture, people, water, world planning, and runtime rendering.
- `docs/architecture.md` describes the dependency direction and compatibility constraints.
- `scripts/verify-refactor.mjs` checks references, duplicate entries, load-order documentation, and JavaScript syntax.

The generator still uses classic browser globals intentionally. Script order affects seeded output because the project replaces `Math.random` with its deterministic generator.

## Run locally

Serve the repository as static files and open it in a browser:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

Run the structural verification with:

```bash
node scripts/verify-refactor.mjs
```
