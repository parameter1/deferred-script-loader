import Logger from './logger';
import Queues from './queues';

class App {
  /**
   *
   * @param {object} params
   * @param {boolean} [params.debug=false]
   */
  constructor({ debug = false } = {}) {
    this.logger = new Logger({ enabled: debug });
    this.queues = new Queues({ logger: this.logger });
    this.commands = [
      { handler: this.queues, method: 'register', as: 'register' },
      { handler: this.queues, method: 'call', as: 'call' },
    ].reduce((o, binding) => {
      const { handler, method } = binding;
      return { ...o, [binding.as]: handler[method].bind(handler) };
    }, {});
    this.logger.log('library loaded');
  }

  /**
   * This is the public facing API. All browser commands should be executed from this method.
   *
   * @param {string} name The function name to run.
   * @param  {...any} args The function arguments to pass.
   */
  run(name, ...args) {
    const command = this.commands[name];
    if (!command) throw new Error(`No command was found for '${name}'`);
    this.logger.log('running command', name, ...args);
    return command(...args);
  }
}

export default App;
