import Vue from 'vue';
export default {
  name: "index",
  props: {
    // 模板字符串
    template: String
  },
  render(h) {
    return Vue.compile(this.template).render.apply(this.app, arguments);
  },
  computed: {
    app() {
      return this.$parent;
    }
  }
}
