<template>
  <div class="hdty-box">
    <div class="hdty-box-body-left hdty-scroll">
      <div v-for="(item, index) in taskTypeArry" :key="index"
           :class="activeType === item.key? 'hdty-box-body-left-item-active':'hdty-box-body-left-item'"
           @click="handleTaskTypeItem(item)">
        <el-icon :class="item.icon" style="font-weight: bolder"></el-icon>
        {{ item.name }}
      </div>
    </div>
    <div class="hdty-box-body-right" style="padding: 0">
      <div class="hdty-left-table" v-if="activeType === '1'">
        <div class="hdty-box-header">
          <i class="el-icon-timer"></i> 任务情况
        </div>
        <div class="hdty-box-body">
          <table-view ref="tableViewRef"></table-view>
        </div>
      </div>
      <div class="hdty-left-table" v-if="activeType === '2'">
        <div class="hdty-box-header">
          <i class="el-icon-timer"></i> 各类任务情况
        </div>
        <div class="hdty-box-body">
          <table-view-charts></table-view-charts>
        </div>
      </div>
      <div class="hdty-left-table" v-if="activeType === '3'">
        <div class="hdty-box-header">
          <i class="el-icon-user-solid"></i> 民警办结情况
        </div>
        <div class="hdty-box-body">
          <table-view-mj ref="tableViewMjRef"></table-view-mj>
        </div>
      </div>
      <div class="hdty-left-table" v-if="activeType === '4'">
        <div class="hdty-box-header">
          <i class="el-icon-circle-check"></i> 任务核查统计
        </div>
        <div class="hdty-box-body">
          <table-view-check></table-view-check>
        </div>
      </div>
      <div class="hdty-left-table" v-if="activeType === '5'">
        <div class="hdty-box-header">
          <i class="el-icon-document-checked"></i> 质态监督工作情况
        </div>
        <div class="hdty-box-body">
          <table-view-ztjdgz ref="tableViewMjRef"></table-view-ztjdgz>
        </div>
      </div>
      <div class="hdty-left-table" v-if="activeType === '6'">
        <div class="hdty-box-header">
          <i class="el-icon-s-data"></i> 日常检查情况统计
        </div>
        <div class="hdty-box-body">
          <table-view-dwrcjc></table-view-dwrcjc>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import TableView from './Overview/TableView.vue';
import TableViewMj from './Overview/TableViewMj.vue';
import TableViewCheck from './Overview/TableViewCheck.vue';
import TableViewCharts from './Overview/TableViewCharts.vue';
import TableViewZtjdgz from './Overview/TableViewZtjdgz.vue';
import TableViewDwrcjc from './Overview/TableViewDwrcjc.vue';

export default {
  name: 'TaskCenterOverview',
  components: {
    TableView,
    TableViewMj,
    TableViewCheck,
    TableViewCharts,
    TableViewZtjdgz,
    TableViewDwrcjc,
  },
  provide() {
    return {
      taskView: this
    };
  },
  props: {
    prop: String,
    // 统计表类型 1. 整体情况 2.民警办结情况
    tableType: {
      type: [String],
      default: '1'
    },
  },
  data() {
    return {
      orgId: this.$utilPublic.getUserOrgId(),
      activeType: '1',
      // 加载总览
      taskTypeArry: [
        {
          name: '整体情况',
          key: '1',
          total: '',
          icon: 'el-icon-s-grid',
        },
        {
          name: '各类任务情况',
          key: '2',
          total: '',
          icon: 'el-icon-s-claim',
        },
        {
          name: '民警办结情况',
          key: '3',
          total: '',
          icon: 'el-icon-user-solid',
        },
        {
          name: '任务核查统计',
          key: '4',
          total: '',
          icon: 'el-icon-circle-check',
        },
        {
          name: '质态监督工作情况',
          key: '5',
          total: '',
          icon: 'el-icon-document-checked',
        },
        {
          name: '日常检查情况统计',
          key: '6',
          total: '',
          icon: 'el-icon-s-data',
        }
      ]
    };
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.tableViewRef && this.$refs.tableViewRef.queryData.orgid) {
        this.orgId = this.$refs.tableViewRef.queryData.orgid;
      }
    });
  },
  methods: {
    handleTaskTypeItem(item) {
      this.activeType = item.key;
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-box {
  width: 100%;
  height: 100%;
  display: flex;
  padding: 0;

  .hdty-box-body-left {
    width: 190px;
    height: 100%;
    background-color: #fff;
    margin-right: 10px;

    .hdty-box-body-left-item {
      width: 100%;
      height: 50px;
      line-height: 50px;
      //padding: 0 20px;
      font-size: 17px;
      position: relative;
      cursor: pointer;
    }

    .hdty-box-body-left-item-active {
      width: 100%;
      height: 50px;
      line-height: 50px;
      //padding: 0 20px;
      font-size: 17px;
      color: #2253C5;
      background-color: #E3EDFD;
      position: relative;
      cursor: pointer;
    }

    .hdty-task-total {
      font-size: 16px;
      font-weight: bolder;
      position: absolute;
      right: 15px;
    }
  }

  .hdty-box-body-right {
    width: calc(100% - 190px);
    height: 100%;
    background-color: #fff;

    .hdty-task {
      width: 100%;
      padding: 8px 15px;
      border-bottom: 1px solid #CCCCCC;
      display: flex;
      cursor: pointer;

      .hdty-task-body {
        width: calc(100% - 180px);
        height: 100%;
      }

      .hdty-task-tag {
        position: absolute;
        right: 200px;
      }

      .hdty-task-operate {
        width: 180px;
        height: 80px;
        padding: 10px;
        border-left: 1px solid #ccc;
      }

      .hdty-task-content {
        height: 40px;
        line-height: 40px;
        display: flex;
        font-size: 15px;
        position: relative;

        div {
          margin-right: 5px;
        }
      }

      .hdty-task-otherInfo {
        display: flex;
        height: 40px;
        line-height: 40px;
        font-size: 15px;

        div {
          margin-right: 20px;
        }
      }
    }
  }

  .hdty-left-table {
    width: 100%;
    height: 100%;
    border: 1px solid #409eff;
    margin-right: 10px;
  }

  .hdty-right-bar {
    width: 35%;
    height: 100%;
    border: 1px solid #409eff;
  }

  .hdty-box-header {
    width: 100%;
    height: 35px;
    line-height: 35px;
    font-weight: bold;
    font-size: 15px;
    background-color: #409eff;
    color: #fff;
    padding: 0 5px;

    i {
      font-size: 20px;
      margin: 7px 5px 0px 5px;
    }
  }

  .hdty-box-body {
    height: calc(100% - 35px);
  }
}

.hdty-left-table {
  width: 65%;
  height: 100%;
  border: 1px solid #409eff;
  margin-right: 10px;
}

.hdty-right-bar {
  width: 35%;
  height: 100%;
  border: 1px solid #409eff;
}

.hdty-box-header {
  width: 100%;
  height: 35px;
  line-height: 35px;
  font-weight: bold;
  font-size: 15px;
  background-color: #409eff;
  color: #fff;
  padding: 0 5px;
}

.hdty-box-body {
  height: calc(100% - 35px);
}

i {
  font-size: 20px;
  margin: 7px 5px 0px 5px;
}
</style>
