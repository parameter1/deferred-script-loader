export default (callback) => {
  if (document.readyState === 'complete') {
    callback();
  } else {
    window.addEventListener('load', function fn() {
      window.removeEventListener('load', fn);
      callback();
    });
  }
};
