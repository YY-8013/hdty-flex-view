# DetailListView 动态查询配置指南

## 📌 概述

`DetailListView.vue` 组件已调整为仅处理动态查询字段（来自 formConfig），不再处理硬编码的固定字段（创建时间、注销状态等）。

## 🔧 JSON 配置中需要添加的字段

在 `itemConfig` JSON 中，需要添加以下字段来支持后端查询：

### 基础字段（必需）

| 字段名           | 类型   | 说明                        | 示例         |
| ---------------- | ------ | --------------------------- | ------------ |
| `tableColumnKey` | string | 映射到数据库的列名          | `"F_ORG_ID"` |
| `valueType`      | string | 值类型：string/number/array | `"string"`   |

### 可选字段

| 字段名         | 类型   | 说明         | 适用场景                           |
| -------------- | ------ | ------------ | ---------------------------------- |
| `filterFactor` | string | 过滤因子     | 仅针对因子输入型字段（like/eq）    |
| `queryType`    | string | 查询组件类型 | 自动推导，可显式指定以覆盖默认行为 |

## 📋 完整配置示例

```json
{
  "itemLabel": "抽查机构",
  "itemProp": "org_id",
  "itemType": "organ",
  "keyType": "org",
  "tableKey": "F_ORG_ID",
  "itemConfig": {
    "display": {
      "showInQuery": true,
      "showInList": true,
      "showInForm": true,
      "columnWidth": 150,
      "columnMinWidth": 150
    },
    "layout": {
      "span": 8
    },
    "validation": {
      "required": false
    },
    "componentProps": {},
    "valueType": "string",
    "placeholder": "请选择抽查机构"
  }
}
```

**关键说明：**
- ✅ `tableKey` 是 `formItemList` 的**独立属性**（顶层），不在 `itemConfig` 中
- ✅ `valueType` 在 `itemConfig` 中（可选，会自动推导）
- ✅ `filterFactor` 在 `itemConfig` 中（仅因子输入需要）

## 🔄 数据流转说明

### 前端查询结构

用户点击"查询"时，组件会构建以下结构发送给后端：

```javascript
{
  formId: "form_001",
  queryFields: [
    {
      prop: "org_id",
      label: "抽查机构",
      type: "organ",
      value: "150602000000",
      valueType: "string",
      tableColumnKey: "F_ORG_ID"  // 来自 formItem.tableKey
    },
    {
      prop: "syrk_cc_total_num",
      label: "抽查总数",
      type: "input",
      value: "100",
      valueType: "string",
      tableColumnKey: "F_FIELD_1",  // 来自 formItem.tableKey
      filterFactor: "like"  // 来自 itemConfig.filterFactor 或用户操作
    }
  ],
  current: 1,
  size: 20
}
```

### tableKey 来源说明

- **配置位置**：`formItemList` 中每个项的顶层 `tableKey` 属性
- **用途**：在后端查询时用于映射实际的数据库列名
- **映射过程**：`formItem.tableKey` → `queryFieldItem.tableColumnKey`

### 值类型推导

如果 `itemConfig` 中未配置 `valueType`，会自动推导：
```javascript
const valueTypeMap = {
  daterange: "array",
  datetimerange: "array",
  number: "number",
  // 其他类型默认为 "string"
}
```

## ✨ 关键特性

### 1. 值类型自动推导
如果未配置 `valueType`，组件会根据 `itemType` 自动推导：
- `daterange/datetimerange` → `"array"`
- `number` → `"number"`
- 其他 → `"string"`

### 2. tableKey 直接映射
从 `formItemList` 的独立属性 `tableKey` 直接获取，无需在 `itemConfig` 中配置：
```javascript
// 组件代码中的处理
tableColumnKey: formItem.tableKey  // 直接使用 formItem 属性
```

### 3. filterFactor 支持
对于 `queryType === "factorInput"` 的字段，会自动携带 `filterFactor` 数据：
```javascript
{
  prop: "amount",
  queryType: "factorInput",
  value: [100, 500],
  filterFactor: "between" // 来自 itemConfig 或用户界面选择
}
```

### 4. 空值过滤
- 查询时自动过滤空值字段（value === "" | null | undefined）
- 只将有值的字段发送给后端，减少网络传输

### 5. 固定字段处理
- 原有的"创建时间"、"注销状态"等硬编码字段已移除
- 如需包含这些字段，应在 formConfig 中定义为动态字段
- 这样实现了配置的完全动态化

## 🎯 后端对接建议

后端接收 `queryFields` 数组后，应：

1. **获取列名映射**：根据 `tableColumnKey` 映射到实际数据库列
2. **应用过滤因子**：对于包含 `filterFactor` 的字段应用相应的 SQL 操作符
3. **类型转换**：根据 `valueType` 进行数据类型转换
4. **构建动态查询**：组合所有查询条件生成 WHERE 子句

### 示例伪代码
```java
// 遍历 queryFields
for (QueryField field : queryFields) {
    String columnName = field.getTableColumnKey();  // F_ORG_ID
    Object value = field.getValue();
    String filterType = field.getFilterFactor();     // like/eq/between
    
    // 根据 filterType 构建 SQL 条件
    if ("like".equals(filterType)) {
        whereClause += columnName + " LIKE '" + value + "%'";
    } else if ("between".equals(filterType)) {
        // 处理数组值
    }
}
```

## 📝 注意事项

1. **tableKey 必需且独立**：位于 `formItemList` 的顶层，后端需要此字段来映射数据库列
   ```javascript
   formItemList: [
     {
       itemLabel: "抽查机构",
       itemProp: "org_id",
       tableKey: "F_ORG_ID",      // ← 独立属性，不在 itemConfig 中
       itemConfig: { /* ... */ }
     }
   ]
   ```

2. **valueType 推荐显式配置**：虽然有自动推导，但显式配置能提高清晰度和后端处理效率
   ```javascript
   itemConfig: {
     valueType: "string",  // 显式指定
     // ...
   }
   ```

3. **keyType 用于前端组件判断**：
   - `showInQuery` 用于判断是否显示在查询区
   - `keyType`（org/region/dict/date）用于确定 placeholder 提示语

4. **filterFactor 仅在因子输入时需要**：普通输入框无需配置

## 🔗 相关文件

- `/src/views/business/flex-view/stat/components/DetailListView.vue` - 查询组件
- `/src/views/business/flex-view/stat/api/index.js` - API 接口定义
- `/src/views/business/flex-view/config/form-item/index.vue` - 表单项配置（tableKey 来源）
