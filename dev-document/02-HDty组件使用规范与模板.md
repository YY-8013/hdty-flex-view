# HDty组件使用规范与模板

> 基于 examples/1、examples/2、formManage、ywsp 四个业务模块的组件使用总结
> 
> 本文档总结系统内常用组件的使用方法和页面布局规范,供开发时参考

---

## 一、页面布局规范

### 1.1 标准列表页布局

**布局结构：**

```vue
<div class="hdty-container hdty-flex">
  <!-- 查询区域 -->
  <div class="hdty-header">
    <el-form>...</el-form>
    <hd-button-container>...</hd-button-container>
  </div>
  
  <!-- 表格区域 -->
  <div class="hdty-fit">
    <el-table>...</el-table>
  </div>
  
  <!-- 分页区域 -->
  <div class="hdty-footer">
    <el-pagination>...</el-pagination>
  </div>
  
  <!-- 弹窗组件 -->
  <xxx-add ref="addRef"></xxx-add>
  <xxx-edit ref="editRef"></xxx-edit>
  <xxx-detail ref="detailRef"></xxx-detail>
</div>
```

**核心要点：**
- 最外层容器使用 `hdty-container hdty-flex` 类
- 三段式布局：`hdty-header` + `hdty-fit` + `hdty-footer`
- 弹窗组件放在最后，通过 `ref` 调用

### 1.2 带左侧菜单的列表页

**布局结构（参考 Example2List）：**

```vue
<div class="hdty-container hdty-flex hdty-flex-row">
  <!-- 左侧菜单 -->
  <div class="hdty-flex-fit">
    <hd-dict-menu v-model="menuActiveKey" ...></hd-dict-menu>
  </div>
  
  <!-- 右侧主体 -->
  <div class="hdty-flex-fill hdty-flex hdty-flex-column">
    <div class="hdty-header">...</div>
    <div class="hdty-fit">...</div>
    <div class="hdty-footer">...</div>
  </div>
</div>
```

### 1.3 表单页布局

**Dialog 弹窗表单：**

```vue
<el-dialog title="标题" :visible.sync="visible" append-to-body>
  <hd-pane fit v-loading="submitting">
    <el-form ref="formRef" :model="formData" :rules="rules" label-width="auto">
      <hd-component :model="extendData" ref="componentRef">
        <!-- 表单项 -->
      </hd-component>
    </el-form>
  </hd-pane>
  
  <div slot="footer" class="hdty-btn-container">
    <el-button @click="cancelForm">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </div>
</el-dialog>
```

**核心要点：**
- 必须使用 `hd-pane` 包裹表单
- `hd-component` 用于扩展数据管理
- `append-to-body` 确保弹窗正确显示
- footer 使用 `hdty-btn-container` 类

---

## 二、查询表单组件

### 2.1 查询区域布局

**方式一：使用 hd-query（推荐，带展开/收起功能）**

```vue
<el-form ref="queryRef" :model="queryData" :rules="rules" inline>
  <hd-component :model="extendData" ref="componentRef">
    <hd-query>
      <!-- 固定显示的查询条件 -->
      <hd-query-fixed>
        <el-form-item label="字段名" prop="fieldName">
          <el-input v-model="queryData.fieldName"></el-input>
        </el-form-item>
        
        <!-- 高级过滤项，slot="after" -->
        <el-form-item prop="orgId" slot="after">
          <hd-organ v-model="queryData.orgId" placeholder="高级查询：请选择机构"></hd-organ>
        </el-form-item>
      </hd-query-fixed>
      
      <!-- 可展开的查询条件 -->
      <hd-query-expand>
        <el-row>
          <el-form-item label="字段名" prop="fieldName">
            <!-- 查询组件 -->
          </el-form-item>
        </el-row>
      </hd-query-expand>
    </hd-query>
  </hd-component>
</el-form>
```

**方式二：使用 hd-expand（简化版）**

```vue
<el-form ref="queryRef" :model="queryData" inline>
  <hd-component :model="extendData" ref="componentRef">
    <hd-expand>
      <hd-expand-header>
        <!-- 固定显示的查询条件 -->
      </hd-expand-header>
      <hd-expand-body>
        <!-- 可展开的查询条件 -->
      </hd-expand-body>
    </hd-expand>
  </hd-component>
</el-form>
```

### 2.2 按钮区域

**新写法（推荐）：**

```vue
<hd-button-container>
  <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">
    查询
  </hd-button>
  <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
  <hd-button name="add" type="success" icon="el-icon-circle-plus-outline" @click="handleAdd">
    新增
  </hd-button>
  <hd-button name="export" type="warning" icon="el-icon-upload2" :loading="exporting" @click="handleExport">
    导出
  </hd-button>
</hd-button-container>
```

---

## 三、表单输入组件速查表

### 3.1 基础输入组件

| 组件                       | 用途       | 示例代码                                                                                                                |
| -------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------- |
| `el-input`                 | 单行输入框 | `<el-input v-model="formData.input" placeholder="请输入" maxlength="30" underline></el-input>`                          |
| `el-input type="textarea"` | 多行文本域 | `<el-input type="textarea" v-model="formData.textarea" :rows="3" maxlength="200" underline></el-input>`                 |
| `hd-input-number`          | 计数器     | `<hd-input-number v-model="formData.number" :min="1" :max="100" controls-position="right" underline></hd-input-number>` |
| `hd-number-range`          | 数值范围   | `<hd-number-range v-model="formData.numberRange" :optional-range="[1, 100]" underline></hd-number-range>`               |

### 3.2 字典选择组件

| 组件               | 用途     | 绑定值类型   | 示例代码                                                                                                                                          |
| ------------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hd-dict-radio`    | 单选框   | String       | `<hd-dict-radio v-model="formData.gender" :dict-code="$global.dictType.gender" underline></hd-dict-radio>`                                        |
| `hd-dict-checkbox` | 复选框   | Array        | `<hd-dict-checkbox v-model="formData.hobbies" :dict-code="$global.dictType.hobbies" underline></hd-dict-checkbox>`                                |
| `hd-dict-select`   | 下拉选择 | String/Array | `<hd-dict-select v-model="formData.type" :dict-code="$global.dictType.formType" placeholder="请选择" filterable underline></hd-dict-select>`      |
| `hd-dict-cascader` | 级联选择 | String/Array | `<hd-dict-cascader v-model="formData.topic" :dict-code="$global.dictType.msgTopic" placeholder="请选择" filterable underline></hd-dict-cascader>` |

**查询页特有属性：**
- `show-all-button`: 显示"全部"按钮（适用于 radio、checkbox）

**编辑页文本同步：**
```vue
<hd-dict-select 
  prop="type"
  v-model="formData.type" 
  :model-text.sync="extendData.type"
  :dict-code="$global.dictType.formType">
</hd-dict-select>
```

### 3.3 机构与地区组件

| 组件        | 用途     | 常用属性                                                 |
| ----------- | -------- | -------------------------------------------------------- |
| `hd-organ`  | 机构选择 | `filterCode`、`showLevel`、`multiple`、`model-text.sync` |
| `hd-region` | 地区选择 | `multiple`、`model-text.sync`                            |

**示例：**

```vue
<!-- 机构选择（带过滤和层级限制） -->
<hd-organ 
  v-model="formData.orgId" 
  :model-text.sync="extendData.orgId"
  :filterCode="userInfo.orgId.substring(0, 2) + '0000000000'"
  showLevel="5"
  placeholder="请选择机构">
</hd-organ>
```

### 3.4 日期时间组件

**hd-date-picker 类型总览：**

| type            | 说明         | 返回值格式                       | 示例代码                                                                                  |
| --------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------- |
| `year`          | 年份         | YYYY                             | `<hd-date-picker type="year" v-model="formData.year"></hd-date-picker>`                   |
| `years`         | 年份多选     | Array                            | `<hd-date-picker type="years" v-model="formData.years"></hd-date-picker>`                 |
| `month`         | 月份         | YYYYMM                           | `<hd-date-picker type="month" v-model="formData.month"></hd-date-picker>`                 |
| `months`        | 月份多选     | Array                            | `<hd-date-picker type="months" v-model="formData.months"></hd-date-picker>`               |
| `monthrange`    | 月份范围     | [YYYYMM, YYYYMM]                 | `<hd-date-picker type="monthrange" v-model="formData.monthRange"></hd-date-picker>`       |
| `week`          | 周           | [YYYYMMDD, YYYYMMDD]             | `<hd-date-picker type="week" v-model="formData.week"></hd-date-picker>`                   |
| `date`          | 日期         | YYYYMMDD                         | `<hd-date-picker type="date" v-model="formData.date"></hd-date-picker>`                   |
| `dates`         | 日期多选     | Array                            | `<hd-date-picker type="dates" v-model="formData.dates"></hd-date-picker>`                 |
| `daterange`     | 日期范围     | [YYYYMMDD, YYYYMMDD]             | `<hd-date-picker type="daterange" v-model="formData.dateRange"></hd-date-picker>`         |
| `datetime`      | 日期时间     | YYYYMMDDHHmmss                   | `<hd-date-picker type="datetime" v-model="formData.datetime"></hd-date-picker>`           |
| `datetimerange` | 日期时间范围 | [YYYYMMDDHHmmss, YYYYMMDDHHmmss] | `<hd-date-picker type="datetimerange" v-model="formData.datetimeRange"></hd-date-picker>` |
| `time`          | 时间         | HHmmss                           | `<hd-date-picker type="time" v-model="formData.time"></hd-date-picker>`                   |
| `timerange`     | 时间范围     | [HHmmss, HHmmss]                 | `<hd-date-picker type="timerange" v-model="formData.timeRange"></hd-date-picker>`         |
| `moment`        | 时刻         | HH:mm                            | `<hd-date-picker type="moment" v-model="formData.moment"></hd-date-picker>`               |

**特殊属性：**
- `keep-time`: 保留当前时间（用于日期/日期时间选择）

```vue
<hd-date-picker 
  type="date" 
  v-model="formData.date" 
  :keep-time="new Date().getTime()">
</hd-date-picker>
```

**新版日期时间范围组件：**

```vue
<!-- 新版日期时间范围 -->
<hd-date-range-picker v-model="formData.dateRangeNew" />

<!-- 独立日期时间范围 -->
<hd-datetime-range v-model="formData.dateRangeNew2" />
```

### 3.5 文件上传组件

| 组件               | 用途                 | 常用属性                                   |
| ------------------ | -------------------- | ------------------------------------------ |
| `hd-image-upload`  | 图片上传             | `drag`、`cutter`、`multiple`、`empty-text` |
| `hd-input-upload`  | 文件上传（输入框式） | -                                          |
| `hd-file-upload`   | 附件上传             | -                                          |
| `hd-button-upload` | 按钮式上传           | `loading`、`@currentChanged`               |

**示例：**

```vue
<!-- 基础图片上传 -->
<hd-image-upload v-model="formData.photo"></hd-image-upload>

<!-- 拖拽上传 -->
<hd-image-upload v-model="formData.photo" drag></hd-image-upload>

<!-- 带裁剪 -->
<hd-image-upload v-model="formData.photo" cutter></hd-image-upload>

<!-- 多图上传 -->
<hd-image-upload v-model="formData.photoList" multiple></hd-image-upload>

<!-- 自定义样式（证件照） -->
<hd-image-upload
  v-model="formData.idPhoto"
  empty-text="点击上传正面照"
  empty-pre="温馨提示<br>（1）请保持背景纯色<br>（2）面部无遮挡"
  width="80%"
  height="100%">
</hd-image-upload>

<!-- 文件上传 -->
<hd-input-upload v-model="formData.file"></hd-input-upload>

<!-- 附件上传 -->
<hd-file-upload v-model="formData.attachments"></hd-file-upload>
```

### 3.6 高级查询组件

| 组件              | 用途       | 示例代码                                                                                                                                                         |
| ----------------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hd-factor-input` | 因子输入框 | `<hd-factor-input prop="inputFilterFactor" v-model="queryData.input" :model-control.sync="extendData.inputFilterFactor" placeholder="请输入"></hd-factor-input>` |
| `hd-factor-logic` | 逻辑因子   | `<hd-factor-logic v-model="queryData.andor"></hd-factor-logic>`                                                                                                  |

**因子输入框初始化：**

```javascript
queryData: {
  input: ''
},
extendData: {
  inputFilterFactor: this.$app.factorOptions.matchOpe.between
}
```

**逻辑因子初始化：**

```javascript
queryData: {
  andor: this.$app.factorOptions.logicOpe.and
}
```

### 3.7 其他特殊组件

| 组件                 | 用途       | 数据格式      | 示例代码                                                                                 |
| -------------------- | ---------- | ------------- | ---------------------------------------------------------------------------------------- |
| `hd-table-select`    | 表格选择器 | String/Array  | 见下文详细说明                                                                           |
| `hd-map-point`       | 坐标拾取   | `{lng, lat}`  | `<hd-map-point v-model="formData.point" drawing-mode="marker" underline></hd-map-point>` |
| `hd-json-editor`     | JSON编辑器 | Object/String | `<hd-json-editor v-model="formData.json" height="400"></hd-json-editor>`                 |
| `hd-iconfont`        | 图标选择   | String        | `<hd-iconfont v-model="formData.icon" placeholder="请选择图标" underline></hd-iconfont>` |
| `input type="color"` | 颜色选择   | String        | `<input v-model="formData.color" type="color" />`                                        |

---

## 四、表格选择器（hd-table-select）详细说明

### 4.1 基础用法

```vue
<el-form-item label="选择项" prop="selectedId">
  <hd-table-select
    v-model="formData.selectedId"
    :api="tableSelectOptions.api"
    :props="tableSelectOptions.props"
    :columns="tableSelectOptions.columns"
    :searches="tableSelectOptions.searches"
    placeholder="请选择">
  </hd-table-select>
</el-form-item>
```

### 4.2 配置对象

```javascript
// 在 List 组件中定义
data() {
  return {
    tableSelectOptions: {
      // API 接口
      api: page,
      
      // 数据映射
      props: {
        value: 'id',           // 值字段（必填）
        label: 'name',         // 显示字段（必填）
        response: 'records'    // 响应数据字段（必填）
      },
      
      // 表格列配置
      columns: [
        {
          field: 'id',
          label: '编码',
          fixed: true,
          sortable: 'custom',
          width: '200'
        },
        {
          field: 'name',
          label: '名称',
          sortable: 'custom',
          width: '200'
        },
        {
          field: 'memo',
          label: '描述',
          minWidth: '200'
        }
      ],
      
      // 查询条件配置
      searches: [
        [
          {
            field: 'name',
            label: '名称',
            type: 'input',
            placeholder: '请输入名称'
          },
          {
            field: 'orgId',
            label: '机构',
            type: 'organSelect',
            placeholder: '请选择机构'
          }
        ]
      ]
    }
  }
}

// 在 Add/Edit 组件中引用
inject: ['hdList'],
data() {
  return {
    tableSelectOptions: this.hdList.tableSelectOptions
  }
}
```

### 4.3 查询条件类型

| type          | 说明       | 配置示例                                                                                         |
| ------------- | ---------- | ------------------------------------------------------------------------------------------------ |
| `input`       | 文本输入框 | `{field: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名'}`                       |
| `factorInput` | 因子输入框 | `{field: 'name', label: '姓名', type: 'factorInput', placeholder: '请输入姓名'}`                 |
| `organSelect` | 机构选择   | `{field: 'orgId', label: '机构', type: 'organSelect', placeholder: '请选择机构'}`                |
| `dictSelect`  | 字典选择   | `{field: 'type', label: '类型', type: 'dictSelect', dictCode: 'xxx', placeholder: '请选择类型'}` |

### 4.4 高级用法

**多选：**

```vue
<hd-table-select
  v-model="formData.selectedIds"
  multiple
  :api="tableSelectOptions.api"
  :props="tableSelectOptions.props"
  :columns="tableSelectOptions.columns"
  :searches="tableSelectOptions.searches">
</hd-table-select>
```

**带文本同步（编辑页）：**

```vue
<hd-table-select
  prop="selectedId"
  v-model="formData.selectedId"
  :model-text.sync="extendData.selectedIdText"
  :api="tableSelectOptions.api"
  :props="tableSelectOptions.props"
  :columns="tableSelectOptions.columns"
  :searches="tableSelectOptions.searches">
</hd-table-select>
```

**带数据回调：**

```vue
<hd-table-select
  v-model="formData.personIds"
  :modelText.sync="formData.personNames"
  multiple
  :api="tableSelectOptions.api"
  :props="tableSelectOptions.props"
  :columns="tableSelectOptions.columns"
  :searches="tableSelectOptions.searches"
  @currentChanged="handlePersonChange">
</hd-table-select>
```

```javascript
methods: {
  handlePersonChange(currentKeys, oldValue, multipleData) {
    // currentKeys: 当前选中的ID数组
    // oldValue: 之前的值
    // multipleData: 选中的完整数据对象数组
    console.log('选中的人员：', multipleData);
  }
}
```

---

## 五、表格组件规范

### 5.1 标准表格结构

```vue
<el-table
  v-loading="loading"
  ref="tableRef"
  :data="tableData"
  row-key="vo.id"
  :empty-text="emptyText"
  border
  fit
  height="100%"
  @sort-change="handleSortChange">
  
  <!-- 多选列（可选） -->
  <el-table-column
    fixed
    type="selection"
    reserve-selection
    align="center"
    width="50">
  </el-table-column>
  
  <!-- 序号列 -->
  <el-table-column
    fixed
    type="index"
    :index="setIndex"
    label="序号"
    class-name="is-index"
    align="center"
    width="50">
  </el-table-column>
  
  <!-- 操作列 -->
  <el-table-column
    fixed
    label="操作"
    align="center"
    width="210">
    <template slot-scope="scope">
      <hd-button-container>
        <hd-button name="detail" type="success" @click="handleDetail(scope.$index, scope.row)">详情</hd-button>
        <hd-button name="edit" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</hd-button>
        <hd-button name="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</hd-button>
      </hd-button-container>
    </template>
  </el-table-column>
  
  <!-- 数据列 -->
  <el-table-column
    prop="vo.fieldName"
    label="列名"
    sortable="custom"
    header-align="center"
    width="160"
    show-overflow-tooltip>
  </el-table-column>
</el-table>
```

### 5.2 表格列类型示例

**链接列：**

```vue
<el-table-column prop="vo.id" label="ID" header-align="center">
  <template slot-scope="scope">
    <span class="table-link" @click="handleDetail(scope.$index, scope.row)">
      {{ scope.row.vo.id }}
    </span>
  </template>
</el-table-column>
```

**标签列：**

```vue
<el-table-column prop="vo.count" label="数量" align="center" width="100">
  <template slot-scope="scope">
    <a href="javascript:;" @click="handleCount(scope.row)">
      <el-tag type="success">{{ scope.row.vo.count }}</el-tag>
    </a>
  </template>
</el-table-column>
```

**状态列：**

```vue
<el-table-column prop="vox.status" label="状态" align="center" width="100">
  <template slot-scope="scope">
    <el-tag
      :type="scope.row.vo.status === '1' ? 'success' : 'danger'"
      effect="dark">
      {{ scope.row.vo.status === '1' ? '启用' : '停用' }}
    </el-tag>
  </template>
</el-table-column>
```

**图片列：**

```vue
<!-- 方式一 -->
<el-table-column prop="vo.photoUrl" label="图片" header-align="center" width="140">
  <template slot-scope="scope">
    <hd-image :src="scope.row.vo.photoUrl" class="hdty-img-scale-wide"></hd-image>
  </template>
</el-table-column>

<!-- 方式二 -->
<el-table-column prop="vo.photoUrl" label="图片" header-align="center" width="140">
  <template slot-scope="scope">
    <hd-image-preview :value="scope.row.vo.photoUrl"></hd-image-preview>
  </template>
</el-table-column>
```

**时间列：**

```vue
<el-table-column
  prop="vo.createTime"
  label="创建时间"
  sortable="custom"
  header-align="center"
  min-width="180">
  <template slot-scope="scope">
    <i class="el-icon-time"></i>
    <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
  </template>
</el-table-column>
```

**坐标列：**

```vue
<el-table-column prop="vo.position" label="位置" header-align="center" width="160">
  <template slot-scope="scope">
    {{ scope.row.vox.position || '未知' }}
    <hd-map-point
      v-if="scope.row.vo.position"
      type="button"
      :value="scope.row.vo.position"
      :model-text="scope.row.vox.position">
    </hd-map-point>
  </template>
</el-table-column>
```

### 5.3 操作列模式

**基础模式（3个按钮）：**

```vue
<el-table-column fixed label="操作" align="center" width="210">
  <template slot-scope="scope">
    <hd-button-container>
      <hd-button name="detail" type="success" @click="handleDetail(scope.$index, scope.row)">
        详情
      </hd-button>
      <hd-button name="edit" type="primary" @click="handleEdit(scope.$index, scope.row)">
        编辑
      </hd-button>
      <hd-button name="delete" type="danger" @click="handleDelete(scope.$index, scope.row)">
        删除
      </hd-button>
    </hd-button-container>
  </template>
</el-table-column>
```

**下拉菜单模式：**

```vue
<el-table-column label="操作" align="center" width="100" fixed="right">
  <template slot-scope="scope">
    <el-dropdown>
      <el-button type="info">操作</el-button>
      <el-dropdown-menu slot="dropdown">
        <hd-button type="success" @click="handleDetail(scope.$index, scope.row)">详情</hd-button>
        <hd-button v-show="scope.row.vo.status === '0'" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</hd-button>
        <el-button v-show="scope.row.vo.status === '0'" type="danger" @click="handleLogout(scope.$index, scope.row)">注销</el-button>
      </el-dropdown-menu>
    </el-dropdown>
  </template>
</el-table-column>
```

**带条件显示：**

```vue
<hd-button-container>
  <hd-button name="detail" type="success" @click="handleDetail(scope.$index, scope.row)">
    详情
  </hd-button>
  <hd-button
    v-show="scope.row.vo.status === '0'"
    name="edit"
    type="primary"
    @click="handleEdit(scope.$index, scope.row)">
    编辑
  </hd-button>
  <hd-button
    name="off"
    type="danger"
    :disabled="scope.row.vo.status === $global.dictItem.isOrNot.is"
    @click="handleOff(scope.$index, scope.row)">
    注销
  </hd-button>
</hd-button-container>
```

---

## 六、JavaScript 代码规范

### 6.1 列表页脚本模板

```javascript
import { hdList } from '@/utils/util-framework';
import { page, exports, singleDelete } from './api';
import XxxAdd from './XxxAdd';
import XxxDetail from './XxxDetail';
import XxxEdit from './XxxEdit';

export default {
  name: 'XxxList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    XxxAdd,
    XxxDetail,
    XxxEdit
  },
  data() {
    return {
      // 查询条件
      queryData: {
        fieldName: ''
      },
      // 查询扩展
      extendData: {},
      // 表格数据
      tableData: [],
      // 验证规则
      rules: {}
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    // 加载列表
    loadList() {
      if (this.AUTHORITY_QUERY) {
        this.loading = true;
        const params = {
          ...this.queryData,
          ...this.extendData,
          ...this.pageOptions
        };
        
        page(params)
          .then(response => {
            const { success, data } = response.data;
            if (success) {
              this.pageOptions.total = data.total;
              this.tableData = data.records;
            }
          })
          .catch(error => {
            console.error(error);
          })
          .finally(() => {
            this.$refs.tableRef.doLayout();
            this.loading = false;
          });
      }
    },
    
    // 查询
    handleQuery() {
      this.$refs.queryRef.validate(valid => {
        if (valid) {
          this.pageOptions.current = 1;
          this.loadList();
        }
      });
    },
    
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    
    // 新增
    handleAdd() {
      this.$refs.addRef.visible = true;
      this.$refs.addRef.beforeLoadForm();
    },
    
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    
    // 编辑
    handleEdit(index, row) {
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$refs.editRef.beforeLoadForm();
    },
    
    // 删除
    handleDelete(index, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const dataParams = {
          id: row.vo.id
        };
        
        singleDelete(dataParams)
          .then(response => {
            const { success, msg } = response.data;
            if (success) {
              this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              this.triggerDeletedReload();
            }
          })
          .catch(error => {
            console.error(error);
          });
      }).catch(() => {});
    }
  }
};
```

### 6.2 新增页脚本模板

```javascript
import { hdForm } from '@/utils/util-framework';
import { add, addBefore } from './api';

export default {
  name: 'XxxAdd',
  moduleName: 'XxxList',
  provide() {
    return {
      hdAdd: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      formData: {
        fieldName: ''
      },
      extendData: {},
      rules: {
        fieldName: [
          { required: true, message: '请输入字段名', trigger: 'blur' }
        ]
      },
      visible: false
    };
  },
  methods: {
    beforeLoadForm() {
      this.loadForm();
    },
    
    loadForm() {
      const dataParams = {};
      addBefore(dataParams)
        .then(response => {
          const { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    
    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.submitting = true;
          const dataParams = {
            ...this.formData
          };
          
          add(dataParams)
            .then(response => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.resetForm();
                this.hdList.handleQuery();
              }
            })
            .catch(error => {
              console.error(error);
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
        }
      });
    },
    
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
```

### 6.3 编辑页脚本模板

```javascript
import { hdForm } from '@/utils/util-framework';
import { edit, editBefore } from './api';

export default {
  name: 'XxxEdit',
  moduleName: 'XxxList',
  provide() {
    return {
      hdEdit: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      formData: {
        fieldName: ''
      },
      extendData: {},
      rules: {
        fieldName: [
          { required: true, message: '请输入字段名', trigger: 'blur' }
        ]
      },
      row: {},
      visible: false
    };
  },
  methods: {
    beforeLoadForm() {
      this.$nextTick(() => {
        this.resetForm();
        this.loadForm();
      });
    },
    
    loadForm() {
      const dataParams = {
        id: this.row.vo.id
      };
      
      editBefore(dataParams)
        .then(response => {
          const { success, data } = response.data;
          if (success) {
            this.formData = data.vo;
            this.extendData = data.vox;
          }
        })
        .catch(error => {
          console.error(error);
        })
        .finally(() => {
          this.$refs.formRef.clearValidate();
        });
    },
    
    submitForm() {
      this.$refs.formRef.validate((valid, error) => {
        if (valid) {
          this.submitting = true;
          const dataParams = {
            ...this.formData
          };
          
          edit(dataParams)
            .then(response => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
                });
                this.hdList.loadList();
              }
            })
            .catch(error => {
              console.error(error);
            })
            .finally(() => {
              this.submitting = false;
            });
        } else {
          this.scrollIntoFormErrorView(error);
        }
      });
    },
    
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    
    resetForm() {
      this.$refs.formRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
```

### 6.4 详情页脚本模板

```javascript
import { hdForm } from '@/utils/util-framework';
import { detail } from './api';

export default {
  name: 'XxxDetail',
  moduleName: 'XxxList',
  provide() {
    return {
      hdDetail: this
    };
  },
  inject: ['hdList'],
  mixins: [hdForm],
  data() {
    return {
      formData: {
        vo: {},
        vox: {}
      },
      row: {},
      visible: false
    };
  },
  methods: {
    beforeLoadForm() {
      this.resetForm();
      this.loadForm();
    },
    
    loadForm() {
      const dataParams = {
        id: this.row.vo.id
      };
      
      detail(dataParams)
        .then(response => {
          const { success, data } = response.data;
          if (success) {
            this.formData.vo = data.vo;
            this.formData.vox = data.vox;
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    
    cancelForm() {
      this.visible = false;
    },
    
    resetForm() {
      this.formData = {
        vo: {},
        vox: {}
      };
    }
  }
};
```

---

## 七、常用验证规则

```javascript
rules: {
  // 必填文本
  fieldName: [
    { required: true, message: '请输入字段名', trigger: 'blur' }
  ],
  
  // 必填下拉
  selectField: [
    { required: true, message: '请选择', trigger: 'change' }
  ],
  
  // 必填数组
  arrayField: [
    { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
  ],
  
  // 必填数字
  numberField: [
    { required: true, message: '请输入数字', trigger: 'blur' },
    { type: 'number', message: '请输入数字', trigger: 'blur' }
  ],
  
  // 长度限制
  limitField: [
    { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
  ],
  
  // 正则验证
  regexField: [
    { pattern: /^[\S\s]{1,100}$/, message: '长度不能超过100字符', trigger: 'blur' }
  ]
}
```

---

## 八、全局常量与工具方法

### 8.1 字典类型常量

```javascript
$global.dictType.gender          // 性别
$global.dictType.isOrNot         // 是否
$global.dictType.msgCategory     // 消息分类
$global.dictType.msgTopic        // 消息主题
$global.dictType.logoutStatus    // 注销状态
$global.dictType.clientType      // 客户端类型
$global.dictType.formType        // 表单类型
$global.dictType.orgLevel        // 机构层级
$global.dictType.rwdj            // 任务等级
```

### 8.2 字典项常量

```javascript
$global.dictItem.isOrNot.is      // 是
$global.dictItem.isOrNot.not     // 否
$global.dictItem.clientType.pcTerminal  // PC端
```

### 8.3 工具方法

**日期工具（$utilDate）：**

```javascript
// 格式化日期
this.$utilDate.dateFtt(new Date(), 'yyyyMMdd000000')  // 返回：20231201000000
this.$utilDate.dateFtt(new Date(), 'yyyyMMdd235959')  // 返回：20231201235959
```

**字符串工具（$utilStr）：**

```javascript
// 对象转 FormData（文件上传）
this.$utilStr.objToFormData(this.formData)
```

**用户工具（$utilPublic）：**

```javascript
// 获取用户信息
const userInfo = this.$utilPublic.getUserInfo()
```

### 8.4 hdList Mixin 提供的方法

| 方法名                     | 说明                     |
| -------------------------- | ------------------------ |
| `setIndex(index)`          | 设置表格序号（自动分页） |
| `handleSortChange`         | 处理表格排序             |
| `handleSizeChange`         | 处理分页大小变化         |
| `handleCurrentChange`      | 处理分页页码变化         |
| `validateExport()`         | 验证导出操作             |
| `download(response)`       | 下载文件                 |
| `formatDatetime(datetime)` | 格式化日期时间           |
| `triggerDeletedReload()`   | 删除后刷新列表           |
| `AUTHORITY_QUERY`          | 查询权限判断（属性）     |

### 8.5 hdForm Mixin 提供的方法

| 方法名                           | 说明               |
| -------------------------------- | ------------------ |
| `scrollIntoFormErrorView(error)` | 滚动到表单错误位置 |

---

## 九、业务组件（biz-*系列）

### 9.1 业务表单卡片

```vue
<biz-form-card title="基础信息">
  <!-- 表单内容 -->
</biz-form-card>

<biz-form-card title="审批步骤">
  <!-- 表单内容 -->
</biz-form-card>
```

### 9.2 业务表单布局

```vue
<biz-form>
  <biz-form-row>
    <biz-form-item label="字段名" :required="true" :span="12">
      <el-form-item prop="fieldName">
        <el-input v-model="formData.fieldName"></el-input>
      </el-form-item>
    </biz-form-item>
    
    <biz-form-item label="字段名2" :required="false" :span="12">
      <el-form-item prop="fieldName2">
        <el-input v-model="formData.fieldName2"></el-input>
      </el-form-item>
    </biz-form-item>
  </biz-form-row>
</biz-form>
```

**biz-form-item 属性：**
- `label`: 标签文本
- `required`: 是否必填（控制标签样式，不控制验证）
- `span`: 栅格占位（24栅格系统）
- `pClass`: 自定义样式类

**注意：** `required` 仅控制样式，真正的必填验证在 `el-form-item` 的 `rules` 中配置

---

## 十、最佳实践

### 10.1 数据结构规范

**列表数据结构：**

```javascript
tableData: [
  {
    vo: {          // 值对象（存储原始值）
      id: '1',
      name: '张三',
      status: '1',
      orgId: '150000000000'
    },
    vox: {         // 扩展对象（存储显示文本）
      status: '已启用',
      orgId: '内蒙古自治区'
    }
  }
]
```

**表单数据结构：**

```javascript
// 新增/编辑页
formData: {
  id: '',
  name: '',
  status: ''
},
extendData: {
  statusText: ''  // 编辑时从后端获取的文本值
}

// 详情页
formData: {
  vo: {
    id: '',
    name: ''
  },
  vox: {
    statusText: ''
  }
}
```

### 10.2 组件复用技巧

**表格选择器配置复用：**

```javascript
// 在 List 组件中定义
data() {
  return {
    tableSelectOptions: {
      api: page,
      props: {...},
      columns: [...],
      searches: [...]
    }
  }
}

// 在 Add/Edit 组件中引用
inject: ['hdList'],
data() {
  return {
    tableSelectOptions: this.hdList.tableSelectOptions
  }
}
```

### 10.3 表单重置

**完整重置：**

```javascript
resetForm() {
  // 重置表单字段
  this.$refs.formRef.resetFields();
  // 重置扩展字段
  this.$refs.componentRef.resetFields();
}
```

### 10.4 文件上传

**单文件上传：**

```javascript
submitForm() {
  const dataParams = {
    ...this.formData
  };
  add(dataParams).then(...);
}
```

**多文件/FormData上传：**

```javascript
submitForm() {
  // 对象转 FormData
  const dataParams = this.$utilStr.objToFormData(this.formData);
  add(dataParams).then(...);
}
```

### 10.5 条件渲染优化

**动态表格列：**

```javascript
data() {
  return {
    columnsVisible: [false, false, false, true, true]
  }
},
methods: {
  handleShowColumn() {
    this.loading = true;
    this.columnsVisible = [true, true, true, true, true];
    this.$nextTick(() => {
      this.$refs.tableRef.doLayout();
      this.loading = false;
    });
  }
}
```

---

## 十一、快速查询表

### 11.1 组件属性速查

| 属性              | 适用组件                                       | 说明                             |
| ----------------- | ---------------------------------------------- | -------------------------------- |
| `underline`       | 大部分 hd-* 组件                               | 显示下划线样式（表单编辑页）     |
| `show-all-button` | hd-dict-radio/checkbox                         | 显示"全部"按钮（查询页）         |
| `multiple`        | select/cascader/organ/region 等                | 多选模式                         |
| `filterable`      | select/cascader                                | 可搜索                           |
| `model-text.sync` | dict-select/cascader/organ/region/table-select | 同步显示文本到扩展数据（编辑页） |
| `prop`            | 需要文本同步的组件                             | 字段名（配合 model-text 使用）   |
| `dict-code`       | hd-dict-* 系列                                 | 字典类型编码                     |

### 11.2 常用事件速查

| 事件              | 适用组件        | 回调参数                                | 说明         |
| ----------------- | --------------- | --------------------------------------- | ------------ |
| `@currentChanged` | hd-table-select | `(currentKeys, oldValue, multipleData)` | 选中项变化   |
| `@sort-change`    | el-table        | `({column, prop, order})`               | 排序变化     |
| `@size-change`    | el-pagination   | `(val)`                                 | 分页大小变化 |
| `@current-change` | el-pagination   | `(val)`                                 | 页码变化     |

### 11.3 Mixin 速查

| Mixin    | 引入方式                                          | 主要功能                       |
| -------- | ------------------------------------------------- | ------------------------------ |
| `hdList` | `import { hdList } from '@/utils/util-framework'` | 列表页功能：分页、排序、权限等 |
| `hdForm` | `import { hdForm } from '@/utils/util-framework'` | 表单页功能：表单验证、滚动等   |

### 11.4 API 方法命名规范

| 方法名         | 说明     | 参数                             | 返回值             |
| -------------- | -------- | -------------------------------- | ------------------ |
| `page`         | 分页查询 | `{...queryData, ...pageOptions}` | `{total, records}` |
| `add`          | 新增     | `formData`                       | `{success, msg}`   |
| `addBefore`    | 新增前   | -                                | `{vo, vox}`        |
| `edit`         | 编辑     | `formData`                       | `{success, msg}`   |
| `editBefore`   | 编辑前   | `{id}`                           | `{vo, vox}`        |
| `detail`       | 详情     | `{id}`                           | `{vo, vox}`        |
| `singleDelete` | 单个删除 | `{id}`                           | `{success, msg}`   |
| `exports`      | 导出     | `queryData`                      | 文件流             |

---

## 十二、常见问题

### 12.1 表格不显示

**原因：** 忘记调用 `doLayout`

**解决：**

```javascript
this.$refs.tableRef.doLayout();
```

### 12.2 表单重置不彻底

**原因：** 只重置了表单字段，未重置扩展字段

**解决：**

```javascript
resetForm() {
  this.$refs.formRef.resetFields();
  this.$refs.componentRef.resetFields();  // 重置扩展字段
}
```

### 12.3 编辑页文本显示不出来

**原因：** 未使用 `model-text.sync` 同步文本

**解决：**

```vue
<hd-dict-select 
  prop="type"
  v-model="formData.type" 
  :model-text.sync="extendData.type"
  :dict-code="$global.dictType.formType">
</hd-dict-select>
```

### 12.4 表格选择器配置找不到

**原因：** 未在 List 组件中定义或未通过 inject 引入

**解决：**

```javascript
// List 组件
data() {
  return {
    tableSelectOptions: {...}
  }
}

// Add/Edit 组件
inject: ['hdList'],
data() {
  return {
    tableSelectOptions: this.hdList.tableSelectOptions
  }
}
```

---

## 十三、总结

本文档基于 **examples/1**、**examples/2**、**formManage**、**ywsp** 四个业务模块，总结了 HDty 前端框架的常用组件使用方法和页面布局规范。

**核心要点：**

1. **布局规范**：三段式布局（header + fit + footer）
2. **组件复用**：优先使用 `hd-*` 系列组件，遵循命名规范
3. **数据结构**：`vo` 存储值，`vox` 存储文本
4. **Mixin 使用**：`hdList` 用于列表页，`hdForm` 用于表单页
5. **表单验证**：使用 Element UI 的验证规则
6. **权限控制**：通过 `hd-button` 的 `name` 属性实现

**开发建议：**

- 新功能开发前先查阅本文档，复用已有组件
- 严格遵循数据结构规范，便于后期维护
- 表单页必须使用 `hd-component` 管理扩展数据
- 编辑页组件需同步显示文本到扩展数据

**文档维护：**

本文档将随着系统演进持续更新，确保与代码实践保持一致。

---

## 十四、标准业务模块模板归纳

### 14.1 标准CRUD模板

**标准模板包含5个页面：**

| 页面   | 文件名          | 说明                           |
| ------ | --------------- | ------------------------------ |
| 列表页 | `XxxList.vue`   | 包含查询、表格、分页、操作按钮 |
| 新增页 | `XxxAdd.vue`    | Dialog弹窗表单                 |
| 编辑页 | `XxxEdit.vue`   | Dialog弹窗表单（带数据回显）   |
| 详情页 | `XxxDetail.vue` | Dialog只读展示                 |
| 注销页 | `XxxLogout.vue` | Dialog表单（可选）             |

**目录结构：**

```
模块名称/
├── api/
│   └── index.js          # API接口
├── XxxList.vue            # 列表页
├── XxxAdd.vue             # 新增页
├── XxxEdit.vue            # 编辑页
├── XxxDetail.vue          # 详情页
└── XxxLogout.vue          # 注销页（可选）
```

### 14.2 查询区域统一规范

**重要规定：**

> 所有统计列表页和分页列表页的查询区域，统一使用 `<hd-query>` 组件

**标准结构：**

```vue
<div class="hdty-header">
  <el-form ref="queryRef" :model="queryData" :rules="rules" inline>
    <hd-component :model="extendData" ref="componentRef">
      <hd-query>
        <!-- 固定显示区域 -->
        <hd-query-fixed>
          <el-form-item label="字段" prop="field">
            <el-input v-model="queryData.field"></el-input>
          </el-form-item>
          
          <!-- 高级过滤(slot="after") -->
          <el-form-item prop="orgId" slot="after">
            <hd-organ v-model="queryData.orgId" placeholder="高级查询：请选择机构"></hd-organ>
          </el-form-item>
        </hd-query-fixed>
        
        <!-- 可展开区域 -->
        <hd-query-expand>
          <el-row>
            <el-form-item label="字段2" prop="field2">
              <!-- 查询组件 -->
            </el-form-item>
          </el-row>
        </hd-query-expand>
      </hd-query>
    </hd-component>
  </el-form>
  
  <!-- 按钮区域 -->
  <hd-button-container>
    <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
    <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
    <hd-button name="add" type="success" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</hd-button>
  </hd-button-container>
</div>
```

**核心要点：**

1. **必须使用 `hd-query`**：所有列表页查询区域统一使用
2. **固定查询项**：放在 `hd-query-fixed` 中
3. **高级查询项**：使用 `slot="after"` 属性
4. **展开查询项**：放在 `hd-query-expand` 中，使用 `el-row` 包裹
5. **扩展数据管理**：使用 `hd-component` 管理扩展数据

### 14.3 快速创建新模块步骤

**步骤1：创建目录结构**

```bash
模块名称/
├── api/
│   └── index.js
├── XxxList.vue
├── XxxAdd.vue
├── XxxEdit.vue
└── XxxDetail.vue
```

**步骤2：复制模板代码**

参考 `examples/1` 或 `ywsp` 模块的代码模板

**步骤3：修改关键配置**

- 修改组件 `name` 和 `moduleName`
- 修改 API 接口路径
- 修改表单字段
- 修改表格列配置

**步骤4：注册路由**

在路由文件中添加模块路由配置

---

## 十五、额外常规业务组件（biz-*系列）

> 以下组件位于 `src/views/plugs` 目录，是项目中常用的业务组件

### 15.1 文本与展示类组件

#### biz-auto-text（自适应文本）

**用途：** 自动调整字体大小以适应容器的文本组件

**使用场景：** 需要文本自适应容器大小时（如打印、报表）

```vue
<biz-auto-text
  :text="content"
  :isHtml="true"
  :initialFontSize="4"
  :description="提示文本">
</biz-auto-text>
```

**属性：**

| 属性              | 类型    | 默认值 | 说明             |
| ----------------- | ------- | ------ | ---------------- |
| `text`            | String  | ''     | 文本内容         |
| `isHtml`          | Boolean | false  | 是否渲染HTML     |
| `initialFontSize` | Number  | 4      | 初始字体大小(mm) |
| `description`     | String  | ''     | title提示文字    |

**特点：**
- 自动根据容器大小调整字体
- 支持HTML渲染（自动换行转`<br>`）
- 防止字体缩小到无法阅读

#### biz-html（HTML渲染）

**用途：** 简单的HTML文本渲染组件

```vue
<biz-html :value="htmlContent"></biz-html>
```

**属性：**
- `value` (String): HTML文本内容（自动将`\n`转为`<br>`）

#### biz-text（可展开文本）

**用途：** 带展开/收起功能的长文本组件

```vue
<biz-text :text="longText" :maxRow="3"></biz-text>
```

**属性：**

| 属性     | 类型   | 默认值 | 说明         |
| -------- | ------ | ------ | ------------ |
| `text`   | String | -      | 文本内容     |
| `maxRow` | Number | 3      | 最大显示行数 |

**特点：**
- 自动检测内容是否超出
- 超出时显示"展开内容"/"收起内容"按钮
- 支持自动换行转换

#### biz-num-unit（数值单位）

**用途：** 显示数值及其单位

```vue
<biz-num-unit :value="100" unit="人"></biz-num-unit>
<!-- 输出: 100人 -->

<biz-num-unit :value="null" unit="人"></biz-num-unit>
<!-- 输出: （空，不显示单位） -->
```

**属性：**
- `value` (Number/String): 数值
- `unit` (String): 单位文本（必填）

**特点：**
- 仅在有值时显示单位
- 自动处理空值、null、undefined

### 15.2 标签类组件

#### biz-tags（标签列表）

**用途：** 展示标签列表

```vue
<!-- 简单文本数组 -->
<biz-tags :value="['标签1', '标签2', '标签3']"></biz-tags>

<!-- 对象数组 -->
<biz-tags
  :value="[{label: '标签1'}, {label: '标签2'}]"
  :tagTypes="['success', 'warning']"
  size="small"
  effect="light">
</biz-tags>
```

**属性：**

| 属性       | 类型   | 默认值      | 说明                        |
| ---------- | ------ | ----------- | --------------------------- |
| `value`    | Array  | []          | 标签数据                    |
| `size`     | String | 'small'     | 标签大小(medium/small/mini) |
| `effect`   | String | 'light'     | 标签主题(dark/light/plain)  |
| `tagTypes` | Array  | ['primary'] | 标签类型循环数组            |

**支持的标签类型：**
- `primary`
- `success`
- `info`
- `warning`
- `danger`

#### biz-input-tags（可输入标签）

**用途：** 可动态添加/删除的标签输入组件

```vue
<biz-input-tags
  v-model="tagList"
  placeholder="请输入标签"
  :maxlength="20"
  :rules="[{ required: true, message: '请输入标签', trigger: 'blur' }]"
  :showZjBtn="true">
</biz-input-tags>
```

**属性：**

| 属性              | 类型          | 默认值    | 说明               |
| ----------------- | ------------- | --------- | ------------------ |
| `value` (v-model) | Array         | []        | 标签数组           |
| `placeholder`     | String        | '请输入'  | 输入框提示         |
| `tagType`         | String        | 'primary' | 标签类型           |
| `rules`           | Array         | []        | 验证规则           |
| `maxlength`       | Number/String | -         | 最大字符长度       |
| `showZjBtn`       | Boolean       | true      | 是否显示"追加"按钮 |

**特点：**
- 支持回车、点击按钮、失焦添加标签
- 自动去重验证
- 可自定义验证规则
- 支持关闭删除标签

### 15.3 文件类组件

#### biz-file-list（文件列表展示）

**用途：** 只读展示文件列表，支持下载

```vue
<biz-file-list :fileList="files"></biz-file-list>
```

**数据格式：**

```javascript
files: [
  {
    fileName: '文件名.pdf',  // 或 name
    fileUrl: 'http://...'    // 或 url
  }
]
```

**特点：**
- 点击文件直接下载
- 空状态提示"暂无附件"
- 自动兼容 `fileName/name` 和 `fileUrl/url` 字段

#### biz-file-upload（文件上传）

**用途：** 文件上传组件，支持上传、下载、删除

```vue
<biz-file-upload
  v-model="fileIds"
  :oldFileList.sync="fileList"
  :uploadApi="uploadApi"
  :busType="'42'"
  :limit="5"
  valueType="ids"
  :showAddBtn="true"
  :deleteFileSubItem="true">
</biz-file-upload>
```

**属性：**

| 属性                | 类型          | 默认值                           | 说明                 |
| ------------------- | ------------- | -------------------------------- | -------------------- |
| `v-model`           | Array/Object  | -                                | 文件ID或对象         |
| `oldFileList.sync`  | Array         | []                               | 文件列表（双向绑定） |
| `uploadApi`         | Function      | -                                | 上传接口（必填）     |
| `busType`           | String        | '42'                             | 业务类型             |
| `limit`             | Number/String | -                                | 最大上传数量         |
| `valueType`         | String        | 'ids'                            | 值类型(ids/obj)      |
| `showAddBtn`        | Boolean       | true                             | 是否显示上传按钮     |
| `deleteFileSubItem` | Boolean       | true                             | 是否可删除文件       |
| `fileProp`          | String        | 'file'                           | 文件字段名           |
| `uploadProp`        | Object        | `{id: 'fileId', url: 'fileUrl'}` | 响应字段映射         |

**valueType 说明：**

```javascript
// valueType='ids' 时，v-model 绑定值为：
['id1', 'id2', 'id3']

// valueType='obj' 时，v-model 绑定值为：
{
  addList: ['id1', 'id2'],  // 新增的文件ID
  delList: [],               // 删除的文件ID
  oldList: []                // 原有的文件ID
}
```

**限制说明：**
- 支持格式：jpg、png、jpeg、gif、bmp、doc、docx、xls、xlsx、pdf、txt、zip、rar
- 大小限制：50MB
- 自动去重（同名文件）

**特殊功能：**
- `limit=1` 时，按钮文字自动变为"重新上传"
- 支持点击文件名下载
- 支持删除文件

#### biz-photo-list（图片列表展示）

**用途：** 图片列表展示，支持点击预览

```vue
<biz-photo-list
  :value="photoList"
  :border="true"
  :scroll="false"
  imgHeight="200px"
  emptyHeight="60px">
</biz-photo-list>
```

**属性：**

| 属性          | 类型    | 默认值  | 说明         |
| ------------- | ------- | ------- | ------------ |
| `value`       | Array   | []      | 图片数组     |
| `border`      | Boolean | false   | 是否显示边框 |
| `scroll`      | Boolean | false   | 是否横向滚动 |
| `imgHeight`   | String  | '200px' | 图片高度     |
| `emptyHeight` | String  | '60px'  | 空状态高度   |

**数据格式：**

```javascript
photoList: [
  {
    id: '1',
    name: '图片名称',
    url: 'http://...'
  }
]
```

**特点：**
- 使用 `viewer` 插件实现点击预览
- 支持横向滚动模式
- 空状态提示"暂无照片"

#### biz-form-upload（表单图片上传）

**用途：** 表单中的图片上传组件（卡片式）

```vue
<biz-form-upload
  v-model="photoIds"
  :oldFileList.sync="photoList"
  :limit="10"
  :acceptType="['jpg', 'png', 'jpeg']"
  :acceptSize="50"
  :busType="'41'"
  valueType="ids"
  :watermark="false">
</biz-form-upload>
```

**属性：**

| 属性               | 类型          | 默认值                           | 说明                 |
| ------------------ | ------------- | -------------------------------- | -------------------- |
| `v-model`          | Array/Object  | []                               | 图片ID或对象         |
| `oldFileList.sync` | Array         | []                               | 图片列表（双向绑定） |
| `acceptType`       | Array/String  | ['jpg','png','jpeg','gif','bmp'] | 允许的图片类型       |
| `acceptSize`       | Number/String | 50                               | 大小限制(MB)         |
| `limit`            | Number        | 10                               | 最大上传数量         |
| `watermark`        | Boolean       | false                            | 是否添加水印         |
| `busType`          | String        | '41'                             | 业务类型             |
| `valueType`        | String        | 'ids'                            | 值类型(ids/obj)      |

**特点：**
- 卡片式上传UI
- 支持点击预览大图
- 支持删除图片
- 达到限制数量时隐藏上传按钮

### 15.4 表单布局组件

#### biz-form（表单容器）

**用途：** 表单容器，提供统一样式

```vue
<biz-form>
  <biz-form-row>
    <!-- 表单项 -->
  </biz-form-row>
</biz-form>
```

#### biz-form-row（表单行）

**用途：** 表单行容器

```vue
<biz-form-row>
  <biz-form-item label="字段名" :span="12">
    <el-form-item prop="field">
      <el-input v-model="formData.field"></el-input>
    </el-form-item>
  </biz-form-item>
</biz-form-row>
```

#### biz-form-item（表单项）

**用途：** 表单项容器，提供标签、布局、提示功能

```vue
<biz-form-item
  label="字段名"
  :required="true"
  :span="12"
  :labelWidth="100"
  tip="这是提示信息"
  tipPosition="right"
  pClass="p-divs">
  <el-form-item prop="field">
    <el-input v-model="formData.field"></el-input>
  </el-form-item>
</biz-form-item>
```

**属性：**

| 属性          | 类型          | 默认值  | 说明                       |
| ------------- | ------------- | ------- | -------------------------- |
| `label`       | String        | -       | 标签文本（必填）           |
| `required`    | Boolean       | false   | 是否必填（仅样式）         |
| `span`        | Number/String | 24      | 栅格占位(1-24)             |
| `labelWidth`  | Number/String | -       | 标签宽度(px)               |
| `tip`         | String        | ''      | 提示信息                   |
| `tipPosition` | String        | 'right' | 提示位置(right/top/bottom) |
| `pClass`      | String        | ''      | 自定义样式类               |
| `labelTop`    | Boolean       | false   | 标签是否在上方             |

**注意：**
- `required` 只控制样式，不控制验证
- 真正的验证在 `el-form-item` 的 `rules` 中配置
- `pClass` 常用值：`p-divs`、`p-div3`

#### biz-form-card（表单卡片）

**用途：** 带标题的表单卡片容器

```vue
<biz-form-card title="基础信息" headerIcon="el-icon-tickets">
  <template slot="header">
    <!-- 自定义头部内容 -->
  </template>
  
  <template slot="card-header">
    <!-- 卡片头部 -->
  </template>
  
  <!-- 表单内容 -->
  <biz-form>
    <biz-form-row>...</biz-form-row>
  </biz-form>
</biz-form-card>
```

**属性：**
- `title` (String): 标题文字（默认："基本信息"）
- `headerIcon` (String): 标题图标（默认："el-icon-tickets"）

**插槽：**
- `header`: 自定义头部右侧内容
- `card-header`: 卡片头部内容
- `default`: 卡片主体内容

#### biz-form-cards（表单卡片容器）

**用途：** 简化版表单卡片（无边框）

```vue
<biz-form-cards title="审批信息">
  <!-- 表单内容 -->
</biz-form-cards>
```

**属性：**
- `title` (String): 标题文字（默认："基本信息"）

### 15.5 业务特定组件

#### biz-spgj-list（审批轨迹列表）

**用途：** 展示审批轨迹信息

```vue
<biz-spgj-list
  ref="spgjListRef"
  :showRwDetail="true"
  :currentTaskId="taskId">
</biz-spgj-list>
```

**属性：**

| 属性            | 类型    | 默认值 | 说明                     |
| --------------- | ------- | ------ | ------------------------ |
| `showRwDetail`  | Boolean | true   | 是否显示任务办结详情按钮 |
| `currentTaskId` | String  | ''     | 当前任务ID               |

**方法：**

```javascript
// 初始化数据
this.$refs.spgjListRef.initData(spId);

// 重置数据
this.$refs.spgjListRef.resetData();
```

**特点：**
- 时间轴展示审批记录
- 区分申请和审批节点
- 显示待审批信息（呼吸灯效果）
- 支持查看可审批人员
- 支持跳转任务办结详情

**展示内容：**
- 审批时间
- 审批人及机构
- 审批意见/申请原因
- 审批结果（同意/拒绝）
- 待审批单位/人员

---

## 十六、组件选型指南

### 16.1 文本展示组件选型

| 场景       | 推荐组件        | 说明            |
| ---------- | --------------- | --------------- |
| 普通文本   | 直接使用        | `{{ text }}`    |
| HTML渲染   | `biz-html`      | 自动换行转换    |
| 长文本展示 | `biz-text`      | 带展开/收起功能 |
| 自适应文本 | `biz-auto-text` | 打印、报表场景  |
| 数值+单位  | `biz-num-unit`  | 自动处理空值    |

### 16.2 文件组件选型

| 场景             | 推荐组件          | 说明         |
| ---------------- | ----------------- | ------------ |
| 只读展示文件列表 | `biz-file-list`   | 仅展示+下载  |
| 上传文件（通用） | `biz-file-upload` | 支持多种格式 |
| 上传图片（表单） | `biz-form-upload` | 卡片式UI     |
| 展示图片列表     | `biz-photo-list`  | 支持预览     |

### 16.3 表单布局组件选型

| 场景     | 推荐组件                                      | 说明           |
| -------- | --------------------------------------------- | -------------- |
| 简单表单 | `el-form` + `el-form-item`                    | Element UI原生 |
| 复杂表单 | `biz-form` + `biz-form-row` + `biz-form-item` | 统一样式       |
| 卡片表单 | `biz-form-card`                               | 带标题和边框   |
| 分组表单 | `biz-form-cards`                              | 简洁分组       |

### 16.4 标签组件选型

| 场景         | 推荐组件         | 说明           |
| ------------ | ---------------- | -------------- |
| 静态标签展示 | `biz-tags`       | 只读展示       |
| 动态添加标签 | `biz-input-tags` | 可输入编辑     |
| 单个标签     | `el-tag`         | Element UI原生 |

---

## 十七、最佳实践补充

### 17.1 文件上传最佳实践

**使用 biz-file-upload：**

```vue
<template>
  <biz-file-upload
    v-model="fileIds"
    :oldFileList.sync="fileList"
    :uploadApi="uploadFileApi"
    :busType="'42'"
    :limit="5"
    valueType="ids">
  </biz-file-upload>
</template>

<script>
import { uploadFile } from '@/api/common';

export default {
  data() {
    return {
      fileIds: [],
      fileList: []
    };
  },
  methods: {
    uploadFileApi(params) {
      return uploadFile(params);
    }
  }
};
</script>
```

### 17.2 审批轨迹最佳实践

```vue
<template>
  <biz-spgj-list
    ref="spgjListRef"
    :showRwDetail="true"
    :currentTaskId="row.vo.taskUserRecodeId">
  </biz-spgj-list>
</template>

<script>
export default {
  data() {
    return {
      row: {}
    };
  },
  methods: {
    beforeLoadForm() {
      // 加载审批轨迹
      this.$refs.spgjListRef.initData(this.row.vo.spId);
    }
  }
};
</script>
```

### 17.3 表单布局最佳实践

```vue
<biz-form-card title="基础信息">
  <biz-form>
    <biz-form-row>
      <biz-form-item label="字段1" :required="true" :span="12">
        <el-form-item prop="field1">
          <el-input v-model="formData.field1"></el-input>
        </el-form-item>
      </biz-form-item>
      
      <biz-form-item label="字段2" :required="false" :span="12">
        <el-form-item prop="field2">
          <el-input v-model="formData.field2"></el-input>
        </el-form-item>
      </biz-form-item>
    </biz-form-row>
    
    <biz-form-row>
      <biz-form-item label="备注" :required="false" :span="24" tip="最多200字" tipPosition="top">
        <el-form-item prop="memo">
          <el-input type="textarea" v-model="formData.memo" :rows="3" maxlength="200"></el-input>
        </el-form-item>
      </biz-form-item>
    </biz-form-row>
  </biz-form>
</biz-form-card>
```

---

---

## 十八、数据晾晒模块（Flex-View）专用规范

### 18.1 模块说明

数据晾晒模块是一个**独立的业务模块**,所有相关代码都集中在 `src/views/business/flex-view/` 目录下。

**核心特点**:
- ✅ 配置驱动:基于后端配置动态渲染统计列表和表单
- ✅ 组件复用:最大化利用 HDty 框架组件
- ✅ 模块隔离:不污染全局目录,所有代码都在 flex-view 下

### 18.2 组件使用策略

#### 18.2.1 统计列表页组件选型

**❌ 不使用的组件**:
- `hd-build-table` - 不使用,因为统计列表页需要个性化定制
- `hd-form` - 不使用,因为动态表单需要个性化定制

**✅ 使用的组件**:
- `el-table` + `el-table-column` - 基础表格组件
- `el-form` + `el-form-item` - 基础表单组件
- **HDty 字段组件** - 在动态表单中复用

#### 18.2.2 自研组件清单

| 组件名称       | 路径                                                      | 用途         | 使用场景      |
| -------------- | --------------------------------------------------------- | ------------ | ------------- |
| `StatTable`    | `flex-view/stat/components/StatTable.vue`                 | 统计表格展示 | 统计列表页    |
| `StatQuery`    | `flex-view/stat/components/StatQuery.vue`                 | 统计查询条件 | 统计列表页    |
| `DetailDialog` | `flex-view/stat/components/DetailDialog.vue`              | 明细数据弹窗 | 统计列表页    |
| `DynamicTable` | `flex-view/components/common/DynamicTable/`               | 动态表格组件 | 明细列表      |
| `DynamicForm`  | `flex-view/components/common/DynamicForm/`                | 动态表单组件 | 明细新增/编辑 |
| `FieldRender`  | `flex-view/components/common/DynamicForm/FieldRender.vue` | 字段渲染器   | 表单字段渲染  |

### 18.3 页面布局规范

#### 18.3.1 统计列表页布局

**文件**: `flex-view/stat/index.vue`

```vue
<template>
  <div class="hdty-container hdty-flex">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <stat-query
        :query-fields="queryFields"
        @query="handleQuery"
        @reset="handleReset"
      />
    </div>

    <!-- 统计表格区域 -->
    <div class="hdty-fit">
      <stat-table
        ref="statTable"
        :columns="columns"
        :data="statData"
        :loading="loading"
        @cell-click="handleCellClick"
      />
    </div>

    <!-- 分页区域 -->
    <div class="hdty-footer">
      <el-pagination
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      />
    </div>

    <!-- 明细数据弹窗 -->
    <detail-dialog
      :visible.sync="detailVisible"
      :form-id="currentFormId"
      :org-id="currentOrgId"
      @refresh="refreshStatData"
    />
  </div>
</template>
```

**核心要点**:
- 使用 `hdty-container hdty-flex` 标准三段式布局
- 统计表格使用自研的 `StatTable` 组件,不使用 `hd-build-table`
- 分页组件直接使用 `el-pagination`
- 明细弹窗独立封装为 `DetailDialog` 组件

#### 18.3.2 明细弹窗布局

**文件**: `flex-view/stat/components/DetailDialog.vue`

```vue
<template>
  <el-dialog
    :title="dialogTitle"
    :visible="visible"
    width="80%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <!-- 查询条件（使用 DynamicForm 组件） -->
    <div class="hdty-header">
      <dynamic-form
        ref="queryForm"
        :form-items="queryFields"
        :inline="true"
      >
        <template #footer>
          <hd-button-container>
            <hd-button name="query" type="info" @click="handleQuery">查询</hd-button>
            <hd-button @click="handleReset">清空</hd-button>
            <hd-button name="add" type="success" @click="handleAdd">新增</hd-button>
          </hd-button-container>
        </template>
      </dynamic-form>
    </div>

    <!-- 明细列表（使用 DynamicTable 组件） -->
    <div class="hdty-fit">
      <dynamic-table
        :columns="detailColumns"
        :data="detailData"
        :loading="loading"
        :show-operation="true"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- 分页 -->
    <div class="hdty-footer">
      <el-pagination
        :current-page="pagination.current"
        :page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, prev, pager, next"
        @current-change="handlePageChange"
      />
    </div>

    <!-- 新增/编辑表单弹窗 -->
    <el-dialog
      :title="editMode === 'add' ? '新增' : '编辑'"
      :visible.sync="editVisible"
      width="60%"
      append-to-body
    >
      <dynamic-form
        ref="editForm"
        :form-items="formFields"
        :init-data="currentRow"
        @submit="handleSave"
      >
        <template #footer>
          <hd-button-container>
            <hd-button @click="editVisible = false">取消</hd-button>
            <hd-button type="primary" @click="$refs.editForm.submit()">保存</hd-button>
          </hd-button-container>
        </template>
      </dynamic-form>
    </el-dialog>
  </el-dialog>
</template>
```

**核心要点**:
- 明细弹窗内部也使用三段式布局
- 查询条件使用 `DynamicForm` 组件(inline 模式)
- 明细列表使用 `DynamicTable` 组件
- 新增/编辑使用嵌套弹窗 + `DynamicForm` 组件

### 18.4 动态表单字段配置

#### 18.4.1 字段类型映射表

| 配置字段类型    | 渲染组件            | 数据类型     | 说明               |
| --------------- | ------------------- | ------------ | ------------------ |
| `input`         | `el-input`          | String       | 单行文本输入       |
| `textarea`      | `el-input`          | String       | 多行文本输入       |
| `number`        | `el-input-number`   | Number       | 数字输入           |
| `select`        | `el-select`         | String/Array | 下拉选择           |
| `radio`         | `el-radio-group`    | String       | 单选框             |
| `checkbox`      | `el-checkbox-group` | Array        | 复选框             |
| `date`          | `hd-date-picker`    | String       | 日期选择(YYYYMMDD) |
| `daterange`     | `hd-date-picker`    | Array        | 日期范围           |
| `datetime`      | `hd-date-picker`    | String       | 日期时间           |
| `organ`         | `hd-organ`          | String       | 机构选择           |
| `region`        | `hd-region`         | String       | 地区选择           |
| `dict-select`   | `hd-dict-select`    | String       | 字典下拉选择       |
| `dict-cascader` | `hd-dict-cascader`  | String/Array | 字典级联选择       |
| `dict-radio`    | `hd-dict-radio`     | String       | 字典单选框         |
| `dict-checkbox` | `hd-dict-checkbox`  | Array        | 字典复选框         |

#### 18.4.2 字段配置 JSON 结构

```javascript
{
  "prop": "userName",           // 字段属性名
  "label": "用户姓名",          // 字段标签
  "type": "input",              // 字段类型
  "required": true,             // 是否必填
  "span": 12,                   // 栅格占位(24栅格)
  "config": {                   // 字段配置
    "placeholder": "请输入用户姓名",
    "maxlength": 50,
    "disabled": false,
    "readonly": false
  },
  "rules": [                    // 验证规则
    {
      "required": true,
      "message": "用户姓名不能为空",
      "trigger": "blur"
    },
    {
      "max": 50,
      "message": "用户姓名长度不能超过50个字符",
      "trigger": "blur"
    }
  ],
  "showInForm": true,           // 是否在表单显示
  "showInList": true,           // 是否在列表显示
  "showInQuery": true           // 是否在查询显示
}
```

#### 18.4.3 HDty 字段组件特殊配置

**日期选择组件** (`hd-date-picker`):
```javascript
{
  "type": "date",
  "config": {
    "type": "date",           // year/month/date/datetime/daterange
    "placeholder": "请选择日期",
    "format": "YYYYMMDD",     // 返回格式
    "keepTime": false         // 是否保留当前时间
  }
}
```

**机构选择组件** (`hd-organ`):
```javascript
{
  "type": "organ",
  "config": {
    "placeholder": "请选择机构",
    "multiple": false,        // 是否多选
    "filterCode": "",         // 过滤机构编码
    "showLevel": "5"          // 显示层级
  }
}
```

**字典选择组件** (`hd-dict-select`):
```javascript
{
  "type": "dict-select",
  "config": {
    "dictCode": "SEX",        // 字典类型编码
    "placeholder": "请选择",
    "filterable": true,       // 是否可搜索
    "multiple": false         // 是否多选
  }
}
```

### 18.5 JavaScript 代码规范

#### 18.5.1 统计列表页脚本模板

```javascript
import { mapState, mapActions } from 'vuex'
import StatQuery from './components/StatQuery.vue'
import StatTable from './components/StatTable.vue'
import DetailDialog from './components/DetailDialog.vue'

export default {
  name: 'FlexViewStatPage',
  components: {
    StatQuery,
    StatTable,
    DetailDialog
  },
  data() {
    return {
      statData: [],
      loading: false,
      pagination: {
        current: 1,
        pageSize: 50,
        total: 0
      },
      queryParams: {},
      detailVisible: false,
      currentFormId: null,
      currentOrgId: null
    }
  },
  computed: {
    ...mapState('flexViewColumn', ['columns']),
    
    // 从列配置中提取查询字段
    queryFields() {
      return this.extractQueryFields(this.columns)
    }
  },
  created() {
    this.init()
  },
  methods: {
    ...mapActions('flexViewColumn', ['loadColumns']),
    ...mapActions('flexViewStat', ['loadStatData']),
    
    async init() {
      await this.loadColumns()
      await this.loadData()
    },
    
    async loadData() {
      this.loading = true
      try {
        const params = {
          ...this.queryParams,
          page: this.pagination.current,
          pageSize: this.pagination.pageSize
        }
        const { data, total } = await this.loadStatData(params)
        this.statData = data
        this.pagination.total = total
      } finally {
        this.loading = false
      }
    },
    
    handleQuery(params) {
      this.queryParams = params
      this.pagination.current = 1
      this.loadData()
    },
    
    handleCellClick({ column, row }) {
      if (column.formId) {
        this.currentFormId = column.formId
        this.currentOrgId = row.orgId
        this.detailVisible = true
      }
    },
    
    extractQueryFields(columns) {
      // 递归提取可查询字段
      const fields = []
      const traverse = (cols) => {
        cols.forEach(col => {
          if (col.queryable) {
            fields.push({
              prop: col.prop,
              label: col.label,
              type: col.queryType || 'input'
            })
          }
          if (col.children) traverse(col.children)
        })
      }
      traverse(columns)
      return fields
    }
  }
}
```

#### 18.5.2 动态表单组件脚本模板

```javascript
export default {
  name: 'DynamicForm',
  props: {
    formItems: {
      type: Array,
      default: () => []
    },
    initData: {
      type: Object,
      default: () => ({})
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {},
      formRules: {}
    }
  },
  watch: {
    formItems: {
      handler() {
        this.initForm()
      },
      immediate: true
    }
  },
  methods: {
    // 初始化表单
    initForm() {
      this.initFormData()
      this.initFormRules()
    },
    
    // 初始化表单数据
    initFormData() {
      const data = {}
      this.formItems.forEach(item => {
        data[item.prop] = item.config?.defaultValue || null
      })
      this.formData = { ...data, ...this.initData }
    },
    
    // 初始化验证规则
    initFormRules() {
      const rules = {}
      this.formItems.forEach(item => {
        if (item.rules && item.rules.length > 0) {
          rules[item.prop] = item.rules
        }
      })
      this.formRules = rules
    },
    
    // 提交表单
    submit() {
      this.$refs.formRef.validate(valid => {
        if (valid) {
          this.$emit('submit', this.formData)
        }
      })
    },
    
    // 重置表单
    resetFields() {
      this.$refs.formRef.resetFields()
    }
  }
}
```

### 18.6 最佳实践

#### 18.6.1 组件导入规范

**✅ 正确做法**:
```javascript
// 导入 flex-view 内部组件(使用相对路径)
import DynamicTable from '../components/common/DynamicTable'
import { getStatData } from '../api/stat-data'
import { arrayToTree } from '../utils/column-tree'

// 导入 HDty 组件(使用 @ 别名)
import HdDatePicker from '@/components/hd-date-picker'
import HdOrgan from '@/components/hd-organ'
```

**❌ 错误做法**:
```javascript
// ❌ 不要使用 @ 别名导入 flex-view 内部组件
import DynamicTable from '@/views/business/flex-view/components/common/DynamicTable'

// ❌ 不要在全局目录创建 flex-view 组件
import DynamicTable from '@/components/DynamicTable'
```

#### 18.6.2 配置数据处理

**列配置缓存**:
```javascript
// 在 Vuex store 中缓存列配置
actions: {
  async loadColumns({ state, commit }) {
    // 检查缓存
    const now = Date.now()
    if (state.columnCache && (now - state.cacheTime < state.cacheExpire)) {
      return state.columnCache
    }
    
    // 加载配置
    const { data } = await getColumnTree()
    commit('SET_COLUMN_CACHE', { data, time: now })
    return data
  }
}
```

**表单配置解析**:
```javascript
// 解析表单项配置
parseFormItems(items) {
  return items.map(item => ({
    prop: item.itemProp,
    label: item.itemLabel,
    type: item.itemType,
    required: item.isRequired === '1',
    span: item.itemSpan || 24,
    config: this.parseConfig(item.itemConfig),
    rules: this.parseRules(item)
  }))
}
```

### 18.7 常见问题

#### Q1: 为什么不使用 hd-build-table?

**A**: 统计列表页需要大量个性化定制(多级表头、固定列、单元格样式、点击事件等),使用 `hd-build-table` 会受限于框架限制,后期维护困难。因此选择基于 `el-table` 自研 `StatTable` 组件。

#### Q2: 为什么不使用 hd-form?

**A**: 动态表单需要支持配置驱动、字段联动、复杂验证等功能,使用 `hd-form` 难以满足灵活性需求。因此选择基于 `el-form` 自研 `DynamicForm` 组件,但内部复用 HDty 字段组件(`hd-date-picker`、`hd-organ` 等)。

#### Q3: DynamicTable 和 StatTable 有什么区别?

**A**: 
- `StatTable`: 专用于统计列表页,个性化定制,支持多级表头、固定列、单元格点击等
- `DynamicTable`: 通用明细列表组件,配置驱动,用于明细弹窗的数据列表展示

#### Q4: 如何在 DynamicForm 中使用 HDty 组件?

**A**: `DynamicForm` 内部通过 `FieldRender` 组件根据字段类型动态渲染组件。当字段类型为 `date`、`organ`、`dict-select` 等时,会自动渲染对应的 HDty 组件。

---

**文档版本：** v3.0  
**创建日期：** 2025-01-XX  
**最后更新：** 2025-11-26  
**更新内容：** 新增数据晾晒模块专用规范(第十八章)
