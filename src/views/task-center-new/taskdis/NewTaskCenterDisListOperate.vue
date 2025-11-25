<template>
  <div class="hdty-container hdty-flex" style="padding: 0">
    <!--查询条件-->
    <div class="hdty-header">
      <el-form
        ref="queryRef"
        :model="queryData"
        :rules="rules"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="factorData" ref="componentRef">
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="任务名称" prop="taskContent">
                <el-input
                  prop="taskContentFilterFactor"
                  v-model="queryData.taskContent"
                  placeholder="请输入任务关键字"
                ></el-input>
              </el-form-item>
              <el-form-item label="操作类型" prop="operationType">
                <hd-dict-radio
                  v-model="queryData.operationType"
                  :dictCode="$global.dictType.operationType"
                  showAllButton
                  placeholder="请选择操作类型"
                ></hd-dict-radio>
              </el-form-item>

              <el-form-item prop="sjgsdwdm" slot="after">
                <hd-organ
                  v-model="queryData.sjgsdwdm"
                  :model-text.sync="extendData.sjgsdwdm"
                  placeholder="请选择责任机构"
                ></hd-organ>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item
                  label="可办理任务的用户机构级别"
                  prop="allowAllMjDel"
                >
                  <el-radio-group
                    v-model="queryData.allowAllMjDel"
                    size="small"
                  >
                    <el-radio label="">全部</el-radio>
                    <el-radio label="0"
                      >只有{{ rwBaseConfig.orgLevelText }}级别</el-radio
                    >
                    <el-radio label="1">任意机构级别</el-radio>
                    <el-radio label="2">只有选中机构对应的级别</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务办理类型" prop="taskBllx">
                  <hd-dict-radio
                    v-model="queryData.taskBllx"
                    :dict-code="$global.dictType.taskHandleType"
                    showAllButton
                  ></hd-dict-radio>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务要求" prop="taskRwyq">
                  <hd-factor-input
                    prop="taskRwyqFilterFactor"
                    fuzzy="between"
                    v-model="queryData.taskRwyq"
                    :model-control.sync="factorData.taskRwyqFilterFactor"
                    placeholder="请输入任务要求"
                  ></hd-factor-input>
                </el-form-item>

                <el-form-item
                  label="任务来源"
                  prop="taskLevel"
                  v-if="!defaultQueryData.fromId"
                >
                  <hd-dict-select
                    v-model="queryData.taskSjly"
                    :dictCode="$global.dictType.taskSource"
                    :model-text.sync="extendData.taskSjly"
                    collapseTags
                    filterable
                    placeholder="请选择任务来源"
                  ></hd-dict-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务类型" prop="taskMode">
                  <hd-dict-select
                    v-model="queryData.taskMode"
                    :dictCode="$global.dictType.rwlx"
                    :model-text.sync="extendData.taskMode"
                    collapseTags
                    filterable
                    placeholder="请选择任务类型"
                  ></hd-dict-select>
                </el-form-item>
                <el-form-item label="任务等级" prop="taskLevel">
                  <hd-dict-select
                    v-model="queryData.taskLevel"
                    :dictCode="$global.dictType.rwdj"
                    :model-text.sync="extendData.taskLevel"
                    collapseTags
                    filterable
                    placeholder="请选择任务等级"
                  ></hd-dict-select>
                </el-form-item>
              </el-row>

              <el-row>
                <el-form-item label="逾期状态" prop="yqType">
                  <hd-dict-radio
                    v-model="queryData.yqType"
                    :dictCode="$global.dictType.yqType"
                    showAllButton
                    placeholder="请选择逾期状态"
                  ></hd-dict-radio>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务开始时间" prop="startTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.startTime"
                  ></hd-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务结束时间" prop="endTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.endTime"
                  ></hd-date-picker>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务创建时间" prop="pushTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.pushTime"
                  ></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <!-- 新写法-->
      <hd-button-container>
        <hd-button
          v-show="canPlzp"
          name="edit"
          type="info"
          icon="el-icon-collection"
          v-preventReClick
          @click="handleAssignBatch"
          >批量指派</hd-button
        >
        <hd-button
          v-show="canPlrl"
          name="edit"
          type="success"
          icon="el-icon-collection"
          v-preventReClick
          @click="handleClaimBatch"
          >批量认领</hd-button
        >
        <hd-button
          v-if="false && showYj"
          type="warning"
          name="edit"
          icon="el-icon-collection"
          v-preventReClick
          @click="handleTransferBatch"
          >批量移交</hd-button
        >
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery"
          >查询</hd-button
        >
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
      </hd-button-container>
    </div>

    <div
      v-if="canPlzp || canPlrl"
      class="large-checkbox"
      style="
        width: 100%;
        margin-bottom: 3px;
        margin-top: -12px;
        z-index: 9999999;
      "
    >
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        style="
          float: right;
          margin-top: 5px;
          margin-left: 5px;
          display: flex;
          align-items: center;
        "
        ><span>全选</span></el-checkbox
      >
    </div>
    <!--列表最上方分隔线-->
    <div style="width: 100%; height: 1px; background-color: #ccc"></div>
    <!--列表-->
    <div class="hdty-fit" v-loading="loading">
      <div
        class="con-table large-checkbox hdty-scroll"
        v-if="tableData && tableData.length > 0"
      >
        <el-checkbox-group
          v-model="multipleArray"
          @change="handleCheckedCitiesChange"
        >
          <div
            class="hdty-task"
            v-for="(item, index) in tableData"
            :key="index"
          >
            <div
              :class="
                'hdty-task-level-1 ' + getTaskLevelType(item.vo.taskLevel)
              "
            >
              {{ item.vox.taskLevel }}
            </div>
            <div class="hdty-task-body" @click="handleDetail(index, item)">
              <!-- 认领  或   指派 & 当前机构可指派的数据 -->
              <div v-if="canPlzp || canPlrl" class="hdty-box-check" @click.stop>
                <el-checkbox
                  :label="item.vo.taskorgrecodeid"
                  size="medium"
                ></el-checkbox>
              </div>
              <div class="hdty-task-row">
                <div class="con-content hdty-elip" line-clamp="2">
                  {{ item.vo.taskContent }}
                </div>
                <div style="margin-left: 12px">
                  <el-tag
                    size="mini"
                    type="info"
                    effect="dark"
                    v-if="
                      item.vo.taskState === '1' || item.vo.taskState === '2'
                    "
                    >{{ item.vox.taskState }}</el-tag
                  >
                  <el-tag
                    size="mini"
                    type="warning"
                    effect="dark"
                    v-if="item.vo.taskState === '3'"
                    >{{ item.vox.taskState }}</el-tag
                  >
                  <el-tag
                    size="mini"
                    type="success"
                    effect="dark"
                    v-if="item.vo.taskState === '4'"
                    >{{ item.vox.taskState }}</el-tag
                  >
                </div>
                <div style="margin-left: auto" class="hdty-flex">
                  <el-tag
                    :type="getTaskModeType(item.vo.taskMode)"
                    size="mini"
                    >{{ item.vox.taskMode }}</el-tag
                  >
                  <el-tag
                    v-if="item.vo.formIdText"
                    style="margin-left: 5px"
                    type="warning"
                    size="mini"
                    :title="item.vo.formIdText"
                  >
                    <span
                      class="hdty-elip"
                      style="display: block; max-width: 100px"
                      >{{ item.vo.formIdText }}</span
                    >
                  </el-tag>
                  <!--                  <el-tag-->
                  <!--                    :type="getTaskLevelType(item.vo.taskLevel)"-->
                  <!--                    size="mini"-->
                  <!--                  >{{item.vox.taskLevel}}</el-tag>-->
                </div>
              </div>
              <div class="hdty-task-row">
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-time"></i>
                    <div>起止时间：</div>
                    <div>
                      {{ item.vox.startTime }}
                      <span style="padding: 0 5px">至</span>
                      {{ item.vox.endTime }}
                      <span
                        v-if="item.vo.rwsfcq === '1'"
                        class="hdty-danger-color"
                        style="font-weight: bolder"
                        >({{ item.vo.rwyqsj }})</span
                      >
                    </div>
                  </div>
                </div>
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-time"></i>
                    <div>推送时间：</div>
                    <div>{{ item.vox.pushTime || "暂无推送时间" }}</div>
                  </div>
                </div>
              </div>
              <div class="hdty-task-row">
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-aim"></i>
                    {{
                      item.vo.formId === "000" ? "任务对象描述" : "对象名称"
                    }}：
                    <div
                      class="con-i-content hdty-elip"
                      :title="
                        item.vo.objectJSON && item.vo.objectJSON.name
                          ? item.vo.objectJSON.name
                          : '暂无任务对象'
                      "
                    >
                      {{
                        item.vo.objectJSON && item.vo.objectJSON.name
                          ? item.vo.objectJSON.name
                          : "暂无任务对象"
                      }}
                    </div>
                  </div>
                </div>
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-thumb"></i>
                    <div>推送机构：</div>
                    <div>{{ item.vox.pushOrgid || "暂无推送机构" }}</div>
                  </div>
                </div>
              </div>
              <div
                class="hdty-task-row"
                v-if="
                  showGkFormId.includes(item.vo.formId) &&
                  item.vo.objectJSON &&
                  item.vo.objectJSON.gklxText
                "
              >
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-connection"></i>
                    <div>管控类型：</div>
                    <div>
                      {{
                        item.vo.objectJSON && item.vo.objectJSON.gklxText
                          ? item.vo.objectJSON.gklxText
                          : "暂无管控类型"
                      }}
                    </div>
                  </div>
                </div>
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-location-information"></i>
                    <div
                      v-show="
                        item.vo.objectJSON && item.vo.objectJSON.gklx === '1'
                      "
                    >
                      户籍地/责任民警：
                    </div>
                    <div
                      v-show="
                        item.vo.objectJSON && item.vo.objectJSON.gklx === '2'
                      "
                    >
                      现住地/责任民警：
                    </div>
                    <div
                      v-show="
                        item.vo.objectJSON && item.vo.objectJSON.gklx === '4'
                      "
                    >
                      事发地/责任民警：
                    </div>
                    <div
                      v-show="
                        !['1', '2', '4'].includes(item.vo.objectJSON.gklx)
                      "
                    >
                      管控地/责任民警：
                    </div>
                    <div>
                      {{
                        item.vo.objectJSON && item.vo.objectJSON.sjgsdwdmText
                          ? item.vo.objectJSON.sjgsdwdmText
                          : "暂无地区信息"
                      }}
                    </div>
                    <div
                      v-if="item.vo.objectJSON && item.vo.objectJSON.gkmjName"
                    >
                      【{{ item.vo.objectJSON.gkmjName }}】
                    </div>
                  </div>
                </div>
              </div>
              <div class="hdty-task-row">
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-guide"></i>
                    <div>待指派机构：</div>
                    <div>{{ item.vox.sjgsdwdm || "暂无待指派机构" }}</div>
                  </div>
                </div>
                <div class="hdty-task-row-item row-item-12">
                  <el-badge
                    v-if="item.vo.recodeLabels"
                    :value="val.num"
                    class="item"
                    type="warning"
                    style="margin-left: 3px"
                    v-for="(val, index) in item.vo.recodeLabels"
                    :key="index"
                  >
                    <el-tag type="warning" size="mini">{{
                      val.typeText
                    }}</el-tag>
                  </el-badge>
                </div>
              </div>
              <div
                class="hdty-task-row"
                v-if="
                  item.vo.objectJSON &&
                  item.vo.objectJSON.gmsfhm &&
                  item.vo.objectJSON.xzdz
                "
              >
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-postcard"></i>
                    <div>证件号码：</div>
                    <div>
                      {{
                        item.vo.objectJSON && item.vo.objectJSON.gmsfhm
                          ? item.vo.objectJSON.gmsfhm
                          : "暂无证件号码"
                      }}
                    </div>
                  </div>
                </div>
                <div class="hdty-task-row-item row-item-12">
                  <div class="con-flex con-i-label-info">
                    <i class="el-icon-location-information"></i>
                    <div>现住地址：</div>
                    <div>
                      {{
                        item.vo.objectJSON && item.vo.objectJSON.xzdz
                          ? item.vo.objectJSON.xzdz
                          : "暂无现住地址"
                      }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="con-cq-label" v-if="item.vo.rwsfcq === '1'">
              <img src="./../images/yyq.png" alt style="height: 70px" />
            </div>
            <!-- 操作按钮-->
            <div class="hdty-task-operate">
              <div>
                <!--页签等于待指派的才显示指派按钮-->
                <!--我已经指派到辖机机构的，不能继续指派，而是由下级机构进行指派-->
                <hd-button
                  v-show="item.vo.canZp"
                  name="edit"
                  size="mini"
                  type="info"
                  @click="handleAssign(index, item)"
                  >指派</hd-button
                >
                <!--页签等于待认领的才显示待认领按钮-->
                <hd-button
                  v-show="item.vo.canRl"
                  name="edit"
                  size="mini"
                  type="success"
                  v-preventReClick
                  @click="handleClaim(index, item)"
                  >认领</hd-button
                >
                <hd-button
                  v-show="item.vo.canRl"
                  :disabled="
                    item.vo.taskState === '4' ||
                    nFormId.findIndex((e) => e === item.vo.formId) > -1
                  "
                  name="edit"
                  size="mini"
                  type="primary"
                  :title="
                    item.vo.taskState === '4' ||
                    nFormId.find((e) => e === item.vo.formId)
                      ? '该任务暂不支持PC端办理'
                      : ''
                  "
                  @click="handleFinish(index, item)"
                  >处理</hd-button
                >
                <!-- 移交 页签等于带指派 -->
                <yj-button
                  ref="yjButtonRef"
                  @transfer="handleTransferNew"
                  :item="item"
                  @update="handleQuery"
                ></yj-button>
                <hd-button
                  v-if="queryData.queryType === '2'"
                  name="revoke"
                  size="mini"
                  type="primary"
                  @click="handleRevoke(index, item)"
                  >撤回</hd-button
                >
                <hd-button
                  v-if="
                    getLogoutIsShow() &&
                    nLogoutFormId.findIndex((e) => e === item.vo.formId) < 0 &&
                    item.vo.taskState !== '4'
                  "
                  name="logoutGrrw"
                  size="mini"
                  type="danger"
                  @click="handleLogoutTask(index, item)"
                  >注销</hd-button
                >
                <hd-button
                  name="copy"
                  size="mini"
                  type="success"
                  @click="handleCopyTask(index, item)"
                  >复制任务</hd-button
                >
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </div>
      <biz-empty
        style="height: 100%"
        v-else
        content="暂无任务"
        guidingContent
      ></biz-empty>
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

    <!-- <new-task-center-del-detail ref="detailRef"></new-task-center-del-detail> -->
    <new-task-center-dis-task-detail
      ref="detailRef"
    ></new-task-center-dis-task-detail>
    <new-task-assign
      ref="assignRef"
      @todoAssign="handleAssignBack"
    ></new-task-assign>
    <new-task-center-del-transfer
      ref="transferRef"
      @update="handleQuery"
    ></new-task-center-del-transfer>
    <new-task-center-dis-task-revoke
      ref="revokeRef"
    ></new-task-center-dis-task-revoke>
    <new-task-center-dis-logout-task
      ref="logoutTagkRef"
    ></new-task-center-dis-logout-task>
    <new-task-center-dis-copy-task
      ref="copyTaskRef"
    ></new-task-center-dis-copy-task>
    <new-task-center-del-edit ref="editRef"></new-task-center-del-edit>
  </div>
</template>
<script>
import { hdList } from "@/utils/util-framework";
import { getZpOrRlTaskPage, doZpOrRlTask } from "./../api";
import NewTaskCenterDelDetail from "./../taskdel/NewTaskCenterDelDetail";
import NewTaskCenterDisTaskDetail from "./NewTaskCenterDisTaskDetail";
import NewTaskAssign from "./../common/NewTaskAssign";
import NewTaskCenterDelTransfer from "../taskdel/NewTaskCenterDelTransfer";
import NewTaskCenterDisTaskRevoke from "./NewTaskCenterDisTaskRevoke.vue";
import NewTaskCenterDisLogoutTask from "./NewTaskCenterDisLogoutTask.vue";
import NewTaskCenterDisCopyTask from "./NewTaskCenterDisCopyTask.vue";
import YjButton from "../common/YjButton";

import NewTaskCenterDelEdit from "./../taskdel/NewTaskCenterDelEdit";

import listYw from "./listYw";

export default {
  name: "NewTaskCenterDisListOperate",
  provide() {
    return {
      NewTaskCenterDisListOperate: this,
      NewTaskCenterDelList: this,
      NewTaskCenterList: this,
      hdList: this
    };
  },
  inject: ["hdList"],
  mixins: [hdList, listYw],
  components: {
    NewTaskCenterDisLogoutTask,
    NewTaskCenterDisTaskRevoke,
    NewTaskCenterDelDetail,
    NewTaskAssign,
    NewTaskCenterDisTaskDetail,
    NewTaskCenterDelTransfer,
    NewTaskCenterDisCopyTask,
    YjButton,

    NewTaskCenterDelEdit
  },
  data() {
    return {
      zpTypeOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待当前机构指派",
          value: "1"
        },
        {
          label: "待下级机构指派",
          value: "2"
        }
      ],
      // 查询
      queryData: {
        taskBllx: "",
        operationType: "",
        allowAllMjDel: "",
        queryType: "1",
        yqType: "",
        isPc: "1",
        taskContent: "",
        sjgsdwdm: "",
        taskState: "",
        taskRwyq: "",
        taskMode: "",
        taskLevel: "",
        startTime: [],
        endTime: [],
        zxbs: "0",
        pushTime: [],
        targetType: "2", // 调用类型（2待指派的 4待处理的 5全部 7待认领的 ）可排序
        andor: this.$app.factorOptions.logicOpe.and,
        // 任务来源
        taskSjly: ""
      },
      factorData: {
        taskContentFilterFactor: this.$app.factorOptions.matchOpe.between,
        taskRwyqFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 查询扩展
      extendData: {
        sjgsdwdm: "",
        taskState: "",
        taskMode: "",
        taskLevel: ""
      },
      tableData: [],
      // 验证
      rules: {},
      defaultQueryData: {},

      // 列表全选
      checkAll: false,
      isIndeterminate: false,
      multipleData: [],
      multipleArray: [],
      // 指派类型
      currentOrgZpType: "1",

      // 是否显示移交按钮
      showYj: true,
      // 当前移交限制类型  1 随意移交；  2 同一父级下移交
      currentOrgYjType: "1",
      // 不允许注销的任务表单
      nLogoutFormId: [],
      // 最大移交次数
      maxYjNum: 6,
      // 不允许移交的任务表单
      nYjFormIdList: [],

      // 不允许派出所注销的地市
      nLogoutPcsCity: [],

      // 展示管控类型和管控地址及民警姓名的标准件
      showGkFormId: ["202", "203"],

      rwBaseConfig: {
        orgLevel: 4,
        orgLevelText: "分局",
        checkLevel: []
      },

      // 不允许处理的标准件id
      nFormId: [],

      currentDataQueryData: {}
    };
  },
  computed: {
    canPlzp() {
      return (
        this.currentDataQueryData.operationType === "02" &&
        this.currentDataQueryData.allowAllMjDel &&
        this.currentDataQueryData.taskBllx
      );
    },
    canPlrl() {
      return this.currentDataQueryData.operationType === "01";
    }
  },
  created() {
    let nFormId = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "nFormId");
    this.nFormId = nFormId ? nFormId.value.split(",") : [];
    this.initOrgLevel();
  },
  mounted() {
    this.getYj();
    this.getOrganZpConfig();
    // 获取不允许注销的任务表单
    let nLogoutFormId = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "nLogoutFormId");
    this.nLogoutFormId = nLogoutFormId ? nLogoutFormId.value.split(",") : [];
    // 获取最大移交次数
    let maxYjNum = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "yjcs");
    this.maxYjNum = maxYjNum ? maxYjNum.value.split(",") : [];
    if (this.$route.query) {
      // 从 鄂尔多斯基础管控中心门户消息中心进来（有些参数要特殊处理，所以添加标识）
      if (this.$route.query.source === "eeds-zhpcsmh-msg") {
        // 带formId的话，isPc应该是空字符串，这里源头会修改
        this.queryData.isPc = this.$route.query.isPc || "";
        this.queryData.fromId = this.$route.query.formId || "";
        this.queryData.state = this.$route.query.state || "";
        this.queryData.sfcq = this.$route.query.sfcq || "";
      }
    }

    // 获取不允许注销的任务表单
    let nLogoutPcsCity = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "nLogoutPcsCity");
    this.nLogoutPcsCity = nLogoutPcsCity ? nLogoutPcsCity.value.split(",") : [];
    // 加载数据
    // this.loadList();
  },
  methods: {
    initOrgLevel() {
      let _this = this;
      let configValue = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "rwBaseConfig");

      if (configValue && configValue.value) {
        let baseConfig = JSON.parse(configValue.value);
        this.rwBaseConfig = baseConfig;
      }
    },
    // 获取注销按钮权限
    getLogoutIsShow() {
      if (this.$utilPublic.getUserOrgLevel() === "5") {
        // 当前用户机构是否在nLogoutPcsCity中
        return !this.nLogoutPcsCity.includes(
          this.$utilPublic.getUserOrgId().substr(0, 4)
        );
      } else {
        return true;
      }
    },
    getYj() {
      // 获取配置文件，动态判断是否显示移交按钮
      // 获取已开通移交的盟市
      let yjCityConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityList");
      let yjCityConfigValue = yjCityConfig ? yjCityConfig.value : "";
      let cityList = yjCityConfigValue.split(",");
      // 获取当前用户机构
      let userOrgId = this.$utilPublic.getUserInfo().orgId;
      // 判断当前机构是否在已开通移交的盟市列表中
      let isExist = cityList.some((city) => userOrgId.startsWith(city));

      // 获取已排除移交的盟市
      let yjExcludeCityConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityListExclude");
      let yjExcludeCityConfigValue = yjExcludeCityConfig
        ? yjExcludeCityConfig.value
        : "";
      let excludeCityList = yjExcludeCityConfigValue.split(",");
      // 判断当前机构是否在已排除移交的盟市列表中（若两列表均满足，那已排除优先级大于已开通）
      let isExclude = excludeCityList.some((city) =>
        userOrgId.startsWith(city)
      );

      // 获取移交按钮的权限
      let yjAuthority = this.$utilPublic.getUserAuthority(
        "yj",
        "NewTaskCenterDisList"
      );

      // 获取不允许移交的任务表单配置
      let nYjFormIdConfig = this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "nYjFormId");
      let nYjFormIdConfigValue = nYjFormIdConfig ? nYjFormIdConfig.value : "";
      this.nYjFormIdList = nYjFormIdConfigValue.split(",");

      this.showYj = yjAuthority && isExist && !isExclude;

      // 经上判断，如果当前用户机构允许移交，那么动态根据配置获取移交限制类型
      if (this.showYj) {
        // 获取各城市在移交功能中的限制条件
        this.getOrganYjConfig();
      }
    },
    // 获取各城市在移交功能中的限制条件
    getOrganYjConfig() {
      let _this = this;
      let cityConfigList = _this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "yjCityConfig");
      let configList = (cityConfigList || { value: "" }).value
        .split(",")
        .map((configItem) => {
          return {
            orgId: configItem.split(":")[0],
            type: configItem.split(":")[1]
          };
        });
      // 获取当前用户机构
      let currentUserOrg = _this.$utilPublic.getUserInfo().orgId;
      let matchConfigList = configList.filter((configItem) =>
        currentUserOrg.startsWith(configItem.orgId)
      );
      if (matchConfigList.length > 0) {
        // 如果符合配置的有多个，获取级别最小的配置
        let currentOrgConfig = matchConfigList.reduce(
          (pre, cur) => {
            if (cur.orgId.length > pre.orgId.length) {
              pre = cur;
            }
            return pre;
          },
          {
            type: "1",
            orgId: "1"
          }
        );
        _this.currentOrgYjType = currentOrgConfig.type;
      }
    },
    // 初始化时，动态根据当前机构判断指派操作类型，是逐级还是可跨级
    getOrganZpConfig() {
      let _this = this;
      // 获取当前用户机构级别
      let currentUserOrgLevel = _this.$utilPublic.getUserInfo().orgLevel;

      let cityConfigList = _this.$storage.session
        .get("configData")
        .find((e) => e.key === "RW" && e.keyItem === "zpCityConfig");

      let configList = (cityConfigList || { value: "" }).value
        .split(",")
        .map((configItem) => {
          return {
            orgId: configItem.split(":")[0],
            type: configItem.split(":")[1]
          };
        });
      // 获取当前用户机构
      let currentUserOrg = _this.$utilPublic.getUserInfo().orgId;
      let matchConfigList = configList.filter((configItem) =>
        currentUserOrg.startsWith(configItem.orgId)
      );
      if (matchConfigList.length > 0) {
        // 如果符合配置的有多个，获取级别最小的配置
        let currentOrgConfig = matchConfigList.reduce(
          (pre, cur) => {
            if (cur.orgId.length > pre.orgId.length) {
              pre = cur;
            }
            return pre;
          },
          {
            type: "1",
            orgId: "1"
          }
        );
        _this.currentOrgZpType = currentOrgConfig.type;
      }
    },
    clickCheckbox() {},
    // 加载数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions,
        ..._this.defaultQueryData,
        state: "2" // jin
      };
      if (!dataParams.sjgsdwdm) {
        let currentOrgLevel = _this.$utilPublic.getUserInfo().orgLevel;
        if (Number(currentOrgLevel) > 5) {
          dataParams.sjgsdwdm =
            _this.$utilPublic.getUserInfo().orgId.substr(0, 8) + "0000";
        }
      }
      // Lambda写法
      getZpOrRlTaskPage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;

            _this.currentDataQueryData = this.$utilStr.deepClone(dataParams);

            _this.treeDataList = data.treeDataList || [];
            _this.leftActiveForm = dataParams.fromId;
            _this.isLoaded = true;

            // 列表左侧标准件表单树的统计
            _this.$emit(
              "update-left-tree",
              _this.treeDataList,
              _this.leftActiveForm
            );

            // 当前列表的id集合
            // 如果是认领，则把id都推入数组中，用于全选操作
            _this.multipleData = (data.records || []).map(
              (item) => item.vo.taskorgrecodeid
            );
            _this.multipleArray = [];
            _this.isIndeterminate = false;
            _this.checkAll = false;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
          //分页后清空当前已选值
          _this.multipleArray = [];
        });
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
      this.extendData.sjgsdwdm = "";
      this.extendData.taskState = "";
      this.extendData.taskMode = "";
      this.extendData.taskLevel = "";
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 指派
    handleAssign(index, row) {
      // 如果是指派，说明数据下发到机构了，而可以下发的机构，只有分局和派出所
      // 分局指派时，只能选择到派出所
      // 派出所指派时，只能选择到人（多选）
      this.$refs.assignRef.visible = true;
      this.$refs.assignRef.zpType = this.currentOrgZpType;
      this.$refs.assignRef.taskId = [row.vo.taskorgrecodeid];
      this.$refs.assignRef.isPl = false;
      this.$refs.assignRef.row = row;
      this.$refs.assignRef.beforeLoadForm();
    },
    // 指派回调
    handleAssignBack() {
      // 删除成功刷新列表
      this.triggerDeletedReload();
    },
    // 认领
    handleClaim(index, row) {
      let _this = this;
      _this
        .$confirm("确定要认领吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 参数
          let dataParams = {
            id: [row.vo.taskorgrecodeid],
            userIdList: [_this.$utilPublic.getUserInfo().id],
            flag: "4",
            sjgsdwdmList: []
          };
          // Lambda写法
          doZpOrRlTask(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: "认领成功",
                  type: "success"
                });
                // 删除成功刷新列表
                _this.triggerDeletedReload();
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            });
        })
        .catch(() => {});
    },
    // 批量认领
    handleClaimBatch() {
      let _this = this;
      if (_this.multipleArray.length === 0) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "请至少选择一条数据"
        });
      } else if (_this.multipleArray.length > 100) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "超出批量认领最大限制，最多批量认领100条数据"
        });
      } else {
        _this
          .$confirm("确定要认领已勾选任务吗?", "提示", {
            confirmButtonText: "认领",
            cancelButtonText: "取消",
            type: "warning"
          })
          .then(() => {
            // 参数
            let dataParams = {
              id: _this.multipleArray,
              userIdList: [_this.$utilPublic.getUserInfo().id],
              flag: "4",
              sjgsdwdmList: []
            };
            // Lambda写法
            doZpOrRlTask(dataParams)
              .then((response) => {
                // 响应成功回调
                let { success, msg } = response.data;
                if (success) {
                  _this.$message({
                    showClose: true,
                    customClass: "is-fixed",
                    message: "认领成功",
                    type: "success"
                  });
                  // 删除成功刷新列表
                  _this.triggerDeletedReload();
                }
              })
              .catch((error) => {
                // 响应错误回调
                console.error(error);
              });
          })
          .catch(() => {});
      }
    },
    // 批量指派
    handleAssignBatch() {
      let _this = this;
      if (_this.multipleArray.length === 0) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "请至少选择一条数据"
        });
      } else if (_this.multipleArray.length > 100) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "超出批量指派最大限制，最多批量指派100条数据"
        });
      } else {
        // 如果批量勾选了一条任务
        let selectArr = _this.tableData.filter((item) =>
          _this.multipleArray.includes(item.vo.taskorgrecodeid)
        );
        this.$refs.assignRef.visible = true;
        this.$refs.assignRef.zpType = this.currentOrgZpType;
        this.$refs.assignRef.taskId = this.multipleArray;
        this.$refs.assignRef.isPl = true;

        this.$refs.assignRef.row = selectArr[0];

        this.$refs.assignRef.beforeLoadForm();
      }
    },
    // 移交功能（新封装）
    handleTransferNew(row, currentOrgYjType) {
      this.$refs.transferRef.visible = true;
      this.$refs.transferRef.taskList = [row];
      this.$refs.transferRef.taskIds = [row.vo.taskorgrecodeid];
      this.$refs.transferRef.yjType = currentOrgYjType;
      this.$refs.transferRef.beforeLoadForm();
    },
    // 移交
    handleTransfer(index, row) {
      if (!this.handleJyyjcs(row)) {
        this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "任务移交已达最大次数，请联系市局协调处理！"
        });
        return;
      }
      this.$refs.transferRef.visible = true;
      this.$refs.transferRef.taskList = [row];
      this.$refs.transferRef.taskIds = [row.vo.taskorgrecodeid];
      this.$refs.transferRef.yjType = this.currentOrgYjType;
      this.$refs.transferRef.beforeLoadForm();
    },
    // 批量移交
    handleTransferBatch() {
      let _this = this;
      if (_this.multipleArray.length === 0) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "请至少选择一条数据"
        });
      } else if (_this.multipleArray.length > 100) {
        _this.$message({
          showClose: true,
          customClass: "is-fixed",
          type: "warning",
          message: "超出批量移交最大限制，最多批量移交100条数据"
        });
      } else {
        let selectArr = _this.tableData.filter((item) =>
          _this.multipleArray.includes(item.vo.taskorgrecodeid)
        );
        // 判断移交次数有没有超出配置的
        for (let i = 0; i < selectArr.length; i++) {
          if (!this.handleJyyjcs(selectArr[i])) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              type: "warning",
              message:
                "已勾选任务中，存在任务移交超出最大次数的任务，请联系市局协调处理或请重新选择。"
            });
            return;
          }
          // 不允许移交的表单
          if (
            this.nYjFormIdList.findIndex((e) => e === selectArr[i].vo.formId) >
            -1
          ) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              type: "warning",
              message: "已勾选任务中，存在不允许移交的任务，请重新选择。"
            });
            return;
          }
        }
        // 如果是在推送机构下随意移交，那么判断已选的值中是否都一样，否则提示
        // if (_this.currentOrgYjType === '1') { // 替换为下方yjButtonRef中的值
        if (_this.$refs.yjButtonRef.currentOrgYjType === "1") {
          let pushOrgid = selectArr[0].vo.pushOrgid;
          // 判断推送机构是否一样
          let hasDif = selectArr.some(
            (item) => item.vo.pushOrgid !== pushOrgid
          );

          if (hasDif) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              type: "warning",
              message:
                "已勾选任务中，推送机构存在不一样，请保证批量移交任务均为同一个推送机构。"
            });
          } else {
            this.$refs.transferRef.visible = true;
            this.$refs.transferRef.taskList = selectArr;
            this.$refs.transferRef.taskIds = selectArr.map(
              (item) => item.vo.taskorgrecodeid
            );
            this.$refs.transferRef.yjType = this.currentOrgYjType;
            this.$refs.transferRef.beforeLoadForm();
          }
        } else {
          this.$refs.transferRef.visible = true;
          this.$refs.transferRef.taskList = selectArr;
          this.$refs.transferRef.taskIds = selectArr.map(
            (item) => item.vo.taskorgrecodeid
          );
          this.$refs.transferRef.yjType = this.currentOrgYjType;
          this.$refs.transferRef.beforeLoadForm();
        }
      }
    },
    // 样式
    getTaskModeType(val) {
      let res = "success";
      if (val === "1") {
        res = "success";
      } else if (val === "2") {
        res = "primary";
      } else if (val === "3") {
        res = "danger";
      }
      return res;
    },
    // 样式
    getTaskLevelType(val) {
      let res = "danger";
      if (val === "1") {
        res = "success";
      } else if (val === "2") {
        res = "warning";
      } else if (val === "3") {
        res = "danger";
      }
      return res;
    },
    // 列表选择&全选
    // 全选
    handleCheckAllChange(val) {
      this.multipleArray = val ? this.multipleData : [];
      this.isIndeterminate = false;
    },
    // 列表项复选框切换
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.multipleData.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.multipleData.length;
    },
    // 立即处理
    handleFinish(index, row) {
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$refs.editRef.beforeLoadForm();
    },
    // 撤回
    handleRevoke(index, row) {
      this.$refs.revokeRef.visible = true;
      this.$refs.revokeRef.row = row;
      this.$refs.revokeRef.beforeLoadForm();
    },
    // 注销子任务
    handleLogoutTask(index, row) {
      this.$refs.logoutTagkRef.visible = true;
      this.$refs.logoutTagkRef.row = row;
      this.$refs.logoutTagkRef.beforeLoadForm();
    },
    // 复制任务
    handleCopyTask(index, row) {
      this.$refs.copyTaskRef.visible = true;
      this.$refs.copyTaskRef.row = row;
      this.$refs.copyTaskRef.beforeLoadForm();
    },
    // 校验移交次数
    handleJyyjcs(row) {
      // 市局用户不做限制
      if (this.$utilPublic.getUserOrgLevel() === "3") {
        return true;
      }
      if (row.vo.recodeLabels) {
        let yjNum = row.vo.recodeLabels.find((e) => e.type === "1");
        if (yjNum && yjNum.num >= this.maxYjNum) {
          return false;
        }
        return true;
      }
      return true;
    }
  }
};
</script>

<style lang="scss" scoped>
.large-checkbox {
  .el-checkbox {
    ::v-deep .el-checkbox__input .el-checkbox__inner {
      width: 24px;
      height: 24px;
      &::after {
        height: 14px;
        width: 6px;
        left: 7px;
      }
      &::before {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
::v-deep .el-checkbox-group {
  display: contents;
}
.con-table {
  .el-checkbox {
    ::v-deep .el-checkbox__label {
      display: none;
    }
  }
}

// 列表复选框样式
.hdty-box-check {
  position: absolute;
  right: 200px;
  bottom: 10px;
}

.hdty-task {
  width: 100%;
  height: 120px;
  border-bottom: 1px solid #cccccc;
  padding-left: 12px;
  position: relative;
  cursor: pointer;
  display: flex;
  &:hover {
    background-color: #ffe6e6;
    &:before {
      content: "";
      width: 4px;
      height: 100%;
      position: absolute;
      background-color: #ff6060;
      left: -1px;
      top: 0;
    }
  }
  .hdty-task-body {
    width: calc(100% - 180px);
    padding: 3px 10px 0 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
  }
  .hdty-task-operate {
    width: 180px;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    &:before {
      content: "";
      position: absolute;
      width: 1px;
      height: 80%;
      background-color: #ccc;
      left: 0;
    }
    .el-button {
      margin: 3px;
    }
  }
  .hdty-task-row {
    width: 100%;
    display: flex;
    font-size: 15px;
    .hdty-task-row-item {
      display: flex;
      &.row-item-12 {
        width: 50%;
      }
    }
  }

  .con-content {
    max-width: 75%;
    font-weight: bold;
  }

  .con-flex {
    display: flex;
    align-items: center;
  }

  .con-i-label-info {
    width: 100%;
    .con-i-label {
      flex: 0 0 100px;
    }
    .con-i-content {
      flex: 1;
    }
    i {
      margin-right: 3px;
      margin-top: -2px;
      font-size: 16px;
    }
  }
  .con-cq-label {
    position: absolute;
    right: 340px;
    top: 8px;
  }
}
/* 定义闪烁的keyframes动画 */
@keyframes blinkDanger {
  0%,
  50% {
    background-color: #f56c6c;
  }
  50%,
  75% {
    background-color: #fea8a8;
  }
  100% {
    background-color: #f56c6c;
  }
}
@keyframes blinkWraning {
  0%,
  50% {
    background-color: #e6a23c;
  }
  50%,
  75% {
    background-color: #fdc673;
  }
  100% {
    background-color: #e6a23c;
  }
}
.hdty-task-level {
  width: 100px;
  height: 25px;
  //background-color: rgba(255, 96, 96, 0.9);
  color: #fff;
  /* 设置旋转角度，这里以45度为例 */
  transform: rotate(-45deg);
  position: absolute;
  /* 添加一些文本居中样式（可选） */
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-left: -45px;
  margin-top: 5px;
  margin-right: 15px;
  &.danger {
    background-color: rgba(245, 108, 108, 0.8);
    animation: blinkDanger 2s step-end infinite;
  }
  &.success {
    background-color: rgba(103, 194, 58, 0.8);
  }
  &.warning {
    background-color: rgba(230, 162, 60, 0.8);
    animation: blinkWraning 2s step-end infinite;
  }
}
.hdty-task-level-1 {
  width: 30px;
  font-size: 15px;
  color: #fff;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-left: -15px;
  margin-top: 2px;
  margin-bottom: 2px;
  line-height: 25px;
  text-align: center;
  &.danger {
    background-color: rgba(245, 108, 108, 0.9);
    animation: blinkDanger 2s step-end infinite;
  }
  &.success {
    background-color: rgba(103, 194, 58, 0.9);
  }
  &.warning {
    background-color: rgba(230, 162, 60, 0.9);
    animation: blinkWraning 2s step-end infinite;
  }
}
</style>
