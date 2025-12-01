# 表单配置管理模块

## 📋 模块说明

本模块用于管理系统中的动态表单配置，支持表单的新增、编辑、查询、详情查看和注销等功能。

## 📂 文件结构

```
form/
├── api/
│   └── index.js           # API接口定义
├── index.vue              # 列表页面
├── FormAdd.vue            # 新增页面
├── FormEdit.vue           # 编辑页面
├── FormDetail.vue         # 详情页面
├── FormLogout.vue         # 注销页面
├── constants.js           # 常量定义
└── README.md              # 本文档
```

## 🔌 接口说明

### API 路径前缀
`/web/sjls/sysFormConfig`

### 接口列表

| 接口名称   | 路径            | 方法 | 说明                 |
| ---------- | --------------- | ---- | -------------------- |
| 分页列表   | `/page`         | POST | 获取表单配置分页列表 |
| 新增       | `/add`          | POST | 新增表单配置         |
| 编辑前查询 | `/editBefore`   | POST | 编辑前获取详情       |
| 编辑       | `/edit`         | POST | 编辑表单配置         |
| 详情       | `/detail`       | POST | 获取表单配置详情     |
| 注销       | `/logout`       | POST | 注销表单配置         |
| 删除       | `/singleDelete` | POST | 删除表单配置         |
| 导出       | `/exports`      | POST | 导出表单配置         |

## 📊 数据字段说明

### 基本信息

| 字段名      | 类型        | 必填 | 说明                                |
| ----------- | ----------- | ---- | ----------------------------------- |
| formCode    | String(100) | 是   | 表单编码，唯一标识                  |
| formName    | String(200) | 是   | 表单名称                            |
| formType    | String(50)  | 是   | 表单类型：COMMON-通用/CUSTOM-自定义 |
| dataTable   | String(100) | 是   | 数据存储表名，默认BIZ_DATA_COMMON   |
| description | String(500) | 否   | 表单说明                            |
| version     | Number      | 否   | 版本号（系统自动维护）              |

### 表单配置

| 字段名     | 类型 | 必填 | 说明               |
| ---------- | ---- | ---- | ------------------ |
| formConfig | CLOB | 否   | 表单级别的JSON配置 |

### 系统字段

| 字段名         | 类型       | 说明                        |
| -------------- | ---------- | --------------------------- |
| zxbs           | String(1)  | 注销状态：0-未注销 1-已注销 |
| createUsername | String(50) | 创建人姓名                  |
| createTime     | String(14) | 创建时间                    |
| updateUsername | String(50) | 更新人姓名                  |
| updateTime     | String(14) | 更新时间                    |

## 🎨 页面功能

### 列表页面 (index.vue)

**功能特性：**
- 支持按表单名称、表单编码、表单类型、注销状态等条件查询
- 支持分页展示
- 展示表单编码、名称、类型、数据表、版本等信息
- 提供新增、编辑、详情、注销等操作

**查询条件：**
- 表单名称：模糊查询
- 表单编码：模糊查询
- 表单类型：精确查询
- 注销状态：精确查询
- 创建时间：范围查询

### 新增页面 (FormAdd.vue)

**功能分组：**
1. **基本信息**
   - 表单编码（必填）
   - 表单名称（必填）
   - 表单类型（必填，默认：COMMON）
   - 数据存储表（必填，默认：BIZ_DATA_COMMON）
   - 表单说明
   - 备注

2. **表单配置**
   - 表单配置JSON（使用 hd-json-editor 组件）

**特色功能：**
- 左侧锚点导航，快速定位到各个配置区域
- JSON 格式校验
- 表单验证提示

### 编辑页面 (FormEdit.vue)

**功能说明：**
- 与新增页面相同的表单结构
- 自动加载表单详情数据
- 支持修改除表单编码外的所有字段

### 详情页面 (FormDetail.vue)

**功能说明：**
- 只读展示表单配置的所有信息
- 分组展示：基本信息、表单配置、操作信息
- JSON 配置格式化展示
- 显示创建人、创建时间、更新人、更新时间等操作信息
- 显示注销状态及注销原因（如已注销）

### 注销页面 (FormLogout.vue)

**功能说明：**
- 显示要注销的表单名称
- 必须填写注销原因
- 注销后数据不会物理删除，仅标记为已注销
- 已注销的记录不可编辑

## 🔧 常量定义 (constants.js)

```javascript
// 表单类型选项
FORM_TYPE_OPTIONS = [
  { label: "通用表单", value: "COMMON" },
  { label: "自定义表单", value: "CUSTOM" }
]

// 数据表选项
DATA_TABLE_OPTIONS = [
  { label: "通用数据表(BIZ_DATA_COMMON)", value: "BIZ_DATA_COMMON" },
  { label: "自定义数据表", value: "CUSTOM" }
]
```

## 💡 使用示例

### 1. 创建通用表单

```javascript
{
  "formCode": "CHECK_RECORD",
  "formName": "抽查记录表单",
  "formType": "COMMON",
  "dataTable": "BIZ_DATA_COMMON",
  "description": "用于录入抽查相关信息"
}
```

### 2. 创建自定义分表表单

```javascript
{
  "formCode": "DISPUTE_RECORD",
  "formName": "矛盾纠纷表单",
  "formType": "CUSTOM",
  "dataTable": "BIZ_DATA_DISPUTE",
  "description": "单独分表存储矛盾纠纷数据"
}
```

### 3. 表单配置 JSON 示例

```json
{
  "layout": {
    "labelWidth": "120px",
    "size": "medium"
  },
  "validation": {
    "showMessage": true,
    "inline": false
  },
  "submit": {
    "text": "提交",
    "loading": true
  }
}
```

## 📝 数据库对应表

- **表名**：SYS_FORM_CONFIG
- **主键**：ID
- **唯一键**：FORM_CODE

详细表结构请参考：`dev-document/01-数据库设计文档.md`

## 🔗 关联模块

- **表单组件配置模块** (formItem)：管理表单中的具体字段组件
- **列配置模块** (column)：管理数据列表的列配置

## ⚠️ 注意事项

1. **表单编码唯一性**：表单编码必须全局唯一，建议使用大写字母+下划线命名
2. **数据表配置**：如使用自定义数据表，需确保该表已创建且结构符合要求
3. **版本管理**：版本号由系统自动维护，每次编辑会自动递增
4. **注销操作**：注销后的表单配置不可恢复，请谨慎操作
5. **JSON格式**：formConfig 字段必须是有效的 JSON 格式

## 🛠️ 开发者备注

- 本模块使用 HDty 框架的标准组件和规范
- 遵循项目的编码规范和命名规范
- API 接口需要后端相应接口支持
- Mock 数据可用于前端独立开发和测试

## 📅 更新日志

| 版本  | 日期       | 说明                             |
| ----- | ---------- | -------------------------------- |
| 1.0.0 | 2025-11-28 | 初始版本，实现基本的增删改查功能 |

---

**维护者**: 开发团队  
**最后更新**: 2025-11-28
