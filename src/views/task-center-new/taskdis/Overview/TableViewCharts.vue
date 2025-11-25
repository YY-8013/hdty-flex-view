<template>
  <div class="hdty-container" style="padding: 10px 0">
    <div class="hdty-header" style="padding-left:10px;">
      <el-form
        :inline="true"
        :model="queryData"
        ref="queryRef"
        size="small"
        :rules="rules"
        @keyup.enter.native="handleQuery"
      >
        <hd-expand>
          <hd-expand-header ref="expandHeaderRef">
            <el-form-item prop="orgId" label="管辖机构">
              <hd-organ
                v-model="queryData.orgId"
                :model-text.sync="extendData.orgId"
                :clearable="false"
                :showLevel="'5'"
                placeholder="请选择管辖机构"
              ></hd-organ>
            </el-form-item>
            <el-form-item
              class="con-cjsj"
              label="推送时间"
              prop="pushTime">
              <el-date-picker
                v-model="queryData.pushTime"
                type="daterange"
                :picker-options="pickerOptions"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyyMMddHHmmss"
                @change="handleDateChange"
                align="right">
              </el-date-picker>
            </el-form-item>
          </hd-expand-header>
          <hd-expand-body>
            <el-form-item label="标准件类型" prop="formIdList">
              <!--选择表单-->
              <biz-form-select v-model="queryData.formIdList" multiple ref="formSelectRef" placeholder="请选择标准件类型"></biz-form-select>
            </el-form-item>
          </hd-expand-body>
        </hd-expand>
      </el-form>
      <hd-button-container>
        <hd-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</hd-button>
<!--        <el-button-->
<!--          icon="el-icon-delete"-->
<!--          @click="handleClear">-->
<!--          清空-->
<!--        </el-button>-->
      </hd-button-container>
    </div>
    <div id="myChart" style="width: 100%;height: 90%;" v-loading="loading"></div>
  </div>
</template>
<script>
import { hdList } from '@/utils/util-framework';

import {bzjState} from './../../api'
export default {
  name: "TypeView",
  components: {},
  props: {
    prop: String,
    // 机构
    orgId: {
      type: [String],
      default: ''
    },
  },
  mixins: [hdList],
  watch: {
    'orgId': {
      handler(val) {
        if (val) {
          this.handlePieType();
        }
      },
      immediate: false
    }
  },
  data() {
    return {
      loading: '',
      // 查询
      queryData: {
        orgId: this.$utilPublic.getUserOrgId(),
        pushTime: [this.$utilDate.dateFtt(new Date(),'yyyyMM01000000'),this.$utilDate.dateFtt(new Date(),'yyyyMMdd235959')],
        formIdList: [],
      },
      // 查询扩展
      extendData: {
        orgId: this.$utilPublic.getUserOrgName()
      },
      // 验证
      rules: {},
      // 圆的类型
      isPie: true,
      // 图表对象
      myChart: null,
      // 定时器
      interval: null,
      // 表单
      labelArray: ['矛盾纠纷排查', '废旧金属检查', '公章可知检查', '机动车修理检查', '开锁业检查'],
      // 下发数
      seriesArray: [50, 132, 101, 134, 90],
      // 完成量
      seriesArray1: [10, 132, 10, 10, 10],
      // 完成率
      seriesArray2: [10, 100, 10, 10, 10],
    }
  },
  mounted() {
    let _this = this;
    // 初始化数据
    _this.initData();
    // 网页大小改变时，图形自适应变化
    window.addEventListener('resize', function () {
      if (_this.myChart) {
        _this.myChart.resize();
      }
    });
  },
  destroyed() {
    // 网页销毁时关闭定时器
    this.destroyInterval();
  },
  methods: {
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 销毁定时器
    destroyInterval() {
      if (this.interval) {
        clearTimeout(this.interval);
      }
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.initData();
        }
      });
    },
    // 切换饼状或环状
    handlePieType() {
      // 切换方向重新加载图表
      this.initData();
    },
    handleDateChange(value) {
      if (value && value.length === 2) {
        this.queryData.pushTime = [value[0], this.$utilDate.dateFtt(value[1],'yyyyMMdd235959')];
      }
    },
    // 初始化数据
    initData() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
       ..._this.queryData
      };
      // Lambda写法
      bzjState(dataParams).then(response => {
        // 响应成功回调
        let {success, data} = response.data;
        if (success) {
          _this.labelArray = data.labelArray;
          _this.seriesArray = data.seriesArray;
          _this.seriesArray1 = data.seriesArray1;
          _this.seriesArray2 = data.seriesArray2;
          // 处理数据少的情况
          if (_this.labelArray.length < 15) {
            for (let i = 0; i <= (15 - _this.labelArray.length); i++) {
              _this.labelArray.push('');
            }
          }
          // 初始化图表
          _this.initChart();
        }
      }).catch(error => {
        // 响应错误回调
        console.error(error);
      }).finally(() => {
        _this.loading = false;
      });
    },
    // 初始化图表
    initChart() {
      let _this = this;
      // 清空图表内容，保证图形每次都可以执行渲染动画以及重新加载图例，防止图例卡顿
      if (_this.myChart) {
        _this.myChart.clear(); // 清空绘画内容，清空后实例可用
        _this.myChart.dispose(); // 释放图表实例，释放后实例不再可用
      }
      _this.myChart = this.$echarts.init(document.getElementById('myChart'));
      _this.myChart.setOption(
        {
          grid: {
            top: '10%',
            left: '1%',
            right: '1%',
            bottom: '10%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: _this.labelArray,
            axisLine: {
              lineStyle: {
                type: 'solid',
                // color: '#fff', //左边线的颜色
                width: '2' //坐标线的宽度
              }
            },
            axisLabel: {
              interval: 0, // 显示所有标签
              // rotate: 10, // 文字倾斜45度
              // margin: 20,  // 文字与轴线之间的距离
              textStyle: {
                // color: '#fff', //坐标值得具体的颜色
              }
            }
          },
          yAxis: {
            type: 'value',
            axisLine: {
              lineStyle: {
                type: 'solid',
                // color: '#fff', //左边线的颜色
                width: '2' //坐标线的宽度
              }
            },
            axisLabel: {
              textStyle: {
                // color: '#fff', //坐标值得具体的颜色
              }
            }
          },
          // 相关项颜色
          color: ['#0c84c6'],
          dataZoom: [
            {
              // 设置滚动条的隐藏与显示
              show: true,
              // 设置滚动条类型
              type: "slider",
              // 设置背景颜色
              backgroundColor: "rgb(19, 63, 100)",
              // 设置选中范围的填充颜色
              fillerColor: "rgb(16, 171, 198)",
              // 设置边框颜色
              borderColor: "rgb(19, 63, 100)",
              // 是否显示detail，即拖拽时候显示详细数值信息
              showDetail: false,
              // 数据窗口范围的起始数值
              startValue: 0,
              // 数据窗口范围的结束数值（一页显示多少条数据）
              endValue: 13,
              // empty：当前数据窗口外的数据，被设置为空。
              // 即不会影响其他轴的数据范围
              filterMode: "empty",
              // 设置滚动条宽度，相对于盒子宽度
              width: "50%",
              // 设置滚动条高度
              height: 8,
              // 设置滚动条显示位置
              left: "center",
              // 是否锁定选择区域（或叫做数据窗口）的大小
              zoomLoxk: true,
              // 控制手柄的尺寸
              handleSize: 0,
              // dataZoom-slider组件离容器下侧的距离
              bottom: 0,
            },
            {
              // 没有下面这块的话，只能拖动滚动条，
              // 鼠标滚轮在区域内不能控制外部滚动条
              type: "inside",
              // 滚轮是否触发缩放
              zoomOnMouseWheel: false,
              // 鼠标滚轮触发滚动
              moveOnMouseMove: true,
              moveOnMouseWheel: true,
            },
          ],
          series: [
            {
              data: _this.seriesArray2,
              barWidth: '20%', // 设置柱子宽度为类目宽度的50%
              type: 'bar',
              label: {
                show: true,
                position: 'top', // 可以是 'top', 'left', 'right', 'bottom', 'inside', 或 'insideLeft'
                formatter: function(params) {
                  // 根据需要自定义换行位置
                  return `{a|${_this.seriesArray1[params.dataIndex]} / ${_this.seriesArray[params.dataIndex]}}\n{b|完成率:${params.value}%}`;
                },
                rich: {
                  a: {
                    color: '#0c84c6', // 设置文本颜色为红色
                    lineHeight: 20, // 设置文本行高
                    textAlign: 'center'
                  },
                  b: {
                    color: 'red', // 设置文本颜色为红色
                    lineHeight: 20 // 设置文本行高
                  }
                }
              }
            },
          ]
        }
      );
    },
  }
}
</script>
<style scoped>

</style>
