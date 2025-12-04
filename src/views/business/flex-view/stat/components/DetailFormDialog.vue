<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
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
        <hd-pane fit v-loading="submitting || loading" :id="formId">
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
                          :maxlength="field.componentProps.maxlength"
                          :disabled="field.componentProps.disabled"
                          :readonly="field.componentProps.readonly"
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
                          :maxlength="field.componentProps.maxlength"
                          clearable
                        />

                        <!-- number 数字输入框 -->
                        <hd-input-number
                          v-else-if="field.type === 'number'"
                          v-model="formData[field.prop]"
                          :min="field.componentProps.min || 0"
                          :max="field.componentProps.max || 9999999"
                          :precision="field.componentProps.precision"
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
                          :dict-code="
                            field.componentProps.dictCode || field.dicType
                          "
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          clearable
                        />

                        <!-- organ 机构选择 -->
                        <hd-organ
                          v-else-if="field.type === 'organ'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :placeholder="
                            field.config.placeholder || `请选择${field.label}`
                          "
                          :multiple="field.componentProps.multiple || false"
                          :filter-code="field.componentProps.filterCode || ''"
                          :show-level="field.componentProps.showLevel || ''"
                          :check-level="field.componentProps.checkLevel || ''"
                          :check-final-level="
                            field.componentProps.checkFinalLevel || false
                          "
                          :clearable="
                            !(field.componentProps.clearable === false)
                          "
                        />

                        <!-- radio 单选框 -->
                        <hd-dict-radio
                          v-else-if="field.type === 'radio'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :dict-code="
                            field.componentProps.dictCode || field.dicType
                          "
                        />

                        <!-- checkbox 多选框 -->
                        <hd-dict-checkbox
                          v-else-if="field.type === 'checkbox'"
                          v-model="formData[field.prop]"
                          :model-text.sync="extendData[field.prop]"
                          :dict-code="
                            field.componentProps.dictCode || field.dicType
                          "
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
import {
  dynamicFormAdd,
  dynamicFormEdit,
  dynamicFormDetail
} from "../api/index";

export default {
  name: "DetailFormDialog",
  mixins: [hdForm, anchorScroll],
  props: {
    formConfig: Object,
    ywFormId: String,
    orgId: String,
    columnProp: String,
    showAnchor: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 弹窗显示控制
      visible: false,
      // 模式：add | edit
      mode: "add",
      // 当前行数据
      currentRow: {},
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
      // 加载状态
      loading: false,
      // 表单ID
      formId: "form" + this.$utilStr.uuid(32),
      // 锁点相关
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
      ],
      // 标志位：是否正在初始化表单数据
      isInitializing: false
    };
  },
  computed: {
    dialogTitle() {
      return this.mode === "add"
        ? `${this.formConfig ? this.formConfig.formName : ""}-新增`
        : `${this.formConfig ? this.formConfig.formName : ""}-编辑`;
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
    // 监听 formData 的变化，触发计算字段更新
    formData: {
      handler(val) {
        // 跳过初始化阶段的 watch 触发
        if (this.isInitializing) {
          return;
        }
        // 当表单数据变化时，更新计算字段
        this.updateComputedFields();
      },
      deep: true
    }
  },
  methods: {
    // 加载前初始化
    beforeLoadForm() {
      this.updateAnchorList();
      this.$nextTick(() => {
        this.initScrollBox();
        // 编辑模式下加载详情数据
        if (this.mode === "edit") {
          this.loadDetailForEdit();
        } else {
          // 新增模式初始化表单数据
          this.initFormData();
        }
        // 延迟清除初始校验提示
        this.$nextTick(() => {
          this.$refs.formRef?.clearValidate();
        });
      });
    },

    // 初始化表单数据（新增模式）
    initFormData() {
      // 如果 formFields 还没初始化，等待下一个 tick
      if (!this.formFields || this.formFields.length === 0) {
        this.$nextTick(() => {
          this.initFormData();
        });
        return;
      }

      // 设置初始化标志位
      this.isInitializing = true;

      // 先构建完整的数据对象，然后一次性赋值
      const newFormData = {};
      const newExtendData = {};

      // 遍历所有字段，构建数据对象
      this.formFields.forEach((field) => {
        const prop = field.prop;
        const config = field.config;
        const defaultValueType = config.defaultValueType;
        const defaultValue = config.defaultValue;

        // 处理默认值类型
        if (defaultValueType === "today") {
          const today = new Date();
          const yyyy = today.getFullYear();
          const mm = String(today.getMonth() + 1).padStart(2, "0");
          const dd = String(today.getDate()).padStart(2, "0");
          newFormData[prop] = `${yyyy}${mm}${dd}`;
        } else if (defaultValue && defaultValue !== "") {
          newFormData[prop] = defaultValue;
        } else {
          newFormData[prop] = "";
        }
      });

      // 一次性赋值整个对象
      this.formData = this.$utilStr.deepClone(newFormData);
      this.extendData = newExtendData;

      // 初始化完成后，释放标志位，并手动触发一次计算
      this.$nextTick(() => {
        this.isInitializing = false;
        this.updateComputedFields();
      });
    },

    // 编辑模式下加载详情数据
    async loadDetailForEdit() {
      if (!this.currentRow || !this.currentRow.vo || !this.currentRow.vo.id) {
        return;
      }

      this.loading = true;
      try {
        const response = await dynamicFormDetail({
          id: this.currentRow.vo.id,
          formId: this.ywFormId
        });

        if (response.data.success) {
          let detailData = response.data.data || { vo: {}, vox: {} };

          // 只映射可编辑的字段
          this.formData = {};
          this.extendData = {};

          this.formFields.forEach((field) => {
            const prop = field.prop;
            const keyType = field.keyType;

            // 先初始化为空值，确保响应式
            this.$set(this.formData, prop, "");

            // 从 vo 中获取原始值
            if (
              detailData &&
              detailData.vo &&
              detailData.vo[prop] !== undefined
            ) {
              this.$set(this.formData, prop, detailData.vo[prop]);
            }

            // 如果是 org、region、dict、date 类型,从 vox 中获取翻译值
            if (["org", "region", "dict"].includes(keyType)) {
              if (
                detailData &&
                detailData.vox &&
                detailData.vox[prop] !== undefined
              ) {
                this.$set(this.extendData, prop, detailData.vox[prop]);
              }
            }
          });
        }
      } catch (error) {
        console.error("加载详情失败:", error);
      } finally {
        this.loading = false;
      }
    },

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
        .filter((item) =>
          item.config && item.config.display
            ? item.config.display.showInForm !== false
            : true
        )
        .map((item) => this.convertToFormField(item));
    },

    // 转换为表单字段配置
    convertToFormField(item) {
      const config = item.config;
      const displayConfig = config.display || {};
      const layoutConfig = config.layout || {};
      const validationConfig = config.validation || {};
      const componentProps = config.componentProps || {};
      const computedConfig = config.computed || {};

      // 从配置中动态获取span,默认12(一行两个)
      const span = layoutConfig.span || 12;

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

      // 比较校验规则（字段间比较）
      if (validationConfig.compare) {
        const compareConfig = validationConfig.compare;
        rules.push({
          validator: (rule, value, callback) => {
            if (!value) {
              callback();
              return;
            }

            const currentValue = parseFloat(value);
            const compareValue =
              parseFloat(this.formData[compareConfig.field]) || 0;
            const compareType = compareConfig.type;
            const fieldLabel = compareConfig.fieldLabel || compareConfig.field;
            const currentLabel = item.itemLabel;

            let isValid = false;
            let operator = "";

            switch (compareType) {
              case "lt": // 小于
                isValid = currentValue < compareValue;
                operator = "小于";
                break;
              case "lte": // 小于等于
                isValid = currentValue <= compareValue;
                operator = "不大于";
                break;
              case "gt": // 大于
                isValid = currentValue > compareValue;
                operator = "大于";
                break;
              case "gte": // 大于等于
                isValid = currentValue >= compareValue;
                operator = "不小于";
                break;
              case "eq": // 等于
                isValid = currentValue === compareValue;
                operator = "等于";
                break;
              case "ne": // 不等于
                isValid = currentValue !== compareValue;
                operator = "不等于";
                break;
              default:
                isValid = true;
            }

            if (!isValid) {
              callback(new Error(`${currentLabel}应${operator}${fieldLabel}`));
            } else {
              callback();
            }
          },
          trigger: validationConfig.trigger || "blur"
        });
      }

      return {
        prop: item.itemProp,
        label: item.itemLabel,
        type: item.itemType,
        keyType: item.keyType,
        dicType: item.dicType,
        span: span,
        required: validationConfig.required || false,
        // 保留原始 config 结构
        config: config,
        // 暴露 componentProps 供模板使用
        componentProps: componentProps,
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
        const submitData = {
          formId: this.ywFormId,
          formData: formData // 表单数据作为独立字段
        };

        // 如果是编辑模式，添加记录ID
        if (
          this.mode === "edit" &&
          this.currentRow.vo &&
          this.currentRow.vo.id
        ) {
          submitData.id = this.currentRow.vo.id;
        }

        // 调用对应的API
        const response =
          this.mode === "add"
            ? await dynamicFormAdd(submitData)
            : await dynamicFormEdit(submitData);

        if (response.data.success) {
          this.$message.success(this.mode === "add" ? "新增成功" : "编辑成功");
          this.visible = false;
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
      this.visible = false;
      // 重置表单数据和校验状态
      this.$nextTick(() => {
        this.formData = {};
        this.extendData = {};
        this.$refs.formRef?.resetFields();
        this.$refs.formRef?.clearValidate();
      });
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
    },

    // 更新计算字段的值
    updateComputedFields() {
      // 临时标记：正在计算中，避免触发循环 watch
      const wasInitializing = this.isInitializing;
      this.isInitializing = true;

      this.formFields.forEach((field) => {
        if (field.config.computed && field.config.computed.enabled) {
          try {
            const computed = field.config.computed;
            let result = "";

            // 根据计算类型执行不同的计算逻辑
            if (computed.type === "percent") {
              // 百分比计算：(分子 / 分母 * 100).toFixed(precision) + "%"
              const numerator =
                parseFloat(this.formData[computed.numerator]) || 0;
              const denominator =
                parseFloat(this.formData[computed.denominator]) || 0;
              const precision = computed.precision || 2;

              if (denominator !== 0) {
                result =
                  ((numerator / denominator) * 100).toFixed(precision) + "%";
              } else {
                result = "0.00%";
              }
            } else if (computed.type === "sum") {
              // 求和：field1 + field2 + ...
              const fields = computed.fields || [];
              let sum = 0;
              fields.forEach((f) => {
                sum += parseFloat(this.formData[f]) || 0;
              });
              result = sum.toString();
            } else if (computed.type === "subtract") {
              // 相减：field1 - field2
              const field1 = parseFloat(this.formData[computed.field1]) || 0;
              const field2 = parseFloat(this.formData[computed.field2]) || 0;
              result = (field1 - field2).toString();
            } else if (computed.type === "multiply") {
              // 相乘：field1 * field2
              const field1 = parseFloat(this.formData[computed.field1]) || 0;
              const field2 = parseFloat(this.formData[computed.field2]) || 0;
              const precision = computed.precision || 2;
              result = (field1 * field2).toFixed(precision);
            } else if (computed.type === "divide") {
              // 相除：field1 / field2
              const field1 = parseFloat(this.formData[computed.field1]) || 0;
              const field2 = parseFloat(this.formData[computed.field2]) || 0;
              const precision = computed.precision || 2;

              if (field2 !== 0) {
                result = (field1 / field2).toFixed(precision);
              } else {
                result = "0";
              }
            }

            this.$set(this.formData, field.prop, result);
          } catch (error) {
            console.warn(`计算字段 ${field.prop} 出错:`, error);
          }
        }
      });

      // 恢复标志位
      this.isInitializing = wasInitializing;
    }
  }
};
</script>

<style lang="scss" scoped></style>
