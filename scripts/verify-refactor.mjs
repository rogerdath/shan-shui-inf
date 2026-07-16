import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const repositoryRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const indexPath = join(repositoryRoot, "index.html");
const html = readFileSync(indexPath, "utf8");
const scriptPattern = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const scriptSources = [];
const inlineScripts = [];

for (const match of html.matchAll(scriptPattern)) {
  const attributes = match[1];
  const body = match[2];
  const source = attributes.match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];

  if (source) {
    scriptSources.push(source);
  } else if (body.trim()) {
    inlineScripts.push(body.trim().slice(0, 80));
  }
}

if (inlineScripts.length > 0) {
  throw new Error(`Found ${inlineScripts.length} non-empty inline scripts.`);
}

if (scriptSources.length === 0) {
  throw new Error("No external script references were found in index.html.");
}

const duplicates = scriptSources.filter(
  (source, index) => scriptSources.indexOf(source) !== index,
);
if (duplicates.length > 0) {
  throw new Error(`Duplicate script references: ${[...new Set(duplicates)].join(", ")}`);
}

for (const source of scriptSources) {
  const path = join(repositoryRoot, source);
  if (!existsSync(path)) {
    throw new Error(`Missing script referenced by index.html: ${source}`);
  }

  const syntaxCheck = spawnSync(process.execPath, ["--check", path], {
    encoding: "utf8",
  });
  if (syntaxCheck.status !== 0) {
    throw new Error(
      `Syntax check failed for ${source}:\n${syntaxCheck.stderr || syntaxCheck.stdout}`,
    );
  }
}

const manifest = readFileSync(
  join(repositoryRoot, "src", "scripts", "README.md"),
  "utf8",
);
for (const source of scriptSources) {
  const filename = source.split("/").at(-1);
  if (!manifest.includes(`\`${filename}\``)) {
    throw new Error(`Script is missing from the load-order manifest: ${filename}`);
  }
}

console.log(`Verified ${scriptSources.length} external scripts in load order.`);
