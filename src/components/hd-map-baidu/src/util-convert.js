/**
 * 百度地图坐标转换工具类
 */


const utilConvert = class utilConvert {
  constructor(map) {
    this.map = map;
  }
  // 瓦片xy转经纬度坐标
  tileToLngLat(pixel) {
    return this.worldToLngLat(this.pixelToWorld(this.tileToPixel(pixel)));
  }
  // 经纬度坐标转瓦片xy
  lngLatToTile(lngLat) {
    return this.pixelToTile(this.worldToPixel(this.lngLatToWorld(lngLat)));
  }
  // 像素坐标转经纬度坐标
  pixelToLngLat(pixel) {
    return this.worldToLngLat(this.pixelToWorld(pixel));
  }
  // 经纬度坐标转像素坐标
  lngLatToPixel(lngLat) {
    return this.worldToPixel(this.lngLatToWorld(lngLat));
  }
  // 瓦片xy转像素坐标（百度地图瓦片大小为256*256，根据瓦片xy*256计算出瓦片的像素坐标）
  tileToPixel(pixel) {
    return new BMap.Pixel(pixel.x * 256, pixel.y * 256);
  }
  // 像素坐标转平面坐标
  pixelToWorld(pixel) {
    let zoom = this.map.getZoom();
    return new BMap.Pixel(pixel.x / Math.pow(2, zoom - 18), pixel.y / Math.pow(2, zoom - 18));
  }
  // 平面坐标转经纬度坐标
  worldToLngLat(pixel) {
    let projection = this.map.getMapType().getProjection();
    return projection.pointToLngLat(pixel)
  }
  // 像素坐标转瓦片xy
  pixelToTile(pixel) {
    return new BMap.Pixel(pixel.x / 256, pixel.y / 256);
  }
  // 平面坐标转像素坐标
  worldToPixel(pixel) {
    let zoom = this.map.getZoom();
    return new BMap.Pixel(pixel.x * Math.pow(2, zoom - 18),
      pixel.y * Math.pow(2, zoom - 18));
  }
  // 经纬度坐标转平面坐标
  lngLatToWorld(lngLat) {
    let projection = this.map.getMapType().getProjection();
    return projection.lngLatToPoint(lngLat)
  }
};

export default utilConvert;
