<template>
  <div class="dynamic-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      row-key="id"
      border
      stripe
      fit
      height="100%"
      :empty-text="emptyText"
      @sort-change="handleSortChange"
    >
      <!-- 多选列（可选） -->
      <el-table-column
        v-if="showSelection"
        fixed
        type="selection"
        reserve-selection
        align="center"
        width="50"
      />

      <!-- 序号列 -->
      <el-table-column
        fixed
        type="index"
        :index="setIndex"
        label="序号"
        class-name="is-index"
        align="center"
        width="60"
      />

      <!-- 数据列（动态渲染） -->
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || 'left'"
        :sortable="column.sortable"
        :show-overflow-tooltip="column.showOverflowTooltip !== false"
      >
        <template slot-scope="scope">
          <slot
            :name="`column-${column.prop}`"
            :row="scope.row"
            :column="column"
          >
            {{ formatValue(scope.row[column.prop], column) }}
          </slot>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column
        v-if="showOperation"
        fixed="right"
        label="操作"
        align="center"
        width="200"
      >
        <template slot-scope="scope">
          <hd-button-container>
            <hd-button
              v-if="showDetail"
              name="detail"
              type="info"
              size="mini"
              @click="handleDetail(scope.row)"
            >
              详情
            </hd-button>
            <hd-button
              v-if="showEdit"
              name="edit"
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >
              编辑
            </hd-button>
            <hd-button
              v-if="showDelete"
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
</template>

<script>
export default {
  name: "DynamicTable",
  props: {
    // 列配置
    columns: {
      type: Array,
      default: () => []
    },
    // 表格数据
    data: {
      type: Array,
      default: () => []
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false
    },
    // 是否显示多选列
    showSelection: {
      type: Boolean,
      default: false
    },
    // 是否显示操作列
    showOperation: {
      type: Boolean,
      default: false
    },
    // 是否显示详情按钮
    showDetail: {
      type: Boolean,
      default: true
    },
    // 是否显示编辑按钮
    showEdit: {
      type: Boolean,
      default: true
    },
    // 是否显示删除按钮
    showDelete: {
      type: Boolean,
      default: true
    },
    // 分页配置（用于计算序号）
    pagination: {
      type: Object,
      default: () => ({
        current: 1,
        pageSize: 20
      })
    }
  },
  data() {
    return {
      emptyText: "暂无数据"
    };
  },
  methods: {
    // 设置序号（支持分页）
    setIndex(index) {
      const { current = 1, pageSize = 20 } = this.pagination;
      return (current - 1) * pageSize + index + 1;
    },

    // 格式化值
    formatValue(value, column) {
      if (value === null || value === undefined || value === "") {
        return "-";
      }

      // TODO: 根据列配置格式化值
      // 例如:日期格式化、数字格式化、字典翻译等
      const { format } = column;

      if (format === "date") {
        // 日期格式化
        return this.$utilDate?.dateFtt(value, "yyyy-MM-dd") || value;
      } else if (format === "datetime") {
        // 日期时间格式化
        return this.$utilDate?.dateFtt(value, "yyyy-MM-dd HH:mm:ss") || value;
      } else if (format === "number") {
        // 数字格式化
        return Number(value).toLocaleString();
      }

      return value;
    },

    // 排序变化
    handleSortChange({ column, prop, order }) {
      this.$emit("sort-change", { column, prop, order });
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
    handleDelete(row) {
      this.$emit("delete", row);
    },

    // 刷新表格布局
    doLayout() {
      this.$nextTick(() => {
        this.$refs.tableRef?.doLayout();
      });
    },

    // 获取选中行
    getSelection() {
      return this.$refs.tableRef?.selection || [];
    },

    // 清空选中
    clearSelection() {
      this.$refs.tableRef?.clearSelection();
    }
  }
};
</script>

<style lang="scss" scoped>
// 表格组件样式继承自 el-table，无需额外样式
</style>
