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
      :header-cell-style="{ textAlign: 'center', fontWeight: 'bold' }"
    >
      <!-- 序号列 -->
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60"
        fixed="left"
      >
      </el-table-column>
      <!-- 动态多层级列:递归渲染任意层级 -->
      <dynamic-column
        v-for="column in columns"
        :key="column.id"
        :column="column"
        @cell-click="handleCellClick"
      />
    </el-table>
  </div>
</template>

<script>
import DynamicColumn from "./DynamicColumn.vue";

export default {
  name: "StatTable",
  components: {
    DynamicColumn
  },
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
    },
    currentTheme: {
      type: String,
      default: "police"
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
        this.$emit("cell-click", column, row);
      }
    },

    // 刷新表格布局
    doLayout() {
      this.$nextTick(() => {
        if (this.$refs.tableRef && this.$refs.tableRef.doLayout) {
          this.$refs.tableRef.doLayout();
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../styles/stat-table.scss";
</style>
