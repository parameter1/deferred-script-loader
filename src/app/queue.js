import { EVENTS } from './constants';
import RemoteScript from './remote-script';

class Queue {
  constructor({
    name,
    src,
    on,
    logger,
  } = {}) {
    if (!EVENTS.includes(on)) throw new Error(`No event type found for '${on}'`);
    this.name = name;
    this.script = new RemoteScript({ src, logger });
    this.on = on;
    this.calls = [];
    this.logger = logger;
    this.addListeners();
  }

  push({ fn } = {}) {
    if (!fn || typeof fn !== 'function') throw new Error('The queue call must be a function');
    this.calls.push(fn);
    return this;
  }

  addListeners() {
    const { on } = this;
    const run = this.loadAndCallFns.bind(this);
    if (on === 'never') return;
    if (on === 'immediate') run();
    if (on === 'load') {
      if (document.readyState === 'complete') {
        run();
      } else {
        window.addEventListener('load', function onLoad() {
          window.removeEventListener('load', onLoad);
          run();
        });
      }
    }
    if (on === 'ready') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function onReady() {
          document.removeEventListener('DOMContentLoaded', onReady);
          run();
        });
      } else {
        run();
      }
    }
  }

  loadAndCallFns() {
    this.logger.log(`flushing queue '${this.name}' via '${this.on}'`);
    this.script.load().then(() => this.callQueuedFns());
  }

  callQueuedFns() {
    this.logger.log('calling queue functions for', this.name);
    this.calls.forEach((fn) => fn());
  }
}

export default Queue;
