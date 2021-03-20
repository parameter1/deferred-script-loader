import { EVENTS } from './constants';
import RemoteScript from './remote-script';

class Queues {
  constructor() {
    this.queues = {};
    this.on = EVENTS.reduce((o, name) => ({ ...o, [name]: [] }), {});

    // needs to register to various events, load scripts on the event, and then fire any calls.
  }

  register({
    queueName,
    src,
    on,
    init,
  } = {}) {
    if (!queueName) throw new Error('A queue name is required.');
    if (!EVENTS.includes(on)) throw new Error(`No event type found for '${on}'`);
    if (this.queues[queueName]) throw new Error(`A script queue as already been registered for '${queueName}'`);

    const queue = {
      script: new RemoteScript({
        src,
        on,
      }),
      init,
      calls: [],
    };

    this.queues[queueName] = queue;
    this.on[on].push(queue);
  }
}

export default Queues;
