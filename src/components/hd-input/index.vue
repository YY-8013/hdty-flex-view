<template>
  <el-input
    ref="inputRef"
    :type="type"
    :id="id"
    :name="name"
    :value="currentValue"
    :maxlength="maxlength"
    :minlength="minlength"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :rows="rows"
    :autosize="autosize"
    :tabindex="tabindex"
    :size="size"
    :placeholder="placeholder"
    :autocomplete="autocomplete"
    :show-word-limit="showWordLimit"
    :show-password="showPassword"
    :autofocus="autofocus"
    :validate-event="validateEvent"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline"
    @mouseenter.native="hovering = $refs.inputRef.hovering"
    @mouseleave.native="hovering = $refs.inputRef.hovering"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput"
    @clear="handleClear"
  >
    <template slot="prefix">
      <slot name="prefix"></slot>
    </template>
    <template slot="suffix">
      <slot name="suffix"></slot>
    </template>
    <template slot="prepend">
      <slot name="prepend"></slot>
    </template>
    <template slot="append">
      <slot name="append"></slot>
    </template>
  </el-input>
</template>

<script>
import { hdComponent } from "@/utils/util-framework";
export default {
  name: "index",
  provide() {
    return {
      hdInput: this
    };
  },
  mixins: [hdComponent],
  props: {
    prop: String,
    // 输入框类型（text / textarea / password）
    type: {
      type: String,
      default: "text"
    },
    // 输入框唯一标识
    id: {
      type: String
    },
    // 输入框名称
    name: {
      type: String
    },
    // 绑定值
    value: {
      type: String,
      default: ""
    },
    // 最大输入长度
    maxlength: {
      type: [Number, String]
    },
    // 最小输入长度
    minlength: {
      type: [Number, String]
    },
    // 输入框头部图标
    prefixIcon: {
      type: String,
      default: ""
    },
    // 输入框尾部图标
    suffixIcon: {
      type: String,
      default: ""
    },
    // 输入框行数（只对textarea有效)
    rows: {
      type: Number,
      default() {
        if (this.type === "textarea") {
          return 3;
        }
      }
    },
    // 高度自适应（只对textarea有效，可传入对象，如{ minRows: 2, maxRows: 6 }）
    autosize: {
      type: [Boolean, Object],
      default: false
    },
    // tab键控制次序
    tabindex: {
      type: String
    },
    // 输入框尺寸（medium / small / mini）
    size: {
      type: String,
      default: ""
    },
    // 输入框清空按钮自定义类名
    clearClass: {
      type: String,
      default: ""
    },
    // 水印
    placeholder: {
      type: String,
      default: "请输入"
    },
    // 是否启用自动完成
    autocomplete: {
      type: String,
      default: "off"
    },
    // 是否显示输入字数
    showWordLimit: {
      type: Boolean,
      default: false
    },
    // 是否显示切换密码图标
    showPassword: {
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
    // 是否可清空
    clearable: {
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
    },
    // 将输出的字符字符转为大小写 ''不调整，'upper':大写  'lower':'小写'
    strMode: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      // 鼠标是否悬停
      hovering: false,
      // 输入框是否聚焦
      focused: false
    };
  },
  computed: {
    currentValue() {
      this.handleAdaptive();
      return this.value;
    },
    showClear() {
      return (
        this.clearable &&
        !this.disabled &&
        !this.readonly &&
        this.nativeInputValue &&
        (this.focused || this.hovering)
      );
    },
    nativeInputValue() {
      return this.value ? String(this.value) : "";
    },
    activeSuffixIcon() {
      return (
        (this.$refs.inputRef.$el.querySelector(".el-input__suffix-inner") &&
          this.$refs.inputRef.$el
            .querySelector(".el-input__suffix-inner")
            .querySelectorAll(".el-input__icon")) ||
        []
      );
    }
  },
  watch: {
    showClear: {
      handler(val) {
        if (val) {
          [].forEach.call(this.activeSuffixIcon, (e) => {
            if (!e.className.includes("el-input__clear")) {
              e.style.display = "none";
            }
          });
          this.$nextTick(() => {
            let currentClearIcon =
              this.$refs.inputRef.$el.querySelector(".el-input__clear");
            if (!currentClearIcon.className.includes(this.clearClass)) {
              currentClearIcon.classList.add(this.clearClass);
            }
            currentClearIcon.onclick = (evt) => {
              evt.stopPropagation();
            };
          });
        } else {
          [].forEach.call(this.activeSuffixIcon, (e) => {
            e.style.display = "";
          });
        }
      },
      immediate: false
    }
  },
  methods: {
    convertCase(value) {
      if (!value) return value;
      if (this.strMode === "upper") return value.toUpperCase();
      if (this.strMode === "lower") return value.toLowerCase();
      return value;
    },
    // 使input失去焦点
    blur() {
      this.$refs.inputRef.blur();
    },
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
      this.focused = false;
      this.$emit("blur", evt);
    },
    // input获得焦点时触发
    handleFocus(evt) {
      this.focused = true;
      this.$emit("focus", evt);
    },
    // input失去焦点或用户按下回车时触发
    handleChange(val) {
      this.$emit("change", this.convertCase(val));
      this.handleAdaptive();
    },
    // input值改变时触发
    handleInput(val) {
      this.$emit("input", this.convertCase(val));
    },
    // 点击input清空按钮时触发
    handleClear() {
      this.$emit("clear");
    },
    // 重新适应宽度
    handleAdaptive() {
      if (this.adaptive) {
        this.$nextTick(async () => {
          let inputRef = this.$refs.inputRef;
          if (inputRef) {
            let text;
            if (inputRef.value) {
              text = inputRef.value;
            } else if (this.placeholder) {
              text = this.placeholder;
            }
            let inputBoxEl = inputRef.$el;
            let inputEl = inputBoxEl.querySelector(".el-input__inner");
            let inputStyles = this.$utilElem.getStyle(inputEl);
            let borderSize =
              parseFloat(inputStyles.borderLeftWidth) +
              parseFloat(inputStyles.borderRightWidth);
            let paddingSize =
              parseFloat(inputStyles.paddingLeft) +
              parseFloat(inputStyles.paddingRight);
            inputBoxEl.style.width =
              Math.ceil(
                (await this.$utilElem.getTextScreenWidth(
                  text,
                  inputStyles.fontSize,
                  inputStyles.fontWeight,
                  inputStyles.fontFamily
                )) +
                  borderSize +
                  paddingSize
              ) + "px";
          }
        });
      }
    }
  }
};
</script>

<style scoped></style>
