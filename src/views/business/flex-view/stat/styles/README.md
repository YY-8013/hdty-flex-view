# 数据晾晒统计页面样式文件说明

## 样式文件结构

```
styles/
├── index.scss              # 主页面基础样式（页面布局、header结构等）
├── theme-police.scss       # 警用蓝主题样式
├── theme-normal.scss       # 常规主题样式
├── theme-dropdown.scss     # 主题下拉菜单样式
├── stat-query.scss         # 查询组件样式
└── stat-table.scss         # 表格组件样式
```

## 文件说明

### 1. index.scss
主页面基础样式，包含：
- 页面整体布局（.stat-page-wrapper）
- Header区域结构（.stat-header-bar）
- 用户信息、标题、主题切换按钮布局
- 主内容区域样式
- 动画定义（pulse）

### 2. theme-police.scss
警用蓝主题样式，包含：
- Header渐变蓝色背景
- 查询区域蓝色主题
- 表格蓝色表头
- 分页蓝色高亮
- 交互元素蓝色系

### 3. theme-normal.scss
常规主题样式，包含：
- Header渐变紫色背景
- 查询区域紫色主题
- 表格紫色表头
- 分页紫色高亮
- 交互元素紫色系

### 4. theme-dropdown.scss
主题下拉菜单样式，用于主题切换下拉选项的样式定义

### 5. stat-query.scss
查询组件样式，包含：
- hd-query组件内边距
- 表单标签字体
- 按钮容器样式

### 6. stat-table.scss
表格组件样式，包含：
- 表格基础样式
- 表头/单元格样式
- 可点击单元格样式
- Hover效果
- 空数据样式

## 使用方式

### 主页面（index.vue）
```scss
<style lang="scss" scoped>
// 导入基础样式
@import "./styles/index.scss";
// 导入主题样式
@import "./styles/theme-police.scss";
@import "./styles/theme-normal.scss";
// 导入下拉菜单样式
@import "./styles/theme-dropdown.scss";
</style>
```

### 查询组件（StatQuery.vue）
```scss
<style lang="scss" scoped>
@import "../styles/stat-query.scss";
</style>
```

### 表格组件（StatTable.vue）
```scss
<style lang="scss" scoped>
@import "../styles/stat-table.scss";
</style>
```

## 样式优化要点

1. **Header优化**：
   - 高度增加至70px，更大气
   - 左中右三栏布局，比例优化（flex: 1 / 0 / 1）
   - 字体大小提升（标题28px，图标32px）
   - 字间距增加至4px
   - 添加白空间保证不换行

2. **主题样式分离**：
   - 每个主题独立文件
   - 便于维护和扩展
   - 支持动态切换

3. **组件样式模块化**：
   - 每个组件样式独立文件
   - 通过@import引入
   - 避免样式冗余

## 动态列功能改造

### 问题
原先只支持2层列（一级+二级），无法支持任意多层级嵌套。

### 解决方案
创建递归组件 `DynamicColumn.vue`，支持任意层级的列结构：

```vue
<!-- DynamicColumn.vue -->
<template>
  <!-- 叶子节点：普通列 -->
  <el-table-column v-if="无子列" ... />
  
  <!-- 分组节点：递归渲染 -->
  <el-table-column v-else ...>
    <dynamic-column
      v-for="child in column.children"
      :key="child.id"
      :column="child"
      @cell-click="handleCellClick"
    />
  </el-table-column>
</template>
```

### 优势
- ✅ 支持任意层级嵌套
- ✅ 自动递归处理
- ✅ 代码简洁易维护
- ✅ 完全依赖后端配置
