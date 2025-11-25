<template>
  <div
    class="hdty-dialog-select hdty-coordinate-select"
    :class="{ 'is-button': type === 'button', 'is-adaptive': adaptive }"
    :underline="underline"
  >
    <hd-button
      v-if="type === 'button'"
      type="text"
      icon="icon-location"
      title="点击查看地图位置"
      :readonly="readonly"
      :disabled="disabled"
      square
      @click="handleInputFocus"
    ></hd-button>
    <hd-input
      v-else
      ref="inputRef"
      v-model="input"
      suffix-icon="icon-location"
      :size="size"
      clear-class="hdty-dialog-select-clear"
      :placeholder="placeholder"
      :clearable="clearable"
      :readonly="readonly || !marker"
      :disabled="disabled"
      :adaptive="adaptive"
      @focus="handleInputFocus"
      @clear="handleInputClear(true)"
    ></hd-input>
    <el-dialog
      ref="dialogRef"
      :visible.sync="visible"
      class="hdty-dialog-select-wrapper"
      custom-class="hdty-dialog-select-panel hdty-coordinate-select-dialog"
      :custom-class="activeDialogCustomClass"
      append-to-body
      @open="handleDialogOpen"
      @close="handleDialogClose"
    >
      <div slot="title" class="hdty-dialog-header">
        <div class="hdty-dialog-title">{{ dialogTitle || placeholder }}</div>
        <div v-if="activeEnableTips" class="hdty-dialog-tips">
          <i class="icon-remind-o"></i>
          长按坐标点可拖动调整位置或双击删除
        </div>
      </div>
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <hd-map-baidu
            v-if="map === 'bmap'"
            ref="bmapRef"
            :center="center"
            :zoom="zoom"
            :marker="marker"
            :marker-limit="multiple?limit:1"
            :drawing-mode.sync="currentDrawingMode"
            :markers.sync="currentValue"
            :clusterer="!marker"
            :marker-auto-view="currentAutoView"
            icon="b1"
            :keyword-search="marker"
            :keep-keyword-search-alive="true"
            :enable-point-tooltip="marker"
            :enable-map-click="false"
            :city-list="true"
            @currentMarkerChanged="handleMarkerChange"
            @markerDblclick="handleMarkerDblclick"
            @currentDrawingModeChanged="handleDrawingModeChange"
            @currentKeywordSearchItemClick="handleKeywordSearchPoiChange"
            @currentKeywordSearchPoiClick="handleKeywordSearchPoiClick"
            @currentKeywordSearchPoiOpen="handleKeywordSearchPoiOpen"
            @currentKeywordSearchComplete="handleKeywordSearchPoiChange"
          ></hd-map-baidu>
          <hd-map-arcgis v-else-if="map === 'arcgis'">
            <p class="hdty-map-tips">暂不支持相关功能，请留意版本更新</p>
          </hd-map-arcgis>
        </div>
      </hd-pane>
      <div slot="footer" class="hdty-dialog-footer">
        <div class="hdty-float-left">
          当前{{ marker?'选择':'地点' }}：
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 0"
            type="success"
            :closable="marker?clearable:false"
            @close="handleTagClose"
          >{{ activeTag[0] }}</el-tag>
          <el-tag
            v-else-if="!Array.isArray(activeTag) && activeTag"
            type="success"
            :closable="marker?clearable:false"
            @close="handleTagClose"
          >{{ activeTag }}</el-tag>
          <el-tag
            v-if="Array.isArray(activeTag) && activeTag.length > 1"
            type="success"
          >+{{ activeTag.length - 1 }}</el-tag>
        </div>
        <div class="hdty-btn-container">
          <el-button :type="marker ? '' : 'primary'" @click="cancel">{{ marker ? '取 消' : '确 定' }}</el-button>
          <el-button v-if="marker" type="primary" @click="submit">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent } from '@/utils/util-framework';
export default {
  name: 'index',
  provide() {
    return {
      hdMapPoint: this
    };
  },
  mixins: [hdComponent],
  props: {
    prop: String,
    // 显示类型（input / button）
    type: {
      type: String,
      default: 'input'
    },
    // 绑定值
    value: {
      type: [Object, Array],
      default: null
    },
    // 绑定值文本
    modelText: {
      type: [String, Array],
      default: ''
    },
    // 地图类型（bmap / arcgis）
    map: {
      type: String,
      default: 'bmap'
    },
    // 地图中心点坐标
    center: {
      type: Object
    },
    // 地图缩放级别
    zoom: {
      type: [Number, String]
    },
    // 开启点绘制
    marker: {
      type: Boolean,
      default() {
        return this.type !== 'button';
      }
    },
    // 默认开启的绘制模式（drag/marker）
    drawingMode: {
      type: String,
      default: ''
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 多选限制（0代表不限制）
    limit: {
      type: Number,
      default: 0
    },
    // 输入框尺寸（medium / small / mini）
    size: {
      type: String,
      default: ''
    },
    // 会话选择窗口尺寸（large / medium / small / mini / fit）
    dialogSize: {
      type: String,
      default: 'medium'
    },
    // 会话选择窗口标题
    dialogTitle: {
      type: String,
      default: '拾取坐标'
    },
    // 水印
    placeholder: {
      type: String,
      default: '请选择'
    },
    // 在改变会影响到绑定值的组件属性时（multiple/limit），是否判定影响有效(true:影响绑定值，改变属性时清空绑定值；false:不影响绑定值，改变属性时不清空绑定值)
    checkInfluentially: {
      type: Boolean,
      default: false
    },
    // 是否开启点自动调整最佳视野
    autoView: {
      type: Boolean,
      default: true
    },
    // 是否显示完整地址（功能尚在完善中）
    showFullAddress: {
      type: Boolean,
      default: false
    },
    // 是否可清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 是否只读
    readonly: {
      type: Boolean,
      default: false
    },
    // 是否禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 宽度自适应（元素宽度随内容变化）
    adaptive: {
      type: Boolean,
      default: false
    },
    // 下划线风格
    underline: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 绑定值
      currentValue: this.value, // currentValue接收父组件传来的value值
      // 绑定值
      input: this.modelText, // input接收父组件传来的modelText值
      // 当前是否开启点自动调整最佳视野
      currentAutoView: this.autoView,
      // 当前绘制模式
      currentDrawingMode: this.drawingMode,
      // 选中数据
      selectionData: [],
      // 启用构造数据
      constDataEnabled: true,
      // 构造数据
      constData: [],
      // 缓存数据
      cacheData: {
        currentOverlays: []
      },
      // 多选超出限制提示完成
      limitPromptComplete: false,
      // 显示Dialog
      visible: false
    };
  },
  computed: {
    activeDialogCustomClass() {
      if (this.dialogSize === 'large') {
        return 'hdty-dialog-large';
      } else if (this.dialogSize === 'medium') {
        return 'hdty-dialog-medium';
      } else if (this.dialogSize === 'small') {
        return 'hdty-dialog-small';
      } else if (this.dialogSize === 'mini') {
        return 'hdty-dialog-mini';
      } else if (this.dialogSize === 'fit') {
        return 'hdty-dialog-fit';
      } else {
        return this.dialogSize;
      }
    },
    activeEnableTips() {
      return (
        this.marker &&
        this.currentValue.length > 0 &&
        (!this.currentDrawingMode || this.currentDrawingMode === 'drag')
      );
    },
    activeTag() {
      if (this.multiple) {
        let tags = [];
        for (let i = 0; i < this.selectionData.length; i++) {
          let tag = this.selectionData[i].address;
          if (!this.$utilStr.isEmpty(this.selectionData[i].point)) {
            let coordinate =
              this.selectionData[i].point.lng +
              ',' +
              this.selectionData[i].point.lat;
            if (tag && tag !== coordinate) {
              tag += ' | ' + coordinate;
            } else if (!tag) {
              tag += coordinate;
            }
          }
          tags.push(tag);
        }
        return tags;
      } else {
        let tag = '';
        if (!this.$utilStr.isEmpty(this.selectionData)) {
          tag = this.selectionData[0].address;
          if (!this.$utilStr.isEmpty(this.selectionData[0].point)) {
            let coordinate =
              this.selectionData[0].point.lng +
              ',' +
              this.selectionData[0].point.lat;
            if (tag && tag !== coordinate) {
              tag += ' | ' + coordinate;
            } else if (!tag) {
              tag += coordinate;
            }
          }
        }
        return tag;
      }
    },
    activeConstDataEnabled() {
      return this.currentValue.length > 0 && this.constDataEnabled;
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.$utilStr.isEmpty(val)) {
          if (!this.$utilStr.isEmpty(this.modelText)) {
            this.$emit('update:modelText', val);
          } else if (!this.$utilStr.isEmpty(this.input)) {
            this.input = '';
          }
          this.constData = [];
          this.constDataEnabled = true;
        }
        if (!Array.isArray(val)) {
          if (!this.$utilStr.isEmpty(val)) val = [val];
          else val = [];
        }
        if (this.marker) {
          this.currentValue = val.map((e) => {
            return Object.assign(
              {
                title: '长按坐标点可拖动调整位置或双击删除',
                dragging: true,
                ondblclick: 'markerDblclick'
              },
              e
            );
          });
        } else {
          this.currentValue = val;
        }
        if (this.activeConstDataEnabled) {
          this.constData = [];
          for (let i = 0; i < val.length; i++) {
            this.constData.push({
              point: val[i],
              address: val[i].lng + ',' + val[i].lat
            });
          }
        }
        this.selectionData = [].concat(this.constData);
        if (this.multiple) {
          if (
            !this.$utilStr.isEmpty(val) &&
            this.$utilStr.isEmpty(this.modelText) &&
            this.$utilStr.isEmpty(this.input)
          ) {
            this.input = this.$utilStr.arraySplit(
              this.$utilStr
                .objArrayToArray(this.constData, 'address')
                .map((e) => {
                  return '[' + e + ']';
                })
            );
          }
        } else {
          if (
            !this.$utilStr.isEmpty(val) &&
            this.$utilStr.isEmpty(this.modelText) &&
            this.$utilStr.isEmpty(this.input)
          ) {
            this.input = this.constData[0].address;
          }
        }
      },
      immediate: true
    },
    modelText: {
      handler(val) {
        if (this.multiple) {
          if (!Array.isArray(val)) {
            if (!this.$utilStr.isEmpty(val)) val = [val];
            else val = [];
          }
          if (
            this.$utilStr.isEmpty(val) &&
            !this.$utilStr.isEmpty(this.currentValue)
          ) {
            this.input = this.$utilStr.arraySplit(
              this.$utilStr
                .objArrayToArray(this.constData, 'address')
                .map((e) => {
                  return '[' + e + ']';
                })
            );
          } else {
            this.input = this.$utilStr.arraySplit(val);
          }
        } else {
          if (
            this.$utilStr.isEmpty(val) &&
            !this.$utilStr.isEmpty(this.currentValue)
          ) {
            this.input = this.constData[0].address;
          } else {
            this.input = val;
          }
        }
        if (this.activeConstDataEnabled) {
          for (let i = 0; i < this.constData.length; i++) {
            if (Array.isArray(val)) {
              if (val[i]) {
                this.constData[i].address = val[i];
              }
            } else {
              if (val) {
                this.constData[i].address = val;
              }
            }
          }
          this.selectionData = [].concat(this.constData);
        }
      },
      immediate: true
    },
    multiple: {
      handler(val) {
        if (this.checkInfluentially) {
          this.handleInputClear();
        } else {
          if (val) {
            if (!Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit('input', [this.value]);
              } else {
                this.$emit('input', []);
              }
            }
            if (!Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit('update:modelText', [this.modelText]);
              } else {
                this.$emit('update:modelText', []);
              }
            }
          } else {
            if (Array.isArray(this.value)) {
              if (!this.$utilStr.isEmpty(this.value)) {
                this.$emit('input', this.value[0]);
              } else {
                this.$emit('input', null);
              }
            }
            if (Array.isArray(this.modelText)) {
              if (!this.$utilStr.isEmpty(this.modelText)) {
                this.$emit('update:modelText', this.modelText[0]);
              } else {
                this.$emit('update:modelText', '');
              }
            }
          }
        }
      },
      immediate: false
    },
    limit: {
      handler() {
        if (this.checkInfluentially) {
          this.handleInputClear();
        }
      },
      immediate: false
    }
  },
  methods: {
    // input获得焦点
    handleInputFocus() {
      if (!this.readonly) {
        this.visible = true;
        this.$emit('currentOpening', this);
      }
    },
    // 坐标点发生改变
    handleMarkerChange(val, locations) {
      if (this.currentAutoView) this.currentAutoView = false;
      let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
      if (poiTarget && poiTarget.length > 0) {
        poiTarget.forEach((poi, i) => {
          if (
            !val.find((e) => e.lng === poi.point.lng && e.lat === poi.point.lat)
          ) {
            this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
              poi,
              i,
              poi.marker
            );
            poi.marker.Yc.style.display = 'inline';
          }
        });
      }
      let activeSelectionData = [].concat(this.selectionData);
      this.selectionData = [];
      val.forEach((e, i) => {
        e.title = '长按坐标点可拖动调整位置或双击删除';
        e.dragging = true;
        e.ondblclick = 'markerDblclick';
        this.selectionData.push({
          point: e,
          address: locations[i]
            ? this.combineLocation(locations[i])
            : activeSelectionData[i].address,
          location: locations[i] || activeSelectionData[i].location
        });
      });
    },
    // 标注点发生双击
    handleMarkerDblclick(val) {
      if (this.multiple) {
        this.selectionData = this.selectionData.filter(
          (e) => e.point.lng !== val.lng && e.point.lat !== val.lat
        );
        this.currentValue = this.$utilStr.objArrayToArray(
          this.selectionData,
          'point'
        );
      } else {
        this.selectionData = [];
        this.currentValue = [];
      }
      let dblclickPoi = false;
      let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
      if (poiTarget && poiTarget.length > 0) {
        poiTarget.forEach((poi, i) => {
          if (poi.point.lng === val.lng && poi.point.lat === val.lat) {
            this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
              poi,
              i,
              poi.marker
            );
            poi.marker.Yc.style.display = 'inline';
            dblclickPoi = true;
          }
        });
      }
      if (
        this.currentValue.length === 0 &&
        this.currentDrawingMode !== 'marker' &&
        !dblclickPoi
      ) {
        this.currentDrawingMode = 'marker';
      }
    },
    // 绘制模式发生改变
    handleDrawingModeChange(val) {
      if (!val || val === 'drag') {
        if (this.currentValue.length > 0) {
          let markers = this.currentValue;
          this.currentValue = [];
          this.$nextTick(() => {
            this.currentValue = markers;
          });
        }
      } else {
        if (this.$refs.bmapRef.currentMarkersTarget.length > 0) {
          let markers = this.$refs.bmapRef.currentMarkersTarget;
          this.currentValue = [];
          this.$nextTick(() => {
            markers.forEach((e) => {
              this.$refs.bmapRef.map.addOverlay(e);
              this.$refs.bmapRef.currentOverlays.push({
                currentTarget: this.$refs.bmapRef.drawingManager,
                drawingMode: 'marker',
                overlay: e,
                returnValue: true,
                target: this.$refs.bmapRef.drawingManager,
                type: 'overlaycomplete'
              });
              if (this.$refs.bmapRef.validateLimit()) {
                this.$refs.bmapRef.createClearOverlayControl();
              }
            });
          });
        }
      }
    },
    // 关键字检索结果标注点发生点击
    handleKeywordSearchPoiClick() {
      let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
      if (poiTarget && poiTarget.length > 0) {
        poiTarget.forEach((poi) => {
          if (
            this.selectionData.find(
              (e) =>
                e.point.lng === poi.point.lng && e.point.lat === poi.point.lat
            )
          ) {
            poi.marker.Yc.style.display = 'none';
          }
        });
      }
    },
    // 关键字检索结果标注点信息窗口打开
    handleKeywordSearchPoiOpen(val, i, mk, e) {
      let _this = this;
      let popoverEl = e.target.V;
      if (popoverEl) {
        let popoverBody = popoverEl.querySelector('.hdty-bubble-body');
        if (popoverBody) {
          let item = popoverBody.querySelector('.hdty-form-item.custom');
          if (!item) {
            item = document.createElement('div');
            item.className = 'hdty-form-item custom';
            item.style.marginTop = '8px';
            item.style.marginBottom = '0';
            item.style.textAlign = 'center';
            let btn = document.createElement('button');
            btn.className = 'hdty-btn';
            btn.onclick = () => {
              if (_this.currentAutoView) _this.currentAutoView = false;
              _this.$refs.bmapRef.clearInfoBox();
              if (_this.multiple) {
                _this.selectionData.push({
                  point: val.point,
                  address: val.business,
                  location: val
                });
                if (validateLimit()) {
                  mk.Yc.style.display = 'none';
                  _this.currentValue.push({
                    lng: val.point.lng,
                    lat: val.point.lat,
                    title: '长按坐标点可拖动调整位置或双击删除',
                    dragging: true,
                    ondblclick: 'markerDblclick'
                  });
                }
                function validateLimit() {
                  if (Number(_this.limit) > 0) {
                    if (_this.selectionData.length > Number(_this.limit)) {
                      if (
                        Number(_this.limit) > 1 &&
                        !_this.limitPromptComplete
                      ) {
                        _this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
                          val,
                          i,
                          mk
                        );
                        _this.$message({
                          showClose: true,
                          customClass: 'is-wrap',
                          message:
                            '超出地图拾点限制，最多拾取[' +
                            _this.limit +
                            ']项，继续拾取将自动覆盖第一项',
                          type: 'error',
                          offset: 76,
                          duration: 5000
                        });
                        _this.limitPromptComplete = true;
                        _this.selectionData.pop();
                        return;
                      } else {
                        let spliceData = _this.selectionData.splice(0, 1);
                        _this.currentValue = _this.$utilStr.objArrayToArray(
                          _this.selectionData,
                          'point'
                        );
                        let poiTarget =
                          _this.$refs.bmapRef.currentKeywordSearchPoiTarget;
                        if (poiTarget && poiTarget.length > 0) {
                          poiTarget.forEach((poi, i) => {
                            if (
                              poi.point.lng === spliceData[0].point.lng &&
                              poi.point.lat === spliceData[0].point.lat
                            ) {
                              _this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
                                poi,
                                i,
                                poi.marker
                              );
                              poi.marker.Yc.style.display = 'inline';
                            }
                          });
                        }
                      }
                    }
                  }
                  return true;
                }
              } else {
                let spliceData = _this.selectionData.splice(0, 1);
                _this.currentValue.splice(0, 1, {
                  lng: val.point.lng,
                  lat: val.point.lat,
                  title: '长按坐标点可拖动调整位置或双击删除',
                  dragging: true,
                  ondblclick: 'markerDblclick'
                });
                mk.Yc.style.display = 'none';
                if (spliceData && spliceData.length > 0) {
                  let poiTarget =
                    _this.$refs.bmapRef.currentKeywordSearchPoiTarget;
                  if (poiTarget && poiTarget.length > 0) {
                    poiTarget.forEach((poi, i) => {
                      if (
                        poi.point.lng === spliceData[0].point.lng &&
                        poi.point.lat === spliceData[0].point.lat
                      ) {
                        _this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
                          poi,
                          i,
                          poi.marker
                        );
                        poi.marker.Yc.style.display = 'inline';
                      }
                    });
                  }
                }
                _this.selectionData.push({
                  point: val.point,
                  address: val.business,
                  location: val
                });
              }
            };
            item.appendChild(btn);
            let btnTxt = document.createTextNode('选择此点');
            btn.appendChild(btnTxt);
            popoverBody.appendChild(item);
          }
        }
      }
    },
    // 关键字检索结果标注点发生改变
    handleKeywordSearchPoiChange(val, poiTarget) {
      if (poiTarget && poiTarget.length > 0) {
        poiTarget.forEach((poi) => {
          if (
            this.selectionData.find(
              (e) =>
                e.point.lng === poi.point.lng && e.point.lat === poi.point.lat
            )
          ) {
            poi.marker.Yc.style.display = 'none';
          }
        });
      }
    },
    // input清空
    handleInputClear(emitEvent) {
      if (this.multiple) {
        this.$emit('input', []);
        this.$emit('update:modelText', []);
        if (emitEvent) {
          this.$emit('currentChanged', []);
        }
      } else {
        this.$emit('input', null);
        this.$emit('update:modelText', '');
        if (emitEvent) {
          this.$emit('currentChanged', null);
        }
      }
      if (this.$refs.bmapRef) {
        let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
        if (poiTarget && poiTarget.length > 0) {
          poiTarget.forEach((poi, i) => {
            this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
              poi,
              i,
              poi.marker
            );
            poi.marker.Yc.style.display = 'inline';
          });
        }
      }
    },
    // tag关闭
    handleTagClose() {
      if (this.currentDrawingMode === 'marker') {
        this.$refs.bmapRef.map.removeOverlay(
          this.$refs.bmapRef.currentOverlays[0].overlay
        );
        this.$refs.bmapRef.currentOverlays.shift();
        this.$refs.bmapRef.drawing = true;
      }
      if (this.multiple) {
        let spliceData = this.selectionData.splice(0, 1);
        this.currentValue = this.$utilStr.objArrayToArray(
          this.selectionData,
          'point'
        );
        let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
        if (poiTarget && poiTarget.length > 0) {
          poiTarget.forEach((poi, i) => {
            if (
              poi.point.lng === spliceData[0].point.lng &&
              poi.point.lat === spliceData[0].point.lat
            ) {
              this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
                poi,
                i,
                poi.marker
              );
              poi.marker.Yc.style.display = 'inline';
            }
          });
        }
      } else {
        this.selectionData = [];
        this.currentValue = [];
        let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
        if (poiTarget && poiTarget.length > 0) {
          poiTarget.forEach((poi, i) => {
            if (poi.marker.getIcon().name.includes('a2')) {
              this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
                poi,
                i,
                poi.marker
              );
              poi.marker.Yc.style.display = 'inline';
            }
          });
        }
      }
    },
    // dialog打开
    handleDialogOpen() {
      this.$refs.dialogRef.$el.onclick = (evt) => {
        evt.stopPropagation();
      };
      this.$nextTick(() => {
        let popupParentHiddenEl = document.querySelector(
          '.el-popup-parent--hidden'
        );
        if (popupParentHiddenEl) {
          popupParentHiddenEl.onclick = (evt) => {
            evt.stopPropagation();
            popupParentHiddenEl.onclick = null;
          };
        }
      });
    },
    // dialog关闭
    handleDialogClose() {
      if (this.$refs.inputRef) this.$refs.inputRef.blur();
    },
    // 组合地址
    combineLocation(val) {
      let result = '未知';
      if (
        typeof val === 'object' &&
        (val.addressComponents || val.surroundingPois)
      ) {
        let addComp = val.addressComponents;
        if (val.surroundingPois.length > 0) {
          result = val.surroundingPois[0].title;
        } else if (addComp.street) {
          result = addComp.street + addComp.streetNumber;
        } else if (addComp.province || addComp.city || addComp.district) {
          result = addComp.province + addComp.city + addComp.district;
        }
      }
      return result;
    },
    // 提交
    submit() {
      this.visible = false;
      this.selectionData.forEach((e) => {
        delete e.point.title;
        delete e.point.dragging;
        delete e.point.ondblclick;
      });
      if (this.multiple) {
        this.input = this.$utilStr.arraySplit(
          this.$utilStr.objArrayToArray(this.selectionData, 'address')
        );
        this.$emit(
          'input',
          this.$utilStr.objArrayToArray(this.selectionData, 'point')
        );
        this.$emit(
          'update:modelText',
          this.$utilStr.objArrayToArray(this.selectionData, 'address')
        );
        this.$emit('currentChanged', this.selectionData);
      } else {
        let selection = null;
        let point = null;
        let address = '';

        if (this.selectionData.length > 0) {
          console.log('selection', this.selectionData);

          selection = this.selectionData[0];
          console.log('selection', selection);

          point = selection.point;

          let pointAddress = selection.address;
          if (this.showFullAddress && selection.location) {
            pointAddress = selection.location.address;
          }
          address = pointAddress;
        }
        this.input = address;
        this.$emit('input', point); // 触发 input 事件，并传入新值
        this.$emit('update:modelText', address);
        this.$emit('currentChanged', selection);
      }
      this.cacheData.currentOverlays = [].concat(
        this.$refs.bmapRef.currentOverlays
      );
      if (this.constDataEnabled) this.constDataEnabled = false;
      this.constData = [].concat(this.selectionData);
    },
    // 取消
    cancel() {
      this.visible = false;
      if (this.marker) {
        this.reset();
      }
    },
    // 重置
    reset() {
      if (this.currentDrawingMode === 'marker') {
        if (this.$refs.bmapRef.currentOverlays.length > 0) {
          for (let e of this.$refs.bmapRef.currentOverlays) {
            this.$refs.bmapRef.map.removeOverlay(e.overlay);
          }
          for (let e of this.cacheData.currentOverlays) {
            this.$refs.bmapRef.map.addOverlay(e.overlay);
          }
          this.$refs.bmapRef.currentOverlays = [].concat(
            this.cacheData.currentOverlays
          );
        }
        this.$refs.bmapRef.drawing = false;
      }
      let poiTarget = this.$refs.bmapRef.currentKeywordSearchPoiTarget;
      if (poiTarget && poiTarget.length > 0) {
        poiTarget.forEach((poi, i) => {
          if (
            !this.constData.find(
              (e) =>
                e.point.lng === poi.point.lng && e.point.lat === poi.point.lat
            )
          ) {
            this.$refs.bmapRef.setKeywordSearchPoiHoverAndSelect(
              poi,
              i,
              poi.marker
            );
            poi.marker.Yc.style.display = 'inline';
          } else {
            poi.marker.Yc.style.display = 'none';
          }
        });
      }
      this.selectionData = [].concat(this.constData);
      this.currentValue = this.$utilStr.objArrayToArray(
        this.selectionData,
        'point'
      );
    }
  }
};
</script>

<style scoped>
.hdty-map-wrapper
  ::v-deep
  .hdty-map
  .BMapLib_Drawing
  .BMapLib_box[class*='BMapLib_marker']:after {
  content: '拾点' !important;
}
.hdty-map-wrapper ::v-deep .hdty-map .hdty-map-arcgis + .hdty-map-tips {
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  padding: 5px 12px;
  line-height: 24px;
  font-size: 16px;
}
</style>
