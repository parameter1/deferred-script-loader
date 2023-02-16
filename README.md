# Deferred Script Loader

## Requirements

- Node.JS v14

## Build States (non-gzipped)
- legacy webpack build: 54k
- legacy webpack build less `querystring`: 60k (likely polyfilling `URLSearchParams`)

## Legacy Build Targets
Originally in package.json
```json
{
  "browserslist": [
    "Chrome >= 49",
    "Firefox >= 45",
    "Safari >= 9",
    "Edge >= 12",
    "IE >= 11",
    "iOS >= 10"
  ]
}
```
