# util-framework.js 工具类说明

## 概述
`util-framework.js` 是一个框架工具类，提供了多个Vue混入对象（mixins），用于简化列表页面、表单页面、表格组件、通用组件等的开发。

## 主要功能

### hdList 混入对象
用于列表页面的通用功能，包含数据查询、分页、导出、权限控制等。

#### 数据属性
- `AUTHORITIES`：用户权限对象
- `AUTHORITY_QUERY`：查询权限
- `pageOptions`：分页选择器配置
- `pickerOptions`：时间选择器配置
- `exportLimit`：数据导出数量限制
- `emptyText`：空白页提示文本
- 各种加载状态属性（loading、submitting、handling等）

#### 方法
- `initQueryByPath`：根据路由参数初始化查询数据对象
- `addTableResizeDoLayoutListener`：添加表格元素大小变化监听
- `removeTableResizeDoLayoutListener`：移除表格元素大小变化监听
- `listenTableResizeDoLayout`：监听表格元素大小变化重新布局
- `tableResizeDoLayout`：表格元素大小变化重新布局
- `getUserModuleAuthority`：获取某个模块权限
- `getUserAuthority`：获取某个权限
- `download`：下载二进制文件流
- `queryComponentModuleName`：获取当前组件模块名称
- `queryComponentParent`：获取父级组件
- `queryComponentChildrenAll`：获取所有匹配的子组件
- `handleSizeChange`：分页每页条数改变
- `handleCurrentChange`：分页当前页码改变
- `triggerDeletedReload`：分页列表数据删除后重新加载列表
- `validateExport`：校验分页列表数据是否可以导出
- `handleSortChange`：表格排序条件改变
- `handleSummaryMethod`：表格自定义合计行的回调方法
- `handleCellMouseEnter`：表格单元格鼠标移入
- `handleTreeTableSelect`：树形表格多选触发
- `handleTreeTableSelectAll`：树形表格全选触发
- `handleTreeTableRowClassName`：树形表格自定义行的className的回调方法
- `setIndex`：设置表格索引
- `setTableRowTooltip`：设置表格行的鼠标悬停提示
- `setTreeTableRowSelection`：设置树形表格某一行的选中状态
- 各种格式化方法（formatNumber、formatAmount、formatYear等）

### hdForm 混入对象
用于表单页面的通用功能。

#### 数据属性
- 与hdList类似的加载状态属性
- `fileUpload`：文件上传API

#### 方法
- `formatTime`：时间格式化
- `triggerValidateField`：触发表单项校验
- `triggerClearValidate`：移除表单项校验
- `validateEmptyForm`：校验表单是否为空
- `validateOriginForm`：校验表单是否为原始对象
- `validateNotEmptyForm`：校验表单是否非空
- `validateNotOriginForm`：校验表单是否非原始对象
- `scrollIntoFormErrorView`：滚动到表单错误项所在视野
- `formatRequireDocs`：格式化必传附加数组
- `formatAllDocs`：格式化所有附加数组
- `getDifferentArr`：获取需要过滤掉的附件类型
- `getRequireRes`：判断所传附件是否满足附件必填项的要求
- `updateRegion`：自动根据地区填充地址
- `updateRegionAddress`：自动根据地区填充地址（另一种实现）

### hdTable 混入对象
用于表格组件的通用功能。

#### 数据属性
- `erdAllTable`：全部表格大小变化监听组件
- `erdAllContainer`：全部容器大小变化监听元素

#### 方法
- 与hdList中表格相关的方法类似

### hdComponent 混入对象
用于通用组件的通用功能。

#### 方法
- `dispatch`：重定义父组件自定义事件
- `getPropByPath`：根据路径获取对象属性
- `Component`：获取组件实例
- `fieldValue`：获取字段值
- `resetField`：重置字段

### hdMethod 混入对象
提供通用方法的混入对象。

#### 数据属性
- `AUTHORITIES`：用户权限

#### 方法
- `getUserModuleAuthority`：获取某个模块权限
- `getUserAuthority`：获取某个权限
- `download`：下载二进制文件流
- `queryComponentModuleName`：获取当前组件模块名称
- `queryComponentParent`：获取父级组件
- `queryComponentChildrenAll`：获取所有匹配的子组件

### ywList 混入对象
另一个用于列表页面的混入对象，功能与hdList类似但配置不同。

#### 数据属性
- `AUTHORITY_QUERY`：查询权限
- `pageOptions`：分页选择器
- `pickerOptions`：时间选择器
- `exportLimit`：导出条数限制
- `emptyText`：空白页提示
- 各种加载状态属性

#### 方法
- `triggerDeletedReload`：删除后刷新列表
- `handleSizeChange`：页码改变
- `handleCurrentChange`：跳转页码
- `handleSortChange`：排序
- `setIndex`：序号
- `formatDate`：日期格式化
- `formatTime`：时间格式化
- `formatArray`：数组格式化
- `download`：下载二进制文件流
- `exportValidator`：导出验证

## 使用示例

```javascript
// 在Vue组件中使用hdList混入
export default {
  mixins: [hdList],
  data() {
    return {
      queryData: {
        // 查询条件
      },
      tableData: []
    }
  },
  methods: {
    loadList() {
      // 加载列表数据
    }
  }
}

// 在Vue组件中使用hdForm混入
export default {
  mixins: [hdForm],
  data() {
    return {
      formData: {
        // 表单数据
      }
    }
  },
  methods: {
    submitForm() {
      // 提交表单
    }
  }
}

// 在Vue组件中使用hdTable混入
export default {
  mixins: [hdTable],
  mounted() {
    // 组件挂载后添加表格大小监听
    this.addTableResizeDoLayoutListener();
  }
}
```

## 注意事项
1. 该工具类是Vue混入对象的集合，需要在Vue组件中通过mixins属性引入
2. 不同的混入对象提供了不同的功能，使用时应根据组件需求选择合适的混入
3. hdList和ywList都用于列表页面，但配置和部分方法有所不同
4. 大部分混入对象都依赖于其他工具类（如$utilStr、$utilDate等）
5. 部分方法需要配合Element UI组件使用（如ElTable、ElFormItem等）
6. 权限控制功能依赖于用户权限数据的正确配置
7. 表格相关功能需要正确设置表格引用和组件名称