import isValidTarget from './utils/is-valid-target';

const get = (obj, prop, def) => {
  if (!obj) return def;
  const v = obj[prop];
  return v != null ? v : def;
};

class RemoteScript {
  constructor({
    name,
    src,
    targetTag = 'body',
    attrs = {},
    logger,
    queryString,
  } = {}) {
    if (!src) throw new Error('A script source is required.');
    if (!isValidTarget(targetTag)) throw new Error('An invalid append target was specified.');
    this.name = name;
    this.logger = logger;
    this.queryString = queryString;
    this.src = src;
    this.setTargetTag(targetTag);
    this.async = get(attrs, 'async', 1);
    this.defer = get(attrs, 'defer', 1);
    this.crossOrigin = get(attrs, 'crossOrigin', null);
  }

  load() {
    if (!this.promise) {
      const { src, crossOrigin } = this;
      this.logger.log('loading script', src);
      this.promise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.async = this.async;
        script.defer = this.defer;
        script.type = 'text/javascript';
        if (crossOrigin != null) script.crossOrigin = crossOrigin;
        script.src = src;
        script.onload = () => {
          this.logger.log('script loaded successfully', src);
          resolve();
        };
        script.onerror = () => {
          this.logger.log('script loading failed', src);
          reject();
        };
        const target = document.getElementsByTagName(this.targetTag)[0];
        target.appendChild(script);
      });
    }
    return this.promise;
  }

  setTargetTag(targetTag) {
    const query = this.queryString.getTarget(this.name);
    if (query) {
      this.targetTag = query;
      this.logger.log(`set ${this.name} 'targetTag=${this.targetTag}' from query param`);
    } else {
      this.targetTag = targetTag;
    }
  }
}

export default RemoteScript;
