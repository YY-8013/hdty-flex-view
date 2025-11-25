<template>
  <div class="hdty-box">
    <!--上方操作菜单（3待推送的，不显示）-->
    <div class="hdty-box-header" style="position: relative">
      <div class="hdty-box-header-title">
        <i class="el-icon-menu"></i> 任务中心
      </div>
      <div
        v-for="(item, index) in menu"
        :key="index"
        v-if="item.hasAuthority"
        :class="
          activeMenu === item.key
            ? 'hdty-box-header-menu-item-active'
            : 'hdty-box-header-menu-item'
        "
        @click="handleMenuItem(item)"
      >
        <template>
          <i :class="item.icon"></i>
          {{ item.label }}
        </template>
      </div>
    </div>
    <div class="hdty-box-body">
      <!--左侧树-->
      <div class="hdty-box-body-left hdty-scroll">
        <el-menu
          :default-openeds="defalutOpeneds"
          :default-active="String(defalutActive)"
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
                @click="handleTaskTypeItem(val, 'formid')"
              >
                <!-- icon -> webIcon 与app冲突 -->
                <i
                  :class="val.webIcon || 'icon-menu'"
                  style="font-size: 16px; margin-right: 5px"
                ></i>
                <span class="hdty-task-title" :title="val.title">{{
                  val.title
                }}</span>
                <span class="hdty-task-total">{{ val.count }}</span>
              </el-menu-item>
            </el-submenu>
            <el-menu-item
              :index="item.key"
              v-else
              @click="handleTaskTypeItem(item, 'isPc')"
            >
              <i :class="item.icon"></i>
              <span class="hdty-task-title" slot="title" :title="item.title">{{
                item.name
              }}</span>
              <span class="hdty-task-total">{{ item.count }}</span>
            </el-menu-item>
          </span>
        </el-menu>
      </div>
      <!--右侧显示面板-->
      <div class="hdty-box-body-right">
        <!--我创建的 -->
        <div
          class="hdty-container hdty-flex"
          style="padding: 0"
          v-show="activeMenu === '1'"
        >
          <new-task-center-dis-list-create
            ref="NewTaskCenterDisListCreateRef"
            @update-left-tree="updateLeftTree"
          ></new-task-center-dis-list-create>
        </div>

        <!--待处理的 -->
        <div
          class="hdty-container hdty-flex"
          style="padding: 0"
          v-show="activeMenu === '2'"
        >
          <new-task-center-del-list-deal
            ref="NewTaskCenterDelListDealRef"
            @update-left-tree="updateLeftTree"
          ></new-task-center-del-list-deal>
        </div>

        <!--待分配的-->
        <div
          class="hdty-container hdty-flex"
          style="padding: 0"
          v-show="activeMenu === '3'"
        >
          <new-task-center-dis-list-operate
            ref="NewTaskCenterDisListOperateRef"
            @update-left-tree="updateLeftTree"
          ></new-task-center-dis-list-operate>
        </div>

        <!-- 全部 -->
        <div
          class="hdty-container hdty-flex"
          style="padding: 0"
          v-show="activeMenu === '9'"
        >
          <new-task-center-dis-list-all
            ref="NewTaskCenterDisListAllRef"
            @update-left-tree="updateLeftTree"
          ></new-task-center-dis-list-all>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { hdList } from "@/utils/util-framework";
// 我创建的
import NewTaskCenterDisListCreate from "./NewTaskCenterDisListCreate";
// 待处理的
import NewTaskCenterDelListDeal from "../taskdel/NewTaskCenterDelListDeal";
// 待分配的
import NewTaskCenterDisListOperate from "./NewTaskCenterDisListOperate";
// 全部
import NewTaskCenterDisListAll from "./NewTaskCenterDisListAll";

export default {
  name: "NewTaskCenterDisList",
  moduleName: "NewTaskCenterDisList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    NewTaskCenterDisListCreate,
    NewTaskCenterDisListOperate,
    NewTaskCenterDisListAll,
    NewTaskCenterDelListDeal
  },
  data() {
    return {
      defalutOpeneds: ["1", "2"],
      defalutActive: "",
      menu: [
        {
          label: "我创建的",
          key: "1",
          icon: "el-icon-document-add",
          btn: "wcjd",
          hasAuthority: true
        },
        {
          label: "待处理的",
          key: "2",
          icon: "el-icon-edit-outline",
          btn: "dcld",
          hasAuthority: true
        },
        {
          label: "待分配的",
          key: "3",
          icon: "el-icon-s-flag",
          btn: "dzpd",
          hasAuthority: true
        },
        {
          label: "全部",
          key: "9",
          icon: "el-icon-s-grid",
          btn: "qb",
          hasAuthority: true
        }
      ],
      activeMenu: "2",
      treeData: [],
      queryData: {},
      defaultQueryData: {
        fromId: "",
        isPc: "1"
      },
      refList: [
        "NewTaskCenterDisListCreateRef",
        "NewTaskCenterDisListOperateRef",
        "NewTaskCenterDisListAllRef",
        "NewTaskCenterDelListDealRef"
      ],
      typeRefMap: new Map([
        ["1", "NewTaskCenterDisListCreateRef"],
        ["2", "NewTaskCenterDelListDealRef"],
        ["3", "NewTaskCenterDisListOperateRef"],
        ["9", "NewTaskCenterDisListAllRef"]
      ])
    };
  },
  mounted() {
    // 处理权限问题
    let auth = this.$utilPublic.getUserRights("NewTaskCenterDisList");
    this.menu.forEach((e) => {
      // 警种为治安的用户显示审批
      e.hasAuthority =
        auth.children[e.btn] && auth.children[e.btn].hasAuthority;
    });

    this.updateList();
  },
  methods: {
    updateList() {
      this.$nextTick(() => {
        if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
          this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
            this.defaultQueryData;
          this.$refs[this.typeRefMap.get(this.activeMenu)].handleQuery();
        }
      });
    },
    handleMenuItem(item) {
      this.activeMenu = item.key;
      // 切换到统计页面,页面table布局刷新

      this.$nextTick(() => {
        if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
          this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
            this.defaultQueryData;
          this.$refs[this.typeRefMap.get(this.activeMenu)].changeMenuItem();
        }
      });
    },
    handleTaskTypeItem(item, type) {
      if (type == "formid") {
        this.defaultQueryData = {
          fromId: item.formid === "null" ? "" : item.formid,
          isPc: ""
        };
        this.defalutActive = item.formid ? item.formid : this.defalutActive;
      } else {
        this.defaultQueryData = {
          fromId: "",
          isPc: "1"
        };
      }
      if (this.$refs[this.typeRefMap.get(this.activeMenu)]) {
        this.$refs[this.typeRefMap.get(this.activeMenu)].defaultQueryData =
          this.defaultQueryData;
        this.$refs[this.typeRefMap.get(this.activeMenu)].handleQuery();
      }
    },
    updateLeftTree(treeData, leftActiveForm) {
      this.treeData = treeData || [];
      this.defalutActive = leftActiveForm;
      this.defaultQueryData.fromId = leftActiveForm;
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
      width: 270px; // 230
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
      width: calc(100% - 270px);
      height: 100%;
      background-color: #fff;
      padding: 15px;
      ::v-deep .task-center-old {
        padding: 0 !important;
      }
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
