<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    custom-class="hdty-dialog-medium new-form"
    @close="handleClose"
  >
    <!-- 明细列表视图 -->
    <detail-list-view
      v-if="visible"
      ref="listView"
      :form-config="formConfig"
      :yw-form-id="formId"
      :org-id="orgId"
      :column-prop="columnProp"
      :init-params="mappedParams"
      @add="handleAdd"
      @edit="handleEdit"
      @detail="handleDetail"
      @delete="handleDelete"
      @refresh="handleRefresh"
    />

    <!-- 新增/编辑表单弹窗 -->
    <detail-form-dialog
      v-if="visible"
      ref="formDialogRef"
      :form-config="formConfig"
      :yw-form-id="formId"
      :org-id="orgId"
      :column-prop="columnProp"
      @save-success="handleSaveSuccess"
    />

    <!-- 详情弹窗 -->
    <detail-detail-view
      v-if="visible"
      ref="detailViewRef"
      :form-config="formConfig"
      :yw-form-id="formId"
    />
  </el-dialog>
</template>

<script>
import DetailListView from "./DetailListView";
import DetailFormDialog from "./DetailFormDialog";
import DetailDetailView from "./DetailDetailView";
import { formInfo } from "../../config/form/api";

export default {
  name: "DetailDialog",
  components: {
    DetailListView,
    DetailFormDialog,
    DetailDetailView
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formId: String,
    orgId: String,
    columnProp: String,
    // 初始参数（包含query和row）
    initParams: {
      type: Object,
      default: () => ({ query: {}, row: {} })
    },
    // 统计列表的查询参数（兼容旧版本）
    queryParams: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      // 表单配置
      formConfig: null,
      // 映射后的参数
      mappedParams: {}
    };
  },
  computed: {
    dialogTitle() {
      return (this.formConfig && this.formConfig.formName) || "明细数据";
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
      } else {
        this.reset();
      }
    }
  },
  methods: {
    async init() {
      try {
        // 加载表单配置
        await this.loadFormConfig();
        // 执行参数映射
        this.executeParamMapping();
      } catch (error) {
        console.error("初始化失败:", error);
        this.$message.error("加载配置失败");
      }
    },

    // 加载表单配置
    async loadFormConfig() {
      if (!this.formId) {
        throw new Error("缺少formId参数");
      }

      const response = await formInfo({ id: this.formId });
      const { success, data } = response.data;
      if (success) {
        // 解析formConfig
        const formConfigObj = this.parseConfig(data.formInfo.formConfig);

        this.formConfig = {
          ...data.formInfo,
          formConfigObj, // 解析后的配置对象
          formItemList: data.formItemList || [] // 表单项列表
        };
      } else {
        throw new Error("加载表单配置失败");
      }
    },

    // 执行参数映射
    executeParamMapping() {
      console.log("执行参数映射");

      console.log(this.formConfig);

      if (!this.formConfig || !this.formConfig.formConfigObj) {
        this.mappedParams = {};
        return;
      }

      const paramMapping = this.formConfig.formConfigObj.paramMapping;

      // 未配置参数映射，直接返回空对象
      if (!paramMapping || !paramMapping.enabled || !paramMapping.mappings) {
        this.mappedParams = {};
        return;
      }

      const mappedParams = {};
      const { query = {}, row = {} } = this.initParams;

      // 按优先级排序映射规则
      const sortedMappings = [...paramMapping.mappings].sort((a, b) => {
        const priorityA = a.priority || 0;
        const priorityB = b.priority || 0;
        if (priorityA !== priorityB) {
          return priorityB - priorityA; // 降序，优先级高的在前
        }
        // 优先级相同时，row类型优先于query类型
        if (a.sourceType === "row" && b.sourceType === "query") {
          return -1;
        }
        if (a.sourceType === "query" && b.sourceType === "row") {
          return 1;
        }
        return 0;
      });

      // 执行映射
      sortedMappings.forEach((mapping) => {
        const { sourceType, sourceProp, targetProp, required } = mapping;
        let sourceValue = null;

        // 获取源值
        if (sourceType === "query") {
          sourceValue = query[sourceProp];
        } else if (sourceType === "row") {
          sourceValue = row[sourceProp];
        }

        // 如果值存在，或者必填，则设置目标值
        if (
          sourceValue !== undefined &&
          sourceValue !== null &&
          sourceValue !== ""
        ) {
          mappedParams[targetProp] = sourceValue;
        } else if (required) {
          // 必填但没有值，记录警告
          console.warn(
            `参数映射失败: ${sourceType}.${sourceProp} -> ${targetProp} (必填参数缺失)`
          );
        }
      });

      console.log("参数映射结果:", {
        原始参数: this.initParams,
        映射规则: paramMapping.mappings,
        映射后: mappedParams
      });

      this.mappedParams = mappedParams;

      if (this.$refs.listView) {
        this.$refs.listView.beforeLoadForm();
      }
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

    // 新增
    handleAdd() {
      this.$refs.formDialogRef.visible = true;
      this.$refs.formDialogRef.mode = "add";
      this.$refs.formDialogRef.currentRow = {};
      this.$nextTick(() => {
        this.$refs.formDialogRef.beforeLoadForm();
      });
    },

    // 编辑
    handleEdit(row) {
      this.$refs.formDialogRef.visible = true;
      this.$refs.formDialogRef.mode = "edit";
      this.$refs.formDialogRef.currentRow = { ...row };
      this.$nextTick(() => {
        this.$refs.formDialogRef.beforeLoadForm();
      });
    },

    // 详情
    handleDetail(row) {
      this.$refs.detailViewRef.visible = true;
      this.$refs.detailViewRef.currentRow = { ...row };
      this.$nextTick(() => {
        this.$refs.detailViewRef.beforeLoadForm();
      });
    },

    // 删除
    handleDelete(row) {
      // 委托给列表视图处理
      this.$refs.listView.handleDelete(row);
    },

    // 保存成功后刷新列表
    handleSaveSuccess() {
      this.$refs.listView &&
        this.$refs.listView.refreshData &&
        this.$refs.listView.refreshData();
      this.$emit("refresh");
    },

    // 刷新
    handleRefresh() {
      this.$emit("refresh");
    },

    // 关闭弹窗
    handleClose() {
      this.$emit("update:visible", false);
    },

    // 重置
    reset() {
      this.formConfig = null;
    }
  }
};
</script>

<style lang="scss" scoped>
// Dialog样式
::v-deep .el-dialog__body {
  padding: 10px 20px;
}
</style>
