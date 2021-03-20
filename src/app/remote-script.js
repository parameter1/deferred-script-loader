import { EVENTS } from './constants';

class RemoteScript {
  constructor({ src, on } = {}) {
    if (!src) throw new Error('A script source is required.');
    if (!EVENTS.includes(on)) throw new Error(`No event type found for '${on}'`);

    this.src = src;
    this.on = on;
  }
}

export default RemoteScript;
