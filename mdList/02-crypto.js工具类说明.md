# crypto.js 工具类说明

## 概述
`crypto.js` 是一个加密工具类，提供了多种加密算法的实现，包括 AES、SM2、SM3、SM4、MD5、SHA256、Base64 等加密方式，用于数据的安全传输和存储。

## 主要功能

### 1. 基础加密方法
- `md5(str)`: MD5 加密
- `sha256(str)`: SHA256 加密
- `base64(str)`: Base64 编码
- `base64Decrypt(str)`: Base64 解码

### 2. AES 加密相关
- `aesEncrypt(word, key, iv)`: AES 加密
- `aesDecrypt(word, key, iv)`: AES 解密
- `aesEncryptNetworkData(data, key)`: AES 网络数据传输加密
- `aesDecryptNetworkData(data, key)`: AES 网络数据传输解密
- `isAesEncryptNetworkData(str, key)`: 判断字符串是否为 AES 加密格式

### 3. SM 系列加密相关
- `sm2Encrypt(data, publicKey)`: SM2 加密
- `sm2Decrypt(data, privateKey)`: SM2 解密
- `sm3Encrypt(data)`: SM3 加密
- `sm4Encrypt(word, password)`: SM4 加密
- `sm4Decrypt(word, password)`: SM4 解密
- `sm4EncryptNetworkData(data, key)`: SM4 网络数据传输加密
- `sm4DecryptNetworkData(data, key)`: SM4 网络数据传输解密
- `isSm4EncryptNetworkData(str, key)`: 判断字符串是否为 SM4 加密格式

### 4. 格式转换方法
- `toHex(word)`: WordArray 转 16 进制
- `hexToWordArray(hex)`: 16 进制转 WordArray
- `toUft8(word)`: WordArray 转 utf8
- `utf8ToWordArray(utf8)`: utf8 转 WordArray
- `toBase64(word)`: WordArray 转 base64
- `base64ToWordArray(base64)`: base64 转 WordArray

## 使用示例

```javascript
// MD5 加密
const encrypted = $crypto.md5('password');

// AES 加密
const encrypted = $crypto.aesEncryptNetworkData('data', 'key');

// SM4 加密
const encrypted = $crypto.sm4EncryptNetworkData('data', 'key');

// Base64 编码
const encoded = $crypto.base64('data');
```

## 注意事项
1. 默认密钥为 '0123hdtytech3210'
2. 支持国密算法 SM2、SM3、SM4
3. 提供了网络传输专用的加密方法，自动处理密钥和初始化向量
4. 包含了加密格式验证方法，可判断字符串是否为特定加密格式