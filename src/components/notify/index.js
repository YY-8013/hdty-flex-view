import Vue from 'vue';
import Main from './Notify';
import $utilStr from '@/utils/util-str';
let NotifyConstructor = Vue.extend(Main);

let instance;

const Notify = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  instance = new NotifyConstructor({
    data: {
      options: $utilStr.clearObjUndef(options)
    }
  });
  instance.$mount();
  return instance;
};

export default Notify;
