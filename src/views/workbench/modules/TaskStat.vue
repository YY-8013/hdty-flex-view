<template>
  <div class="task-box">
    <div class="work-section">
      <div class="work-section-title">我的任务</div>
      <div class="work-section-body">
        <div class="stat-box">
          <div class="stat-item" v-for="item in tjType" :key="item.prop">
            <div class="stat-item-icon">
              <img src="../images/tjIcon.png" alt="" />
            </div>
            <div class="stat-item-num" :style="{ color: item.color }">
              <count-to
                v-if="!item.hasRate"
                :startVal="0"
                :endVal="taskStat.myTask[item.prop]"
                :duration="1500"
              ></count-to>
              <span v-if="item.hasRate">{{ taskStat.myTask[item.prop] }}</span>
              <span v-if="item.hasRate" class="rate">%</span>
            </div>
            <div class="stat-item-label">
              {{ item.label }}
            </div>

            <div class="stat-item-sub">
              <div class="sub-label">
                {{ item.childLabel }}
              </div>
              <div class="sub-num" :style="{ color: item.subColor }">
                <count-to
                  v-if="!item.hasRate"
                  :startVal="0"
                  :endVal="taskStat.myTask[item.childProp]"
                  :duration="1500"
                ></count-to>
                <span v-if="item.hasRate">{{
                  taskStat.myTask[item.childProp]
                }}</span>
                <span v-if="item.hasRate" class="rate">%</span>
              </div>
            </div>

            <div
              v-if="item.hasOtherSub"
              class="stat-item-sub stat-item-sub-other"
            >
              <div class="sub-label">
                {{ item.otherSubLabel }}
              </div>
              <div class="sub-num" :style="{ color: item.otherSubColor }">
                <count-to
                  v-if="!item.hasRate"
                  :startVal="0"
                  :endVal="taskStat.myTask[item.otherSubProp]"
                  :duration="1500"
                ></count-to>
                <span v-if="item.hasRate">{{
                  taskStat.myTask[item.otherSubProp]
                }}</span>
                <span v-if="item.hasRate" class="rate">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="work-section">
      <div class="work-section-title">本机构任务</div>
      <div class="work-section-body">
        <div class="stat-box">
          <div class="stat-item" v-for="item in tjType" :key="item.prop">
            <div class="stat-item-icon">
              <img src="../images/tjIcon.png" alt="" />
            </div>
            <div class="stat-item-num" :style="{ color: item.color }">
              <!-- <span> {{ taskStat.orgTask[item.prop] }}</span> -->
              <count-to
                v-if="!item.hasRate"
                :startVal="0"
                :endVal="taskStat.orgTask[item.prop]"
                :duration="1500"
              ></count-to>
              <span v-if="item.hasRate">{{ taskStat.orgTask[item.prop] }}</span>
              <span v-if="item.hasRate" class="rate">%</span>
            </div>
            <div class="stat-item-label">
              {{ item.label }}
            </div>

            <div class="stat-item-sub">
              <div class="sub-label">
                {{ item.childLabel }}
              </div>
              <div class="sub-num" :style="{ color: item.subColor }">
                <!-- <span> {{ taskStat.orgTask[item.childProp] }}</span> -->
                <count-to
                  v-if="!item.hasRate"
                  :startVal="0"
                  :endVal="taskStat.orgTask[item.childProp]"
                  :duration="1500"
                ></count-to>
                <span v-if="item.hasRate">{{
                  taskStat.orgTask[item.childProp]
                }}</span>
                <span v-if="item.hasRate" class="rate">%</span>
              </div>
            </div>

            <div
              v-if="item.hasOtherSub"
              class="stat-item-sub stat-item-sub-other"
            >
              <div class="sub-label">
                {{ item.otherSubLabel }}
              </div>
              <div class="sub-num" :style="{ color: item.otherSubColor }">
                <count-to
                  v-if="!item.hasRate"
                  :startVal="0"
                  :endVal="taskStat.orgTask[item.otherSubProp]"
                  :duration="1500"
                ></count-to>
                <span v-if="item.hasRate">{{
                  taskStat.orgTask[item.otherSubProp]
                }}</span>
                <span v-if="item.hasRate" class="rate">%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="time-range">
      <div
        :class="[
          'time-item',
          { 'active-item': timeItem.value === currentTime }
        ]"
        v-for="(timeItem, index) in timeRange"
        :key="timeItem.value"
        @click="changeTime(timeItem)"
      >
        {{ timeItem.label }}
      </div>
    </div>
  </div>
</template>

<script>
import { taskTotal } from "./api";

export default {
  name: "TaskStat",
  data() {
    return {
      currentTime: "5",
      timeRange: [
        {
          label: "全部",
          value: "5"
        },
        {
          label: "今天",
          value: "0"
        },
        {
          label: "近3天",
          value: "1"
        },
        {
          label: "本周",
          value: "2"
        },
        {
          label: "本月",
          value: "3"
        },
        {
          label: "本年",
          value: "4"
        }
      ],
      tjType: [
        {
          label: "全部任务",
          prop: "taskNum",
          childLabel: "今日新增",
          childProp: "todayTaskNum",
          color: "#ffb618",
          subColor: "#14eaa1"
        },
        {
          label: "待处理任务",
          prop: "dclNum",
          childLabel: "即将超期",
          childProp: "jjcqDclNum",
          color: "#ff6f18",
          subColor: "#ffcc66",
          hasOtherSub: true,
          otherSubLabel: "已超期",
          otherSubProp: "ycqDclNum",
          otherSubColor: "#ff6666"
        },
        {
          label: "已处理任务",
          prop: "yclNum",
          childLabel: "超期处理",
          childProp: "cqYclNum",
          color: "#18f7ff",
          subColor: "#ff6666"
        },
        {
          label: "完成任务率",
          prop: "wclNum",
          childLabel: "超期任务完成率",
          childProp: "cqWclNum",
          color: "#14eaa1",
          subColor: "#ff6666",
          hasRate: true
        }
      ],
      taskStat: {
        myTask: {
          taskNum: 120,
          todayTaskNum: 12,
          dclNum: 24,
          jjcqDclNum: 4,
          yclNum: 96,
          cqYclNum: 24,
          wclNum: 80.0,
          cqWclNum: 25.0
        },
        orgTask: {
          taskNum: 1480,
          todayTaskNum: 89,
          dclNum: 236,
          jjcqDclNum: 42,
          yclNum: 1244,
          cqYclNum: 298,
          wclNum: 84.1,
          cqWclNum: 24.0
        }
      }
    };
  },
  mounted() {
    this.initData();
  },
  methods: {
    // 加载表单之前
    initData() {
      let _this = this;
      _this.$nextTick(() => {
        // 初始化滚动区域;
        // 加载表单
        _this.loadForm();
      });
    },
    changeTime(info) {
      if (info.value !== this.currentTime) {
        this.currentTime = info.value;
        this.loadForm();
      }
    },
    // 加载表单
    loadForm() {
      let _this = this;
      // 参数
      let dataParams = {
        stateDateType: _this.currentTime
      };
      // Lambda写法
      taskTotal(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.taskStat = data.taskStat;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.task-box {
  position: relative;
  height: 100%;
  .work-section {
    height: 50%;
  }
}
@import "../css/common.scss";

.time-range {
  position: absolute;
  left: -56px;
  top: 20px;
  width: 50px;
  .time-item {
    background-color: rgba(11, 59, 107, 1);
    color: #d0d0d0;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    cursor: pointer;
    &.active-item {
      color: #fff;
      font-weight: bold;
      background-color: #1156be;
    }
  }
}

.stat-box {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: 100%;
  .stat-item {
    position: relative;
    width: 23%;
    // max-width: 250px;
    height: 120px;
    background-color: rgba(23, 94, 201, 0.5);
    border-radius: 8px;
    &-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 96px;
      height: 114px;
      img {
        width: 100%;
        height: 100%;
        // animation: rotate infinite 2s linear;
      }
    }

    &-num {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      font-size: 52px;
      font-weight: bold;

      width: 100%;
      display: flex;
      justify-content: center;
      align-items: flex-end;
      line-height: 1;
      .rate {
        font-size: 40px;
        line-height: 1.2;
      }
    }

    &-label {
      position: absolute;
      right: 16px;
      top: 5px;
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }

    &-sub {
      position: absolute;
      right: 16px;
      bottom: 2px;
      font-size: 15px;
      display: flex;
      color: #e4e4e4;

      &-other {
        bottom: 22px;
      }
      .sub-label {
        margin-right: 4px;
        font-weight: 300;
      }
      .sub-num {
        display: flex;
        font-weight: bold;
      }
    }
  }
}

@keyframes rotate {
  100% {
    transform: rotate(-360deg);
  }
}
</style>
