var SceneProfileNorway = {
  id: "norway",
  label: "Norway",
  description: "A scaffold for Norwegian terrain, vegetation, architecture, water, and settlement planning.",
  version: 1,
  status: "scaffold",
  extends: "original",
  targets: {
    palette: {
      preset: "nordic-muted",
    },
    terrain: {
      variants: ["fjord-wall", "alpine", "rounded", "plateau"],
    },
    vegetation: {
      species: ["spruce", "pine", "birch", "mountain-birch"],
    },
    architecture: {
      types: ["wood-house", "boathouse", "small-block", "industrial-building"],
    },
    water: {
      variants: ["fjord", "lake", "river", "coast"],
    },
    worldPlanning: {
      zones: ["harbor", "town-center", "residential", "industrial"],
    },
  },
};
