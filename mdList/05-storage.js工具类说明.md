# storage.js 工具类说明

## 概述
`storage.js` 是一个存储工具类，封装了浏览器的 localStorage、sessionStorage 和 cookie 操作，提供了统一的接口来管理客户端存储数据。支持数据加密存储和命名空间管理，确保数据安全和组织性。

## 主要功能

### 1. 存储对象
- `cookie`: Cookie 操作对象
- `local`: localStorage 操作对象
- `session`: sessionStorage 操作对象

### 2. Cookie 操作方法
- `cookie.get(key)`: 获取 Cookie 值
- `cookie.set(key, value, exDays)`: 设置 Cookie 值
- `cookie.remove(key)`: 移除 Cookie 值

### 3. localStorage 操作方法
- `local.get(key)`: 获取 localStorage 值
- `local.set(key, value)`: 设置 localStorage 值
- `local.remove(key)`: 移除 localStorage 值
- `local.clearStarts(prefix)`: 清除以指定前缀开头的所有值
- `local.clear()`: 清除当前应用命名空间下的所有值

### 4. sessionStorage 操作方法
- `session.get(key)`: 获取 sessionStorage 值
- `session.set(key, value)`: 设置 sessionStorage 值
- `session.remove(key)`: 移除 sessionStorage 值
- `session.clearBesides(key)`: 清除除了指定值之外的所有值
- `session.clearStarts(prefix)`: 清除以指定前缀开头的所有值
- `session.clear()`: 清除当前应用命名空间下的所有值
- `session.clearCurrentLogin()`: 清除当前登录痕迹

## 配置参数

### 默认配置
- `PREFIX`: 应用程序命名空间前缀，默认为 `appEnv.appKEY || "hdty-flex-view-web"`
- `ENCRYPT`: 是否启用加密存储，默认为 `process.env.ENCRYPT_SESS`
- `KEY`: 加密密钥，默认为 'L4Pda6uBBHcfqEhA'
- `IV`: 初始化向量，默认为空字符串

## 使用示例

```javascript
// localStorage 操作
$storage.local.set('userInfo', { name: '张三', age: 25 });
const userInfo = $storage.local.get('userInfo');
$storage.local.remove('userInfo');

// sessionStorage 操作
$storage.session.set('token', 'abc123');
const token = $storage.session.get('token');

// Cookie 操作
$storage.cookie.set('username', 'zhangsan', 7); // 保存7天
const username = $storage.cookie.get('username');
$storage.cookie.remove('username');
```

## 加密存储支持

当启用加密存储时（ENCRYPT 为 true），sessionStorage 中的数据会通过 AES 加密后存储：

```javascript
// 加密存储
$storage.session.set('sensitiveData', { id: 123, password: 'secret' });

// 解密读取
const data = $storage.session.get('sensitiveData'); // 自动解密
```

## 命名空间管理

所有存储操作都会自动添加应用程序命名空间前缀，避免不同应用之间的数据冲突：

```javascript
// 实际存储的键名会是: "hdty-flex-view-web:userInfo"
$storage.local.set('userInfo', { name: '张三' });
```

## 注意事项
1. sessionStorage 和 localStorage 有存储大小限制（通常为 5-10MB）
2. Cookie 有大小限制（通常为 4KB）和数量限制
3. 加密存储仅适用于 sessionStorage
4. 所有存储操作都支持 JSON 对象的自动序列化和反序列化
5. 提供了多种清除数据的方法，便于精细化管理存储空间
6. 支持清除当前登录痕迹，用于用户登出场景