<template>
  <el-dialog
    :title="queryData.rwTitle ? '任务列表'+'-'+queryData.rwTitle : '任务列表'"
    :visible.sync="visible"
    width="80%"
    append-to-body
  >
    <hd-pane fit v-loading="submitting">
      <div class="hdty-container hdty-flex" style="padding: 0;height: 600px;">
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
                    <hd-factor-input
                      prop="taskContentFilterFactor"
                      fuzzy="between"
                      v-model="queryData.taskContent"
                      :model-control.sync="factorData.taskContentFilterFactor"
                      placeholder="请输入任务名称"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item prop="andor" slot="after">
                    <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
                  </el-form-item>
                </hd-expand-header>
                <hd-expand-body>
                  <el-row>
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
                        :model-text.sync="factorData.sjgsdwdmText"
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
                  </el-row>
                  <el-row>
                    <el-form-item label="任务类型" prop="taskMode">
                      <hd-dict-select
                        v-model="queryData.taskMode"
                        :dictCode="$global.dictType.rwlx"
                        :model-text.sync="factorData.taskMode"
                        collapseTags
                        filterable
                        placeholder="请选择任务类型"
                      ></hd-dict-select>
                    </el-form-item>
                    <el-form-item label="任务等级" prop="taskLevel">
                      <hd-dict-select
                        v-model="queryData.taskLevel"
                        :dictCode="$global.dictType.rwdj"
                        :model-text.sync="factorData.taskLevel"
                        collapseTags
                        filterable
                        placeholder="请选择任务等级"
                      ></hd-dict-select>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="任务开始时间" prop="startTime">
                      <hd-date-picker type="datetimerange" v-model="queryData.startTime"></hd-date-picker>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="任务结束时间" prop="endTime">
                      <hd-date-picker type="datetimerange" v-model="queryData.endTime"></hd-date-picker>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="任务创建时间" prop="pushTime">
                      <hd-date-picker type="datetimerange" v-model="queryData.pushTime"></hd-date-picker>
                    </el-form-item>
                  </el-row>
                </hd-expand-body>
              </hd-expand>
            </hd-component>
          </el-form>
          <!-- 新写法-->
          <hd-button-container>
            <hd-button type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
            <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
            <hd-button
              v-if="isHasExport"
              name="export"
              type="warning"
              icon="el-icon-download"
              :loading="exporting"
              @click="handleExport"
            >导出</hd-button>
          </hd-button-container>
        </div>
        <!--列表-->
        <div class="hdty-fit" style="background-color: #fff;" v-loading="loading">
          <div class="con-table hdty-scroll" v-if="tableData && tableData.length > 0">
            <div class="hdty-task" v-for="(item, index) in tableData" :key="index">
              <div class="hdty-task-body" @click="handleDetail(index, item)">
                <div class="hdty-task-row">
                  <div class="con-content hdty-elip">{{ item.vo.taskContent }}</div>
                  <div style="margin-left: 12px;">
                    <el-tag
                      size="mini"
                      type="info"
                      effect="dark"
                      v-if="item.vo.taskState === '1' || item.vo.taskState === '2'"
                    >{{ item.vox.taskState }}</el-tag>
                    <el-tag
                      size="mini"
                      type="warning"
                      effect="dark"
                      v-if="item.vo.taskState === '3'"
                    >{{ item.vox.taskState }}</el-tag>
                    <el-tag
                      size="mini"
                      type="success"
                      effect="dark"
                      v-if="item.vo.taskState === '4'"
                    >{{ item.vox.taskState }}</el-tag>
                  </div>
                  <div style="margin-left: auto;">
                    <el-tag
                      :type="getTaskModeType(item.vo.taskMode)"
                      size="mini"
                    >{{item.vox.taskMode}}</el-tag>
                    <el-tag
                      :type="getTaskLevelType(item.vo.taskLevel)"
                      size="mini"
                    >{{item.vox.taskLevel}}</el-tag>
                  </div>
                </div>
                <div class="hdty-task-row">
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <i class="el-icon-time"></i>
                      <div>起止时间：</div>
                      <div>
                        {{item.vox.startTime }}
                        <span style="padding: 0 5px;">至</span>
                        {{item.vox.endTime}}
                        <span
                          v-if="item.vo.rwsfcq === '1'"
                          class="hdty-danger-color"
                          style="font-weight: bolder"
                        >({{item.vo.rwyqsj}})</span>
                      </div>
                    </div>
                  </div>
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <i class="el-icon-time"></i>
                      <div>推送时间：</div>
                      <div>{{item.vox.pushTime || '暂无推送时间'}}</div>
                    </div>
                  </div>
                </div>
                <div
                  class="hdty-task-row"
                  v-if="item.vo.objectJSON && item.vo.objectJSON.gmsfhm && item.vo.objectJSON.xzdz"
                >
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <i class="el-icon-postcard"></i>
                      <div>证件号码：</div>
                      <div>{{item.vo.objectJSON && item.vo.objectJSON.gmsfhm ? item.vo.objectJSON.gmsfhm : '暂无证件号码'}}</div>
                    </div>
                  </div>
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <i class="el-icon-location-information"></i>
                      <div>现住地址：</div>
                      <div>{{item.vo.objectJSON && item.vo.objectJSON.xzdz ? item.vo.objectJSON.xzdz : '暂无现住地址'}}</div>
                    </div>
                  </div>
                </div>
                <div class="hdty-task-row">
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <div class="con-i-label">
                        <i class="el-icon-aim"></i>对象名称：
                      </div>
                      <div
                        class="con-i-content hdty-elip"
                        :title="item.vo.objectJSON && item.vo.objectJSON.name ? item.vo.objectJSON.name : '暂无任务对象'"
                      >{{item.vo.objectJSON && item.vo.objectJSON.name ? item.vo.objectJSON.name : '暂无任务对象'}}</div>
                    </div>
                  </div>
                  <div class="hdty-task-row-item row-item-12">
                    <div class="con-flex con-i-label-info">
                      <i class="el-icon-thumb"></i>
                      <div>推送机构：</div>
                      <div>{{item.vox.pushOrgid || '暂无推送机构'}}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="con-cq-label" v-if="item.vo.rwsfcq === '1'">
                <img src="./../images/yyq.png" alt style="height: 70px;" />
              </div>
            </div>
          </div>
          <biz-empty style="height: 100%;" v-else content="暂无任务" guidingContent></biz-empty>
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
        <new-task-center-dis-task-detail ref="detailRef"></new-task-center-dis-task-detail>
      </div>
    </hd-pane>
  </el-dialog>
</template>
<script>
import { hdList } from '@/utils/util-framework';
import { getZpOrRlTaskPage, exportsMj } from './../../api';
import NewTaskCenterDisTaskDetail from './../NewTaskCenterDisTaskDetail';

export default {
  name: 'NewTaskCenterDelListAll',
  provide() {
    return {
      NewTaskCenterDelList: this
    };
  },
  props: {
    // 是否需要导出
    isHasExport: {
      type: Boolean,
      default: false
    }
  },
  inject: ['hdList'],
  mixins: [hdList],
  components: {
    NewTaskCenterDisTaskDetail
  },
  data() {
    return {
      visible: false,
      // 查询
      queryData: {
        isPc: '1',
        fromId: '',
        taskContent: '',
        state: '',
        sfcq: '',
        taskRwyq: '',
        taskMode: '',
        taskLevel: '',
        startTime: [],
        endTime: [],
        pushTime: [],
        createTime: [],
        andor: this.$app.factorOptions.logicOpe.and,
        stateList: [],
        pushTime: [],
        fromIdList: [],
        sjgsdwdm: '',
        // 1.未逾期 2.已逾期 3.即将逾期
        yqTypeState: '',
        zxbs: '0',
        // 是否质态监督(0否 1 是)
        isZtjd: '',
        // 质态监督-检查结果（0不合格 1合格）
        ztjdCheckState: '',
        // 质态监督-审核时间
        ztjdCreateTime: [],
        // 质态监督-机构
        ztjdSjgsdw: '',
        // 质态监督-核查人
        ztjdCreateUserId: '',
        // 反诈信息主键
        fzInfoId: '',
        // 反诈信息-是否已办结
        isFinish: '',
        // 质态监督-标记检查结果（0不正确 1正确）(统计跳转专用)
        ztjdBjCheckState: '',
        // 办理人身份号码
        userGmsfhm: '',
        // 任务用户注销标识（统计跳转专用）
        zxbsUser: '',
        // 任务创建时间-民警办结情况
        createTimeUser: [],
        sjgsdwdmUser: '',
        // 任务标题
        rwTitle: '',
        // 是否加省厅市局过滤条件
        isJStSjGltj: false //不加
      },
      factorData: {
        taskContentFilterFactor: this.$app.factorOptions.matchOpe.between,
        taskRwyqFilterFactor: this.$app.factorOptions.matchOpe.between,
        sjgsdwdmText: '',
        taskMode: '',
        taskLevel: ''
      },
      tableData: [],
      // 验证
      rules: {},
      defaultQueryData: {}
    };
  },
  mounted() {
    // 加载数据
    this.loadList();
  },
  methods: {
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
      this.queryData.isPc = '1';
      this.queryData.fromId = '';
      this.queryData.state = '';
      this.queryData.sfcq = '';
      this.factorData.sjgsdwdm = '';
      this.factorData.taskMode = '';
      this.factorData.taskLevel = '';
    },
    // 导出
    handleExport() {
      let _this = this;
      //导出前验证
      if (_this.exportValidator()) {
        _this.exporting = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions,
          ..._this.defaultQueryData
        };
        exportsMj(dataParams)
          .then((response) => {
            // 响应成功回调
            _this.download(response);
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            _this.exporting = false;
          });
      }
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 样式
    getTaskModeType(val) {
      let res = 'success';
      if (val === '1') {
        res = 'success';
      } else if (val === '2') {
        res = 'primary';
      } else if (val === '3') {
        res = 'danger';
      }
      return res;
    },
    // 样式
    getTaskLevelType(val) {
      let res = 'danger';
      if (val === '1') {
        res = 'success';
      } else if (val === '2') {
        res = 'primary';
      } else if (val === '3') {
        res = 'danger';
      }
      return res;
    }
  }
};
</script>

<style lang="scss" scoped>
.hdty-task {
  width: 100%;
  height: 110px;
  border-bottom: 1px solid #cccccc;
  padding-left: 12px;
  position: relative;
  cursor: pointer;
  display: flex;
  &:hover {
    background-color: #ffe6e6;
    &:before {
      content: '';
      width: 4px;
      height: 100%;
      position: absolute;
      background-color: #ff6060;
      left: -1px;
      top: 0;
    }
  }
  .hdty-task-body {
    width: 100%;
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
    justify-content: left;
    position: relative;
    &:before {
      content: '';
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
    top: 9px;
  }
}
//::v-deep .el-form-item__label {
//  color: black !important;
//}
</style>
