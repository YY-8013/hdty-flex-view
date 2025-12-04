<template>
  <!-- 钻取机构列（根据 columnType 判断） -->
  <el-table-column
    v-if="isOrgDrillColumn"
    :prop="column.prop || 'orgName'"
    :label="column.label || '管辖机构'"
    :width="column.width || 280"
    :align="column.align || 'center'"
    :fixed="column.fixed || 'left'"
    show-overflow-tooltip
  >
    <template slot-scope="scope">
      <!-- 叶子节点或最后一行（汇总行）：不可点击 -->
      <p class="p-org-name" v-if="scope.row.isLeaf || isLastRow(scope.$index)">
        {{ formatCellValue(scope.row, column) }}
      </p>
      <!-- 非叶子节点：可点击钻取 -->
      <p class="p-org-name" v-else>
        <a
          href="javascript:;"
          class="org-link"
          @click="handleOrgClick(scope.$index, scope.row)"
        >
          {{ formatCellValue(scope.row, column) }}
        </a>
      </p>
    </template>
  </el-table-column>

  <!-- 叶子节点列（无子列） -->
  <el-table-column
    v-else-if="!column.children || column.children.length === 0"
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
    },
    rowData: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    // 判断是否是钻取机构列
    isOrgDrillColumn() {
      return this.column.columnType === "drillOrg";
    }
  },
  methods: {
    // 机构列点击
    handleOrgClick(index, row) {
      this.$emit("cell-click", { ...this.column, columnType: "drillOrg" }, row);
    },

    // 判断是否是最后一行
    isLastRow(index) {
      return index === this.rowData.length - 1;
    },
    // 叶子节点点击
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
