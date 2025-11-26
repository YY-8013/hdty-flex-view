<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <div class="hdty-container hdty-flex detail-dialog-content">
      <!-- 查询条件（使用 DynamicForm 组件） -->
      <div class="hdty-header" v-if="queryFields.length > 0">
        <dynamic-form ref="queryForm" :form-items="queryFields" :inline="true">
          <template #footer>
            <hd-button-container>
              <hd-button name="query" type="info" @click="handleQuery">
                查询
              </hd-button>
              <hd-button @click="handleReset">清空</hd-button>
              <hd-button name="add" type="success" @click="handleAdd">
                新增
              </hd-button>
            </hd-button-container>
          </template>
        </dynamic-form>
      </div>

      <!-- 明细列表（使用 DynamicTable 组件） -->
      <div class="hdty-fit">
        <dynamic-table
          :columns="detailColumns"
          :data="detailData"
          :loading="loading"
          :show-operation="true"
          @edit="handleEdit"
          @delete="handleDelete"
        />
      </div>

      <!-- 分页 -->
      <div class="hdty-footer">
        <el-pagination
          :current-page="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>

    <!-- 新增/编辑表单弹窗 -->
    <el-dialog
      :title="editMode === 'add' ? '新增' : '编辑'"
      :visible.sync="editVisible"
      width="60%"
      append-to-body
      :close-on-click-modal="false"
    >
      <hd-pane fit v-loading="submitting">
        <dynamic-form
          ref="editForm"
          :form-items="formFields"
          :init-data="currentRow"
        >
          <template #footer>
            <hd-button-container>
              <hd-button @click="editVisible = false">取消</hd-button>
              <hd-button type="primary" @click="handleSave">保存</hd-button>
            </hd-button-container>
          </template>
        </dynamic-form>
      </hd-pane>
    </el-dialog>
  </el-dialog>
</template>

<script>
import DynamicTable from "../../components/common/DynamicTable";
import DynamicForm from "../../components/common/DynamicForm";

export default {
  name: "DetailDialog",
  components: {
    DynamicTable,
    DynamicForm
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
      formConfig: {},
      formFields: [],
      queryFields: [],

      // 明细列配置
      detailColumns: [],

      // 明细数据
      detailData: [],
      loading: false,

      // 分页
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      },

      // 编辑状态
      editVisible: false,
      editMode: "add", // add | edit
      currentRow: {},
      submitting: false,

      // 查询参数
      queryParams: {}
    };
  },
  computed: {
    dialogTitle() {
      // TODO: 从配置获取标题
      return `${this.orgId || ""} - ${this.columnProp || "明细数据"}`;
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.init();
      }
    }
  },
  methods: {
    async init() {
      // TODO: 初始化数据
      // 1. 加载表单配置
      // 2. 加载明细数据
    },

    // 加载表单配置
    async loadFormConfig() {
      // TODO: 从后端加载表单配置
    },

    // 加载明细数据
    async loadData() {
      // TODO: 加载明细数据
      this.loading = true;
      try {
        // 模拟数据
        this.detailData = [];
      } finally {
        this.loading = false;
      }
    },

    // 查询
    handleQuery() {
      // TODO: 获取查询参数并重新加载数据
      this.queryParams = this.$refs.queryForm?.getFormData() || {};
      this.pagination.current = 1;
      this.loadData();
    },

    // 重置
    handleReset() {
      this.$refs.queryForm?.resetFields();
      this.queryParams = {};
      this.pagination.current = 1;
      this.loadData();
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

    // 保存
    async handleSave() {
      // TODO: 保存数据
      const formData = this.$refs.editForm?.getFormData();
      if (!formData) return;

      this.submitting = true;
      try {
        // 保存数据
        this.$message.success("保存成功");
        this.editVisible = false;
        this.loadData();
        this.$emit("refresh");
      } catch (error) {
        this.$message.error("保存失败");
      } finally {
        this.submitting = false;
      }
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm("确定删除该数据?", "提示", {
          type: "warning"
        });

        // TODO: 删除数据
        this.$message.success("删除成功");
        this.loadData();
        this.$emit("refresh");
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
      }
    },

    // 分页切换
    handlePageChange(page) {
      this.pagination.current = page;
      this.loadData();
    },

    // 每页条数切换
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
      this.loadData();
    },

    // 关闭弹窗
    handleClose() {
      this.$emit("update:visible", false);
    }
  }
};
</script>

<style lang="scss" scoped>
// Dialog内容样式
.detail-dialog-content {
  min-height: 500px;
  max-height: 70vh;
}
</style>
