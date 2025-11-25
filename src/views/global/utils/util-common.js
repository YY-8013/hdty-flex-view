// 防抖
export const debounce = function (fn, delay = 500) {
  let timer;
  return function () {
    const that = this;
    let args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(that, args);
    }, delay);
  };
};
