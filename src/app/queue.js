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
    on = 'ready',
    attrs,
    logger,
  } = {}) {
    if (!isFn(on) && !Queue.isOnValid(on)) throw new Error(`No event type found for '${on}'`);
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
    const { isOnValid } = Queue;
    const query = querystring.parse(window.location.search.replace(/^\?/, ''));
    const queueParam = `defer.${this.name}.on`;

    const ons = { global: query['defer.on'], query: query[queueParam] };
    if (isOnValid(ons.query)) {
      this.on = ons.query;
      this.logger.log('setting `on` value from queue query param', queueParam, this.name, this.on);
    } else if (isOnValid(ons.global)) {
      this.on = ons.global;
      this.logger.log('setting `on` value from global query param', this.name, this.on);
    } else {
      this.on = on;
    }
  }

  static isOnValid(on) {
    return on && EVENTS.includes(on);
  }
}

export default Queue;
