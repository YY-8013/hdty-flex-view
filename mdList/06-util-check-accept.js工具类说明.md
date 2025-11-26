# util-check-accept.js 工具类说明

## 概述
`util-check-accept.js` 是一个用于验收功能相关的工具类，主要提供与验收地市判断相关的计算属性。

## 主要功能

### hdCheckAccept 计算属性对象
该工具类导出一个名为 `hdCheckAccept` 的对象，包含以下计算属性：

#### isCheckAccept
- **功能**：判断当前用户是否为验收地市
- **返回值**：布尔值，如果当前用户机构属于验收地市则返回 `true`，否则返回 `false`
- **实现逻辑**：
  1. 获取用户所属机构ID（通过 `$utilPublic.getUserOrgId()` 方法）
  2. 截取机构ID的前4位
  3. 检查该4位机构代码是否包含在 `appEnv.checkCity` 配置中
  4. 如果包含则返回 `true`，否则返回 `false`

## 使用示例

```javascript
// 在Vue组件中使用
export default {
  computed: {
    ...hdCheckAccept.computed
  },
  methods: {
    handleAccept() {
      if (this.isCheckAccept) {
        // 执行验收地市特有的逻辑
        console.log('当前用户为验收地市');
      } else {
        // 非验收地市的处理逻辑
        console.log('当前用户不是验收地市');
      }
    }
  }
}
```

## 注意事项
1. 该工具类依赖于全局环境变量 `appEnv.checkCity`，需要确保该配置正确设置
2. 依赖 `$utilPublic.getUserOrgId()` 方法获取用户机构ID
3. 该工具类主要用于Vue组件的计算属性中