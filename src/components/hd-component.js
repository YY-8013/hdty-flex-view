import Vue from 'vue';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const requireComponent = {
  install: function (Vue) {
    const files = require.context(
      // 其组件目录的相对路径
      '.',
      // 是否查询其子目录
      true,
      // 匹配基础组件文件名的正则表达式
      /\.(vue|js)$/
    );

    files.keys().forEach(filepath => {
      // 获取符合组件注册规则的文件
      let filepathArr = filepath.split('/');
      let consistentFilepathArr = filepathArr.map((v, i, arr) => {
        if(v.includes('hd-') || (v.includes('index') && arr[i - 1].includes('hd-'))) {
          return v;
        }
        return null;
      }).filter(v => v);
      consistentFilepathArr = consistentFilepathArr.length >= 2 && consistentFilepathArr;
      if(!consistentFilepathArr) return ;
      let filename = consistentFilepathArr.filter(e => e.includes('hd-')).slice(-1)[0];
      filename = filename && filename.replace(/\.\w+$/, '');
      if(!filename) return;

      // 获取组件配置
      const componentConfig = files(filepath);

      // 获取组件的 PascalCase 命名
      const componentName = upperFirst(camelCase(filename));

      // 全局注册组件
      Vue.component(
        componentName,
        // 如果这个组件选项是通过 `export default` 导出的，
        // 那么就会优先使用 `.default`，
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
      )
    });
  }
};

// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus();
  }
});

export default requireComponent;
