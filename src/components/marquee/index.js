import Vue from 'vue';
import Main from './Marquee';
import $utilStr from '@/utils/util-str';
let MarqueeConstructor = Vue.extend(Main);

let instance;

const Marquee = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  instance = new MarqueeConstructor({
    data: {
      options: $utilStr.clearObjUndef(options)
    }
  });
  instance.$mount();
  return instance;
};

export default Marquee;
