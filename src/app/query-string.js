import querystring from 'querystring';
import isValidOn from './utils/is-valid-on';
import isValidTarget from './utils/is-valid-target';

class QueryString {
  constructor({ prefix = 'defer' } = {}) {
    this.parsed = querystring.parse(window.location.search.replace(/^\?/, ''));
    this.prefix = prefix;
  }

  getOn(name) {
    return this.getOnFor(name) || this.getGlobalOn();
  }

  getTarget(name) {
    return this.getTargetFor(name) || this.getGlobalTarget();
  }

  getGlobalOn() {
    const value = this.get('on');
    return isValidOn(value) ? value : null;
  }

  getGlobalTarget() {
    const value = this.get('target');
    return isValidTarget(value) ? value : null;
  }

  getOnFor(name) {
    const value = this.get(`${name}.on`);
    return isValidOn(value) ? value : null;
  }

  getTargetFor(name) {
    const value = this.get(`${name}.target`);
    return isValidTarget(value) ? value : null;
  }

  get(key) {
    const param = `${this.prefix}.${key}`;
    return this.parsed[param];
  }
}

export default QueryString;
