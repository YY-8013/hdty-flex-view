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
              <el-form-item label="任务搜索" prop="taskQuery">
                <!-- <hd-factor-input
                  prop="taskQueryFilterFactor"
                  fuzzy="between"
                  v-model="queryData.taskQuery"
                  :model-control.sync="factorData.taskQueryFilterFactor"
                  placeholder="请输入任务关键字"
                ></hd-factor-input>-->
                <el-input
                  prop="taskQueryFilterFactor"
                  v-model="queryData.taskQuery"
                  placeholder="请输入任务关键字"
                ></el-input>
              </el-form-item>
              <el-form-item label="任务状态" prop="state">
                <hd-dict-radio
                  v-model="queryData.state"
                  :dictCode="$global.dictType.taskZt"
                  :removeOption="['1']"
                  showAllButton
                  placeholder="请选择任务状态"
                ></hd-dict-radio>
              </el-form-item>
              <!--              <el-form-item prop="andor" slot="after">-->
              <!--                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>-->
              <!--              </el-form-item>-->
            </hd-expand-header>
            <hd-expand-body>
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
                <el-form-item label="核查状态" prop="isZtjd">
                  <hd-dict-radio
                    v-model="queryData.isZtjd"
                    :dictCode="$global.dictType.taskCheckStatus"
                    showAllButton
                  ></hd-dict-radio>
                </el-form-item>
                <el-form-item
                  label="核查结果"
                  prop="ztjdCheckState"
                  v-if="queryData.isZtjd === '1'"
                >
                  <hd-dict-radio
                    v-model="queryData.ztjdCheckState"
                    :dictCode="$global.dictType.jdjcsfhg"
                    showAllButton
                  ></hd-dict-radio>
                </el-form-item>
                <!-- <el-form-item label="是否超期" prop="sfcq">
                  <hd-dict-radio
                    v-model="queryData.sfcq"
                    :dictCode="$global.dictType.isOrNot"
                    showAllButton
                    placeholder="请选择是否超期"
                  ></hd-dict-radio>
                </el-form-item>-->
              </el-row>
              <el-row>
                <el-form-item label="责任机构" prop="sjgsdwdm">
                  <hd-organ
                    v-model="queryData.sjgsdwdm"
                    :model-text.sync="extendData.sjgsdwdm"
                    placeholder="请选择责任机构"
                  ></hd-organ>
                </el-form-item>
                <el-form-item label="任务要求" prop="taskRwyq">
                  <hd-factor-input
                    prop="taskRwyqFilterFactor"
                    fuzzy="between"
                    v-model="queryData.taskRwyq"
                    :model-control.sync="factorData.taskRwyqFilterFactor"
                    placeholder="请输入任务要求"
                  ></hd-factor-input>
                </el-form-item>
                <el-form-item label="创建类型" prop="createType">
                  <el-radio-group v-model="queryData.createType">
                    <el-radio
                      v-for="(typeItem, index) in createTypeOptions"
                      :key="`typeItem-${index}`"
                      :label="typeItem.value"
                      >{{ typeItem.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <el-row>
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
                <el-form-item label="移交次数" prop="yjNum">
                  <el-input
                    v-model="queryData.yjNum"
                    placeholder="请输入移交次数"
                    style="width: 160px"
                  ></el-input>
                  <el-tooltip
                    content="可查询移交次数大于等于当前输入值的任务"
                    placement="top"
                    style="
                      position: relative;
                      top: 3px;
                      margin-left: 3px;
                      margin-top: 3px;
                    "
                  >
                    <i
                      class="el-icon-question hdty-success-color"
                      style="font-size: 25px"
                    ></i>
                  </el-tooltip>
                </el-form-item>
                <el-form-item
                  label="办理民警身份证号"
                  prop="userGmsfhm"
                  style="margin-left: 15px"
                >
                  <hd-factor-input
                    prop="userGmsfhmFilterFactor"
                    fuzzy="between"
                    v-model="queryData.userGmsfhm"
                    :model-control.sync="factorData.userGmsfhmFilterFactor"
                    placeholder="请输入办理民警身份证号"
                  ></hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务办结时间" prop="rwwcsj">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.rwwcsj"
                  ></hd-date-picker>
                </el-form-item>
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
                <el-form-item label="注销状态" prop="zxbs">
                  <hd-dict-radio
                    v-model="queryData.zxbs"
                    :dict-code="$global.dictType.logoutStatus"
                    show-all-button
                  ></hd-dict-radio>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="任务结束时间" prop="endTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.endTime"
                  ></hd-date-picker>
                </el-form-item>
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
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery"
          >查询</hd-button
        >
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-download"
          :title="
            !defaultQueryData.fromId
              ? '请选择一个标准件/表单，再操作【结果导出】'
              : ''
          "
          :disabled="!defaultQueryData.fromId"
          :loading="exportingResult"
          @click="handleExportResult"
          >结果导出</hd-button
        >
      </hd-button-container>
    </div>
    <!--列表-->
    <div class="hdty-fit" style="background-color: #fff" v-loading="loading">
      <div
        class="con-table hdty-scroll"
        v-if="tableData && tableData.length > 0"
      >
        <div class="hdty-task" v-for="(item, index) in tableData" :key="index">
          <!-- 任务等级标签 -->
          <!--          <div :class="'hdty-task-level ' + getTaskLevelType(index + '')">{{ index === 3 ?'特急':index === 1?'平急':'加急' }}</div>-->
          <div
            :class="'hdty-task-level-1 ' + getTaskLevelType(item.vo.taskLevel)"
          >
            {{ item.vox.taskLevel }}
          </div>
          <div class="hdty-task-body" @click="handleDetail(index, item)">
            <div class="hdty-task-row">
              <div class="con-content hdty-elip" line-clamp="2">
                {{ item.vo.taskContent }}
              </div>
              <div style="margin-left: 12px">
                <el-tag
                  size="mini"
                  type="info"
                  effect="dark"
                  v-if="item.vo.taskState === '1' || item.vo.taskState === '2'"
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
                <el-tag :type="getTaskModeType(item.vo.taskMode)" size="mini">{{
                  item.vox.taskMode
                }}</el-tag>
                <!--                <el-tag-->
                <!--                  :type="getTaskLevelType(item.vo.taskLevel)"-->
                <!--                  size="mini"-->
                <!--                >{{ item.vox.taskLevel }}-->
                <!--                </el-tag>-->
                <el-tag
                  style="margin-left: 5px"
                  type="info"
                  size="mini"
                  v-if="item.vo.createType"
                  >{{ item.vo.createTypeText }}</el-tag
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
                  {{ item.vo.formId === "000" ? "任务对象描述" : "对象名称" }}：
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
                    v-show="!['1', '2', '4'].includes(item.vo.objectJSON.gklx)"
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
                  <div v-if="item.vo.objectJSON && item.vo.objectJSON.gkmjName">
                    【{{ item.vo.objectJSON.gkmjName }}】
                  </div>
                </div>
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
            <div
              class="hdty-task-row"
              v-if="
                item.vo.formId === '205' &&
                item.vo.objectJSON &&
                item.vo.objectJSON.taskAddress
              "
            >
              <div class="hdty-task-row-item row-item-24">
                <div class="con-flex con-i-label-info">
                  <i class="el-icon-location-information"></i>
                  <div>单位地址：</div>
                  <div>
                    {{
                      item.vo.objectJSON && item.vo.objectJSON.taskAddress
                        ? item.vo.objectJSON.taskAddress
                        : "暂无单位地址"
                    }}
                  </div>
                </div>
              </div>
            </div>
            <div class="hdty-task-row">
              <div class="hdty-task-row-item row-item-12">
                <div
                  class="con-flex con-i-label-info"
                  v-if="item.vo.taskState === '1'"
                >
                  <i class="el-icon-guide"></i>
                  <div>待推送机构：</div>
                  <div class="hdty-elip">
                    {{ item.vox.createOrgId || "暂无待推送机构" }}
                  </div>
                </div>
                <div
                  class="con-flex con-i-label-info"
                  v-if="item.vo.taskState === '2'"
                >
                  <i class="el-icon-guide"></i>
                  <div>待指派机构：</div>
                  <div class="hdty-elip">
                    {{ item.vox.sjgsdwdm || "暂无待指派机构" }}
                  </div>
                </div>
                <div
                  class="con-flex con-i-label-info hdty-elip"
                  v-if="item.vo.taskState === '3'"
                >
                  <i class="el-icon-guide"></i>
                  <div>待办机构/待办人：</div>
                  <div class="hdty-elip">
                    {{
                      (item.vox.sjgsdwdm || "") +
                      (item.vo.userXm ? "【" + item.vo.userXm + "】" : "")
                    }}
                  </div>
                </div>
                <div
                  class="con-flex con-i-label-info hdty-elip"
                  v-if="item.vo.taskState === '4'"
                >
                  <i class="el-icon-guide"></i>
                  <div>办结机构/办结人：</div>
                  <div class="hdty-elip">
                    {{
                      (item.vox.sjgsdwdm || "") +
                      (item.vo.userXm ? "【" + item.vo.userXm + "】" : "")
                    }}
                  </div>
                </div>
              </div>
              <div class="hdty-task-row-item row-item-12">
                <el-tag
                  v-if="item.vo.checkStateText"
                  :type="
                    item.vo.checkStateText === '合格' ? 'success' : 'danger'
                  "
                  size="mini"
                  >{{ item.vo.checkStateText }}</el-tag
                >
                <el-badge
                  v-if="item.vo.recodeLabels"
                  :value="val.num"
                  class="item"
                  type="warning"
                  style="margin-left: 3px"
                  v-for="(val, index) in item.vo.recodeLabels"
                  :key="index"
                >
                  <el-tag type="warning" size="mini">{{ val.typeText }}</el-tag>
                </el-badge>
              </div>
            </div>
          </div>
          <div class="con-cq-label" v-if="item.vo.rwsfcq === '1'">
            <img src="./../images/yyq.png" alt style="height: 70px" />
          </div>
          <!-- 操作按钮-->
          <div class="hdty-task-operate">
            <div>
              <el-button
                v-if="
                  btn.ywcl &&
                  item.vo.taskState === '3' &&
                  nFormId.findIndex((e) => e === item.vo.formId) < 0 &&
                  item.vo.zxbs === '0'
                "
                name="ywcl"
                size="mini"
                type="primary"
                @click="handleFinish(index, item)"
                >处理</el-button
              >
              <el-button
                v-if="
                  btn.revoke &&
                  item.vo.taskState === '3' &&
                  item.vo.zxbs === '0'
                "
                name="revoke"
                size="mini"
                type="primary"
                @click="handleRevoke(index, item)"
                >撤回</el-button
              >
              <el-button
                v-if="btn.taskDelete"
                name="revoke"
                size="mini"
                type="danger"
                @click="handleDelete(index, item)"
                >删除</el-button
              >
              <el-button
                v-if="
                  getLogoutIsShow() &&
                  nLogoutFormId.findIndex((e) => e === item.vo.formId) < 0 &&
                  item.vo.taskState !== '4' &&
                  item.vo.zxbs === '0'
                "
                size="mini"
                type="danger"
                @click="handleLogoutTask(index, item)"
                >注销</el-button
              >
              <!-- 移交 -->
              <yj-button
                ref="yjButtonRef"
                @transfer="handleTransferNew"
                :item="item"
                @update="handleQuery"
              ></yj-button>
              <!--              <hd-button-->
              <!--                :disabled="item.vo.taskState === '4'"-->
              <!--                name="edit"-->
              <!--                size="mini"-->
              <!--                type="warning"-->
              <!--                @click="handleTransfer(index, item)"-->
              <!--              >移交</hd-button>-->
              <!--              <hd-button-->
              <!--                v-if="item.vo.cycleState === '2'"-->
              <!--                :disabled="item.vo.taskState === '4'"-->
              <!--                name="edit"-->
              <!--                size="mini"-->
              <!--                type="success"-->
              <!--                @click="handleFinishCycle(index, item)"-->
              <!--              >周期处理</hd-button>-->
              <el-button
                v-if="
                  btn.append &&
                  item.vo.taskState === '3' &&
                  item.vo.zxbs === '0'
                "
                size="mini"
                type="primary"
                @click="handleAppendAssign(index, item)"
                >追加指派</el-button
              >
            </div>
          </div>
        </div>
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
    <new-task-center-dis-task-revoke
      ref="revokeRef"
    ></new-task-center-dis-task-revoke>
    <new-task-center-dis-delete ref="deleteRef"></new-task-center-dis-delete>
    <new-task-center-del-edit ref="editRef"></new-task-center-del-edit>
    <new-task-center-dis-logout-task
      ref="logoutTagkRef"
    ></new-task-center-dis-logout-task>
    <new-task-append-assign ref="appendAssignRef"></new-task-append-assign>
    <new-task-center-del-transfer
      ref="transferRef"
    ></new-task-center-del-transfer>
  </div>
</template>
<script>
import { hdList } from "@/utils/util-framework";
import {
  getTaskSubPage,
  handleCycleSubTask,
  getZpOrRlTaskPage,
  exportsResult,
  withdraw
} from "../api";
import NewTaskCenterDelDetail from "../taskdel/NewTaskCenterDelDetail";

import NewTaskCenterDelTransfer from "../taskdel/NewTaskCenterDelTransfer";
import NewTaskCenterDelEdit from "../taskdel/NewTaskCenterDelEdit";
// import NewTaskCenterDelTransfer from './NewTaskCenterDelTransfer';
import NewTaskCenterDisTaskDetail from "./NewTaskCenterDisTaskDetail";
import NewTaskCenterDisTaskRevoke from "./NewTaskCenterDisTaskRevoke";
import NewTaskCenterDisLogoutTask from "./NewTaskCenterDisLogoutTask";
import NewTaskCenterDisDelete from "./NewTaskCenterDisDelete";
import newTaskAppendAssign from "../common/NewTaskAppendAssign.vue";
import YjButton from "../common/YjButton";

import listYw from "./listYw";

export default {
  name: "NewTaskCenterDelListAll",
  provide() {
    return {
      NewTaskCenterDelListAll: this,
      NewTaskCenterDelList: this,
      // 任务移交组件使用
      NewTaskCenterList: this,
      hdList: this
    };
  },
  inject: ["hdList"],
  mixins: [hdList, listYw],
  components: {
    NewTaskCenterDelDetail,
    NewTaskCenterDisTaskDetail,
    NewTaskCenterDelEdit,
    NewTaskCenterDisTaskRevoke,
    NewTaskCenterDisLogoutTask,
    newTaskAppendAssign,
    NewTaskCenterDelTransfer,
    YjButton,
    NewTaskCenterDisDelete
  },
  data() {
    return {
      // 查询
      queryData: {
        yqType: "",
        isPc: "1",
        fromId: "",
        taskQuery: "",
        state: "",
        sfcq: "",
        isZtjd: "",
        ztjdCheckState: "",
        sjgsdwdm: "",
        taskRwyq: "",
        taskMode: "",
        taskLevel: "",
        startTime: [],
        endTime: [],
        createTime: [],
        pushTime: [],
        rwwcsj: [],
        zxbs: "0",
        yjNum: "",
        // 创建类型
        createType: "",
        andor: this.$app.factorOptions.logicOpe.and,
        // 任务来源
        taskSjly: "",

        targetType: "5"
      },
      factorData: {
        taskQueryFilterFactor: this.$app.factorOptions.matchOpe.between,
        userGmsfhmFilterFactor: this.$app.factorOptions.matchOpe.exact,
        taskRwyqFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 查询扩展
      extendData: {
        sjgsdwdm: "",
        taskMode: "",
        taskLevel: ""
      },
      tableData: [],
      // 验证
      rules: {},
      defaultQueryData: {},
      // 不允许处理的标准件id
      nFormId: [],
      // 不允许注销的任务表单
      nLogoutFormId: [],
      // 不允许派出所注销的地市
      nLogoutPcsCity: [],
      exportingResult: false,
      btn: {
        ywcl: false,
        revoke: false,
        logoutGrrw: false,
        append: false,
        taskDelete: false
      },
      createTypeOptions: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "自动推送",
          value: "1"
        },
        {
          label: "手动创建",
          value: "2"
        }
      ],
      // 展示管控类型和管控地址及民警姓名的标准件
      showGkFormId: ["202", "203"]
    };
  },
  mounted() {
    // 从其他系统跳转过来的参数
    // 获取不允许PC端处理的任务表单
    let nFormId = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "nFormId");
    this.nFormId = nFormId ? nFormId.value.split(",") : [];
    // 获取不允许注销的任务表单
    let nLogoutFormId = this.$storage.session
      .get("configData")
      .find((e) => e.key === "RW" && e.keyItem === "nLogoutFormId");
    this.nLogoutFormId = nLogoutFormId ? nLogoutFormId.value.split(",") : [];

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
    // 获取按钮权限
    let auth = this.$utilPublic.getUserRights("NewTaskCenterDisList");
    if (auth && auth.children) {
      this.btn.ywcl = auth.children.ywcl && auth.children.ywcl.hasAuthority;
      this.btn.append =
        auth.children.append && auth.children.append.hasAuthority;
      this.btn.revoke =
        auth.children.revoke && auth.children.revoke.hasAuthority;
      this.btn.logoutGrrw =
        auth.children.logoutGrrw && auth.children.logoutGrrw.hasAuthority;
      this.btn.taskDelete =
        auth.children.taskDelete && auth.children.taskDelete.hasAuthority;
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
    // 移交功能（新封装）
    handleTransferNew(row, currentOrgYjType) {
      this.$refs.transferRef.visible = true;
      this.$refs.transferRef.taskList = [row];
      this.$refs.transferRef.taskIds = [row.vo.taskorgrecodeid];
      this.$refs.transferRef.yjType = currentOrgYjType;
      this.$refs.transferRef.beforeLoadForm();
    },
    // 加载数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.factorData,
        ..._this.pageOptions,
        ..._this.defaultQueryData
      };
      // Lambda写法
      getZpOrRlTaskPage(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;

            _this.treeDataList = data.treeDataList || [];
            _this.leftActiveForm = dataParams.fromId;
            _this.isLoaded = true;

            // 列表左侧标准件表单树的统计
            _this.$emit(
              "update-left-tree",
              _this.treeDataList,
              _this.leftActiveForm
            );
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
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
      this.queryData.isPc = "1";
      this.queryData.fromId = "";
      this.queryData.state = "";
      this.queryData.sfcq = "";
      this.extendData.sjgsdwdm = "";
      this.extendData.taskMode = "";
      this.extendData.taskLevel = "";
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
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
    // 删除
    handleDelete(index, row) {
      this.$refs.deleteRef.visible = true;
      this.$refs.deleteRef.row = row;
      this.$refs.deleteRef.beforeLoadForm();
    },
    // 注销子任务
    handleLogoutTask(index, row) {
      this.$refs.logoutTagkRef.visible = true;
      this.$refs.logoutTagkRef.row = row;
      this.$refs.logoutTagkRef.beforeLoadForm();
    },
    // 移交
    handleTransfer(index, row) {
      this.$refs.transferRef.visible = true;
      this.$refs.transferRef.row = row;
      this.$refs.transferRef.beforeLoadForm();
    },
    // 周期处理
    handleFinishCycle(index, row) {
      let _this = this;
      // 参数
      let dataParams = {
        id: row.vo.taskUserRecodeId
      };
      // Lambda写法
      handleCycleSubTask(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, msg } = response.data;
          if (success) {
            _this.$message({
              showClose: true,
              customClass: "is-fixed",
              message: "周期处理成功",
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
      let res = "success";
      if (val === "1") {
        res = "success";
      } else if (val === "2") {
        res = "warning";
      } else if (val === "3") {
        res = "danger";
      }
      return res;
    },
    // 结果导出
    handleExportResult() {
      let _this = this;
      // 导出前验证
      if (_this.exportValidator()) {
        _this.exportingResult = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions,
          ..._this.defaultQueryData
        };
        exportsResult(dataParams)
          .then((response) => {
            // 响应成功回调
            _this.download(response);
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            _this.exportingResult = false;
          });
      }
    },
    // 追加指派
    handleAppendAssign(index, row) {
      this.$refs.appendAssignRef.visible = true;
      this.$refs.appendAssignRef.row = row;
      this.$refs.appendAssignRef.beforeLoadForm();
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-task {
  width: 100%;
  min-height: 110px;
  border-bottom: 1px solid #cccccc;
  padding-left: 12px;
  padding-bottom: 5px;
  position: relative;
  cursor: pointer;
  display: flex;
  overflow: hidden;

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
    justify-content: left;
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
    max-width: 68%;
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
    top: 9px;
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
  padding-left: 9px;
  color: #fff;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  //text-align: center;
  margin-left: -15px;
  margin-top: 4px;
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
