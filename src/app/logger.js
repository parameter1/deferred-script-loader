class Logger {
  constructor({ enabled } = {}) {
    this.enable(enabled);
    this.name = 'defer scripts:';
  }

  enable(bit) {
    this.enabled = Boolean(bit);
  }

  log(...args) {
    this.emit('log', ...args);
  }

  info(...args) {
    this.emit('info', ...args);
  }

  warn(...args) {
    this.emit('warn', ...args);
  }

  error(...args) {
    this.emit('error', ...args);
  }

  emit(method, ...args) {
    // eslint-disable-next-line no-console
    if (this.enabled) console[method](this.name, ...args);
  }

  force(method, ...args) {
    // eslint-disable-next-line no-console
    console[method](this.name, ...args);
  }
}

export default Logger;
