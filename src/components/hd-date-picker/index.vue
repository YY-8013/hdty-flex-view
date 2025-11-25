<template>
  <el-time-select
    v-if="type === 'moment'"
    ref="pickerRef"
    :key="'hd_date_picker_' + type"
    v-model="currentValue"
    :format="activeFormat"
    :value-format="activeValueFormat"
    :default-time="activeDefaultTime"
    :align="align"
    :picker-options="activePickerOptions"
    :size="size"
    :start-placeholder="activeStartPlaceholder"
    :end-placeholder="activeEndPlaceholder"
    :placeholder="activePlaceholder"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{ 'is-adaptive': adaptive }"
    :underline="underline"
    @mouseenter.native="showClear = $refs.pickerRef.showClose"
    @mouseleave.native="showClear = $refs.pickerRef.showClose"
    @focus="handleFocus"
    @change="handleChange"
  ></el-time-select>
  <el-time-picker
    v-else-if="type === 'time' || type === 'timerange'"
    ref="pickerRef"
    :key="'hd_date_picker_' + type"
    :is-range="type === 'timerange'"
    v-model="currentValue"
    :format="activeFormat"
    :value-format="activeValueFormat"
    :align="align"
    :picker-options="activePickerOptions"
    :size="size"
    :range-separator="rangeSeparator"
    :start-placeholder="activeStartPlaceholder"
    :end-placeholder="activeEndPlaceholder"
    :placeholder="activePlaceholder"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{
      'is-readonly': readonly,
      'is-adaptive': adaptive,
      'is-range-adaptive': activeRangeAdaptive
    }"
    :underline="underline"
    :popper-class="!clearable ? 'no-clear-btn' : ''"
    @mouseenter.native="showClear = $refs.pickerRef.showClose"
    @mouseleave.native="showClear = $refs.pickerRef.showClose"
    @focus="handleFocus"
    @change="handleChange"
  ></el-time-picker>
  <el-date-picker
    v-else
    ref="pickerRef"
    :key="'hd_date_picker_' + type"
    :type="type"
    v-model="currentValue"
    :format="activeFormat"
    :value-format="activeValueFormat"
    :default-time="activeDefaultTime"
    :align="align"
    :picker-options="activePickerOptions"
    :size="size"
    :range-separator="rangeSeparator"
    :start-placeholder="activeStartPlaceholder"
    :end-placeholder="activeEndPlaceholder"
    :placeholder="activePlaceholder"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :class="{
      'is-readonly': readonly,
      'is-adaptive': adaptive,
      'is-range-adaptive': activeRangeAdaptive
    }"
    :underline="underline"
    :popper-class="!clearable ? 'no-clear-btn' : ''"
    @mouseenter.native="showClear = $refs.pickerRef.showClose"
    @mouseleave.native="showClear = $refs.pickerRef.showClose"
    @focus="handleFocus"
    @change="handleChange"
  ></el-date-picker>
</template>

<script>
import { hdComponent, hdForm } from "@/utils/util-framework";
export default {
  name: "index",
  provide() {
    return {
      hdDatePicker: this
    };
  },
  mixins: [hdComponent, hdForm],
  props: {
    prop: String,
    // 显示类型（year/years/month/months/monthrange/week/date/dates/daterange/datetime/datetimerange/time/timerange/moment）
    type: {
      type: String,
      default: "date"
    },
    // 选中值
    value: {
      type: [Array, String],
      default: ""
    },
    // 显示格式
    format: {
      type: String,
      default: ""
    },
    // 绑定值格式
    valueFormat: {
      type: String,
      default: ""
    },
    // 默认时刻
    defaultTime: {
      type: [Array, String],
      default: null
    },
    // 对齐方式（left / center / right）
    align: {
      type: String,
      default: "left"
    },
    // 可选天数（尚未完成）
    optionalDays: {
      type: [Number, String],
      default: null
    },
    // 周起始日
    firstDayOfWeek: {
      type: [String, Number],
      default: 1
    },
    // 快捷选项配置
    shortcutsOptions: {
      type: Array,
      default() {
        return this.$app.pickerShortcutOptions.shortcuts;
      }
    },
    // 时刻选择配置
    momentSelectOptions: {
      type: Object,
      default() {
        return {
          start: "00:00",
          step: "00:60",
          end: "23:00"
        };
      }
    },
    // 选项配置
    pickerOptions: {
      type: Object,
      default() {
        return {};
      }
    },
    // 保持实时时间
    keepTime: {
      type: [Boolean, Number],
      default: false
    },
    // 输入框尺寸（medium / small / mini）
    size: {
      type: String,
      default: ""
    },
    // 水印
    placeholder: {
      type: String,
      default: ""
    },
    // 范围选择时开始水印
    startPlaceholder: {
      type: String,
      default: ""
    },
    // 范围选择时结束水印
    endPlaceholder: {
      type: String,
      default: ""
    },
    // 范围选择时分隔符
    rangeSeparator: {
      type: String,
      default: "至"
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
    disabledTodayAfter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 当前是否保持实时时间
      currentKeepTime: "",
      // 实时时间
      realTime: "",
      // 显示清除按钮
      showClear: ""
    };
  },
  computed: {
    currentValue: {
      get() {
        this.handleValidateValue();
        this.handleAdaptive();
        if (this.type === "week" && Array.isArray(this.value)) {
          if (this.value.length > 0) {
            return this.value[0];
          } else {
            return "";
          }
        } else {
          return this.value;
        }
      },
      set(val) {
        if (this.type === "week") {
          if (val) {
            let monday = this.$utilDate.dateFtt(
              this.$utilDate.addDays(val, -1),
              this.activeValueFormat
            );
            let sunday = this.$utilDate.dateFtt(
              this.$utilDate.addDays(val, +5),
              this.activeValueFormat
            );
            this.$emit("input", [monday, sunday]);
          } else {
            this.$emit("input", []);
          }
        } else {
          this.$emit("input", val);
        }
      }
    },
    activeFormat() {
      if (this.format) {
        return this.format;
      } else {
        if (this.type === "year" || this.type === "years") {
          return "yyyy年";
        } else if (
          this.type === "month" ||
          this.type === "months" ||
          this.type === "monthrange"
        ) {
          return "yyyy年MM月";
        } else if (this.type === "week") {
          return "yyyy年第WW周";
        } else if (
          this.type === "date" ||
          this.type === "dates" ||
          this.type === "daterange"
        ) {
          return "yyyy-MM-dd";
        } else if (this.type === "datetime" || this.type === "datetimerange") {
          return "yyyy-MM-dd HH:mm:ss";
        } else if (this.type === "time" || this.type === "timerange") {
          return "HH:mm:ss";
        } else if (this.type === "moment") {
          return "HH:mm";
        } else {
          return "";
        }
      }
    },
    activeValueFormat() {
      if (this.valueFormat) {
        return this.valueFormat;
      } else {
        if (this.type === "year" || this.type === "years") {
          return "yyyy";
        } else if (
          this.type === "month" ||
          this.type === "months" ||
          this.type === "monthrange"
        ) {
          return "yyyyMM";
        } else if (this.type === "week") {
          return "yyyyMMdd";
        } else if (
          this.type === "date" ||
          this.type === "dates" ||
          this.type === "daterange"
        ) {
          return "yyyyMMdd";
        } else if (this.type === "datetime" || this.type === "datetimerange") {
          return "yyyyMMddHHmmss";
        } else if (this.type === "time" || this.type === "timerange") {
          return "HHmmss";
        } else if (this.type === "moment") {
          return "HHmm";
        } else {
          return "";
        }
      }
    },
    activeDefaultTime() {
      if (!this.$utilStr.isEmpty(this.defaultTime)) {
        return this.defaultTime;
      } else {
        if (this.type === "datetimerange") {
          return ["00:00:00", "23:59:59"];
        } else {
          return null;
        }
      }
    },
    activePickerOptions() {
      let pickerOptions = {};
      if (!this.$utilStr.isEmpty(this.pickerOptions)) {
        pickerOptions = this.pickerOptions;
      } else if (
        this.type === "moment" &&
        !this.$utilStr.isEmpty(this.momentSelectOptions)
      ) {
        pickerOptions = this.momentSelectOptions;
      } else if (
        (this.type === "daterange" || this.type === "datetimerange") &&
        !this.$utilStr.isEmpty(this.shortcutsOptions)
      ) {
        pickerOptions = {
          shortcuts: this.shortcutsOptions
        };
      }
      if (
        [
          "year",
          "years",
          "week",
          "date",
          "dates",
          "daterange",
          "datetime",
          "datetimerange"
        ].indexOf(this.type) !== -1
      ) {
        let firstDayOfWeekOptions = {
          firstDayOfWeek:
            !isNaN(
              parseFloat(this.firstDayOfWeek) && Number(this.firstDayOfWeek)
            ) &&
            Number(this.firstDayOfWeek) >= 1 &&
            Number(this.firstDayOfWeek) <= 7
              ? this.firstDayOfWeek
              : 1
        };
        pickerOptions = Object.assign(pickerOptions, firstDayOfWeekOptions);
      }
      if (this.disabledTodayAfter) {
        let afterToday = {
          disabledDate: (date) => {
            const now = new Date();
            return date.getTime() > now.getTime();
          }
        };
        pickerOptions = Object.assign(pickerOptions, afterToday);
      }
      return pickerOptions;
    },
    activePlaceholder() {
      if (this.placeholder) {
        return this.placeholder;
      } else {
        if (this.type === "year") {
          return "请选择年";
        } else if (this.type === "years") {
          return "请选择一个或多个年";
        } else if (this.type === "month" || this.type === "monthrange") {
          return "请选择月";
        } else if (this.type === "months") {
          return "请选择一个或多个月";
        } else if (this.type === "week") {
          return "请选择周";
        } else if (this.type === "date" || this.type === "daterange") {
          return "请选择日期";
        } else if (this.type === "dates") {
          return "请选择一个或多个日期";
        } else if (this.type === "datetime" || this.type === "datetimerange") {
          return "请选择日期时间";
        } else if (this.type === "time" || this.type === "timerange") {
          return "请选择时间";
        } else if (this.type === "moment") {
          return "请选择时刻";
        } else {
          return "请选择";
        }
      }
    },
    activeStartPlaceholder() {
      if (this.adaptive) {
        return this.activePlaceholder;
      } else if (this.startPlaceholder) {
        return this.startPlaceholder;
      } else {
        if (this.type === "monthrange") {
          return "请选择开始月份";
        } else if (this.type === "daterange") {
          return "请选择开始日期";
        } else {
          return "请选择开始时间";
        }
      }
    },
    activeEndPlaceholder() {
      if (this.adaptive) {
        return this.activePlaceholder;
      } else if (this.endPlaceholder) {
        return this.endPlaceholder;
      } else {
        if (this.type === "monthrange") {
          return "请选择结束月份";
        } else if (this.type === "daterange") {
          return "请选择结束日期";
        } else {
          return "请选择结束时间";
        }
      }
    },
    activeCaretIcon() {
      if (
        this.type === "monthrange" ||
        this.type === "daterange" ||
        this.type === "datetimerange" ||
        this.type === "timerange"
      ) {
        return this.$refs.pickerRef.$el.querySelector(".el-range__icon");
      } else {
        return this.$refs.pickerRef.$el.querySelector(".el-input__prefix");
      }
    },
    activeRangeAdaptive() {
      if (
        this.type === "monthrange" ||
        this.type === "daterange" ||
        this.type === "datetimerange" ||
        this.type === "timerange"
      ) {
        return this.adaptive && this.$utilStr.isEmpty(this.value);
      } else {
        return false;
      }
    }
  },
  watch: {
    keepTime: {
      handler(val) {
        if (val) {
          if (this.currentKeepTime) {
            this.currentKeepTime = val;
            this.triggerRealTime();
          } else {
            if (this.currentValue === this.realTime) {
              this.currentKeepTime = val;
              this.triggerRealTime();
            }
          }
        }
      },
      immediate: true
    },
    showClear: {
      handler(val) {
        if (val) {
          if (
            this.$utilElem.getStyle(this.activeCaretIcon, "position") ===
            "absolute"
          ) {
            this.activeCaretIcon.style.display = "none";
          }
        } else {
          this.activeCaretIcon.style.display = "";
        }
      },
      immediate: false
    }
  },
  methods: {
    // 设置禁用状态
    setDisabledDate(val) {
      if (new Date(val).getTime() > new Date().getTime()) {
        return val.getTime() >= new Date().getTime();
      } else {
        return val.getTime() < Date.now() - Number(this.optionalDays) * 8.64e7;
      }
    },
    // input获得焦点
    handleFocus() {
      if (this.currentKeepTime) {
        this.currentKeepTime = 0;
      }
    },
    // date值改变
    handleChange(val) {
      if (this.currentKeepTime) {
        this.currentKeepTime = 0;
      }
      if (this.type === "week") {
        if (val) {
          let sunday = this.$utilDate.dateFtt(
            this.$utilDate.addDays(val, +6),
            this.activeValueFormat
          );
          this.$emit("currentChanged", [val, sunday]);
        } else {
          this.$emit("currentChanged", []);
        }
      } else {
        this.$emit("currentChanged", val);
      }
      if (this.type === "time") {
        if (!val) {
          this.$refs.pickerRef.pickerVisible = false;
        }
      }
    },
    // 更新时间
    triggerRealTime() {
      if (this.currentKeepTime) {
        let t = new Date();
        if (typeof this.currentKeepTime !== "boolean") {
          t = new Date(this.currentKeepTime);
        }
        this.realTime = this.$utilDate.dateFtt(t, this.activeValueFormat);
        this.$emit("input", this.realTime);
        this.$emit("currentChanged", this.realTime);
        this.triggerClearValidate();
      }
    },
    // 重新校验绑定值
    handleValidateValue() {
      this.$nextTick(() => {
        let pickerRef = this.$refs.pickerRef;
        if (pickerRef) {
          let currentValue = pickerRef.value;
          let currentDisplayValue = pickerRef.displayValue;
          if (Array.isArray(currentValue)) {
            for (let [index, value] of currentValue.entries()) {
              if (
                value &&
                isNaN(
                  new Date(
                    this.$utilDate.dateFtt(value, "yyyy/MM/dd HH:mm:ss")
                  ).getTime()
                )
              ) {
                currentValue[index] = this.$utilDate.dateFtt(
                  currentDisplayValue[index],
                  this.activeValueFormat
                );
              }
            }
          } else {
            if (
              currentValue &&
              isNaN(
                new Date(
                  this.$utilDate.dateFtt(currentValue, "yyyy/MM/dd HH:mm:ss")
                ).getTime()
              )
            ) {
              currentValue = this.$utilDate.dateFtt(
                currentDisplayValue,
                this.activeValueFormat
              );
            }
          }
          if (!this.$utilStr.isEqual(currentValue, pickerRef.value)) {
            this.$emit("input", currentValue);
          }
        }
      });
    },
    // 重新适应宽度
    handleAdaptive() {
      if (this.adaptive) {
        this.$nextTick(async () => {
          let pickerRef = this.$refs.pickerRef;
          if (pickerRef) {
            let pickerBoxEl = pickerRef.$el;
            let pickerEl = pickerRef.refInput[0];
            if (
              this.type === "datetimerange" ||
              this.type === "daterange" ||
              this.type === "monthrange" ||
              this.type === "timerange"
            ) {
              if (this.activeRangeAdaptive) {
                let pickerStyles = this.$utilElem.getStyle(pickerEl);
                let pickerWidth = Math.ceil(
                  await this.$utilElem.getTextScreenWidth(
                    this.activePlaceholder,
                    pickerStyles.fontSize,
                    pickerStyles.fontWeight,
                    pickerStyles.fontFamily
                  )
                );
                pickerEl.style.width = pickerWidth + "px";
                let pickerBoxStyles = this.$utilElem.getStyle(pickerBoxEl);
                let borderSize =
                  parseFloat(pickerBoxStyles.borderLeftWidth) +
                  parseFloat(pickerBoxStyles.borderRightWidth);
                let paddingSize =
                  parseFloat(pickerBoxStyles.paddingLeft) +
                  parseFloat(pickerBoxStyles.paddingRight);
                pickerBoxEl.style.width =
                  Math.ceil(pickerWidth + borderSize + paddingSize) + "px";
              } else {
                pickerEl.style.width = "";
                pickerBoxEl.style.width = "";
              }
            } else {
              let text;
              if (pickerRef.value) {
                text = pickerRef.displayValue;
              } else if (this.activePlaceholder) {
                text = this.activePlaceholder;
              }
              let pickerStyles = this.$utilElem.getStyle(pickerEl);
              let borderSize =
                parseFloat(pickerStyles.borderLeftWidth) +
                parseFloat(pickerStyles.borderRightWidth);
              let paddingSize =
                parseFloat(pickerStyles.paddingLeft) +
                parseFloat(pickerStyles.paddingRight);
              pickerBoxEl.style.width =
                Math.ceil(
                  (await this.$utilElem.getTextScreenWidth(
                    text,
                    pickerStyles.fontSize,
                    pickerStyles.fontWeight,
                    pickerStyles.fontFamily
                  )) +
                    borderSize +
                    paddingSize
                ) + "px";
            }
          }
        });
      }
    }
  }
};
</script>

<style scoped>
.el-date-editor ::v-deep .el-input__suffix {
  right: 5px;
}
</style>
