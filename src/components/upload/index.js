import Vue from 'vue';
import Main from './Upload';
import $utilStr from '@/utils/util-str';
let UploadConstructor = Vue.extend(Main);

let instance;

const Contextmenu = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  options.callback = options.callback || window.event;
  instance = new UploadConstructor({
    data: $utilStr.clearObjUndef(options)
  });
  instance.$mount();
  return instance;
};

export default Contextmenu;
