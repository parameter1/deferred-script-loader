const get = (obj, prop, def) => {
  if (!obj) return def;
  const v = obj[prop];
  return v != null ? v : def;
};

class RemoteScript {
  constructor({
    src,
    attrs = {},
    logger,
  } = {}) {
    if (!src) throw new Error('A script source is required.');
    this.logger = logger;
    this.src = src;
    this.async = get(attrs, 'async', 1);
    this.defer = get(attrs, 'defer', 1);
  }

  load() {
    if (!this.promise) {
      const { src } = this;
      this.logger.log('loading script', src);
      this.promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = this.async;
        script.defer = this.defer;
        script.src = src;
        script.onload = () => {
          this.logger.log('script loaded successfully', src);
          resolve();
        };
        script.onerror = () => {
          this.logger.log('script loading failed', src);
          reject();
        };
        const target = document.getElementsByTagName('script')[0];
        target.parentNode.insertBefore(script, target);
      });
    }
    return this.promise;
  }
}

export default RemoteScript;
