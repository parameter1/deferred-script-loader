# Deferred Script Loader

## Requirements

- Node.JS v14

## Build Sizes (non-gzipped)
- legacy webpack build: 54k
- legacy webpack build less `querystring`: 60k (likely polyfilling `URLSearchParams`)
- vite build with specific browser targets: **7.97k**

## Browser Targets
### Modern
Located in `vite.config.js`
```js
['chrome64', 'edge79', 'safari11.1', 'firefox67', 'opera51', 'ios12']
```
To provide _minimum_ support for
- [Native ES Modules](https://caniuse.com/es6-module)
- [Native ESM Dynamic Import](https://caniuse.com/es6-module-dynamic-import)
- [Support for `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)

### Legacy
Originally in `package.json`
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
