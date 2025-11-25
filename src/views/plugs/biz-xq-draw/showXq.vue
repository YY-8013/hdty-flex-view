<template>
  <div style="height: 500px;">
    <hd-map-baidu
      ref="mapDrawRef"
      v-if="map === 'bmap'"
      :clusterer="false"
      :polygon-color.sync="polygonColor"
      :polygon-path.sync="polygonPath"
      icon="b1"
      :markers="markers"
      :polygon="false"
      :polygonAutoView="true"
      :color-picker="false"
      :enable-map-click="false">
    </hd-map-baidu>
    <biz-map-ft
      v-else-if="map === 'pgis'"
      ref="pgisMapRef"
      :drawingTool="false"
      :markerAutoView="true"
      :markers="markers"
      :polygonColor="polygonColor"
      :polygonFlag="polygonFlag"
      :polygonPath="polygonPath"
      :fullscreen="false"
    ></biz-map-ft>
  </div>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { levelFourGridMark, levelFourGridShow, levelFourGridDel } from "./api";
  import BizMapFt from '@/views/plugs/biz-map-ft/index'

    export default {
      name: "showXq",
      mixins: [hdForm],
      props: {
        prop: String,
        // 地图类型（bmap / arcgis / pgis）
        map: {
          type: String,
          default: appEnv.openSFMap? 'pgis' : 'bmap'
        },
      },
      components: {
        BizMapFt
      },
      data() {
        return {
          // 多边形颜色
          polygonColor: [],
          // 多边形路径坐标
          polygonPath: [],
          dzbm: '',
          polygonFlag: 'layer',
          markers: [],
        }
      },
      methods: {
        // 获取辖区
        handleDetailXq() {
          let _this = this;
          _this.polygonColor = [];
          _this.polygonPath = [];
          // 参数
          let dataParams = {
            dzbm: _this.dzbm,
          };
          // Lambda写法
          levelFourGridShow(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.polygonColor = data.areaColor;
              setTimeout(() => {
                _this.polygonPath = data.areaPoints;
              },200)
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.submitting = false;
          });
        },
      }
    }
</script>

<style scoped>
  ::v-deep .hdty-map-search-shop {
    display: none !important;
  }
</style>
