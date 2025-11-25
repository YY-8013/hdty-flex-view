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
                <!-- <hd-factor-input
                  prop="taskContentFilterFactor"
                  fuzzy="between"
                  v-model="queryData.taskContent"
                  :model-control.sync="factorData.taskContentFilterFactor"
                  placeholder="请输入任务名称"
                ></hd-factor-input> -->
                <el-input
                  prop="taskContentFilterFactor"
                  v-model="queryData.taskContent"
                  placeholder="请输入任务关键字"
                ></el-input>
              </el-form-item>
              <el-form-item label="创建机构" prop="sjgsdwdm">
                <hd-organ
                  v-model="queryData.sjgsdwdm"
                  :model-text.sync="extendData.sjgsdwdm"
                  placeholder="请选择创建机构"
                ></hd-organ>
              </el-form-item>
              <!--              <el-form-item prop="andor" slot="after">-->
              <!--                <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>-->
              <!--              </el-form-item>-->
            </hd-expand-header>
            <hd-expand-body>
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
                <el-form-item label="任务状态" prop="taskState">
                  <hd-dict-select
                    v-model="queryData.taskState"
                    :dictCode="$global.dictType.taskZt"
                    :model-text.sync="extendData.taskState"
                    collapseTags
                    filterable
                    placeholder="请选择任务状态"
                  ></hd-dict-select>
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
              </el-row>
              <el-row>
                <el-form-item label="任务创建时间" prop="createTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.createTime"
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
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
          >创建</hd-button
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
    <!--列表最上方分隔线-->
    <div style="width: 100%; height: 1px; background-color: #ccc"></div>
    <!--列表-->
    <div class="hdty-fit" v-loading="loading">
      <div
        class="con-table hdty-scroll"
        v-if="tableData && tableData.length > 0"
      >
        <div class="hdty-task" v-for="(item, index) in tableData" :key="index">
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
                <el-tag
                  style="margin-left: 5px"
                  :type="getTaskLevelType(item.vo.taskLevel)"
                  size="mini"
                  >{{ item.vox.taskLevel }}</el-tag
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
                    >{{ item.vo.formIdText || "暂无" }}</span
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
              <!--<div class="hdty-task-row-item row-item-12">
                <div class="con-flex con-i-label-info">
                  <i class="el-icon-document"></i>
                  <div>已下发：</div>
                  <div class="text-color-4" style="font-size: 16px;">16</div>
                </div>
                <div class="con-flex con-i-label-info" style="margin-left: 18px;">
                  <i class="el-icon-document"></i>
                  <div>已办理：</div>
                  <div class="text-color-4" style="font-size: 16px;">16</div>
                </div>
                <div class="con-flex con-i-label-info" style="margin-left: 18px;">
                  <i class="el-icon-document "></i>
                  <div>未办理数：</div>
                  <div class="text-color-4" style="font-size: 16px;">16</div>
                </div>
              </div>-->
              <div class="hdty-task-row-item row-item-12">
                <div class="con-flex con-i-label-info">
                  <i class="icon-company"></i>
                  <div>创建机构：</div>
                  <div>{{ item.vox.createOrgId || "暂无创建机构" }}</div>
                </div>
              </div>
              <div class="hdty-task-row-item row-item-12">
                <div class="con-flex con-i-label-info">
                  <i class="icon-company"></i>
                  <div>推送机构：</div>
                  <div>{{ item.vox.pushOrgid || "暂无推送机构" }}</div>
                </div>
              </div>
            </div>
          </div>
          <!-- 状态标签-->
          <div
            class="con-cq-label"
            v-if="item.vo.zxbs === '1' || item.vo.rwsfcq === '1'"
          >
            <img
              src="./images/zxbs.png"
              alt
              height="80"
              v-if="item.vo.zxbs === '1'"
            />
            <img
              src="./images/yyq.png"
              alt
              height="80"
              v-if="item.vo.rwsfcq === '1'"
            />
          </div>
          <!-- 操作按钮-->
          <div class="hdty-task-operate">
            <div>
              <!-- :disabled="item.vo.zxbs === '1'" -->
              <!--待推送的数据才有推送按钮 -->
              <hd-button
                v-if="item.vo.taskState === '1' && item.vo.zxbs != '1'"
                name="edit"
                size="mini"
                type="primary"
                @click="handlePush(index, item)"
                >推送</hd-button
              >
              <hd-button
                v-if="item.vo.taskState === '1' && item.vo.zxbs != '1'"
                name="edit"
                size="mini"
                type="warning"
                @click="handleModify(index, item)"
                >编辑</hd-button
              >
              <!-- 撤销的数据 要恢复数据 -->
              <hd-button
                v-if="item.vo.taskState === '1' && item.vo.zxbs === '1'"
                size="mini"
                name="restore"
                type="primary"
                @click="handleRestore(index, item)"
                >恢复</hd-button
              >
              <hd-button
                v-else-if="item.vo.taskState != '1' && item.vo.zxbs === '1'"
                size="mini"
                name="restore"
                type="primary"
                @click="handleRestore(index, item)"
                >重新推送指派</hd-button
              >
              <!--待推送的数据才有注销按钮 -->
              <!-- :disabled="item.vo.zxbs === '1'" -->
              <hd-button
                v-if="item.vo.taskState !== '4' && item.vo.zxbs != '1'"
                name="delete"
                size="mini"
                type="danger"
                @click="handleLogout(index, item)"
                >撤销</hd-button
              >
              <!--已推送 & 未注销未办结的任务  有撤回按钮-->
              <hd-button
                v-if="
                  false &&
                  item.vo.zxbs === '0' &&
                  !['1', '4'].includes(item.vo.taskState)
                "
                size="mini"
                type="warning"
                @click="handleRevoke(index, item)"
                >撤回</hd-button
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
        >{{ tableData }}</biz-empty
      >
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

    <new-task-center-dis-add ref="addRef"></new-task-center-dis-add>
    <new-task-center-dis-detail ref="detailRef"></new-task-center-dis-detail>
    <new-task-center-dis-logout ref="logoutRef"></new-task-center-dis-logout>
    <new-task-center-dis-task-revoke
      ref="revokeRef"
    ></new-task-center-dis-task-revoke>
    <new-task-center-dis-modify
      ref="modifyRef"
      @update-list="loadList"
    ></new-task-center-dis-modify>
  </div>
</template>
<script>
import { hdList } from "@/utils/util-framework";
import { getTaskPage, pushTask, restoreTask } from "./../api";
import NewTaskCenterDisAdd from "./NewTaskCenterDisAdd";
import NewTaskCenterDisDetail from "./NewTaskCenterDisDetail";
import NewTaskCenterDisLogout from "./NewTaskCenterDisLogout";
import NewTaskCenterDisTaskRevoke from "./NewTaskCenterDisTaskRevoke";
import NewTaskCenterDisModify from "./NewTaskCenterDisModify";

import listYw from "./listYw";

export default {
  name: "NewTaskCenterDisListCreate",
  provide() {
    return {
      NewTaskCenterDisListCreate: this
    };
  },
  inject: ["hdList"],
  mixins: [hdList, listYw],
  components: {
    NewTaskCenterDisAdd,
    NewTaskCenterDisDetail,
    NewTaskCenterDisLogout,
    NewTaskCenterDisTaskRevoke,
    NewTaskCenterDisModify
  },
  data() {
    return {
      // 查询
      queryData: {
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
        createTime: [],
        zxbs: "0",
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
      defaultQueryData: {}
    };
  },
  mounted() {
    // 加载数据
    // this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions,
          ..._this.defaultQueryData
        };
        // Lambda写法
        getTaskPage(dataParams)
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
      }
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
    // 创建
    handleAdd() {
      this.$refs.addRef.visible = true;
      this.$refs.addRef.beforeLoadForm();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.pageOptions.current = 1;
      this.$refs.detailRef.pageOptionsTree.current = 1;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 编辑
    handleModify(index, row) {
      this.$refs.modifyRef.visible = true;
      this.$refs.modifyRef.show(row);
      // this.$refs.modifyRef.beforeLoadForm();
    },
    // 推送
    handlePush(index, row) {
      let _this = this;
      _this
        .$confirm("确定要推送吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 参数
          let dataParams = {
            taskId: row.vo.id
          };
          // Lambda写法
          pushTask(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
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
    // 注销
    handleLogout(index, row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$refs.logoutRef.beforeLoadForm();
    },
    // 撤销恢复 | 重新推送指派
    handleRestore(index, row) {
      const _this = this;
      let labelTxt = "恢复";
      // taskState 1：恢复任务 否则显示重新推送指派
      // 我创建的任务撤销后增加重新推送指派功能和恢复功能，重新指派推送就是清空注销信息直接推送，恢复就是把任务恢复到待推送状态
      if (row.vo.taskState != "1") {
        labelTxt = "重新推送指派";
      }
      _this
        .$confirm(`此操作将${labelTxt}任务，是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          restoreTask({ id: row.vo.id }).then((response) => {
            //响应成功回调
            let { success, msg } = response.data;
            if (success) {
              _this.handleQuery();
              _this.$message({
                type: "success",
                message: `${labelTxt}成功!`
              });
            }
          });
        });
    },
    // 撤回
    handleRevoke(index, row) {
      this.$refs.revokeRef.visible = true;
      this.$refs.revokeRef.row = row;
      this.$refs.revokeRef.beforeLoadForm();
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
        res = "primary";
      } else if (val === "3") {
        res = "danger";
      }
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-task {
  width: 100%;
  min-height: 90px;
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
    padding: 3px 10px 0 0;
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
    i {
      margin-right: 3px;
      margin-top: -2px;
      font-size: 16px;
    }
  }
  .con-cq-label {
    position: absolute;
    right: 340px;
    top: 3px;
  }
}
</style>
