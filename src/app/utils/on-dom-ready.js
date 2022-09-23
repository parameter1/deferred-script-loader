export default (callback, requestFrame) => {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function fn() {
      document.removeEventListener('DOMContentLoaded', fn);
      if (requestFrame) {
        requestAnimationFrame(() => {
          callback();
        });
      } else {
        callback();
      }
    });
  } else if (requestFrame) {
    requestAnimationFrame(() => {
      callback();
    });
  } else {
    callback();
  }
};
