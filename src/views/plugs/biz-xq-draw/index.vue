<template>
  <el-dialog
    title="绘制辖区"
    :visible.sync="visible"
    append-to-body>
    <hd-pane
      fit>
      <div class="hdty-container hdty-flex" style="height: 600px;" v-loading="submitting">
        <hd-map-baidu
          v-if="visible && map === 'bmap'"
          ref="mapDrawRef"
          :clusterer="false"
          :polygon-color.sync="polygonColor"
          :polygon-path.sync="polygonPath"
          icon="b1"
          :polygon="true"
          :polygonAutoView="true"
          :drawing-mode.sync="drawingMode"
          :polygon-limit="1"
          :markers="markers"
          :zoom="16"
          :center="bdcenter"
          :color-picker="true"
          :enable-map-click="false"
          @currentPolygonChanged="handlePolygonChange">
          <div class="hdty-map-tips">
            <i class="icon-remind-o"></i>
            小提示:单击确认起点或绘制下一个点，双击完成绘制
          </div>
        </hd-map-baidu>
        <biz-map-ft
          v-else-if="map === 'pgis' && visible"
          ref="pgisMapRef"
          :drawingTool="true"
          :polygonFlag="polygonFlag"
          :polygonPath="polygonPath"
          :polygonColor="polygonColor"
          :markers="markers"
          :zoom="16"
          :center="center"
          :fullscreen="false"
          @currentDrawed="handleDrawed"
        ></biz-map-ft>
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button @click="cancelForm">取 消</el-button>
      <el-button type="danger" @click="handleDelXq" v-if="polygonPath.length > 0 && delFlag">删除辖区</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdForm } from "@/utils/util-framework";
  import { levelFourGridMark, levelFourGridShow, levelFourGridDel } from "./api";
  import BizMapFt from '@/views/plugs/biz-map-ft/index'

    export default {
      name: "index",
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
          visible: false,
          // 绘制模式
          drawingMode: 'polygon',
          // 多边形颜色
          polygonColor: [],
          // 多边形路径坐标
          polygonPath: [],
          drawingPolygonPath:[],
          polygonFlag: 'draw',
          dzbm: '',
          // 1 乡镇街道 2 社区 3 社区网格员 4 街路巷小区村单位 5. 单位
          flag: '',
          // 是否可以删除
          delFlag: false,
          markers: [],
          center: [],
          bdcenter: [],
        }
      },
      methods: {
        // 清空辖区
        handleDelXq() {
          let _this = this;
          _this.polygonColor = [];
          _this.polygonPath = [];
          _this.drawingPolygonPath = [];
          if(_this.$refs.pgisMapRef){
            _this.$refs.pgisMapRef.drawExample.deleteAll();
          }
          _this.submitting = true;
          // 参数
          let dataParams = {
            dzbm: _this.dzbm,
          };
          // Lambda写法
          levelFourGridDel(dataParams).then(response => {
            // 响应成功回调
            let { success, msg } = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              _this.$emit("handleSubmit");
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.submitting = false;
          });
        },
        // 获取辖区
        handleDetailXq() {
          let _this = this;
          // 参数
          let dataParams = {
            dzbm: _this.dzbm,
          };
          // Lambda写法
          levelFourGridShow(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if(data.areaPoints.length > 0){
                _this.delFlag = true;
              }
              _this.polygonColor = data.areaColor;
              _this.polygonPath = data.areaPoints;
              if(data.areaPoints.length === 0 && _this.markers.length > 0){
                // 设置中心点
                setTimeout(() => {
                  if(_this.map === 'bmap'){
                    _this.bdcenter = _this.markers[0];
                  }
                  else{
                    _this.center = [_this.markers[0].lng, _this.markers[0].lat];
                  }
                },500)

              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.submitting = false;
          });
        },
        // 多边形路径发生改变
        handlePolygonChange(val) {
          console.log('多边形路径：', val);
          console.log(this.polygonPath)
        },
        // 取消
        cancelForm() {
          this.visible = false;
          this.resetForm();
        },
        resetForm() {
          this.polygonColor = [];
          this.polygonPath = [];
          this.dzbm = '';
          this.flag = '';
        },
        // 绘制结束
        handleDrawed(bbox, data){
          this.drawingPolygonPath =data;
        },
        // 提交
        submitForm() {
          let _this = this;
          // 参数
          let dataParams = {
            dzbm: _this.dzbm,
          };
          // Lambda写法
          levelFourGridDel(dataParams).then(response => {
            // 响应成功回调
            let { success, msg } = response.data;
            if (success) {
              if(_this.drawingPolygonPath.length >0){
                let path = [];
                this.drawingPolygonPath.forEach(e => {
                  path.push({
                    lng: e[0],
                    lat: e[1],
                  })
                })
                _this.submitting = true;
                // 参数
                let dataParams = {
                  areaColor: ['#ff0000'],
                  areaPoints: [path],
                  dzbm: _this.dzbm,
                  flag: _this.flag,
                };
                // Lambda写法
                levelFourGridMark(dataParams).then(response => {
                  // 响应成功回调
                  let { success, msg } = response.data;
                  if (success) {
                    _this.$message({
                      showClose: true,
                      customClass: 'is-fixed',
                      message: msg,
                      type: 'success'
                    });
                    _this.$emit("handleSubmit");
                    _this.cancelForm();
                  }
                }).catch(error => {
                  // 响应错误回调
                  console.error(error);
                }).finally(() => {
                  _this.submitting = false;
                });
              }
              else if (_this.polygonPath.length > 0) {
                _this.submitting = true;
                // 参数
                let dataParams = {
                  areaColor: _this.polygonColor,
                  areaPoints: _this.polygonPath,
                  dzbm: _this.dzbm,
                  flag: _this.flag,
                };
                // Lambda写法
                levelFourGridMark(dataParams).then(response => {
                  // 响应成功回调
                  let { success, msg } = response.data;
                  if (success) {
                    _this.$message({
                      showClose: true,
                      customClass: 'is-fixed',
                      message: msg,
                      type: 'success'
                    });
                    _this.$emit("handleSubmit");
                    _this.cancelForm();
                  }
                }).catch(error => {
                  // 响应错误回调
                  console.error(error);
                }).finally(() => {
                  _this.submitting = false;
                });
              }
              else{
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: '请至少绘制一个辖区',
                  type: 'warning'
                });
              }
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
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
