import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { chromium } from "playwright";

const baseUrl = process.env.SCENE_URL || "http://127.0.0.1:8000";
const seed = process.env.SCENE_SEED || "mo-i-rana";
const profile = process.env.SCENE_PROFILE || "norway";
const outputPath = process.env.SCENE_OUTPUT || "examples/mo-i-rana-norway.svg";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
const errors = [];

page.on("pageerror", error => errors.push(String(error)));
page.on("console", message => {
  if (message.type() === "error") {
    errors.push(message.text());
  }
});

const query = new URLSearchParams({ seed, profile });
await page.goto(`${baseUrl}/?${query}`, { waitUntil: "load" });
await page.waitForFunction(() => {
  const svg = document.querySelector("#BG svg");
  return svg && svg.outerHTML.length > 500;
});

const result = await page.evaluate(({ seed, profile }) => {
  const svg = document.querySelector("#BG svg");
  const clone = svg.cloneNode(true);
  const title = document.createElementNS("http://www.w3.org/2000/svg", "title");
  title.textContent = `Shan Shui scene — seed ${seed}, profile ${profile}`;
  const metadata = document.createElementNS("http://www.w3.org/2000/svg", "metadata");
  metadata.textContent = JSON.stringify({ seed, profile, generatedBy: "shan-shui-inf" });
  clone.prepend(metadata);
  clone.prepend(title);

  return {
    svg: clone.outerHTML,
    selectedSeed: document.getElementById("INP_SEED")?.value,
    selectedProfile: typeof PROFILE === "undefined" ? null : PROFILE,
    activeProfile:
      typeof SceneProfiles === "undefined" ? null : SceneProfiles.getActiveId(),
  };
}, { seed, profile });

await browser.close();

if (errors.length > 0) {
  throw new Error(`Browser errors:\n${errors.join("\n")}`);
}
if (result.selectedSeed !== seed) {
  throw new Error(`Expected seed ${seed}, got ${result.selectedSeed}`);
}
if (result.selectedProfile !== profile || result.activeProfile !== profile) {
  throw new Error(
    `Expected profile ${profile}, got selected=${result.selectedProfile}, active=${result.activeProfile}`,
  );
}
if (!result.svg.startsWith("<svg") || !result.svg.includes("xmlns=\"http://www.w3.org/2000/svg\"")) {
  throw new Error("Export did not produce a standalone SVG root.");
}
if (result.svg.includes("NaN")) {
  throw new Error("Exported SVG contains NaN values.");
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `<?xml version="1.0" encoding="UTF-8"?>\n${result.svg}\n`);
console.log(`Saved ${outputPath} (${result.svg.length} characters).`);
