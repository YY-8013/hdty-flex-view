<template>
  <div
    ref="jsoneditorRef"
    class="hdty-jsoneditor"
    :class="{'jsoneditor-menu-hide': !menubar}"
    :style="{ width: pageWidth, height: pageHeight }"
  >
    <span v-if="showTips" class="jsoneditor-tips">已超过最大长度限制</span>
  </div>
</template>

<script>
import { hdComponent, hdForm } from '@/utils/util-framework';

export default {
  name: 'index',
  provide() {
    return {
      hdJsonEditor: this
    };
  },
  mixins: [hdComponent, hdForm],
  props: {
    prop: String,
    // 绑定值
    value: [String, Object, Array],
    // 模式（text / view / form / code / tree）
    mode: {
      type: String,
      default: 'code'
    },
    // 类型（String / Object）
    type: {
      type: String,
      default: 'String'
    },
    // 显示菜单栏
    menubar: {
      type: Boolean,
      default: false
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 最大输入长度
    maxlength: {
      type: [Number, String],
      default: null
    },
    // 搜索
    filterable: {
      type: Boolean,
      default: false
    },
    // 宽度
    width: {
      type: [Number, String],
      default: ''
    },
    // 高度
    height: {
      type: [Number, String],
      default: '125'
    }
  },
  data() {
    return {
      // JSON编辑器实例
      editor: null,
      // 绑定值
      currentValue: this.value, // currentValue接收父组件传来的value值；
      // 显示提示
      showTips: false
    };
  },
  computed: {
    pageWidth() {
      if (String(this.width).indexOf('%') === -1) {
        return this.width + 'px';
      }
      return this.width;
    },
    pageHeight() {
      if (this.height === 'auto') {
        return 'auto';
      } else if (String(this.height).indexOf('%') === -1) {
        return this.height + 'px';
      } else {
        return this.height;
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val === null) {
          this.editor.set(null);
        } else if (JSON.stringify(val) !== JSON.stringify(this.currentValue)) {
          let initialJson = this.$utilStr.toJSONObj(val);
          this.editor.set(initialJson);
        }
      },
      immediate: false
    },
    currentValue: {
      handler(val) {
        let value = null;
        if (this.type === 'String') {
          if (typeof val === 'object' && val) {
            value = JSON.stringify(val);
          } else {
            value = val;
          }
        } else {
          value = this.$utilStr.toJSONObj(val);
        }
        this.$emit('input', value);
        this.$emit('currentChanged', value);
        this.triggerValidateField();
      },
      immediate: true
    }
  },
  mounted() {
    let _this = this;
    let container = _this.$refs.jsoneditorRef;
    let options = {
      mode: _this.mode,
      indentation: 2,
      search: _this.filterable,
      onEditable: () => {
        return !this.readonly;
      },
      onChange() {
        let str = _this.editor.getText();
        if (_this.maxlength) {
          _this.showTips = str.length > Number(_this.maxlength);
        }
        _this.currentValue = str;
      }
    };
    _this.editor = new _this.$jsoneditor(container, options);
    container.addEventListener('keydown', (e) => {
      if (e.keyCode === 13) {
        e.stopPropagation();
      }
    });
    container.addEventListener('keyup', (e) => {
      if (e.keyCode === 13) {
        e.stopPropagation();
      }
    });
    let initialJson = this.$utilStr.toJSONObj(_this.value);
    _this.editor.set(initialJson);
    _this.triggerClearValidate();
  }
};
</script>

<style scoped>
</style>
