<template>
  <div class="con-area" v-loading="handleLoading">
    <div class="area-head">
      <div class="head">
        <i class="el-icon-s-promotion"></i>
        审批轨迹
      </div>
    </div>
    <div class="area-body">
      <!--审批轨迹-->
      <el-card class="con-card box-card">
        <div class="body">
          <div
            class="con-track hdty-scroll"
            v-if="trajectoryList && trajectoryList.length > 0"
          >
            <div
              class="track-item"
              v-for="(trajectory, index) in trajectoryList"
              :class="{ 'item-new': trajectory.isNew }"
            >
              <div
                :class="[
                  'track-line',
                  { 'track-line-dsp': trajectory.type === 'dsp' }
                ]"
                :style="{
                  display:
                    index === trajectoryList.length - 1 ? 'none' : 'block'
                }"
              ></div>
              <div v-if="trajectory.type !== 'dsp'" class="time">
                <div>
                  {{ $utilDate.dateFtt(trajectory.spTime, "yyyy年MM月dd日") }}
                </div>
                <div class="suf-time">
                  {{ $utilDate.dateFtt(trajectory.spTime, "HH:mm:ss") }}
                </div>
                <div
                  class="trajectory-type"
                  :class="
                    trajectory.spRecordType === '02'
                      ? 'text-color-2'
                      : 'text-color-4'
                  "
                >
                  {{ trajectory.spRecordType === "02" ? "申请" : "审批" }}
                </div>
                <div
                  v-show="
                    showRwDetail &&
                    trajectory.userRecodeId &&
                    currentTaskId !== trajectory.userRecodeId
                  "
                  class="rw-detail-btn"
                >
                  <el-tag type="success" @click="handleTaskDetail(trajectory)"
                    >任务办结详情</el-tag
                  >
                </div>
              </div>
              <div v-else class="time"></div>
              <div class="dot">
                <i
                  :class="[
                    'icon-dot',
                    { 'icon-dot-dsp': trajectory.type === 'dsp' }
                  ]"
                ></i>
              </div>
              <div v-if="trajectory.type !== 'dsp'" class="content">
                <div class="content-description hdty-elip">
                  <span class="text-bold">{{ trajectory.spUsername }}</span>
                  &nbsp;&nbsp;&nbsp;
                  <span class="text-bold text-color-2">{{
                    trajectory.spOrgIdText
                  }}</span>
                </div>
                <el-card
                  class="box-card"
                  :style="{
                    'background-color':
                      trajectory.spRecordType === '02' ? '#fff9e2' : 'inherit'
                  }"
                >
                  <div class="con-card">
                    <div class="con-card-time">
                      {{
                        trajectory.spRecordType === "02"
                          ? "申请原因"
                          : "审批意见"
                      }}：
                    </div>
                    <div class="con-card-description">
                      {{ trajectory.spMemo }}
                    </div>
                  </div>
                  <div class="con-card" v-if="trajectory.spRecordType !== '02'">
                    <div class="con-card-time">审批结果：</div>
                    <div class="con-card-description tag-dark">
                      <div
                        class="tag-dark"
                        :class="{
                          'back-color-5': trajectory.spRecordType === '01',
                          'back-color-1': trajectory.spRecordType === '00'
                        }"
                      >
                        {{ trajectory.spRecordTypeText }}
                      </div>
                    </div>
                  </div>
                </el-card>
              </div>
              <!-- 待审批部分 -->
              <div v-else class="content dsp-content">
                <el-card class="dsp-card box-card">
                  <div class="dsp-header">
                    <i class="el-icon-time dsp-icon"></i>
                    <span class="dsp-title">待审批</span>
                  </div>

                  <div class="dsp-body">
                    <!-- spMode = 1：人员 -->
                    <div class="dsp-row" v-if="trajectory.spMode === '1'">
                      <span class="label">待审批人：</span>
                      <span class="value text-color-3">
                        <span
                          v-for="(user, idx) in trajectory.sprInfoList"
                          :key="idx"
                          class="dsp-user"
                          :title="`联系电话：${user.userLxdh}`"
                        >
                          <span class="dsp-user-name">{{ user.userXm }}</span>

                          <span class="dsp-user-org">
                            （{{ user.orgName }}）
                          </span>
                        </span>
                      </span>
                    </div>

                    <!-- spMode = 0 / 2：机构或级别 -->
                    <div class="dsp-row" v-else>
                      <span class="label">待审批单位：</span>
                      <span class="value text-color-3">{{
                        trajectory.spOrgName
                      }}</span>
                      <el-popover
                        placement="right"
                        width="280"
                        trigger="click"
                        popper-class="custom-spr-popover"
                        v-if="
                          trajectory.sprInfoList &&
                          trajectory.sprInfoList.length > 0
                        "
                      >
                        <div class="spr-info-list hdty-scroll">
                          <div
                            class="spr-item"
                            v-for="(user, idx) in trajectory.sprInfoList"
                            :key="idx"
                          >
                            <span class="user-name">{{ user.userXm }}</span>
                            <span class="user-lxdh">{{ user.userLxdh }}</span>
                          </div>
                        </div>
                        <el-button
                          slot="reference"
                          type="warning"
                          plain
                          size="mini"
                          class="btn-check"
                        >
                          查看可审批人员
                        </el-button>
                      </el-popover>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
          <div class="no-track-data" v-else>暂无数据</div>
        </div>
      </el-card>
    </div>
    <new-task-center-del-detail ref="rwDetailRef"></new-task-center-del-detail>
  </div>
</template>

<script>
import { hdList, hdForm } from "@/utils/util-framework";
import { spgjPage } from "./api";

export default {
  name: "ApproveTrajectory",
  provide() {
    return {
      ApproveTrajectory: this
    };
  },
  props: {
    // 是否展示任务办结详情按钮
    showRwDetail: {
      type: Boolean,
      default: true
    },
    currentTaskId: {
      type: String,
      default: ""
    }
  },
  // inject: [''], // 两个地方在用，设置 inject 属性时需注意
  mixins: [hdList, hdForm],
  components: {
    NewTaskCenterDelDetail: () =>
      import("@/views/task-center-new/taskdel/TaskDealDetail").then(
        (c) => c.default
      )
  },
  data() {
    return {
      // 查询数据
      queryData: {
        id: ""
      },
      // 轨迹信息列表
      trajectoryList: []
    };
  },
  mounted() {},
  methods: {
    // 初始化数据
    initData(spId) {
      // 先清空数据
      this.resetData();
      this.queryData.id = spId;
      // 加载轨迹信息
      this.loadTrajectoryInfo();
    },
    // 清空数据
    resetData() {
      // 清空轨迹信息列表
      this.trajectoryList = [];
    },
    // 任务详情
    handleTaskDetail(info) {
      this.$refs.rwDetailRef.visible = true;
      this.$refs.rwDetailRef.row = {
        vo: { taskUserRecodeId: info.userRecodeId }
      };
      this.$refs.rwDetailRef.beforeLoadForm();
    },
    // 加载轨迹信息
    loadTrajectoryInfo() {
      let _this = this;
      _this.handleLoading = true;
      // 参数
      let dataParams = {
        ..._this.queryData
      };
      // Lambda写法
      spgjPage(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.trajectoryList = (data.vo.fkSpRecordList || []).map(
              (item, index) => {
                if (index === 0) {
                  _this.$set(item, "isNew", true);
                }
                return item;
              }
            );

            // 审批中
            if (data.vo.spState === "2" && data.vo.dspInfo) {
              let dspInfo = {
                ...data.vo.dspInfo,
                type: "dsp"
              };
              _this.trajectoryList.unshift(dspInfo);
            }
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.log(error);
        })
        .finally(() => {
          _this.handleLoading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.con-track {
  .track-item {
    padding-left: 60px;
    padding-bottom: 10px;
    display: flex;
    position: relative;
    .track-line {
      position: absolute;
      left: 213px;
      top: 18px;
      bottom: -16px;
      z-index: 1;
      border-left: 4px solid #2985f7; /* 相当于宽度4px */
      margin-left: -1px; /* 让线条居中在left位置 */
      &.track-line-dsp {
        top: 28px;
        bottom: -8px;
        border-left: 4px dashed #ff9933; /* 相当于宽度4px */
      }
    }
    .time {
      width: 124px;
      height: 40px;
      line-height: 40px;
      font-size: 16px;
      text-align: right;
      position: relative;
      .suf-time {
        position: absolute;
        right: 2px;
        top: 24px;
      }
      .trajectory-type {
        position: absolute;
        left: 5px;
        top: 24px;
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
        transition: all 0.3s linear;

        &.icon-dot-dsp {
          color: #ff9933;
          animation: pending 1.5s linear infinite;
        }
      }
    }

    .content {
      padding-left: 2px;
      .content-description {
        font-family: "Microsoft YaHei", serif;
        width: 500px;
        height: 40px;
        line-height: 40px;
        display: flex;
        font-size: 16px;
      }
      ::v-deep .el-card {
        width: 500px;
        border-color: #f5f6f6;
        background-color: #ffffff;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
        .el-card__body {
          padding-right: 0;
          padding-top: 10px;
          .con-card {
            display: flex;
            padding-top: 10px;
            padding-right: 10px;
            font-size: 16px;
            .con-card-time {
              width: 80px;
              /*color: #888888;*/
            }
            .con-card-description {
              flex: 1;
              .type-text {
                background-color: #ff7000;
                color: #ffffff;
                padding: 3px 5px;
                border-radius: 3px;
              }
            }
          }
        }
      }
      p {
        width: 400px;
      }
    }
    &.item-new:before {
      content: "";
      display: block;
      width: 36px;
      height: 24px;
      left: 15px;
      top: 9px;
      position: absolute;
      background: url("./images/new.png") no-repeat 50% 50%;
      background-size: 100% 100%;
    }
  }
}

/* 呼吸灯效果 */
@keyframes pending {
  0%,
  100% {
    opacity: 0.3;
    filter: drop-shadow(0 0 5px rgba(255, 153, 51, 0.5));
  }
  50% {
    opacity: 1;
    filter: drop-shadow(0 0 10px rgba(255, 153, 51, 0.8));
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

.rw-detail-btn {
  margin-top: 10px;
  cursor: pointer;
}

.dsp-content {
  .dsp-card {
    width: 520px;
    background-color: #fff8ef !important;
    border-color: #ffe3c4 !important;
    box-shadow: 0 2px 8px rgba(255, 153, 51, 0.2) !important;

    transition: all 0.3s ease;
    &:hover {
      box-shadow: 0 3px 12px rgba(255, 153, 51, 0.35) !important;
    }

    .el-card__body {
      padding: 15px 20px;
    }

    .dsp-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      .dsp-icon {
        color: #ff9933;
        font-size: 18px;
        margin-right: 6px;
        animation: pending 1.5s linear infinite;
      }
      .dsp-title {
        font-weight: bold;
        color: #ff7f0e;
        font-size: 16px;
      }
    }

    .dsp-body {
      .dsp-row {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        margin-top: 8px;
        font-size: 15px;
        .label {
          color: #555;
          width: 90px;
          font-weight: 500;
        }
        .value {
          flex: 1;
          color: #333;
        }
        .dsp-user {
          background-color: #fff3e0;
          border-radius: 4px;
          padding: 2px 6px;
          margin-right: 5px;
          margin-bottom: 5px;
          display: inline-block;

          &-org {
            font-size: 13px;
          }
        }
        .btn-check {
          margin-left: 8px;
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.spr-info-list {
  max-height: 260px;
  background-color: #fffdf9;
  border-radius: 8px;
  border: 1px solid #ffe3c4;
  box-shadow: 0 2px 10px rgba(255, 153, 51, 0.2);
  padding: 8px 0;

  .spr-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 14px;
    font-size: 14px;
    border-bottom: 1px dashed #f1d4a8;
    color: #333;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #fff6e5;
    }

    &:last-child {
      border-bottom: none;
    }

    .user-name {
      font-weight: 600;
      color: #ff8a00;
      flex: 1;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-lxdh {
      color: #666;
      font-size: 13px;
      margin-left: 10px;
    }
  }
}

.custom-spr-popover {
  padding: 0 !important; // 去掉默认 padding
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}
</style>
