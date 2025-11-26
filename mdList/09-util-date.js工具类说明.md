# util-date.js 工具类说明

## 概述
`util-date.js` 是一个日期处理工具类，提供了丰富的日期时间格式化、转换、计算等功能。

## 主要功能

### 日期格式化函数

#### dateFtt(datetime, fmt)
- **功能**：日期时间格式化
- **参数**：
  - `datetime` (Date|string) - 日期时间对象或字符串
  - `fmt` (string) - 格式化模板，默认为 'yyyy-MM-dd HH:mm:ss'
- **返回值**：格式化后的日期时间字符串

#### timeFtt(time, fmt)
- **功能**：时间格式化
- **参数**：
  - `time` (string) - 时间字符串
  - `fmt` (string) - 格式化模板，默认为 'HH:mm:ss'
- **返回值**：格式化后的时间字符串

#### dateHumanize(datetime)
- **功能**：日期时间人性化格式转换（如：刚刚、几分钟前、几小时前等）
- **参数**：`datetime` (Date|string) - 日期时间对象或字符串
- **返回值**：人性化格式的字符串

### 日期转换函数

#### toTimestamp(datetime)
- **功能**：日期时间转时间戳
- **参数**：`datetime` (Date|string) - 日期时间对象或字符串
- **返回值**：时间戳（毫秒）

#### toNumber(datetime)
- **功能**：日期时间转数字（用以清除日期时间的格式）
- **参数**：`datetime` (Date|string) - 日期时间对象或字符串
- **返回值**：只包含数字的字符串

#### toYMDHMS(datetime)
- **功能**：日期时间转YMDHMS格式（用以清除日期时间年月日时分秒前面的0）
- **参数**：`datetime` (Date) - 日期时间对象
- **返回值**：包含年月日时分秒信息的对象

#### toString(datetime)
- **功能**：日期类型转字符串类型
- **参数**：`datetime` (Date|string) - 日期时间对象或字符串
- **返回值**：格式化后的日期时间字符串

#### toDate(datetime)
- **功能**：字符串类型转日期类型
- **参数**：`datetime` (Date|string) - 日期时间对象或字符串
- **返回值**：日期时间对象

### 当前时间获取函数

#### currentTime(datetime)
- **功能**：获取当前时间对象
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：包含详细时间信息的对象

#### getCurrentDate(datetime)
- **功能**：获取当前日期
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：当前日期字符串（格式：YYYYMMDD）

#### getCurrentDatetime(datetime)
- **功能**：获取当前日期时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：当前日期时间字符串（格式：YYYYMMDDHHmmss）

#### getCurrentMsDatetime(datetime)
- **功能**：获取当前毫秒级日期时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：当前毫秒级日期时间字符串（格式：YYYYMMDDHHmmssSSS）

### 特定日期时间获取函数

#### getStartDateOfToday(datetime)
- **功能**：获取今日的开始时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：今日开始时间字符串

#### getEndDateOfToday(datetime)
- **功能**：获取今日的结束时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：今日结束时间字符串

#### getStartDateOfYesterday(datetime)
- **功能**：获取昨日的开始时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：昨日开始时间字符串

#### getEndDateOfYesterday(datetime)
- **功能**：获取昨日的结束时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：昨日结束时间字符串

#### getStartDateOfWeek(datetime)
- **功能**：获取本周的开始时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本周开始时间字符串

#### getEndDateOfWeek(datetime)
- **功能**：获取本周的结束时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本周结束时间字符串

#### getStartDateOfMonth(datetime)
- **功能**：获取本月的开始时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本月开始时间字符串

#### getEndDateOfMonth(datetime)
- **功能**：获取本月的结束时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本月结束时间字符串

#### getStartDateOfYear(datetime)
- **功能**：获取本年的开始时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本年开始时间字符串

#### getEndDateOfYear(datetime)
- **功能**：获取本年的结束时间
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本年结束时间字符串

### 日期计算函数

#### getMonthDays(datetime)
- **功能**：获取本月的天数
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本月天数

#### getYearDays(datetime)
- **功能**：获取本年的天数
- **参数**：`datetime` (Date) - 日期时间对象（可选）
- **返回值**：本年天数

#### getDiffOfDate(datetime1, datetime2)
- **功能**：获取两个时间点的时间差
- **参数**：
  - `datetime1` (Date|string) - 第一个时间点
  - `datetime2` (Date|string) - 第二个时间点
- **返回值**：时间差（毫秒）

#### getDiffDaysOfDate(datetime1, datetime2, fix)
- **功能**：获取两个时间点相差的天数
- **参数**：
  - `datetime1` (Date|string) - 第一个时间点
  - `datetime2` (Date|string) - 第二个时间点
  - `fix` (number) - 保留小数位数
- **返回值**：相差天数

### 日期运算函数

#### addSeconds(datetime, seconds)
- **功能**：日期时间加减秒
- **参数**：
  - `datetime` (Date|string) - 日期时间
  - `seconds` (number) - 秒数（正数为加，负数为减）
- **返回值**：运算后的日期时间

#### addHours(datetime, hours)
- **功能**：日期时间加减小时
- **参数**：
  - `datetime` (Date|string) - 日期时间
  - `hours` (number) - 小时数（正数为加，负数为减）
- **返回值**：运算后的日期时间

#### addDays(datetime, days)
- **功能**：日期时间加减天
- **参数**：
  - `datetime` (Date|string) - 日期时间
  - `days` (number) - 天数（正数为加，负数为减）
- **返回值**：运算后的日期时间

#### addMonths(datetime, months)
- **功能**：日期时间加减月
- **参数**：
  - `datetime` (Date|string) - 日期时间
  - `months` (number) - 月数（正数为加，负数为减）
- **返回值**：运算后的日期时间

#### addYears(datetime, years)
- **功能**：日期时间加减年
- **参数**：
  - `datetime` (Date|string) - 日期时间
  - `years` (number) - 年数（正数为加，负数为减）
- **返回值**：运算后的日期时间

### 辅助函数

#### fixTensNum(num)
- **功能**：数字十位补零
- **参数**：`num` (number) - 数字
- **返回值**：补零后的字符串

#### fixHundredsNum(num)
- **功能**：数字百位补零
- **参数**：`num` (number) - 数字
- **返回值**：补零后的字符串

## 使用示例

```javascript
// 日期格式化
const formattedDate = dateFtt(new Date(), 'yyyy年MM月dd日 HH:mm:ss');
console.log(formattedDate); // 输出: 2023年12月25日 14:30:25

// 时间格式化
const formattedTime = timeFtt('143025', 'HH时mm分ss秒');
console.log(formattedTime); // 输出: 14时30分25秒

// 日期人性化格式转换
const humanizedDate = dateHumanize('2023-12-25 14:30:25');
console.log(humanizedDate); // 输出: 刚刚 或 几分钟前 等

// 日期转时间戳
const timestamp = toTimestamp('2023-12-25 14:30:25');
console.log(timestamp); // 输出: 1703481025000

// 获取当前日期
const currentDate = getCurrentDate();
console.log(currentDate); // 输出: 20231225

// 获取今日开始时间
const startOfToday = getStartDateOfToday();
console.log(startOfToday); // 输出: 20231225000000

// 日期加减运算
const futureDate = addDays(new Date(), 7);
console.log(futureDate); // 输出: 7天后的日期

// 获取两个日期相差天数
const diffDays = getDiffDaysOfDate('2023-12-25', '2023-12-30', 2);
console.log(diffDays); // 输出: 5.00
```

## 注意事项
1. 日期格式化模板支持的占位符包括：yyyy（年）、MM（月）、dd（日）、HH（时）、mm（分）、ss（秒）、S（毫秒）、q（季度）
2. 大部分函数都支持传入日期对象或日期字符串，但建议统一使用一种格式
3. 日期运算函数会自动处理闰年、月末等特殊情况
4. 人性化时间格式转换是相对于当前时间的，会根据时间差显示不同的文本
5. 在进行日期计算时，需要注意时区的影响