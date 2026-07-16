var SceneProfileNorway = {
  id: "norway",
  label: "Norway",
  description: "A scaffold for Norwegian terrain, vegetation, architecture, water, and settlement planning.",
  version: 1,
  status: "scaffold",
  extends: "original",
  palette: {
    strategy: "inherit",
    preset: "nordic-muted",
  },
  terrain: {
    generator: "inherit",
    variants: ["fjord-wall", "alpine", "rounded", "plateau"],
  },
  vegetation: {
    generator: "inherit",
    species: ["spruce", "pine", "birch", "mountain-birch"],
  },
  architecture: {
    generator: "inherit",
    types: ["wood-house", "boathouse", "small-block", "industrial-building"],
  },
  water: {
    generator: "inherit",
    variants: ["fjord", "lake", "river", "coast"],
  },
  population: {
    generator: "inherit",
  },
  worldPlanning: {
    generator: "inherit",
    zones: ["harbor", "town-center", "residential", "industrial"],
  },
};
