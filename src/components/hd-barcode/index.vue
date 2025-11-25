<template>
  <hd-input
    ref="inputRef"
    v-focus
    autofocus
    v-model="input"
    suffix-icon="icon-scanning"
    :size="size"
    :placeholder="placeholder"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    elip
    @focus="handleFocus"
    @blur="handleBlur"
    @clear="handleInputClear">
  </hd-input>
</template>

<script>
  import { hdComponent, hdForm } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdBarcode: this
      };
    },
    mixins: [hdComponent, hdForm],
    props: {
      prop: String,
      // 绑定值
      value: {
        type: String,
        default: ''
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选中输入框，使用条码扫描器扫码'
      },
      // 是否自动输入
      autoInput: {
        type: Boolean,
        default: true
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: true,
      },
      // 是否只读
      readonly: {
        type: Boolean,
        default: false
      },
      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      },
      // 宽度自适应（元素宽度随内容变化）
      adaptive: {
        type: Boolean,
        default: false
      },
      // 下划线风格
      underline: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        // 绑定值
        input: this.value, // input接收父组件传来的value值
        // 扫码输入文本
        text: '',
      }
    },
    watch: {
      value: {
        handler(val) {
          this.input = val;
        },
        immediate: true
      }
    },
    created() {
      let _this = this;
      _this.$nextTick(()=>{
        _this.$refs.inputRef.focus();
      });
    },
    destroyed() {
      window.removeEventListener('keydown', this.listenerKeydown);
    },
    methods: {
      // input获取焦点
      handleFocus() {
        if(!this.readonly) {
          this.text = '';
          window.addEventListener('keydown', this.listenerKeydown);
        }
      },
      // input失去焦点
      handleBlur() {
        if(!this.readonly) {
          window.removeEventListener('keydown', this.listenerKeydown);
        }
      },
      listenerKeydown(e) {
        if (e.keyCode !== 13) { // 回车
          if(e.keyCode === 8) { // 退格
            this.text = this.text.substr(0, this.text.length - 1);
          }else if (e.keyCode >= 48 && e.keyCode <= 192) {
            if(/\w/.test(e.keyCode)){
              this.text += e.key;
            }
          }
          if(this.autoInput) {
            this.input = this.text;
            this.$emit('input', this.text);
          }
          this.$emit('currentChanged', this.text);
        } else {
          this.text = '';
        }
        return false; // 阻止输入框正常动作
      },
      // input清空
      handleInputClear() {
        this.$emit('input', '');
        this.$emit('currentChanged', '');
      }
    }
  }
</script>

<style scoped>

</style>
