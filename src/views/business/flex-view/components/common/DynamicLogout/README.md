# DynamicLogout 组件使用说明

## 📋 组件概述

`DynamicLogout` 是一个通用的注销确认弹窗组件，用于在动态表格或列表中执行注销操作。

## 🎯 功能特性

- ✅ 通用注销弹窗，可复用于多个业务场景
- ✅ 必填注销原因（最大200字符）
- ✅ 采用 biz-form 语义化布局
- ✅ 支持自定义注销接口调用
- ✅ 注销成功后自动刷新列表

## 📦 组件位置

```
src/views/business/flex-view/components/common/DynamicLogout/
├── index.vue          # 主组件
└── README.md          # 使用说明
```

## 🔧 使用方法

### 1. 引入组件

```vue
<template>
  <div>
    <!-- 你的列表或表格 -->
    <dynamic-table
      :show-logout="true"
      @logout="handleLogout"
    />
    
    <!-- 注销弹窗 -->
    <dynamic-logout 
      ref="logoutRef" 
      @submit="handleLogoutSubmit"
    />
  </div>
</template>

<script>
import DynamicLogout from "../../components/common/DynamicLogout/index.vue";

export default {
  components: {
    DynamicLogout
  }
}
</script>
```

### 2. 处理注销事件

```javascript
import { dynamicFormLogout } from "../api/index";

methods: {
  // 打开注销弹窗
  handleLogout(row) {
    this.$refs.logoutRef.visible = true;
    this.$refs.logoutRef.row = row;
    this.$nextTick(() => {
      this.$refs.logoutRef.beforeLoadForm();
    });
  },

  // 处理注销提交
  async handleLogoutSubmit({ id, zxyy, callback }) {
    try {
      const response = await dynamicFormLogout({
        id,
        zxyy
      });

      const { success, msg } = response.data;
      callback(success, msg);  // 必须调用callback通知组件结果

      if (success) {
        // 刷新列表或其他操作
        this.loadList();
      }
    } catch (error) {
      console.error("注销失败:", error);
      callback(false, "注销失败");
    }
  }
}
```

## 📝 Props 说明

该组件使用 `ref` 方式调用，通过直接设置组件属性：

| 属性    | 类型    | 说明                           |
| ------- | ------- | ------------------------------ |
| visible | Boolean | 控制弹窗显示/隐藏              |
| row     | Object  | 要注销的行数据（需包含 vo.id） |

## 🎪 Events 说明

| 事件名 | 参数                   | 说明         |
| ------ | ---------------------- | ------------ |
| submit | { id, zxyy, callback } | 提交注销表单 |

**submit 事件参数说明：**
- `id`: 数据 ID（从 row.vo.id 获取）
- `zxyy`: 注销原因
- `callback(success, msg)`: 回调函数，必须调用以通知组件处理结果

## 🌟 配合 DynamicTable 使用

### 启用注销按钮

```vue
<dynamic-table
  :show-operation="true"
  :show-logout="true"
  @logout="handleLogout"
/>
```

**DynamicTable 相关 Props：**

| 属性        | 类型    | 默认值 | 说明             |
| ----------- | ------- | ------ | ---------------- |
| show-logout | Boolean | false  | 是否显示注销按钮 |
| show-edit   | Boolean | true   | 是否显示编辑按钮 |
| show-delete | Boolean | true   | 是否显示删除按钮 |

**注意：** 编辑和注销按钮仅在 `vo.zxbs === '0'`（未注销）时显示。

## 📌 完整示例

详见：
- `src/views/business/flex-view/stat/components/DetailListView.vue`
- `src/views/business/flex-view/config/form/index.vue`

## ⚠️ 注意事项

1. **必须调用 callback**：在 `handleLogoutSubmit` 中处理完接口后，必须调用 `callback(success, msg)` 通知组件
2. **数据结构**：组件期望 `row.vo.id` 结构，确保传入的行数据符合此格式
3. **注销原因必填**：最大长度 200 字符
4. **注销状态判断**：按钮通过 `v-if="scope.row.vo.zxbs === '0'"` 控制显示
5. **列表刷新**：注销成功后需要手动调用 `loadList()` 刷新列表
6. **接口调用**：使用 `dynamicFormLogout({ id, zxyy })` 接口，路径为 `/web/sjls/sysBizDataCommon/logout`

## 🔄 与其他注销组件的区别

| 组件           | 适用场景                  | 位置                                          |
| -------------- | ------------------------- | --------------------------------------------- |
| DynamicLogout  | 通用注销（动态表格/列表） | flex-view/components/common/DynamicLogout     |
| FormLogout     | 表单配置注销              | flex-view/config/form/FormLogout.vue          |
| FormItemLogout | 表单项配置注销            | flex-view/config/form-item/FormItemLogout.vue |
| ColumnLogout   | 列配置注销                | flex-view/config/column/ColumnLogout.vue      |

**DynamicLogout** 是最精简的通用版本，仅包含注销原因一个字段，适用于需要快速集成注销功能的场景。

## 🎨 样式说明

组件继承自 Element UI 的 Dialog 样式，使用 `custom-class="new-form"` 应用项目统一样式。

内部使用 biz-form 系列语义化类名，保持与项目其他表单页面的一致性。
