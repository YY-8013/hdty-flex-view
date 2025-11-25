import BizTabPane from '../biz-tabs/src/tab-pane.vue';

/* istanbul ignore next */
BizTabPane.install = function(Vue) {
  Vue.component(BizTabPane.name, BizTabPane);
};

export default BizTabPane;
