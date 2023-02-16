# Deferred Script Loader
Defers remote scripts until specific events are fired, such as `DOMContentLoaded`, `window.onload` or immediately. Scripts can also be completely deferred until they are manually triggered which allows for custom loading triggers, such as `IntersectionObserver` event or other interactions such as `scroll`, `touchstart` etc.

## Usage
Include the command queue and script on your website. _Note: this library uses native ES modules_

```html
<!-- create the command queue -->
<!DOCTYPE html>
<html>
  <head>
    <script>
      (function (i,r) {
        window.__p1defer = r; i[r] = i[r] || function () {
          var args = arguments; (i[r].q = i[r].q || []).push(args);
          if (args[0] === 'register' && args[1] && args[1].init) args[1].init();
        }
      })(window, 'deferScript');
    </script>
    <!-- load the module -->
    <script type="module" src="./src/index.js" async defer></script>
  </head>
</html>
```

Then register a script. See the `index.html` file for more examples.
```html
<script>
/**
 * Registers a new defered script.
 */
deferScript('register', {
  /**
   * The queue name to use when invoking `deferScript('call')` commands.
   */
  name: 'googletag',

  /**
   * The remote script src to defer.
   */
  src: 'https://securepubads.g.doubleclick.net/tag/js/gpt.js',

  /**
   * When `true` will load the script as an ES module (<script type="module">).
   * Defaults to `false`
   */
  esm: false,

  /**
   * Determines when to load the remote script `src`.
   * Valid options include: `immediate`, `ready`, `load`, or `never`.
   * This can also be a function that returns the `on` string value.
   */
  on: 'ready',

  /**
   * If set, delays load of the external script until a set time after the `on`
   * event fires.
   *
   * When using `initOnly=true`, this delay is still applied when manually
   * calling `load`.
   *
   * In this example, the script would not be loaded until 3 seconds _after_ the
   * `ready` event fires (or whatever the `on` value is).
   */
  delayMs: 3000,

  /**
   * Determines whether to execute the script within an animation frame in the
   * browser.
   */
  requestFrame: true,

  /**
   * Queue setup hook. Logic within this hook is immediately executed, and is
   * useful for running setup functions (such as queues) required by the library
   * being loaded.
   *
   * Note: the init function must assign a value to the `window` object directly,
   * not declare a local var.
   */
  init: function() {
    window.googletag = window.googletag || {}; window.googletag.cmd = window.googletag.cmd || [];
    googletag.cmd.push(function() { googletag.pubads().setTargeting('uri', '/'); });
    googletag.cmd.push(function() { googletag.enableServices(); });
  },

  /**
   * When true, will only call the init function above but will _not_ load the
   * remote script.
   *
   * Instad, to call the remote script, the `deferScript('load', { name: '' })`
   * call must be invoked on your own.
   *
   * This is useful when you want to manually control when the script should
   * execute (e.g. on scroll or intersection)
   */
  initOnly: false,

  /**
   * Script attributes to pass.
   * By default both async and defer are set.
   */
  attrs: { async: 1, defer: 1 },
});
// manually calling the googletag script when using `initOnly=true`.
// deferScript('load', { name: 'googletag' });
</script>
```


## Build
Builds to native ESM using Vite (`<script type="module">`).

### Requirements
- Node.JS v14

### Sizes (non-gzipped)
- legacy webpack build: 54k
- legacy webpack build less `querystring`: 60k (likely polyfilling `URLSearchParams`)
- vite build with specific browser targets: **7.97k**

### Browser Targets
#### Modern
Located in `vite.config.js`
```js
['chrome64', 'edge79', 'safari11.1', 'firefox67', 'opera51', 'ios12']
```
To provide _minimum_ support for
- [Native ES Modules](https://caniuse.com/es6-module)
- [Native ESM Dynamic Import](https://caniuse.com/es6-module-dynamic-import)
- [Support for `import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)

#### Legacy
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
