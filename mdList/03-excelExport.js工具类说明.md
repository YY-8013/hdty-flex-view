# excelExport.js 工具类说明

## 概述
`excelExport.js` 是一个功能完整的 Excel 导出工具类，基于 ExcelJS 库实现，支持复杂的表头结构、样式设置、数据格式化等功能，可以满足各种复杂的 Excel 导出需求。

## 主要功能

### 1. 核心类
- `UniversalExcelExporter`: Excel 导出核心类，提供完整的导出功能

### 2. 工作簿操作
- `initWorkbook(creator)`: 初始化工作簿
- `addWorksheet(name)`: 添加工作表

### 3. 表头处理
- `processHeaderStructure(headerList)`: 处理表头结构
- `buildDynamicHeaders(headerList)`: 构建动态表头
- `_calculateMaxDepth(headers)`: 计算表头最大深度
- `_countLeafNodes(headers)`: 计算叶子节点数量

### 4. 样式设置
- `applyHeaderStyle(headerRow)`: 应用表头样式
- `applyBaseRowStyle(dataRow)`: 应用基础行样式
- `applyCustomRowStyles(dataRow, rowIndex, rowStyles, rowData)`: 应用自定义行样式
- `applyCustomCellStyles(dataRow, rowIndex, cellStyles, rowData)`: 应用自定义单元格样式

### 5. 数据处理
- `addData(data, styleConfig)`: 添加数据行
- `setColumnWidth(config)`: 设置列宽
- `freezeHeader()`: 冻结表头
- `freezeHeaderAndColumns(colCount)`: 冻结表头和列

### 6. 导出功能
- `export(filename)`: 导出 Excel 文件

## 使用示例

```javascript
// 创建导出实例
const exporter = new UniversalExcelExporter();

// 初始化工作簿
exporter.initWorkbook('系统');

// 添加工作表
exporter.addWorksheet('数据表');

// 设置表头
const headers = [
  { label: '姓名', prop: 'name', width: 20 },
  { label: '年龄', prop: 'age', width: 10 }
];

exporter.buildDynamicHeaders(headers);

// 添加数据
const data = [
  { name: '张三', age: 25 },
  { name: '李四', age: 30 }
];

exporter.addData(data);

// 设置列宽并导出
exporter.setColumnWidth()
  .freezeHeader()
  .export('数据导出');
```

## 支持的特性

### 1. 复杂表头结构
- 支持多层级表头
- 支持表头合并
- 自动计算表头层级和列宽

### 2. 样式定制
- 表头样式（背景色、字体、对齐方式等）
- 数据行样式
- 自定义行样式和单元格样式
- 边框、字体、对齐等样式设置

### 3. 数据格式化
- 自动列宽设置
- 冻结窗格功能
- 支持多种数据类型

### 4. 导出选项
- 自定义文件名
- 支持浏览器自动下载
- 兼容不同版本的 Excel

## 注意事项
1. 依赖 ExcelJS 库
2. 支持复杂表头结构的自动处理
3. 提供了丰富的样式定制选项
4. 支持大数据量导出（需注意浏览器性能）