import isValidOn from './utils/is-valid-on';
import isValidTarget from './utils/is-valid-target';

const isValidBoolean = (v) => v === '1' || v === 'true';

class QueryString {
  constructor({ prefix = 'defer' } = {}) {
    this.parsed = new URLSearchParams(window.location.search);
    this.prefix = prefix;
  }

  getOn(name) {
    return this.getOnFor(name) || this.getGlobalOn();
  }

  getRequestFrame(name) {
    return this.getRequestFrameFor(name) || this.getGlobalRequestFrame();
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

  getGlobalRequestFrame() {
    const value = this.get('requestFrame');
    return isValidBoolean(value);
  }

  getOnFor(name) {
    const value = this.get(`${name}.on`);
    return isValidOn(value) ? value : null;
  }

  getRequestFrameFor(name) {
    const value = this.get(`${name}.requestFrame`);
    return isValidBoolean(value);
  }

  getTargetFor(name) {
    const value = this.get(`${name}.target`);
    return isValidTarget(value) ? value : null;
  }

  get(key) {
    const param = `${this.prefix}.${key}`;
    return this.parsed.get(param);
  }
}

export default QueryString;
