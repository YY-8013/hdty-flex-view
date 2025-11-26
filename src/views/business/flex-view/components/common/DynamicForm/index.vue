<template>
  <div class="dynamic-form">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      :label-width="labelWidth"
      :inline="inline"
      :disabled="mode === 'view'"
    >
      <el-row :gutter="20">
        <el-col
          v-for="item in formItems"
          :key="item.prop"
          :span="getItemSpan(item)"
        >
          <el-form-item :label="item.label" :prop="item.prop">
            <!-- 动态渲染字段组件 -->
            <field-render
              :item="item"
              :value="formData[item.prop]"
              :mode="mode"
              @input="handleInput(item.prop, $event)"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <!-- 操作按钮 -->
      <el-form-item v-if="!inline && mode !== 'view'">
        <slot name="footer">
          <hd-button-container>
            <hd-button @click="resetFields">重置</hd-button>
            <hd-button type="primary" @click="submit">提交</hd-button>
          </hd-button-container>
        </slot>
      </el-form-item>

      <!-- inline 模式的按钮插槽 -->
      <template v-if="inline">
        <slot name="footer"></slot>
      </template>
    </el-form>
  </div>
</template>

<script>
import FieldRender from "./FieldRender.vue";

export default {
  name: "DynamicForm",
  components: {
    FieldRender
  },
  props: {
    // 表单项配置
    formItems: {
      type: Array,
      default: () => []
    },
    // 初始数据
    initData: {
      type: Object,
      default: () => ({})
    },
    // 表单模式: add | edit | view
    mode: {
      type: String,
      default: "add",
      validator: (value) => ["add", "edit", "view"].includes(value)
    },
    // 标签宽度
    labelWidth: {
      type: String,
      default: "120px"
    },
    // 是否行内表单
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      formRules: {}
    };
  },
  watch: {
    formItems: {
      handler() {
        this.initForm();
      },
      immediate: true
    },
    initData: {
      handler(val) {
        this.formData = { ...this.formData, ...val };
      },
      deep: true
    }
  },
  methods: {
    // 初始化表单
    initForm() {
      this.initFormData();
      this.initFormRules();
    },

    // 初始化表单数据
    initFormData() {
      const data = {};
      this.formItems.forEach((item) => {
        const config = this.parseConfig(item);
        data[item.prop] = config.defaultValue || null;
      });
      this.formData = { ...data, ...this.initData };
    },

    // 初始化验证规则
    initFormRules() {
      const rules = {};
      this.formItems.forEach((item) => {
        if (item.rules && item.rules.length > 0) {
          rules[item.prop] = item.rules;
        } else if (item.required) {
          // 自动生成必填规则
          rules[item.prop] = [
            {
              required: true,
              message: `${item.label}不能为空`,
              trigger: "blur"
            }
          ];
        }
      });
      this.formRules = rules;
    },

    // 解析配置
    parseConfig(item) {
      try {
        return typeof item.config === "string"
          ? JSON.parse(item.config)
          : item.config || {};
      } catch {
        return {};
      }
    },

    // 获取字段占位
    getItemSpan(item) {
      const config = this.parseConfig(item);
      if (this.inline) {
        return config.span || 8;
      }
      return item.span || config.span || 24;
    },

    // 输入处理
    handleInput(prop, value) {
      this.$set(this.formData, prop, value);
    },

    // 提交表单
    submit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          this.$emit("submit", this.formData);
        }
      });
    },

    // 重置表单
    resetFields() {
      this.$refs.formRef.resetFields();
    },

    // 获取表单数据
    getFormData() {
      return this.formData;
    },

    // 设置表单数据
    setFormData(data) {
      this.formData = { ...this.formData, ...data };
    },

    // 清除验证
    clearValidate() {
      this.$refs.formRef.clearValidate();
    }
  }
};
</script>

<style lang="scss" scoped>
// 表单组件样式继承自 el-form，无需额外样式
</style>
