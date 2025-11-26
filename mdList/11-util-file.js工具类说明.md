# util-file.js 工具类说明

## 概述
`util-file.js` 是一个文件处理工具类，提供了文件类型判断、文件格式转换、文件下载等功能。

## 主要功能

### 文件类型判断函数

#### isAssetTypeAnFile(ext)
- **功能**：判断是否文件类型
- **参数**：`ext` (string) - 文件扩展名
- **返回值**：布尔值，如果是文件类型返回true，否则返回false
- **支持的文件类型**：包括图片、文档、压缩文件、视频、音频、文字等多种文件类型

#### isAssetTypeAnImage(ext)
- **功能**：判断是否图片类型
- **参数**：`ext` (string) - 文件扩展名
- **返回值**：布尔值，如果是图片类型返回true，否则返回false
- **支持的图片类型**：jpg、jpeg、png、gif、webp、svg、bmp等

#### isBase64(str)
- **功能**：判断是否base64编码
- **参数**：`str` (string) - 待检测的字符串
- **返回值**：布尔值，如果是base64编码返回true，否则返回false

#### isFilePath(str)
- **功能**：判断是否文件路径
- **参数**：`str` (string) - 待检测的字符串
- **返回值**：布尔值，如果是文件路径返回true，否则返回false

### 文件格式转换函数

#### fileToBase64(file, callback)
- **功能**：file转base64（同时支持blob转base64）
- **参数**：
  - `file` (File|Blob) - 文件对象
  - `callback` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）

#### imgToBase64(url, callback)
- **功能**：imgUrl转base64
- **参数**：
  - `url` (string) - 图片URL
  - `callback` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）

#### base64ToBlob(base64)
- **功能**：base64转blob
- **参数**：`base64` (string) - base64编码字符串
- **返回值**：Blob对象

#### base64ToFile(base64, filename, ext)
- **功能**：base64转file
- **参数**：
  - `base64` (string) - base64编码字符串
  - `filename` (string) - 文件名
  - `ext` (string) - 文件扩展名
- **返回值**：File对象

### 文件类型处理函数

#### assetTypeToAcceptType(ext)
- **功能**：文件类型转有效的接受类型
- **参数**：`ext` (string) - 文件扩展名
- **返回值**：对应的MIME类型字符串

#### isBmpType(ext, fileType)
- **功能**：判断是否为bmp文件
- **参数**：
  - `ext` (string) - 文件扩展名
  - `fileType` (string) - 文件类型
- **返回值**：布尔值

### 文件名处理函数

#### appendFileExtension(filename, ext, url)
- **功能**：追加文件扩展名
- **参数**：
  - `filename` (string) - 文件名
  - `ext` (string) - 扩展名
  - `url` (string) - URL（可选）
- **返回值**：带有扩展名的完整文件名

#### getFileExtension(filename)
- **功能**：获取文件扩展名
- **参数**：`filename` (string) - 文件名或文件路径
- **返回值**：文件扩展名

#### getFilenameOfPath(path)
- **功能**：获取文件路径下最后的文件名
- **参数**：`path` (string) - 文件路径
- **返回值**：文件名

#### removeFileExtension(filename)
- **功能**：去除文件扩展名
- **参数**：`filename` (string) - 文件名
- **返回值**：不包含扩展名的文件名

### 浏览器相关函数

#### getIEVersion()
- **功能**：获取IE浏览器版本
- **返回值**：IE版本号或-1（表示不是IE浏览器）

### 图片处理函数

#### captureImage(options)
- **功能**：截取图片的一部分
- **参数**：`options` (Object) - 配置选项
  - `url` (string) - 图片地址
  - `newWidth` (number) - 截取图片宽度
  - `newHeight` (number) - 截取图片高度
  - `offsetX` (number) - 水平方向的偏移，默认0
  - `offsetY` (number) - 垂直方向的偏移，默认0
  - `ratio` (number) - 比率，默认1
  - `callback` (Function) - 回调函数
- **返回值**：无（通过回调函数返回结果）

#### removeBase64Prefix(base64)
- **功能**：去除base64编码前缀
- **参数**：`base64` (string) - base64编码字符串
- **返回值**：去除前缀后的base64字符串

### 文件下载函数

#### downloadImage(url, filename, ext)
- **功能**：下载URL图片
- **参数**：
  - `url` (string) - 图片URL
  - `filename` (string) - 文件名
  - `ext` (string) - 文件扩展名
- **返回值**：无

#### downloadBase64(base64, filename, ext)
- **功能**：下载base64图片
- **参数**：
  - `base64` (string) - base64编码字符串
  - `filename` (string) - 文件名
  - `ext` (string) - 文件扩展名
- **返回值**：无

#### downloadFile(url, filename, ext)
- **功能**：下载URL文件
- **参数**：
  - `url` (string) - 文件URL
  - `filename` (string) - 文件名
  - `ext` (string) - 文件扩展名
- **返回值**：无

#### downloadBlob(content, filename, ext)
- **功能**：下载二进制流文件
- **参数**：
  - `content` (Blob|ArrayBuffer) - 文件内容
  - `filename` (string) - 文件名
  - `ext` (string) - 文件扩展名
- **返回值**：无

## 使用示例

```javascript
// 判断文件类型
const isFile = isAssetTypeAnFile('jpg');
console.log(isFile); // 输出: true

const isImage = isAssetTypeAnImage('png');
console.log(isImage); // 输出: true

// 文件转base64
const fileInput = document.getElementById('fileInput');
fileInput.addEventListener('change', function(event) {
  const file = event.target.files[0];
  fileToBase64(file, function(base64) {
    console.log(base64); // 输出: base64编码字符串
  });
});

// base64转blob
const blob = base64ToBlob('data:image/png;base64,iVBORw0KG...');
console.log(blob); // 输出: Blob对象

// 获取文件扩展名
const ext = getFileExtension('/path/to/file/example.xlsx');
console.log(ext); // 输出: xlsx

// 下载图片
downloadImage('https://example.com/image.jpg', 'myImage', 'jpg');

// 下载base64图片
downloadBase64('data:image/png;base64,iVBORw0KG...', 'myImage', 'png');

// 截取图片
captureImage({
  url: 'https://example.com/image.jpg',
  newWidth: 200,
  newHeight: 200,
  offsetX: 50,
  offsetY: 50,
  callback: function(dataURL) {
    console.log(dataURL); // 输出: 截取后的图片base64
  }
});
```

## 注意事项
1. 文件类型判断函数基于文件扩展名进行判断，可能不完全准确
2. `fileToBase64` 和 `imgToBase64` 函数是异步的，通过回调函数返回结果
3. 图片处理函数需要考虑跨域问题，可能需要服务器设置CORS头
4. 下载函数在iOS设备上可能不支持
5. `captureImage` 函数需要传入完整的配置选项才能正常工作
6. IE浏览器兼容性处理仅针对特定版本，现代浏览器建议使用标准API
7. base64处理函数可能会消耗较多内存，处理大文件时需要注意性能