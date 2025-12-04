<template>
  <div class="stat-table">
    <el-table
      ref="tableRef"
      v-loading="loading"
      :data="tableData"
      border
      stripe
      fit
      height="100%"
      :empty-text="emptyText"
      :header-cell-style="{ textAlign: 'center', fontWeight: 'bold' }"
      show-summary
      :summary-method="getSummaries"
    >
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="60"
        fixed="left"
      >
      </el-table-column>

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
      emptyText: "暂无数据",
      tableData: [], // 存放除去合计行后的列表数据
      summaryData: {} // 存放后端返回的合计行对象
    };
  },
  watch: {
    // 监听 props.data 的变化，进行拆分
    data: {
      immediate: true,
      handler(val) {
        if (val && val.length > 0) {
          // 假设后端返回的数组中，最后一行是合计行
          // 1. 取出最后一行
          this.summaryData = val[val.length - 1];
          // 2. 将除最后一行外的数据给表格显示
          this.tableData = val.slice(0, -1);
        } else {
          this.summaryData = {};
          this.tableData = [];
        }
      }
    }
  },
  methods: {
    // 自定义合计行逻辑：直接映射 summaryData，不计算
    getSummaries(param) {
      const { columns } = param;
      const sums = [];

      columns.forEach((column, index) => {
        // 1. 序号列显示 '合计'
        if (index === 0) {
          sums[index] = "合计";
          return;
        }

        // 2. 获取当前列的 prop
        const prop = column.property;

        // 3. 如果 prop 存在且 summaryData 中有对应值
        if (prop && this.summaryData && this.summaryData[prop] !== undefined) {
          const value = this.summaryData[prop];

          // 4. 简单格式化：如果是数字，加上千分位，保持和 DynamicColumn 一致的视觉体验
          if (typeof value === "number" && !prop.includes("hcl")) {
            // 排除不需要格式化的字段
            sums[index] = value.toLocaleString();
          } else {
            sums[index] = value;
          }
        } else {
          sums[index] = "";
        }
      });

      return sums;
    },

    // 单元格点击
    handleCellClick(column, row) {
      if (column.columnType === "drillOrg") {
        this.$emit(
          "cell-click",
          { prop: "orgName", columnType: "drillOrg" },
          row
        );
      } else if (column.formId) {
        this.$emit("cell-click", column, row);
      }
    },

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

/* 如果需要调整合计行的样式（例如加粗、背景色），可以在这里添加 
  注意使用 ::v-deep 穿透 Element UI 样式
*/
::v-deep .el-table__footer-wrapper tbody td {
  background-color: #f5f7fa;
  font-weight: bold;
  color: #333;
}
</style>
