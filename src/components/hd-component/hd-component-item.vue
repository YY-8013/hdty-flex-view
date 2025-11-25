<template>
  <hd-input
    v-if="type==='input'"
    v-model="currentValue"
    :minlength="minlength"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :size="size"
    :placeholder="placeholder || '请输入'"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput"
    @clear="handleClear">
  </hd-input>
  <hd-input
    v-else-if="type==='password'"
    type="password"
    v-model="currentValue"
    :minlength="minlength"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :show-password="showPassword"
    :size="size"
    :placeholder="placeholder || '请输入'"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput"
    @clear="handleClear">
  </hd-input>
  <hd-input
    v-else-if="type==='textarea'"
    type="textarea"
    v-model="currentValue"
    :minlength="minlength"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :rows="textareaRows"
    :autosize="textareaAutosize"
    :size="size"
    :placeholder="placeholder || '请输入'"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput"
    @clear="handleClear">
  </hd-input>
  <hd-factor-input
    v-else-if="type==='factorInput'"
    v-model="currentValue"
    :model-control.sync="currentLabel"
    :fuzzy="fuzzy"
    :minlength="minlength"
    :maxlength="maxlength"
    :show-word-limit="showWordLimit"
    :show-control-button="showControlButton"
    :control-button-readonly="controlButtonReadonly"
    :control-button-sisabled="controlButtonDisabled"
    :size="size"
    :placeholder="placeholder || '请输入'"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentBlur="handleBlur"
    @currentFocus="handleFocus"
    @currentChanged="handleChange"
    @currentInput="handleInput"
    @currentClear="handleClear"
    @currentControlChanged="handleControlChange">
  </hd-factor-input>
  <hd-barcode
    v-else-if="type==='barcodeInput'"
    v-model="currentValue"
    :size="size"
    :placeholder="placeholder || '请扫码'"
    :auto-input="barcodeAutoInput"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-barcode>
  <hd-input-number
    v-else-if="type==='numberInput'"
    v-model="currentValue"
    :min="min"
    :max="max"
    :step="step"
    :precision="precision"
    :step-strictly="stepStrictly"
    :controls="showControlButton"
    :controls-position="controlButtonPosition"
    :size="size"
    :placeholder="placeholder || '请选择'"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput">
  </hd-input-number>
  <hd-number-range
    v-else-if="type==='numberRangeInput'"
    v-model="currentValue"
    :optional-range="optionalRange"
    :size="size"
    :placeholder="placeholder || '请输入'"
    :start-placeholder="startPlaceholder || '请输入最小数量'"
    :end-placeholder="endPlaceholder || '请输入最大数量'"
    :range-separator="rangeSeparator"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @blur="handleBlur"
    @focus="handleFocus"
    @change="handleChange"
    @input="handleInput">
  </hd-number-range>
  <hd-dict-radio
    v-else-if="type==='radio'"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-radio>
  <hd-factor-logic
    v-else-if="type==='factorRadio'"
    type="radio"
    v-model="currentValue"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-factor-logic>
  <hd-dict-radio
    v-else-if="type==='borderRadio'"
    type="border"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-radio>
  <hd-factor-logic
    v-else-if="type==='factorBorderRadio'"
    type="borderRadio"
    v-model="currentValue"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-factor-logic>
  <hd-dict-radio
    v-else-if="type==='buttonRadio'"
    type="button"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-radio>
  <hd-factor-logic
    v-else-if="type==='factorButtonRadio'"
    type="buttonRadio"
    v-model="currentValue"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-factor-logic>
  <hd-dict-checkbox
    v-else-if="type==='checkbox'"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-checkbox>
  <hd-dict-checkbox
    v-else-if="type==='borderCheckbox'"
    type="border"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-checkbox>
  <hd-dict-checkbox
    v-else-if="type==='buttonCheckbox'"
    type="button"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :size="size"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :readonly="readonly"
    :disabled="disabled"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-checkbox>
  <hd-dict-select
    v-else-if="type==='select'"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :trigger="trigger"
    :size="size"
    :placeholder="placeholder || '请选择'"
    :collapse-tags="collapseTags"
    :check-influentially="checkInfluentially"
    :show-all-button="showAllButton"
    :show-code="showCode"
    :filterable="filterable"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-select>
  <hd-factor-logic
    v-else-if="type==='factorSelect'"
    type="select"
    v-model="currentValue"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-factor-logic>
  <hd-dict-cascader
    v-else-if="type==='cascader'"
    :dict-code="dict"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :visible-option="visibleOption"
    :remove-option="removeOption"
    :trigger="trigger"
    :expand-trigger="expandTrigger"
    :size="size"
    :placeholder="placeholder || '请选择'"
    :emit-path="emitPath"
    :collapse-tags="collapseTags"
    :check-strictly="checkStrictly"
    :check-influentially="checkInfluentially"
    :show-all-levels="showAllLevels"
    :show-code="showCode"
    :lazy="lazy"
    :filterable="filterable"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-dict-cascader>
  <hd-organ
    v-else-if="type==='organSelect'"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :filter-code="filterCode"
    :show-level="showLevel"
    :check-level="checkLevel"
    :size="size"
    :dialog-title="dialogSelectTitle"
    :placeholder="placeholder || '请选择'"
    :show-dept="showDept"
    :show-city="showCity"
    :check-final-level="checkFinalLevel"
    :check-strictly="checkStrictly"
    :check-influentially="checkInfluentially"
    :default-expand-first="defaultExpandFirst"
    :refresh="showRefreshButton"
    :show-code="showCode"
    :lazy="lazy"
    :accordion="accordion"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentOpening="handleOpening"
    @currentChanged="handleChange">
  </hd-organ>
  <hd-region
    v-else-if="type==='regionSelect'"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :filter-code="filterCode"
    :show-level="showLevel"
    :check-level="checkLevel"
    :size="size"
    :dialog-title="dialogSelectTitle"
    :placeholder="placeholder || '请选择'"
    :check-final-level="checkFinalLevel"
    :check-strictly="checkStrictly"
    :check-influentially="checkInfluentially"
    :default-expand-first="defaultExpandFirst"
    :refresh="showRefreshButton"
    :show-code="showCode"
    :lazy="lazy"
    :accordion="accordion"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentOpening="handleOpening"
    @currentChanged="handleChange">
  </hd-region>
  <hd-map-point
    v-else-if="type==='pointPicker'"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :map="mapParty"
    :center="center"
    :zoom="zoom"
    :marker="marker"
    :drawing-mode="drawingMode"
    :autoView="mapAutoView"
    :multiple="multiple"
    :limit="limit"
    :size="size"
    :dialog-size="dialogSelectSize"
    :dialog-title="dialogSelectTitle"
    :placeholder="placeholder || '请拾取'"
    :check-influentially="checkInfluentially"
    :show-full-address="showFullAddress"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentOpening="handleOpening"
    @currentChanged="handleChange">
  </hd-map-point>
  <hd-date-picker
    v-else-if="[
      'yearPicker', 'yearsPicker',
      'monthPicker', 'monthsPicker', 'monthRangePicker',
      'weekPicker',
      'datePicker', 'datesPicker', 'dateRangePicker',
      'datetimePicker', 'datetimeRangePicker',
      'timePicker', 'timeRangePicker',
      'momentPicker'
    ].indexOf(type) !== -1"
    :type="type.replace(/Picker/, '').toLowerCase()"
    v-model="currentValue"
    :format="format"
    :value-format="valueFormat"
    :default-time="defaultTime"
    :align="pickerAlign"
    :optional-days="optionalDays"
    :first-day-of-week="firstDayOfWeek"
    :shortcuts-options="shortcutsOptions"
    :moment-select-options="momentSelectOptions"
    :picker-options="pickerOptions"
    :keep-time="keepTime"
    :size="size"
    :placeholder="placeholder || '请选择'"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :range-separator="rangeSeparator"
    :clearable="clearable"
    :readonly="readonly"
    :disabled="disabled"
    :adaptive="adaptive"
    :underline="underline"
    @currentChanged="handleChange">
  </hd-date-picker>
  <hd-factor-logic
    v-else-if="type==='factorButton'"
    type="button"
    v-model="currentValue"
    @currentChanged="handleChange">
  </hd-factor-logic>
  <div
    v-else
    class="hdty-component-item">
    <slot v-if="$slots.default">
    </slot>
    <template v-else>
      {{ label || value }}
    </template>
  </div>
</template>

<script>
  import { hdComponent } from '@/utils/util-framework';
  export default {
    name: "HdComponentItem",
    provide() {
      return {
        hdComponentItem: this
      };
    },
    mixins: [hdComponent],
    props: {
      prop: String,
      // 组件类型（input/textarea/password/factorInput/barcodeInput/numberInput/numberRangeInput/radio/buildRadio/factorRadio/borderRadio/buildBorderRadio/factorBorderRadio/buttonRadio/buildButtonRadio/factorButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/factorSelect/organSelect/regionSelect/iconSelect/tableSelect/cascader/buildCascader/yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker/pointPicker/imageUpload/inputUpload/cameraUpload/jsonEditor/factorButton）
      type: {
        type: String,
        default: ''
      },
      // 绑定值
      value: {
        type: [Number, String, Object, Array],
        default: ''
      },
      // 绑定值文本
      label: {
        type: [String, Array],
        default: ''
      },
      // 最小输入长度（只对type="input/textarea/password/factorInput"有效）
      minlength: {
        type: [Number, String]
      },
      // 最大输入长度（只对type="input/textarea/password/factorInput"有效）
      maxlength: {
        type: [Number, String]
      },
      // 是否显示输入字数（只对type="input/textarea/password/factorInput"有效）
      showWordLimit: {
        type: Boolean,
        default: false
      },
      // 是否显示切换密码图标（只对type="password"有效）
      showPassword: {
        type: Boolean,
        default: false
      },
      // 输入框行数（只对type="textarea"有效)
      textareaRows: {
        type: Number,
        default: 3
      },
      // 输入框高度自适应（只对type="textarea"有效)
      textareaAutosize: {
        type: [Boolean, Object],
        default: false
      },
      // 模糊查询类型（只对type="factorInput"有效）
      fuzzy: {
        type: String
      },
      // 是否显示控制按钮（只对type="factorInput/numberInput"有效）
      showControlButton: {
        type: Boolean,
        default: true
      },
      // 是否只读控制按钮（只对type="factorInput"有效）
      controlButtonReadonly: {
        type: Boolean,
        default: false
      },
      // 是否禁用控制按钮（只对type="factorInput"有效）
      controlButtonDisabled: {
        type: Boolean,
        default: false
      },
      // 控制按钮显示位置（只对type="numberInput"有效）
      controlButtonPosition: {
        type: String,
        default: 'right'
      },
      // 条码是否自动输入（只对type="barcodeInput"有效）
      barcodeAutoInput: {
        type: Boolean,
        default: true
      },
      // 最小值（只对type="numberInput"有效）
      min: {
        type: Number
      },
      // 最大值（只对type="numberInput"有效）
      max: {
        type: Number
      },
      // 步长（只对type="numberInput"有效）
      step: {
        type: Number
      },
      // 数值精度（只对type="numberInput"有效）
      precision: {
        type: Number
      },
      // 是否只能输入步长的倍数（只对type="numberInput"有效）
      stepStrictly: {
        type: Boolean,
        default: false
      },
      // 可选范围（只对type="numberRangeInput"有效）
      optionalRange: {
        type: Array
      },
      // 字典编码（只对type="radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader"有效）
      dict: {
        type: [Number, String]
      },
      // 显示选项（只对type="radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader"有效）
      visibleOption: {
        type: [Number, String, Array]
      },
      // 隐藏选项（只对type="radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/cascader/buildCascader"有效）
      removeOption: {
        type: [Number, String, Array]
      },
      // 是否允许多选（只对type="select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload"有效）
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选限制（只对type="select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker/imageUpload"有效）
      limit: {
        type: Number
      },
      // 下拉触发方式（只对type="select/buildSelect/cascader/buildCascader"有效）
      trigger: {
        type: String
      },
      // 级联展开触发方式（只对type="cascader/buildCascader"有效）
      expandTrigger: {
        type: String
      },
      // 筛选编码（只对type="organSelect/regionSelect"有效）
      filterCode: {
        type: [Number, String]
      },
      // 只能显示到的级别（只对type="organSelect/regionSelect"有效）
      showLevel: {
        type: [Number, String]
      },
      // 可选择的级别（只对type="organSelect/regionSelect"有效）
      checkLevel: {
        type: [Number, String, Array]
      },
      // 地图方案（只对type="pointPicker"有效）
      mapParty: {
        type: String
      },
      // 地图中心点坐标（只对type="pointPicker"有效）
      center: {
        type: Object
      },
      // 地图缩放级别（只对type="pointPicker"有效）
      zoom: {
        type: [Number, String]
      },
      // 是否开启点绘制（只对type="pointPicker"有效）
      marker: {
        type: Boolean,
        default: true
      },
      // 默认开启的绘制模式（只对type="pointPicker"有效）
      drawingMode: {
        type: String
      },
      // 地图是否自动调整最佳视野（只对type="pointPicker"有效）
      mapAutoView: {
        type: Boolean,
        default: true
      },
      // 显示格式（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      format: {
        type: String
      },
      // 绑定值格式（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      valueFormat: {
        type: String
      },
      // 默认时刻（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      defaultTime: {
        type: Array
      },
      // 对齐方式（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      pickerAlign: {
        type: String
      },
      // 可选天数（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      optionalDays: {
        type: [Number, String]
      },
      // 周起始日（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      firstDayOfWeek: {
        type: [String, Number]
      },
      // 快捷选项配置（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      shortcutsOptions: {
        type: Array
      },
      // 时刻选项配置（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      momentSelectOptions: {
        type: Object
      },
      // 日期时间选择器特有选项配置（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      pickerOptions: {
        type: Object
      },
      // 保持实时时间（只对type="yearPicker/yearsPicker/monthPicker/monthsPicker/monthRangePicker/weekPicker/datePicker/datesPicker/dateRangePicker/datetimePicker/datetimeRangePicker/timePicker/timeRangePicker/momentPicker"有效）
      keepTime: {
        type: [Boolean, Number]
      },
      // 尺寸
      size: {
        type: String,
        default: ''
      },
      // 会话选择窗口尺寸（只对type="iconSelect/tableSelect/pointPicker"有效）
      dialogSelectSize: {
        type: String
      },
      // 会话选择窗口标题（只对type="organSelect/regionSelect/iconSelect/tableSelect/pointPicker"有效）
      dialogSelectTitle: {
        type: String
      },
      // 水印
      placeholder: {
        type: String,
        default: ''
      },
      // 范围选择时开始水印（只对type="numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker"有效）
      startPlaceholder: {
        type: String,
        default: ''
      },
      // 范围选择时结束水印（只对type="numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker"有效）
      endPlaceholder: {
        type: String,
        default: ''
      },
      // 范围选择时分隔符（只对type="numberRangeInput/monthRangePicker/dateRangePicker/datetimeRangePicker/timeRangePicker"有效）
      rangeSeparator: {
        type: String
      },
      // 多选时是否折叠标签（只对type="select/buildSelect/cascader/buildCascader"有效）
      collapseTags: {
        type: Boolean,
        default: true
      },
      // 选中节点时是否返回选中节点的各级菜单的值（true:返回选中节点下各级菜单的值；false:只返回选中节点本身的值）（只对type="cascader/buildCascader"有效）
      emitPath: {
        type: Boolean,
        default: false
      },
      // 是否显示部门（只对type="organSelect"有效）
      showDept: {
        type: Boolean,
        default: false
      },
      // 是否总是显示市局（只对type="organSelect"有效）
      showCity: {
        type: Boolean,
        default: false
      },
      // 是否只可选择最后一级（只对type="organSelect/regionSelect"有效）
      checkFinalLevel: {
        type: Boolean,
        default: false
      },
      // 多选时是否严格遵守父子节点关联（true:父子关联，选择父级时即选中当前父级所有子级；false:父子不关联，选择任意一级时只选中本身）（只对type="organSelect/regionSelect/cacader/buildCascader"有效）
      checkStrictly: {
        type: Boolean,
        default: true
      },
      // 改变影响绑定值的配置属性时是否判定影响有效(true:影响绑定值，改变配置属性时清空绑定值；false:不影响绑定值，改变配置属性时不清空绑定值)（只对type="radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect/organSelect/regionSelect/tableSelect/cascader/buildCascader/pointPicker"有效）
      checkInfluentially: {
        type: Boolean,
        default: false
      },
      // 是否默认展开首个节点（只对type="organSelect/regionSelect"有效）
      defaultExpandFirst: {
        type: Boolean,
        default: true
      },
      // 是否显示全部/全选按钮（只对type="radio/buildRadio/borderRadio/buildBorderRadio/buttonRadio/buildButtonRadio/checkbox/buildCheckbox/borderCheckbox/buildBorderCheckbox/buttonCheckbox/buildButtonCheckbox/select/buildSelect"有效）
      showAllButton: {
        type: Boolean,
        default: false
      },
      // 是否显示刷新按钮（只对type="organSelect/regionSelect/tableSelect"有效）
      showRefreshButton: {
        type: Boolean,
        default: true
      },
      // 是否显示完整路径（只对type="cascader/buildCascader"有效）
      showAllLevels: {
        type: Boolean,
        default: false
      },
      // 是否显示编码（只对type="select/buildSelect/organSelect/regionSelect/cascader/buildCascader"有效）
      showCode: {
        type: Boolean,
        default: false
      },
      // 是否显示完整地址（只对type="pointPicker"有效）
      showFullAddress: {
        type: Boolean,
        default: false
      },
      // 是否懒加载（只对type="organSelect/regionSelect/cascader/buildCascader"有效）
      lazy: {
        type: Boolean,
        default() {
          return ['organSelect', 'regionSelect'].indexOf(this.type) !== -1;
        }
      },
      // 是否手风琴模式（只对type="organSelect/regionSelect"有效）
      accordion: {
        type: Boolean,
        default: false
      },
      // 是否可搜索（只对type="select/buildSelect/cascader/buildCascader"有效）
      filterable: {
        type: Boolean,
        default: false
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
      // 宽度自适应
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
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
        }
      },
      currentLabel: {
        get() {
          return this.label;
        },
        set(val) {
          this.$emit('update:label', val);
        }
      }
    },
    methods: {
      // 失去焦点时触发
      handleBlur(...rest) {
        this.$emit('currentBlur', rest);
      },
      // 获得焦点时触发
      handleFocus(...rest) {
        this.$emit('currentFocus', rest);
      },
      // 失去焦点且值改变时触发
      handleChange(...rest) {
        this.$emit('currentChanged', rest);
      },
      // 获得焦点且值改变时触发
      handleInput(...rest) {
        this.$emit('currentInput', rest);
      },
      // 点击清空按钮时触发
      handleClear(...rest) {
        this.$emit('currentClear', rest);
      },
      // 点击控制按钮时触发
      handleControlChange(...rest) {
        this.$emit('currentControlChanged', rest);
      },
      // 会话选择窗口打开时触发
      handleOpening(...rest) {
        this.$emit('currentOpening', rest);
      }
    }
  }
</script>

<style scoped>
  .hdty-component-item {
    display: block;
    position: relative;
  }
</style>
