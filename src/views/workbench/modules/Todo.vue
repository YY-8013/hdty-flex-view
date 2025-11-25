<template>
  <div class="work-section">
    <div
      class="work-section-title work-section-title-link"
      @click="handleSelect"
    >
      待办事项
    </div>
    <div class="work-section-body" style="padding-top: 4px">
      <div class="todo-list hdty-dp-scroll">
        <div
          v-for="(item, index) in tableData"
          :key="index"
          class="todo-item"
          :class="{ 'todo-item-urgent': item.vo.taskLevel === '1' }"
        >
          <div class="todo-header">
            <span class="todo-type">{{ item.vo.formIdText }}</span>
            <span
              class="todo-level"
              :class="{
                'level-normal': item.vo.taskLevel === '1',
                'level-urgent': item.vo.taskLevel === '2',
                'level-emergency': item.vo.taskLevel === '3'
              }"
            >
              {{ item.vox.taskLevel }}
            </span>
          </div>
          <div class="todo-content" :title="item.vo.taskContent">
            {{ item.vo.taskContent }}
          </div>
          <div class="todo-footer">
            <span class="todo-deadline">截止时间: {{ item.vox.endTime }}</span>
            <el-button
              type="primary"
              size="mini"
              class="todo-handle-btn"
              @click="handleTask(item)"
            >
              处理
            </el-button>
          </div>
        </div>
      </div>
      <new-task-center-del-edit ref="editRef"></new-task-center-del-edit>
    </div>
  </div>
</template>

<script>
import { dbData } from "./data";
import { taskList } from "./api";
import NewTaskCenterDelEdit from "@/views/task-center-new/taskdel/NewTaskCenterDelEdit";

export default {
  name: "Todo",
  components: { NewTaskCenterDelEdit },
  provide() {
    return {
      NewTaskCenterDelList: this,
      hdList: this
    };
  },
  data() {
    return {
      tableData: []
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
    // 加载表单
    loadForm() {
      let _this = this;
      // Lambda写法
      taskList()
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
    handleTask(item) {
      // 处理任务的逻辑
      console.log(" 处理任务:", item);
      // 这里可以添加跳转到处理页面的逻辑
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = item;
      this.$refs.editRef.beforeLoadForm();
    },
    handleQuery() {
      this.$emit("update-data");
    },
    handleSelect() {
      let routeTo = {
        name: "NewTaskCenterDelList"
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

.work-section {
}

.todo-list {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.todo-item {
  padding: 4px 12px;
  border-radius: 4px;
  // background: #f9f9f9;
  margin-bottom: 8px;
  background: rgba(16, 78, 139, 0.15); // 半透明蓝色背景
  backdrop-filter: blur(4px); // 毛玻璃效果
  border: 1px solid rgba(58, 142, 230, 0.2); // 半透明蓝色边框
  box-shadow: 0 2px 12px rgba(6, 61, 112, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.1); // 内发光效果
  border-left: 3px solid #409eff;

  // &-urgent {
  //   border-left-color: #f56c6c;
  // }
}

.todo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .todo-type {
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

  .todo-level {
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 12px;
    line-height: 1.1;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);

    /* 平急样式 - 亮青色 */
    &.level-normal {
      background: linear-gradient(135deg, #00d4ff, #00a8ff);
      color: #003366;
      border: 1px solid #00c8ff;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
    }

    /* 加急样式 - 亮橙色 */
    &.level-urgent {
      background: linear-gradient(135deg, #ff9a00, #ff6b00);
      color: #4d1f00;
      border: 1px solid #ff8000;
      text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
      animation: glow 2s infinite alternate;
    }

    /* 特急样式 - 亮红色 */
    &.level-emergency {
      background: linear-gradient(135deg, #ff3a3a, #ff0a0a);
      color: white;
      border: 1px solid #ff5050;
      text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
      animation: pulse 0.8s linear infinite alternate,
        glow 1.5s linear infinite alternate;
    }
  }
}

/* 发光动画 */
@keyframes glow {
  from {
    box-shadow: 0 0 4px rgba(255, 154, 0, 0.5);
  }
  to {
    box-shadow: 0 0 12px rgba(255, 154, 0, 0.8);
  }
}

/* 脉冲动画 */
@keyframes pulse {
  from {
    transform: scale(1);
    transform-origin: center; /* 固定变换原点 */
  }
  to {
    transform: scale(1.05);
  }
}

.todo-content {
  font-size: 13px;
  color: #d6e4ff; // 浅蓝色文字
  margin-bottom: 4px;
  line-height: 1.3;
  white-space: nowrap; // 强制不换行
  overflow: hidden;
  text-overflow: ellipsis; // 文本溢出显示省略号
  width: 100%; // 确保宽度约束
  display: block; // 改为块级元素
}

.todo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .todo-deadline {
    font-size: 12px;
    color: #a8c3f0; // 稍暗的蓝色文字
    font-weight: 400;
    display: flex;
    align-items: center;

    &::before {
      content: "⏱";
      margin-right: 6px;
      font-size: 11px;
      opacity: 0.8;
    }
  }

  .todo-handle-btn {
    padding: 4px 12px;
    font-weight: 500;
    background: rgba(58, 142, 230, 0.3);
    color: #e6f1ff;
    border: 1px solid rgba(58, 142, 230, 0.6);
    border-radius: 16px;
    transition: all 0.3s ease;

    &:hover {
      background: rgba(58, 142, 230, 0.5);
      color: white;
      box-shadow: 0 0 8px rgba(58, 142, 230, 0.4);
    }
  }
}
</style>
