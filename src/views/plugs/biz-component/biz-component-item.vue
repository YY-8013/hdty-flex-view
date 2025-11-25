<template>
  <el-input
    v-if="type==='input'"
    v-model="currentValue"
    :minlength="minlength"
    :maxlength="maxlength"
    :disabled="disabled"
    :placeholder="placeholder || '请输入'"
    :underline="underline"
  ></el-input>
  <hd-factor-input
    v-else-if="type==='factorInput'"
    :prop="prop"
    v-model="currentValue"
    :model-control.sync="currentLabel"
    :fuzzy="fuzzy"
    :minlength="minlength"
    :maxlength="maxlength"
    :placeholder="placeholder || '请输入'"
    :underline="underline"
  ></hd-factor-input>
  <el-input-number
    v-else-if="type==='numberInput'"
    v-model="currentValue"
    :min="min"
    :max="max"
    :step="step"
    :precision="precision"
    controls-position="right"
    :placeholder="placeholder || '请选择'"
    :underline="underline"
  ></el-input-number>
  <el-input
    v-else-if="type==='textarea'"
    type="textarea"
    v-model="currentValue"
    :rows="rowNum"
    :minlength="minlength"
    :maxlength="maxlength"
    :disabled="disabled"
    :placeholder="placeholder || '请输入'"
    :underline="underline"
  ></el-input>
  <hd-dict-radio
    v-else-if="type==='radio'"
    v-model="currentValue"
    :dict-code="dict"
    :visibleOption="visibleOption"
    :removeOption="removeOption"
    :show-all-button="showAllButton"
    :underline="underline"
  ></hd-dict-radio>
  <hd-dict-checkbox
    v-else-if="type==='checkbox'"
    v-model="currentValue"
    :dict-code="dict"
    :visibleOption="visibleOption"
    :removeOption="removeOption"
    :show-all-button="showAllButton"
    :disabled="disabled"
    :underline="underline"
  ></hd-dict-checkbox>
  <hd-dict-select
    v-else-if="type==='select'"
    :prop="prop"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :dict-code="dict"
    :multiple="multiple"
    :limit="limit"
    :visibleOption="visibleOption"
    :removeOption="removeOption"
    :show-all-button="showAllButton"
    :filterable="filterable"
    :disabled="disabled"
    :placeholder="placeholder || '请选择'"
    :underline="underline"
  ></hd-dict-select>
  <hd-dict-cascader
    v-else-if="type==='cascader' || type==='selectTree'"
    :prop="prop"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :dict-code="dict"
    :multiple="multiple"
    :limit="limit"
    :filterable="filterable"
    :placeholder="placeholder || '请选择'"
    :underline="underline"
  ></hd-dict-cascader>
  <hd-organ
    v-else-if="type==='organ'"
    :prop="prop"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :placeholder="placeholder || '请选择'"
    :underline="underline"
  ></hd-organ>
  <hd-region
    v-else-if="type==='region'"
    :prop="prop"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    :placeholder="placeholder || '请选择'"
    :underline="underline"
  ></hd-region>
  <hd-map-point
    v-else-if="type==='point'"
    :prop="prop"
    v-model="currentValue"
    :model-text.sync="currentLabel"
    :multiple="multiple"
    :limit="limit"
    drawing-mode="marker"
    :placeholder="placeholder || '请拾取'"
    :underline="underline"
  ></hd-map-point>
  <hd-date-picker
    v-else-if="[
      'datetimerange','daterange','monthrange','timerange','year','month','date','dates','week','datetime','time','hour'
    ].indexOf(type) !== -1"
    :type="type"
    :disabled="disabled"
    v-model="currentValue"
    :underline="underline"
  ></hd-date-picker>
  <biz-upload-url v-else-if="type === 'file'" v-model="currentValue"></biz-upload-url>
  <div v-else class="hdty-component-item">
    <slot></slot>
  </div>
</template>

<script>
import { hdComponent } from '@/utils/util-framework';

export default {
  name: 'BizComponentItem',
  components: {},
  provide() {
    return {
      hdComponentItem: this
    };
  },
  mixins: [hdComponent],
  props: {
    prop: String,
    // 组件类型（input/factorInput/numberInput/textarea/radio/checkbox/select/cascader/organ/region/point/datetimerange/daterange/monthrange/timerange/year/month/date/dates/week/datetime/time/hour）
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
    // 最小输入长度（只对type="input/factorInput/textarea"有效）
    minlength: {
      type: [Number, String]
    },
    // 最大输入长度（只对type="input/factorInput/textarea"有效）
    maxlength: {
      type: [Number, String]
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
    // 文本输入框行数
    rowNum: {
      type: Number
    },
    // 字典编码（只对type="radio/checkbox/select/cascader"有效）
    dict: {
      type: [Number, String]
    },
    // 模糊类型（只对type="factorInput"有效）
    fuzzy: {
      type: String
    },
    // 启用多选（只对type="select/cascader/organ/region/point"有效）
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选限制（只对type="select/cascader/organ/region/point"有效）
    limit: {
      type: Number
    },
    // 水印
    placeholder: {
      type: String,
      default: ''
    },
    // 显示选项
    visibleOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 隐藏选项
    removeOption: {
      type: [Number, String, Array],
      default: ''
    },
    // 是否显示全部/全选按钮（只对type="radio/checkbox/select"有效）
    showAllButton: {
      type: Boolean,
      default: false
    },
    // 是否可搜索（只对type="select/cascader"有效）
    filterable: {
      type: Boolean,
      default: false
    },
    // 下划线风格
    underline: {
      type: Boolean,
      default: false
    },
    // 是否可用
    disabled: {
      type: Boolean,
      default: true
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
  data() {
    return {};
  },
  methods: {}
};
</script>

<style scoped>
.hdty-component-item {
  display: block;
  position: relative;
}
</style>
