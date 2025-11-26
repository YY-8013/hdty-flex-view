<template>
  <div class="stat-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="data"
      border
      stripe
      fit
      height="100%"
      :empty-text="emptyText"
    >
      <!-- 序号列 -->
      <el-table-column
        fixed
        type="index"
        label="序号"
        class-name="is-index"
        align="center"
        width="60"
      />

      <!-- 固定列:机构 -->
      <el-table-column
        fixed
        prop="orgName"
        label="机构"
        align="left"
        min-width="200"
        show-overflow-tooltip
      />

      <!-- 动态列:从 columns 配置渲染 -->
      <template v-for="column in columns">
        <!-- 一级列（可能包含子列） -->
        <el-table-column
          v-if="!column.children || column.children.length === 0"
          :key="'col-' + column.prop"
          :prop="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align || 'center'"
          :fixed="column.fixed"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              :class="getCellClass(column, scope.row)"
              :style="getCellStyle(column, scope.row)"
              @click="handleCellClick(column, scope.row)"
            >
              {{ formatCellValue(scope.row[column.prop], column) }}
            </span>
          </template>
        </el-table-column>

        <!-- 多级表头 -->
        <el-table-column
          v-else
          :key="'group-' + column.prop"
          :label="column.label"
          :align="column.align || 'center'"
        >
          <!-- 二级列 -->
          <el-table-column
            v-for="child in column.children"
            :key="child.prop"
            :prop="child.prop"
            :label="child.label"
            :width="child.width"
            :min-width="child.minWidth"
            :align="child.align || 'center'"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span
                :class="getCellClass(child, scope.row)"
                :style="getCellStyle(child, scope.row)"
                @click="handleCellClick(child, scope.row)"
              >
                {{ formatCellValue(scope.row[child.prop], child) }}
              </span>
            </template>
          </el-table-column>
        </el-table-column>
      </template>

      <!-- 固定列:总计 -->
      <el-table-column
        fixed="right"
        prop="total"
        label="总计"
        align="center"
        width="100"
      >
        <template slot-scope="scope">
          <span class="total-cell">{{ scope.row.total || 0 }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "StatTable",
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      emptyText: "暂无数据"
    };
  },
  methods: {
    // 单元格点击
    handleCellClick(column, row) {
      // 只有可点击的列才触发事件
      if (column.formId) {
        this.$emit("cell-click", { column, row });
      }
    },

    // 获取单元格样式类
    getCellClass(column, row) {
      const classes = [];

      // 可点击的单元格
      if (column.formId) {
        classes.push("clickable-cell");
      }

      // TODO: 根据配置添加条件样式
      return classes.join(" ");
    },

    // 获取单元格样式
    getCellStyle(column, row) {
      const style = {};

      // TODO: 根据配置添加条件样式
      // 例如:根据数值范围设置颜色

      return style;
    },

    // 格式化单元格值
    formatCellValue(value, column) {
      if (value === null || value === undefined) {
        return "-";
      }

      // TODO: 根据列配置格式化数值
      // 例如:数字格式化、百分比、日期等

      return value;
    },

    // 刷新表格布局
    doLayout() {
      this.$nextTick(() => {
        this.$refs.tableRef?.doLayout();
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.stat-table {
  height: 100%;

  // 可点击的单元格
  ::v-deep .clickable-cell {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      opacity: 0.8;
    }
  }

  // 总计单元格
  ::v-deep .total-cell {
    font-weight: bold;
    color: #f56c6c;
  }
}
</style>
