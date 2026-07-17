# Scene profile browser regression

Result: **PASSED**

Compared the merged `master` baseline with the profile branch in headless Chromium.

| Seed | Original vs master | Norway vs original | Profile selection | Result |
| --- | --- | --- | --- | --- |
| `norway` | identical | identical | correct | PASS |
| `mo-i-rana` | identical | identical | correct | PASS |
| `1234` | identical | identical | correct | PASS |
| `fjord-city` | identical | identical | correct | PASS |

## Unknown profile fallback

- falls back to original: PASS
- emits warning: PASS
- browser errors: none

## Raw checks

```json
{
  "results": [
    {
      "seed": "norway",
      "checks": {
        "originalMatchesBaselineInitial": true,
        "originalMatchesBaselineScrolled": true,
        "norwayMatchesOriginalInitial": true,
        "norwayMatchesOriginalScrolled": true,
        "originalProfileSelected": true,
        "norwayProfileSelected": true,
        "seedPreserved": true,
        "noErrors": true,
        "noNaN": true
      }
    },
    {
      "seed": "mo-i-rana",
      "checks": {
        "originalMatchesBaselineInitial": true,
        "originalMatchesBaselineScrolled": true,
        "norwayMatchesOriginalInitial": true,
        "norwayMatchesOriginalScrolled": true,
        "originalProfileSelected": true,
        "norwayProfileSelected": true,
        "seedPreserved": true,
        "noErrors": true,
        "noNaN": true
      }
    },
    {
      "seed": "1234",
      "checks": {
        "originalMatchesBaselineInitial": true,
        "originalMatchesBaselineScrolled": true,
        "norwayMatchesOriginalInitial": true,
        "norwayMatchesOriginalScrolled": true,
        "originalProfileSelected": true,
        "norwayProfileSelected": true,
        "seedPreserved": true,
        "noErrors": true,
        "noNaN": true
      }
    },
    {
      "seed": "fjord-city",
      "checks": {
        "originalMatchesBaselineInitial": true,
        "originalMatchesBaselineScrolled": true,
        "norwayMatchesOriginalInitial": true,
        "norwayMatchesOriginalScrolled": true,
        "originalProfileSelected": true,
        "norwayProfileSelected": true,
        "seedPreserved": true,
        "noErrors": true,
        "noNaN": true
      }
    }
  ],
  "fallbackChecks": {
    "selectedOriginal": true,
    "warningEmitted": true,
    "noErrors": true
  }
}
```
