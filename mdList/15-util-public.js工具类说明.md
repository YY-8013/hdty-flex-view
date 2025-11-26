# util-public.js 工具类说明

## 概述
`util-public.js` 是一个公共工具类，提供了用户信息获取、权限检查、链接处理等常用功能。

## 主要功能

### 用户信息获取函数

#### getUserInfo()
- **功能**：获取登录用户信息
- **返回值**：Object - 用户信息对象
- **功能说明**：
  1. 从sessionStorage中获取用户信息
  2. 如果不存在则返回空对象

#### getUserRights(name)
- **功能**：获取登录用户权限（旧框架方法）
- **参数**：`name` (string) - 权限名称（可选）
- **返回值**：Object|undefined - 指定权限对象或所有权限对象
- **功能说明**：
  1. 从sessionStorage中获取用户权限信息
  2. 如果传入权限名称则返回指定权限，否则返回所有权限

#### getUserAuthority(authorityName, moduleName)
- **功能**：获取登录用户权限
- **参数**：
  - `authorityName` (string) - 权限名称
  - `moduleName` (string) - 模块名称
- **返回值**：Object|boolean - 权限对象或是否有权限
- **功能说明**：
  1. 从sessionStorage中获取用户权限信息
  2. 根据模块名称和权限名称检查是否有相应权限

#### getUserToken()
- **功能**：获取登录用户身份令牌
- **返回值**：string - 用户令牌
- **功能说明**：
  1. 从sessionStorage中获取用户令牌
  2. 如果不存在则返回空字符串

#### getUserId()
- **功能**：获取登录用户Id
- **返回值**：string - 用户Id
- **功能说明**：
  1. 从用户信息中获取用户Id

#### getUsername()
- **功能**：获取登录用户名
- **返回值**：string - 用户名
- **功能说明**：
  1. 从用户信息中获取用户名

#### getUserXm()
- **功能**：获取登录用户真实姓名
- **返回值**：string - 用户真实姓名
- **功能说明**：
  1. 从用户信息中获取用户真实姓名

#### getUserGmsfhm()
- **功能**：获取登录用户身份证号
- **返回值**：string - 用户身份证号
- **功能说明**：
  1. 从用户信息中获取用户身份证号

#### getUserOrgId()
- **功能**：获取登录用户所属机构编码
- **返回值**：string - 机构编码
- **功能说明**：
  1. 从用户信息中获取用户所属机构编码

#### isCurrentOrg(orgId)
- **功能**：是否是当前用户机构
- **参数**：`orgId` (string) - 机构编码
- **返回值**：boolean - 是否是当前用户机构
- **功能说明**：
  1. 比较传入的机构编码是否与当前用户机构编码相同

#### getUserOrgName()
- **功能**：获取登录用户所属机构名称
- **返回值**：string - 机构名称
- **功能说明**：
  1. 从用户信息中获取用户所属机构名称

#### getUserRegionId()
- **功能**：获取登录用户所在地区编码
- **返回值**：string - 地区编码
- **功能说明**：
  1. 从用户信息中获取用户所在地区编码

#### getAppId()
- **功能**：获取系统AppId
- **返回值**：string - 系统AppId
- **功能说明**：
  1. 从用户信息中获取当前系统AppId

#### getJoinAppIds()
- **功能**：获取所有接入系统AppId
- **返回值**：Array - 接入系统AppId数组
- **功能说明**：
  1. 从用户信息中获取所有接入系统的AppId
  2. 排除当前系统AppId

### 链接处理函数

#### getLinkPageURL(options)
- **功能**：获取链接系统跳转地址
- **参数**：`options` (Object) - 配置选项
  - `path` (string) - 跳转路径
  - `appId` (string) - 跳转项目标识
  - `subpage` (boolean) - 是否属于上级页面
  - `bodypage` (boolean) - 是否只显示主体内容
  - `params` (Object) - 跳转请求参数
  - `image` (Object) - 跳转请求图片
  - `transform` (boolean) - 是否转换跳转路径，默认true
  - `callback` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）
- **功能说明**：
  1. 根据配置生成跳转链接
  2. 支持路径转换功能

#### getTransformURL(options, callback)
- **功能**：获取转换后的跳转地址
- **参数**：
  - `options` (Object) - 配置选项
    - `path` (string) - 跳转路径
    - `appId` (string) - 跳转项目标识
    - `subpage` (boolean) - 是否属于上级页面，默认true
    - `bodypage` (boolean) - 是否只显示主体内容，默认true
    - `params` (Object) - 跳转请求参数
    - `image` (Object) - 跳转请求图片
  - `callback` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）
- **功能说明**：
  1. 调用后端API获取转换后的跳转地址
  2. 处理跳转参数和图片参数

### 权限检查函数

#### isAuthority(authorityName)
- **功能**：获取登录用户权限
- **参数**：`authorityName` (string) - 权限名称
- **返回值**：Object - 权限对象
- **功能说明**：
  1. 从sessionStorage中获取指定权限对象

#### getUserOrgLevel()
- **功能**：获取登录用户所属机构级别
- **返回值**：string - 机构级别
- **功能说明**：
  1. 从用户信息中获取用户所属机构级别

### 富文本处理函数

#### extractOssFileIds(html)
- **功能**：解析富文本中的图片路径
- **参数**：`html` (string) - HTML字符串
- **返回值**：Array - OSS文件ID数组
- **功能说明**：
  1. 使用DOMParser解析HTML
  2. 提取img标签中包含ossfileid参数的文件ID

#### replaceImagePrefix(content, targetPrefix, replacement)
- **功能**：处理替换baseURL
- **参数**：
  - `content` (string) - 内容
  - `targetPrefix` (string) - 目标前缀
  - `replacement` (string) - 替换内容
- **返回值**：string - 处理后的内容
- **功能说明**：
  1. 精确匹配图片src属性中的目标前缀并替换

### 辅助函数

#### escapeRegExp(string)
- **功能**：转义正则表达式特殊字符
- **参数**：`string` (string) - 字符串
- **返回值**：string - 转义后的字符串
- **功能说明**：
  1. 将正则表达式特殊字符进行转义

## 使用示例

```javascript
// 获取用户信息
const userInfo = getUserInfo();
console.log(userInfo); // 输出: 用户信息对象

// 获取用户权限
const userRights = getUserRights();
console.log(userRights); // 输出: 所有权限对象

// 检查用户权限
const hasAuth = getUserAuthority('query', 'userManage');
console.log(hasAuth); // 输出: 权限对象或false

// 获取用户令牌
const token = getUserToken();
console.log(token); // 输出: 用户令牌

// 获取链接跳转地址
getLinkPageURL({
  path: '/user/detail',
  appId: 'app123',
  params: {
    userId: '12345'
  },
  callback: function(result) {
    console.log(result); // 输出: 跳转链接信息
  }
});

// 获取转换后的跳转地址
getTransformURL({
  path: '/user/detail',
  appId: 'app123',
  params: {
    userId: '12345'
  }
}, function(fullPath) {
  console.log(fullPath); // 输出: 转换后的完整路径
});

// 检查是否有权限
const authority = isAuthority('userManage');
console.log(authority); // 输出: 权限对象

// 解析富文本中的图片路径
const html = '<img src="http://example.com/image.jpg?ossfileid=12345">';
const fileIds = extractOssFileIds(html);
console.log(fileIds); // 输出: ['12345']

// 替换图片前缀
const content = '<img src="http://old-domain.com/image.jpg">';
const newContent = replaceImagePrefix(content, 'http://old-domain.com/', 'http://new-domain.com/');
console.log(newContent); // 输出: 替换后的HTML内容
```

## 注意事项
1. 用户信息相关函数从sessionStorage中获取数据，需要确保用户已登录
2. 权限检查函数返回的权限对象结构可能因系统而异
3. 链接处理函数需要后端API支持路径转换功能
4. `getLinkPageURL` 和 `getTransformURL` 函数是异步的，通过回调函数返回结果
5. 富文本处理函数使用DOMParser解析HTML，在某些旧浏览器中可能不支持
6. `replaceImagePrefix` 函数使用正则表达式进行精确匹配和替换
7. 部分函数与util-login.js中的功能类似，但实现方式略有不同