<template>
  <div class="hdty-box">
    <!--上方操作菜单（3待推送的，不显示）-->
    <div class="hdty-box-header">
      <div class="hdty-box-header-title">
        <i class="el-icon-menu"></i> 任务中心
      </div>
      <div
        v-for="(item, index) in menu"
        :key="index"
        v-if="item.hasAuthority"
        :class="activeMenu === item.key ? 'hdty-box-header-menu-item-active' : 'hdty-box-header-menu-item'"
        @click="handleMenuItem(item)"
      >
        <i :class="item.icon"></i>
        {{ item.label }}
      </div>
    </div>
    <div class="hdty-box-body">
      <div v-show="activeMenu!=='6'" class="hdty-box-body-left hdty-scroll">
        <el-menu
          :default-active="String(defalutActive)"
          :default-openeds="defalutOpeneds"
          class="el-menu-vertical-demo"
        >
          <span v-for="(item, index) in treeData" :key="index">
            <el-submenu :index="item.key" v-if="item.child.length > 0">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{ item.name }} （{{ item.count }}）</span>
              </template>
              <el-menu-item
                :index="val.formid"
                v-for="(val, index1) in item.child"
                :key="val.formid"
                @click="handleTaskTypeItem(val,'formid')"
              >
                <i :class="val.webIcon || 'icon-menu'" style="font-size: 16px;margin-right:5px;"></i>
                <span class="hdty-task-title" :title="val.title">{{val.title}}</span>
                <span class="hdty-task-total">{{ val.count }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item :index="item.key" v-else @click="handleTaskTypeItem(item,'isPc')">
              <i :class="item.icon"></i>
              <span class="hdty-task-title" slot="title" :title="item.title">{{ item.name }}</span>
              <span class="hdty-task-total">{{ item.count }}</span>
            </el-menu-item>
          </span>
        </el-menu>
      </div>
      <!--右侧显示面板-->
      <div class="hdty-box-body-right" :style="{'width': activeMenu === '6' ? '100%': ''}">
        <div class="hdty-container hdty-flex" style="padding: 0;" v-show="activeMenu === '4'">
          <!--待处理的-->
          <new-task-center-del-list-deal ref="NewTaskCenterDelListDealRef"></new-task-center-del-list-deal>
        </div>
        <div
          class="hdty-container hdty-flex"
          style="padding: 0;"
          v-if="activeMenu === '2' || activeMenu === '7'"
        >
          <!--待指派的、待认领的-->
          <new-task-center-dis-list-operate ref="NewTaskCenterDisListOperateRef"></new-task-center-dis-list-operate>
        </div>
        <!-- 全部 -->
        <div class="hdty-container hdty-flex" style="padding: 0;" v-if="activeMenu === '5'">
          <new-task-center-dis-list-all ref="NewTaskCenterDisListAllRef"></new-task-center-dis-list-all>
        </div>
        <div class="hdty-container hdty-flex" style="padding: 0;" v-if="activeMenu === '6'">
          <!--统计-->
          <new-task-center-dis-list-overview ref="NewTaskCenterDisListOverviewRef"></new-task-center-dis-list-overview>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { hdList } from '@/utils/util-framework';
import NewTaskCenterDelListDeal from './NewTaskCenterDelListDeal';
import NewTaskCenterDisListOperate from '../taskdis/NewTaskCenterDisListOperate';
import NewTaskCenterDisListAll from '../taskdis/NewTaskCenterDisListAll';
import NewTaskCenterDisListOverview from '../taskdis/NewTaskCenterDisListOverview';

import { statUserTree, statOrgTree } from '../api';

export default {
  name: 'NewTaskCenterDelList',
  moduleName: 'NewTaskCenterDelList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    NewTaskCenterDelListDeal,
    NewTaskCenterDisListOperate,
    NewTaskCenterDisListAll,
    NewTaskCenterDisListOverview
  },
  data() {
    return {
      defalutOpeneds: ['1', '2'],
      menu: [
        {
          label: '待处理的',
          key: '4',
          icon: 'el-icon-edit-outline',
          btn: 'wcjd',
          hasAuthority: true || this.$utilPublic.getUserInfo().orgLevel <= '5'
        },
        {
          label: '待认领的',
          key: '7',
          icon: 'el-icon-collection',
          btn: 'drld',
          hasAuthority: true || this.$utilPublic.getUserInfo().orgLevel > '4'
        },
        {
          label: '全部',
          key: '5',
          icon: 'el-icon-present',
          btn: 'all',
          hasAuthority: true
        }
        // {
        //   label: '统计',
        //   key: '6',
        //   icon: 'el-icon-data-line',
        //   btn: 'overview',
        //   hasAuthority: true
        // }
      ],
      defalutActive: '',
      activeMenu: '4',
      treeData: [],
      defaultQueryData: {
        isPc: '1'
      },
      refList: [
        'NewTaskCenterDelListDealRef',
        'NewTaskCenterDisListOperateRef',
        'NewTaskCenterDisListAllRef'
      ],
      typeRefMap: new Map([
        ['4', 'NewTaskCenterDelListDealRef'],
        ['5', 'NewTaskCenterDisListAllRef'],
        ['7', 'NewTaskCenterDisListOperateRef']
      ])
    };
  },
  mounted() {
    /*// 处理权限问题
      let auth = this.$utilPublic.getUserRights('TaskCenterList');
      this.menu.forEach(e => {
        e.hasAuthority = auth.children[e.btn] && auth.children[e.btn].hasAuthority;
      });*/
    this.getLeftTree();
    if (this.$route.query) {
      // 从 鄂尔多斯基础管控中心门户消息中心进来（有些参数要特殊处理，所以添加标识）
      if (this.$route.query.source === 'eeds-zhpcsmh-msg') {
        let { tabValue, formId } = this.$route.query;
        this.activeMenu = tabValue || '4';
        this.defalutActive = formId || '';
      }
    }
    this.updateList();
  },
  methods: {
    updateList() {
      if (
        this.activeMenu === '6' &&
        this.$refs.NewTaskCenterDisListOverviewRef &&
        this.$refs.NewTaskCenterDisListOverviewRef.$refs.tableViewRef
      ) {
        this.$refs.NewTaskCenterDisListOverviewRef.$refs.tableViewRef.updateTable();
      } else {
        this.$nextTick(() => {
          if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
            this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
              this.defaultQueryData;
            this.$refs[this.typeRefMap.get(this.activeMenu)].handleQuery();
          }
        });
      }
    },
    handleMenuItem(item) {
      this.activeMenu = item.key;
      // 切换到统计页面,页面table布局刷新
      if (
        item.key === '6' &&
        this.$refs.NewTaskCenterDisListOverviewRef &&
        this.$refs.NewTaskCenterDisListOverviewRef.$refs.tableViewRef
      ) {
        this.$refs.NewTaskCenterDisListOverviewRef.$refs.tableViewRef.updateTable();
      } else {
        this.$nextTick(() => {
          if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
            this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
              this.defaultQueryData;
            this.$refs[this.typeRefMap.get(this.activeMenu)].handleQuery();
          }
        });
      }
    },
    handleTaskTypeItem(item, type) {
      if (type == 'formid') {
        this.defaultQueryData = {
          fromId: item.formid === 'null' ? '' : item.formid,
          isPc: ''
        };
        this.defalutActive = item.formid ? item.formid : this.defalutActive;
      } else {
        this.defaultQueryData = {
          fromId: '',
          isPc: '1'
        };
      }
      if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
        this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
          this.defaultQueryData;
        this.$refs[this.typeRefMap.get(this.activeMenu)].handleQuery();
      }
    },
    // 获取左侧过滤树
    getLeftTree() {
      let _this = this;
      let api = statUserTree;
      let dataParams = {
        state: '',
        isPc: '1'
      };
      if (this.activeMenu === '4') {
        dataParams.state = '3';
      }
      if (this.activeMenu === '7') {
        dataParams.state = '2';
        dataParams.orgid =
          this.$utilPublic.getUserInfo().orgId.substr(0, 8) + '0000';
        api = statOrgTree;
      }
      if (this.activeMenu === '5') {
        api = statOrgTree;
      }
      // Lambda写法
      api(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.treeData = data;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-box {
  width: 100%;
  height: 100%;
  padding: 15px;
  .hdty-box-header {
    width: 100%;
    height: 60px;
    background-color: #022461;
    display: flex;
    padding: 10px;
    .hdty-box-header-title {
      width: 180px;
      color: #fff;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-right: 1px solid #fff;
      font-size: 17px;
      font-weight: bolder;
    }
    .hdty-box-header-menu-item {
      color: #fff;
      width: 130px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 17px;
      cursor: pointer;
      padding: 0px;
      font-weight: bolder;
    }
    .hdty-box-header-menu-item-active {
      //color: #1E2543;
      color: #022461;
      width: 130px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 17px;
      background-color: #fff;
      cursor: pointer;
      padding: 0px;
      font-weight: bolder;
    }
  }
  .hdty-box-body {
    width: 100%;
    height: calc(100% - 60px);
    background-color: #fff;
    display: flex;
    .hdty-box-body-left {
      width: 220px;
      height: 100%;
      background-color: #f3f3f3;
      .hdty-box-body-left-item {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        font-size: 17px;
        position: relative;
        cursor: pointer;
      }
      .hdty-box-body-left-item-active {
        width: 100%;
        height: 50px;
        line-height: 50px;
        padding: 0 20px;
        font-size: 17px;
        color: #2253c5;
        background-color: #e3edfd;
        position: relative;
        cursor: pointer;
      }
      .hdty-task-title {
        display: inline-block;
        white-space: nowrap; /* 禁止文本换行 */
        overflow: hidden; /* 隐藏溢出内容 */
        text-overflow: ellipsis;
        max-width: 120px;
      }
      .hdty-task-total {
        font-size: 16px;
        font-weight: bolder;
        position: absolute;
        right: 15px;
      }
    }
    .hdty-box-body-right {
      width: calc(100% - 220px);
      height: 100%;
      background-color: #fff;
      padding: 15px;
      .hdty-task {
        width: 100%;
        padding: 8px 15px;
        border-bottom: 1px solid #cccccc;
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
  }
}
</style>
