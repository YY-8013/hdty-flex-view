// components/DateTimeRangePicker.vue
<template>
  <date-picker
    :style="{width:width}"
    ref="datePickerRef"
    :visible="visible"
    v-model="internalValue"
    :type="type"
    :placeholder="placeholderText"
    :range="range"
    :format="format"
    :clearable="clearable"
    :not-before="notBefore"
    :not-after="notAfter"
    :show-time-panel="showTimeRangePanel"
    :lang="lang"
    @close="handleRangeClose"
    @input="updateValue"
    :underline="underline"
  >
    <template v-slot:footer>
      <button
        v-show="type === 'datetime'"
        class="mx-btn mx-btn-text"
        @click="toggleTimeRangePanel"
      >{{ showTimeRangePanel ? selectDateText : selectTimeText }}</button>
      <el-button v-if="confirm" type="primary" size="mini" @click="handleConfirm">确定</el-button>
    </template>
  </date-picker>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import zhCN from 'vue2-datepicker/locale/zh-cn';

export default {
  components: {
    DatePicker
  },
  props: {
    value: {
      type: Array,
      default: () => []
    },
    placeholderText: {
      type: String,
      default: '请选择日期时间范围'
    },
    selectDateText: {
      type: String,
      default: '选择日期'
    },
    selectTimeText: {
      type: String,
      default: '选择时间'
    },
    type: {
      type: String,
      default: 'datetime'
    },
    range: {
      type: Boolean,
      default: true
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    confirm: {
      type: Boolean,
      default: true
    },
    notBefore: {
      type: [String, Date],
      default: null
    },
    notAfter: {
      type: [String, Date],
      default: null
    },
    lang: {
      type: Object,
      default: () => {
        return {
          ...zhCN,
          confirm: '确定'
        };
      }
    },
    // 下划线风格
    underline: {
      type: Boolean,
      default: true
    },
    autoClose: {
      type: Boolean,
      default: false // 默认值为 true，表示自动关闭
    },
    width: {
      type: [String, Number],
      default: '100%'
    }
  },
  data() {
    return {
      internalValue: this.value,
      showTimeRangePanel: false,
      visible: false
    };
  },
  watch: {
    value(newVal) {
      this.internalValue = newVal;
    }
  },
  methods: {
    updateValue(newVal) {
      this.$emit('input', newVal);
    },
    toggleTimeRangePanel() {
      this.showTimeRangePanel = !this.showTimeRangePanel;
    },
    handleRangeClose() {
      if (this.type === 'date') {
        // 如果 autoClose 为 true 且类型为 date，则自动关闭弹框
        this.showTimeRangePanel = !this.autoClose;
        this.visible = !this.autoClose;
      }
    },
    handleConfirm() {
      this.$refs.datePickerRef.closePopup();
    }
  }
};
</script>

<style scoped>
.mx-btn {
  cursor: pointer;
  padding: 5px 10px;
  border: none;
  background: none;
  color: #409eff;
  margin-left: 10px;
}
</style>

<style>
.mx-datepicker-popup {
  z-index: 100000 !important;
}

/* 如果只想改变input的下划线样式 */
.mx-datepicker[underline='true'] .mx-input {
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  border-bottom: 1px solid #ccc; /* 设置input的下划线 */
}
</style>
