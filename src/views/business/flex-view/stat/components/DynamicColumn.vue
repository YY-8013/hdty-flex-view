<template>
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
      <p class="p-org-name" v-if="scope.row.isLeaf">
        {{ formatCellValue(scope.row, column) }}
      </p>
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

  <el-table-column
    v-else
    :label="column.label"
    :align="column.align || 'center'"
  >
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
    // 修改点：移除了 rowData prop，因为不再需要判断 index 是否为最后一行
  },
  computed: {
    isOrgDrillColumn() {
      return this.column.columnType === "drillOrg";
    }
  },
  methods: {
    handleOrgClick(index, row) {
      this.$emit("cell-click", { ...this.column, columnType: "drillOrg" }, row);
    },

    // 修改点：移除了 isLastRow 方法

    handleCellClick(column, row) {
      this.$emit("cell-click", column, row);
    },

    getCellClass(column, row) {
      const classes = [];
      const columnConfig = this.parseColumnConfig(column);

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

    getCellStyle(column, row) {
      const style = {};
      const columnConfig = this.parseColumnConfig(column);

      if (columnConfig && columnConfig.style) {
        Object.assign(style, columnConfig.style);
      }

      if (
        columnConfig &&
        columnConfig.conditional &&
        columnConfig.conditional.rules
      ) {
        const value = row[column.prop];
        for (const rule of columnConfig.conditional.rules) {
          try {
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

    parseColumnConfig(column) {
      try {
        return typeof column.columnConfig === "string"
          ? JSON.parse(column.columnConfig)
          : column.columnConfig || {};
      } catch {
        return {};
      }
    },

    evalCondition(condition, value) {
      const expr = condition.replace(/value/g, JSON.stringify(value));
      return new Function(`return ${expr}`)();
    },

    formatCellValue(row, column) {
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

      if (typeof value === "number" && !column.prop.includes("hcl")) {
        return value.toLocaleString();
      }

      return value;
    }
  }
};
</script>
