import isValidTarget from './utils/is-valid-target';
import isFn from './utils/is-function';

const get = (obj, prop, def) => {
  if (!obj) return def;
  const v = obj[prop];
  return v != null ? v : def;
};

class RemoteScript {
  constructor({
    name,
    src,
    esm = false,
    targetTag = 'body',
    attrs = {},
    logger,
    queryString,
    onScriptBuild,
  } = {}) {
    if (!src) throw new Error('A script source is required.');
    if (!isValidTarget(targetTag)) throw new Error('An invalid append target was specified.');
    this.esm = esm;
    this.name = name;
    this.logger = logger;
    this.queryString = queryString;
    this.src = src;
    this.setTargetTag(targetTag);
    this.async = get(attrs, 'async', 1);
    this.defer = get(attrs, 'defer', 1);
    this.crossOrigin = get(attrs, 'crossOrigin', null);
    this.onScriptBuild = onScriptBuild;
  }

  load({ on } = {}) {
    if (!this.promise) {
      const { esm, src } = this;
      this.logger.log('loading script', src);
      this.promise = new Promise((resolve, reject) => {
        const script = this.buildScriptElement();
        script.onload = () => {
          this.logger.log('script loaded successfully', src, { module: esm });
          resolve();
        };
        script.onerror = () => {
          this.logger.force('error', 'script loading failed', src, { module: esm });
          reject();
        };
        this.insertElement({ script, on });
      });
    }
    return this.promise;
  }

  buildScriptElement() {
    const { esm, crossOrigin } = this;
    const script = document.createElement('script');
    if (esm) {
      script.async = 1;
      script.defer = 1;
      script.type = 'module';
    } else {
      script.async = this.async;
      script.defer = this.defer;
      script.type = 'text/javascript';
    }
    if (crossOrigin != null) script.crossOrigin = crossOrigin;
    script.src = this.src;
    if (isFn(this.onScriptBuild)) this.onScriptBuild(script);
    return script;
  }

  insertElement({ script, on } = {}) {
    const targetTag = on === 'immediate' ? 'script' : this.targetTag;
    const target = document.getElementsByTagName(targetTag)[0];
    if (targetTag === 'script') {
      target.parentNode.insertBefore(script, target);
    } else {
      target.appendChild(script);
    }
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
