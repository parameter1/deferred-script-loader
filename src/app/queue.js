import RemoteScript from './remote-script';
import onDomReady from './utils/on-dom-ready';
import onWindowLoad from './utils/on-window-load';
import isValidOn from './utils/is-valid-on';
import isFn from './utils/is-function';

class Queue {
  constructor({
    name,
    src,
    on = 'ready',
    esm = false,
    delayMs,
    requestFrame,
    targetTag,
    attrs,
    logger,
    queryString,
    onScriptBuild,
    onScriptLoad,
    initOnly = false,
  } = {}) {
    if (!isFn(on) && !isValidOn(on)) throw new Error(`No event type found for '${on}'`);
    this.name = name;
    this.delayMs = parseInt(delayMs, 10) || 0;
    this.queryString = queryString;
    this.script = new RemoteScript({
      name,
      src,
      esm,
      targetTag,
      attrs,
      logger,
      queryString,
      onScriptBuild,
    });
    this.fns = [];
    this.logger = logger;
    this.onScriptLoad = onScriptLoad;
    this.initOnly = initOnly;
    this.setRequestFrame(requestFrame);
    this.setOn(on);
    this.addListeners();
  }

  push({ fn } = {}) {
    if (!isFn(fn)) throw new Error('The queue call must be a function');
    this.fns.push(fn);
    return this;
  }

  addListeners() {
    const on = isFn(this.on) ? this.on() : this.on;
    const run = this.loadAndCallFns.bind(this);
    if (on === 'immediate') run();
    if (on === 'load') onWindowLoad(run, this.requestFrame);
    if (on === 'ready') onDomReady(run, this.requestFrame);
  }

  loadAndCallFns(force) {
    if (this.initOnly && !force) {
      this.logger.warn(`the queue for '${this.name}' is in initOnly mode - remote script loading is prevented`);
    } else {
      this.logger.log(`flushing queue '${this.name}' via '${this.on}'`);
      const fn = () => {
        this.script.load({ on: this.getOn() })
          .then(() => {
            if (isFn(this.onScriptLoad)) {
              this.logger.log(`calling onScriptLoad hook for '${this.name}'`);
              this.onScriptLoad(this);
            }
            this.callQueuedFns();
          })
          .catch(() => this.logger.force('error', `unable to flush queue for '${this.name}'`));
      };

      if (this.delayMs) {
        this.logger.log(`Delaying script load for '${this.name}' by ${this.delayMs}ms...`);
        setTimeout(fn, this.delayMs);
      } else {
        fn();
      }
    }
  }

  callQueuedFns() {
    this.logger.log('calling queue functions for', this.name);
    this.fns.forEach((fn) => fn());
  }

  getOn() {
    return isFn(this.on) ? this.on() : this.on;
  }

  setOn(on) {
    const query = this.queryString.getOn(this.name);
    if (query) {
      this.on = query;
      this.logger.log(`set ${this.name} 'on=${this.on}' from query param`);
    } else {
      this.on = on;
    }
  }

  setRequestFrame(requestFrame) {
    const query = this.queryString.getRequestFrame(this.name);
    if (query) {
      this.requestFrame = query;
      this.logger.log(`set ${this.name} 'requestFrame=${this.requestFrame}' from query param`);
    } else {
      this.requestFrame = requestFrame;
    }
  }
}

export default Queue;
