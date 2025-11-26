# 数据晾晒功能模块 (Flex-View)

## 📋 模块说明

本模块是数据晾晒统计系统的前端实现，基于 HDty 框架开发，支持高度可配置的数据统计展示、动态表单录入和灵活的配置管理。

**⚠️ 重要提示**: 所有数据晾晒相关的代码都集中在 `flex-view` 目录下，**不要在其他业务目录创建相关文件**，以免影响其他业务模块。

---

## 📁 目录结构

```
src/views/business/flex-view/          # 数据晾晒模块根目录（所有代码都在这里）
│
├── stat/                              # 统计展示模块
│   ├── index.vue                      # 统计列表主页（个性化实现，不用 DynamicTable）
│   └── components/                    # 统计页面专用组件
│       ├── StatTable.vue              # 统计表格组件（基于 el-table，个性化定制）
│       ├── StatQuery.vue              # 统计查询组件
│       └── DetailDialog.vue           # 明细数据弹窗（内含明细列表和新增表单）
│           ├── DetailList.vue         # 明细列表（使用 DynamicTable）
│           └── DetailForm.vue         # 明细表单（使用 DynamicForm）
│
├── config/                            # 配置管理模块
│   ├── column/                        # 列配置管理
│   │   ├── index.vue                  # 列配置主页
│   │   └── components/
│   │       ├── ColumnTree.vue         # 列树形编辑器
│   │       └── ColumnEditor.vue       # 列属性编辑器
│   │
│   └── form/                          # 表单配置管理
│       ├── index.vue                  # 表单配置列表
│       ├── form-edit.vue              # 表单编辑页
│       └── components/
│           ├── FormItemList.vue       # 表单项列表
│           └── FormItemEditor.vue     # 表单项编辑器
│
├── components/                        # 组件目录（flex-view 专用）
│   └── common/                        # 通用组件
│       ├── DynamicTable/              # 动态表格组件（核心）
│       │   ├── index.vue              # 主组件
│       │   ├── ColumnRender.vue       # 列递归渲染器
│       │   └── CellRender.vue         # 单元格渲染器
│       │
│       └── DynamicForm/               # 动态表单组件（核心）
│           ├── index.vue              # 主组件
│           ├── FormItem.vue           # 表单项组件
│           └── FieldRender.vue        # 字段渲染器（复用 HDty 组件）
│
├── api/                               # API 接口（flex-view 专用）
│   ├── column.js                      # 列配置 API
│   ├── form.js                        # 表单配置 API
│   ├── form-item.js                   # 表单项配置 API
│   ├── stat-data.js                   # 统计数据 API
│   └── biz-data.js                    # 业务数据 API
│
├── store/                             # Vuex 状态管理（flex-view 专用）
│   ├── column.js                      # 列配置状态
│   ├── form.js                        # 表单配置状态
│   └── stat.js                        # 统计数据状态
│
├── utils/                             # 工具函数（flex-view 专用）
│   ├── column-tree.js                 # 列树形结构处理
│   ├── form-render.js                 # 表单渲染工具
│   ├── stat-calc.js                   # 统计计算工具
│   └── validators.js                  # 自定义验证器
│
└── README.md                          # 本文件（模块说明）
```

---

## 🎯 设计原则

### 1. 模块隔离原则

- ✅ **所有代码都在 `flex-view` 目录下**: 组件、API、状态管理、工具函数等
- ✅ **不污染全局**: 不在 `src/components`、`src/api`、`src/store/modules` 等全局目录创建文件
- ✅ **独立性**: 其他业务模块不会受到 flex-view 的影响

### 2. 组件复用原则

**✅ 可直接复用的 HDty 组件**:
- `hd-date-picker` - 日期选择组件
- `hd-organ` - 机构选择组件
- `hd-region` - 地区选择组件
- `hd-dict-select` - 字典下拉选择
- `hd-dict-cascader` - 字典级联选择
- `hd-dict-checkbox` - 字典多选框
- `hd-dict-radio` - 字典单选框

**🔴 需自研开发（在 `components/common` 下）**:
- **DynamicTable** - 动态表格组件（不使用 `hd-build-table`）
- **DynamicForm** - 动态表单组件（不使用 `hd-form`，但内部复用 HDty 字段组件）

---

## 🔧 核心组件说明

### 1. DynamicTable（动态表格组件）

**路径**: `components/common/DynamicTable/`

**⚠️ 使用场景**: **二级明细列表**（不用于统计列表页）

**功能**:
- ✅ 基于配置动态渲染表格
- ✅ 支持分页、排序、筛选
- ✅ 列配置热更新
- ✅ 支持多种列类型（文本、数字、日期、字典等）
- ✅ 支持操作列（编辑、删除按钮）

**设计思路**:
- 🔴 不使用 `hd-build-table`，因为后期会有大量自定义需求
- ✅ 基于 Element-UI 的 `el-table` 自研
- ✅ 支持配置驱动，完全基于 JSON 配置渲染
- ✅ 主要用于明细数据的展示和管理

**使用示例**:
```vue
<template>
  <!-- 在明细弹窗中使用 -->
  <DetailDialog>
    <DynamicTable
      :columns="detailColumns"
      :data="detailData"
      :pagination="pagination"
      @edit="handleEdit"
      @delete="handleDelete"
    />
  </DetailDialog>
</template>

<script>
import DynamicTable from '../components/common/DynamicTable'

export default {
  components: { DynamicTable },
  data() {
    return {
      detailColumns: [], // 明细列配置
      detailData: [],    // 明细数据
      pagination: { current: 1, pageSize: 10, total: 0 }
    }
  }
}
</script>
```

### 2. DynamicForm（动态表单组件）

**路径**: `components/common/DynamicForm/`

**⚠️ 使用场景**: **明细数据新增/编辑表单**

**功能**:
- ✅ 基于配置动态渲染表单
- ✅ 支持多种字段类型（基础字段 + HDty 组件）
- ✅ 支持字段联动（显示/隐藏、必填、禁用）
- ✅ 支持复杂布局（行列布局、分组）
- ✅ 支持自定义验证规则
- ✅ 支持表单提交和重置

**设计思路**:
- 🔴 不使用 `hd-form`，因为后期会有大量自定义需求
- ✅ 基于 Element-UI 的 `el-form` 自研
- ✅ **内部复用 HDty 字段组件**（通过 `FieldRender.vue`）:
  - `hd-date-picker` - 日期选择
  - `hd-organ` - 机构选择
  - `hd-region` - 地区选择
  - `hd-dict-*` - 字典选择系列

**使用示例**:
```vue
<template>
  <!-- 在明细弹窗中使用 -->
  <DetailDialog>
    <DynamicForm
      ref="detailForm"
      :form-config="formConfig"
      :form-data.sync="formData"
      @submit="handleSubmit"
    />
  </DetailDialog>
</template>

<script>
import DynamicForm from '../components/common/DynamicForm'

export default {
  components: { DynamicForm },
  data() {
    return {
      formConfig: [], // 表单配置（从后端获取）
      formData: {}    // 表单数据
    }
  },
  methods: {
    handleSubmit(data) {
      // 保存明细数据
    }
  }
}
</script>
```

---

## 📊 API 接口规范

### 接口路径前缀

```javascript
/api/flex-view/
```

### 接口清单

**列配置相关** (`api/column.js`):
```javascript
GET    /api/flex-view/column/tree      // 获取列树形结构
POST   /api/flex-view/column/save      // 保存列配置
DELETE /api/flex-view/column/:id       // 删除列配置
```

**表单配置相关** (`api/form.js`):
```javascript
GET    /api/flex-view/form/list        // 获取表单列表
GET    /api/flex-view/form/:id         // 获取表单详情
POST   /api/flex-view/form/save        // 保存表单配置
DELETE /api/flex-view/form/:id         // 删除表单配置
```

**表单项配置** (`api/form-item.js`):
```javascript
GET    /api/flex-view/form-item/list   // 获取表单项列表
POST   /api/flex-view/form-item/save   // 保存表单项配置
```

**统计数据** (`api/stat-data.js`):
```javascript
GET    /api/flex-view/stat/data        // 获取统计数据
POST   /api/flex-view/stat/refresh     // 刷新统计数据
GET    /api/flex-view/stat/export      // 导出统计数据
```

**业务数据** (`api/biz-data.js`):
```javascript
GET    /api/flex-view/biz-data/list    // 获取业务数据列表
GET    /api/flex-view/biz-data/:id     // 获取业务数据详情
POST   /api/flex-view/biz-data/save    // 保存业务数据
DELETE /api/flex-view/biz-data/:id     // 删除业务数据
```

---

## 🗂️ 状态管理（Vuex）

### 模块路径

所有状态管理文件都在 `store/` 目录下：

**1. column.js** - 列配置状态
```javascript
{
  state: {
    columnCache: {},        // 列配置缓存
    cacheTime: null,        // 缓存时间
    cacheExpire: 5 * 60 * 1000  // 缓存有效期 5分钟
  },
  getters: {},
  mutations: {},
  actions: {}
}
```

**2. form.js** - 表单配置状态
```javascript
{
  state: {
    formCache: {},          // 表单配置缓存
    cacheTime: null,
    cacheExpire: 5 * 60 * 1000
  },
  getters: {},
  mutations: {},
  actions: {}
}
```

**3. stat.js** - 统计数据状态
```javascript
{
  state: {
    statData: [],           // 统计数据
    queryParams: {},        // 查询参数
    cacheTime: null,
    cacheExpire: 1 * 60 * 1000  // 缓存有效期 1分钟
  },
  getters: {},
  mutations: {},
  actions: {}
}
```

### 注册到全局 Store

在 `src/store/index.js` 中注册：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'

// 导入 flex-view 模块
import flexViewColumn from '@/views/business/flex-view/store/column'
import flexViewForm from '@/views/business/flex-view/store/form'
import flexViewStat from '@/views/business/flex-view/store/stat'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    flexViewColumn,
    flexViewForm,
    flexViewStat
  }
})
```

---

## 🛠️ 工具函数

### 工具文件清单

**1. column-tree.js** - 列树形结构处理
```javascript
// 扁平数组转树形结构
export function arrayToTree(array, parentId = null) {}

// 树形结构转扁平数组
export function treeToArray(tree) {}

// 获取所有叶子节点
export function getLeafNodes(tree) {}
```

**2. form-render.js** - 表单渲染工具
```javascript
// 根据字段类型获取组件名称
export function getFieldComponent(fieldType) {}

// 解析字段配置
export function parseFieldConfig(config) {}
```

**3. stat-calc.js** - 统计计算工具
```javascript
// 计算统计值
export function calculateStat(data, config) {}

// 计算汇总行
export function calculateSummary(data, columns) {}
```

**4. validators.js** - 自定义验证器
```javascript
// 数字范围验证
export function numberRange(min, max) {}

// 日期范围验证
export function dateRange(startField, endField) {}
```

---

## 🚀 快速开始

### 1. 开发统计列表页

```bash
# 创建页面组件
src/views/business/flex-view/stat/index.vue

# 创建 API 接口
src/views/business/flex-view/api/stat-data.js

# 创建 Vuex 状态
src/views/business/flex-view/store/stat.js
```

### 2. 开发动态表格组件

```bash
# 创建核心组件
src/views/business/flex-view/components/common/DynamicTable/index.vue

# 创建列渲染器
src/views/business/flex-view/components/common/DynamicTable/ColumnRender.vue

# 创建单元格渲染器
src/views/business/flex-view/components/common/DynamicTable/CellRender.vue
```

### 3. 开发动态表单组件

```bash
# 创建核心组件
src/views/business/flex-view/components/common/DynamicForm/index.vue

# 创建字段渲染器（复用 HDty 组件）
src/views/business/flex-view/components/common/DynamicForm/FieldRender.vue
```

---

## 📋 开发规范

### 1. 命名规范

**文件命名**:
- 组件文件: PascalCase (如 `StatTable.vue`)
- 工具文件: kebab-case (如 `column-tree.js`)
- API 文件: kebab-case (如 `stat-data.js`)

**变量命名**:
- 组件 data: camelCase (如 `statData`)
- 组件 props: camelCase (如 `formConfig`)
- 常量: UPPER_SNAKE_CASE (如 `API_BASE_URL`)

### 2. 路由配置

路由文件: `src/router/modules/flex-view.js`

路由路径规范:
```javascript
// 统计展示
/flex-view/stat

// 列配置管理
/flex-view/config/column

// 表单配置管理
/flex-view/config/form
```

### 3. 组件导入规范

使用相对路径导入本模块组件:
```javascript
// ✅ 正确: 使用相对路径
import DynamicTable from '../components/common/DynamicTable'
import { getColumnTree } from '../api/column'
import { arrayToTree } from '../utils/column-tree'

// ❌ 错误: 不要使用 @ 别名
import DynamicTable from '@/views/business/flex-view/components/common/DynamicTable'
```

使用 @ 别名导入 HDty 组件:
```javascript
// ✅ 正确: HDty 组件使用 @ 别名
import HdDatePicker from '@/components/HdForm/Items/hd-date-picker'
import HdOrgan from '@/components/HdForm/Items/hd-organ'
```

---

## 📝 开发注意事项

1. **模块隔离**:
   - ⚠️ **所有 flex-view 相关代码都必须在 `src/views/business/flex-view/` 目录下**
   - ⚠️ **不要在 `src/components`、`src/api`、`src/store/modules`、`src/utils` 等全局目录创建文件**
   - ⚠️ **避免影响其他业务模块**

2. **组件复用**:
   - ✅ 优先使用 HDty 框架的 `hd-date-picker`、`hd-organ`、`hd-region`、`hd-dict-*` 组件
   - ✅ 动态表格和动态表单自研开发，但内部复用 HDty 字段组件

3. **配置驱动**:
   - ✅ 所有页面和表单都基于配置动态渲染
   - ✅ 避免硬编码，支持后期灵活扩展

4. **代码注释**:
   - ✅ 复杂逻辑必须添加注释
   - ✅ 组件必须添加 props、events 说明
   - ✅ 工具函数必须添加 JSDoc 注释

---

## 📖 相关文档

- [需求规格说明书](../../../dev-md/需求规格说明书.md)
- [系统架构设计文档](../../../dev-md/系统架构设计文档.md)
- [前端开发计划](../../../project-docs/02-前端开发计划.md)
- [需求可行性分析报告](../../../project-docs/01-需求可行性分析报告.md)

---

## 🎉 开发进度

- [x] 目录结构创建
- [ ] 核心组件开发
  - [ ] DynamicTable 组件
  - [ ] DynamicForm 组件
- [ ] 页面开发
  - [ ] 统计列表页
  - [ ] 列配置页
  - [ ] 表单配置页
- [ ] API 接口开发
- [ ] 状态管理开发
- [ ] 工具函数开发
- [ ] 联调测试

---

**最后更新**: 2025-11-26  
**维护人**: 开发团队
