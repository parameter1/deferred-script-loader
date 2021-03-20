import { EVENTS } from './constants';
import RemoteScript from './remote-script';
import onDomReady from './utils/on-dom-ready';
import onWindowLoad from './utils/on-window-load';

class Queue {
  constructor({
    name,
    src,
    on,
    attrs,
    logger,
  } = {}) {
    if (!EVENTS.includes(on)) throw new Error(`No event type found for '${on}'`);
    this.name = name;
    this.script = new RemoteScript({ src, attrs, logger });
    this.on = on;
    this.fns = [];
    this.logger = logger;
    this.addListeners();
  }

  push({ fn } = {}) {
    if (!fn || typeof fn !== 'function') throw new Error('The queue call must be a function');
    this.fns.push(fn);
    return this;
  }

  addListeners() {
    const { on } = this;
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
}

export default Queue;
