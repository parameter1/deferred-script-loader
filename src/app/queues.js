import Queue from './queue';
import QueryString from './query-string';

class Queues {
  constructor({ logger, queryPrefix } = {}) {
    this.logger = logger;
    this.queues = {};
    this.queryString = new QueryString({ prefix: queryPrefix });
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
      queryString: this.queryString,
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
