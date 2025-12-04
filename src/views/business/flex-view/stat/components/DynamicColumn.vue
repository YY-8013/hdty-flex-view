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
      this.$emit("cell-click", column, row);
    },

    // 获取单元格样式类
    getCellClass(column, row) {
      const classes = [];

      // 解析列配置
      const columnConfig = this.parseColumnConfig(column);

      // 可点击的单元格
      if (
        (columnConfig &&
          columnConfig.clickable &&
          columnConfig.clickable.enabled) ||
        column.formId
      ) {
        classes.push("clickable-cell");
      }

      return classes.join(" ");
    },

    // 获取单元格样式
    getCellStyle(column, row) {
      const style = {};
      const columnConfig = this.parseColumnConfig(column);

      // 应用基础样式
      if (columnConfig && columnConfig.style) {
        Object.assign(style, columnConfig.style);
      }

      // 应用条件样式
      if (
        columnConfig &&
        columnConfig.conditional &&
        columnConfig.conditional.rules
      ) {
        const value = row[column.prop];
        for (const rule of columnConfig.conditional.rules) {
          try {
            // 简单的条件表达式解析
            if (this.evalCondition(rule.condition, value)) {
              Object.assign(style, rule.style);
              break;
            }
          } catch (error) {
            console.warn("条件样式解析失败:", error);
          }
        }
      }

      return style;
    },

    // 解析列配置JSON
    parseColumnConfig(column) {
      try {
        return typeof column.columnConfig === "string"
          ? JSON.parse(column.columnConfig)
          : column.columnConfig || {};
      } catch {
        return {};
      }
    },

    // 简单条件表达式求值
    evalCondition(condition, value) {
      // 替换condition中的value为实际值
      const expr = condition.replace(/value/g, JSON.stringify(value));
      // 使用Function构造器求值(注意:生产环境应该使用更安全的方式)
      return new Function(`return ${expr}`)();
    },

    // 格式化单元格值
    formatCellValue(row, column) {
      //  如果配置了  "showPropText": true,"propText": "orgName"
      // 解析转json为obj

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
