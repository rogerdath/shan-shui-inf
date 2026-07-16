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
- the SVG `viewBox` matched before and after scrolling

The one-time workflow used to run this comparison was removed after the successful test. This report remains as the validation record for the refactor.
