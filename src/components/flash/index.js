import Vue from 'vue';
import Main from './Flash';
import $utilStr from '@/utils/util-str';
let FlashConstructor = Vue.extend(Main);

let instance;

const Flash = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  options.event = options.event || window.event;
  if(options.event.stopPropagation) options.event.stopPropagation(); else options.event.cancelBubble = true;
  if(options.event.preventDefault) options.event.preventDefault(); else options.event.returnValue = false;
  instance = new FlashConstructor({
    data: {
      options: $utilStr.clearObjUndef(options)
    }
  });
  instance.$mount();
  return instance;
};

export default Flash;
