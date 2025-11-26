# util-coord.js 工具类说明

## 概述
`util-coord.js` 是一个地理坐标系转换工具类，提供了百度坐标系(BD-09)、火星坐标系(GCJ-02)、地球坐标系(WGS84)之间的互相转换方法，以及百度经纬度与百度墨卡托之间的互相转换方法。

## 主要功能

### 坐标系转换函数

#### bd09ToGcj02(bd_lon, bd_lat)
- **功能**：百度坐标系(BD-09)转火星坐标系(GCJ-02)，即百度转谷歌、高德
- **参数**：
  - `bd_lon` (Number) - 百度经度
  - `bd_lat` (Number) - 百度纬度
- **返回值**：包含火星坐标系经纬度的数组 `[gg_lon, gg_lat]`

#### gcj02ToBd09(lon, lat)
- **功能**：火星坐标系(GCJ-02)转百度坐标系(BD-09)，即谷歌、高德转百度
- **参数**：
  - `lon` (Number) - 火星坐标系经度
  - `lat` (Number) - 火星坐标系纬度
- **返回值**：包含百度坐标系经纬度的数组 `[bd_lon, bd_lat]`

#### wgs84ToGcj02(lon, lat)
- **功能**：地球坐标系(WGS84)转火星坐标系(GCJ-02)，即谷歌地球转谷歌、高德
- **参数**：
  - `lon` (Number) - WGS84经度
  - `lat` (Number) - WGS84纬度
- **返回值**：包含火星坐标系经纬度的数组 `[mglon, mglat]`

#### gcj02ToWgs84(lon, lat)
- **功能**：火星坐标系(GCJ-02)转地球坐标系(WGS84)，即谷歌、高德转谷歌地球
- **参数**：
  - `lon` (Number) - 火星坐标系经度
  - `lat` (Number) - 火星坐标系纬度
- **返回值**：包含WGS84坐标系经纬度的数组 `[lon * 2 - mglon, lat * 2 - mglat]`

#### bd09ToWgs84(lon, lat)
- **功能**：百度坐标系(BD-09)转地球坐标系(WGS84)，即百度转谷歌地球
- **参数**：
  - `lon` (Number) - 百度经度
  - `lat` (Number) - 百度纬度
- **返回值**：包含WGS84坐标系经纬度的数组

#### wgs84ToBd09(lon, lat)
- **功能**：地球坐标系(WGS84)转百度坐标系(BD-09)，即谷歌地球转百度
- **参数**：
  - `lon` (Number) - WGS84经度
  - `lat` (Number) - WGS84纬度
- **返回值**：包含百度坐标系经纬度的数组

### 墨卡托坐标转换函数

#### bd09ToBdMkt(lng, lat)
- **功能**：百度经纬度(BD-09)转百度墨卡托
- **参数**：
  - `lng` (Number) - 百度经度
  - `lat` (Number) - 百度纬度
- **返回值**：包含百度墨卡托坐标的数组 `[lng, lat]`

#### bdMktToBd09(lng, lat)
- **功能**：百度墨卡托转百度经纬度(BD-09)
- **参数**：
  - `lng` (Number) - 百度墨卡托经度
  - `lat` (Number) - 百度墨卡托纬度
- **返回值**：包含百度经纬度的数组 `[lng, lat]`

#### wgs84ToWebMkt(lng, lat)
- **功能**：地球经纬度(WGS84)转Web墨卡托
- **参数**：
  - `lng` (Number) - WGS84经度
  - `lat` (Number) - WGS84纬度
- **返回值**：包含Web墨卡托坐标的数组 `[lng, lat]`

#### webMktToWgs84(lng, lat)
- **功能**：Web墨卡托转地球经纬度(WGS84)
- **参数**：
  - `lng` (Number) - Web墨卡托经度
  - `lat` (Number) - Web墨卡托纬度
- **返回值**：包含WGS84坐标的数组 `[lng, lat]`

### 辅助函数

#### _outOfChina(lng, lat)
- **功能**：判断是否在国内，不在国内则不做偏移
- **参数**：
  - `lng` (Number) - 经度
  - `lat` (Number) - 纬度
- **返回值**：布尔值，如果不在国内返回true

## 使用示例

```javascript
// 百度坐标转火星坐标
const gcj02Coords = bd09ToGcj02(116.404, 39.915);
console.log(gcj02Coords); // 输出: [116.397..., 39.914...]

// 火星坐标转百度坐标
const bd09Coords = gcj02ToBd09(116.397, 39.914);
console.log(bd09Coords); // 输出: [116.403..., 39.915...]

// WGS84坐标转火星坐标
const gcj02Coords2 = wgs84ToGcj02(116.395, 39.913);
console.log(gcj02Coords2); // 输出: [116.397..., 39.914...]

// 火星坐标转WGS84坐标
const wgs84Coords = gcj02ToWgs84(116.397, 39.914);
console.log(wgs84Coords); // 输出: [116.395..., 39.913...]

// 百度经纬度转百度墨卡托
const bdMktCoords = bd09ToBdMkt(116.404, 39.915);
console.log(bdMktCoords); // 输出: [12940448.2..., 4836972.6...]

// 百度墨卡托转百度经纬度
const bd09Coords2 = bdMktToBd09(12940448.2, 4836972.6);
console.log(bd09Coords2); // 输出: [116.404..., 39.915...]
```

## 注意事项
1. 该工具类适用于将适量数量点坐标加减偏移用于叠加不同网络底图
2. 不适合成千上万等大量点做偏移量修正
3. 坐标转换存在一定的精度误差，这是由于不同坐标系的转换算法决定的
4. 在使用前需要确认输入坐标的坐标系类型，避免错误的转换
5. 国外坐标可能无法正确转换，因为部分转换函数只适用于中国境内的坐标