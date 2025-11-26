<template>
  <div class="field-render">
    <!-- 基础输入框 -->
    <el-input
      v-if="item.type === 'input'"
      :value="value"
      :placeholder="config.placeholder || `请输入${item.label}`"
      :maxlength="config.maxlength"
      :disabled="config.disabled || isView"
      :readonly="config.readonly"
      clearable
      @input="handleInput"
    />

    <!-- 多行文本 -->
    <el-input
      v-else-if="item.type === 'textarea'"
      type="textarea"
      :value="value"
      :placeholder="config.placeholder || `请输入${item.label}`"
      :rows="config.rows || 3"
      :maxlength="config.maxlength"
      :disabled="config.disabled || isView"
      :readonly="config.readonly"
      @input="handleInput"
    />

    <!-- 数字输入 -->
    <el-input-number
      v-else-if="item.type === 'number'"
      :value="value"
      :min="config.min"
      :max="config.max"
      :precision="config.precision"
      :step="config.step || 1"
      :disabled="config.disabled || isView"
      controls-position="right"
      @input="handleInput"
    />

    <!-- 下拉选择 -->
    <el-select
      v-else-if="item.type === 'select'"
      :value="value"
      :placeholder="config.placeholder || `请选择${item.label}`"
      :multiple="config.multiple"
      :filterable="config.filterable"
      :disabled="config.disabled || isView"
      clearable
      @input="handleInput"
    >
      <el-option
        v-for="option in config.options || []"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </el-select>

    <!-- 单选框 -->
    <el-radio-group
      v-else-if="item.type === 'radio'"
      :value="value"
      :disabled="config.disabled || isView"
      @input="handleInput"
    >
      <el-radio
        v-for="option in config.options || []"
        :key="option.value"
        :label="option.value"
      >
        {{ option.label }}
      </el-radio>
    </el-radio-group>

    <!-- 复选框 -->
    <el-checkbox-group
      v-else-if="item.type === 'checkbox'"
      :value="value"
      :disabled="config.disabled || isView"
      @input="handleInput"
    >
      <el-checkbox
        v-for="option in config.options || []"
        :key="option.value"
        :label="option.value"
      >
        {{ option.label }}
      </el-checkbox>
    </el-checkbox-group>

    <!-- HDty 日期选择 -->
    <hd-date-picker
      v-else-if="
        item.type === 'date' ||
        item.type === 'datetime' ||
        item.type === 'daterange'
      "
      :type="config.type || item.type"
      :value="value"
      :placeholder="config.placeholder || `请选择${item.label}`"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 机构选择 -->
    <hd-organ
      v-else-if="item.type === 'organ'"
      :value="value"
      :placeholder="config.placeholder || '请选择机构'"
      :multiple="config.multiple"
      :filter-code="config.filterCode"
      :show-level="config.showLevel"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 地区选择 -->
    <hd-region
      v-else-if="item.type === 'region'"
      :value="value"
      :placeholder="config.placeholder || '请选择地区'"
      :multiple="config.multiple"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 字典下拉选择 -->
    <hd-dict-select
      v-else-if="item.type === 'dict-select'"
      :value="value"
      :dict-code="config.dictCode"
      :placeholder="config.placeholder || `请选择${item.label}`"
      :filterable="config.filterable"
      :multiple="config.multiple"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 字典级联选择 -->
    <hd-dict-cascader
      v-else-if="item.type === 'dict-cascader'"
      :value="value"
      :dict-code="config.dictCode"
      :placeholder="config.placeholder || `请选择${item.label}`"
      :filterable="config.filterable"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 字典单选框 -->
    <hd-dict-radio
      v-else-if="item.type === 'dict-radio'"
      :value="value"
      :dict-code="config.dictCode"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- HDty 字典复选框 -->
    <hd-dict-checkbox
      v-else-if="item.type === 'dict-checkbox'"
      :value="value"
      :dict-code="config.dictCode"
      :disabled="config.disabled || isView"
      @input="handleInput"
    />

    <!-- 未知字段类型 -->
    <span v-else class="unknown-field"> 未知字段类型: {{ item.type }} </span>
  </div>
</template>

<script>
export default {
  name: "FieldRender",
  props: {
    // 字段配置
    item: {
      type: Object,
      required: true
    },
    // 字段值
    value: {
      type: [String, Number, Array, Object, Boolean],
      default: null
    },
    // 表单模式
    mode: {
      type: String,
      default: "add"
    }
  },
  computed: {
    // 字段配置
    config() {
      try {
        return typeof this.item.config === "string"
          ? JSON.parse(this.item.config)
          : this.item.config || {};
      } catch {
        return {};
      }
    },

    // 是否查看模式
    isView() {
      return this.mode === "view";
    }
  },
  methods: {
    // 输入处理
    handleInput(value) {
      this.$emit("input", value);
    }
  }
};
</script>

<style lang="scss" scoped>
.field-render {
  width: 100%;

  .unknown-field {
    color: #f56c6c;
  }
}
</style>
