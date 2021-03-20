import App from './app';

let instance;
const factory = (fn, ...args) => {
  if (fn === 'init') {
    if (!instance) {
      instance = new App(...args);
    } else {
      throw new Error('script defer has already been initialized.');
    }
  } else if (fn === 'destroy') {
    if (instance) {
      instance.destroy();
      instance = undefined;
    }
  } else {
    if (!instance) throw new Error('No script defer instance has been created. Ensure `deferScript(\'init\')` was run.');
    instance.run(fn, ...args);
  }
};

const execute = (stack) => {
  for (let i = 0; i < stack.length; i += 1) {
    const args = stack[i];
    factory(...args);
  }
};

const WINDOW_VAR_NAME = '__p1defer';
const queueName = window[WINDOW_VAR_NAME];
if (!queueName || !window[queueName]) {
  throw new Error(`No ${WINDOW_VAR_NAME} object was found or initialized. Was the proper JavaScript included on the page?`);
}

const { q: commands } = window[queueName];
if (Array.isArray(commands)) {
  // Find and send the init command first, then register commands
  // in case the user sent the commands out of order.
  const first = [];
  const second = [];
  const next = [];
  for (let i = 0; i < commands.length; i += 1) {
    const args = commands[i];
    if (args[0] === 'init') {
      first.push(args);
    } else if (args[0] === 'register') {
      second.push(args);
    } else {
      next.push(args);
    }
  }
  execute(first);
  execute(second);
  execute(next);
}

// Replace the queue with the app.
window[queueName] = factory;
