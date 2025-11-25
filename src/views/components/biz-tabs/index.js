import BizTabs from './src/tabs';

/* istanbul ignore next */
BizTabs.install = function(Vue) {
  Vue.component(BizTabs.name, BizTabs);
};

export default BizTabs;
