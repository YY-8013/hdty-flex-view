# util-link.js 工具类说明

## 概述
`util-link.js` 是一个链接处理工具类，主要用于生成和处理页面跳转链接，支持参数传递、路径转换等功能。

## 主要功能

### 核心函数

#### getLinkPageURL(options, callbackFullPath)
- **功能**：获取链接页面跳转地址
- **参数**：
  - `options` (Object) - 配置选项
    - `path` (string) - 跳转路径
    - `appId` (string) - 目标程序身份标识
    - `appClient` (string) - 目标程序客户端标识，默认为`appEnv.clientTYPE`
    - `params` (Object) - 跳转请求参数
    - `images` (Object) - 跳转请求图像参数
    - `superParams` (Object) - 最高权重跳转请求参数
    - `superImages` (Object) - 最高权重跳转请求图像参数
    - `subpage` (boolean) - 是否仅作为子页面
    - `bodypage` (boolean) - 是否只显示主内容
    - `landing` (boolean) - 是否进行登录认证
    - `forward` (boolean) - 是否转接跳转参数，默认true
    - `transform` (boolean) - 是否转换跳转路径，默认true
    - `callback` (Function) - 回调函数（回调参数为对象）
  - `callbackFullPath` (Function) - 回调函数（回调参数为完整路径）
- **返回值**：无（通过回调函数返回结果）

#### transformLinkPath(options, callbackFullPath)
- **功能**：转换链接路径
- **参数**：
  - `options` (Object) - 配置选项（与getLinkPageURL类似，但不包含transform参数）
  - `callbackFullPath` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）

### 辅助函数

#### processLinkParams(path, params, images, landing, appId, appClient, subpage, bodypage, parentParams, superParams, superImages, forward, transform)
- **功能**：处理链接参数
- **参数**：
  - `path` (string) - 路径
  - `params` (Object) - 参数
  - `images` (Object) - 图像参数
  - `landing` (boolean) - 是否登录认证
  - `appId` (string) - 应用ID
  - `appClient` (string) - 客户端类型
  - `subpage` (boolean) - 是否子页面
  - `bodypage` (boolean) - 是否只显示主体
  - `parentParams` (Object) - 父级参数
  - `superParams` (Object) - 超级参数
  - `superImages` (Object) - 超级图像参数
  - `forward` (boolean) - 是否转发
  - `transform` (boolean) - 是否转换
- **返回值**：处理后的链接对象

#### processLinkParamsKeywords(params, level)
- **功能**：处理链接参数中的关键字
- **参数**：
  - `params` (Object) - 参数对象
  - `level` (number) - 处理级别（1或2）
- **返回值**：处理后的参数对象

## 使用示例

```javascript
// 获取链接页面跳转地址
getLinkPageURL({
  path: '/user/detail',
  appId: 'app123',
  params: {
    userId: '12345',
    name: 'John'
  },
  callback: function(linkRoute) {
    console.log(linkRoute); // 输出: 链接路由对象
    // { fullPath: "...", path: "...", fullParams: {...}, params: {...} }
  }
}, function(fullPath) {
  console.log(fullPath); // 输出: 完整路径
});

// 转换链接路径
transformLinkPath({
  path: '/user/detail',
  appId: 'app123',
  params: {
    userId: '12345'
  },
  callback: function(linkRoute) {
    console.log(linkRoute.fullPath); // 输出: 转换后的完整路径
  }
});

// 处理链接参数
const processedLink = processLinkParams(
  '/user/detail',
  { userId: '12345' },
  {},
  true,
  'app123',
  'web',
  false,
  false,
  {},
  {},
  {},
  true,
  false
);
console.log(processedLink); // 输出: 处理后的链接对象
```

## 注意事项
1. 该工具类主要在Vue项目中使用，依赖Vue Router进行页面跳转
2. `getLinkPageURL` 函数是异步的，通过回调函数返回结果
3. 链接参数处理支持多层参数合并，优先级从低到高为：初始参数 < 父级参数 < 默认参数 < 原始参数 < 超级参数
4. `transform` 参数控制是否进行路径转换，转换时会调用后端API获取实际跳转路径
5. `forward` 参数控制是否转发父级路由参数
6. 处理链接参数时会根据不同的level级别过滤掉不同的关键字参数
7. 生成的链接支持携带多种参数类型，包括普通参数、图像参数、超级参数等
8. 需要确保相关API（如subSystemUrl）能够正常访问以支持路径转换功能