<template>
  <!-- 叶子节点列（无子列） -->
  <el-table-column
    v-if="!column.children || column.children.length === 0"
    :prop="column.prop"
    :label="column.label"
    :width="column.width"
    :min-width="column.minWidth || 120"
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
        {{ formatCellValue(scope.row, column) }}
      </span>
    </template>
  </el-table-column>

  <!-- 分组列（有子列）：递归渲染 -->
  <el-table-column
    v-else
    :label="column.label"
    :align="column.align || 'center'"
  >
    <!-- 递归渲染所有子列 -->
    <dynamic-column
      v-for="child in column.children"
      :key="child.id"
      :column="child"
      @cell-click="handleCellClick"
    />
  </el-table-column>
</template>

<script>
export default {
  name: "DynamicColumn",
  props: {
    column: {
      type: Object,
      required: true
    }
  },
  methods: {
    // 单元格点击
    handleCellClick(column, row) {
      this.$emit("cell-click", { column, row });
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
    formatCellValue(row, column) {
      //  如果配置了  "showPropText": true,"propText": "orgName"
      // 解析转json为obj
      console.log("column", column);

      let fieldProp = column.prop;
      let columnConfig = null;
      if (column.columnConfig) {
        columnConfig = JSON.parse(column.columnConfig);
      }

      if (columnConfig && columnConfig.showPropText && columnConfig.propText) {
        fieldProp = columnConfig.propText;
      }
      let value = "";
      if (fieldProp) {
        value = row[fieldProp];
      }

      // 根据列配置格式化数值
      // 例如:数字格式化、百分比、日期等
      if (typeof value === "number" && !column.prop.includes("hcl")) {
        return value.toLocaleString();
      }

      return value;
    }
  }
};
</script>
