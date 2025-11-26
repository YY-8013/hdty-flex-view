# util-elem.js 工具类说明

## 概述
`util-elem.js` 是一个HTML元素操作工具类，提供了丰富的DOM元素检测、查找、样式获取、位置计算等功能。

## 主要功能

### 元素类型检测函数

#### isHTMLElement(el)
- **功能**：判断元素是否为HTMLElement元素
- **参数**：`el` (Element) - 待检测的元素
- **返回值**：布尔值，如果是HTMLElement返回true，否则返回false

#### isHTMLStr(str)
- **功能**：判断元素是否为HTML字符串
- **参数**：`str` (string) - 待检测的字符串
- **返回值**：布尔值，如果是HTML字符串返回true，否则返回false

#### isHTMLDom(obj)
- **功能**：判断是否为HTMLDom对象
- **参数**：`obj` (Object) - 待检测的对象
- **返回值**：布尔值，如果是HTMLDom对象返回true，否则返回false

### 元素查找函数

#### querySelectorParent(el, selector)
- **功能**：查找元素的父级元素
- **参数**：
  - `el` (Element) - 起始元素
  - `selector` (string) - 选择器（可选）
- **返回值**：匹配的父级元素或null

#### queryAbsoluteOffsetParent(el)
- **功能**：查找距离元素最近的进行过绝对定位的父级元素
- **参数**：`el` (Element) - 待检测的元素
- **返回值**：最近的绝对定位父级元素或null

### 元素位置与尺寸函数

#### getOffset(el)
- **功能**：获取元素距离屏幕的偏移量
- **参数**：`el` (Element) - 待检测的元素
- **返回值**：包含left和top属性的对象

#### getOffsetOfAbsolute(el)
- **功能**：获取元素到最近的进行过绝对定位的父级元素的偏移量
- **参数**：`el` (Element) - 待检测的元素
- **返回值**：包含left和top属性的对象

#### getStyle(el, attr)
- **功能**：获取元素某项style属性的值
- **参数**：
  - `el` (Element) - 待检测的元素
  - `attr` (string) - 属性名（可选）
- **返回值**：指定属性的值或所有样式对象

#### getTextScreenWidth(text, fontSize, fontWeight, fontFamily)
- **功能**：获取文本所占屏幕宽度
- **参数**：
  - `text` (string) - 文本内容
  - `fontSize` (string) - 字体大小，默认'14px'
  - `fontWeight` (string) - 字体粗细，默认'400'
  - `fontFamily` (string) - 字体族，默认'Helvetica Neue, Helvetica, Microsoft YaHei, Arial, sans-serif'
- **返回值**：文本宽度（像素）

### 元素操作函数

#### insertAfter(newEl, targetEl)
- **功能**：在目标元素后插入新元素
- **参数**：
  - `newEl` (Element) - 新元素
  - `targetEl` (Element) - 目标元素
- **返回值**：无

#### pixelsFtt(val, unit)
- **功能**：像素单位格式化
- **参数**：
  - `val` (string|number) - 值
  - `unit` (string) - 单位，默认'px'
- **返回值**：格式化后的像素值字符串

### 页面清理函数

#### removeMask()
- **功能**：移除遮罩层
- **返回值**：无

#### removeNotify()
- **功能**：移除通知层
- **返回值**：无

#### removeMessage()
- **功能**：移除提示层
- **返回值**：无

#### removeWatermark()
- **功能**：移除水印层
- **返回值**：无

#### removeJoinsys()
- **功能**：移除预接入系统层
- **返回值**：无

#### clearCurrentLogin()
- **功能**：清除当前登录痕迹（移除所有相关层）
- **返回值**：无

## 使用示例

```javascript
// 判断元素类型
const isHtmlElement = isHTMLElement(document.getElementById('myDiv'));
console.log(isHtmlElement); // 输出: true 或 false

const isHtmlString = isHTMLStr('<div>Hello World</div>');
console.log(isHtmlString); // 输出: true

// 查找父级元素
const parentEl = querySelectorParent(document.getElementById('child'), '.parent-class');
console.log(parentEl); // 输出: 匹配的父级元素或null

// 获取元素偏移量
const offset = getOffset(document.getElementById('myDiv'));
console.log(offset); // 输出: { left: 100, top: 200 }

// 获取元素样式
const backgroundColor = getStyle(document.getElementById('myDiv'), 'backgroundColor');
console.log(backgroundColor); // 输出: 元素的背景色值

// 获取文本宽度
getTextScreenWidth('Hello World').then(width => {
  console.log(width); // 输出: 文本宽度（像素）
});

// 插入元素
const newDiv = document.createElement('div');
const targetDiv = document.getElementById('target');
insertAfter(newDiv, targetDiv);

// 像素格式化
const pixelValue = pixelsFtt(100);
console.log(pixelValue); // 输出: "100px"

// 清除页面层
clearCurrentLogin(); // 移除所有相关的页面层
```

## 注意事项
1. 大部分函数都需要传入有效的DOM元素作为参数，使用前应确保元素存在
2. `getTextScreenWidth` 函数是异步的，返回Promise对象
3. `getStyle` 函数兼容IE浏览器的currentStyle属性和标准的getComputedStyle方法
4. 页面清理函数会移除具有特定class或id的元素，使用时需确保不会误删其他重要元素
5. 在使用`insertAfter`函数时，需要确保目标元素存在于DOM中
6. 像素格式化函数可以处理数字和字符串类型的输入值