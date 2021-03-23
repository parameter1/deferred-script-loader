import Queue from './queue';

class Queues {
  constructor({ logger } = {}) {
    this.logger = logger;
    this.queues = {};
  }

  register({
    name,
    src,
    on,
    targetTag,
    attrs,
  } = {}) {
    if (!name) throw new Error('A queue name is required.');
    if (this.queues[name]) throw new Error(`A script queue as already been registered for '${name}'`);
    this.queues[name] = new Queue({
      name,
      src,
      on,
      targetTag,
      attrs,
      logger: this.logger,
    });
  }

  call({ name, fn } = {}) {
    const queue = this.queues[name];
    if (!queue) throw new Error(`No queue has been registered for '${name}'`);
    queue.push({ fn });
    return this;
  }
}

export default Queues;
