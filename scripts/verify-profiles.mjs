import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Script, createContext } from "node:vm";

const root = new URL("../", import.meta.url);
const warnings = [];
const context = createContext({
  console: {
    log() {},
    warn(message) {
      warnings.push(String(message));
    },
  },
});

function load(relativePath) {
  const filename = join(root.pathname, relativePath);
  const source = readFileSync(filename, "utf8");
  new Script(source, { filename }).runInContext(context);
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

load("src/profiles/original.js");
load("src/profiles/norway.js");
load("src/profiles/profile-manager.js");

const profiles = context.SceneProfiles;
const ids = Array.from(profiles.list());
assert(ids.includes("original"), "The original profile is not registered.");
assert(ids.includes("norway"), "The Norway profile is not registered.");

const original = profiles.get("original");
const norway = profiles.get("norway");

assert(original.id === "original", "The original profile id changed.");
assert(original.status === "active", "The original profile is not active-ready.");
assert(norway.id === "norway", "The Norway profile id changed.");
assert(norway.extends === "original", "The Norway profile must extend original.");
assert(
  norway.terrain.generator === original.terrain.generator,
  "The Norway scaffold must inherit original terrain behavior.",
);
assert(
  norway.vegetation.generator === original.vegetation.generator,
  "The Norway scaffold must inherit original vegetation behavior.",
);
assert(
  norway.targets.vegetation.species.includes("spruce"),
  "The Norway target species are missing spruce.",
);
assert(Object.isFrozen(original), "The original profile is mutable.");
assert(Object.isFrozen(norway), "The Norway profile is mutable.");
assert(Object.isFrozen(norway.targets.vegetation.species), "Nested profile data is mutable.");

const activeNorway = profiles.activate("norway");
assert(activeNorway.id === "norway", "Norway could not be activated.");
assert(profiles.getActiveId() === "norway", "The active profile id was not updated.");

const fallback = profiles.activate("missing-profile");
assert(fallback.id === "original", "Unknown profiles must fall back to original.");
assert(warnings.length === 1, "Unknown profile fallback must emit one warning.");

console.log(`Verified scene profiles: ${ids.join(", ")}.`);
