import {
  mkdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(repositoryRoot, "index.html");
const sourcePath = join(
  repositoryRoot,
  "src",
  "scripts",
  "06-drawing-primitives.js",
);
const outputDirectory = join(repositoryRoot, "src", "scripts", "generator");
const manifestPath = join(repositoryRoot, "src", "scripts", "README.md");

const source = readFileSync(sourcePath, "utf8");
const boundaries = [
  { name: "drawing-primitives", marker: null },
  { name: "trees", marker: "var Tree = new function() {" },
  { name: "mountains", marker: "var Mount = new function() {" },
  { name: "architecture", marker: "var Arch = new function() {" },
  { name: "people", marker: "var Man = new function() {" },
  { name: "water", marker: "function water(" },
  { name: "world-planner", marker: "function mountplanner(" },
  { name: "world-runtime", marker: "MEM = {" },
];

const positions = boundaries.map((boundary, index) => {
  if (index === 0) return 0;
  const position = source.indexOf(boundary.marker);
  if (position === -1) {
    throw new Error(`Could not find generator boundary: ${boundary.marker}`);
  }
  return position;
});

for (let index = 1; index < positions.length; index += 1) {
  if (positions[index] <= positions[index - 1]) {
    throw new Error(`Generator boundaries are out of order at ${boundaries[index].name}`);
  }
}

rmSync(outputDirectory, { recursive: true, force: true });
mkdirSync(outputDirectory, { recursive: true });

const generatedSources = [];
for (let index = 0; index < boundaries.length; index += 1) {
  const start = positions[index];
  const end = positions[index + 1] ?? source.length;
  const filename = `${String(index + 1).padStart(2, "0")}-${boundaries[index].name}.js`;
  const relativePath = `src/scripts/generator/${filename}`;
  const content = source.slice(start, end).replace(/\s*$/, "") + "\n";

  if (!content.trim()) {
    throw new Error(`Generated an empty section for ${relativePath}`);
  }

  writeFileSync(join(repositoryRoot, relativePath), content);
  generatedSources.push(relativePath);
}

let html = readFileSync(indexPath, "utf8");
const oldTag = '<script src="src/scripts/06-drawing-primitives.js"></script>';
if (!html.includes(oldTag)) {
  throw new Error(`Could not find the script tag to replace: ${oldTag}`);
}

const replacement = generatedSources
  .map((sourcePath) => `<script src="${sourcePath}"></script>`)
  .join("\n");
html = html.replace(oldTag, replacement);
writeFileSync(indexPath, html);
rmSync(sourcePath);

const scriptSources = [...html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["'][^>]*><\/script>/gi)].map(
  (match) => match[1],
);

const rows = scriptSources
  .map((scriptSource, index) => {
    const bytes = statSync(join(repositoryRoot, scriptSource)).size;
    return `| ${index + 1} | \`${scriptSource}\` | ${bytes.toLocaleString("en-US")} |`;
  })
  .join("\n");

writeFileSync(
  manifestPath,
  `# Script loading order\n\n` +
    `The application intentionally uses classic browser scripts and shared globals. ` +
    `Files must remain in the order shown in \`index.html\` until the globals are replaced by explicit modules.\n\n` +
    `| Order | File | Bytes |\n` +
    `| ---: | --- | ---: |\n` +
    `${rows}\n\n` +
    `## Generator boundaries\n\n` +
    `The \`generator/\` directory follows the existing dependency direction: drawing primitives, trees, mountains, architecture, people, water, planning, and runtime.\n\n` +
    `## Maintenance rules\n\n` +
    `- Keep script tags synchronous; adding \`defer\` changes when DOM-dependent scripts run.\n` +
    `- Do not reorder files without checking seeded output. The generator replaces \`Math.random\`, so call order is part of the result.\n` +
    `- Add regional behavior behind configuration or dedicated generators rather than editing drawing primitives indiscriminately.\n`,
);

console.log(`Split the main generator into ${generatedSources.length} ordered files.`);
