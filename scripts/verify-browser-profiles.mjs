import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const baselineUrl = process.env.BASELINE_URL || "http://127.0.0.1:8001";
const currentUrl = process.env.CURRENT_URL || "http://127.0.0.1:8002";
const reportPath = process.env.REPORT_PATH;
const seeds = ["norway", "mo-i-rana", "1234", "fjord-city"];

const browser = await chromium.launch({ headless: true });
const results = [];
let passed = true;

async function capture(baseUrl, seed, profile) {
  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  page.on("pageerror", error => errors.push(String(error)));
  page.on("console", message => {
    if (message.type() === "error") {
      errors.push(message.text());
    }
    if (message.type() === "warning") {
      warnings.push(message.text());
    }
  });

  const query = new URLSearchParams({ seed });
  if (profile) {
    query.set("profile", profile);
  }

  await page.goto(`${baseUrl}/?${query}`, { waitUntil: "load" });
  await page.waitForFunction(() => {
    const svg = document.querySelector("#BG svg");
    return svg && svg.outerHTML.length > 500;
  });

  const initial = await page.evaluate(() => ({
    markup: document.getElementById("BG").innerHTML,
    seed: document.getElementById("INP_SEED").value,
    profile: typeof PROFILE === "undefined" ? null : PROFILE,
    activeProfile:
      typeof SceneProfiles === "undefined" ? null : SceneProfiles.getActiveId(),
    hasNaN: document.getElementById("BG").innerHTML.includes("NaN"),
  }));

  await page.evaluate(() => {
    xcroll(200);
    xcroll(200);
  });

  const scrolled = await page.evaluate(() => ({
    markup: document.getElementById("BG").innerHTML,
    viewBox: document.getElementById("SVG").getAttribute("viewBox"),
    hasNaN: document.getElementById("BG").innerHTML.includes("NaN"),
  }));

  await page.close();
  return { initial, scrolled, errors, warnings };
}

for (const seed of seeds) {
  const baseline = await capture(baselineUrl, seed);
  const original = await capture(currentUrl, seed, "original");
  const norway = await capture(currentUrl, seed, "norway");

  const checks = {
    originalMatchesBaselineInitial:
      original.initial.markup === baseline.initial.markup,
    originalMatchesBaselineScrolled:
      original.scrolled.markup === baseline.scrolled.markup,
    norwayMatchesOriginalInitial:
      norway.initial.markup === original.initial.markup,
    norwayMatchesOriginalScrolled:
      norway.scrolled.markup === original.scrolled.markup,
    originalProfileSelected:
      original.initial.profile === "original" &&
      original.initial.activeProfile === "original",
    norwayProfileSelected:
      norway.initial.profile === "norway" && norway.initial.activeProfile === "norway",
    seedPreserved:
      baseline.initial.seed === seed &&
      original.initial.seed === seed &&
      norway.initial.seed === seed,
    noErrors:
      baseline.errors.length === 0 &&
      original.errors.length === 0 &&
      norway.errors.length === 0,
    noNaN:
      !baseline.initial.hasNaN &&
      !baseline.scrolled.hasNaN &&
      !original.initial.hasNaN &&
      !original.scrolled.hasNaN &&
      !norway.initial.hasNaN &&
      !norway.scrolled.hasNaN,
  };

  if (!Object.values(checks).every(Boolean)) {
    passed = false;
  }

  results.push({ seed, checks });
}

const fallback = await capture(currentUrl, "fallback", "missing-profile");
const fallbackChecks = {
  selectedOriginal:
    fallback.initial.profile === "original" &&
    fallback.initial.activeProfile === "original",
  warningEmitted: fallback.warnings.some(message =>
    message.includes("Falling back to 'original'"),
  ),
  noErrors: fallback.errors.length === 0,
};

if (!Object.values(fallbackChecks).every(Boolean)) {
  passed = false;
}

await browser.close();

const report = [
  "# Scene profile browser regression",
  "",
  `Result: **${passed ? "PASSED" : "FAILED"}**`,
  "",
  "Compared the merged `master` baseline with the profile branch in headless Chromium.",
  "",
  "| Seed | Original vs master | Norway vs original | Profile selection | Result |",
  "| --- | --- | --- | --- | --- |",
  ...results.map(({ seed, checks }) => {
    const original =
      checks.originalMatchesBaselineInitial &&
      checks.originalMatchesBaselineScrolled;
    const norway =
      checks.norwayMatchesOriginalInitial && checks.norwayMatchesOriginalScrolled;
    const selection =
      checks.originalProfileSelected && checks.norwayProfileSelected;
    const rowPassed = Object.values(checks).every(Boolean);
    return `| \`${seed}\` | ${original ? "identical" : "different"} | ${norway ? "identical" : "different"} | ${selection ? "correct" : "incorrect"} | ${rowPassed ? "PASS" : "FAIL"} |`;
  }),
  "",
  "## Unknown profile fallback",
  "",
  `- falls back to original: ${fallbackChecks.selectedOriginal ? "PASS" : "FAIL"}`,
  `- emits warning: ${fallbackChecks.warningEmitted ? "PASS" : "FAIL"}`,
  `- browser errors: ${fallbackChecks.noErrors ? "none" : "present"}`,
  "",
  "## Raw checks",
  "",
  "```json",
  JSON.stringify({ results, fallbackChecks }, null, 2),
  "```",
  "",
].join("\n");

if (reportPath) {
  writeFileSync(reportPath, report);
}

console.log(report);
process.exitCode = passed ? 0 : 1;
