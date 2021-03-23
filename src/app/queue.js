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
    requestFrame,
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

  loadAndCallFns() {
    this.logger.log(`flushing queue '${this.name}' via '${this.on}'`);
    this.script.load({ on: this.getOn() }).then(() => this.callQueuedFns());
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
