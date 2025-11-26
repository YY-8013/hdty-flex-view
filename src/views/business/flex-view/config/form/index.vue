<template>
  <div class="hdty-container hdty-flex">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <el-form ref="queryRef" :model="queryData" inline>
        <el-form-item label="表单名称" prop="formName">
          <el-input
            v-model="queryData.formName"
            placeholder="请输入表单名称"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <hd-button-container>
            <hd-button name="query" type="info" @click="handleQuery">
              查询
            </hd-button>
            <hd-button @click="handleClear">清空</hd-button>
            <hd-button name="add" type="success" @click="handleAdd">
              新增
            </hd-button>
          </hd-button-container>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格区域 -->
    <div class="hdty-fit">
      <el-table
        ref="tableRef"
        v-loading="loading"
        :data="tableData"
        row-key="id"
        border
        stripe
        fit
        height="100%"
      >
        <el-table-column type="index" label="序号" align="center" width="60" />

        <el-table-column
          prop="formName"
          label="表单名称"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column
          prop="formCode"
          label="表单编码"
          min-width="150"
          show-overflow-tooltip
        />

        <el-table-column
          prop="formDesc"
          label="表单描述"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column label="操作" align="center" width="210" fixed="right">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="edit"
                type="primary"
                size="mini"
                @click="handleEdit(scope.row)"
              >
                编辑
              </hd-button>
              <hd-button
                name="delete"
                type="danger"
                size="mini"
                @click="handleDelete(scope.row)"
              >
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="hdty-footer">
      <el-pagination
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        :page-sizes="[20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "ViewFormList",
  data() {
    return {
      queryData: {
        formName: ""
      },
      tableData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 20,
        total: 0
      }
    };
  },
  created() {
    this.loadList();
  },
  methods: {
    // 加载列表
    async loadList() {
      this.loading = true;
      try {
        // TODO: 从后端加载表单配置列表
        this.tableData = [];
      } finally {
        this.loading = false;
      }
    },

    // 查询
    handleQuery() {
      this.pagination.current = 1;
      this.loadList();
    },

    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.queryData = { formName: "" };
    },

    // 新增
    handleAdd() {
      // 跳转到表单编辑页
      this.$router.push({
        path: "/flex-view/config/form/edit",
        query: { mode: "add" }
      });
    },

    // 编辑
    handleEdit(row) {
      // 跳转到表单编辑页
      this.$router.push({
        path: "/flex-view/config/form/edit",
        query: { mode: "edit", id: row.id }
      });
    },

    // 删除
    async handleDelete(row) {
      try {
        await this.$confirm("确定删除该表单配置?", "提示", {
          type: "warning"
        });

        // TODO: 删除表单配置
        this.$message.success("删除成功");
        this.loadList();
      } catch (error) {
        if (error !== "cancel") {
          this.$message.error("删除失败");
        }
      }
    },

    // 分页切换
    handlePageChange(page) {
      this.pagination.current = page;
      this.loadList();
    },

    // 每页条数切换
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.current = 1;
      this.loadList();
    }
  }
};
</script>

<style lang="scss" scoped>
// 使用标准三段式布局，无需额外样式
</style>
