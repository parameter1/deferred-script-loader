export default (callback, requestFrame) => {
  if (document.readyState === 'complete') {
    if (requestFrame) {
      requestAnimationFrame(() => {
        callback();
      });
    } else {
      callback();
    }
  } else {
    window.addEventListener('load', function fn() {
      window.removeEventListener('load', fn);
      if (requestFrame) {
        requestAnimationFrame(() => {
          callback();
        });
      } else {
        callback();
      }
    });
  }
};
