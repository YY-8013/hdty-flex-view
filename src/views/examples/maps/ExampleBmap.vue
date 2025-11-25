<template>
  <div class="hdty-container">
    <el-tabs v-model="activeTab" fill>
      <el-tab-pane label="点/线/面/圆绘制示例" name="draw">
        <div class="hdty-fluid" fill>
          <div class="hdty-row hdty-col-space16" fill>
            <div class="hdty-col-md6">
              <div class="hdty-column">
                <div class="hdty-card" fill>
                  <div class="hdty-card-header">
                    <h5 class="hdty-card-title">
                      图形绘制
                    </h5>
                  </div>
                  <div class="hdty-card-body">
                    <hd-map-baidu
                      ref="mapDrawRef"
                      :clusterer="false"
                      :markers.sync="markers"
                      :polyline-color.sync="polylineColor"
                      :polyline-path.sync="polylinePath"
                      :circle-color.sync="circleColor"
                      :circle-path.sync="circlePath"
                      :polygon-color.sync="polygonColor"
                      :polygon-path.sync="polygonPath"
                      icon="b1"
                      :marker="true"
                      :polyline="true"
                      :circle="true"
                      :polygon="true"
                      :drawing-mode.sync="drawingMode"
                      :drawing-tool="true"
                      :drawing-can-edit="true"
                      :limit="5"
                      :marker-limit="1"
                      :polyline-limit="2"
                      :circle-limit="3"
                      :polygon-limit="4"
                      :keyword-search="false"
                      :color-picker="true"
                      :enable-map-click="false"
                      @currentMarkerChanged="handleMarkerChange"
                      @currentPolylineChanged="handlePolylineChange"
                      @currentCircleChanged="handleCircleChange"
                      @currentPolygonChanged="handlePolygonChange"
                      @currentDrawingModeChanged="handleDrawingModeChange">
                      <div class="hdty-map-tips">
                        <i class="icon-remind-o"></i>
                        小提示:单击确认起点或绘制下一个点，双击完成绘制
                      </div>
                    </hd-map-baidu>
                  </div>
                </div>
              </div>
            </div>
            <div class="hdty-col-md6">
              <div class="hdty-column">
                <div class="hdty-card" fill>
                  <div class="hdty-card-header">
                    <h5 class="hdty-card-title">
                      双向绑定
                    </h5>
                  </div>
                  <div class="hdty-card-body">
                    <hd-map-baidu
                      ref="mapBindRef"
                      :clusterer="true"
                      :markers="markers"
                      :polyline-color="polylineColor"
                      :polyline-path="polylinePath"
                      :circle-color="circleColor"
                      :circle-path="circlePath"
                      :polygon-color="polygonColor"
                      :polygon-path="polygonPath">
                    </hd-map-baidu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="点/线/面/圆添加示例" name="add">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapAddRef"
            :clusterer="addClusterer"
            :marker-auto-view="true"
            :markers="addMarkers"
            :polyline-color="addPolylineColor"
            :polyline-auto-view="true"
            :polyline-path="addPolylinePath"
            :circle-color="addCircleColor"
            :circle-label="addCircleLabel"
            :circle-popover="addCirclePopover"
            :circle-auto-view="true"
            :circle-path="addCirclePath"
            :polygon-color="addPolygonColor"
            :polygon-label="addPolygonLabel"
            :polygon-label-trigger="addPolygonLabelTrigger"
            :polygon-popover="addPolygonPopover"
            :polygon-auto-view="true"
            :polygon-path="addPolygonPath"
            @currentLocalCity="handleLocalCity"
            @currentClick="handleMapClick"
            @currentDblclick="handleMapDblclick"
            @currentMovestart="handleMapMovestart"
            @currentMoveend="handleMapMoveend"
            @currentZoomstart="handleMapZoomstart"
            @currentZoomend="handleMapZoomend"
            @currentDragstart="handleMapDragstart"
            @currentDragend="handleMapDragend"
            @currentViewstart="handleMapViewstart"
            @currentViewend="handleMapViewend"
            @currentLoaded="handleMapLoaded"
            @currentMarkerComplete="handleMarkerComplete"
            @currentPolylineComplete="handlePolylineComplete"
            @currentCircleComplete="handleCircleComplete"
            @currentPolygonComplete="handlePolygonComplete"
            @markerPopoverOpen="handleMarkerPopoverOpen"
            @markerClick="hanleMarkerClick"
            @markerDblclick="handleMarkerDblclick"
            @markerContextmenu1="hanleMarkerContextmenu1"
            @markerContextmenu2="hanleMarkerContextmenu2"
            @currentCirclePopoverOpened="handleCirclePopoverOpen"
            @currentPolygonPopoverOpened="handlePolygonPopoverOpen">
            <div class="hdty-btn-group">
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="addClusterer = !addClusterer">
                {{ !addClusterer ? '开启' : '关闭' }}点聚合
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="handleResetBestView">
                恢复最佳视野
              </button>
            </div>
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="点/线/面/圆编辑示例" name="edit">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapEditRef"
            :markers.sync="editMarkers"
            :polyline-color.sync="editPolylineColor"
            :polyline-path.sync="editPolylinePath"
            :polyline-editing="true"
            polyline-editing-trigger="click"
            :circle-color.sync="editCircleColor"
            :circle-path.sync="editCirclePath"
            :circle-editing="true"
            circle-editing-trigger="click"
            :polygon-color.sync="editPolygonColor"
            :polygon-path.sync="editPolygonPath"
            :polygon-editing="true"
            polygon-editing-trigger="click"
            :color-picker="true"
            @currentMarkerDragend="handleMarkerDragend"
            @currentMarkerChanged="handleMarkerChange"
            @currentPolylineChanged="handlePolylineChange"
            @currentCircleChanged="handleCircleChange"
            @currentPolygonChanged="handlePolygonChange">
            <div class="hdty-map-tips">
              <i class="icon-remind-o"></i>
              小提示:多个图层时，点击要操作的图层开启编辑模式
            </div>
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="路线规划/路书示例" name="route">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapRouteRef"
            :markers="connectionPlayMarkers"
            :connection="true"
            :connection-play="true"
            :connection-play-options="connectionPlayOptions"
            :polyline-path="polylinePlayPath"
            :polyline-play="true"
            :driving-route-path="drivingRoutePath"
            :driving-route-play="true"
            @currentDrivingRouteChanged="handleDrivingRouteChanged">
            <div class="hdty-map-tips">
              <i class="icon-remind-o"></i>
              小提示:右键点击路书图层可控制播放/暂停/结束
            </div>
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="个性化搜索示例" name="search">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapSearchRef"
            :location="true"
            :map-type="false"
            :geolocation="false"
            :city-list="true"
            :keyword-search="true"
            :keyword-auto="true"
            :keyword-shop="true"
            :keyword-filter="true"
            :keyword-filter-shop-options="keywordFilterShopOptions"
            :custom-keyword-search="true"
            :custom-keyword-auto="true"
            :custom-keyword-search-result="customKeywordSearchResult"
            :custom-keyword-search-result-total="customKeywordSearchResultTotal"
            :custom-city-list-search-result="customCityListSearchResult"
            :custom-keyword-auto-result="customKeywordAutoResult"
            keyword-search-placeholder="自定义搜索框水印"
            :show-keyword-search-control-button="true"
            @currentPosition="handlePosition"
            @currentKeywordSearchClick="handleKeywordSearchClick"
            @currentKeywordSearchCurrentChanged="handleKeywordSearchCurrentChange"
            @currentKeywordSearchInput="handleKeywordSearchInput"
            @currentCityListSearchItemClick="handleCityListSearchItemClick"
            @currentKeywordSearchItemClick="handleKeywordSearchItemClick"
            @currentKeywordSearchClear="handleKeywordSearchClear"
            @currentKeywordSearchPoiClick="handleKeywordSearchPoiClick"
            @currentKeywordSearchPoiOpen="handleKeywordSearchPoiOpen"
            @currentKeywordSearchComplete="handleKeywordSearchComplete"
            @currentCityListSearchComplete="handleCityListSearchComplete">
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="行政区边界示例" name="boundary">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapBoundaryRef"
            :boundary="boundary"
            :boundary-weight="boundaryWeight"
            :boundary-style="boundaryStyle"
            :boundary-color="boundaryColor"
            :boundary-fill-color="boundaryFillColor"
            :boundary-stroke-weight="boundaryStrokeWeight"
            :boundary-stroke-color="boundaryStrokeColor"
            :boundary-highlight="boundaryHighlight"
            :boundary-highlight-color="boundaryHighlightColor"
            :boundary-fill-highlight-color="boundaryFillHighlightColor"
            :boundary-current-name="boundaryCurrentName"
            :boundary-modal="boundaryModal"
            :boundary-modal-color="boundaryModalColor"
            :boundary-modal-hover-hide="boundaryModalHoverHide"
            :show-boundary-city="showBoundaryCity"
            :boundary-name="boundaryName"
            :boundary-kind="boundaryKind"
            :enable-boundary-api="true"
            @currentBoundaryCityClick="handleBoundaryCityClick"
            @currentBoundaryComplete="handleBoundaryComplete">
            <div class="hdty-btn-group">
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="boundary = !boundary">
                {{ !boundary ? '显示' : '隐藏' }}行政区边界
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="boundaryModal = !boundaryModal">
                {{ !boundaryModal ? '显示' : '隐藏' }}行政区边界遮罩层
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="showBoundaryCity = !showBoundaryCity">
                {{ !showBoundaryCity ? '显示' : '隐藏' }}行政区边界城市中心点
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="boundaryHighlight = !boundaryHighlight">
                {{ !boundaryHighlight ? '开启' : '关闭' }}高亮当前选择行政区
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="boundaryModalHoverHide = !boundaryModalHoverHide">
                {{ !boundaryModalHoverHide ? '开启' : '关闭' }}行政区边界遮罩层鼠标移入消失
              </button>
            </div>
            <div class="hdty-card">
              <div class="hdty-card-body">
                <div class="hdty-form-item">
                  显示地区
                  <hd-region
                    v-model="boundaryRegionId"
                    :model-text.sync="boundaryName"
                    size="small"
                    style="width: 180px;">
                  </hd-region>
                </div>
                <div class="hdty-form-item">
                  显示层级
                  <hd-build-select
                    :data="[
                    {
                      key: '1',
                      value: '省级行政区'
                    }, {
                      key: '2',
                      value: '市级行政区'
                    }, {
                      key: '3',
                      value: '区/县级行政区'
                    }
                  ]"
                    v-model="boundaryKind"
                    :model-text.sync="boundaryKindText"
                    size="small"
                    style="width: 180px;">
                  </hd-build-select>
                </div>
                <div class="hdty-form-item">
                  高亮地区
                  <hd-region
                    v-model="boundaryCurrentRegionId"
                    :model-text.sync="boundaryCurrentName"
                    size="small"
                    style="width: 180px;">
                  </hd-region>
                </div>
              </div>
            </div>
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="热力图示例" name="heat">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapHeatRef"
            :markers="heatMapMarkers"
            :clusterer="false"
            :heatmap="heatmap"
            :gradient="heatmapGradient"
            :show-marker="showHeatMapMarker">
            <div class="hdty-btn-group">
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="heatmap = !heatmap">
                {{ !heatmap ? '显示' : '隐藏' }}热力图
              </button>
              <button
                type="button"
                class="hdty-btn hdty-btn-primary"
                @click="showHeatMapMarker = !showHeatMapMarker">
                {{ !showHeatMapMarker ? '显示' : '隐藏' }}坐标点
              </button>
            </div>
          </hd-map-baidu>
        </div>
      </el-tab-pane>
      <el-tab-pane label="自定义图层示例" name="layer">
        <div class="hdty-fill">
          <hd-map-baidu
            ref="mapLayerRef"
            :tile-layer="true"
            :tile-layer-continuous="false"
            @currentTileUrl="handleTileUrl">
          </hd-map-baidu>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import tileImage from './images/tile.png';
  export default {
    name: "ExampleBmap",
    data() {
      return {
        // 选中标签页
        activeTab: 'draw',
        // 绘制模式
        drawingMode: 'polygon',
        // 点坐标
        markers: [],
        // 折线路径颜色
        polylineColor: [],
        // 折线路径坐标
        polylinePath: [],
        // 圆路径颜色
        circleColor: [],
        // 圆路径坐标
        circlePath: [],
        // 多边形颜色
        polygonColor: [],
        // 多边形路径坐标
        polygonPath: [],
        // 开启添加点聚合
        addClusterer: true,
        // 添加点坐标
        addMarkers: [
          {
            lng: 111.833126,
            lat: 40.860645,
            icon: 'b15',
            title: '点击可查看详情',
            label: '这是一个总是显示的点标签',
            popover: '<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">点信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个点信息窗口</div></div>',
            onclick: 'markerClick',
            ondblclick: 'markerDblclick',
            contextmenu: ['功能1', '功能2'],
            oncontextmenu: ['markerContextmenu1', 'markerContextmenu2']
          }, {
            lng: 111.671574,
            lat: 40.834886,
            icon: 'b11',
            title: '点击可查看详情',
            label: '这是一个鼠标滑入显示的点标签',
            labelTrigger: 'hover',
            popover: '<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">点信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个点信息窗口</div></div>',
            onopen: 'markerPopoverOpen',
            onclick: 'markerClick',
            ondblclick: 'markerDblclick',
            contextmenu: ['功能1', '功能2'],
            oncontextmenu: ['markerContextmenu1', 'markerContextmenu2']
          }
        ],
        // 添加折线路径颜色
        addPolylineColor: ['#0000ff'],
        // 添加折线路径坐标
        addPolylinePath: [
          {
            lng: 111.637329,
            lat: 40.868738
          }, {
            lng: 111.726441,
            lat: 40.869175
          }, {
            lng: 111.727016,
            lat: 40.909316
          }, {
            lng: 111.848898,
            lat: 40.908007
          }
        ],
        // 添加圆颜色
        addCircleColor: ['#ff0000'],
        // 添加圆标签
        addCircleLabel: [
          '这是一个总是显示的圆标签',
        ],
        // 添加圆信息窗口
        addCirclePopover: [
          '<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">圆信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个圆信息窗口</div></div>'
        ],
        // 添加圆路径坐标
        addCirclePath: [
          {
            lng: 111.793419,
            lat: 40.809791,
            radius: 2124.6217253132068
          }
        ],
        // 添加多边形颜色
        addPolygonColor: ['#ff0000', '#00ff00'],
        // 添加多边形标签
        addPolygonLabel: ['这是一个总是显示的多边形标签', '这个一个鼠标滑入显示的边形标签'],
        // 添加多边形标签触发方式
        addPolygonLabelTrigger: ['always', 'hover'],
        // 添加多边形信息窗口
        addPolygonPopover: [
          '<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">多边形信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个多边形信息窗口</div></div>',
          '<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">多边形信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个多边形信息窗口</div></div>'
        ],
        // 添加多边形路径坐标
        addPolygonPath: [
          [{
            lng: 111.855222,
            lat: 40.830319
          }, {
            lng: 111.750013,
            lat: 40.830319
          }, {
            lng: 111.750013,
            lat: 40.89492
          }, {
            lng: 111.855222,
            lat: 40.89492
          }], [{
            lng: 111.750013,
            lat: 40.862191
          }, {
            lng: 111.649403,
            lat: 40.862191
          }, {
            lng: 111.649403,
            lat: 40.796247
          }, {
            lng: 111.750013,
            lat: 40.796247
          }]
        ],
        // 编辑点坐标
        editMarkers: [
          {
            lng: 111.833126,
            lat: 40.860645,
            icon: 'b1',
            dragging: true
          }, {
            lng: 111.671574,
            lat: 40.834886,
            icon: 'b1',
            dragging: true
          }
        ],
        // 编辑折线路径颜色
        editPolylineColor: [],
        // 编辑折线路径坐标
        editPolylinePath: [
          [{
            lng: 111.730466,
            lat: 40.990831
          }, {
            lng: 111.963306,
            lat: 40.98996
          }, {
            lng: 111.961582,
            lat: 40.822021
          }], [{
            lng: 111.478078,
            lat: 40.83294
          }, {
            lng: 111.478653,
            lat: 40.714928
          }, {
            lng: 111.643078,
            lat: 40.715365
          }]
        ],
        // 编辑圆路径颜色
        editCircleColor: [],
        // 编辑圆路径坐标
        editCirclePath: [
          {
            lng: 111.755187,
            lat: 40.921964,
            radius: 3937.257685825915
          }, {
            lng: 111.76956,
            lat: 40.759972,
            radius: 5785.573863695895
          }
        ],
        // 编辑多边形路径颜色
        editPolygonColor: [],
        // 编辑多边形路径坐标
        editPolygonPath: [
          [{
            lng: 111.648883,
            lat: 40.886342
          }, {
            lng: 111.866776,
            lat: 40.886342
          }, {
            lng: 111.866776,
            lat: 40.812997
          }, {
            lng: 111.648883,
            lat: 40.812997
          }], [{
            lng: 111.557991,
            lat: 40.935481
          }, {
            lng: 111.699995,
            lat: 40.935481
          }, {
            lng: 111.699995,
            lat: 40.764781
          }, {
            lng: 111.557991,
            lat: 40.764781
          }]
        ],
        // 点连线轨迹运动路径坐标
        connectionPlayMarkers: [
          {
            lng: 111.833126,
            lat: 40.860645,
            icon: 'b2'
          }, {
            lng: 111.671574,
            lat: 40.834886,
            icon: 'b1'
          }
        ],
        // 点连线轨迹运动配置
        connectionPlayOptions: {
          icon: 'd5',
          html: '正在行驶中',
          landmark: [{
            lng: 111.833126,
            lat: 40.860645,
            html: '从呼和浩特白塔国际机场出发'
          }, {
            lng: 111.671574,
            lat: 40.834886,
            html: '到达呼和浩特火车站'
          }]
        },
        // 折线轨迹运动路径坐标
        polylinePlayPath: [
          {
            lng: 111.637329,
            lat: 40.868738
          }, {
            lng: 111.726441,
            lat: 40.869175
          }, {
            lng: 111.727016,
            lat: 40.909316
          }, {
            lng: 111.848898,
            lat: 40.908007
          }
        ],
        // 驾车路径规划坐标
        drivingRoutePath: {
          start: {
            lng: 111.842741,
            lat: 40.93643
          },
          end: {
            lng: 111.6549,
            lat: 40.765583
          },
          ways: [{
            lng: 111.626784,
            lat: 40.880738
          }, {
            lng: 111.600227,
            lat: 40.810065
          }]
        },
        // 自定义关键字检索过滤功能配置项
        keywordFilterShopOptions: [
          {
            shop: 'company',
            name: '搜企业',
            keyword: '企业',
            icon: 'icon-building',
            color: '#ee905b',
            filters: [
              {
                type: 'select',
                field: 'industryType',
                dict: '015',
                multiple: true,
                placeholder: '行业类型'
              },
              {
                type: 'select',
                field: 'companyState',
                dict: '020',
                multiple: true,
                placeholder: '企业状态'
              },
              {
                type: 'dateRangePicker',
                field: 'regDate',
                placeholder: '注册日期'
              }
            ]
          },
          {
            shop: 'person',
            name: '查人员',
            keyword: '人员',
            icon: 'icon-three-people-o',
            color: '#a3c05e',
            filters: [
              {
                type: 'select',
                field: 'gender',
                dict: '001',
                placeholder: '性别'
              },
              {
                type: 'select',
                field: 'nation',
                dict: '002',
                placeholder: '民族'
              },
              {
                type: 'dateRangePicker',
                field: 'birthday',
                placeholder: '出生日期'
              }
            ]
          },
          {
            shop: 'car',
            name: '找车辆',
            keyword: '车辆',
            icon: 'icon-car',
            color: '#49a6db',
            filters: [
              {
                type: 'select',
                field: 'carColor',
                dict: '100',
                filterable: true,
                placeholder: '车辆颜色'
              },
              {
                type: 'select',
                field: 'carBrand',
                dict: '195',
                filterable: true,
                placeholder: '车辆品牌'
              }
            ]
          }
        ],
        // 自定义关键字检索结果
        customKeywordSearchResult: [],
        // 自定义关键字检索结果总条数
        customKeywordSearchResultTotal: 0,
        // 自定义关键字按城市列表检索结果
        customCityListSearchResult: [],
        // 自定义关键字联想结果
        customKeywordAutoResult: [],
        // 显示行政区边界
        boundary: true,
        // 行政区边界宽度
        boundaryWeight: 1,
        // 行政区边界样式（solid / dashed）
        boundaryStyle: 'solid',
        // 行政区边界颜色
        boundaryColor: '#006fff',
        // 行政区边界填充颜色
        boundaryFillColor: '#7cb6f1',
        // 行政区边界描边宽度
        boundaryStrokeWeight: 2,
        // 行政区边界描边颜色
        boundaryStrokeColor: '#006fff',
        // 是否高亮当前选择行政区
        boundaryHighlight: false,
        // 行政区边界高亮颜色
        boundaryHighlightColor: '#3c7fff',
        // 行政区边界填充高亮颜色
        boundaryFillHighlightColor: '#3c7fff',
        // 当前选择的行政区名称
        boundaryCurrentName: '',
        // 当前选择的行政区地区编号
        boundaryCurrentRegionId: '',
        // 是否显示行政区边界遮罩层
        boundaryModal: false,
        // 行政区边界遮罩层颜色
        boundaryModalColor: '#daeafa',
        // 行政区边界遮罩层是否鼠标移入消失
        boundaryModalHoverHide: false,
        // 是否显示行政区边界城市中心点
        showBoundaryCity: false,
        // 行政区名称
        boundaryName: '内蒙古自治区',
        // 行政区地区编号
        boundaryRegionId: '150000',
        // 行政区层级
        boundaryKind: 2,
        // 行政区级别名称
        boundaryKindText: '市级行政区',
        // 热力图点坐标
        heatMapMarkers: [
          {
            lng: 111.671574,
            lat: 40.834886,
            count: 100
          }, {
            lng: 111.821877,
            lat: 40.858481,
            count: 100
          }, {
            lng: 111.670674,
            lat: 40.832175,
            count: 95
          }, {
            lng: 111.66895,
            lat: 40.825079,
            count: 90
          }, {
            lng: 111.813253,
            lat: 40.858917,
            count: 90
          }, {
            lng: 111.686772,
            lat: 40.825079,
            count: 85
          }, {
            lng: 111.681023,
            lat: 40.827481,
            count: 80
          }, {
            lng: 111.683323,
            lat: 40.841673,
            count: 80
          }, {
            lng: 111.814978,
            lat: 40.84844,
            count: 80
          }, {
            lng: 111.817278,
            lat: 40.85106,
            count: 80
          }, {
            lng: 111.662051,
            lat: 40.83425,
            count: 75,
          }, {
            lng: 111.679873,
            lat: 40.847785,
            count: 70
          }, {
            lng: 111.679873,
            lat: 40.847785,
            count: 70
          }, {
            lng: 111.685047,
            lat: 40.840363,
            count: 65
          }, {
            lng: 111.833126,
            lat: 40.860645,
            count: 60
          }, {
            lng: 111.829351,
            lat: 40.856517,
            count: 55
          }, {
            lng: 111.794856,
            lat: 40.862628,
            count: 50
          }, {
            lng: 111.80233,
            lat: 40.851715,
            count: 45
          }, {
            lng: 111.679011,
            lat: 40.837088,
            count: 40
          }, {
            lng: 111.800605,
            lat: 40.859354,
            count: 35
          }
        ],
        // 显示热力图
        heatmap: true,
        // 热力图渐变区间
        heatmapGradient: {
          50: 'cyan',
          60: 'lime',
          90: 'yellow',
          100: 'red'
        },
        // 热力图上是否显示坐标点
        showHeatMapMarker: false
      }
    },
    created() {
      window.handleWinDetail = () => {
        console.log('点击信息窗口详情');
      };
    },
    methods: {
      // 点发生改变
      handleMarkerChange(val, locations) {
        console.log('点坐标：', val, locations);
      },
      // 折线路径发生改变
      handlePolylineChange(val) {
        console.log('折线路径：', val);
      },
      // 圆路径发生改变
      handleCircleChange(val) {
        console.log('圆路径：', val);
      },
      // 多边形路径发生改变
      handlePolygonChange(val) {
        console.log('多边形路径：', val);
      },
      // 绘制模式发生改变
      handleDrawingModeChange(val) {
        console.log('当前绘制模式', val);
      },
      // 城市定位
      handleLocalCity(val) {
        console.log('当前城市：', val);
      },
      // 地图发生单击
      handleMapClick(e, map) {
        console.log('地图单击：', e, map);
      },
      // 地图发生双击
      handleMapDblclick(e, map) {
        console.log('地图双击：', e, map);
      },
      // 地图移动开始时触发
      handleMapMovestart(center, map) {
        console.log('地图移动开始，中心点坐标：', center, map);
      },
      // 地图移动结束时触发
      handleMapMoveend(center, oldCenter, map) {
        console.log('地图移动结束，当前中心点坐标：', center, '上一次中心点坐标', oldCenter, map);
      },
      // 地图缩放开始时触发
      handleMapZoomstart(zoom, map) {
        console.log('地图缩放开始，缩放级别：', zoom, map);
      },
      // 地图缩放结束时触发
      handleMapZoomend(zoom, oldZoom, organLevel, map) {
        console.log('地图缩放结束，当前缩放级别：', zoom, '上一次缩放级别', oldZoom, '对应的机构级别', organLevel, map);
      },
      // 地图拖拽开始时触发
      handleMapDragstart(e, center, map) {
        console.log('地图拖拽开始：', e, '中心点坐标：', center, map);
      },
      // 地图拖拽结束时触发
      handleMapDragend(e, center, map) {
        console.log('地图拖拽结束：', e, '中心点坐标：', center, map);
      },
      // 地图视野调整开始时触发
      handleMapViewstart(view, map) {
        console.log('地图视野调整开始，视野：', view, map);
      },
      // 地图视野调整结束时触发
      handleMapViewend(view, oldView, map) {
        console.log('地图视野调整结束，当前视野：', view, '上一次视野：', oldView, map);
      },
      // 地图加载完成
      handleMapLoaded(map) {
        console.log('地图加载完成：', map);
      },
      // 标注点绘制完成
      handleMarkerComplete(val, e, map) {
        console.log('标注点绘制完成：', val, e, map);
      },
      // 折线绘制完成
      handlePolylineComplete(val, e, map) {
        console.log('折线绘制完成：', val, e, map);
      },
      // 圆绘制完成
      handleCircleComplete(val, e, map) {
        console.log('圆绘制完成：', val, e, map);
      },
      // 多边形绘制完成
      handlePolygonComplete(val, e, map) {
        console.log('多边形绘制完成：', val, e, map);
      },
      // 标注点信息窗口打开
      handleMarkerPopoverOpen(val, mk, e) {
        console.log('标注点信息窗口打开：', val, mk, e);
      },
      // 标注点发生点击
      hanleMarkerClick(val, mk, e) {
        console.log('标注点点击：', val, mk, e);
      },
      // 标注点发生双击
      handleMarkerDblclick(val, mk, e) {
        console.log('标注点双击：', val, mk, e);
      },
      // 标注点右键功能1发生点击
      hanleMarkerContextmenu1(val, mk) {
        console.log('标注点右键点击功能1：', val, mk);
      },
      // 标注点右键功能2发生点击
      hanleMarkerContextmenu2(val, mk) {
        console.log('标注点右键点击功能2：', val, mk);
      },
      // 圆信息窗口打开
      handleCirclePopoverOpen(val, i, e) {
        console.log('圆信息窗口打开：', val, i, e);
      },
      // 多边形信息窗口打开
      handlePolygonPopoverOpen(val, i, e) {
        console.log('多边形信息窗口打开：', val, i, e);
      },
      // 恢复地图最佳视野
      handleResetBestView() {
        this.$refs.mapAddRef.resetBestView();
      },
      // 标注点拖拽结束
      handleMarkerDragend(val, mk, e) {
        console.log('标注点拖拽结束：', val, mk, e);
      },
      // 驾车路线规划发生改变
      handleDrivingRouteChanged(val) {
        console.log('驾车路线规划：', val);
      },
      // 位置定位
      handlePosition(val) {
        console.log('当前位置：', val);
      },
      // 关键字检索按钮发生点击
      handleKeywordSearchClick(val, status, trigger) {
        console.log('检索按钮点击：', val, status, trigger);
        // 如果有按城市列表检索结果项
        if(status === BMAP_STATUS_SUCCESS) {
          this.customKeywordSearchResultTotal = 100;
          this.customKeywordSearchResult = [
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.769327, lat: 40.931488 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.717494, lat: 40.868819 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.849724, lat: 40.848739 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.663451, lat: 40.746499 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.617458, lat: 40.751746 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.707145, lat: 40.831273 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.729567, lat: 40.866637 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.773835, lat: 40.836077 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.682999, lat: 40.859216 },
            { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.680699, lat: 40.832147 }
          ];
        } else if(status === BMAP_STATUS_CITY_LIST) {
          this.customCityListSearchResult = [
            { department: '呼和浩特市', city: '呼和浩特市', num: this.$utilStr.randomNum(1, 9999)},
            { department: '阿拉善盟', city: '阿拉善盟', num: this.$utilStr.randomNum(1, 9999) },
            { department: '包头市', city: '包头市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '巴彦淖尔市', city: '巴彦淖尔市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '赤峰市', city: '赤峰市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '鄂尔多斯市', city: '鄂尔多斯市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '呼伦贝尔市', city: '呼伦贝尔市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '通辽市', city: '通辽市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '乌海市', city: '乌海市', num: this.$utilStr.randomNum(1, 9999) },
            { department: '乌兰察布市', city: '乌兰察布市', num: this.$utilStr.randomNum(1, 9999) }
          ];
        } else {
          this.customKeywordSearchResult = [];
        }
        // 如果没有按城市列表检索结果项
        /*if(trigger !== BMAP_SEARCH_TRIGGER_LOCATION_CHANGE) {
          if(status === BMAP_STATUS_SUCCESS || status === BMAP_STATUS_CITY_LIST) {
            this.customKeywordSearchResultTotal = 100;
            this.customKeywordSearchResult = [
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.769327, lat: 40.931488 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.717494, lat: 40.868819 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.849724, lat: 40.848739 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.663451, lat: 40.746499 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.617458, lat: 40.751746 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.707145, lat: 40.831273 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.729567, lat: 40.866637 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.773835, lat: 40.836077 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.682999, lat: 40.859216 },
              { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.680699, lat: 40.832147 }
            ];
          } else {
            this.customKeywordSearchResult = [];
          }
        }*/
      },
      // 关键字检索结果当前页数发生改变
      handleKeywordSearchCurrentChange(val, current) {
        console.log('检索结果当前页数：', val, current);
        this.customKeywordSearchResultTotal = 100;
        this.customKeywordSearchResult = [
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.769327, lat: 40.931488 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.717494, lat: 40.868819 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.849724, lat: 40.848739 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.663451, lat: 40.746499 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.617458, lat: 40.751746 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.707145, lat: 40.831273 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.729567, lat: 40.866637 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.773835, lat: 40.836077 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.682999, lat: 40.859216 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.680699, lat: 40.832147 }
        ];
      },
      // 关键字检索框值发生改变
      handleKeywordSearchInput(val) {
        console.log('检索框值：', val);
        this.customKeywordAutoResult = [
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' },
          { business: '关键字联想结果'+this.$utilStr.randomNum(1, 10), region: '呼和浩特市新城区' }
        ];
      },
      // 关键字按城市列表检索结果项发生点击
      handleCityListSearchItemClick(val) {
        console.log('关键字按城市列表检索结果项点击：', val);
        this.customKeywordSearchResultTotal = 100;
        this.customKeywordSearchResult = [
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.769327, lat: 40.931488 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.717494, lat: 40.868819 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.849724, lat: 40.848739 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.663451, lat: 40.746499 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.617458, lat: 40.751746 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.707145, lat: 40.831273 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.729567, lat: 40.866637 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.773835, lat: 40.836077 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.682999, lat: 40.859216 },
          { business: '检索结果'+this.$utilStr.randomNum(1, 10), tags: ['标签1', '标签2'], tagsAlias: '标签', address: '内蒙古自治区呼和浩特市新城区', addressAlias: '地址', items: ['内容1', '内容2'], itemsAlias: ['标题1', '标题2'], lng: 111.680699, lat: 40.832147 }
        ];
      },
      // 关键字检索结果项发生点击
      handleKeywordSearchItemClick(val, e, map) {
        console.log('关键字检索结果项点击：', val, e, map);
      },
      // 关键字检索框清空按钮发生点击
      handleKeywordSearchClear(trigger) {
        console.log('检索框清空', trigger, '是否通过清空按钮点击触发', trigger === BMAP_SEARCH_CLEAR_TRIGGER_BUTTON);
      },
      // 关键字检索结果标注点发生点击
      handleKeywordSearchPoiClick(val, i, mk, e) {
        console.log('关键字检索结果标注点击：', val, i, mk, e);
      },
      // 关键字检索结果标注点信息窗口打开
      handleKeywordSearchPoiOpen(val, i, mk, e) {
        console.log('关键字检索结果标注点信息窗口打开：', val, i, mk, e);
      },
      // 关键字检索完成
      handleKeywordSearchComplete(val, e, map) {
        console.log('关键字检索完成：', val, e, map);
      },
      // 关键字按城市列表检索完成
      handleCityListSearchComplete(val, e, map) {
        console.log('关键字按城市列表检索完成：', val, e, map);
      },
      // 行政区边界城市中心点点击
      handleBoundaryCityClick(val, mk, resolve) {
        console.log('行政区边界城市中心点点击', val, mk);
        resolve('<div class="hdty-bubble"><div class="hdty-bubble-header"><span class="hdty-bubble-title">城市中心点信息窗口</span><a href="javascript:;" class="hdty-bubble-link" onclick="handleWinDetail()">详情</a></div><div class="hdty-bubble-body">这是一个行政区边界城市中心点信息窗口</div></div>');
      },
      // 行政区边界绘制完成
      handleBoundaryComplete(val, e, map) {
        console.log('行政区边界绘制完成：', val, e, map);
      },
      // 自定义图层瓦片请求
      handleTileUrl(val, resolve) {
        console.log('自定义图层瓦片请求', val);
        resolve(tileImage);
      }
    }
  }
</script>

<style scoped>
  .hdty-container {
    padding-top: 6px !important;
    padding-bottom: 0 !important;
  }
  .hdty-fluid {
    padding: 8px 0;
  }
  .hdty-fill {
    padding: 16px 0;
  }
  .hdty-form-item {
    margin-bottom: 8px;
  }
  .hdty-form-item:last-child {
    margin-bottom: 0;
  }
</style>
