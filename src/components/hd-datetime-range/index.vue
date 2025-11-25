<template>
  <div class="date-time-range-picker">
    <date-picker
      v-model="startDateTime"
      type="datetime"
      :format="format"
      :placeholder="startPlaceholder"
      :not-after="endDateTime"
      :clearable="clearable"
      @input="handleStartChange"
      :underline="underline"
    />
    <span class="separator">至</span>
    <date-picker
      v-model="endDateTime"
      type="datetime"
      :format="format"
      :placeholder="endPlaceholder"
      :not-before="startDateTime"
      :clearable="clearable"
      @input="handleEndChange"
      :underline="underline"
    />
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';

export default {
  components: {
    DatePicker
  },
  props: {
    value: {
      type: Array,
      default: () => [null, null]
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    startPlaceholder: {
      type: String,
      default: '开始日期时间'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期时间'
    },
    underline: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      startDateTime: this.value[0],
      endDateTime: this.value[1]
    };
  },
  watch: {
    value(newVal) {
      this.startDateTime = newVal[0];
      this.endDateTime = newVal[1];
    },
    startDateTime(newVal) {
      if (this.endDateTime && newVal > this.endDateTime) {
        this.endDateTime = newVal;
      }
      this.updateValue();
    },
    endDateTime(newVal) {
      if (this.startDateTime && newVal < this.startDateTime) {
        this.startDateTime = newVal;
      }
      this.updateValue();
    }
  },
  methods: {
    handleStartChange(newVal) {
      if (!newVal) {
        // 清空时，两个值都清空
        this.startDateTime = null;
        this.endDateTime = null;
      } else if (!this.endDateTime) {
        // 另一个值为空时，赋值当前值
        this.endDateTime = newVal;
      } else if (newVal > this.endDateTime) {
        // 确保开始时间 <= 结束时间
        this.endDateTime = newVal;
      }
      this.updateValue();
    },
    handleEndChange(newVal) {
      if (!newVal) {
        // 清空时，两个值都清空
        this.startDateTime = null;
        this.endDateTime = null;
      } else if (!this.startDateTime) {
        // 另一个值为空时，赋值当前值
        this.startDateTime = newVal;
      } else if (newVal < this.startDateTime) {
        // 确保结束时间 >= 开始时间
        this.startDateTime = newVal;
      }
      this.updateValue();
    },
    updateValue() {
      this.$emit('input', [this.startDateTime, this.endDateTime]);
    }
  }
};
</script>

<style scoped>
.date-time-range-picker {
  display: flex;
  align-items: center;
}
.separator {
  margin: 0 8px;
  color: #666;
}
</style>
<style>
.mx-datepicker-popup {
  z-index: 100000 !important;
}

/* 下划线样式 */
.mx-datepicker[underline='true'] .mx-input {
  -webkit-box-shadow: none;
  box-shadow: none;
  border: none;
  border-bottom: 1px solid #ccc;
}
</style>
