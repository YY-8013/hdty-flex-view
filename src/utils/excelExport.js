// utils/excelExport.js - 完整优化版本
import ExcelJS from "exceljs";

class UniversalExcelExporter {
  constructor() {
    this.workbook = null;
    this.worksheet = null;
    this.flatColumns = [];
    this.headerLevels = 0;
  }

  /**
   * 初始化工作簿
   */
  initWorkbook(creator = "系统") {
    this.workbook = new ExcelJS.Workbook();
    this.workbook.creator = creator;
    this.workbook.created = new Date();
    return this;
  }

  /**
   * 添加工作表
   */
  addWorksheet(name = "Sheet1") {
    this.worksheet = this.workbook.addWorksheet(name);
    return this;
  }

  /**
   * 处理表头结构
   */
  processHeaderStructure(headerList) {
    this.flatColumns = [];
    this.headerLevels = this._calculateMaxDepth(headerList);

    const headerRows = Array.from({ length: this.headerLevels }, () => []);
    const mergeCells = [];

    this._buildHeadersFinal(headerList, headerRows, mergeCells, 1, 1);

    return {
      headerRows,
      mergeCells,
      leafColumns: this.flatColumns
    };
  }

  /**
   * 计算表头最大深度
   */
  _calculateMaxDepth(headers, currentDepth = 1) {
    let maxDepth = currentDepth;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.children && header.children.length > 0) {
        const childDepth = this._calculateMaxDepth(
          header.children,
          currentDepth + 1
        );
        maxDepth = Math.max(maxDepth, childDepth);
      }
    }
    return maxDepth;
  }

  /**
   * 最终表头构建算法
   */
  _buildHeadersFinal(headers, headerRows, mergeCells, currentRow, startCol) {
    let currentCol = startCol;

    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      const hasChildren = header.children && header.children.length > 0;
      const colSpan = hasChildren ? this._countLeafNodes(header.children) : 1;

      // 设置当前header的位置
      headerRows[currentRow - 1][currentCol - 1] = header.label;

      // 处理水平合并
      if (colSpan > 1) {
        mergeCells.push({
          startRow: currentRow,
          startCol: currentCol,
          endRow: currentRow,
          endCol: currentCol + colSpan - 1
        });
      }

      if (hasChildren) {
        // 递归处理子节点
        currentCol = this._buildHeadersFinal(
          header.children,
          headerRows,
          mergeCells,
          currentRow + 1,
          currentCol
        );
      } else {
        // 叶子节点处理
        this.flatColumns.push({
          label: header.label,
          prop: header.prop,
          width: header.width || 20, // 保存宽度配置
          colIndex: currentCol
        });

        // 垂直合并处理
        if (currentRow < this.headerLevels) {
          for (let row = currentRow; row < this.headerLevels; row++) {
            headerRows[row][currentCol - 1] = "";
          }

          mergeCells.push({
            startRow: currentRow,
            startCol: currentCol,
            endRow: this.headerLevels,
            endCol: currentCol
          });
        }

        currentCol++;
      }
    }

    return currentCol;
  }

  /**
   * 计算叶子节点数量
   */
  _countLeafNodes(headers) {
    let count = 0;
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      if (header.children && header.children.length > 0) {
        count += this._countLeafNodes(header.children);
      } else {
        count++;
      }
    }
    return count;
  }

  /**
   * 构建动态表头
   */
  buildDynamicHeaders(headerList) {
    if (!this.worksheet) {
      throw new Error("请先添加工作表");
    }

    const { headerRows, mergeCells } = this.processHeaderStructure(headerList);

    // 打印调试信息
    this._printHeaderDebugInfo(headerRows, mergeCells);

    // 添加表头行
    for (let i = 0; i < headerRows.length; i++) {
      const rowData = headerRows[i];
      const cleanRowData = [];
      for (let j = 0; j < rowData.length; j++) {
        cleanRowData.push(rowData[j] === undefined ? "" : rowData[j]);
      }
      const row = this.worksheet.addRow(cleanRowData);
      this.applyHeaderStyle(row);
    }

    // 应用合并单元格
    for (let i = 0; i < mergeCells.length; i++) {
      const merge = mergeCells[i];
      try {
        this.worksheet.mergeCells(
          merge.startRow,
          merge.startCol,
          merge.endRow,
          merge.endCol
        );
      } catch (error) {
        console.warn("合并单元格失败:", merge, error);
      }
    }

    return this;
  }

  /**
   * 打印表头调试信息
   */
  _printHeaderDebugInfo(headerRows, mergeCells) {
    console.group("🎯 表头结构分析");
    console.log("📊 表头层级:", this.headerLevels);
    console.log("📝 表头行数据:");
    for (let i = 0; i < headerRows.length; i++) {
      console.log("  第" + (i + 1) + "行:", JSON.stringify(headerRows[i]));
    }
    console.log("🔗 合并配置:", mergeCells);
    console.log("🍃 叶子列:", this.flatColumns);
    console.groupEnd();
  }

  /**
   * 应用表头样式
   */
  applyHeaderStyle(headerRow) {
    headerRow.height = 30;
    headerRow.eachCell(function (cell) {
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFD3D3D3" }
      };
      cell.font = {
        bold: true,
        size: 11,
        color: { argb: "FF000000" }
      };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });
  }

  /**
   * 添加数据行
   */
  addData(data, styleConfig) {
    if (!this.worksheet) {
      throw new Error("请先添加工作表");
    }

    const config = styleConfig || {};
    const rowStyles = config.rowStyles || [];
    const cellStyles = config.cellStyles || [];
    const dataMerges = config.dataMerges || [];

    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const rowValues = [];

      for (let j = 0; j < this.flatColumns.length; j++) {
        const col = this.flatColumns[j];
        const value = rowData[col.prop];
        rowValues.push(value !== undefined && value !== null ? value : "");
      }

      const dataRow = this.worksheet.addRow(rowValues);

      this.applyBaseRowStyle(dataRow);
      this.applyCustomRowStyles(dataRow, i, rowStyles, rowData);
      this.applyCustomCellStyles(dataRow, i, cellStyles, rowData);
    }

    this.applyDataMerges(dataMerges, data.length);

    return this;
  }

  /**
   * 应用基础行样式
   */
  applyBaseRowStyle(dataRow) {
    dataRow.eachCell(function (cell) {
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
      cell.font = { size: 11 };
      cell.alignment = {
        vertical: "middle",
        horizontal: "center"
      };
    });
  }

  /**
   * 应用自定义行样式
   */
  applyCustomRowStyles(dataRow, rowIndex, rowStyles, rowData) {
    for (let i = 0; i < rowStyles.length; i++) {
      const style = rowStyles[i];
      if (!style.condition || style.condition(rowIndex, rowData)) {
        dataRow.eachCell(function (cell) {
          if (style.style) {
            if (style.style.fill) cell.fill = style.style.fill;
            if (style.style.font)
              cell.font = { ...cell.font, ...style.style.font };
            if (style.style.alignment)
              cell.alignment = { ...cell.alignment, ...style.style.alignment };
            if (style.style.border) cell.border = style.style.border;
          }
        });
      }
    }
  }

  /**
   * 应用自定义单元格样式
   */
  applyCustomCellStyles(dataRow, rowIndex, cellStyles, rowData) {
    for (let i = 0; i < cellStyles.length; i++) {
      const style = cellStyles[i];
      if (!style.condition || style.condition(rowIndex, rowData)) {
        let colIndex = -1;
        for (let j = 0; j < this.flatColumns.length; j++) {
          if (this.flatColumns[j].prop === style.prop) {
            colIndex = j;
            break;
          }
        }

        if (colIndex !== -1) {
          const cell = dataRow.getCell(colIndex + 1);
          if (style.style) {
            if (style.style.fill) cell.fill = style.style.fill;
            if (style.style.font)
              cell.font = { ...cell.font, ...style.style.font };
            if (style.style.alignment)
              cell.alignment = { ...cell.alignment, ...style.style.alignment };
            if (style.style.border) cell.border = style.style.border;
          }
        }
      }
    }
  }

  /**
   * 应用数据区域合并
   */
  applyDataMerges(dataMerges, dataLength) {
    const headerRowCount = this.headerLevels;

    for (let i = 0; i < dataMerges.length; i++) {
      const merge = dataMerges[i];
      const prop = merge.prop;
      const startRow = merge.startRow || 0;
      const rowSpan = merge.rowSpan || 1;

      let colIndex = -1;
      for (let j = 0; j < this.flatColumns.length; j++) {
        if (this.flatColumns[j].prop === prop) {
          colIndex = j;
          break;
        }
      }

      if (colIndex !== -1 && rowSpan > 1) {
        for (let k = startRow; k < dataLength; k += rowSpan) {
          if (k + rowSpan - 1 < dataLength) {
            this.worksheet.mergeCells(
              headerRowCount + k + 1,
              colIndex + 1,
              headerRowCount + k + rowSpan,
              colIndex + 1
            );
          }
        }
      }
    }
  }

  /**
   * 设置列宽 - 优化版本（支持在headerList中配置width）
   * @param {number|Array|Array} config - 列宽配置，可以是数字、数组或headerList
   * @returns {UniversalExcelExporter} 返回当前实例，支持链式调用
   */
  setColumnWidth(config) {
    if (!this.worksheet) {
      throw new Error("请先添加工作表");
    }

    if (typeof config === "number") {
      // 使用数字或数组配置
      return this._setColumnWidthByNumber(config);
    }

    if (Array.isArray(config)) {
      // 使用headerList配置
      return this._setColumnWidthByHeaderList(config);
    }

    // 默认使用扁平化列中的宽度配置
    return this._setColumnWidthByFlatColumns();
  }

  /**
   * 根据数字或数组设置列宽
   */
  _setColumnWidthByNumber(widths) {
    const widthConfig = widths || 20;
    const columnConfig = [];

    for (let i = 0; i < this.flatColumns.length; i++) {
      if (Array.isArray(widthConfig) && i < widthConfig.length) {
        columnConfig.push({ width: widthConfig[i] });
      } else if (typeof widthConfig === "number") {
        columnConfig.push({ width: widthConfig });
      } else {
        columnConfig.push({ width: 20 });
      }
    }

    this.worksheet.columns = columnConfig;
    return this;
  }

  /**
   * 根据headerList配置设置列宽
   */
  _setColumnWidthByHeaderList(headerList) {
    const widthConfig = this._extractWidthFromHeaders(headerList);
    const columnConfig = [];

    for (let i = 0; i < this.flatColumns.length; i++) {
      const col = this.flatColumns[i];
      const width = this._findWidthForColumn(col, widthConfig);
      columnConfig.push({ width: width });
    }

    this.worksheet.columns = columnConfig;
    console.log(
      "列宽配置:",
      columnConfig.map((col) => col.width)
    );
    return this;
  }

  /**
   * 根据扁平化列配置设置列宽
   */
  _setColumnWidthByFlatColumns() {
    const columnConfig = [];

    for (let i = 0; i < this.flatColumns.length; i++) {
      const col = this.flatColumns[i];
      columnConfig.push({ width: col.width || 20 });
    }

    this.worksheet.columns = columnConfig;
    return this;
  }

  /**
   * 从headerList中提取宽度配置
   */
  _extractWidthFromHeaders(headers) {
    const widthConfig = [];

    const extract = function (headers) {
      for (let i = 0; i < headers.length; i++) {
        const header = headers[i];
        if (header.children && header.children.length > 0) {
          extract(header.children);
        } else {
          widthConfig.push({
            prop: header.prop,
            width: header.width || 20
          });
        }
      }
    };

    extract(headers);
    return widthConfig;
  }

  /**
   * 查找列的宽度配置
   */
  _findWidthForColumn(column, widthConfig) {
    for (let i = 0; i < widthConfig.length; i++) {
      if (widthConfig[i].prop === column.prop) {
        return widthConfig[i].width;
      }
    }
    return 20;
  }

  freezeHeader() {
    if (!this.worksheet) {
      throw new Error("请先添加工作表");
    }

    this.worksheet.views = [
      {
        state: "frozen",
        xSplit: 0, // 不冻结列
        ySplit: this.headerLevels, // 冻结表头行数
        activeCell: "A1",
        showGridLines: true
      }
    ];

    console.log(`已冻结前 ${this.headerLevels} 行表头`);
    return this;
  }

  freezeHeaderAndColumns(colCount = 1) {
    if (!this.worksheet) {
      throw new Error("请先添加工作表");
    }

    this.worksheet.views = [
      {
        state: "frozen",
        xSplit: colCount, // 冻结列数
        ySplit: this.headerLevels, // 冻结表头行数
        activeCell: `${this._getColumnLetter(colCount + 1)}${
          this.headerLevels + 1
        }`,
        showGridLines: true
      }
    ];

    console.log(`已冻结前 ${this.headerLevels} 行表头和前 ${colCount} 列`);
    return this;
  }

  /**
   * 将列索引转换为Excel列字母（辅助方法）
   * @private
   */
  _getColumnLetter(columnIndex) {
    let letter = "";
    while (columnIndex > 0) {
      columnIndex--;
      letter = String.fromCharCode(65 + (columnIndex % 26)) + letter;
      columnIndex = Math.floor(columnIndex / 26);
    }
    return letter;
  }

  /**
   * 导出Excel文件
   */
  async export(filename) {
    if (!this.workbook) {
      throw new Error("请先初始化工作簿");
    }

    try {
      let arrayBuffer = null;

      if (
        this.workbook.xlsx &&
        typeof this.workbook.xlsx.writeBuffer === "function"
      ) {
        arrayBuffer = await this.workbook.xlsx.writeBuffer();
      } else if (
        this.workbook.xlsx &&
        typeof this.workbook.xlsx.write === "function"
      ) {
        arrayBuffer = await this.workbook.xlsx.write({ type: "arraybuffer" });
      } else {
        throw new Error("ExcelJS 版本不兼容，无法导出文件");
      }

      if (!arrayBuffer) {
        throw new Error("无法生成导出文件");
      }

      const blob = new Blob([arrayBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = filename + ".xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      return true;
    } catch (error) {
      console.error("导出失败:", error);
      throw error;
    }
  }

  getFlatColumns() {
    return this.flatColumns;
  }

  getHeaderLevels() {
    return this.headerLevels;
  }
}

export default UniversalExcelExporter;
