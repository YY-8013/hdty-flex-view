<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="con-form-anchor">
      <!-- 左侧锚点导航 -->
      <div v-show="showAnchor" class="con-anchor">
        <div class="inner">
          <div v-for="anchorItem in anchorList" :key="anchorItem.id">
            <div
              v-if="anchorItem.show"
              class="anchor-item anchor-item-menu"
              :class="{ 'is-active': activeAnchor === anchorItem.id }"
            >
              <a
                href="javascript:;"
                @click.prevent="handleAnchor(anchorItem.id)"
              >
                <i :class="anchorItem.iconClass"></i>
                <p>{{ anchorItem.label }}</p>
              </a>
            </div>
          </div>
          <div class="anchor-item">
            <a href="javascript:;" @click.prevent="handleAnchor('top')">
              <i class="el-icon-caret-top"></i>
              <p>返回顶部</p>
            </a>
          </div>
        </div>
      </div>

      <!-- 右侧表单区域 -->
      <div :class="[{ 'con-form': showAnchor }]">
        <hd-pane fit v-loading="submitting" :id="formId">
          <el-form
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-width="0"
          >
            <hd-component :model="extendData" ref="componentRef">
              <biz-form-card title="表单数据" :id="anchorList[0].id">
                <biz-form>
                  <biz-form-row>
                    <biz-form-item
                      v-for="field in formFields"
                      :key="field.prop"
                      :label="formatLabel(field.label)"
                      :required="field.required"
                      :span="field.span"
                      :pClass="field.pClass || 'p-divs'"
                    >
                      <el-form-item :prop="field.prop" :rules="field.rules">
                        <!-- input 文本框 -->
                        <el-input
                          v-if="field.type === 'input'"
                          v-model="formData[field.prop]"
                          :placeholder="
                            field.config.placeholder || `请输入${field.label}`
                          "
                          :maxlength="field.config.maxlength"
                          clearable
                        />

                        <!-- textarea 文本域 -->
                        <el-input
                          v-else-if="field.type === 'textarea'"
                          v-model="formData[field.prop]"
                          type="textarea"
                          :autosize="{ minRows: 3, maxRows: 10 }"
                          :placeholder="
                            field.config.placeholder || `请输入${field.label}`
                          "
                          :maxlength="field.config.maxlength"
                          clearable
                        />

                        <!-- number 数字输入框 -->
                        <hd-input-number
                          v-else-if="field.type === 'number'"
                          v-model="formData[field.prop]"
                          :min="field.config.min || 0"
                          :max="field.config.max || 9999999"
                          :precision="field.config.precision"
                          controls-position="right"
                          :placeholder="
                            field.config.placeholder || `请输入${field.label}`
                          "
                          style="width: 100%"
                        />

                        <!-- select 下拉选择 -->
                        <hd-dict-select
                          v-else-if="field.type === 'select'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :dict-code="field.config.dictCode || field.dicType"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- select 下拉选择 -->
                        <hd-organ
                          v-else-if="field.type === 'organ'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- radio 单选框 -->
                        <hd-dict-radio
                          v-else-if="field.type === 'radio'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :dict-code="field.config.dictCode || field.dicType"
                        />

                        <!-- checkbox 多选框 -->
                        <hd-dict-checkbox
                          v-else-if="field.type === 'checkbox'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :dict-code="field.config.dictCode || field.dicType"
                        />

                        <!-- date 日期选择 -->
                        <hd-date-picker
                          v-else-if="field.type === 'date'"
                          v-model="formData[field.prop]"
                          type="date"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- datetime 日期时间选择 -->
                        <hd-date-picker
                          v-else-if="field.type === 'datetime'"
                          v-model="formData[field.prop]"
                          type="datetime"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- daterange 日期范围 -->
                        <hd-date-range-picker
                          v-else-if="field.type === 'daterange'"
                          v-model="formData[field.prop]"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- 默认:文本框 -->
                        <el-input
                          v-else
                          v-model="formData[field.prop]"
                          :placeholder="
                            field.config.placeholder || `请输入${field.label}`
                          "
                          clearable
                        />
                      </el-form-item>
                    </biz-form-item>
                  </biz-form-row>
                </biz-form>
              </biz-form-card>
            </hd-component>
          </el-form>
        </hd-pane>
      </div>
    </div>

    <span slot="footer" class="hdty-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleSave">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { hdForm } from "@/utils/util-framework";
import anchorScroll from "@/views/global/mixin/anchorScroll.js";
import { dynamicFormAdd, dynamicFormEdit } from "../api/index";

export default {
  name: "DetailFormDialog",
  mixins: [hdForm, anchorScroll],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: "add", // add | edit
      validator: (val) => ["add", "edit"].includes(val)
    },
    formConfig: Object,
    ywFormId: String,
    orgId: String,
    columnProp: String,
    currentRow: Object,
    showAnchor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 表单字段
      formFields: [],
      // 表单数据
      formData: {},
      // 扩展数据
      extendData: {},
      // 验证规则
      rules: {},
      // 提交状态
      submitting: false,
      // 表单ID
      formId: "form" + this.$utilStr.uuid(32),
      // 锚点相关
      anchorIds: [],
      activeAnchor: "",
      clickAnchor: false,
      anchorList: [
        {
          label: "表单数据",
          id: "ref" + this.$utilStr.uuid(32),
          iconClass: "el-icon-edit",
          show: true
        }
      ]
    };
  },
  computed: {
    dialogTitle() {
      return this.mode === "add"
        ? `${this.formConfig ? this.formConfig.formName : ""}-新增`
        : `${this.formConfig ? this.formConfig.formName : ""}-编辑`;
    },
    // 将表单字段按行分组(动态根据span计算)
    formFieldsRows() {
      const rows = [];
      let currentRow = [];
      let currentSpan = 0;

      console.log("formFieldsRows", formFieldsRows);

      this.formFields.forEach((field) => {
        const fieldSpan = field.span || 12;

        // 如果当前行加上这个字段会超过24,或者字段span=24则新起一行
        if (currentSpan + fieldSpan > 24 || fieldSpan === 24) {
          if (currentRow.length > 0) {
            rows.push(currentRow);
          }
          currentRow = [field];
          currentSpan = fieldSpan;
        } else {
          currentRow.push(field);
          currentSpan += fieldSpan;
        }
      });

      // 添加最后一行
      if (currentRow.length > 0) {
        rows.push(currentRow);
      }

      return rows;
    }
  },
  watch: {
    formConfig: {
      handler(val) {
        if (val) {
          this.parseFormConfig();
        }
      },
      immediate: true
    },
    currentRow: {
      handler(val) {
        this.formData = { ...val };
      },
      immediate: true
    },
    visible(val) {
      if (val) {
        // 重置表单数据
        this.formData = { ...this.currentRow };
        this.updateAnchorList();
        this.$nextTick(() => {
          this.initScrollBox();
        });
      }
    }
  },
  methods: {
    // 解析表单配置
    parseFormConfig() {
      if (!this.formConfig || !this.formConfig.formItemList) {
        return;
      }

      const items = this.formConfig.formItemList;

      // 解析每个表单项的配置
      const parsedItems = items.map((item) => {
        const config = this.parseConfig(item.itemConfig);
        return {
          ...item,
          config
        };
      });

      // 构建表单字段(showInForm=true)
      this.formFields = parsedItems
        .filter((item) => item.config.display?.showInForm !== false) // 默认显示
        .map((item) => this.convertToFormField(item));
    },

    // 转换为表单字段配置
    convertToFormField(item) {
      const config = item.config;
      const displayConfig = config.display || {};
      const layoutConfig = config.layout || {};
      const validationConfig = config.validation || {};
      const componentProps = config.componentProps || {};

      // 从配置中动态获取span,默认12(一行两个)
      const span = layoutConfig.span || 12;

      console.log("转换为表单字段配置", item);

      // 构建验证规则
      let rules = [];

      // 必填验证
      if (validationConfig.required) {
        rules.push({
          required: true,
          message: validationConfig.message || `${item.itemLabel}不能为空`,
          trigger: validationConfig.trigger || "blur"
        });
      }

      // 自定义校验规则
      if (validationConfig.validator) {
        let customValidator = validationConfig.validator;

        // 获取校验函数
        if (this.$utilValidate && this.$utilValidate[customValidator]) {
          rules.push({
            validator: this.$utilValidate[customValidator],
            trigger: validationConfig.trigger || "blur"
          });
        }
      }

      return {
        prop: item.itemProp,
        label: item.itemLabel,
        type: item.itemType,
        dicType: item.dicType, // 保留字典类型
        span: span,
        required: validationConfig.required || false,
        config: {
          placeholder: config.placeholder,
          dictCode: componentProps.dictCode,
          maxlength: componentProps.maxlength,
          rows: componentProps.rows,
          min: componentProps.min,
          max: componentProps.max,
          precision: componentProps.precision,
          // 保留其他配置
          ...componentProps
        },
        // 验证规则
        rules: rules
      };
    },

    // 解析配置JSON
    parseConfig(configStr) {
      try {
        return typeof configStr === "string"
          ? JSON.parse(configStr)
          : configStr || {};
      } catch {
        return {};
      }
    },

    // 保存
    async handleSave() {
      // 表单验证
      try {
        await this.$refs.formRef.validate();
      } catch (error) {
        return;
      }

      const formData = { ...this.formData };

      this.submitting = true;
      try {
        // 构建提交数据
        const tableKey = this.formConfig?.formConfigObj?.tableKey; // 从配置中获取表键
        const submitData = {
          formId: this.ywFormId,
          formData: formData // 表单数据作为独立字段
        };

        // 如果是编辑模式，添加记录ID
        if (this.mode === "edit" && this.currentRow.id) {
          submitData.id = this.currentRow.id;
        }

        // 调用对应的API
        const response =
          this.mode === "add"
            ? await dynamicFormAdd(submitData)
            : await dynamicFormEdit(submitData);

        if (response.data.success) {
          this.$message.success(this.mode === "add" ? "新增成功" : "编辑成功");
          this.$emit("save-success");
        } else {
          this.$message.error(response.data.msg || "保存失败");
        }
      } catch (error) {
        console.error("保存失败:", error);
        this.$message.error("保存失败");
      } finally {
        this.submitting = false;
      }
    },

    // 关闭
    handleClose() {
      this.$emit("update:visible", false);
    },

    // 更新锚点列表
    updateAnchorList() {
      this.anchorIds = this.anchorList
        .filter((item) => item.show)
        .map((item) => item.id);
      this.activeAnchor = this.anchorIds[0];
    },

    // label动态格式化处理
    formatLabel(label) {
      if (!label) return label;

      const len = label.length;
      if (len === 2) {
        // 2个字：中间加&emsp;&emsp;(两个全角空格)
        return label[0] + "&emsp;&emsp;" + label[1];
      } else if (len === 3) {
        // 3个字：每两个字间加&ensp;(一个半角空格)
        return label[0] + "&ensp;" + label[1] + "&ensp;" + label[2];
      }
      // 其余情况返回原label
      return label;
    }
  }
};
</script>

<style lang="scss" scoped></style>
