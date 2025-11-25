<template>
  <hd-input
    ref="inputRef"
    type="text"
    :id="id"
    :name="name"
    v-model="currentValue"
    :maxlength="maxlength"
    :minlength="minlength"
    :tabindex="tabindex"
    :size="size"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :show-word-limit="showWordLimit"
    :autofocus="autofocus"
    :validate-event="validateEvent"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    class="hdty-factor-input"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput"
    @clear="handleClear">
    <hd-button
      v-if="showControlButton"
      slot="suffix"
      type="text"
      title="点击切换"
      :readonly="readonly || controlButtonReadonly"
      :disabled="disabled || controlButtonDisabled"
      @click="handleClick">
      {{ activeControlText }}
    </hd-button>
    <template slot="prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="append">
      <slot name="append"></slot>
    </template>
  </hd-input>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "index",
    provide() {
      return {
        hdFactorInput: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      // 输入框唯一标识
      id: {
        type: String
      },
      // 输入框名称
      name: {
        type: String
      },
      // 绑定文本值
      value: {
        type: String,
        default: '',
      },
      // 绑定条件值
      modelControl: {
        type: String,
        default: ''
      },
      // 模糊查询类型（before / between / after）
      fuzzy: {
        type: String,
        default: 'after'
      },
      // 最大输入长度
      maxlength: {
        type: [Number, String]
      },
      // 最小输入长度
      minlength: {
        type: [Number, String]
      },
      // tab键控制次序
      tabindex: {
        type: String
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
      // 是否启用自动完成
      autocomplete: {
        type: String,
        default: 'off'
      },
      // 是否显示输入字数
      showWordLimit: {
        type: Boolean,
        default: false
      },
      // 是否自动获取焦点
      autofocus: {
        type: Boolean,
        default: false
      },
      // 是否触发表单校验
      validateEvent: {
        type: Boolean,
        default: true
      },
      // 是否显示精确/模糊按钮
      showControlButton: {
        type: Boolean,
        default: true
      },
      // 是否只读精确/模糊按钮
      controlButtonReadonly: {
        type: Boolean,
        default: false,
      },
      // 是否禁用精确/模糊按钮
      controlButtonDisabled: {
        type: Boolean,
        default: false,
      },
      // 是否可清空
      clearable: {
        type: Boolean,
        default: false,
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
        // 当前绑定条件值
        currentControl: this.modelControl, // currentControl接收父组件传来的modelControl值；
      }
    },
    computed: {
      currentValue: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      activeControlText() {
        if(this.currentControl === this.$app.factorOptions.matchOpe.exact) {
          return '精确';
        }else {
          return '模糊';
        }
      }
    },
    watch: {
      modelControl: {
        handler(val) {
          if(val === '' || val === null) {
            this.$emit('update:modelControl', this.$app.factorOptions.matchOpe.exact);
          } else {
            this.currentControl = val;
          }
        },
        immediate: true
      }
    },
    methods: {
      // 使input失去焦点
      blur() {
        this.$refs.inputRef.blur();
      },
      // 使input获得焦点
      focus() {
        this.$refs.inputRef.focus();
      },
      // input失去焦点时触发
      handleBlur(evt) {
        this.$emit('currentBlur', evt);
      },
      // input获得焦点时触发
      handleFocus(evt) {
        this.$emit('currentFocus', evt);
      },
      // input失去焦点或用户按下回车时触发
      handleChange(val) {
        this.$emit('currentChanged', val, this.currentControl);
      },
      // input值改变时触发
      handleInput(val) {
        this.$emit('currentInput', val, this.currentControl);
      },
      // 点击input清空按钮时触发
      handleClear() {
        this.$emit('currentClear');
      },
      // button发生点击时触发
      handleClick() {
        if(this.currentControl === this.$app.factorOptions.matchOpe.exact) {
          if(this.fuzzy === 'before') {
            this.currentControl = this.$app.factorOptions.matchOpe.before;
          }else if(this.fuzzy === 'between') {
            this.currentControl = this.$app.factorOptions.matchOpe.between;
          }else {
            this.currentControl = this.$app.factorOptions.matchOpe.after;
          }
        }else {
          this.currentControl = this.$app.factorOptions.matchOpe.exact;
        }
        this.$emit('update:modelControl', this.currentControl);
        this.$emit('currentControlChanged', this.currentControl, this.currentValue);
      }
    }
  }
</script>

<style scoped>

</style>
