import Vue from 'vue';
import Main from './src/Contextmenu';
import $utilStr from '@/utils/util-str';
let ContextmenuConstructor = Vue.extend(Main);

let instance;
let instances = [];

const Contextmenu = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  options.event = options.event || window.event;
  if(options.event.stopPropagation) options.event.stopPropagation(); else options.event.cancelBubble = true;
  if(options.event.preventDefault) options.event.preventDefault(); else options.event.returnValue = false;
  instance = new ContextmenuConstructor({
    data: {
      options: $utilStr.clearObjUndef(options)
    }
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  instances.push(instance);
  if(instances.length > 1) {
    instances[0].visible = false;
    instances[0].$el.remove();
    instances.shift();
  }
  return instance;
};

export default Contextmenu;
