# util-login.js 工具类说明

## 概述
`util-login.js` 是一个登录处理工具类，提供了用户登录、登出、权限管理、用户信息获取等功能。

## 主要功能

### 登录相关函数

#### login(response, vnode)
- **功能**：用户登录
- **参数**：
  - `response` (Object) - 登录响应对象，包含authorization头部
  - `vnode` (Object) - Vue组件实例，包含登录表单数据
- **返回值**：无
- **功能说明**：
  1. 从响应头中获取authorization token并存储到sessionStorage
  2. 跳转到登录后的首页
  3. 如果用户选择了记住密码，则将用户名和密码存储到cookie和sessionStorage

#### reset()
- **功能**：登录重置（异步）
- **返回值**：Promise
- **功能说明**：
  1. 清除sessionStorage中的用户信息、路由信息、权限信息、导航信息
  2. 清除store和DOM中的当前登录痕迹
  3. 重置页面到登录页

#### clear()
- **功能**：登录清除
- **返回值**：无
- **功能说明**：
  1. 清除sessionStorage中的当前登录痕迹
  2. 清除store和DOM中的当前登录痕迹

#### logout()
- **功能**：用户登出
- **返回值**：无
- **功能说明**：
  1. 清除所有登录相关信息
  2. 跳转到登录页面

#### clearPwdAndLogout()
- **功能**：清除密码并登出
- **返回值**：无
- **功能说明**：
  1. 清除保存的密码信息（cookie和sessionStorage）
  2. 清除所有登录相关信息
  3. 跳转到登录页面

### 版本配置函数

#### mmv(data)
- **功能**：登录版本数据配置
- **参数**：`data` (string|Array) - 版本数据
- **返回值**：无
- **功能说明**：
  1. 将版本数据存储到sessionStorage
  2. 支持直接传入版本号或版本数据集合

### 路径获取函数

#### getLoginPath()
- **功能**：获取登录地址（异步）
- **返回值**：Promise<string> - 登录路径
- **功能说明**：
  1. 根据配置获取登录后的跳转路径
  2. 如果需要，从后端获取用户路由信息

#### getResetPath()
- **功能**：获取登录重置地址（异步）
- **返回值**：Promise<string> - 重置路径
- **功能说明**：
  1. 根据当前路径获取重置后的跳转路径
  2. 如果需要，从后端获取用户路由信息

#### getLogoutPath()
- **功能**：获取登出地址
- **返回值**：string - 登出路径
- **功能说明**：
  1. 返回固定的登出路径"/login"

### 用户信息获取函数

#### getUserRouters()
- **功能**：获取登录用户路由
- **返回值**：Array - 用户路由数组
- **功能说明**：
  1. 从store或sessionStorage获取用户路由信息

#### getUserAuthorities()
- **功能**：获取登录用户权限
- **返回值**：Object - 用户权限对象
- **功能说明**：
  1. 从store或sessionStorage获取用户权限信息

#### getUserModuleAuthority(moduleName, enabled)
- **功能**：获取登录用户某个模块权限
- **参数**：
  - `moduleName` (string) - 模块名称
  - `enabled` (boolean) - 是否启用权限控制，默认为全局配置
- **返回值**：boolean - 是否有权限

#### getUserAuthority(authorityName, moduleName, enabled)
- **功能**：获取登录用户某个权限
- **参数**：
  - `authorityName` (string) - 权限名称
  - `moduleName` (string) - 模块名称
  - `enabled` (boolean) - 是否启用权限控制，默认为全局配置
- **返回值**：boolean - 是否有权限

#### getUserNavigations()
- **功能**：获取登录用户导航
- **返回值**：Array - 用户导航数组
- **功能说明**：
  1. 从store或sessionStorage获取用户导航信息

#### getUserInfo()
- **功能**：获取登录用户信息
- **返回值**：Object - 用户信息对象
- **功能说明**：
  1. 从store或sessionStorage获取用户信息

### 用户属性获取函数

#### getUserToken()
- **功能**：获取登录用户身份令牌
- **返回值**：string - 用户令牌
- **功能说明**：
  1. 从store或sessionStorage获取用户令牌

#### getUserAvatar()
- **功能**：获取登录用户头像
- **返回值**：string - 用户头像URL
- **功能说明**：
  1. 从store或用户信息中获取用户头像

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

#### getUserOrgName()
- **功能**：获取登录用户所属机构名称
- **返回值**：string - 机构名称
- **功能说明**：
  1. 从用户信息中获取用户所属机构名称

#### getUserOrgLevel()
- **功能**：获取登录用户所属机构级别
- **返回值**：string - 机构级别
- **功能说明**：
  1. 从用户信息中获取用户所属机构级别

#### getUserRegionId()
- **功能**：获取登录用户所在地区编码
- **返回值**：string - 地区编码
- **功能说明**：
  1. 从用户信息中获取用户所在地区编码

#### getUserRegionName()
- **功能**：获取登录用户所在地区名称
- **返回值**：string - 地区名称
- **功能说明**：
  1. 从用户信息中获取用户所在地区名称

#### getUserRegionLevel()
- **功能**：获取登录用户所在地区级别
- **返回值**：string|Array - 地区级别
- **功能说明**：
  1. 从用户信息中获取用户所在地区级别
  2. 支持返回单个级别或多个级别数组

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

## 使用示例

```javascript
// 用户登录
login(loginResponse, this); // this指向Vue组件实例

// 用户登出
logout();

// 清除密码并登出
clearPwdAndLogout();

// 获取用户信息
const userInfo = getUserInfo();
console.log(userInfo); // 输出: 用户信息对象

// 获取用户权限
const authorities = getUserAuthorities();
console.log(authorities); // 输出: 用户权限对象

// 检查模块权限
const hasModuleAuth = getUserModuleAuthority('userManage');
console.log(hasModuleAuth); // 输出: true 或 false

// 检查操作权限
const hasAuth = getUserAuthority('query', 'userManage');
console.log(hasAuth); // 输出: true 或 false

// 获取用户Id
const userId = getUserId();
console.log(userId); // 输出: 用户Id

// 获取用户所属机构编码
const orgId = getUserOrgId();
console.log(orgId); // 输出: 机构编码

// 获取登录地址
getLoginPath().then(path => {
  console.log(path); // 输出: 登录后的跳转路径
});
```

## 注意事项
1. 登录相关函数需要与后端API配合使用，确保响应格式正确
2. 用户信息和权限数据存储在sessionStorage和Vuex store中，页面刷新后会从sessionStorage恢复
3. 权限检查函数支持全局配置是否启用权限控制
4. 部分函数是异步的，返回Promise对象
5. 获取用户信息的函数会优先从Vuex store获取，如果不存在则从sessionStorage获取
6. 地区级别获取函数会根据地区编码自动计算级别
7. 接入系统AppId获取函数会排除当前系统AppId