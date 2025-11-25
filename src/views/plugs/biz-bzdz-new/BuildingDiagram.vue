<template>
  <div :style="{ width: pageWidth }" style="height: 400px;">
    <div class="hdty-building-title">
      如需完善修改房屋信息、楼栋信息，请前往【房态图】操作。
      <!--<hd-button-->
      <!--name="addressSign"-->
      <!--type="warning"-->
      <!--@click="handleIntoMarker">-->
      <!--房态图-->
      <!--</hd-button>-->
      <hd-button
        v-if="isShowJzwHome && isYw && ((jzwInfo.jzwlx === '3' || jzwInfo.jzwlx === '7') || (componentType === '1' && jzwInfo.jzwlx !== '1'))"
        type="primary"
        @click="handleJzw"
      >选择当前建筑物</hd-button>
      <!--      <hd-button v-if="isYw && componentType === '1' && jzwInfo.jzwlx === '1'"-->
      <!--         type="primary"-->
      <!--         @click="handleJlxPf">-->
      <!--        选择当前所有平房-->
      <!--      </hd-button>-->
    </div>
    <div
      class="hdty-building-diagram hdty-flex"
      style="height: calc(100% - 50px);"
      v-loading="loading"
      v-if="visible"
    >
      <div
        v-if="model && model.floorData && model.floorData.length > 0"
        class="hdty-flex-fit"
        :style="(model && model.unitData && model.unitData.length > 0)?'padding-top:48px':'padding-top:5px'"
      >
        <div class="hdty-scroll" fill>
          <div class="hdty-tab-header hdty-diagram-floor is-left" style="max-height: 273px;">
            <div class="hdty-tab-title">
              <a
                style="height: 50px;line-height: 50px; "
                v-for="(floor, index) in model.floorData[currentActiveUnit]"
                href="javascript:;"
                class="hdty-tab-item"
                :class="{ 'is-active': currentActiveFloor === index }"
                @click="handleClickFloor(floor, index)"
              >
                <el-checkbox
                  v-if="isYw &&
                   (jzwInfo.jzwlx === '3'
                   || (jzwInfo.jzwlx === '6' && model.unitData[currentActiveUnit].label === '商铺')
                   || jzwInfo.jzwlx === '7')
                   && componentType !== '1'"
                  v-model="floor.isCheck"
                ></el-checkbox>
                {{ floor.label }}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="hdty-flex-fill">
        <div
          v-if="model && model.unitData && model.unitData.length > 0"
          class="hdty-tab-title hdty-diagram-unit"
        >
          <div
            v-for="(unit, index) in model.unitData"
            class="hdty-tab-item"
            :class="{ 'is-active': currentActiveUnit === index }"
            @click="handleClickUnit(unit, index)"
          >
            <!--            <el-checkbox-->
            <!--              v-if="componentType === '1' && unit.label !== '商铺'" v-model="unit.isCheck"-->
            <!--            ></el-checkbox>-->
            {{ unit.label }}
          </div>
        </div>
        <div
          v-if="model && model.householdData && model.householdData.length>0 && model.householdData[currentActiveUnit].length > 0"
          class="hdty-diagram-content"
          :style="(model.unitData && model.unitData.length > 20) ? 'min-height: 300px;':'min-height: 360px;'"
        >
          <div class fill style="overflow-x: auto">
            <a
              v-for="(floor, index) in model.householdData[currentActiveUnit]"
              :id="householdIdPrefix + index"
              class="hdty-diagram-household-floor"
              :style="jzwInfo.jzwlx === '1'?'':'white-space: nowrap'"
            >
              <div
                v-if="floor && floor.length > 0"
                :title="household.label+(household.hhZmMc?('('+household.hhZmMc+')'):'')"
                v-for="household in floor"
                :class="roomValues.find(e => e === household.value)?'hdty-diagram-household-active':'hdty-diagram-household'"
                :style="jzwInfo.jzwlx === '1'?'margin-bottom:10px':''"
                @click="handleClickHousehold(household, $event)"
              >
                <span>{{handleGetHouseCode(household.label)}}</span>
                <div
                  class="hdty-room-zm"
                  v-if="household.hhZmMc"
                >({{household.hhZmMc.length > 4 ? household.hhZmMc.substring(0,4) : household.hhZmMc}})</div>
              </div>
              <div v-else class="hdty-diagram-empty">暂无数据</div>
            </a>
          </div>
        </div>
        <div v-else class="hdty-diagram-empty">暂无数据</div>
      </div>
    </div>
    <!-- <map-building-chart ref="chartRef" @loadHouse="loadDiagram"></map-building-chart> -->
  </div>
</template>

<script>
import { dyfwList } from './api';
// import MapBuildingChart from "@/views/police-network/ybss/building/chart/MapBuildingChart";

export default {
  name: 'BuildingDiagram',
  provide() {
    return {
      hdBuildingDiagram: this
    };
  },
  props: {
    // 当建筑物类型
    jzwlx: {
      type: String,
      default: ''
    },
    // 当前激活单元索引
    activeUnit: {
      type: Number,
      default: 0
    },
    // 当前激活楼层索引
    activeFloor: {
      type: Number,
      default: 0
    },
    // 宽度
    width: {
      type: [Number, String],
      default: ''
    },
    // 高度
    height: {
      type: [Number, String],
      default: ''
    },
    // 当前已核查地址
    bzdzName: {
      type: [String],
      default: ''
    },
    // 业务是否允许选择楼层、建筑物（是：支持楼层多选，建筑物单选；否：只支持选择房间）
    isYw: {
      type: [Boolean],
      default: false
    },
    // 组件类型 1.查询组件 2.标准地址选择组件
    componentType: {
      type: [String],
      default: '2'
    },
    // 管辖机构支持传参
    sjgsdwdm: {
      type: [String],
      default: ''
    },
    sjgsdwdmName: {
      type: [String],
      default: ''
    }
  },
  components: {
    // MapBuildingChart: () =>
    //   import('@/views/police-network/ybss/building/chart/MapBuildingChart.vue')
  },
  data() {
    return {
      currentActiveUnit: this.activeUnit,
      currentActiveFloor: this.activeFloor,
      householdIdPrefix: 'Diagram_Household',
      // 房态图数据模型
      model: {
        unitData: [],
        floorData: [],
        householdData: []
      },
      // 建筑物编码
      jzwInfo: {
        dzbm: '',
        jzwlx: ''
      },
      // 当前选中建筑物信息
      activeJzwinfo: {
        label: '',
        dzbm: ''
      },
      // 当前选中所属房间对象
      roomLabels: [],
      roomValues: [],
      // 当前选中的单元
      unitLabels: [],
      unitValues: [],
      // 当前选中的楼层对象
      floorLabels: [],
      floorValues: [],
      // 当前选中的建筑物编码
      buildingLabels: [],
      buildingValues: [],
      loading: false,
      jzwmc: '',
      visible: false,
      isShowJzwHome: true
    };
  },
  computed: {
    pageWidth() {
      let width = String(this.width);
      if (width.includes('%') || width.includes('px')) {
        return width;
      } else if (width) {
        return width + 'px';
      }
    },
    pageHeight() {
      let height = String(this.height);
      if (height.includes('%') || height.includes('px')) {
        return height;
      } else if (height) {
        return height + 'px';
      }
    }
  },
  watch: {
    activeUnit: {
      handler(val) {
        if (this.currentActiveUnit !== val) {
          this.currentActiveUnit = val;
        }
      },
      immediate: false
    },
    activeFloor: {
      handler(val) {
        if (this.currentActiveFloor !== val) {
          this.currentActiveFloor = val;
        }
      },
      immediate: false
    }
  },
  methods: {
    // 加载建筑物平面示意图
    loadDiagram() {
      console.log('加载加载');

      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ssjzwDzbm: _this.jzwInfo.dzbm,
        jzwLx: _this.jzwInfo.jzwlx,
        jzwmc: _this.jzwmc
      };
      // 如果父级传了管辖机构，则给管辖机构赋值
      if (_this.sjgsdwdm) {
        dataParams.sjgsdwdm = _this.sjgsdwdm.substr(0, 8) + '0000';
        dataParams.sjgsdwdmName = _this.sjgsdwdmName;
      }
      // Lambda写法
      dyfwList(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            // 楼层多选-默认为未选中状态
            if (data.floorData) {
              data.floorData.forEach((e) => {
                e.forEach((h) => {
                  h.isCheck = false;
                });
              });
            }
            // 单元多选-默认为未选中状态
            if (data.unitData) {
              data.unitData.forEach((e) => {
                e.isCheck = false;
              });
            }
            _this.model = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    handleClickUnit(unit, index) {
      this.currentActiveUnit = index;
      // // 清空上级页面所选的建筑物和街路巷
      // this.$emit('handleClearJlxAndJzw');
      // setTimeout( ()=>{
      //   // 清空建筑物
      //   this.clearJzw();
      //   // 清空单元
      //   this.clearUnit();
      //   // 清空楼层、并取消勾选的楼层
      //   this.cancelCheckboxFloor();
      //   // 清空房间
      //   this.clearHoom();
      //   // 处理勾选的单元数据
      //   this.model.unitData.forEach( e => {
      //     if(e.isCheck){
      //       this.unitLabels.push( e.label);
      //       this.unitValues.push( e.value);
      //     }
      //   })
      //   this.$emit('handleSelectUnitList', this.unitLabels,this.unitValues)
      // },100)
    },
    handleClickFloor(floor, index) {
      this.currentActiveFloor = index;
      // 清空上级页面所选的建筑物和街路巷
      this.$emit('handleClearJlxAndJzw');
      setTimeout(() => {
        // 清空建筑物
        this.clearJzw();
        // 清空单元、并取消勾选的单元
        this.cancelCheckboxUnit();
        // 清空楼层
        this.clearFloor();
        // 清空房间
        if (
          this.isYw &&
          (this.jzwInfo.jzwlx === '3' ||
            (this.jzwInfo.jzwlx === '6' &&
              this.model.unitData[this.currentActiveUnit].label === '商铺'))
        ) {
          this.clearHoom();
        }
        // 处理勾选的楼层数据
        this.model.floorData[this.currentActiveUnit].forEach((e) => {
          if (e.isCheck) {
            this.floorLabels.push(e.label);
            this.floorValues.push(e.value);
          }
        });
        this.$emit('handleSelectList', this.floorLabels, this.floorValues);
      }, 100);
    },
    handleClickHousehold(household, e) {
      // 清空上级页面所选的建筑物和街路巷
      this.$emit('handleClearJlxAndJzw');
      // 清空建筑物
      this.clearJzw();
      // 清空单元、并取消勾选的单元
      this.cancelCheckboxUnit();
      // 清空楼层、并取消勾选的楼层
      this.cancelCheckboxFloor();
      if (
        this.isShowJzwHome ||
        this.jzwInfo.jzwlx === this.$global.dictItem.buildingType.pf
      ) {
        // 如果已选中，则执行取消选择；未选中，则执行选择
        let index = this.roomValues.findIndex((e) => e === household.value);
        if (index > -1) {
          this.roomLabels.splice(index, 1);
          this.roomValues.splice(index, 1);
        } else {
          let unitelabel =
            this.model.unitData && this.model.unitData.length > 0
              ? this.model.unitData[this.currentActiveUnit].label
              : '';
          // 如果是实有单位调用组件，允许多选；其他实有人口分析核查模块调用组件不允许多选
          let roomlabel =
            (household.hhZmMc ? household.hhZmMc : '') + household.label;
          if (this.isYw) {
            this.roomLabels.push(
              unitelabel +
                (this.jzwInfo.jzwlx === '1' &&
                household.value === this.jzwInfo.dzbm
                  ? ''
                  : roomlabel)
            );
            this.roomValues.push(household.value);
          } else {
            this.clearHoom();
            this.roomLabels.push(
              unitelabel +
                (this.jzwInfo.jzwlx === '1' &&
                household.value === this.jzwInfo.dzbm
                  ? ''
                  : roomlabel)
            );
            this.roomValues.push(household.value);
          }
        }
        this.$emit('handleSelectRoomList', this.roomLabels, this.roomValues);
      }
    },
    handleIntoMarker() {
      this.$refs.chartRef.visible = true;
      this.$refs.chartRef.id = this.jzwInfo.dzbm;
      this.$refs.chartRef.type = this.jzwInfo.jzwlx;
    },
    // 选择建筑物
    handleJzw() {
      // 清空单元、并取消勾选的单元
      this.cancelCheckboxUnit();
      // 清空楼层、并取消勾选的楼层
      this.cancelCheckboxFloor();
      // 清空建筑物
      this.clearJzw();
      // 清空房间
      this.clearHoom();
      this.buildingLabels = '';
      this.buildingValues.push(this.jzwInfo.dzbm);
      this.$emit('handleSelectJzw', this.buildingLabels, this.buildingValues);
    },
    // 选择当前所有平房
    handleJlxPf() {
      this.$emit('handleSelectJlxPf');
    },
    // 清空单元、并取消勾选的单元
    cancelCheckboxUnit() {
      this.clearUnit();
      if (this.model.unitData) {
        this.model.unitData.forEach((e) => {
          e.isCheck = false;
        });
      }
    },
    // 清空楼层、并取消勾选的楼层
    cancelCheckboxFloor() {
      this.clearFloor();
      this.model.floorData.forEach((e) => {
        e.forEach((h) => {
          h.isCheck = false;
        });
      });
    },
    // 清空小房态所有勾选以及数组值
    clearAllXft() {
      // 清空建筑物
      this.clearJzw();
      // 清空单元、并取消勾选的单元
      this.cancelCheckboxUnit();
      // 清空楼层、并取消勾选的楼层
      this.cancelCheckboxFloor();
      // 清空房间
      this.clearHoom();
    },
    // 清空建筑物
    clearJzw() {
      this.buildingLabels = [];
      this.buildingValues = [];
    },
    // 清空单元
    clearUnit() {
      this.unitLabels = [];
      this.unitValues = [];
    },
    // 清空楼层
    clearFloor() {
      this.floorLabels = [];
      this.floorValues = [];
    },
    // 清空房间
    clearHoom() {
      this.roomLabels = [];
      this.roomValues = [];
    },
    // 房间号获取
    handleGetHouseCode(code) {
      // 判断全是数字，判断大于5位才截取
      const regNum = /^[0-9]+$/;
      if (!regNum.test(code)) {
        // 判断是否包含汉字，包含汉字三个字以上显示...;不包含汉字，五个字以上显示...
        const reg = /^[\u4e00-\u9fa50-9]+$/;
        if (!reg.test(code)) {
          return code.length > 5 ? code.substring(0, 2) + '...' : code;
        } else {
          return code.length > 3 ? code.substring(0, 2) + '...' : code;
        }
      } else {
        return code.length > 5 ? code.substring(0, 2) + '...' : code;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-building-diagram {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  @include ft_font_color_first;
  .hdty-flex-fit {
    padding-top: 48px;
    + .hdty-flex-fill {
      .hdty-diagram-content {
        padding-left: 12px;
      }
      .hdty-diagram-household {
        width: 64px;
        height: 40px;
      }
    }
  }
  .hdty-diagram-unit {
    z-index: 1;
  }
  .hdty-diagram-content {
    position: absolute;
    width: 100%;
    height: 90%;
    margin-top: -36px;
    padding-top: 48px;
  }
  .hdty-diagram-household-floor {
    display: block;
    position: relative;
    /*white-space: nowrap;*/
    margin-bottom: 12px;
    .hdty-diagram-empty {
      padding: 10px 0 0 0;
      text-align: left;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  .hdty-diagram-household-active {
    display: inline-block;
    position: relative;
    vertical-align: top;
    width: 64px;
    height: 40px;
    margin-right: 12px;
    background-color: #4fb2f3;
    white-space: normal;
    overflow: hidden;
    text-align: center;
    color: #1672ac;
    font-size: 14px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    > span {
      display: inline-block;
      line-height: 20px;
      vertical-align: middle;
    }
    &:hover {
      cursor: pointer;
      background-color: #4fb2f3;
    }
    &::after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .hdty-diagram-household {
    display: inline-block;
    position: relative;
    vertical-align: top;
    width: 64px;
    height: 40px;
    margin-right: 12px;
    background-color: #aeddfb;
    white-space: normal;
    overflow: hidden;
    text-align: center;
    color: #1672ac;
    font-size: 14px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    > span {
      display: inline-block;
      line-height: 20px;
      vertical-align: middle;
    }
    &:hover {
      cursor: pointer;
      background-color: #4fb2f3;
    }
    &::after {
      content: '';
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    &:last-child {
      margin-right: 0;
    }
  }
  .hdty-tab-item {
    /*height: 42px;*/
    /*line-height: 42px;*/
    &.is-active {
      @include bg_main_color_first;
      @include bd_main_color_first;
      @include ft_base_color_first;
    }
  }
  .hdty-diagram-empty {
    display: block;
    padding: 20px 0;
    line-height: 1;
    @include ft_font_color_third;
    font-size: 14px;
    font-weight: 500;
    text-align: center;
    letter-spacing: 1px;
  }
}
.hdty-building-title {
  height: 50px;
  line-height: 50px;
}
.hdty-tab.is-left .hdty-tab-item,
.hdty-tab-title.is-left .hdty-tab-item,
.hdty-tab-header.is-left .hdty-tab-item {
  text-align: left;
}
.hdty-room-zm {
  margin-top: -6px;
  font-size: 12px;
  color: #033a5e;
}
</style>
