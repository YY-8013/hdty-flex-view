# 样式错误修复记录

## 修复时间
2025-11-26

## 问题描述
新创建的组件中使用了未定义的 SCSS 变量（如 `$--color-primary`、`$--color-danger`），导致编译错误。

## 修复内容

### 1. StatTable.vue
**问题**: 使用了 `$--color-primary` 和 `$--color-danger` 变量
**修复**: 
- 将 `$--color-primary` 替换为 `#409eff`（Element UI 默认主色）
- 将 `$--color-danger` 替换为 `#f56c6c`（Element UI 默认危险色）
- 使用 `::v-deep` 确保样式穿透
- 修复 v-if/v-else key 重复问题，使用 `'col-' + column.prop` 和 `'group-' + column.prop`

### 2. FieldRender.vue
**问题**: 使用了 `$--color-danger` 变量
**修复**: 将 `$--color-danger` 替换为 `#f56c6c`

### 3. StatQuery.vue
**问题**: 空样式块
**修复**: 简化为注释，说明继承自 hd-query

### 4. DynamicTable/index.vue
**问题**: 空样式块
**修复**: 简化为注释，说明继承自 el-table

### 5. DynamicForm/index.vue
**问题**: 空样式块
**修复**: 简化为注释，说明继承自 el-form

### 6. DetailDialog.vue
**修复**: 添加注释说明

## 修复后的样式规范

### 颜色使用规范
- 主色：`#409eff` (Element UI primary)
- 危险色：`#f56c6c` (Element UI danger)
- 成功色：`#67c23a` (Element UI success)
- 警告色：`#e6a23c` (Element UI warning)
- 信息色：`#909399` (Element UI info)

### 样式编写规范
1. 优先继承框架样式，避免重复定义
2. 必要时使用 `::v-deep` 进行样式穿透
3. 使用具体的颜色值，不依赖未定义的变量
4. 保持样式简洁，避免过度设计

## 验证
所有组件已通过编译，无 SCSS 语法错误。

## 后续建议
1. 如果需要统一管理颜色变量，可以在项目中创建 `variables.scss` 文件
2. 在 `vue.config.js` 中配置全局 SCSS 变量引入
3. 当前简化处理适合快速开发，后期可优化

## 相关文件
- `stat/components/StatTable.vue`
- `stat/components/StatQuery.vue`
- `stat/components/DetailDialog.vue`
- `components/common/DynamicTable/index.vue`
- `components/common/DynamicForm/index.vue`
- `components/common/DynamicForm/FieldRender.vue`
