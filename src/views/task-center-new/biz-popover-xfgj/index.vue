<template>
  <div class="hdty-popover-box">
    <div class="con-track hdty-scroll" v-if="tableData && tableData.length > 0">
      <div
        class="track-item"
        v-for="(trajectory, index) in tableData"
        :class="{ item1: index === 0 }"
      >
        <div
          class="track-line"
          :style="{display: index === tableData.length - 1 ? 'none' : 'block'}"
        ></div>
        <div class="time">{{$utilDate.dateFtt(trajectory.checkTime, 'yyyy年MM月dd日 HH:mm:ss')}}</div>
        <div class="dot">
          <i class="icon-dot"></i>
        </div>
        <div class="content">
          <el-card class="box-card">
            <div class="con-card">
              <div style="width: 100%;margin-bottom: 5px;">
                <el-tag :type="getTagColor(trajectory.step)" size="mini">{{trajectory.step}}</el-tag>
              </div>
              <div class="con-card-description">
                <div class="description-item">操作人员：{{trajectory.name || '暂无操作人员'}}</div>
              </div>
              <div class="con-card-description">
                <div class="description-item">操作机构：{{trajectory.org || '暂无核查地址'}}</div>
              </div>
              <div class="con-card-description" v-if="trajectory.memo">
                <div class="description-item">备 注：{{trajectory.memo}}</div>
              </div>
              <!--              <div class="con-card-description" v-if="trajectory.step === '移交'">-->
              <!--                <div class="description-item">移交原因：{{trajectory.memo || '暂无移交原因'}}</div>-->
              <!--              </div>-->
              <!--              <div class="con-card-description" v-if="trajectory.step === '回退'">-->
              <!--                <div class="description-item">回退原因：{{trajectory.memo || '暂无回退原因'}}</div>-->
              <!--              </div>-->
              <!--              <div class="con-card-description" v-if="trajectory.stepType === '5'">-->
              <!--                <div class="description-item">撤回原因：{{trajectory.memo || '暂无撤回原因'}}</div>-->
              <!--              </div>-->
              <!--              <div class="con-card-description" v-if="trajectory.stepType === '10'">-->
              <!--                <div class="description-item">注销原因：{{trajectory.memo || '暂无注销原因'}}</div>-->
              <!--              </div>-->
              <div class="con-card-description" v-if="index === 0">
                <div
                  class="description-item"
                >任务当前机构/责任民警：{{trajectory.orgRecodeSjgsdwdm + (trajectory.userRecodeXm?'/':'') + trajectory.userRecodeXm}}</div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!--分页-->
      <div class="hdty-footer">
        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :current-page="pageOptions.current"
          :page-sizes="pageOptions.sizes"
          :page-size="pageOptions.size"
          :total="pageOptions.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { bizPage } from './api';

export default {
  name: 'index',
  components: {},
  mixins: [hdList],
  props: {
    prop: String,
    // 任务id
    taskId: {
      type: [String],
      default: ''
    },
    // 请求的接口
    api: {
      type: Function,
      default: bizPage
    }
  },
  data() {
    return {
      tableData: [],
      ckData: {},
      row: {},
      triggerLoading: false,
      pageOptions: {
        current: 1,
        sizes: [5, 20, 50, 100],
        size: 5,
        total: 0
      }
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    // 动态设置轨迹中tag的颜色
    getTagColor(step) {
      if (['退回', '回退', '注销'].includes(step)) {
        return 'danger';
      } else if (['移交'].includes(step)) {
        return 'warning';
      } else if (['指派', '认领'].includes(step)) {
        return 'primary';
      } else {
        return 'success';
      }
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      // _this.tableData = [];
      _this.triggerLoading = true;
      setTimeout(() => {
        // 参数
        let dataParams = {
          id: _this.taskId,
          ..._this.pageOptions
        };
        _this
          .api(dataParams)
          .then((response) => {
            //响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.tableData = data.records;
              _this.pageOptions.total = data.total;
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            _this.triggerLoading = false;
          });
      }, 100);
    }
  }
};
</script>

<style lang="scss" scoped>
.con-track {
  //max-height: 710px;
  .track-item {
    padding-left: 60px;
    padding-bottom: 10px;
    display: flex;
    position: relative;
    .track-line {
      position: absolute;
      width: 4px;
      background-color: #2985f7;
      left: 212px;
      top: 18px;
      bottom: -16px;
      z-index: 1;
    }
    .time {
      width: 124px;
      height: 44px;
      line-height: 20px;
      text-align: center;
      font-size: 16px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      .con-time-type {
        position: absolute;
        top: 41px;
        font-size: 14px;
        height: 20px;
        line-height: 20px;
        color: #818181;
      }
      .con-rklx {
        position: absolute;
        top: 54px;
        background-color: #ff7000;
        color: #ffffff;
        border-radius: 3px;
        height: 28px;
        line-height: 27px;
        padding: 0 5px;
      }
      .con-rklx-rhyz {
        position: absolute;
        top: 54px;
        left: 0px;
        background-color: #ff7000;
        color: #ffffff;
        border-radius: 3px;
        height: 28px;
        line-height: 27px;
        padding: 0 5px;
      }
      .con-rklx-lc {
        position: absolute;
        top: 54px;
        left: 79px;
        background-color: #01b3c1;
        color: #ffffff;
        border-radius: 3px;
        height: 28px;
        line-height: 27px;
        padding: 0 5px;
      }
      .con-rklx-wlc {
        position: absolute;
        top: 54px;
        left: 63px;
        background-color: #ff0b00;
        color: #ffffff;
        border-radius: 3px;
        height: 28px;
        line-height: 27px;
        padding: 0 5px;
      }
    }
    .dot {
      width: 60px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      z-index: 2;
      .icon-dot {
        font-size: 24px;
        color: #2985f7;
      }
    }
    .content {
      width: 80%;
      padding-left: 2px;
      .content-description {
        font-family: 'Microsoft YaHei', serif;
        height: 40px;
        line-height: 40px;
        max-width: 800px;
        font-size: 16px;
        .state-text {
          color: #ffffff;
          border-radius: 3px;
          height: 26px;
          line-height: 26px;
          padding: 0 5px;
          text-align: center;
          min-width: inherit;
          width: 90px;
        }
        .state-text-danger {
          background-color: #ff0b00;
        }
        .state-text-success {
          background-color: #01b3c1;
        }
      }
      ::v-deep .el-card {
        width: 550px;
        border-color: #f5f6f6;
        background-color: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        .el-card__body {
          //padding-right: 0;
          //padding-top: 10px;
          padding: 10px !important;
          .con-card {
            //display: flex;
            padding-top: 10px;
            padding-right: 10px;
            font-size: 16px;
            .con-card-time {
              width: 50px;
            }
            .con-card-description {
              flex: 1;
              .description-item {
                margin-bottom: 10px;
                display: flex;
                span {
                  display: inline-block;
                  min-width: 80px;
                }
              }
            }
          }
        }
      }
      p {
        width: 400px;
      }
    }
    .description-item {
      margin-top: 5px;
      display: flex;
    }
    &.item1:before {
      content: '';
      display: block;
      width: 36px;
      height: 24px;
      left: 15px;
      top: 9px;
      position: absolute;
      background: url('../../global/images/new.png') no-repeat 50% 50%;
      background-size: 100% 100%;
    }
  }
}

.no-track-data {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #5c5c5c;
  font-size: 16px;
}
.el-tag.el-tag--small {
  line-height: 28px !important;
}
::v-deep .el-card__body {
  padding: 10px !important;
}
.con-card.el-card {
  padding-bottom: 0;
}
</style>
