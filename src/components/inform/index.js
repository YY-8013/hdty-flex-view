import Vue from 'vue';
import $router from '@/router';
import $storage from '@/utils/storage';
import $utilStr from '@/utils/util-str';


const Inform = (options) => {
  if (Vue.prototype.$isServer) return;
  options = options || {};
  $storage.session.set('inform', $utilStr.clearObjUndef(options));
  let routeData = $router.resolve({ name: 'Inform' });
  window.open(routeData.href, '_blank');
};

export default Inform;
