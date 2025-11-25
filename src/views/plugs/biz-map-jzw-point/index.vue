<template>
  <div class="hdty-dialog-select">
    <el-button
      v-if="jzwId"
      type="text"
      title="点击查看地图位置"
      square
      @click="handleInputFocus"
    >
      <i class="icon-location"> </i>
    </el-button>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      append-to-body
      @close="handleDialogClose"
    >
      <div slot="title" class="hdty-dialog-header">
        <div class="hdty-dialog-title">
          {{ title }}
        </div>
      </div>
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <biz-map-ft
            v-if="openSFMap && visible"
            ref="mapRef"
            zoom="15"
            :wms="true"
            :drawingMode="'marker'"
            :drawingTool="false"
            :drawingToolMarker="true"
            :center="currentCenter"
            :markers="currentMarkers"
            :fullscreen="false"
            :markerAutoView="true"
            @loaded="handleLoaded"
          ></biz-map-ft>

          <hd-map-baidu
            v-else
             zoom="15"
            :center="center"
            :searching="false"
            :fullscreen="false"
            :markers="currentMarkers"
          />
        </div>
      </hd-pane>
    </el-dialog>
  </div>
</template>

<script>
import { hdComponent } from "@/utils/util-framework";
import { getBzdzJzwxx, getBbox } from "./api";
import BizMapFt from "@/views/plugs/biz-map-ft/index";

export default {
  name: "index",
  mixins: [hdComponent],
  props: {
    // 建筑物编码
    jzwId: {
      type: String,
      default: "", //FF325C57-FC2F-4164-AABB-D8547169D330
    },
  },
  components: { BizMapFt },
  data() {
    return {
      // 显示Dialog
      visible: false,
      // 是否使用丰图地图
      openSFMap: appEnv.openSFMap,
      currentMarkers: [],
      currentCenter: [],
      // 标题
      title: "",
      loading: false,
      detail: "",
      // 兼容百度地图使用
      center: {
        lng: 116.397477,
        lat: 39.908692,
      },
    };
  },
  methods: {
    // 点击显示地图
    handleInputFocus() {
      if (this.jzwId) {
        this.visible = true;
        this.getBzdzJzwxxData();
      } else {
        console.error("jzwId不能为空");
      }
    },
    // 获取建筑地址信息
    getBzdzJzwxxData() {
      const _this = this;
      _this.loading = true;
      getBzdzJzwxx({ id: _this.jzwId })
        .then((res) => {
          const { success, data } = res.data;
          if (success) {
            // 设置坐标点
            _this.currentMarkers = [
              {
                lat: data.vo.latitude,
                lng: data.vo.longitude,
                icon: _this.openSFMap ? "iconDefault" : "b1",
              },
            ];
            _this.currentCenter = [data.vo.longitude, data.vo.latitude];
            // 百度地图
            _this.center = {
              lng: data.vo.longitude,
              lat: data.vo.latitude,
            };

            _this.title = data.vo.dzmcDzqc;
            _this.detail = data.vo;
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
    /**
     * 设置网格
     * info: {id:机构id， level:机构级别}
     * needClearMarkers: 是否需要清空上图点
     * */
    showWmsLayer(info) {
      let _this = this;
      _this.wms = true;
      let orgid = info.id;
      if (info.level === "2" || info.level === "3") {
        orgid = orgid.substring(0, 6);
      }
      // 参数
      let dataParams = {
        id: orgid,
        adCode: "150000",
      };
      setTimeout(() => {
        // Lambda写法
        getBbox(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              if (data) {
                if (data.bbox) {
                  this.markerAutoView = false;
                  let bbox = data.bbox.split(", ");

                  // 加载当前用户网格
                  if (info.level === "2") {
                    _this.$refs.mapRef.setWmsLayer(["==", "type", "1"], 1, 0);
                  } else if (info.level === "3") {
                    _this.$refs.mapRef.setWmsLayer(
                      ["==", "parent_rela_id", info.id.substring(0, 6)],
                      2,
                      [
                        [bbox[0], bbox[1]],
                        [bbox[2], bbox[3]],
                      ]
                    );
                  } else if (info.level === "4") {
                    if (info.type === "2") {
                      // 只展示指定派出所网格
                      _this.$refs.mapRef.setWmsLayer(
                        ["==", "rela_id", info.id],
                        2,
                        [
                          [bbox[0], bbox[1]],
                          [bbox[2], bbox[3]],
                        ]
                      );
                    } else {
                      _this.$refs.mapRef.setWmsLayer(
                        ["==", "parent_rela_id", info.id],
                        2,
                        [
                          [bbox[0], bbox[1]],
                          [bbox[2], bbox[3]],
                        ]
                      );
                    }
                  } else if (info.level === "5") {
                    _this.$refs.mapRef.setWmsLayer(
                      ["==", "parent_rela_id", info.id],
                      2,
                      [
                        [bbox[0], bbox[1]],
                        [bbox[2], bbox[3]],
                      ]
                    );
                  } else {
                    _this.$refs.mapRef.setWmsLayer(
                      ["==", "rela_id", info.id],
                      4,
                      [
                        [bbox[0], bbox[1]],
                        [bbox[2], bbox[3]],
                      ]
                    );
                  }
                }

                this.loading = false;
              }
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          });
      }, 500);
    },
    // 会话层关闭
    handleDialogClose() {},
    // 丰图地图加载完成
    handleLoaded() {
      // 绘制点
      // this.$refs.ftMapRef.drawControl();
      this.showWmsLayer({ id: this.detail.sjgsdwdm, level: "6" });
    },
  },
};
</script>

<style scoped lang="scss"></style>
