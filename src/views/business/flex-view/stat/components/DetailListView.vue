<template>
  <div class="hdty-container hdty-flex detail-list-view">
    <!-- 查询条件 -->
    <div class="hdty-header">
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

    <!-- 明细列表 -->
    <div class="hdty-fit">
      <dynamic-table
        :columns="detailColumns"
        :data="detailData"
        :loading="loading"
        :show-operation="true"
        @detail="handleDetail"
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
</template>

<script>
import DynamicTable from "../../components/common/DynamicTable/index.vue";
import DynamicForm from "../../components/common/DynamicForm/index.vue";
import request from "@/config/axios-init";

export default {
  name: "DetailListView",
  components: {
    DynamicTable,
    DynamicForm
  },
  props: {
    formConfig: Object,
    ywFormId: String,
    orgId: String,
    columnProp: String
  },
  data() {
    return {
      // 表单项配置
      queryFields: [],
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

      // 查询参数
      queryParams: {}
    };
  },
  watch: {
    formConfig: {
      handler(val) {
        if (val) {
          this.parseFormConfig();
          this.loadData();
        }
      },
      immediate: true
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

      console.log("parsedItems", parsedItems);

      // 构建查询字段(showInQuery=true)
      this.queryFields = parsedItems
        .filter((item) => item.config.display?.showInQuery === true)
        .map((item) => this.convertToFormField(item));

      // 构建列表列(showInList=true)
      this.detailColumns = parsedItems
        .filter((item) => item.config.display?.showInList === true)
        .map((item) => this.convertToColumn(item));
    },

    // 转换为表单字段配置
    convertToFormField(item) {
      const config = item.config;
      const displayConfig = config.display || {};
      const layoutConfig = config.layout || {};
      const validationConfig = config.validation || {};
      const componentProps = config.componentProps || {};

      return {
        prop: item.itemProp,
        label: item.itemLabel,
        type: item.itemType,
        span: layoutConfig.span || 8, // 查询区域默认一行3个
        required: false, // 查询条件不必填
        config: {
          ...config,
          placeholder: config.placeholder || `请输入${item.itemLabel}`,
          dictCode: item.dicType || componentProps.dictCode
        }
      };
    },

    // 转换为列配置
    convertToColumn(item) {
      const config = item.config;
      const displayConfig = config.display || {};

      return {
        ...item,
        ...config,
        prop: item.itemProp,
        label: item.itemLabel,
        width: displayConfig.columnWidth || undefined,
        minWidth: displayConfig.columnMinWidth || undefined,
        align: displayConfig.align || "center",
        sortable: displayConfig.sortable || false,
        showOverflowTooltip: displayConfig.showOverflowTooltip !== false
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

    // 加载明细数据
    async loadData() {
      if (!this.ywFormId) return;

      this.loading = true;
      try {
        const params = {
          formId: this.ywFormId,
          orgId: this.orgId,
          columnProp: this.columnProp,
          ...this.queryParams,
          current: this.pagination.current,
          size: this.pagination.pageSize
        };
        return false;

        const response = await request({
          url: "/web/sjls/detailData/page",
          method: "post",
          data: params
        });

        if (response.data.success) {
          this.detailData = response.data.data.records || [];
          this.pagination.total = response.data.data.total || 0;
        }
      } catch (error) {
        console.error("加载明细数据失败:", error);
        this.$message.error("加载数据失败");
      } finally {
        this.loading = false;
      }
    },

    // 查询
    handleQuery() {
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
      this.$emit("add");
    },

    // 详情
    handleDetail(row) {
      this.$emit("detail", row);
    },

    // 编辑
    handleEdit(row) {
      this.$emit("edit", row);
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm("确定删除该数据?", "提示", {
          type: "warning"
        });

        const response = await request({
          url: "/web/sjls/detailData/delete",
          method: "post",
          data: { id: row.id }
        });

        if (response.data.success) {
          this.$message.success("删除成功");
          this.loadData();
          this.$emit("refresh");
        } else {
          this.$message.error(response.data.msg || "删除失败");
        }
      } catch (error) {
        if (error !== "cancel") {
          console.error("删除失败:", error);
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

    // 刷新数据
    refreshData() {
      this.loadData();
    }
  }
};
</script>

<style lang="scss" scoped>
.detail-list-view {
  min-height: 500px;
  max-height: 70vh;

  ::v-deep .hdty-header {
    padding: 15px 0;
  }

  ::v-deep .hdty-footer {
    padding: 10px 0;
    text-align: center;

    .el-pagination {
      text-align: center;
    }
  }
}
</style>
