<template>
  <div style="height: 100%;width: 100%;" class="hdty-map">
    <div :id="mapId" style="height: 100%;width: 100%;" v-loading="loading"></div>
    <!--  绘制工具-->
    <div class="sfmap_drawging_panel" v-if="currentDrawingTool">
      <div :class="currentDrawingMode === 'drag'?'activePanel':''" @click="handleDrawing('drag')"><i class="icon-drag"></i></div>
      <div :class="currentDrawingMode === 'marker'?'activePanel':''" @click="handleDrawing('marker')" v-if="currentDrawingToolMarker"><i class="icon-symbol"></i>画点</div>
<!--      <div :class="currentDrawingMode === 'polyline'?'activePanel':''" @click="handleDrawing('polyline')"><i class="icon-polyline"></i>画折线</div>-->
      <div :class="currentDrawingMode === 'circle'?'activePanel':''" @click="handleDrawing('circle')" v-if="!currentDrawingToolMarker"><i class="icon-ring"></i>画圆</div>
      <div :class="currentDrawingMode === 'rectangle'?'activePanel':''" @click="handleDrawing('rectangle')" v-if="!currentDrawingToolMarker"><i class="icon-rect-ring"></i> 画矩形</div>
      <div :class="currentDrawingMode === 'polygon'?'activePanel':''" @click="handleDrawing('polygon')"><i class="icon-polygon"></i> 画多边形</div>
      <div :class="currentDrawingMode === 'delall'?'activePanel':''" @click="handleDrawing('delall')" v-if="!currentDrawingToolMarker"><i class="icon-brush"></i>清除图层</div>
    </div>
  </div>
</template>

<script>
  import MP from './src/map';
  import { bbox } from '@turf/turf';
  export default {
      name: "index",
      props: {
        prop: String,
        // 中心点坐标
        center: {
          type: Array,
          default() {
            return [111.6333555917404, 40.813901179163494]
          }
        },
        // 缩放级别
        zoom: {
          type: [Number, String],
          default: 5
        },
        // 显示缩放控件
        navigation: {
          type: Boolean,
          default: true
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
                icon: '', // 标注图标，设置图片URL(目前只支持图片路径，后期研究svg图标)
                labelBgColor: '', // 标签背景颜色，默认红色
                popover: '', // 信息窗口信息支持HTML
                onclick: '回调方法名称',  // 标注点点击事件回调方法名称
                dblclick: '回调方法名称', // 标注点双击事件回调方法名称
                contextmenu: [
                   {
                    label: '按钮1',  // 按钮名称
                    callback: 'open', // 按钮回调
                  },
                  {
                    label: '按钮2',
                    callback: 'cancle',
                  }
                ],  // 标注点右键点击显示菜单名称
              }
            ]*/
            return [];
          }
        },
        // 开启点自动视野调整
        markerAutoView: {
          type: Boolean,
          default: false
        },
        // 开启点聚合
        clusterer: {
          type: Boolean,
          default: true
        },
        // 右键菜单数组-点的右键
        contextmenu:{
          type: Array,
          default() {
            /*示例：
            [
              {
                label: '按钮1',  // 按钮名称
                callback: 'open', // 按钮回调
              },
              {
                label: '按钮2',
                callback: 'cancle',
              },
            ]*/
            return [];
          }
        },
        // 右键菜单数组-图层的右键
        contextmenuWms:{
          type: Array,
          default() {
            /*示例：
            [
              {
                label: '按钮1',  // 按钮名称
                callback: 'open', // 按钮回调
              },
              {
                label: '按钮2',
                callback: 'cancle',
              },
            ]*/
            return [];
          }
        },
        // 右键菜单数组-图层以外
        contextmenuMap:{
          type: Array,
          default() {
            /*示例：
            [
              {
                label: '按钮1',  // 按钮名称
                callback: 'open', // 按钮回调
              },
              {
                label: '按钮2',
                callback: 'cancle',
              },
            ]*/
            return [];
          }
        },
        // 显示全屏控件
        fullscreen: {
          type: Boolean,
          default: true
        },
        // 开启网格加载
        wms: {
          type: Boolean,
          default: false
        },
        // 开启自定义右键菜单
        customizeRightMenu: {
          type: Boolean,
          default: false
        },
        // 开启点绘制
        marker: {
          type: Boolean,
          default: false
        },
        zoomGj: {
          type: Array,
          default() {
            return [];
          }
        },
        // 圆路径坐标
        circlePath: {
          type: Array,
          default() {
            /*示例：
            [
             {
               lng: 0,  // 经度
               lat: 0,  // 纬度
               radius: 0  // 半径
             }
            ]*/
            return [];
          }
        },
        // 折线颜色
        polylineColor: {
          type: String,
          default() {
            return '';
          }
        },
        // 折线路径坐标
        polylinePath: {
          type: Array,
          default() {
            /*示例：
            [
             {
               lng: 0,  // 经度
               lat: 0  // 纬度
             }
            ]*/
            return [];
          }
        },
        // 显示绘制工具
        drawingTool: {
          type: Boolean,
          default: false,
        },
        // 只显示扎点绘制工具
        drawingToolMarker:{
          type: Boolean,
          default: false,
        },
        // 默认开启的绘制模式(drag/marker/polyline/circle/polygon/rectangle)
        drawingMode: {
          type: String,
          default: 'drag'
        },
        // 多边形状态：绘制-回显
        polygonFlag: {
          type: String,
          default: 'layer',
        },
        // 多边形路径坐标
        polygonPath: {
          type: Array,
          default() {
            /*示例：
            [
             {
               lng: 0,  // 经度
               lat: 0  // 纬度
             }
            ]*/
            return [];
          }
        },
        // 多边形颜色
        polygonColor: {
          type: Array,
          default() {
            return [];
          }
        },
        // ES关键字-用于判断波纹动画是否显示，Es检索结果才显示波纹动画
        keyWord:{
          type: String,
          default: ''
        }
      },
      data() {
        return {
          loading: false,
          // 地图实例
          map: null,
          // 地图Id
          mapId: 'FtMap_' + this.$utilStr.uuid(),
          // 当前中心点坐标
          currentCenter: this.center,
          // 当前点坐标
          currentMarkers: this.markers,
          // 当前开启多边形(点)绘制
          currentMarker: this.marker,
          // 当前地图级别
          currentZoom: this.zoom,
          // 当前是否开启网格加载
          currentWms: this.wms,
          // 当前是否开启自定义右键菜单
          currentCustomizeRightMenu: this.customizeRightMenu,
          // 当前开启的绘制模式
          currentDrawingMode: this.drawingMode,
          currentDrawingToolMarker: this.drawingToolMarker,
          // 当前显示绘制工具
          currentDrawingTool: this.drawingTool,
          // 点绘制实例
          drawMarker: null,
          drawExample: null,
          // 信息窗口
          container: null,
          // 点右键实例
          rightMenuPoint: null,
          // 右键传递的实例
          activeRightMenuMarkerInfo: null,
          // 当前高亮机构
          activeHeightOrg: '',
          // 当前是否是绘制模式
          drawMode: false,
          // 当前用户机构等级（wms网格）
          ZoomGjTpe: '',
          // 当前圆路径坐标
          currentCirclePath: this.circlePath,
          // 当前折线颜色
          currentPolylineColor: this.polylineColor,
          // 当前折线路径坐标
          currentPolylinePath: this.polylinePath,
          // 当前多边形路径坐标
          currentPolygonPath: this.polygonPath,
          // 多边形颜色
          currentPolygonColor: this.polygonColor,
          // 当前多边形的状态是绘制、回显
          currentPolygonFlag: this.polygonFlag,
          iconArry: [
            {
              iconName: 'iconJmzzl',
              type: 'jzw',
              url: '/static/public/images/icon/jmzzl.png',
            },
            {
              iconName: 'iconPf',
              type: 'jzw',
              url: '/static/public/images/icon/pf.png',
            },
            {
              iconName: 'iconCz',
              type: 'jzw',
              url: '/static/public/images/icon/cz.png',
            },
            {
              iconName: 'iconSyl',
              type: 'jzw',
              url: '/static/public/images/icon/syl.png',
            },
            {
              iconName: 'iconSzytl',
              type: 'jzw',
              url: '/static/public/images/icon/szytl.png',
            },
            {
              iconName: 'iconLpjzw',
              type: 'jzw',
              url: '/static/public/images/icon/lpjzw.png',
            },
            {
              iconName: 'iconPerson',
              type: 'person',
              url: '/static/public/images/icon/person.png',
              // url: '/static/public/images/icon/person.gif',
            },
            {
              iconName: 'iconYlcs',
              type: 'dw',
              url: '/static/public/images/icon/dw/ylcs.png',
            },
            {
              iconName: 'iconWb',
              type: 'dw',
              url: '/static/public/images/icon/dw/wb.png',
            },
            {
              iconName: 'iconQy',
              type: 'dw',
              url: '/static/public/images/icon/dw/qy.png',
            },
            {
              iconName: 'iconSchool',
              type: 'dw',
              url: '/static/public/images/icon/dw/school.png',
            },
            {
              iconName: 'iconYy',
              type: 'dw',
              url: '/static/public/images/icon/dw/yy.png',
            },
            {
              iconName: 'iconLg',
              type: 'dw',
              url: '/static/public/images/icon/dw/lg.png',
            },
            {
              iconName: 'iconDw',
              type: 'dw',
              url: '/static/public/images/icon/dw/dw.png',
            },
            {
              iconName: 'iconDwn',
              type: 'dw',
              url: '/static/public/images/icon/dw/ndw.png',
            },
            {
              iconName: 'iconDefault',
              type: 'defalut',
              url: '/static/public/images/icon/default.png',
            },
            {
              iconName: 'iconNum1',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point1.png',
            },
            {
              iconName: 'iconNum2',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point2.png',
            },
            {
              iconName: 'iconNum3',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point3.png',
            },
            {
              iconName: 'iconNum4',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point4.png',
            },
            {
              iconName: 'iconNum5',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point5.png',
            },
            {
              iconName: 'iconNum6',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point6.png',
            },
            {
              iconName: 'iconNum7',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point7.png',
            },
            {
              iconName: 'iconNum8',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point8.png',
            },
            {
              iconName: 'iconNum9',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point9.png',
            },
            {
              iconName: 'iconNum10',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point10.png',
            },
            {
              iconName: 'iconNum11',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point11.png',
            },
            {
              iconName: 'iconNum12',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point12.png',
            },
            {
              iconName: 'iconNum13',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point13.png',
            },
            {
              iconName: 'iconNum14',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point14.png',
            },
            {
              iconName: 'iconNum15',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point15.png',
            },
            {
              iconName: 'iconNum16',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point16.png',
            },
            {
              iconName: 'iconNum17',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point17.png',
            },
            {
              iconName: 'iconNum18',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point18.png',
            },
            {
              iconName: 'iconNum19',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point19.png',
            },
            {
              iconName: 'iconNum20',
              type: 'num',
              url: '/static/public/images/icon/numPoint/point20.png',
            },
            {
              iconName: 'iconSpjk',
              type: 'other',
              url: '/static/public/images/icon/spjk.png',
            },
            {
              iconName: 'iconCenter',
              type: 'other',
              url: '/static/public/images/icon/center.png',
            },
          ],
          geojson: null,
          // 点动画实例
          dynamicSymbolCreator: null,
        }
      },
      watch: {
        center: {
          handler(val) {
            if (val) {
              this.currentCenter = val;
              this.setCenterAndZoom();
            }
          },
          immediate: false
        },
        zoom: {
          handler(val) {
            if (val) {
              this.currentZoom = Number(val);
              this.setZoom();
            }
          },
          immediate: false
        },
        markers: {
          handler(val) {
            this.currentMarkers = val;
            this.setMarker();
            if(val.length === 0){
              this.clearMarkers()
            }
          },
          deep: true,
          immediate: false
        },
        drawingTool: {
          handler(val) {
            this.currentDrawingTool = val;
          },
          deep: true,
          immediate: false
        },
        drawingMode: {
          handler(val) {
            if(val && this.drawingTool){
              this.handleDrawing(val);
            }
          },
          deep: true,
          immediate: false
        },
        polygonFlag:{
          handler(val) {
            this.currentPolygonFlag = val;
          },
          immediate: false
        },
        drawingToolMarker:{
          handler(val) {
           this.currentDrawingToolMarker = val;
          },
          deep: true,
          immediate: false,
        },
        circlePath: {
          handler(val) {
            if(val.length > 0){
              this.currentCirclePath = val[0];
              this.setCircle();
            }else {
              // 清空圆
              if(this.map.getLayer('circlelayer')){
                this.map.removeLayer('circlelayer');
              }
            }
          },
          immediate: false
        },
        polylinePath: {
          handler(val) {
            this.currentPolylinePath = val;
            this.setPolyline();
          },
          deep: true,
          immediate: false
        },
        polygonPath: {
          handler(val) {
            // this.currentPolygonPath = val;
            // // 加载多边形
            // this.setPolygon();
            if(val.length > 0){
              this.currentPolygonPath = val;
              if(this.map){
                // 加载多边形
                this.setPolygon();
              }
            }else {
              this.currentPolygonPath = val;
              if(this.drawExample && this.drawExample.draw){
                this.drawExample.draw.deleteAll();
              }
              // 清空之前加载过的多边形
              if(this.map.getLayer('polygonLayer')) this.map.removeLayer('polygonLayer')
              if(this.map.getLayer('polygonline')) this.map.removeLayer('polygonline')
              // 清空之前加载过的多边形label
              // if (this.map && this.polygonMarkers.length !== 0) {
              //   for (let i = 0; i < this.polygonMarkers.length; i++) {
              //     this.polygonMarkers[i].remove();
              //   }
              // }
            }
          },
          immediate: false
        },
        polygonColor: {
          handler(val) {
            this.currentPolygonColor= val;
          },
          immediate: false
        },
      },
      created() {
        window.rightMenuClick = (val, type) => {
          this.rightMenuClick(val, type);
        };
        // 关闭信息窗体
        window.closePopup = val => {
          this.handleClosePopup();
        };
      },
      mounted() {
        let _this = this;
        console.log('初始化地图')
        MP.api().then(valid => {
          _this.init();
        }).catch(() => {
          _this.loading = false;
          _this.$message({
            showClose: true,
            customClass: 'is-wrap',
            message: '初始化地图失败',
            type: 'error',
            duration: 3000
          });
        });
      },
      methods: {
        init(){
          let _this = this;
          _this.loading = true;
          let centerMarker = [];
          if(_this.$utilPublic.getUserOrgLevel() === '2'){
            centerMarker = [_this.$utilPublic.getUserInfo().longitude, _this.$utilPublic.getUserInfo().latitude];
          }else if(_this.$utilPublic.getUserInfo().longitude){
            centerMarker = [_this.$utilPublic.getUserInfo().longitude, _this.$utilPublic.getUserInfo().latitude];
          }else {
            centerMarker = _this.currentCenter;
          }
          _this.map = new SFMap.Map({
            container: _this.mapId,
            // 使用自定义的style，仅加载一个栅格图层
            style: appEnv.ft_serverURL,
            center: centerMarker,
            zoom: _this.currentZoom, // starting zoom
            maxZoom: 22,
            attributionControl: false, //丰图logo
          });
          if(_this.fullscreen){
            // 增加全屏控件
            _this.map.addControl(new SFMap.FullscreenControl());
          }
          // 地图加载完成监听
          _this.map.on('load', function() {
            _this.loading = false;

            // 构造动态符号创建器
            _this.dynamicSymbolCreator = new SFMap.DynamicSymbolCreator();
            // 绑定地图
            _this.dynamicSymbolCreator.addTo(_this.map);
            // //
            // _this.map.loadImage('http://localhost:8090/static/public/images/icon/biuilding.png', function (error, image) {
            //   if (error != null) {
            //     return;
            //   }
            //   _this.map.addImage('marker', image);
            // });

            // 是否显示缩放控件
            if(_this.navigation){
              var nav = new SFMap.NavigationControl();
              _this.map.addControl(nav, 'bottom-right');
            }

            // // 添加比例尺控件
            // var scale = new SFMap.ScaleControl({
            //   maxWidth: 80,
            //   unit: 'imperial'
            // });
            // _this.map.addControl(scale);

            // 是否开启网格加载
            if(_this.currentWms){
              // wms网格图层绑定
              _this.setWms();
            }

            // 设置折线
            if(_this.currentPolylinePath.length > 0) {
              _this.setPolyline();
            }

            // 设置绘制组件
            // _this.drawMarker = new SFMap.DrawControl({
            //   controls: {
            //     point: true,
            //   },
            //   // 默认的模式
            //   defaultMode: 'simple_select',
            //   styles: [
            //     {
            //       'id': 'highlight-active-points',
            //       'type': 'circle',
            //       'filter': ['all',
            //         ['==', '$type', 'Point'],
            //         ['==', 'meta', 'feature'],
            //         ['==', 'active', 'true']],
            //       'paint': {
            //         'circle-radius': 10,
            //         'circle-color': 'orange',
            //       }
            //     },
            //     {
            //       'id': 'points-are-blue',
            //       'type': 'circle',
            //       'filter': ['all',
            //         ['==', '$type', 'Point'],
            //         ['==', 'meta', 'feature'],
            //         ['==', 'active', 'false']],
            //       'paint': {
            //         'circle-radius': 10,
            //         'circle-color': 'orange'
            //       }
            //     },
            //   ]
            // });
            _this.drawExample = new SFMap.DrawControl({
              styles: [
                {
                  "id": "gl-draw-polygon-fill",
                  "type": "fill",
                  "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                  "paint": {
                    "fill-color": "#D20C0C",
                    "fill-outline-color": "#D20C0C",
                    "fill-opacity": 0.1
                  }
                },
                // polygon mid points
                {
                  'id': 'gl-draw-polygon-midpoint',
                  'type': 'circle',
                  'filter': ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
                  'paint': {
                    'circle-radius': 3,
                    'circle-color': '#fbb03b'
                  }
                },
                // polygon outline stroke
                // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
                {
                  "id": "gl-draw-polygon-stroke-active",
                  "type": "line",
                  "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
                  "layout": {
                    "line-cap": "round",
                    "line-join": "round"
                  },
                  "paint": {
                    "line-color": "#D20C0C",
                    "line-dasharray": [0.2, 2],
                    "line-width": 2
                  }
                },
                // vertex point halos
                {
                  "id": "gl-draw-polygon-and-line-vertex-halo-active",
                  "type": "circle",
                  "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                  "paint": {
                    "circle-radius": 1,
                    "circle-color": "#D20C0C"
                  }
                },
                // vertex points
                {
                  "id": "gl-draw-polygon-and-line-vertex-active",
                  "type": "circle",
                  "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
                  "paint": {
                    "circle-radius": 1,
                    "circle-color": "#D20C0C",
                  }
                }
              ]
            });
            _this.map.addControl(_this.drawExample);

            // 设置多边形
            if(_this.currentPolygonPath){
              _this.setPolygon();
            }

            // 设置点
            if(_this.currentMarkers){
              _this.setMarker();
            }

            // 如果开启绘制
            if(_this.currentDrawingTool){
              _this.handleDrawing(_this.currentDrawingMode);
            }

            // 抛出回调
            _this.$emit('loaded');

            // 监听点的拖动
            var canvas = _this.map.getCanvasContainer();
            var pointIndex = null;
            _this.map.on('mouseenter', 'point', function(e) {
              let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
                layers: ['point'],
              })
              if(pointFeatures.length > 0){
                pointIndex = _this.markers.findIndex(e => e.dzbm === pointFeatures[0].properties.dzbm);
              }
              canvas.style.cursor = 'move';
            });
            _this.map.on('mouseleave', 'point', function() {
              canvas.style.cursor = '';
            });
            _this.map.on('mousedown', 'point', function(e) {
              e.preventDefault();
              canvas.style.cursor = 'grab';
              _this.map.on('mousemove', onMove);
              _this.map.once('mouseup', onUp);
            });
            _this.map.on('touchstart', 'point', function(e) {
              console.log("鼠标拖动开始")
              if (e.points.length !== 1) return;
              e.preventDefault();
              _this.map.on('touchmove', onMove);
              _this.map.once('touchend', onUp);
            });
            function onMove(e) {
              var coords = e.lngLat;
              canvas.style.cursor = 'grabbing';
              _this.geojson.features[pointIndex].geometry.coordinates = [coords.lng, coords.lat];
              _this.map.getSource('earthquakes').setData(_this.geojson);
            }
            function onUp(e) {
              canvas.style.cursor = '';
              _this.map.off('mousemove', onMove);
              _this.map.off('touchmove', onMove);
            }
          });

          // 临时处理加载失败
          setTimeout(()=>{
            if(_this.loading){
              _this.loading = false;
              // 抛出回调
              _this.$emit('loaded');
              // 是否开启网格加载
              if(_this.currentWms){
                // wms网格图层绑定
                _this.setWms();
              }
            }
          },3000)

          // 监听绘制
          _this.map.on("draw.create", (res) => {
            if(_this.currentDrawingMode === 'marker'){
              // 抛出地图点击事件
              _this.$emit('mapClick',{
                lngLat: {
                  lng: res.features[0].geometry.coordinates[0],
                  lat: res.features[0].geometry.coordinates[1],
                }
              });
            }else{
              _this.currentDrawingMode = 'drag';
              let bbox = _this.getMaxMinLonLat(res.features[0].geometry.coordinates[0]);
              _this.handleDrawing('delprve');
              _this.$emit('currentDrawed', bbox, res.features[0].geometry.coordinates[0]);
            }
          })
          _this.map.on('draw.update', function (res) {
            if(res.action === 'move'){
              _this.currentDrawingMode = 'drag';
              let bbox = _this.getMaxMinLonLat(res.features[0].geometry.coordinates[0]);
              _this.$emit('currentDrawedUpdate', bbox);
            }
          });

          // 地图缩放监听
          _this.map.on('zoomend', function () {
            console.log("地图发生了缩放");
            let oldZoom = _this.$utilStr.deepClone(_this.currentZoom);
            _this.currentZoom = _this.map.getZoom();
            _this.$emit('currentZoom' , _this.map.getZoom(), _this.map.getCenter(), oldZoom)
          })

          // 地图双击监听
          _this.map.on('dblclick', function(e) {

            // 如果点击的是点
            let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
              layers: ['point'],
            })
            if(pointFeatures.length > 0){
              if(pointFeatures[0].properties.dblclick){
                setTimeout(() => {
                  // 关闭信息窗体
                  _this.handleClosePopup();
                },500)
                _this.$emit(pointFeatures[0].properties.dblclick, pointFeatures[0].properties)
              }
            }

            // 双击地图回调
            _this.$emit('mapDblclick');
          })

          // 地图点击监听
          _this.map.on('click', function(e) {
            // 如果正在框选，不响应点击事件
            if(_this.currentDrawingMode !== 'drag'){
              return;
            }
            let wmsArry = _this.map.getStyle().layers.filter(e => e.id.indexOf('branch') !== -1)
            let wmsFeatures = null;
              for (let i = 0; i < wmsArry.length; i++) {
                wmsFeatures = _this.map.queryRenderedFeatures(e.point,{
                  layers: [wmsArry[i].id],
                })

                if(wmsFeatures && wmsFeatures.length > 0){
                  // 如果点击的是网格图层，则高亮
                  if(wmsFeatures.length > 0 ){
                    // 如果当前高亮的网格和点的网格是同一个网格，则取消高亮
                    let heightLightLayer = _this.map.getLayer('height-light');
                    // 如果当前有高亮图层，先移除
                    // if(_this.map.getLayer('height-light')  && _this.map.getLayer('height-light-border')){
                    //   _this.map.removeLayer('height-light');
                    //   _this.map.removeLayer('height-light-border');
                    // }
                    // if(heightLightLayer && heightLightLayer.filter[heightLightLayer.filter.length -1] === wmsFeatures[0].properties.rela_id){
                    //   return;
                    // }
                    // 已经是责任区+派出所轮廓网格，不在高亮
                    if(!_this.map.getLayer('pcs_branch_border')){
                      let pointFeatures1 = _this.map.queryRenderedFeatures(e.point,{
                        layers: ['point'],
                      })
                      let clustersFeatures = _this.map.queryRenderedFeatures(e.point,{
                        layers: ['clusters'],
                      })
                      if(pointFeatures1.length  ===  0 &&　clustersFeatures.length === 0){
                        // 抛出网格点击事件
                        _this.$emit('wmsClick',e,wmsFeatures[0].properties);
                        _this.heightWms(wmsFeatures[0].properties);
                      }
                    }else{
                      // 抛出网格点击事件
                      _this.$emit('wmsClick',e,wmsFeatures[0].properties);
                      _this.heightWms(wmsFeatures[0].properties);
                    }
                  }
                  break;
                }
              }

            // 抛出地图点击事件
            _this.$emit('mapClick',e);

            // 如果点击的是点
            let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
              layers: ['point'],
            })
            if(pointFeatures.length > 0){
              // 如果点有单击回调，则回调
              if(pointFeatures[0].properties.onclick){
                // 回调单击回调事件
                _this.$emit(pointFeatures[0].properties.onclick, pointFeatures[0].properties);
                return;
              }
              // 如果当前有高亮图层，先移除
              // if(_this.map.getLayer('height-light')  && _this.map.getLayer('height-light-border')){
              //   _this.map.removeLayer('height-light');
              //   _this.map.removeLayer('height-light-border');
              // }
              // 如果点有信息窗体，则展示
              if(pointFeatures[0].properties.popover){
                var coordinates = pointFeatures[0].geometry.coordinates.slice();
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }
               setTimeout(() => {
                 _this.container = new SFMap.Popup()
                   .setLngLat(coordinates)
                   .setHTML('<div id="popup" class="popup">' +
                     ' <a href="#" id="popup-closer" class="popup-closer" onclick="closePopup()"></a>' +
                     '   <div id="popup-content">'+ pointFeatures[0].properties.popover +
                     '</div>' +
                     '    </div>')
                   .addTo(_this.map);
                 // 回调加载信息窗体内容
                 _this.$emit('currentBuildingPopoverOpen', pointFeatures[0].properties)
               },200)

              }
            }
          });

          // 地图移动监听
          _this.map.on('move', function(e){
            console.log('地图发生了移动');
            // 抛出回调
            _this.$emit('mapMove', _this.map.getCenter());
          })

          _this.map.on('dragend', function() {
            console.log('地图发生了拖拽');
            // 抛出回调
            _this.$emit('mapDragend', _this.map.getCenter());
          });

          // 右键菜单
          if(_this.currentCustomizeRightMenu){
            // 自定义右键菜单
            _this.map.on('contextmenu', function(e) {
              // 如果点击的是点
              let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
                layers: ['point'],
              })
              if(pointFeatures.length > 0){
                return;
              }
              let wmsArry = _this.map.getStyle().layers.filter(e => e.id.indexOf('branch') !== -1)
              let wmsFeatures = null;
              for (let i = 0; i < wmsArry.length; i++) {
                wmsFeatures = _this.map.queryRenderedFeatures(e.point, {
                  layers: [wmsArry[i].id],
                })
                if(wmsFeatures.length > 0 ){
                  // 如果点击的是点
                  let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
                    layers: ['point'],
                  })
                  if(pointFeatures.length > 0){
                    return;
                  }else {
                    _this.$emit("currentContextMenu", {
                      ...wmsFeatures[0],
                      ...e,
                      isWms: true,
                    });
                    break;
                  }
                }

              }
              // 如果点击的是网格图层
              // let wmsFeatures = _this.map.queryRenderedFeatures(e.point,{
              //   layers: ['branch'],
              // })
            });
          }
          // else{
            // 关闭右键菜单
            _this.handleClooseRightMenu();
            var rightMenu = new SFMap.RightMenuControl({
              className: 'sfmap-ctrl-rightmenu-custom',
              // 菜单内容设置为function，可根据鼠标拾取的对象不同生成不同的菜单内容
              menuItems: function(val) {
                // 判断是否拾取到蓝色圆
                var bbox = [
                  [val.point.x - 5, val.point.y - 5],
                  [val.point.x + 5, val.point.y + 5]
                ];
                var branchFeatures = _this.map.queryRenderedFeatures(bbox, {
                  layers: ['branch']
                });
                var pointFeatures = _this.map.queryRenderedFeatures(bbox, {
                  layers: ['point']
                });
                if(pointFeatures.length > 0){
                  return;
                }
                if (branchFeatures.length > 0) {
                  let menus = [];
                  // 点击的是网格-设置右键菜单
                  _this.contextmenuWms.forEach(e => {
                    // 当前用户统计，不显示【返回上级】
                    if(_this.zoomGj.length === 1 && e.label === '返回上级'){
                     return;
                    }
                    // 责任区用户才显示【新增建筑物】
                    else if(_this.$utilPublic.getUserOrgLevel() <= 5 && e.label === '新增建筑物'){
                      return;
                    }
                    else{
                      branchFeatures[0].properties.lng = val.lngLat.lng;
                      branchFeatures[0].properties.lat = val.lngLat.lat;
                      menus.push({
                        id: _this.$utilStr.uuid(),
                        data: branchFeatures[0].properties,
                        content: '<i class="' + e.icon + '"></i> ' + e.label,
                        callback: e.callback,
                      })
                    }
                  });
                  return menus;
                } else {
                  // 地图网格外右键
                  let menus = [];
                  // 点击的是网格-设置右键菜单
                  _this.contextmenuMap.forEach(menu => {
                    menus.push({
                      id: _this.$utilStr.uuid(),
                      data: val.lngLat,
                      content: '<i class="' + menu.icon + '"></i> ' + menu.label,
                      callback: menu.callback,
                    })
                  })
                  return menus;
                }
              }
            });
            _this.map.addControl(rightMenu);
            _this.map.on('rightmenu.click', function(menuItem) {
              console.log('菜单点击', menuItem);
              _this.activeRightMenuMarkerInfo = {
                ...menuItem.data,
              };
              _this.$emit(menuItem.callback, _this.activeRightMenuMarkerInfo);
            });
          // }
        },
        // 设置地图中心点和级别
        setCenterAndZoom(){
          console.log("中心点发生变化", this.currentCenter)
          if(this.map){
            this.map.setCenter(this.currentCenter);
            this.map.setZoom(this.currentZoom);
          }
        },
        // 设置地图级别
        setZoom(){
          console.log("地图级别发生变化")
          this.map.setZoom(this.currentZoom);
        },
        // 设置点
        setMarker() {
          let _this = this;
          let geojson = {
            type: 'FeatureCollection',
            features: [],
          }
          // 处理点数据
          _this.markers.forEach(e => {
            if(!e.labelBgColor){
              // 如果没有设置标签背景颜色，默认为红色
              e.labelBgColor = '#F56C6C'
            }
            let feature = {
              'type': 'Feature',
              'properties':  e,
              'geometry': {
                'type': 'Point',
                'coordinates': [e.lng, e.lat]
              }
            }
            geojson.features.push(feature);
          });
          _this.geojson = geojson;
          // 聚合点
          if(_this.clusterer){
            // 设置图标类
            const loadImage = function(iconName, url) {
              return new Promise(function(resolve, reject) {
                _this.map.loadImage(url, function(error, image) {
                  if (error) {
                    reject(error)
                  } else {
                    if(_this.map.hasImage(iconName)){
                      _this.map.removeImage(iconName);
                    }
                    _this.map.addImage(iconName, image);
                    resolve();
                  }
                });
              });
            }
            let loadImagePromises = [];
            _this.iconArry.forEach( e => {
              if(e.type !== 'num'){
                loadImagePromises.push(loadImage(e.iconName,  process.env.NODE_PATH + e.url))
              }
            })
            Promise.all(loadImagePromises).then(function() {
              if(_this.map.getSource('earthquakes')){
                _this.map.getSource('earthquakes').setData(geojson);
                // 处理单个需要加波纹图层的数据源
                let newGeoJson =  {
                  type: 'FeatureCollection',
                  features: [],
                };
                _this.geojson.features.forEach(e => {
                  if(e.properties.star === false && _this.keyWord){
                    newGeoJson.features.push(e);
                  }
                })
                if(_this.map.getSource('waveSource')) {
                  _this.map.getSource('waveSource').setData(newGeoJson);
                }else{
                  _this.map.addSource('waveSource', {
                    type: 'geojson',
                    data: newGeoJson,
                    cluster: true,
                    clusterMaxZoom: 16,
                    clusterRadius: 50,
                    clusterMinPoints: 1
                  });
                }
              }else{
                _this.map.addSource('earthquakes', {
                  type: 'geojson',
                  data: geojson,
                  cluster: true,
                  clusterMaxZoom: 16,
                  clusterRadius: 50,
                  clusterMinPoints: 1
                });
              }
              // 聚合图层
              if(_this.map.getLayer('clusters')) _this.map.removeLayer('clusters');
              _this.map.addLayer({
                id: 'clusters',
                type: 'circle',
                source: 'earthquakes',
                filter: ['has', 'point_count'],
                paint: {
                  'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 100, '#f1f075', 750, '#f28cb1'],
                  'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40]
                }
              });

              // 点的文本标注图层
              if(_this.map.getLayer('point')) _this.map.removeLayer('point');
              _this.map.addLayer({
                id: 'point',
                type: 'symbol',
                source: 'earthquakes',
                filter: ['!', ['has', 'point_count']],
                paint: {
                  'text-color': '#fff',
                  'text-halo-color': ['get', 'labelBgColor'], // 文本光圈
                  'text-halo-width': 8, // 文本光圈宽度
                },
                'layout': {
                  'icon-image': ['get', 'icon'], // 从properties的icon属性获取图标名称
                  // 'icon-size': 1,// 图标缩放比例，默认为1
                  'icon-size': ['get', 'iconSize'],// 图标缩放比例，默认为1
                  // 图标默认居中对齐，这里是气泡图标需要底部对齐，因此y方向偏移设置为图标高度的一半的相反数，-32/2 = -16 （单位px）
                  'icon-offset':[0, -16],
                  'icon-allow-overlap': true,// 允许图标相互遮挡
                  'text-field': ['get', 'label'],
                  'text-offset': [0, -3.8],
                  'text-anchor': 'top',
                  'text-max-width': 100,
                  'text-allow-overlap': true,// 允许标签相互遮挡
                }
              });

              // 创建渐变波纹动画
              const waveSymbol = _this.dynamicSymbolCreator.createGradientWave({
                size: 150,// 尺寸
                color: [156,16,11], // 颜色rgb
                duration: 1500,// 动画时长，单位毫秒
                innerOpacity: 0.6,// 内部圆环透明度
                innerRatio: 0.3, // 内部圆环半径占比
              });
              // 添加符号
              _this.map.addImage('gradient-wave', waveSymbol, { pixelRatio: 2 });

              // 添加波纹图层
              if(_this.map.getLayer('wave')) _this.map.removeLayer('wave');
              _this.map.addLayer({
                'id': 'wave',
                'type': 'symbol',
                'source': 'waveSource',
                'layout': {
                  'icon-image': 'gradient-wave',
                  'icon-rotation-alignment': 'map',
                  'icon-allow-overlap': true,
                }
              });

              // 聚合点数量图层
              if(_this.map.getLayer('cluster-count')) _this.map.removeLayer('cluster-count');
              _this.map.addLayer({
                id: 'cluster-count',
                type: 'symbol',
                source: 'earthquakes',
                filter: ['has', 'point_count'],
                layout: {
                  'text-field': '{point_count_abbreviated}',
                  'text-size': 15
                }
              });
              // 点的最佳视野展示
              if(_this.markerAutoView &&　_this.markers.length > 1){
                let bbox = _this.getMaxMinLonLat(_this.map.getSource('earthquakes')._data.features);
                _this.map.fitBounds(bbox, {
                  padding: 100
                });
              }
              else if(_this.markerAutoView){
                _this.currentCenter = [_this.markers[0].lng, _this.markers[0].lat];
                _this.currentZoom = 16;
                _this.map.setCenter(_this.currentCenter);
                _this.map.setZoom(_this.currentZoom);
              }
              //  点击聚合状态的点
              _this.map.on('click', 'clusters', function(e) {
                // 如果当前有高亮图层，先移除
                // if(_this.map.getLayer('height-light') && _this.map.getLayer('height-light-border')){
                //   _this.map.removeLayer('height-light');
                //   _this.map.removeLayer('height-light-border');
                // }
                var features = _this.map.queryRenderedFeatures(e.point, {
                  layers: ['clusters']
                });
                var clusterId = features[0].properties.cluster_id;
                // 获取点击聚合点对应的要素数组
                _this.map.getSource('earthquakes').getClusterLeaves(clusterId, Number.POSITIVE_INFINITY,0,function(error, featureList){
                  // console.info('点击聚合对应的要素列表：',featureList)
                });
                _this.map.getSource('earthquakes').getClusterExpansionZoom(clusterId,
                  function(err, zoom) {
                    if (err) return;
                    _this.map.easeTo({
                      center: features[0].geometry.coordinates,
                      zoom: zoom
                    });
                  }
                );
              });

              _this.map.on('mouseenter', 'clusters', function() {
                _this.map.getCanvas().style.cursor = 'pointer';
              });
              _this.map.on('mouseleave', 'clusters', function() {
                _this.map.getCanvas().style.cursor = '';
              });
              _this.map.on('mouseenter', 'point', function() {
                _this.map.getCanvas().style.cursor = 'pointer';
              });
              _this.map.on('mouseleave', 'point', function() {
                _this.map.getCanvas().style.cursor = '';
              });
              if(_this.map.hasControl(_this.rightMenuPoint)){
                _this.map.removeControl(_this.rightMenuPoint)
                _this.rightMenuPoint = null;
              }
              _this.rightMenuPoint = new SFMap.RightMenuControl({
                className: 'sfmap-ctrl-rightmenu-custom-point',
                // 菜单内容设置为function，可根据鼠标拾取的对象不同生成不同的菜单内容
                menuItems: function(e) {
                  // 判断是否拾取到蓝色圆
                  var bbox = [
                    [e.point.x - 5, e.point.y - 5],
                    [e.point.x + 5, e.point.y + 5]
                  ];
                  var pointFeatures = _this.map.queryRenderedFeatures(bbox, {
                    layers: ['point']
                  });
                  if (pointFeatures.length > 0) {
                    let menus = [];
                    // 点击的是点-设置右键菜单
                    JSON.parse(pointFeatures[0].properties.contextmenu).forEach(e => {
                      menus.push({
                        id: _this.$utilStr.uuid(),
                        data: pointFeatures[0].properties,
                        content: '<i class="' + e.icon + '"></i> ' + e.label,
                        callback: e.callback,
                      })
                    })
                    return menus;
                  } else {
                    // 非点右键
                  }
                }
              });

              _this.map.addControl(_this.rightMenuPoint);
              _this.map.on('_this.rightMenuPoint.click', function(menuItem) {
                console.log('菜单点击', menuItem);
                _this.activeRightMenuMarkerInfo = menuItem.data;
                _this.$emit(menuItem.callback, _this.activeRightMenuMarkerInfo);
              });
            })
          }
          // 非聚合点
          else{
            if(_this.map && _this.map.getLayer('point')) {
              _this.map.removeLayer('point')
            }
            geojson.features.forEach((marker, markerIndex) => {
              var el = document.createElement('div');
              el.className = 'markerDiv';
              // 图片缩放 注意css样式需要设置
              if(!marker.properties.label){
                el.style.width = '30px';
              }
              el.style.height = '37px';
              if(marker.properties.label){
                el.innerHTML = '<div class="marker-label" style="margin-top: -27px;text-align:center;padding: 2px 5px;background-color:'+ marker.properties.labelBgColor +'">'+ marker.properties.label +'</div>'
              }else{
                el.innerHTML = ''
              }
              let iconInfo = _this.iconArry.find( e => e.iconName === marker.properties.icon);
              if(iconInfo){
                el.style.background = 'url(' + process.env.NODE_PATH  + iconInfo.url + ')';
                el.style.backgroundRepeat = 'no-repeat';
                el.style.backgroundPosition = 'center center';
              }
              el.style.color = '#fff';
              el.style.cursor = 'pointer';
              el.style.fontSize = '15px';
              // 设置图标偏移量
              el.style.marginTop = '-19px';
              if(iconInfo && iconInfo.iconName === 'iconCenter'){
                el.style.marginTop = '0';
                el.style.width = '26px';
                el.style.height = '42px';
              }
              let sfMarker = new SFMap.Marker(el)
                .setLngLat(marker.geometry.coordinates)
                .addTo(_this.map);
              el.addEventListener('click',() => {
                if(marker.properties.onclick){
                  // 回调单击回调事件
                  _this.$emit(marker.properties.onclick, marker.properties);
                  return;
                }
                // 如果当前有高亮图层，先移除
                if(_this.map.getLayer('height-light')  && _this.map.getLayer('height-light-border')){
                  _this.map.removeLayer('height-light');
                  _this.map.removeLayer('height-light-border');
                }
                if(marker.properties.popover){
                  // sfMarker.setPopup(new SFMap.Popup().setHTML('<div id="popup" class="popup">' +
                  //   ' <a href="#" id="popup-closer" class="popup-closer" onclick="closePopup()"></a>' +
                  //   '   <div id="popup-content">'+ marker.properties.popover +
                  //   '</div>' +
                  //   '    </div>'));
                  sfMarker.setPopup(new SFMap.Popup().setHTML( marker.properties.popover ));
                  // 回调加载信息窗体内容
                  _this.$emit('currentBuildingPopoverOpen', marker.properties)
                }
              })
            });
            // 点的最佳视野展示
            if(_this.markerAutoView &&　_this.markers.length > 1){
              let bbox = _this.getMaxMinLonLat(_this.markers);
              _this.map.fitBounds(bbox, {
                padding: 100
              });
            }
          }
        },
       // 获取最大最小经纬度的数组,用于点的最佳视野计算
        getMaxMinLonLat(any) {
          if (any.length > 1) {
            if(any[0].properties &&　any[0].properties.lng){
              let newData = any.filter((e) => e.properties.lng !== 0 && e.properties.lat !== 0);
              let latList = Array.from(newData, (e) => e.properties.lng);
              let lonList = Array.from(newData, (e) => e.properties.lat);
              let latArr = latList.sort();
              let lonArr = lonList.sort();
              let maxLonLat = [latArr[latArr.length - 1], lonArr[lonArr.length - 1]];
              let minLonLat = [latArr[0], lonArr[0]];
              return [maxLonLat, minLonLat,];
            }
            else{
              if(this.$utilStr.isObject(any[0])){
                let newData = any.filter((e) => e.lng !== 0 && e.lat !== 0);
                let latList = Array.from(newData, (e) => e.lng);
                let lonList = Array.from(newData, (e) => e.lat);
                let latArr = latList.sort();
                let lonArr = lonList.sort();
                let maxLonLat = [latArr[latArr.length - 1], lonArr[lonArr.length - 1]];
                let minLonLat = [latArr[0], lonArr[0]];
                return [maxLonLat, minLonLat,];
              }
              else if(this.$utilStr.isArray(any[0])) {
                let newData = any.filter((e) => e[0] !== 0 && e[1] !== 0);
                let latList = Array.from(newData, (e) => e[0]);
                let lonList = Array.from(newData, (e) => e[1]);
                let latArr = latList.sort();
                let lonArr = lonList.sort();
                let maxLonLat = [latArr[latArr.length - 1], lonArr[lonArr.length - 1]];
                let minLonLat = [latArr[0], lonArr[0]];
                return [maxLonLat, minLonLat,];
              }
            }
          } else {
            return false;
          }
        },
        // wms网格图层绑定
        setWms(){
          let _this = this;
          _this.map.addSource('areamap', {
            type: 'vector',
            tileSize: 512,
            // 网格矢量图层
            tiles: [appEnv.ft_WMSServerURL],
            maxzoom: 13,// 这里不要修改，亲测
          })
          let filter = [];
          if(_this.$utilPublic.getUserOrgLevel() === '2'){
            filter = ['==', 'type' , '1'];
          }
          else if(_this.$utilPublic.getUserOrgLevel() === '3'){
            filter = ['==', 'parent_rela_id', _this.$utilPublic.getUserOrgId().substring(0, 6)];
          }
          else if(_this.$utilPublic.getUserOrgLevel() === '4' || _this.$utilPublic.getUserOrgLevel() === '5'){
            filter = ['==', 'parent_rela_id', _this.$utilPublic.getUserOrgId()];
          }else{
            filter = ['==', 'rela_id', _this.$utilPublic.getUserOrgId()];
          }
          // 网格上图
          _this.map.addLayer({
            id: 'branch',
            type: 'fill',
            filter: filter,
            paint: {
              'fill-color': 'rgba(20, 135, 71, 0.4)',
              //'fill-width': 3,
            },
            source: 'areamap',
            'source-layer': 'area',
          });
          _this.map.addLayer({
            id: 'branch_border',
            type: 'line',
            filter: filter,
            paint: {
              'line-color': '#148747',
              'line-width': 3,
            },
            source: 'areamap',
            'source-layer': 'area',
          })

          // 网格标注
          _this.map.addLayer({
            id: 'branch_name',
            type: 'symbol',
            source: 'areamap',
            filter: filter,
            paint: {
              'text-color': '#fff',
              'text-halo-color': '#148747',
              'text-halo-width': 2,
            },
            'source-layer': 'area_name',
            layout: {
              'text-justify': 'center',
              'text-field': ['get', 'name'],
              'text-allow-overlap': true,
            },
          });
          _this.map.on('dblclick', 'branch', function(e) {
            // 社区业务，关闭双击响应
            // return;
            // 用于解决响应双击的同时响应了单击
            if(e.defaultPrevented){
              return;
            }
            // 如果点击的是点
            let pointFeatures = _this.map.queryRenderedFeatures(e.point,{
              layers: ['point'],
            })
            if(pointFeatures.length > 0){
              return;
            }
            e.preventDefault();
            // 责任区以上网格支持双击下转
            if(e.features[0].properties.type < 4){
              // // 记录缩放轨迹
              // _this.$emit('setZoomGj', e.features[0].properties);
              _this.$emit('wmsDblclick',e);
              // 移除高亮图层
              if(_this.map.getLayer('height-light')){
                _this.map.removeLayer('height-light');
                _this.map.removeLayer('height-light-border');
              }
              e.features[0].properties.isShowJzw = true;
              // // 加载下级网格
              // _this.$emit('getWmsLyaer',e.features[0].properties);
              setTimeout(() => {
                // 关闭信息窗体
                _this.handleClosePopup();
              },500)
            }else{
              // 已经是责任区+派出所轮廓网格，不在继续下转
              if(_this.map.getLayer('pcs_branch_border')){
                return;
              }
              // // 记录缩放轨迹
              // if(e.features[0].properties.rela_id){
              //   _this.$emit('setZoomGj', e.features[0].properties);
              // }
              // 移除高亮图层
              if(_this.map.getLayer('height-light')){
                _this.map.removeLayer('height-light');
                _this.map.removeLayer('height-light-border');
              }
              // 加载下级网格
              // _this.$emit('getWmsLyaer',e.features[0].properties);
              // 加载派出所网格边框
              // _this.map.addLayer({
              //   id: 'pcs_branch_border',
              //   type: 'line',
              //   filter: ['==', 'rela_id', e.features[0].properties.parent_rela_id],
              //   paint: {
              //     'line-color': 'red',
              //     'line-width': 3,
              //   },
              //   source: 'areamap',
              //   'source-layer': 'area',
              // })
              // _this.map.addLayer({
              //   id: 'pcs_branch_name',
              //   type: 'symbol',
              //   source: 'areamap',
              //   filter:  ['==', 'rela_id', e.features[0].properties.parent_rela_id],
              //   paint: {
              //     'text-color': '#fff',
              //     'text-halo-color': 'red',
              //     'text-halo-width': 2,
              //   },
              //   'source-layer': 'area_name',
              //   layout: {
              //     'text-justify': 'center',
              //     'text-field': ['get', 'name'],
              //     'text-allow-overlap': true,
              //   },
              // })
            }
          });
        },
        // 高亮网格
        heightWms(val){
          if(this.map.getLayer('height-light')){
            this.map.removeLayer('height-light');
            this.map.removeLayer('height-light-border');
          }
          // 高亮
          this.map.addLayer({
            id: 'height-light',
            type: 'fill',
            source: 'areamap',
            'source-layer': 'area',
            filter: ['==', 'rela_id',val.rela_id],
            paint: {
              'fill-color': '#E6A23C',
              'fill-opacity': 0.15
            },
          })
          this.map.addLayer({
            id: 'height-light-border',
            type: 'line',
            source: 'areamap',
            'source-layer':'area',
            filter: ['==', 'rela_id', val.rela_id],
            paint: {
              'line-color': '#E6A23C',
              'line-width': 3,
            },
          })
        },
        // 加载指定网格
        setWmsLayer(filter, type, bbox, padding){
          if(Number(filter[2]) < 3){
            // 清空高亮图层
            if(this.map.getLayer('height-light')){
              this.map.removeLayer('height-light');
              this.map.removeLayer('height-light-border');
            }
          }
          // 清空派出所图层
          if(this.map.getLayer('pcs_branch_border')){
            this.map.removeLayer('pcs_branch_border');
            this.map.removeLayer('pcs_branch_name');
          }
          // 清空缩放产生的父级网格
          if(this.map.getLayer('parent_branch_border')){
            this.map.removeLayer('parent_branch_border');
            this.map.removeLayer('parent_branch_name');
          }
          if(type !== 5 && type !== 6){
            this.map.setFilter('branch', filter);
            this.map.setFilter('branch_border', filter);
            this.map.setFilter('branch_name', filter);
          }
          // 网格最佳视野
          if(type === 1){
            // 省厅,市级网格上图
            this.currentZoom = 5;
            if(this.$utilPublic.getUserInfo().longitude){
              this.currentCenter = [this.$utilPublic.getUserInfo().longitude, this.$utilPublic.getUserInfo().latitude]
            }
            this.setCenterAndZoom();
          }
          else if(type === 2){
            // 市级、分局、派出所，单个网格上图
            this.map.fitBounds(bbox, {
              padding: padding ? padding : 100
            });
          }
          else if(type === 3){
            if(Number(filter[2]) > 1){
              // 加载派出所网格边框
              this.map.addLayer({
                id: 'parent_branch_border',
                type: 'line',
                filter: ['==', 'type', (Number(filter[2]) -1) + ''],
                paint: {
                  'line-color': 'red',
                  'line-width': 3,
                },
                source: 'areamap',
                'source-layer': 'area',
              })
              this.map.addLayer({
                id: 'parent_branch_name',
                type: 'symbol',
                source: 'areamap',
                filter:  ['==', 'type', (Number(filter[2]) -1) + ''],
                paint: {
                  'text-color': '#fff',
                  'text-halo-color': 'red',
                  'text-halo-width': 2,
                },
                'source-layer': 'area_name',
                layout: {
                  'text-justify': 'center',
                  'text-field': ['get', 'name'],
                  'text-allow-overlap': true,
                },
              });
            }
          }
          else if(type === 5){
            // 加载派出所下的责任区网格
            this.map.addLayer({
              id: 'zrq_branch',
              type: 'fill',
              filter: filter,
              paint: {
                'fill-color': 'rgba(20, 135, 71, 0.4)',
                //'fill-width': 3,
              },
              source: 'areamap',
              'source-layer': 'area',
            },'branch');
            this.map.addLayer({
              id: 'zrq_branch_border' + filter[2],
              type: 'line',
              filter: filter,
              paint: {
                'line-color': 'rgba(20, 135, 71, 0.4)',
                'line-width': 3,
              },
              source: 'areamap',
              'source-layer': 'area',
            })
            this.map.addLayer({
              id: 'zrq_branch_name' + filter[2],
              type: 'symbol',
              source: 'areamap',
              filter:  filter,
              paint: {
                'text-color': '#fff',
                'text-halo-color': 'rgba(20, 135, 71, 0.4)',
                'text-halo-width': 2,
              },
              'source-layer': 'area_name',
              layout: {
                'text-justify': 'center',
                'text-field': ['get', 'name'],
                'text-allow-overlap': true,
              },
            });
          }
          else if(type === 6){
            // 加载全区派出所网格
            this.map.addLayer({
              id: 'qqpcs_branch',
              type: 'fill',
              filter: filter,
              paint: {
                'fill-color': 'rgba(20, 135, 71, 0.4)',
                //'fill-width': 3,
              },
              source: 'areamap',
              'source-layer': 'area',
            });
            this.map.addLayer({
              id: 'qqpcs_branch_border',
              type: 'line',
              filter: filter,
              paint: {
                'line-color': 'rgba(20, 135, 71, 0.4)',
                'line-width': 3,
              },
              source: 'areamap',
              'source-layer': 'area',
            })
            // 网格标注
            this.map.addLayer({
              id: 'qqpcs_branch_name',
              type: 'symbol',
              source: 'areamap',
              filter: filter,
              paint: {
                'text-color': '#fff',
                'text-halo-color': '#148747',
                'text-halo-width': 2,
              },
              'source-layer': 'area_name',
              layout: {
                'text-justify': 'center',
                'text-field': ['get', 'name'],
                'text-allow-overlap': true,
              },
            });
          }
          else{
            // 加载派出所网格边框
            this.map.addLayer({
              id: 'pcs_branch_border',
              type: 'line',
              filter: ['==', 'rela_id', filter[2].substring(0,8) + '0000'],
              paint: {
                'line-color': 'red',
                'line-width': 3,
              },
              source: 'areamap',
              'source-layer': 'area',
            })
            this.map.addLayer({
              id: 'pcs_branch_name',
              type: 'symbol',
              source: 'areamap',
              filter:  ['==', 'rela_id', filter[2].substring(0,8) + '0000'],
              paint: {
                'text-color': '#fff',
                'text-halo-color': 'red',
                'text-halo-width': 2,
              },
              'source-layer': 'area_name',
              layout: {
                'text-justify': 'center',
                'text-field': ['get', 'name'],
                'text-allow-overlap': true,
              },
            });
            // 责任区-不清空派出所网格
            if(bbox && bbox.length > 0){
              this.map.fitBounds(bbox, {
                padding: 100
              });
            }
          }
        },
        // 清空派出所下责任区网格
        handleClearZrqWmsLayer(){
          // 清空派出所下的责任区网格
          let zrqwmsArry = this.map.getStyle().layers.filter(e => e.id.indexOf('zrq_branch_border') !== -1 || e.id.indexOf('zrq_branch_name') !== -1 || e.id.indexOf('zrq_branch') !== -1)
          console.log(zrqwmsArry)
          zrqwmsArry.forEach(e => {
            if (this.map.getLayer(e.id)) this.map.removeLayer(e.id);
          })
        },
        // 开始绘制
        handleDrawing(mode) {
          this.currentDrawingMode = mode;
          if(mode === 'drag'){
            this.drawExample.trash();
          }
          else if(mode === 'marker'){
            this.drawExample.changeMode(this.drawExample.modes.DRAW_POINT);
          }
          else if (mode === 'circle'){
            this.drawExample.changeMode(this.drawExample.modes.DRAG_CIRCLE);
          }
          else if (mode === 'rectangle'){
            this.drawExample.changeMode(this.drawExample.modes.DRAW_RECTANGLE);
          }
          else if (mode === 'polygon'){
            this.drawExample.changeMode(this.drawExample.modes.DRAW_POLYGON);
          }
          else if(mode === 'dellast') {
            // 删除最后一个绘制的多边形
            const features = this.drawExample.getAll().features;
            if (features.length > 0) {
              this.drawExample.delete(features[features.length - 1].id);
            } else {
              console.warn('暂无标绘');
            }
          }
          else if(mode === 'delprve') {
            // 删除上一个绘制的多边形
            const features = this.drawExample.getAll().features;
            if (features.length > 1) {
              this.drawExample.delete(features[0].id);
            } else {
              console.warn('暂无标绘');
            }
          }
          else if(mode === 'delall') {
            // 删除所有绘制的多边形
            this.drawExample.deleteAll();
            this.$emit('currentDeleteAllDraw');
          }
        },
        // 绘制点时，清空绘制的上一个点
        drawDeleteDarwMarker(){
          console.log("清空上一个绘制覆盖物");
          let features = this.drawExample.getAll().features;
          features.forEach((e, index) => {
            this.drawExample.delete(features[index].id);
          })
        },
        // 设置网格信息窗体
        OpenWmsLayerInfo(popover, lngLat){
          let popups = document.getElementsByClassName("popup");
          if(popups[0]) popups[0].remove();
          new SFMap.Popup()
            .setLngLat(lngLat)
            .setHTML('<div id="popup" class="popup">' +
              ' <a href="#" id="popup-closer" class="popup-closer" onclick="closePopup()"></a>' +
              '   <div id="popup-content">'+popover +
              '</div>' +
              '</div>')
            .addTo(this.map);
        },
        // 关闭信息窗体
        handleClosePopup(){
          let popover = document.getElementsByClassName('mapboxgl-popup');
          if(popover && popover.length > 0){
            for(let i = 0;i < popover.length;i++){
              popover[i].style.display = 'none';
            }
          }
        },
        // 关闭右键菜单
        handleClooseRightMenu(){
          if(this.map.hasControl(this.rightMenuPoint)){
            this.map.removeControl(this.rightMenuPoint)
          }
        },
        // 设置圆
        setCircle(){
          if(this.map.getSource('circle-data')){
            this.map.getSource('circle-data').setData(
              {
                'type': 'FeatureCollection',
                'features': [
                  {
                    'type': 'Feature',
                    'properties': {
                      'name': 'red'
                    },
                    'geometry': {
                      'type': 'Point',
                      'coordinates': [ this.currentCirclePath.lng, this.currentCirclePath.lat ]
                    }
                  }
                ]
              }
            );
          }else{
            this.map.addSource('circle-data', {
              'type': 'geojson',
              'data': {
                'type': 'FeatureCollection',
                'features': [
                  {
                    'type': 'Feature',
                    'properties': {
                      'name': 'red'
                    },
                    'geometry': {
                      'type': 'Point',
                      'coordinates': [ this.currentCirclePath.lng, this.currentCirclePath.lat ]
                    }
                  }
                ]
              }
            });
          }
          // 指定单位半径的圆
          let maxRadius = this.currentCirclePath.radius / (78271.484 / 2 ** this.map.getMaxZoom()) / Math.cos(this.currentCirclePath.lat * Math.PI / 180);
         if(this.map.getLayer('circlelayer')) this.map.removeLayer('circlelayer');
          this.map.addLayer({
            'id': 'circlelayer',
            'type': 'circle',
            'source': 'circle-data',
            'paint': {
              "circle-radius": {
                base: 2,
                stops: [
                  [0, 0],
                  [this.map.getMaxZoom(), maxRadius]
                ]
              },
              'circle-color': 'rgba(255, 0, 0, .2)'
            }
          });
          // 获取根据圆算正方形的左上角
          let leftTopLngLat= this.getRandLngLat(this.currentCirclePath.lng, this.currentCirclePath.lat, -45, this.currentCirclePath.radius);
          // 获取根据圆算正方形的右下角
          let rightBottomLngLat= this.getRandLngLat(this.currentCirclePath.lng, this.currentCirclePath.lat, 135, this.currentCirclePath.radius);

          let bbox = [leftTopLngLat.longitude,leftTopLngLat.latitude+0.0005,rightBottomLngLat.longitude,rightBottomLngLat.latitude - 0.0005]
          this.map.fitBounds(bbox, {
            padding: 10
          });
        },
        getRandLngLat(lng, lat, angle, distance) {
          // # 地球半径 KM
          let raidus = 6371000;
          let latitude1 = lat * (Math.PI / 180);
          let longitude1 = lng * (Math.PI / 180);
          let brng = angle * (Math.PI / 180);
          let latitude2 = Math.asin(Math.sin(latitude1) * Math.cos(distance / raidus) + Math.cos(latitude1) *
            Math.sin(distance / raidus) * Math.cos(brng));
          let longitude2 = longitude1 + Math.atan2(Math.sin(brng) * Math.sin(distance / raidus) * Math.cos(
            latitude1), Math.cos(distance / raidus) - Math.sin(latitude1) * Math.sin(latitude2));
          latitude2 = latitude2 * (180 / Math.PI);
          longitude2 = longitude2 * (180 / Math.PI);
          return {
            latitude: latitude2,
            longitude: longitude2,
          }
        },
        // 设置折线
        setPolyline() {
          let _this = this;
          let coordinates = [];
          _this.currentPolylinePath.forEach(e => {
            coordinates.push([e.lng, e.lat]);
          })
          setTimeout(() => {
            if(coordinates.length > 1){
              if(this.map.getSource('route')) {
                _this.map.getSource('route').setData( {
                  'type': 'Feature',
                  'properties': {},
                  'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                  }
                });
              }else{
                _this.map.addSource('route', {
                  'type': 'geojson',
                  'data': {
                    'type': 'Feature',
                    'properties': {},
                    'geometry': {
                      'type': 'LineString',
                      'coordinates': coordinates
                    }
                  }
                });
              }
              if(_this.map.getLayer('linelayer')) _this.map.removeLayer('linelayer');
              _this.map.addLayer({
                'id': 'linelayer',
                'type': 'line',
                'source': 'route',
                'layout': {
                  'line-join': 'round',
                  'line-cap': 'round'
                },
                'paint': {
                  'line-color':  _this.currentPolylineColor,
                  'line-width': 2
                }
              });
            }
          },1000)
        },
        //  清空地图中的marker
        clearMarkers(){
          if(this.map && this.map._markers &&　this.map._markers.length > 0){
            for(let i = this.map._markers.length -1;i >= 0 ;i --){
              this.map._markers[i].remove();
            }
          }
        },
        // 设置多边形
        setPolygon(flag){
          // flag:标识是否切换影像调用1
          let _this = this;
          // 清空之前加载过的多边形
          if(this.map.getLayer('polygonLayer')) this.map.removeLayer('polygonLayer')
          if(this.map.getLayer('polygonline')) this.map.removeLayer('polygonline')
          console.log(222222222)
          console.log(this.currentPolygonPath)
          if(this.currentPolygonPath.length > 0){
            // 定义多边形面的数据源
            let geojson = {
              type: 'FeatureCollection',
              features: []
            }
            // 定义多边形边框的数据源
            let geojsonLine = {
              type: 'FeatureCollection',
              features: []
            }
            if(this.currentPolygonFlag === 'layer'){
              this.currentPolygonPath.forEach((e, index) => {
                let arry = [];
                e.forEach(f => {
                  arry.push([f.lng,f.lat])
                })
                arry.push(arry[0])
                geojson.features.push(
                  {
                    type: "Feature",
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        arry
                      ]
                    }
                  }
                );
                geojsonLine.features.push(
                  {
                    type: "Feature",
                    geometry: {
                      type: 'LineString',
                      coordinates: arry
                    }
                  }
                );
                // 设置多边形文本标注
                // if(this.currentPolygonLabelTarget.length > 0){
                //   this.setGraphicLabel(e, index);
                // }
              });
              if(this.drawExample && this.drawExample.draw && flag !== 1){
                this.drawExample.draw.deleteAll();
              }
              if(this.map.getSource('maine')) {
                this.map.getSource('maine').setData(geojson);
              }else{
                this.map.addSource('maine', {
                  'type': 'geojson',
                  'data': geojson
                });
              }
              if(this.map.getSource('maineLine')) {
                this.map.getSource('maineLine').setData(geojson);
              }else{
                this.map.addSource('maineLine', {
                  'type': 'geojson',
                  'data': geojsonLine
                });
              }
              let stops = [];
              this.currentPolygonColor.forEach((e, indexcolor) => {
                stops.push([indexcolor, e]);
              })
              // 添加多边形面图层
              this.map.addLayer({
                'id': 'polygonLayer',
                'type': 'fill',
                'source': 'maine',
                'paint': {
                  "fill-color": '#ff0000',
                  "fill-opacity": 0.2,
                  // "fill-color": {
                  //   'property': 'lv',
                  //   'stops': stops
                  // },
                }
              });
              this.map.addLayer({
                'id': 'polygonline',
                'type': 'line',
                'source': 'maineLine',
                'paint': {
                  "line-color" : "#FF0000",
                  "line-width": 2,
                  // "line-color": {
                  //   'property': 'lv',
                  //   'stops': stops
                  // },
                }
              });
              if (this.map.getLayer('point') && this.map.getLayer('polygonLayer')) {
                this.map.moveLayer('polygonLayer', 'point')
                this.map.moveLayer('polygonline', 'point')
              }
            }
            else{
              this.currentPolygonPath.forEach((e, index) => {
                let arry = [];
                e.forEach(f => {
                  arry.push([f.lng,f.lat])
                })
                if(arry.length > 0){
                  geojson.features.push(
                    {
                      type: "Feature",
                      properties: {
                        lv: index
                      },
                      geometry: {
                        type: 'Polygon',
                        coordinates: [
                          arry
                        ]
                      }
                    }
                  );
                  geojsonLine.features.push(
                    {
                      type: "Feature",
                      properties: {
                        lv: index
                      },
                      geometry: {
                        type: 'LineString',
                        coordinates: arry
                      }
                    }
                  );
                }
              });
              if(this.drawExample){
                this.drawExample.set(geojson);
              }
              else{
                setTimeout(()=> {
                  this.drawExample.set(geojson);
                },1000)
              }
            }
            // 最佳视野展示多边形
            let bounds = bbox(geojson);
            this.map.fitBounds([[bounds[0], bounds[1]], [bounds[2], bounds[3]]], { animate: true, padding: 100 });
          }else {
            if(this.drawExample && this.drawExample.draw){
              this.drawExample.draw.deleteAll();
            }
            // 清空之前加载过的多边形
            if(this.map.getLayer('polygonLayer')) this.map.removeLayer('polygonLayer')
            if(this.map.getLayer('polygonline')) this.map.removeLayer('polygonline')
            // 清空之前加载过的多边形label
            // if (this.map && this.polygonMarkers.length !== 0) {
            //   for (let i = 0; i < this.polygonMarkers.length; i++) {
            //     this.polygonMarkers[i].remove();
            //   }
            // }
          }

        },
        // 计算凸集
        getGraham(){

        }
      }
    }
</script>

<style lang="scss" scoped>
  body { margin: 0; padding: 0; }
  #map { position: absolute; top: 0; bottom: 0; width: 100%; }
  ::v-deep .rightmenu-body{
    background-color: #fff !important;
  }
  ::v-deep .rightmenu-item {
    white-space: nowrap !important;
    //width: 120px !important;
    height: 35px !important;
    line-height: 35px !important;
    margin-top: 3px !important;
    font-size: 14px;
    padding: 0 10px;
    background-color: #fff !important;
  }
  ::v-deep  .rightmenu-item:hover {
    color: #fff !important;
    background-color: #0B61AA !important;
  }

  ::v-deep .mapboxgl-popup {
    ::v-deep .mapboxgl-popup-tip {
      border:0;
    }
    ::v-deep .mapboxgl-popup-content {
      background: transparent;
      ::v-deep .popup {
        position: absolute;
        background-color: transparent;
        //box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
       // border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
        color: #fff;
        background-image: url("src/shapes/poverBg.png");
        background-size: 100% 100%;
      }
      .popup:after, .popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .popup-closer {
        text-decoration: none;
        position: absolute;
        top: 15px;
        right: 10px;
      }
      .popup-closer:after {
        content: "✖";
      }
    }
  }
  ::v-deep .mapboxgl-popup-tip {
    border:0;
  }
  ::v-deep .mapboxgl-popup-content {
    background: transparent;
  }
  ::v-deep .popup {
    position: absolute;
    background-color: transparent;
    //box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    padding: 15px;
    // border: 1px solid #cccccc;
    bottom: 12px;
    left: -50px;
    min-width: 280px;
    color: #fff;
    background-image: url("src/shapes/poverBg.png");
    background-size: 100% 100%;
  }
  .popup:after, .popup:before {
    top: 100%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
  }
  .popup:after {
    border-top-color: white;
    border-width: 10px;
    left: 48px;
    margin-left: -10px;
  }
  .popup:before {
    border-top-color: #cccccc;
    border-width: 11px;
    left: 48px;
    margin-left: -11px;
  }
  .popup-closer {
    text-decoration: none;
    position: absolute;
    top: 15px;
    right: 10px;
  }
  .popup-closer:after {
    content: "✖";
  }
  .marker-label {
    color:#fff;
    text-align:center;
    margin-top: -25px;
    padding: 2px 5px;
  }

  /*绘制工具*/
  .sfmap_drawging_panel {
    position: absolute;
    top: 10px;
    right: 180px;
    display: flex;
    font-size: 17px;
    padding: 5px 0;
    color: #4c4c4c;
    background-color: #fff;
    box-sizing: border-box;
    -webkit-box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
    box-shadow: 1px 2px 1px rgba(0, 0, 0, 0.15);
    border-radius: 2px;
    div {
      padding: 2px 8px;
      border-right: 1px solid #ccc;
      cursor: pointer;
      &:last-child {
        border: 0;
      }
      i {
        margin-right: 3px;
      }
    }
    .activePanel {
      color: #579afc;
    }
  }

</style>
