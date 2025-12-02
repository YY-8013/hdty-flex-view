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
    "validator": ""           // 自定义校验器函数名
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
    "showLevel": true,       // 显示层级
    "filterCode": "",        // 过滤编码
    
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
    "showLevel": true,
    "multiple": false
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

## 六、注意事项

1. **JSON格式**: 所有配置必须是合法的JSON格式
2. **向后兼容**: 新增配置字段不影响旧数据
3. **默认值**: 未配置的字段使用合理的默认值
4. **校验**: 保存前校验JSON格式是否正确
5. **性能**: 避免在 itemConfig 中存储大量数据

---

**文档版本**: v1.0  
**最后更新**: 2025-12-02  
**维护人员**: AI助手
