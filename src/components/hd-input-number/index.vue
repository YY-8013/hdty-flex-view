<template>
  <el-input-number
    ref="inputRef"
    :name="name"
    :label="label"
    v-model="currentValue"
    :min="min"
    :max="max"
    :step="step"
    :precision="precision"
    :size="size"
    :placeholder="placeholder"
    :controls-position="controlsPosition"
    :step-strictly="stepStrictly"
    :controls="controls"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput">
  </el-input-number>
</template>

<script>
  import { hdComponent } from "@/utils/util-framework";
  export default {
    name: "index",
    provide() {
      return {
        hdInputNumber: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      // 输入框名称
      name: {
        type: String
      },
      // 输入框的无障碍阅读文字（即aria-label）
      label: {
        type: String
      },
      // 绑定值
      value: {
        type: [Number, String]
      },
      // 计数器允许的最小值
      min: {
        type: [Number, String]
      },
      // 计数器允许的最大值
      max: {
        type: [Number, String]
      },
      // 计数器步长
      step: {
        type: [Number, String],
        default: 1
      },
      // 数值精度（必须是一个非负整数，并且不能小于步长的小数位数）
      precision: {
        type: [Number, String]
      },
      // 计数器尺寸（medium / small / mini）
      size: {
        type: String
      },
      // 水印
      placeholder: {
        type: String,
        default: '请输入'
      },
      // 控制按钮位置（right）
      controlsPosition: {
        type: String
      },
      // 是否只能输入步长的倍数
      stepStrictly: {
        type: Boolean,
        default: false
      },
      // 是否使用控制按钮
      controls: {
        type: Boolean,
        default: true
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
    computed: {
      currentValue: {
        get() {
          this.handleAdaptive();
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      }
    },
    watch: {
      readonly: {
        handler() {
          this.$nextTick(() => {
            let allInputEl = this.$refs.inputRef.$el.querySelectorAll('input');
            if(allInputEl && allInputEl.length > 0) {
              [].forEach.call(allInputEl, inputEl => {
                if(this.readonly) {
                  inputEl.setAttribute('readonly', 'readonly');
                } else {
                  inputEl.removeAttribute('readonly');
                }
              })
            }
          });
        },
        immediate: true
      }
    },
    methods: {
      // 使input获得焦点
      focus() {
        this.$refs.inputRef.focus();
      },
      // 选中input中的文字
      select() {
        this.$refs.inputRef.select();
      },
      // input失去焦点时触发
      handleBlur(evt) {
        this.$emit('blur', evt);
      },
      // input获得焦点时触发
      handleFocus(evt) {
        this.$emit('focus', evt);
      },
      // 绑定值改变时触发
      handleChange(val, oldVal) {
        this.$emit('change', val, oldVal);
      },
      // input值改变时触发
      handleInput(val) {
        this.$emit('input', val);
      },
      // 重新适应宽度
      handleAdaptive() {
        if(this.adaptive) {
          this.$nextTick(async () => {
            let inputRef = this.$refs.inputRef;
            if(inputRef) {
              let userInput = inputRef.userInput;
              let value = inputRef.value;
              let text;
              if(userInput !== null) {
                if(this.$utilStr.isText(userInput)) {
                  text = userInput;
                } else if(this.placeholder) {
                  text = this.placeholder;
                }
              } else {
                if(this.$utilStr.isText(value)) {
                  text = value;
                } else if(this.placeholder) {
                  text = this.placeholder;
                }
              }

              let inputBoxEl = inputRef.$el;
              let inputEl = inputBoxEl.querySelector('.el-input__inner');
              inputEl.onblur = () => {
                if(userInput !== null) {
                  if(this.$utilStr.isNum(userInput)) {
                    if(this.$utilStr.isNum(value)) {
                      if(Number(value) !== Number(userInput)) {
                        this.handleAdaptive();
                      }
                    }
                  } else {
                    this.handleAdaptive();
                  }
                }
                inputEl.onblur = null;
              };
              inputEl.oninput = () => {
                this.handleAdaptive();
                inputEl.oninput = null;
              };
              let inputStyles = this.$utilElem.getStyle(inputEl);
              let borderSize = parseFloat(inputStyles.borderLeftWidth) + parseFloat(inputStyles.borderRightWidth);
              let paddingSize = parseFloat(inputStyles.paddingLeft) + parseFloat(inputStyles.paddingRight);
              inputBoxEl.style.width = Math.ceil(await this.$utilElem.getTextScreenWidth(text, inputStyles.fontSize, inputStyles.fontWeight, inputStyles.fontFamily) + borderSize + paddingSize) + 'px';
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
