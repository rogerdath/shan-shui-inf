# Browser regression test

Result: **PASSED**

Compared `master` with `agent/refactor-index-structure` in headless Chromium.
Each seed was checked immediately after load and after two 200 px world-scroll steps.
The generated `#BG` SVG markup was compared byte for byte.

| Seed | Initial SVG | After scrolling | Result |
| --- | --- | --- | --- |
| `norway` | identical | identical | PASS |
| `mo-i-rana` | identical | identical | PASS |
| `1234` | identical | identical | PASS |
| `visual-regression` | identical | identical | PASS |
| `fjord-city` | identical | identical | PASS |

## Additional checks

- no browser page errors
- no console errors
- no `NaN` in generated markup
- SVG was present for every page load
- seeded input value was populated

## Details

```json
[
  {
    "seed": "norway",
    "seedPassed": true,
    "initialEqual": true,
    "scrolledEqual": true,
    "initialPaths": [
      0,
      0
    ],
    "scrolledPaths": [
      0,
      0
    ],
    "initialViewBox": [
      "0 0 2626.9702276707535 700.5253940455342",
      "0 0 2626.9702276707535 700.5253940455342"
    ],
    "scrolledViewBox": [
      "400 0 2626.9702276707535 700.5253940455342",
      "400 0 2626.9702276707535 700.5253940455342"
    ],
    "errors": []
  },
  {
    "seed": "mo-i-rana",
    "seedPassed": true,
    "initialEqual": true,
    "scrolledEqual": true,
    "initialPaths": [
      0,
      0
    ],
    "scrolledPaths": [
      0,
      0
    ],
    "initialViewBox": [
      "0 0 2626.9702276707535 700.5253940455342",
      "0 0 2626.9702276707535 700.5253940455342"
    ],
    "scrolledViewBox": [
      "400 0 2626.9702276707535 700.5253940455342",
      "400 0 2626.9702276707535 700.5253940455342"
    ],
    "errors": []
  },
  {
    "seed": "1234",
    "seedPassed": true,
    "initialEqual": true,
    "scrolledEqual": true,
    "initialPaths": [
      0,
      0
    ],
    "scrolledPaths": [
      0,
      0
    ],
    "initialViewBox": [
      "0 0 2626.9702276707535 700.5253940455342",
      "0 0 2626.9702276707535 700.5253940455342"
    ],
    "scrolledViewBox": [
      "400 0 2626.9702276707535 700.5253940455342",
      "400 0 2626.9702276707535 700.5253940455342"
    ],
    "errors": []
  },
  {
    "seed": "visual-regression",
    "seedPassed": true,
    "initialEqual": true,
    "scrolledEqual": true,
    "initialPaths": [
      0,
      0
    ],
    "scrolledPaths": [
      0,
      0
    ],
    "initialViewBox": [
      "0 0 2626.9702276707535 700.5253940455342",
      "0 0 2626.9702276707535 700.5253940455342"
    ],
    "scrolledViewBox": [
      "400 0 2626.9702276707535 700.5253940455342",
      "400 0 2626.9702276707535 700.5253940455342"
    ],
    "errors": []
  },
  {
    "seed": "fjord-city",
    "seedPassed": true,
    "initialEqual": true,
    "scrolledEqual": true,
    "initialPaths": [
      0,
      0
    ],
    "scrolledPaths": [
      0,
      0
    ],
    "initialViewBox": [
      "0 0 2626.9702276707535 700.5253940455342",
      "0 0 2626.9702276707535 700.5253940455342"
    ],
    "scrolledViewBox": [
      "400 0 2626.9702276707535 700.5253940455342",
      "400 0 2626.9702276707535 700.5253940455342"
    ],
    "errors": []
  }
]
```
