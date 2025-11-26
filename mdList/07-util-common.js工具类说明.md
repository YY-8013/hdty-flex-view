# util-common.js 工具类说明

## 概述
`util-common.js` 是一个全局工具类，提供了一系列与机构处理、文件处理、日期处理、字符串处理等相关的通用函数。

## 主要功能

### 机构处理相关函数

#### getParentOrgId(orgId)
- **功能**：获取指定机构的上级机构编码
- **参数**：`orgId` (string) - 12位机构编码
- **返回值**：上级机构编码字符串
- **实现逻辑**：
  1. 验证输入机构编码是否为12位
  2. 删除字符串末尾的所有0
  3. 如果长度为奇数则补0
  4. 将最后两位换成00
  5. 补齐后面的0至12位长度

#### getSimpleOrgId(orgId)
- **功能**：获取机构的最简编码（去掉末尾的0）
- **参数**：`orgId` (string) - 12位机构编码
- **返回值**：最简机构编码字符串

#### isSuperior(a, b)
- **功能**：判断机构编码a是否是b的上级
- **参数**：
  - `a` (string) - 12位机构编码
  - `b` (string) - 12位机构编码
- **返回值**：布尔值，如果a是b的上级则返回true

#### isTjOrZj(a, u)
- **功能**：判断机构是否是当前用户的父级或者本级
- **参数**：
  - `a` (string) - 机构编码
  - `u` (string, 可选) - 用户机构编码
- **返回值**：布尔值

#### isTjOrFj(a, u)
- **功能**：判断机构是否是当前用户的自己或者本级
- **参数**：
  - `a` (string) - 机构编码
  - `u` (string, 可选) - 用户机构编码
- **返回值**：布尔值

#### getOrgIdLevel(orgId)
- **功能**：获取机构级别
- **参数**：`orgId` (string) - 12位机构编码
- **返回值**：机构级别字符串（2-7表示不同级别）

#### getParentOrgNameAndSelf(parentOrgName, orgName)
- **功能**：获取父级机构与本级机构的拼接名称
- **参数**：
  - `parentOrgName` (string) - 父级机构名称
  - `orgName` (string) - 本级机构名称
- **返回值**：拼接后的机构名称

### 文件处理相关函数

#### getFileSufName(fileName)
- **功能**：获取文件后缀名
- **参数**：`fileName` (string) - 文件名
- **返回值**：文件后缀名（小写）

#### getNameForDot(name)
- **功能**：替换中文姓名中间的错误的"·"符号
- **参数**：`name` (string) - 姓名
- **返回值**：处理后的姓名

### 树形结构处理函数

#### setTreeToArray(treeData, type)
- **功能**：树形结构转数组
- **参数**：
  - `treeData` (array) - 树形数据
  - `type` (string) - 类型（1：全部，2：非叶子节点，3：叶子节点）
- **返回值**：数组

### 优先级处理函数

#### getContentByPriority(hjdContent, xzdContent)
- **功能**：根据优先级获取内容（优先户籍地，其次是现住地）
- **参数**：
  - `hjdContent` (string) - 户籍地内容
  - `xzdContent` (string) - 现住地内容
- **返回值**：优先级处理后的内容

### 派出所处理函数

#### getPcsSimpleName(pcsOrgName)
- **功能**：获取派出所最简名称（即派出所名称不包含派出所字样）
- **参数**：`pcsOrgName` (string) - 派出所机构名称
- **返回值**：最简派出所名称

### 日期处理函数

#### getAgeByCsrq(strAge)
- **功能**：通过出生日期获取年龄
- **参数**：`strAge` (string) - 出生日期（格式：YYYYMMDD）
- **返回值**：年龄（整数）

#### getCsrqByGmsfhm(gmsfhm)
- **功能**：根据身份证号获取出生日期
- **参数**：`gmsfhm` (string) - 身份证号码
- **返回值**：出生日期（格式：YYYYMMDD）

#### getXbByGmsfhm(gmsfhm, isXbdm)
- **功能**：根据身份证号获取性别
- **参数**：
  - `gmsfhm` (string) - 身份证号码
  - `isXbdm` (boolean) - 是否返回性别代码
- **返回值**：性别或性别代码

### 图片处理函数

#### imgCompress(file, drew, maxWidth, quality)
- **功能**：图片压缩
- **参数**：
  - `file` (File) - 图片文件
  - `drew` (boolean) - 是否绘制
  - `maxWidth` (number) - 最大宽度，默认1000
  - `quality` (number) - 图片质量，默认1
- **返回值**：Promise对象

### 字符串处理函数

#### splitStrToArray(str, splitStr)
- **功能**：字符串分隔成数组，遇到错误不抛出
- **参数**：
  - `str` (string) - 字符串
  - `splitStr` (string) - 分隔符，默认为","
- **返回值**：数组

#### arrayContainsArray(superset, subset)
- **功能**：判断数组是否包含另一个数组
- **参数**：
  - `superset` (array) - 父数组
  - `subset` (array) - 子数组
- **返回值**：布尔值

## 使用示例

```javascript
// 获取上级机构编码
const parentOrgId = getParentOrgId('150100000000');
console.log(parentOrgId); // 输出: 150000000000

// 获取机构级别
const orgLevel = getOrgIdLevel('150102000000');
console.log(orgLevel); // 输出: 4

// 获取文件后缀名
const fileExt = getFileSufName('example.xlsx');
console.log(fileExt); // 输出: xlsx

// 根据身份证号获取出生日期
const birthDate = getCsrqByGmsfhm('110101199001011234');
console.log(birthDate); // 输出: 19900101

// 根据身份证号获取性别
const gender = getXbByGmsfhm('110101199001011234');
console.log(gender); // 输出: 男

// 字符串分隔成数组
const arr = splitStrToArray('a,b,c,d');
console.log(arr); // 输出: ['a', 'b', 'c', 'd']
```

## 注意事项
1. 大部分函数都依赖于输入参数的格式正确性，使用时需要确保参数格式符合要求
2. 机构处理相关函数假设机构编码为12位数字字符串
3. 身份证处理函数需要有效的身份证号码作为输入
4. 图片压缩功能依赖于Compressor.js库