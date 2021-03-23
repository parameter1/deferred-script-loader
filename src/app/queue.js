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
    targetTag,
    attrs,
    logger,
    queryString,
  } = {}) {
    if (!isFn(on) && !isValidOn(on)) throw new Error(`No event type found for '${on}'`);
    this.name = name;
    this.queryString = queryString;
    this.script = new RemoteScript({
      name,
      src,
      targetTag,
      attrs,
      logger,
      queryString,
    });
    this.fns = [];
    this.logger = logger;
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
    if (on === 'load') onWindowLoad(run);
    if (on === 'ready') onDomReady(run);
  }

  loadAndCallFns() {
    this.logger.log(`flushing queue '${this.name}' via '${this.on}'`);
    this.script.load().then(() => this.callQueuedFns());
  }

  callQueuedFns() {
    this.logger.log('calling queue functions for', this.name);
    this.fns.forEach((fn) => fn());
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
}

export default Queue;
