<template>
  <div
    ref="mapRef"
    class="hdty-map-wrapper"
    :style="activeWrapperStyle">
    <div
      v-loading="loading"
      :element-loading-text="loadingText"
      class="hdty-map"
      :style="{ minHeight: !activeWrapperStyle.height ? '300px' : '' }">
      <div
        :id="mapId"
        class="hdty-map-arcgis"
        :class="{
          'copyright-hide': !copyright
        }"
        :style="{ minHeight: !activeWrapperStyle.height ? '300px' : '' }">
        <!--  切换地图类型-->
        <div :id="basemapToggleId"></div>
        <!--  返回主视图按钮-->
        <div :id="homeButtonId"></div>
        <!--  定位按钮-->
        <div :id="locateButtonId"></div>
        <!--  全屏按钮-->
        <div v-if="fullscreen" class="hdty-map-fullscreen"></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
  window.dojoConfig = {
    // tell Dojo where to load other packages
    async: true,
    packages: [
      {
        location: process.env.NODE_PATH + '/static/public/js/arcgis',
        name: 'extras'
      }
    ]
  };
  import EsriLoader from 'esri-loader';
  import Fullscreen from 'screenfull';
  import MP from './src/map';
  import thumbnailImg from './src/images/delorme.jpg';
  import shape0 from './src/images/shapes/img-001.png';
  import shape1 from './src/images/shapes/img-002.png';
  import shape2 from './src/images/shapes/img-003.png';
  import shape3 from './src/images/shapes/img-004.png';
  import shape4 from './src/images/shapes/img-005.png';
  import iconSeriesB from '@/components/hd-map-baidu/src/icon/icon-series-b.svg';
  import iconSeriesC from '@/components/hd-map-baidu/src/icon/icon-series-c.svg';
  import iconSeriesD from '@/components/hd-map-baidu/src/icon/icon-series-d.svg';
  import { hdComponent, hdMethod } from '@/utils/util-framework';
  const esri = {};
  export default {
    name: "index",
    provide() {
      return {
        hdMapArcgis: this
      };
    },
    mixins: [hdComponent, hdMethod],
    components: {
      Fullscreen
    },
    props: {
      prop: String,
      // 地图基础资源请求地址
      offlineURL: {
        type: String,
        default: appEnv.arcgis_offlineURL
      },
      // 地图底图服务请求地址
      RESTServerURL: {
        type: String,
        default: appEnv.arcgis_RESTServerURL
      },
      // 自动定位(定位到当前城市)
      automatic: {
        type: Boolean,
        default: true
      },
      // 中心点坐标
      center: {
        type: Object,
        default() {
          // 呼和浩特
          return {
            lng: 111.646633,
            lat: 40.821009
          };
          // 北京
          /*return {
            lng: 116.391384,
            lat: 39.907253
          };*/
        }
      },
      // 缩放级别
      zoom: {
        type: [Number, String],
        default: 12
      },
      // 点坐标
      markers: {
        type: Array,
        default() {
          /*示例：
          [
            {
              lng: 0,  // 标注点经度
              lat: 0,  // 标注点纬度
              label: '标签',  // 标注点标签显示内容
              icon: 'b1', // 标注图标，设置b1~b30/c1~c30或图片URL
              iconOptions: {  // 标注点图标配置项
                x: 0,  // 标注点图标锚点水平方向的偏移
                y: 0,  // 标注点图标锚点垂直方向的偏移
                width: 0,  // 标注点图标宽度，单位像素
                width: 0,  // 标注点图标高度，单位像素
              }
            }
          ]*/
          return [];
        }
      },
      // 开启点聚合
      clusterer: {
        type: Boolean,
        default: true
      },
      // 开启鼠标双击放大
      doubleClickZoom: {
        type: Boolean,
        default: true
      },
      // 开启鼠标滚轮缩放
      scrollWheelZoom: {
        type: Boolean,
        default: true
      },
      // 显示左下角Esri标志
      logo: {
        type: Boolean,
        default: false
      },
      // 显示左下角Esri版权信息
      copyright: {
        type: Boolean,
        default: false
      },
      // 显示比例尺控件
      scale: {
        type: Boolean,
        default: true
      },
      // 显示缩放控件
      navigation: {
        type: Boolean,
        default: true
      },
      // 显示地图类型控件
      mapType: {
        type: Boolean,
        default: true
      },
      // 显示返回主视图控件
      homeButton: {
        type: Boolean,
        default: true
      },
      // 显示缩略图控件
      overviewMap: {
        type: Boolean,
        default: false
      },
      // 显示定位控件
      geolocation: {
        type: Boolean,
        default: true
      },
      // 显示全屏控件
      fullscreen: {
        type: Boolean,
        default: true
      },
      // 宽度
      width: {
        type: [Number, String],
        default: null
      },
      // 高度
      height: {
        type: [Number, String],
        default: null
      }
    },
    data() {
      // 唯一标识
      let uuid = this.$utilStr.uuid();
      return {
        // 是否在线地图
        online: null,
        // 地图Id
        mapId: 'Arcgis_' + uuid,
        // 地图实例
        map: null,
        // 地图初始化完成
        initComplete: false,
        // 地图加载完成
        loadComplete: false,
        // 地图类型控件Id
        basemapToggleId: 'BasemapToggle' + uuid,
        // 返回主视图控件Id
        homeButtonId: 'HomeButton' + uuid,
        // 定位控件Id
        locateButtonId: 'LocateButton' + uuid,
        // 登录用户信息
        user: this.$utilLogin.getUserInfo(),
        // 北京坐标
        beijing: {
          lng: 116.391384,
          lat: 39.907253
        },
        // 当前中心点坐标
        currentCenter: this.center,
        // 当前中心点坐标发生变化
        currentCenterChanged: false,
        // 当前缩放级别
        currentZoom: this.zoom,
        // 当前点坐标
        currentMarkers: this.markers,
        // 当前点对象
        currentMarkersTarget: [],
        // 当前点标签对象
        currentMarkerLabelsTarget: [],
        // 点聚合实例
        markerClusterer: null,
        // 当前点聚合对象
        currentClustererTarget: [],
        // 自定义标记符号名称前缀
        customMarkerPrefix: 'icon_',
        // 自定义标记符号
        customMarkerSymbol: {},
        // 自定义标记符号默认尺寸配置
        customMarkerSymbolDefaultOptions: {
          bSeries: {
            x: 0,
            y: 19,
            width: 26,
            height: 42
          },
          cSeries: {
            x: 0,
            y: 0,
            width: 26,
            height: 42
          },
          dSeries: {
            x: 0,
            y: 19,
            width: 36,
            height: 42
          },
          other: {
            x: 0,
            y: 19,
            width: 26,
            height: 42
          }
        },
        // 加载中
        loading: false,
        // 加载中说明文字
        loadingText: ''
      }
    },
    computed: {
      wrapperElement() {
        return this.$el;
      },
      activeWrapperStyle() {
        let style = {
          width: this.$utilElem.pixelsFtt(this.width),
          height: this.$utilElem.pixelsFtt(this.height)
        };
        return this.$utilStr.clearObjUndef(style);
      }
    },
    watch: {
      center: {
        handler(val) {
          if (val) {
            if(!this.currentCenterChanged) {
              this.currentCenterChanged = true;
            }
            this.currentCenter = val;
            if (this.initComplete) {
              this.setCenterAndZoom();
            }
          }
        },
        immediate: false
      },
      zoom: {
        handler(val) {
          if (val) {
            this.currentZoom = Number(val);
            if (this.initComplete) {
              this.setZoom();
            }
          }
        },
        immediate: false
      },
      markers: {
        handler(val) {
          this.currentMarkers = val;
          if(this.loadComplete) {
            this.setMarker();
          }
        },
        deep: true,
        immediate: false
      },
    },
    mounted() {
      let _this = this;
      _this.loading = true;
      _this.loadingText = '初始化地图中';
      MP.api(_this.offlineURL).then(valid => {
        _this.online = valid;
        _this.init();
      }).catch(() => {
        _this.loading = false;
        _this.$message({
          showClose: true,
          customClass: 'is-wrap',
          message: '初始化地图失败',
          type: 'error',
          offset: 76
        });
      });
    },
    methods: {
      // 地图初始化
      init() {
        let _this = this;
        EsriLoader.setDefaultOptions({
          version: '3.15'
        });
        EsriLoader.loadModules([
          'esri/basemaps',
          'esri/map',
          'esri/geometry/webMercatorUtils',
          'esri/geometry/Point',
          'esri/dijit/Scalebar',
          'esri/dijit/BasemapToggle',
          'esri/dijit/HomeButton',
          'esri/dijit/OverviewMap',
          'esri/dijit/LocateButton',
          'dojo/domReady!'
        ]).then(([
          esriBasemaps,
          Map,
          webMercatorUtils,
          Point,
          Scalebar,
          BasemapToggle,
          HomeButton,
          OverviewMap,
          LocateButton
        ]) => {
          esri.Point = Point;
          esri.webMercatorUtils = webMercatorUtils;
          esriBasemaps.delorme = {
            baseMapLayers: [{
              // 中国矢量地图服务
              url: _this.RESTServerURL
            }],
            // 缩略图
            thumbnailUrl: thumbnailImg,
            title: '矢量图'
          };
          // 创建Map实例
          _this.map = new Map(_this.mapId, {
            basemap: 'delorme',
            logo: _this.logo,
            maxZoom: 18,
            slider: _this.navigation,
            sliderPosition: _this.overviewMap ? 'top-right' : 'bottom-right',
            sliderStyle: 'small'
          });
          // 配置标记符号
          _this.setMarkerSymbol();
          // 监听地图加载完成事件
          _this.map.on('load', function() {
            // 开启鼠标双击放大
            if(!_this.doubleClickZoom) {
              _this.map.disableDoubleClickZoom();
            }
            // 开启鼠标滚轮缩放
            if(!_this.scrollWheelZoom) {
              _this.map.disableScrollWheelZoom();
            }
            // 添加比例尺控件
            if(_this.scale) {
              new Scalebar({
                map: _this.map,
                attachTo: _this.mapType ? 'bottom-left' : 'top-left',
                scalebarStyle: 'line',
                scalebarUnit: 'metric'
              });
            }
            // 添加地图类型控件
            if(_this.mapType) {
              let basemapToggle = new BasemapToggle({
                map: _this.map
              }, _this.basemapToggleId);
              basemapToggle.on('load', function (e) {
                let basemapTitle = this.domNode.querySelector('.basemapTitle');
                basemapTitle.innerHTML = '卫星图';
                basemapTitle.setAttribute('title','显示带有街道的卫星图像');
              });
              basemapToggle.startup();
            }
            // 添加全屏控件
            if(_this.fullscreen) {
              _this.createFullscreenControl();
            }
            // 监听点击事件
            _this.listenMapClick();
            // 监听缩放事件
            _this.listenMapZoom();
            // 监听图层添加完成事件
            _this.listenLayerComplete();
            // 设置点
            if(_this.currentMarkers.length > 0) {
              setTimeout(() => {
                _this.setMarker();
              }, 150);
            }
            if(!_this.loadComplete) {
              _this.loading = false;
              _this.loadComplete = true;
              _this.$emit('currentLoaded', _this.map);
            }
          });
          // 初始化地图，设置中心点坐标和地图级别
          if(_this.automatic) {
            if(_this.user.longitude && _this.user.latitude) {
              let wgs84Center = _this.$utilCoord.bd09ToWgs84(_this.user.longitude, _this.user.latitude);
              _this.map.centerAndZoom(new esri.Point(wgs84Center[0], wgs84Center[1]), _this.currentZoom);
            }else {
              if(_this.currentCenter
                && _this.currentCenter.lng
                && _this.currentCenter.lat) {
                _this.map.centerAndZoom(new esri.Point(_this.currentCenter.lng, _this.currentCenter.lat), _this.currentZoom);
              } else {
                _this.map.centerAndZoom(new esri.Point(_this.beijing.lng, _this.beijing.lat), _this.currentZoom);
              }
            }
            _this.updateCenter();
          }else {
            if(_this.currentCenter
              && _this.currentCenter.lng
              && _this.currentCenter.lat) {
              _this.map.centerAndZoom(new esri.Point(_this.currentCenter.lng, _this.currentCenter.lat), _this.currentZoom);
            } else {
              _this.map.centerAndZoom(new esri.Point(_this.beijing.lng, _this.beijing.lat), _this.currentZoom);
            }
          }
          // 添加返回主视图控件
          if(_this.homeButton) {
            let homeButton = new HomeButton({
              map: _this.map
            }, _this.homeButtonId);
            homeButton.startup();
          }
          // 添加缩略图控件
          if(_this.overviewMap) {
            let overviewMap = new OverviewMap({
              map: _this.map,
              attachTo: 'bottom-right',
              color: '#3e6bb8',
              width: 150,
              height: 150,
              expandFactor: 2,
              opacity: .4,
              visible: true
            });
            overviewMap.startup();
          }
          // 添加定位控件
          if(_this.geolocation) {
            //定位
            let locateButton = new LocateButton({
              map: _this.map,
            }, _this.locateButtonId);
            locateButton.startup();
          }
          if(!_this.initComplete) {
            _this.initComplete = true;
          }
        }, error => {
          _this.loading = false;
          _this.$message({
            showClose: true,
            customClass: 'is-wrap',
            message: '初始化地图失败',
            type: 'error',
            offset: 76
          });
          console.error('arcgis初始化时模块加载失败', error);
        });
      },
      // 初始化时更新中心点坐标
      updateCenter() {
        let _this = this;
        if(_this.currentCenterChanged
          && _this.currentCenter
          && _this.currentCenter.lng
          && _this.currentCenter.lat) {
          _this.setCenter();
        }
      },
      // 设置中心点坐标
      setCenter() {
        let _this = this;
        _this.map.centerAt(new esri.Point(_this.currentCenter.lng, _this.currentCenter.lat));
      },
      // 设置中心点坐标和地图级别
      setCenterAndZoom() {
        let _this = this;
        let point = new esri.Point(_this.currentCenter.lng, _this.currentCenter.lat);
        _this.map.centerAndZoom(point, _this.currentZoom);
      },
      // 设置地图级别
      setZoom() {
        let _this = this;
        _this.map.setZoom(_this.currentZoom);
      },
      // 监听地图点击事件
      listenMapClick() {
        let _this = this;
        _this.map.on('click', function(e) {
          let normalizedVal = esri.webMercatorUtils.xyToLngLat(e.mapPoint.x, e.mapPoint.y);
          e.mapPoint.lng = normalizedVal[0];
          e.mapPoint.lat = normalizedVal[1];
          _this.$emit('currentClick', e, _this.map);
        });
      },
      // 监听地图缩放事件
      listenMapZoom() {
        let _this = this;
        _this.$emit('currentZoomend', _this.map.getZoom());
        _this.map.on('zoom-end', function(){
          _this.$emit('currentZoomend', this.getZoom());
        });
      },
      // 监听图层添加完成事件
      listenLayerComplete() {
        let _this = this;
        _this.map.on('layer-add-result', function(e) {
          let layerId = e.layer.id;
          if(layerId === _this.mapId + '_clusters') {
            setTimeout(() => {
              _this.$el.querySelector('#'+_this.mapId+'_graphics_layer').remove();
              _this.setLabelBackground(_this.$el.querySelector('#'+_this.mapId+'_clusters_layer'));
            });
          }
        });
      },
      // 配置标记符号
      setMarkerSymbol() {
        let _this = this;
        EsriLoader.loadModules([
          'esri/symbols/PictureMarkerSymbol',
          'esri/symbols/SimpleMarkerSymbol',
          'esri/symbols/TextSymbol',
          'esri/symbols/Font',
          'esri/Color'
        ]).then(([
          PictureMarkerSymbol,
          SimpleMarkerSymbol,
          TextSymbol,
          Font,
          Color
        ]) => {
          esri.PictureMarkerSymbol = PictureMarkerSymbol;
          esri.SimpleMarkerSymbol = SimpleMarkerSymbol;
          esri.TextSymbol = TextSymbol;
          esri.Font = Font;
          esri.Color = Color;

          _this.customMarkerSymbol.null = new esri.SimpleMarkerSymbol(esri.SimpleMarkerSymbol.STYLE_CIRCLE, 0, null, new esri.Color([255, 255, 255, 0]));
          _this.customMarkerSymbol.normal = new esri.SimpleMarkerSymbol(esri.SimpleMarkerSymbol.STYLE_PATH, 26, null, new esri.Color('#ed2d2d'));
          _this.customMarkerSymbol.normal.setPath('M16,3.5c-4.142,0-7.5,3.358-7.5,7.5c0,4.143,7.5,18.121,7.5,18.121S23.5,15.143,23.5,11C23.5,6.858,20.143,3.5,16,3.5z M16,14.584c-1.979,0-3.584-1.604-3.584-3.584S14.021,7.416,16,7.416S19.584,9.021,19.584,11S17.979,14.584,16,14.584z');
          _this.customMarkerSymbol.normal.setOffset(0, 13);

          let x = 0, y = 0, l = 16, t = 16;
          for(let i = 1; i <= 30; i++) {
            let name = _this.customMarkerPrefix + 'b' + i;
            let row = Math.ceil(i / 5);
            let col = i % 5 !== 0 ? i % 5 : 5;
            x = l * col + _this.customMarkerSymbolDefaultOptions.bSeries.width * (col - 1);
            y = t * row + _this.customMarkerSymbolDefaultOptions.bSeries.height * (row - 1);
            generateMarkerSymbol({
              url: iconSeriesB,
              newWidth: _this.customMarkerSymbolDefaultOptions.bSeries.width,
              newHeight: _this.customMarkerSymbolDefaultOptions.bSeries.height,
              offsetX: x,
              offsetY: y,
            }).then(response => {
              _this.customMarkerSymbol[name] = new esri.PictureMarkerSymbol(response, _this.customMarkerSymbolDefaultOptions.bSeries.width, _this.customMarkerSymbolDefaultOptions.bSeries.height);
            });
          }
          for(let i = 1; i <= 30; i++) {
            let name = _this.customMarkerPrefix + 'c' + i;
            let row = Math.ceil(i / 5);
            let col = i % 5 !== 0 ? i % 5 : 5;
            x = l * col + _this.customMarkerSymbolDefaultOptions.cSeries.width * (col - 1);
            y = t * row + _this.customMarkerSymbolDefaultOptions.cSeries.height * (row - 1);
            generateMarkerSymbol({
              url: iconSeriesC,
              newWidth: _this.customMarkerSymbolDefaultOptions.cSeries.width,
              newHeight: _this.customMarkerSymbolDefaultOptions.cSeries.height,
              offsetX: x,
              offsetY: y,
            }).then(response => {
              _this.customMarkerSymbol[name] = new esri.PictureMarkerSymbol(response, _this.customMarkerSymbolDefaultOptions.cSeries.width, _this.customMarkerSymbolDefaultOptions.cSeries.height);
            });
          }
          for(let i = 1; i <= 30; i++) {
            let name = _this.customMarkerPrefix + 'd' + i;
            let row = Math.ceil(i / 5);
            let col = i % 5 !== 0 ? i % 5 : 5;
            x = l * col + _this.customMarkerSymbolDefaultOptions.dSeries.width * (col - 1);
            y = t * row + _this.customMarkerSymbolDefaultOptions.dSeries.height * (row - 1);
            generateMarkerSymbol({
              url: iconSeriesD,
              newWidth: _this.customMarkerSymbolDefaultOptions.dSeries.width,
              newHeight: _this.customMarkerSymbolDefaultOptions.dSeries.height,
              offsetX: x,
              offsetY: y,
            }).then(response => {
              _this.customMarkerSymbol[name] = new esri.PictureMarkerSymbol(response, _this.customMarkerSymbolDefaultOptions.dSeries.width, _this.customMarkerSymbolDefaultOptions.dSeries.height);
            });
          }
          function generateMarkerSymbol(params) {
            return new Promise((resolve, reject) => {
              _this.$utilFile.captureImage({
                url: params.url,
                newWidth: params.newWidth,
                newHeight: params.newHeight,
                offsetX: params.offsetX,
                offsetY: params.offsetY,
                callback: (val) => {
                  if(val) {
                    resolve(val);
                  }else {
                    reject()
                  }
                }
              });
            });
          }
        }, error => {
          _this.loading = false;
          _this.$message({
            showClose: true,
            customClass: 'is-wrap',
            message: '标记符号实例化失败',
            type: 'error',
            offset: 76
          });
          console.error('arcgis添加标记符号时模块加载失败', error);
        });
      },
      // 获取标记符号
      getMarkerSymbol(icon, iconOptions) {
        let _this = this;
        if(!icon) {
          return _this.customMarkerSymbol.normal;
        }
        if(/^[b][0-9]*$/.test(icon)) {
          let name = _this.customMarkerPrefix + icon;
          let options = {
            ..._this.customMarkerSymbolDefaultOptions.bSeries,
            ..._this.$utilStr.clearObjEmpty(iconOptions)
          };
          _this.customMarkerSymbol[name].setOffset(options.x, options.y);
          _this.customMarkerSymbol[name].name = name;
          if(/^[b][0-6]$/.test(icon)) {
            _this.customMarkerSymbol[name].realHeight = 42;
          } else {
            _this.customMarkerSymbol[name].realHeight = 36;
          }
          return _this.customMarkerSymbol[name];
        }else if(/^[c][0-9]*$/.test(icon)) {
          let name = _this.customMarkerPrefix + icon;
          let options = {
            ..._this.customMarkerSymbolDefaultOptions.cSeries,
            ..._this.$utilStr.clearObjEmpty(iconOptions)
          };
          _this.customMarkerSymbol[name].setOffset(options.x, options.y);
          _this.customMarkerSymbol[name].name = name;
          _this.customMarkerSymbol[name].realHeight = 26;
          return _this.customMarkerSymbol[name];
        }else if(/^[d][0-9]*$/.test(icon)) {
          let name = _this.customMarkerPrefix + icon;
          let options = {
            ..._this.customMarkerSymbolDefaultOptions.dSeries,
            ..._this.$utilStr.clearObjEmpty(iconOptions)
          };
          _this.customMarkerSymbol[name].setOffset(options.x, options.y);
          _this.customMarkerSymbol[name].name = name;
          if(/^[d][0-3]$/.test(icon)) {
            _this.customMarkerSymbol[name].realHeight = 30;
          } else {
            _this.customMarkerSymbol[name].realHeight = 38;
          }
          return _this.customMarkerSymbol[name];
        }else {
          if(!_this.$utilStr.isURL(icon)) {
            icon = process.env.NODE_PATH + icon.replace(new RegExp(process.env.NODE_PATH), '');
          }
          let options = {
            ..._this.customMarkerSymbolDefaultOptions.other,
            ..._this.$utilStr.clearObjEmpty(iconOptions)
          };
          let markerSymbol = new esri.PictureMarkerSymbol(icon, options.width, options.height);
          markerSymbol.setOffset(options.x, options.y);
          markerSymbol.name = null;
          markerSymbol.realHeight = options.height;
          return markerSymbol;
        }
      },
      // 设置点
      setMarker() {
        let _this = this;
        EsriLoader.loadModules([
          'esri/graphic',
          'dojo/_base/array',
        ]).then(([
          Graphic,
          arrayUtils
        ]) => {
          esri.Graphic = Graphic;
          esri.arrayUtils = arrayUtils;
          if(_this.clusterer) {
            _this.setMarkerClusterer();
          } else {
            for (let i of _this.currentMarkersTarget) {
              _this.map.graphics.remove(i);
            }
            for (let i of _this.currentMarkerLabelsTarget) {
              _this.map.graphics.remove(i);
            }
            _this.currentMarkersTarget = [];
            _this.currentMarkerLabelsTarget = [];
            esri.arrayUtils.forEach(_this.currentMarkers, function(marker) {
              let graphic = new esri.Graphic(
                new esri.Point(marker.lng, marker.lat),
                _this.getMarkerSymbol(marker.icon, marker.iconOptions)
              );
              _this.map.graphics.add(graphic);
              _this.currentMarkersTarget.push(graphic);
              if(marker.label) {
                _this.setMarkerLabel(marker);
              }
            });
            _this.setLabelBackground(_this.$el.querySelector('#'+_this.mapId+'_graphics_layer'));
          }
        }, error => {
          _this.loading = false;
          _this.$message({
            showClose: true,
            customClass: 'is-wrap',
            message: '标注点实例化失败',
            type: 'error',
            offset: 76
          });
          console.error('arcgis绘制标注点时模块加载失败', error);
        });
      },
      // 设置点聚合
      setMarkerClusterer() {
        let _this = this;
        EsriLoader.loadModules([
          'esri/renderers/ClassBreaksRenderer',
          'extras/ClusterLayer',
        ]).then(([
          ClassBreaksRenderer,
          ClusterLayer
        ]) => {
          if(_this.markerClusterer) {
            _this.map.removeLayer(_this.markerClusterer);
          }
          let data = esri.arrayUtils.map(_this.currentMarkers, function(marker) {
            let mercatorVal = esri.webMercatorUtils.lngLatToXY(marker.lng, marker.lat);
            return {
              ...marker,
              markerSymbol: _this.getMarkerSymbol(marker.icon, marker.iconOptions),
              textSymbol: _this.setMarkerLabel(marker),
              x: mercatorVal[0],
              y: mercatorVal[1]
            }
          });
          _this.markerClusterer = new ClusterLayer({
            map: _this.map,
            id: _this.mapId+'_clusters',
            data: data,
            distance: 100,
            labelColor: '#fff',
            labelOffset: -5,
            resolution: _this.map.extent.getWidth() / _this.map.width
          });
          let renderer = new ClassBreaksRenderer(_this.customMarkerSymbol.null, 'clusterCount');
          let blue = new esri.PictureMarkerSymbol(shape0, 52, 52).setOffset(0, 0);
          let green = new esri.PictureMarkerSymbol(shape1, 56, 56).setOffset(0, 0);
          let red = new esri.PictureMarkerSymbol(shape2, 66, 66).setOffset(0, 0);
          let pink = new esri.PictureMarkerSymbol(shape3, 78, 78).setOffset(0, 0);
          let purple = new esri.PictureMarkerSymbol(shape4, 90, 90).setOffset(0, 0);
          renderer.addBreak(2, 5, blue);
          renderer.addBreak(5, 20, green);
          renderer.addBreak(20, 100, red);
          renderer.addBreak(100, 1000, pink);
          renderer.addBreak(1000, 10000, purple);
          _this.markerClusterer.setRenderer(renderer);
          _this.map.addLayer(_this.markerClusterer, 'xxddsfxxx');
        }, error => {
          _this.loading = false;
          _this.$message({
            showClose: true,
            customClass: 'is-wrap',
            message: '点聚合实例化失败',
            type: 'error',
            offset: 76
          });
          console.error('arcgis点聚合时模块加载失败', error);
        });
      },
      // 标注点设置文字标签
      setMarkerLabel(marker) {
        let _this = this;
        let textSymbol = new esri.TextSymbol(marker.label, new esri.Font('12'), new esri.Color('#fff'));
        let mkIcon = _this.getMarkerSymbol(marker.icon, marker.iconOptions);
        let mkIconRealHeight = mkIcon.realHeight || mkIcon.size;
        textSymbol.setOffset(0, mkIcon.yoffset + mkIconRealHeight / 2 + 12);
        let graphic = new esri.Graphic(new esri.Point(marker.lng, marker.lat), textSymbol);
        _this.map.graphics.add(graphic);
        _this.currentMarkerLabelsTarget.push(graphic);
        return textSymbol;
      },
      // 设置文字标签背景
      setLabelBackground(gElm) {
        let _this = this;
        let textElms = gElm.querySelectorAll('text');
        textElms.forEach(e => {
          creatRect(e);
        });
        _this.map.on('extent-change', function() {
          let textElms = gElm.querySelectorAll('text');
          textElms.forEach(e => {
            let prevElm = e.previousElementSibling;
            if(prevElm.nodeName === 'rect') {
              let SVGRect = e.getBBox();
              prevElm.setAttribute('x', (SVGRect.x-3) + '');
              prevElm.setAttribute('y', (SVGRect.y-5) + '');
            }else {
              creatRect(e);
            }
          });
          let rectElms = gElm.querySelectorAll('rect');
          rectElms.forEach(e => {
            let nextElm = e.nextElementSibling;
            if(!nextElm || nextElm.nodeName !== 'text' || nextElm.getAttribute('font-size') !== '12') {
              e.remove();
            }
          });
        });
        function creatRect(elm) {
          let SVGRect = elm.getBBox();
          let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', (SVGRect.x-3) + '');
          rect.setAttribute('y', (SVGRect.y-5) + '');
          rect.setAttribute('width', (SVGRect.width+6) + '');
          rect.setAttribute('height', (SVGRect.height+10) + '');
          rect.setAttribute('rx', '4');
          rect.setAttribute('ry', '4');
          rect.setAttribute('fill', '#ef5350');
          rect.setAttribute('transform', 'matrix(1, 0, 0, 1, 0, ' + (-elm.e_graphic.symbol.yoffset) + ')');
          elm.parentNode.insertBefore(rect, elm);
        }
      },
      // 创建全屏控件
      createFullscreenControl() {
        let _this = this;
        let fullscreen = _this.$el.querySelector('.hdty-map-fullscreen');
        let i = document.createElement('i');
        // 添加项目
        fullscreen.appendChild(i);
        // 设置样式
        fullscreen.title = '退出全屏';
        i.className = 'hdty-fullscreen-icon icon-maximize-arrow';
        // 绑定事件
        fullscreen.onclick = e => {
          _this.toggleFullscreen(e);
        };
      },
      // 切换全屏模式
      toggleFullscreen(e) {
        if(Fullscreen.enabled) {
          Fullscreen.toggle(this.wrapperElement);
          if(!e.currentTarget.className.includes('is-reverse')) {
            e.currentTarget.classList.add('is-reverse')
          } else {
            e.currentTarget.classList.remove('is-reverse')
          }
        }else {
          this.$message({
            showClose: true,
            message: '您的浏览器暂不支持全屏',
            type: 'warning',
            offset: 76
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
