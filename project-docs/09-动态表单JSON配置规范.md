# 动态表单与列表 JSON 配置规范

## 一、概述

本文档定义了数据晾晒系统中动态表单和动态列表的完整JSON配置规范。所有扩展配置都通过JSON字段存储，不新增数据库字段。

## 二、表单项配置 (itemConfig JSON)

### 2.1 完整配置结构

```json
{
  // ========== 基础配置 ==========
  "placeholder": "请输入姓名",
  "defaultValue": "",
  "defaultValueType": "today",  // 默认值类型: today(今日), custom(自定义值)
  
  // ========== 显示控制配置 ==========
  "display": {
    "showInForm": true,      // 是否在表单中显示
    "showInList": true,       // 是否在列表中显示  
    "showInQuery": false,     // 是否作为查询条件
    "columnWidth": 120,       // 列表列宽(px)
    "showOverflowTooltip": true  // 列表内容过长是否显示tooltip
  },
  
  // ========== 布局配置 ==========
  "layout": {
    "span": 12,              // 表单栅格占位: 12=半行(一行2个), 24=整行(独占)
    "labelWidth": "120px",   // 标签宽度
    "labelPosition": "right" // 标签位置: left/right/top
  },
  
  // ========== 验证配置 ==========
  "validation": {
    "required": true,         // 是否必填
    "message": "姓名不能为空", // 提示信息
    "trigger": "blur",        // 触发方式: blur/change
    "maxLength": 50,          // 最大长度
    "minLength": 2,           // 最小长度
    "pattern": "",            // 正则表达式
    "validator": "",          // 自定义校验器函数名
    "compare": {              // 字段间比较验证
      "type": "lte",          // 比较类型: lt/lte/gt/gte/eq/ne
      "field": "max_value",   // 对比字段
      "fieldLabel": "最大值"   // 对比字段的中文标签
    }
  },
  
  // ========== 计算字段配置 ==========
  "computed": {
    "enabled": true,         // 是否启用计算
    "type": "percent",       // 计算类型: percent/sum/subtract/multiply/divide
    "numerator": "pass_num", // 分子字段(percent/divide)
    "denominator": "total_num", // 分母字段(percent/divide)
    "field1": "field_a",     // 字段1(subtract/multiply/divide)
    "field2": "field_b",     // 字段2(subtract/multiply/divide)
    "fields": ["f1", "f2"],  // 字段数组(sum)
    "precision": 2           // 精度(小数位)
  },
  
  // ========== 组件特定配置 ==========
  "componentProps": {
    // 通用属性
    "size": "medium",        // 尺寸: large/medium/small/mini
    "clearable": true,       // 是否可清空
    "disabled": false,       // 是否禁用
    "readonly": false,       // 是否只读
    
    // input 特定
    "type": "text",          // 类型: text/number/password/email等
    "maxlength": 100,        // 最大输入长度
    "showWordLimit": false,  // 显示字数统计
    "prefixIcon": "",        // 前置图标
    "suffixIcon": "",        // 后置图标
    
    // textarea 特定
    "rows": 3,               // 行数
    "autosize": false,       // 自动调整高度
    
    // number 特定
    "min": 0,                // 最小值
    "max": 99999,            // 最大值
    "precision": 2,          // 精度(小数位)
    "step": 1,               // 步长
    
    // select 特定
    "multiple": false,       // 是否多选
    "filterable": true,      // 是否可搜索
    "allowCreate": false,    // 是否允许创建新项
    
    // date 特定
    "type": "date",          // 类型: date/datetime/daterange等
    "format": "yyyy-MM-dd",  // 显示格式
    "valueFormat": "yyyy-MM-dd", // 值格式
    "pickerOptions": {},     // 选择器选项
    
    // dict 字典组件特定
    "dictCode": "ZXBS",      // 字典类型编码
    
    // organ 机构组件特定
    "multiple": false,       // 是否启用多选
    "filterCode": "",        // 筛选编码（过滤特定机构）
    "showLevel": "",         // 只能显示到的级别
    "checkLevel": "",        // 可选择的级别（支持单个或数组）
    "checkFinalLevel": false, // 是否只能选择最后一级
    "clearable": true,       // 是否可清空
    
    // region 地区组件特定
    "level": 3               // 地区层级
  },
  
  // ========== 选项配置 ==========
  "options": {
    // 静态选项数据
    "data": [
      { "label": "合格", "value": "1" },
      { "label": "不合格", "value": "0" }
    ],
    // 远程数据源
    "remote": {
      "url": "/api/dict/list",
      "method": "GET",
      "params": { "type": "check_result" },
      "labelField": "label",
      "valueField": "value"
    }
  },
  
  // ========== 联动配置 ==========
  "linkage": {
    "trigger": "checkResult",  // 触发字段
    "rules": [
      {
        "condition": "checkResult == '0'",  // 条件表达式
        "action": "show",                    // 动作: show/hide/enable/disable/setValue
        "target": "failReason",              // 目标字段
        "value": ""                          // 设置的值(action=setValue时)
      }
    ]
  },
  
  // ========== 列表格式化配置 ==========
  "listFormatter": {
    "type": "dict",           // 格式化类型: dict/date/number/custom
    "dictCode": "ZXBS",       // 字典编码(type=dict)
    "format": "yyyy-MM-dd",   // 日期格式(type=date)
    "precision": 2,           // 小数位(type=number)
    "customFn": ""            // 自定义函数名(type=custom)
  }
}
```

### 2.2 各组件类型配置示例

#### 2.2.1 输入框 (input)

```json
{
  "placeholder": "请输入姓名",
  "display": {
    "showInForm": true,
    "showInList": true,
    "showInQuery": true,
    "columnWidth": 120
  },
  "layout": {
    "span": 12
  },
  "validation": {
    "required": true,
    "message": "姓名不能为空",
    "maxLength": 50
  },
  "componentProps": {
    "clearable": true,
    "maxlength": 50
  }
}
```

#### 2.2.2 下拉框 (select)

```json
{
  "placeholder": "请选择状态",
  "display": {
    "showInForm": true,
    "showInList": true,
    "columnWidth": 100
  },
  "layout": {
    "span": 12
  },
  "componentProps": {
    "filterable": true,
    "clearable": true
  },
  "options": {
    "data": [
      { "label": "启用", "value": "1" },
      { "label": "停用", "value": "0" }
    ]
  },
  "listFormatter": {
    "type": "dict",
    "dictCode": "STATUS"
  }
}
```

#### 2.2.3 字典组件 (dict-select/dict-radio/dict-checkbox)

```json
{
  "placeholder": "请选择注销状态",
  "display": {
    "showInForm": true,
    "showInList": true,
    "showInQuery": true,
    "columnWidth": 100
  },
  "layout": {
    "span": 12
  },
  "componentProps": {
    "dictCode": "ZXBS",
    "filterable": true
  },
  "listFormatter": {
    "type": "dict",
    "dictCode": "ZXBS"
  }
}
```

#### 2.2.4 日期选择 (date/datetime/daterange)

**基础配置**：
```json
{
  "placeholder": "请选择日期",
  "display": {
    "showInForm": true,
    "showInList": true,
    "showInQuery": true,
    "columnWidth": 150
  },
  "layout": {
    "span": 12
  },
  "componentProps": {
    "type": "date",
    "format": "yyyy-MM-dd",
    "valueFormat": "yyyy-MM-dd",
    "clearable": true
  },
  "listFormatter": {
    "type": "date",
    "format": "yyyy-MM-dd"
  }
}
```

**日期默认为今天**：
```json
{
  "placeholder": "请选择日期",
  "defaultValueType": "today",
  "display": {
    "showInForm": true,
    "showInList": true
  },
  "validation": {
    "required": true,
    "message": "日期不能为空",
    "trigger": "change"
  }
}
```

#### 2.2.5 文本域 (textarea)

```json
{
  "placeholder": "请输入备注",
  "display": {
    "showInForm": true,
    "showInList": false
  },
  "layout": {
    "span": 24
  },
  "componentProps": {
    "rows": 3,
    "maxlength": 500,
    "showWordLimit": true
  }
}
```

#### 2.2.6 数字输入 (number)

```json
{
  "placeholder": "请输入年龄",
  "display": {
    "showInForm": true,
    "showInList": true,
    "columnWidth": 80
  },
  "layout": {
    "span": 12
  },
  "validation": {
    "required": true
  },
  "componentProps": {
    "min": 0,
    "max": 150,
    "precision": 0,
    "step": 1
  }
}
```

#### 2.2.7 机构选择 (organ)

```json
{
  "placeholder": "请选择机构",
  "display": {
    "showInForm": true,
    "showInList": true,
    "showInQuery": true,
    "columnWidth": 150
  },
  "layout": {
    "span": 12
  },
  "componentProps": {
    "multiple": false,        // 是否启用多选
    "filterCode": "",        // 筛选编码（过滤特定机构）
    "showLevel": "",         // 只能显示到的级别（如：2表示只显示到二级）
    "checkLevel": "",        // 可选择的级别（支持单个或数组，如 "2" 或 [1, 2]）
    "checkFinalLevel": false, // 是否只能选择最后一级
    "clearable": true        // 是否可清空
  }
}
```

**多选配置示例**：
```json
{
  "placeholder": "请选择多个机构",
  "componentProps": {
    "multiple": true,
    "clearable": true
  }
}
```

**级别限制示例**：
```json
{
  "placeholder": "请选择县区",
  "componentProps": {
    "showLevel": "3",        // 只显示到三级
    "checkLevel": "3",       // 只允许选择三级
    "checkFinalLevel": true   // 必须选最后一级
  }
}
```

#### 2.2.8 地区选择 (region)

```json
{
  "placeholder": "请选择地区",
  "display": {
    "showInForm": true,
    "showInList": true,
    "columnWidth": 150
  },
  "layout": {
    "span": 12
  },
  "componentProps": {
    "level": 3,
    "multiple": false
  }
}
```

#### 2.2.9 计算字段（只读）

**百分比计算**：
```json
{
  "placeholder": "自动计算",
  "display": {
    "showInForm": true,
    "showInList": true,
    "columnWidth": 90
  },
  "layout": {
    "span": 12
  },
  "computed": {
    "enabled": true,
    "type": "percent",
    "numerator": "pass_num",
    "denominator": "total_num",
    "precision": 2
  },
  "componentProps": {
    "disabled": true,
    "readonly": true
  }
}
```

**字段相加**：
```json
{
  "computed": {
    "enabled": true,
    "type": "sum",
    "fields": ["field1", "field2", "field3"]
  },
  "componentProps": {
    "disabled": true,
    "readonly": true
  }
}
```

**字段相减**：
```json
{
  "computed": {
    "enabled": true,
    "type": "subtract",
    "field1": "total_num",
    "field2": "pass_num"
  },
  "componentProps": {
    "disabled": true,
    "readonly": true
  }
}
```

#### 2.2.10 字段比较验证

**小于等于验证**：
```json
{
  "placeholder": "请输入不合格数",
  "display": {
    "showInForm": true,
    "showInList": true
  },
  "validation": {
    "required": true,
    "message": "不合格数不能为空",
    "trigger": "blur",
    "compare": {
      "type": "lte",
      "field": "total_num",
      "fieldLabel": "抽查总数"
    }
  }
}
```

**大于等于验证**：
```json
{
  "validation": {
    "compare": {
      "type": "gte",
      "field": "min_value",
      "fieldLabel": "最小值"
    }
  }
}
```

## 三、列配置 (columnConfig JSON)

### 3.1 完整配置结构

```json
{
  // ========== 样式配置 ==========
  "style": {
    "color": "#409EFF",
    "fontWeight": "bold",
    "background": "#f5f7fa",
    "cursor": "pointer"
  },
  
  // ========== 点击配置 ==========
  "clickable": {
    "enabled": true,         // 是否可点击
    "formId": "FORM001",     // 关联的表单ID
    "openType": "dialog",    // 打开方式: dialog/drawer/page
    "dialogWidth": "80%"     // 弹窗宽度
  },
  
  // ========== 格式化配置 ==========
  "formatter": {
    "type": "number",        // 类型: number/percent/date/dict/custom
    "precision": 2,          // 小数位数
    "suffix": "%",           // 后缀
    "prefix": "¥",           // 前缀
    "dateFormat": "yyyy-MM-dd", // 日期格式
    "dictCode": "ZXBS",      // 字典编码
    "customFn": ""           // 自定义函数名
  },
  
  // ========== 条件样式配置 ==========
  "conditional": {
    "rules": [
      {
        "condition": "value > 90",  // 条件表达式
        "style": {
          "color": "#67C23A"        // 绿色(良好)
        }
      },
      {
        "condition": "value < 60",
        "style": {
          "color": "#F56C6C"        // 红色(差)
        }
      }
    ]
  },
  
  // ========== 自定义渲染配置 ==========
  "render": {
    "type": "badge",         // 渲染类型: text/badge/link/button/tag/progress
    "props": {               // 渲染组件属性
      "type": "success"
    }
  }
}
```

### 3.2 常见场景配置示例

#### 3.2.1 可点击列(打开明细)

```json
{
  "clickable": {
    "enabled": true,
    "formId": "PERSON_FORM",
    "openType": "dialog",
    "dialogWidth": "80%"
  },
  "style": {
    "color": "#409EFF",
    "cursor": "pointer",
    "textDecoration": "underline"
  },
  "formatter": {
    "type": "number",
    "precision": 0
  }
}
```

#### 3.2.2 百分比显示+条件颜色

```json
{
  "formatter": {
    "type": "percent",
    "precision": 2,
    "suffix": "%"
  },
  "conditional": {
    "rules": [
      {
        "condition": "value >= 90",
        "style": { "color": "#67C23A" }
      },
      {
        "condition": "value >= 60 && value < 90",
        "style": { "color": "#E6A23C" }
      },
      {
        "condition": "value < 60",
        "style": { "color": "#F56C6C" }
      }
    ]
  }
}
```

#### 3.2.3 日期格式化

```json
{
  "formatter": {
    "type": "date",
    "dateFormat": "yyyy-MM-dd HH:mm:ss"
  }
}
```

#### 3.2.4 字典翻译

```json
{
  "formatter": {
    "type": "dict",
    "dictCode": "ZXBS"
  }
}
```

## 四、数据流转说明

### 4.1 配置加载流程

```
1. 加载表单配置 (SYS_FORM_CONFIG)
   ↓
2. 加载表单项配置列表 (SYS_FORM_ITEM_CONFIG)
   ↓
3. 解析每个表单项的 itemConfig JSON
   ↓
4. 根据 display 配置筛选字段:
   - showInQuery=true → 构建查询表单
   - showInForm=true → 构建新增/编辑表单
   - showInList=true → 构建列表列
   ↓
5. 根据 layout.span 控制表单布局
   ↓
6. 渲染动态表单/列表
```

### 4.2 二级明细打开流程

```
1. 用户点击配置了 clickable.formId 的列
   ↓
2. 读取 clickable 配置获取 formId
   ↓
3. 根据 formId 加载表单配置和表单项配置
   ↓
4. 根据 openType 决定打开方式(dialog/drawer/page)
   ↓
5. 展示二级明细弹窗(包含查询表单+列表+新增编辑表单)
```

## 五、最佳实践

### 5.1 布局建议

- **输入框、下拉框、日期选择**: span=12 (一行2个)
- **文本域、JSON编辑器**: span=24 (独占一行)
- **地区选择、机构选择**: span=12
- **短字段(如年龄、数量)**: span=12
- **长字段(如描述、备注)**: span=24

### 5.2 验证规则

- 必填字段必须设置 `validation.required=true`
- 长度限制同时设置 `validation.maxLength` 和 `componentProps.maxlength`
- 特殊格式使用 `validation.pattern` 正则验证

### 5.3 列表显示

- 查询字段应同时设置 `showInQuery=true` 和 `showInList=true`
- 列宽根据内容合理设置,避免过宽或过窄
- 内容较长的字段设置 `showOverflowTooltip=true`

### 5.4 字典字段

- 统一使用 HDty 字典组件 (dict-select/dict-radio/dict-checkbox)
- 列表展示时配置 `listFormatter.type="dict"` 自动翻译
- dictCode 要与系统字典类型一致

### 5.5 计算字段

- 计算字段必须设置 `disabled: true, readonly: true`
- 使用 `type` 指定计算类型，避免复杂公式
- 支持的计算类型：
  - `percent` - 百分比：(分子/分母*100).toFixed(precision) + "%"
  - `sum` - 求和：多个字段相加
  - `subtract` - 相减：field1 - field2
  - `multiply` - 相乘：field1 * field2
  - `divide` - 相除：field1 / field2

### 5.6 字段间验证

- 使用 `validation.compare` 配置字段间比较验证
- 支持的比较类型：
  - `lt` - 小于（<）
  - `lte` - 小于等于（<=），提示"应不大于"
  - `gt` - 大于（>）
  - `gte` - 大于等于（>=），提示"应不小于"
  - `eq` - 等于（==）
  - `ne` - 不等于（!=）
- 必须提供 `fieldLabel` 用于错误提示

### 5.7 日期默认值

- 使用 `defaultValueType: "today"` 设置日期默认为今天
- 格式自动为 yyyy-MM-dd
- 仅在新增模式下生效

## 六、计算字段详细说明

### 6.1 百分比计算 (percent)

```json
{
  "computed": {
    "enabled": true,
    "type": "percent",
    "numerator": "pass_num",    // 分子字段
    "denominator": "total_num", // 分母字段
    "precision": 2               // 保留小数位数
  }
}
```

计算逻辑：`(numerator / denominator * 100).toFixed(precision) + "%"`

示例：pass_num=85, total_num=100 → 结果："85.00%"

### 6.2 求和计算 (sum)

```json
{
  "computed": {
    "enabled": true,
    "type": "sum",
    "fields": ["field1", "field2", "field3"]
  }
}
```

计算逻辑：`field1 + field2 + field3`

### 6.3 相减计算 (subtract)

```json
{
  "computed": {
    "enabled": true,
    "type": "subtract",
    "field1": "total_num",
    "field2": "pass_num"
  }
}
```

计算逻辑：`field1 - field2`

### 6.4 相乘计算 (multiply)

```json
{
  "computed": {
    "enabled": true,
    "type": "multiply",
    "field1": "price",
    "field2": "quantity",
    "precision": 2
  }
}
```

计算逻辑：`(field1 * field2).toFixed(precision)`

### 6.5 相除计算 (divide)

```json
{
  "computed": {
    "enabled": true,
    "type": "divide",
    "field1": "total_amount",
    "field2": "quantity",
    "precision": 2
  }
}
```

计算逻辑：`(field1 / field2).toFixed(precision)`

## 七、字段比较验证详细说明

### 7.1 比较类型说明

| 类型  | 说明     | 提示文案   | 示例                     |
| ----- | -------- | ---------- | ------------------------ |
| `lt`  | 小于     | "应小于"   | 不及格分数应小于60       |
| `lte` | 小于等于 | "应不大于" | 不合格数应不大于抽查总数 |
| `gt`  | 大于     | "应大于"   | 及格分数应大于60         |
| `gte` | 大于等于 | "应不小于" | 销售额应不小于成本       |
| `eq`  | 等于     | "应等于"   | 确认密码应等于密码       |
| `ne`  | 不等于   | "应不等于" | 新密码应不等于旧密码     |

### 7.2 验证配置示例

```json
{
  "validation": {
    "required": true,
    "message": "不合格数不能为空",
    "trigger": "blur",
    "compare": {
      "type": "lte",
      "field": "check_total_num",
      "fieldLabel": "抽查总数"
    }
  }
}
```

验证失败时提示："不合格数应不大于抽查总数"

## 八、注意事项

1. **JSON格式**: 所有配置必须是合法的JSON格式
2. **向后兼容**: 新增配置字段不影响旧数据
3. **默认值**: 未配置的字段使用合理的默认值
4. **校验**: 保存前校验JSON格式是否正确
5. **性能**: 避免在 itemConfig 中存储大量数据
6. **计算字段**: 必须设置 `disabled: true, readonly: true`
7. **比较验证**: 必须提供 `fieldLabel` 用于错误提示
8. **日期默认值**: `defaultValueType: "today"` 仅在新增模式生效

# 九、参数传递与字段映射配置

### 9.1 场景说明

从统计列表页点击进入二级明细页面时，需要将统计列表的查询参数传递到明细页面，并自动初始化查询条件。

### 9.2 表单配置 (formConfig JSON)

在 `SYS_FORM_CONFIG` 表的 `formConfig` 字段中添加参数映射配置：

```json
{
  // ========== 参数映射配置 ==========
  "paramMapping": {
    "enabled": true,           // 是否启用参数映射
    "mappings": [
      {
        "sourceType": "query",   // 参数来源：query(统计列表查询参数) | row(点击的行数据)
        "sourceProp": "checkDate",  // 来源字段名
        "targetProp": "check_date", // 目标字段名（明细表单的查询字段）
        "required": false        // 是否必传
      },
      {
        "sourceType": "query",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": false
      },
      {
        "sourceType": "row",      // 从点击的行数据中取值
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": true,         // 必须传递（覆盖query中的同名字段）
        "priority": 1             // 优先级：数字越大优先级越高
      }
    ]
  }
}
```

### 9.3 配置字段说明

| 字段         | 类型    | 说明                           | 示例            |
| ------------ | ------- | ------------------------------ | --------------- |
| `enabled`    | Boolean | 是否启用参数映射               | `true`          |
| `mappings`   | Array   | 映射规则数组                   | 见下文          |
| `sourceType` | String  | 参数来源类型                   | `query`\|`row`  |
| `sourceProp` | String  | 来源字段名                     | `checkDate`     |
| `targetProp` | String  | 目标字段名（明细表单字段prop） | `check_date`    |
| `required`   | Boolean | 是否必传                       | `true`\|`false` |
| `priority`   | Number  | 优先级（可选，默认0）          | `1`             |

### 9.4 参数来源类型

- **`query`**: 从统计列表的查询参数中获取
  - 例如：抽查日期范围、机构级别等查询条件
  - 对应 `StatQuery.vue` 的 `queryData`

- **`row`**: 从点击的行数据中获取
  - 例如：当前行的机构ID、机构名称等
  - 对应 `handleCellClick(column, row)` 的 `row` 参数

### 9.5 优先级规则

当同一个 `targetProp` 存在多个映射规则时：
1. 按 `priority` 降序排列（数字越大优先级越高）
2. 优先级相同时，`row` 类型优先于 `query` 类型
3. 后定义的规则覆盖先定义的规则

### 9.6 完整配置示例

**场景**：从"抽查核查统计"点击机构进入"人员抽查明细"

```json
{
  "paramMapping": {
    "enabled": true,
    "mappings": [
      {
        "sourceType": "query",
        "sourceProp": "checkDate",
        "targetProp": "check_date",
        "required": false
      },
      {
        "sourceType": "query",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": false
      },
      {
        "sourceType": "row",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": true,
        "priority": 1
      },
      {
        "sourceType": "row",
        "sourceProp": "orgName",
        "targetProp": "org_name",
        "required": false
      }
    ]
  }
}
```

**说明**：
- `checkDate` 从统计列表查询条件传递到明细页的 `check_date` 字段
- `orgId` 优先使用点击行的机构ID（priority=1），没有时使用查询条件的机构ID
- `orgName` 从点击行获取机构名称

## 9.7 数据流转说明

```
1. 用户在统计列表页查询
   queryData: { checkDate: ['2024-01-01', '2024-01-31'], orgId: '150602000000' }
   ↓
2. 点击某一行的可点击列
   row: { orgId: '150602010000', orgName: '东胜分局', ... }
   ↓
3. 根据 formConfig.paramMapping 执行映射
   {
     check_date: ['2024-01-01', '2024-01-31'],  // 来自 query.checkDate
     org_id: '150602010000',                     // 来自 row.orgId (优先级高)
     org_name: '东胜分局'                         // 来自 row.orgName
   }
   ↓
4. 传递给 DetailDialog 组件
   <DetailDialog :init-params="mappedParams" />
   ↓
5. DetailListView 接收并初始化查询字段
   queryData[field.prop] = initParams[field.prop]
   ↓
6. 自动执行一次查询
   loadList()
```

### 9.8 配置步骤

**步骤1：在表单配置中添加参数映射**

进入"表单配置管理"，编辑需要接收参数的表单（如"人员抽查明细表单"），在 `formConfig` JSON字段中添加：

```json
{
  "paramMapping": {
    "enabled": true,
    "mappings": [
      {
        "sourceType": "query",
        "sourceProp": "checkDate",
        "targetProp": "check_date"
      },
      {
        "sourceType": "row",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "priority": 1
      }
    ]
  }
}
```

**步骤2：确保目标字段存在**

在表单项配置中，确保 `targetProp` 对应的字段存在且 `showInQuery=true`：

```json
{
  "itemLabel": "抽查日期",
  "itemProp": "check_date",
  "itemType": "daterange",
  "itemConfig": {
    "display": {
      "showInQuery": true,
      "showInList": true
    }
  }
}
```

**步骤3：测试参数传递**

1. 在统计列表页设置查询条件（如选择日期范围）
2. 点击某一行的可点击列
3. 检查明细弹窗的查询条件是否自动填充
4. 查看浏览器控制台日志确认参数映射是否成功

**步骤4：调试技巧**

打开浏览器开发者工具，在控制台查看以下日志：

```
StatQuery - 查询参数: { checkDate: [...], orgId: '...' }
参数映射结果: { 原始参数: {...}, 映射规则: [...], 映射后: {...} }
应用初始参数: { check_date: [...], org_id: '...' }
设置查询参数: check_date = [...]
设置查询参数: org_id = '...'
```

# 十、完整配置示例

### 10.1 带参数映射的表单配置完整示例

**场景**：从"抽查核查统计"点击机构，打开"人员抽查明细"，自动带入抽查日期和机构条件

**表单配置（SYS_FORM_CONFIG.formConfig）**：

```json
{
  "paramMapping": {
    "enabled": true,
    "mappings": [
      {
        "sourceType": "query",
        "sourceProp": "checkDate",
        "targetProp": "check_date",
        "required": false
      },
      {
        "sourceType": "query",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": false
      },
      {
        "sourceType": "row",
        "sourceProp": "orgId",
        "targetProp": "org_id",
        "required": true,
        "priority": 1
      }
    ]
  }
}
```

**表单项配置（SYS_FORM_ITEM_CONFIG）**：

```json
[
  {
    "itemLabel": "抽查日期",
    "itemProp": "check_date",
    "itemType": "daterange",
    "tableKey": "F_CHECK_DATE",
    "itemConfig": {
      "display": {
        "showInQuery": true,
        "showInList": true,
        "showInForm": true,
        "columnWidth": 180
      },
      "layout": {
        "span": 12
      },
      "componentProps": {
        "type": "daterange",
        "format": "yyyy-MM-dd",
        "valueFormat": "yyyy-MM-dd"
      }
    }
  },
  {
    "itemLabel": "抽查机构",
    "itemProp": "org_id",
    "itemType": "organ",
    "tableKey": "F_ORG_ID",
    "itemConfig": {
      "display": {
        "showInQuery": true,
        "showInList": true,
        "showInForm": true,
        "columnWidth": 150
      },
      "layout": {
        "span": 12
      },
      "validation": {
        "required": true,
        "message": "请选择抽查机构"
      },
      "componentProps": {
        "clearable": true
      }
    }
  },
  {
    "itemLabel": "人员姓名",
    "itemProp": "person_name",
    "itemType": "input",
    "tableKey": "F_PERSON_NAME",
    "itemConfig": {
      "placeholder": "请输入人员姓名",
      "display": {
        "showInQuery": true,
        "showInList": true,
        "showInForm": true,
        "columnWidth": 120
      },
      "layout": {
        "span": 12
      },
      "validation": {
        "required": true,
        "maxLength": 50
      }
    }
  },
  {
    "itemLabel": "检查结果",
    "itemProp": "check_result",
    "itemType": "dictSelect",
    "dicType": "CHECK_RESULT",
    "tableKey": "F_CHECK_RESULT",
    "itemConfig": {
      "placeholder": "请选择检查结果",
      "display": {
        "showInQuery": true,
        "showInList": true,
        "showInForm": true,
        "columnWidth": 100
      },
      "layout": {
        "span": 12
      },
      "componentProps": {
        "dictCode": "CHECK_RESULT"
      },
      "listFormatter": {
        "type": "dict",
        "dictCode": "CHECK_RESULT"
      }
    }
  }
]
```

**数据流转示例**：

```
// 1. 统计列表查询参数
queryParams = {
  orgId: "150602000000",      // 市局
  orgLevel: "4",               // 查看分局级别
  checkDate: ["2024-01-01", "2024-01-31"]
}

// 2. 点击东胜分局的"人员检查数"列
row = {
  orgId: "150602010000",
  orgName: "东胜分局",
  checkTotal: 120,
  checkHg: 115,
  checkBhg: 5
}

// 3. 参数映射执行
mappedParams = {
  check_date: ["2024-01-01", "2024-01-31"],  // 来自 query.checkDate
  org_id: "150602010000"                      // 来自 row.orgId (优先级高，覆盖query)
}

// 4. 明细页面初始化查询条件
DetailListView.queryData = {
  check_date: ["2024-01-01", "2024-01-31"],
  org_id: "150602010000",
  person_name: "",      // 未映射，保持空
  check_result: "",     // 未映射，保持空
  createTime: [],
  zxbs: "0"
}

// 5. 自动执行查询，获取东胜分局在1月份的人员检查明细
```

### 10.2 抽查核查表单配置（原示例）

```json
[
  {
    "itemLabel": "抽查日期",
    "itemProp": "check_date",
    "itemType": "date",
    "itemConfig": {
      "defaultValueType": "today",
      "display": {
        "showInForm": true,
        "showInList": true
      },
      "validation": {
        "required": true,
        "trigger": "change"
      }
    }
  },
  {
    "itemLabel": "抽查总数",
    "itemProp": "check_total_num",
    "itemType": "input",
    "itemConfig": {
      "validation": {
        "required": true
      },
      "componentProps": {
        "maxlength": 10
      }
    }
  },
  {
    "itemLabel": "合格数",
    "itemProp": "check_hg_num",
    "itemType": "input",
    "itemConfig": {
      "validation": {
        "required": true
      }
    }
  },
  {
    "itemLabel": "不合格数",
    "itemProp": "check_bhg_num",
    "itemType": "input",
    "itemConfig": {
      "validation": {
        "required": true,
        "compare": {
          "type": "lte",
          "field": "check_total_num",
          "fieldLabel": "抽查总数"
        }
      }
    }
  },
  {
    "itemLabel": "合格率",
    "itemProp": "check_hg_rate",
    "itemType": "input",
    "itemConfig": {
      "computed": {
        "enabled": true,
        "type": "percent",
        "numerator": "check_hg_num",
        "denominator": "check_total_num",
        "precision": 2
      },
      "componentProps": {
        "disabled": true,
        "readonly": true
      }
    }
  },
  {
    "itemLabel": "不合格率",
    "itemProp": "check_bhg_rate",
    "itemType": "input",
    "itemConfig": {
      "computed": {
        "enabled": true,
        "type": "percent",
        "numerator": "check_bhg_num",
        "denominator": "check_total_num",
        "precision": 2
      },
      "componentProps": {
        "disabled": true,
        "readonly": true
      }
    }
  }
]
```

---

**文档版本**: v1.2  
**最后更新**: 2025-12-04  
**更新内容**: 新增参数传递与字段映射配置（九、参数传递与字段映射配置）  
**维护人员**: AI助手
