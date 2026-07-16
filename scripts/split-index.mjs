import {
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(repositoryRoot, "index.html");
const scriptsDirectory = join(repositoryRoot, "src", "scripts");
const manifestPath = join(scriptsDirectory, "README.md");
const architecturePath = join(repositoryRoot, "docs", "architecture.md");

const source = readFileSync(indexPath, "utf8");
const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const generated = [];
const usedNames = new Set();
let scriptNumber = 0;

function slugify(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferName(attributes, body) {
  const id = attributes.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1];
  if (id) return slugify(id);

  const markers = [
    ["function parseArgs", "seed-and-query"],
    ["function stroke", "drawing-primitives"],
    ["var Tree", "scene-generators"],
    ["function water", "world-planner"],
    ["function download", "svg-download"],
    ["function xcroll", "controls"],
    ["var canvas = document.getElementById", "paper-texture"],
    ["window.addEventListener(\"scroll\"", "scroll-position"],
    ["rstyle(\"L\"", "left-control-init"],
    ["MEM.lasttick", "application-start"],
    ["rstyle(\"R\"", "right-control-init"],
  ];

  for (const [marker, name] of markers) {
    if (body.includes(marker)) return name;
  }

  return `inline-${String(scriptNumber).padStart(2, "0")}`;
}

function uniqueName(candidate) {
  let name = candidate;
  let suffix = 2;
  while (usedNames.has(name)) {
    name = `${candidate}-${suffix}`;
    suffix += 1;
  }
  usedNames.add(name);
  return name;
}

if (existsSync(scriptsDirectory)) {
  rmSync(scriptsDirectory, { recursive: true, force: true });
}
mkdirSync(scriptsDirectory, { recursive: true });
mkdirSync(dirname(architecturePath), { recursive: true });

const transformed = source.replace(
  scriptPattern,
  (completeMatch, attributes, body) => {
    if (/\bsrc\s*=/i.test(attributes)) return completeMatch;

    scriptNumber += 1;
    const name = uniqueName(inferName(attributes, body));
    const filename = `${String(scriptNumber).padStart(2, "0")}-${name}.js`;
    const relativePath = `src/scripts/${filename}`;
    const outputPath = join(repositoryRoot, relativePath);
    const content = body.replace(/^\r?\n/, "").replace(/[ \t]+$/gm, "").replace(/\s*$/, "") + "\n";

    writeFileSync(outputPath, content);
    generated.push({
      number: scriptNumber,
      filename,
      relativePath,
      id: attributes.match(/\bid\s*=\s*["']([^"']+)["']/i)?.[1] ?? "—",
      bytes: Buffer.byteLength(content),
      originalBody: body,
      content,
    });

    const cleanedAttributes = attributes.trim();
    const prefix = cleanedAttributes ? ` ${cleanedAttributes}` : "";
    return `<script${prefix} src="${relativePath}"></script>`;
  },
);

if (generated.length === 0) {
  throw new Error("No inline script blocks were found. Refusing to rewrite index.html.");
}

for (const entry of generated) {
  const normalizedOriginal = entry.originalBody
    .replace(/^\r?\n/, "")
    .replace(/[ \t]+$/gm, "")
    .replace(/\s*$/, "") + "\n";
  if (normalizedOriginal !== entry.content) {
    throw new Error(`Extracted content changed for ${entry.filename}`);
  }
}

writeFileSync(indexPath, transformed);

const manifestRows = generated
  .map(
    ({ number, filename, id, bytes }) =>
      `| ${number} | \`${filename}\` | \`${id}\` | ${bytes.toLocaleString("en-US")} |`,
  )
  .join("\n");

writeFileSync(
  manifestPath,
  `# Script loading order\n\n` +
    `The application intentionally uses classic browser scripts and shared globals. ` +
    `Files must remain in the order shown in \`index.html\` until the globals are replaced by explicit modules.\n\n` +
    `| Order | File | Original script id | Bytes |\n` +
    `| ---: | --- | --- | ---: |\n` +
    `${manifestRows}\n\n` +
    `## Maintenance rules\n\n` +
    `- Keep script tags synchronous; adding \`defer\` changes when DOM-dependent scripts run.\n` +
    `- Do not reorder files without checking seeded output. The generator replaces \`Math.random\`, so call order is part of the result.\n` +
    `- Add new regional behavior behind configuration or dedicated generators rather than editing drawing primitives indiscriminately.\n`,
);

writeFileSync(
  architecturePath,
  `# Architecture\n\n` +
    `Shan Shui is a dependency-free browser application that generates SVG from classic JavaScript files. ` +
    `The refactor separates executable code from the HTML without changing global names, load order, or generation logic.\n\n` +
    `## Layers\n\n` +
    `1. **Randomness and noise** — deterministic PRNG, query seed handling, and Perlin noise.\n` +
    `2. **Geometry and drawing** — polygon helpers, strokes, blobs, subdivision, and texture.\n` +
    `3. **Scene generators** — trees, mountains, architecture, people, and water.\n` +
    `4. **World planning and rendering** — chunk planning, depth ordering, view box, and SVG assembly.\n` +
    `5. **Browser controls** — navigation, seed controls, export, startup, and paper texture.\n\n` +
    `## Compatibility contract\n\n` +
    `This first refactor is structural only. It deliberately retains classic scripts and shared globals. ` +
    `That keeps the original execution order and avoids changing the random-number sequence used by a seed.\n\n` +
    `## Next refactor boundary\n\n` +
    `The next safe step is to introduce a read-only scene profile object for palette, terrain, vegetation, and architecture. ` +
    `The original profile should remain the default while a Norway profile is developed alongside it.\n`,
);

console.log(
  `Extracted ${generated.length} inline scripts into ${relative(repositoryRoot, scriptsDirectory)}.`,
);
