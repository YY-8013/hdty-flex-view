<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    custom-class="hdty-dialog-medium new-form"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 明细列表视图 -->
    <detail-list-view
      ref="listView"
      :form-config="formConfig"
      :yw-form-id="formId"
      :org-id="orgId"
      :column-prop="columnProp"
      @add="handleAdd"
      @edit="handleEdit"
      @detail="handleDetail"
      @delete="handleDelete"
      @refresh="handleRefresh"
    />

    <!-- 新增/编辑表单弹窗 -->
    <detail-form-dialog
      :visible.sync="editVisible"
      :mode="editMode"
      :form-config="formConfig"
      :yw-form-id="formId"
      :org-id="orgId"
      :column-prop="columnProp"
      :current-row="currentRow"
      @save-success="handleSaveSuccess"
    />

    <!-- 详情弹窗 -->
    <detail-detail-view
      :visible.sync="detailVisible"
      :form-config="formConfig"
      :yw-form-id="formId"
      :current-row="currentRow"
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
    columnProp: String
  },
  data() {
    return {
      // 表单配置
      formConfig: null,

      // 编辑状态
      editVisible: false,
      editMode: "add", // add | edit
      currentRow: {},

      // 详情状态
      detailVisible: false
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
      this.editMode = "add";
      this.currentRow = {};
      this.editVisible = true;
    },

    // 编辑
    handleEdit(row) {
      this.editMode = "edit";
      this.currentRow = { ...row };
      this.editVisible = true;
    },

    // 详情
    handleDetail(row) {
      this.currentRow = { ...row };
      this.detailVisible = true;
    },

    // 删除
    handleDelete(row) {
      // 委托给列表视图处理
      this.$refs.listView.handleDelete(row);
    },

    // 保存成功后刷新列表
    handleSaveSuccess() {
      this.editVisible = false;
      this.$refs.listView?.refreshData();
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
      this.currentRow = {};
      this.editVisible = false;
      this.detailVisible = false;
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
