import querystring from 'querystring';
import { EVENTS } from './constants';
import RemoteScript from './remote-script';
import onDomReady from './utils/on-dom-ready';
import onWindowLoad from './utils/on-window-load';
import isFn from './utils/is-function';

class Queue {
  constructor({
    name,
    src,
    on,
    attrs,
    logger,
  } = {}) {
    if (!isFn(on) && !EVENTS.includes(on)) throw new Error(`No event type found for '${on}'`);
    this.name = name;
    this.script = new RemoteScript({ src, attrs, logger });
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
    const query = querystring.parse(window.location.search.replace(/^\?/, ''));
    const queryOn = query[`defer.${this.name}.on`];
    const valid = queryOn && EVENTS.includes(queryOn);
    this.on = valid ? queryOn : on;
    if (valid) this.logger.log(`on value '${this.on}' set via query string for`, this.name);
  }
}

export default Queue;
