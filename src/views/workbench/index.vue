<template>
  <div class="workbench-root">
    <!-- 中间区块 -->
    <section class="main-area hdty-dp-scroll">
      <div class="main-area-top section-box">
        <TaskStat ref="taskStatRef" />
      </div>

      <div class="main-area-center section-box">
        <div class="area-left">
          <PersonFlow ref="PersonFlowRef" />
        </div>
        <div class="area-right">
          <div class="right-section">
            <PersonFlowList ref="personFlowListRef" />
          </div>
          <div class="right-section">
            <PfldryList ref="pfldryRef" />
          </div>
        </div>
      </div>
    </section>

    <!-- 右侧侧栏 -->
    <aside class="right-area">
      <div class="right-area-top area-margin section-box">
        <MessageReminder ref="messageRef" />
      </div>
      <div class="right-area-center area-margin section-box">
        <Todo ref="todoRef" @update-data="updateData" />
      </div>
      <div class="right-area-footer section-box">
        <CommonFunc ref="commonRef" />
      </div>
    </aside>
  </div>
</template>

<script>
import TaskStat from "./modules/TaskStat.vue";
import PersonFlow from "./modules/PersonFlow.vue";
import PersonFlowList from "./modules/PersonFlowList.vue";
import PfldryList from "./modules/PfldryList.vue";
import Intelligence from "./modules/Intelligence.vue";
import Assessment from "./modules/Assessment.vue";
import MessageReminder from "./modules/MessageReminder.vue";
import Todo from "./modules/Todo.vue";
import CommonFunc from "./modules/CommonFunc.vue";

export default {
  name: "Home",
  components: {
    TaskStat,
    PersonFlow,
    PersonFlowList,
    Intelligence,
    Assessment,
    MessageReminder,
    Todo,
    CommonFunc,

    PfldryList
  },
  provide() {
    return {
      WorkBenchPage: this
    };
  },
  data() {
    return {
      gzryLdQueryData: {
        ldsj: []
      }
    };
  },
  mounted() {
    this.updateGzryld();
  },
  methods: {
    updateData() {
      this.$refs.taskStatRef.initData();
      this.$refs.todoRef.initData();
    },
    updateGzryld() {
      let _this = this;
      if (_this.$refs.PersonFlowRef) {
        _this.$refs.PersonFlowRef.initData();
      }
      if (_this.$refs.personFlowListRef) {
        _this.$refs.personFlowListRef.initData();
      }
      if (_this.$refs.pfldryRef) {
        _this.$refs.pfldryRef.initData();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./css/common.scss";

.workbench-root {
  display: flex;
  height: 100%; /* 全屏高度，不出现浏览器滚动条 */
  overflow: hidden;
  padding: 12px;
  box-sizing: border-box;
  background: url("./images/bg.png");
  background-size: 100% 100%;
}

.area-margin {
  margin-bottom: 12px;
}
.area-left,
.area-right {
  width: 50%;
  height: 100%;
}
.area-left {
  padding-right: 6px;
}
.area-right {
  padding-left: 6px;
}
.right-section {
  height: 50%;
  width: 100%;
}
.main-area {
  width: calc(100% - 432px);
  height: 100%;
  padding-left: 60px;

  .main-area-top {
    height: calc(46% - 12px);
    margin-bottom: 12px;
    min-width: 1000px;
  }

  .main-area-center {
    min-width: 1000px;
    height: 54%;
    // height: calc(32% - 12px);
    display: flex;
  }
  .main-area-footer {
    height: 12%;
    display: flex;
  }
}

.right-area {
  width: 420px;
  height: 100%;
  margin-left: 12px;

  .right-area-top {
    height: calc(35% - 44px);
  }
  .right-area-center {
    height: calc(65% - 180px);
  }
  .right-area-footer {
    height: 200px;
  }
}
</style>
