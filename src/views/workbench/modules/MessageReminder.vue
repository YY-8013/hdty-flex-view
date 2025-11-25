<template>
  <div class="work-section">
    <div
      class="work-section-title work-section-title-link"
      @click="handleSelect"
    >
      消息提醒
    </div>
    <div class="work-section-body" style="padding-top: 4px">
      <div class="message-list hdty-dp-scroll">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          class="message-item"
          :class="{ unread: item.vo.readType === '0' }"
        >
          <div class="message-header">
            <span class="message-type">{{ item.vox.msgType }}</span>
            <span
              class="message-status-tag"
              :class="{
                'status-unread': item.vo.readType === '0',
                'status-read': item.vo.readType !== '0'
              }"
            >
              {{ item.vox.readType }}
            </span>
          </div>
          <div class="message-content" :title="item.vo.description">
            {{ item.vo.description }}
          </div>
          <div class="message-footer">
            <span class="message-time">{{ item.vox.createTime }}</span>
            <el-button
              v-if="false && item.vo.handleType === '1'"
              type="primary"
              size="mini"
              class="message-handle-btn"
            >
              处理
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { xxData } from "./data";
import { page } from "@/api/msg";
import { msgPage } from "./api";

export default {
  name: "MessageReminder",
  data() {
    return {
      queryData: {
        createTime: []
      },
      tableData: []
    };
  },
  mounted() {
    this.getThreeMonth();
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
    getThreeMonth() {
      // 获取当前日期
      const currentDate = new Date();

      // 获取当前日期前3个月的日期
      const threeMonthsAgo = new Date(currentDate);
      threeMonthsAgo.setMonth(currentDate.getMonth() - 3);

      const jggkrq = [
        this.$utilDate.dateFtt(threeMonthsAgo, "yyyyMMdd000000"),
        this.$utilDate.dateFtt(currentDate, "yyyyMMdd235959")
      ];

      this.queryData.createTime = jggkrq;
    },
    // 加载表单
    loadForm() {
      let _this = this;
      let dataParams = {
        ..._this.queryData,
        current: 1,
        size: 1000,
        isShowTaskMsg: false
      };
      // Lambda写法
      msgPage(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.tableData = data.records || [];
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          if (_this.$refs.tableRef) {
            _this.$refs.tableRef.doLayout();
          }
        });
    },
    handleSelect() {
      let routeTo = {
        name: "MsgList"
      };
      let routeResolveData = this.$router.resolve(routeTo);

      let routeMetaData =
        routeResolveData &&
        routeResolveData.route &&
        routeResolveData.route.meta;
      if (
        routeMetaData &&
        routeMetaData.viewType === this.$global.dictItem.routerViewType.App
      ) {
        window.open(routeResolveData.href, "_blank");
      } else {
        this.$router.push(routeTo);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../css/common.scss";

/* 消息列表特定样式 */
.message-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.message-item {
  padding: 4px 12px;
  border-radius: 4px;
  background: rgba(16, 78, 139, 0.15); // 半透明蓝色背景
  backdrop-filter: blur(4px); // 毛玻璃效果
  border: 1px solid rgba(58, 142, 230, 0.2); // 半透明蓝色边框
  box-shadow: 0 2px 12px rgba(6, 61, 112, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1); // 内发光效果
  border-left: 3px solid #409eff;

  margin-bottom: 8px;

  &.unread {
    .message-type {
      font-weight: 600;
    }

    .message-status-tag {
      &.status-unread {
        background: rgba(255, 152, 0, 0.2);
        color: #ffd166;
      }
    }
  }
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .message-type {
    font-size: 15px;
    font-weight: 600;
    color: #e6f1ff; // 浅蓝色文字
    position: relative;
    padding-left: 16px;
    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 4px;
      height: 16px;
      background: #5aa1ff;
      border-radius: 2px;
    }
  }

  .message-status-tag {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 10px;
    font-weight: 500;

    &.status-unread {
      background: rgba(255, 152, 0, 0.15);
      color: #ffb347;
    }

    &.status-read {
      background: rgba(255, 255, 255, 0.1);
      color: #a8c3f0;
    }
  }
}

.message-content {
  font-size: 13px;
  color: #d6e4ff;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .message-time {
    font-size: 11px;
    color: #a8c3f0;
    display: flex;
    align-items: center;

    &::before {
      content: "🕒";
      margin-right: 4px;
      font-size: 10px;
    }
  }

  .message-handle-btn {
    padding: 4px 12px;
    font-size: 12px;
    background: rgba(58, 142, 230, 0.3);
    color: #e6f1ff;
    border: 1px solid rgba(58, 142, 230, 0.6);
    border-radius: 12px;

    &:hover {
      background: rgba(58, 142, 230, 0.5);
    }
  }
}
</style>
