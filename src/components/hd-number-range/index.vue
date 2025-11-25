<template>
  <div
    ref="reference"
    class="hdty-number-range"
    :class="[
      activeSize ? `hdty-number-range--${ activeSize }` : '',
      adaptive ? 'is-adaptive' : '',
      activeRangeAdaptive ? 'is-range-adaptive' : '',
      readonly ? 'is-readonly' : '',
      activeDisabled ? 'is-disabled' : '',
      activeFocus ? 'is-active' : ''
    ]"
    :underline="underline"
    @click="handleRangeClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="showClose = false"
    v-clickoutside="handleClose">
    <i class="hdty-range-icon icon-number"></i>
    <input
      autocomplete="off"
      :value="displayValue && displayValue[0]"
      :placeholder="activeRangeAdaptive ? placeholder : startPlaceholder"
      :readonly="readonly"
      :disabled="activeDisabled"
      class="hdty-range-input"
      @input="handleStartInput"
      @change="handleStartChange"
      @focus="handleFocus">
    <span class="hdty-range-separator">{{ rangeSeparator }}</span>
    <input
      autocomplete="off"
      :value="displayValue && displayValue[1]"
      :placeholder="activeRangeAdaptive ? placeholder : endPlaceholder"
      :readonly="readonly"
      :disabled="activeDisabled"
      class="hdty-range-input"
      @input="handleEndInput"
      @change="handleEndChange"
      @focus="handleFocus">
    <i
      @click="handleClickIcon"
      :class="[showClose ? 'el-icon-circle-close' : '']"
      class="hdty-range-close-icon">
    </i>
  </div>
</template>

<script>
  import { hdComponent, hdForm } from '@/utils/util-framework';
  import Clickoutside from 'element-ui/src/utils/clickoutside'
  export default {
    name: "index",
    provide() {
      return {
        hdNumberRange: this
      };
    },
    mixins: [hdComponent, hdForm],
    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    directives: {
      Clickoutside
    },
    props: {
      prop: String,
      // 绑定值
      value: {
        type: Array,
        default() {
          return [];
        }
      },
      // 可选范围
      optionalRange: {
        type: Array,
        default() {
          return [];
        }
      },
      // 输入框尺寸（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请输入'
      },
      // 范围选择时开始水印
      startPlaceholder: {
        type: String,
        default: '请输入最小数量'
      },
      // 范围选择时结束水印
      endPlaceholder: {
        type: String,
        default: '请输入最大数量'
      },
      // 范围选择时分隔符
      rangeSeparator: {
        type: String,
        default: '至'
      },
      // 是否触发表单校验
      validateEvent: {
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
        activeFocus: false,
        showClose: false,
        userInput: null,
        valueOnFocus: null
      };
    },
    computed: {
      reference() {
        const reference = this.$refs.reference;
        return reference.$el || reference;
      },
      refInput() {
        if (this.reference) {
          return [].slice.call(this.reference.querySelectorAll('input'));
        }
        return [];
      },
      displayValue() {
        if (Array.isArray(this.userInput)) {
          return [
            !isNaN(parseFloat(this.userInput[0])) ? this.userInput[0] + '' : '',
            !isNaN(parseFloat(this.userInput[1])) ? this.userInput[1] + '' : ''
          ];
        } else {
          return '';
        }
      },
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      activeRangeIcon() {
        return this.reference.querySelector('.hdty-range-icon');
      },
      activeSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      activeDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      },
      activeRangeAdaptive() {
        if (this.readonly || this.activeDisabled) {
          return this.adaptive && this.$utilStr.isEmpty(this.value);
        } else {
          return this.adaptive && !this.activeFocus && this.$utilStr.isEmpty(this.value);
        }
      }
    },
    watch: {
      value: {
        handler(val, oldVal) {
          this.handleAdaptive();
          if(val && val.length > 0) {
            let startVal = !isNaN(parseFloat(val[0])) ? parseFloat(val[0]) : null;
            let endVal = !isNaN(parseFloat(val[1])) ? parseFloat(val[1]) : null;
            if (this.optionalRange && this.optionalRange.length > 0) {
              let minVal = parseFloat(this.optionalRange[0]);
              let maxVal = parseFloat(this.optionalRange[1]);
              if (!isNaN(minVal)) {
                if (startVal !== null) {
                  if (startVal < minVal) {
                    startVal = minVal;
                  }
                } else {
                  startVal = minVal;
                }
              }
              if (!isNaN(maxVal)) {
                if (endVal !== null) {
                  if (endVal > maxVal) {
                    endVal = maxVal;
                  }
                } else {
                  endVal = maxVal;
                }
              }
            }
            this.userInput = [startVal, endVal];
            if(val[0] !== startVal) {
              val.splice(0, 1, startVal);
            }
            if(val[1] !== endVal) {
              val.splice(1, 1, endVal);
            }
            this.$emit('input', val);
          } else {
            this.userInput = null;
          }
          if (!this.$utilStr.isEqual(val, oldVal) && !this.activeFocus && this.validateEvent) {
            this.dispatch('ElFormItem', 'el.form.change', val);
          }
        },
        immediate: true
      },
      activeFocus: {
        handler(val) {
          if (this.readonly || this.activeDisabled) return;
          this.handleAdaptive();
          if (val) {
            this.valueOnFocus = Array.isArray(this.value) ? [...this.value] : this.value;
          } else {
            this.emitChange(this.value);
            if (this.validateEvent) {
              this.dispatch('ElFormItem', 'el.form.blur');
            }
            this.$emit('blur', this);
            this.blur();
          }
        },
        immediate: false
      },
      showClose: {
        handler(val) {
          if(val) {
            this.activeRangeIcon.style.display = 'none';
          } else {
            this.activeRangeIcon.style.display = '';
          }
        },
        immediate: false
      }
    },
    methods: {
      // 使数量范围输入框获得焦点
      focus() {
        this.handleFocus();
      },
      // 使数量范围输入框失去焦点
      blur() {
        this.refInput.forEach(input => input.blur());
      },
      // 鼠标移入触发
      handleMouseEnter() {
        if (this.readonly || this.activeDisabled) return;
        if (!this.$utilStr.isEmpty(this.value) && this.clearable) {
          this.showClose = true;
        }
      },
      // 开始输入框值改变
      handleStartInput(event) {
        if (this.userInput && this.userInput.length > 0) {
          if (this.userInput[1]) {
            this.userInput = [event.target.value, this.userInput[1]];
          } else if(event.target.value) {
            this.userInput = [event.target.value, null];
          } else {
            this.userInput = [];
            this.showClose = false;
          }
        } else {
          this.userInput = [event.target.value, null];
        }
      },
      // 结束输入框值改变
      handleEndInput(event) {
        if (this.userInput && this.userInput.length > 0) {
          if (this.userInput[0]) {
            this.userInput = [this.userInput[0], event.target.value];
          } else if(event.target.value) {
            this.userInput = [null, event.target.value];
          } else {
            this.userInput = [];
            this.showClose = false;
          }
        } else {
          this.userInput = [null, event.target.value];
        }
      },
      // 开始输入框失去焦点或用户按下回车
      handleStartChange() {
        const value = this.userInput && this.userInput[0];
        let newVal = parseFloat(value);
        if (this.optionalRange && this.optionalRange.length > 0) {
          let minVal = parseFloat(this.optionalRange[0]);
          if (!isNaN(minVal)) {
            if (!isNaN(newVal)) {
              if (newVal < minVal) {
                newVal = minVal;
              }
            } else {
              newVal = minVal;
            }
          }
        }
        if (!isNaN(newVal)) {
          if (!isNaN(parseFloat(this.displayValue[1]))) {
            this.userInput = [newVal, parseFloat(this.displayValue[1])];
          } else {
            this.userInput = [newVal, null];
          }
          if (this.clearable) {
            this.showClose = true;
          }
        } else {
          if (!isNaN(parseFloat(this.displayValue[1]))) {
            this.userInput = [null, parseFloat(this.displayValue[1])];
          } else {
            this.userInput = [];
          }
        }
        this.emitInput(this.userInput);
      },
      // 结束输入框失去焦点或用户按下回车
      handleEndChange() {
        const value = this.userInput && this.userInput[1];
        let newVal = parseFloat(value);
        if (this.optionalRange && this.optionalRange.length > 1) {
          let maxVal = parseFloat(this.optionalRange[1]);
          if (!isNaN(maxVal)) {
            if (!isNaN(newVal)) {
              if (newVal > maxVal) {
                newVal = maxVal;
              }
            } else {
              newVal = maxVal;
            }
          }
        }
        if (!isNaN(newVal)) {
          if (!isNaN(parseFloat(this.displayValue[0]))) {
            this.userInput = [parseFloat(this.displayValue[0]), newVal];
          } else {
            this.userInput = [null, newVal];
          }
          if (this.clearable) {
            this.showClose = true;
          }
        } else {
          if (!isNaN(parseFloat(this.displayValue[0]))) {
            this.userInput = [this.displayValue[0], null];
          } else {
            this.userInput = [];
          }
        }
        this.emitInput(this.userInput);
      },
      // 点击清除按钮
      handleClickIcon(event) {
        if (this.readonly || this.activeDisabled) return;
        if (this.showClose) {
          this.valueOnFocus = this.value;
          event.stopPropagation();
          this.emitInput([]);
          this.emitChange([]);
          this.showClose = false;
          this.activeFocus = false;
        } else {
          this.activeFocus = !this.activeFocus;
        }
      },
      // 点击空白处关闭
      handleClose() {
        if (!this.activeFocus) return;
        this.activeFocus = false;
      },
      // 获得焦点
      handleFocus() {
        if (!this.activeFocus) {
          this.activeFocus = true;
        }
        this.$emit('focus', this);
      },
      // 点击数量范围输入框
      handleRangeClick() {
        if (!this.activeFocus) {
          this.activeFocus = true;
        }
        this.$emit('focus', this);
      },
      // 触发change事件
      emitChange(val) {
        if (!this.$utilStr.isEqual(val, this.valueOnFocus)) {
          this.$emit('change', val);
          this.valueOnFocus = val;
          if (this.validateEvent) {
            this.dispatch('ElFormItem', 'el.form.change', val);
          }
        }
      },
      // 触发input事件
      emitInput(val) {
        if (!this.$utilStr.isEqual(this.value, val)) {
          this.$emit('input', val);
        }
      },
      // 重新适应宽度
      handleAdaptive() {
        if (this.adaptive) {
          this.$nextTick(async () => {
            if (this.reference) {
              if (this.activeRangeAdaptive) {
                let inputStyles = this.$utilElem.getStyle(this.refInput[0]);
                let inputWidth = Math.ceil(await this.$utilElem.getTextScreenWidth(this.placeholder, inputStyles.fontSize, inputStyles.fontWeight, inputStyles.fontFamily));
                this.refInput[0].style.width = inputWidth + 'px';
                let boxStyles = this.$utilElem.getStyle(this.reference);
                let borderSize = parseFloat(boxStyles.borderLeftWidth) + parseFloat(boxStyles.borderRightWidth);
                let paddingSize = parseFloat(boxStyles.paddingLeft) + parseFloat(boxStyles.paddingRight);
                this.reference.style.width = Math.ceil(inputWidth + borderSize + paddingSize) + 'px';
              } else {
                this.refInput[0].style.width = '';
                this.reference.style.width = '';
              }
            }
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
