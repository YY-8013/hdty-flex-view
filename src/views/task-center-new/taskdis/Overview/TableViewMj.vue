<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        ref="queryRef"
        size="small"
        :rules="rules"
        @keyup.enter.native="handleQuery"
      >
        <hd-expand>
          <hd-expand-header ref="expandHeaderRef">
            <el-form-item prop="orgId" label="管辖机构">
              <hd-organ
                v-model="queryData.orgId"
                :model-text.sync="extendData.orgId"
                :clearable="false"
                :showLevel="'5'"
                placeholder="请选择管辖机构"
              ></hd-organ>
            </el-form-item>
            <el-form-item class="con-cjsj" label="推送时间" prop="pushTime">
              <el-date-picker
                v-model="queryData.pushTime"
                type="daterange"
                :picker-options="pickerOptions"
                :clearable="false"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                value-format="yyyyMMddHHmmss"
                @change="handleDateChange"
                align="right"
              ></el-date-picker>
            </el-form-item>
          </hd-expand-header>
          <hd-expand-body>
            <el-form-item label="标准件类型" prop="formIdList">
              <!--选择表单-->
              <biz-form-select
                v-model="queryData.formIdList"
                multiple
                ref="formSelectRef"
                placeholder="请选择标准件类型"
              ></biz-form-select>
            </el-form-item>
            <el-row>
              <el-form-item label="排序方式" prop="orderType">
                <hd-dict-radio
                  v-model="queryData.orderType"
                  :dict-code="$global.dictType.mjOrderWay"
                ></hd-dict-radio>
              </el-form-item>
            </el-row>
          </hd-expand-body>
        </hd-expand>
      </el-form>
      <hd-button-container>
        <hd-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <!--        <el-button-->
        <!--          icon="el-icon-delete"-->
        <!--          @click="handleClear">-->
        <!--          清空-->
        <!--        </el-button>-->
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-download"
          :loading="exporting"
          @click="handleExport"
        >导出</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-danger-color">提示：当前统计不包括待推送的数据，即将逾期统计的是截止时间在3天内的任务</div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        id="tableViewStat"
        border
        :row-key="$utilStr.uuid()"
        ref="tableRef"
        v-loading="loading"
        :header-cell-style="{background:'#e5eafb'}"
        :cell-class-name="setCellClassName"
        height="100%"
      >
        <el-table-column fixed prop="userName" label="姓名" header-align="center" min-width="120"></el-table-column>
        <el-table-column
          prop="orgName"
          show-overflow-tooltip
          label="所属机构"
          header-align="center"
          min-width="220"
        ></el-table-column>
        <el-table-column
          prop="orgPcsName"
          show-overflow-tooltip
          label="所属派出所"
          header-align="center"
          min-width="220"
        ></el-table-column>
        <el-table-column
          prop="orgFjName"
          show-overflow-tooltip
          label="所属分局"
          header-align="center"
          min-width="220"
        ></el-table-column>
        <el-table-column
          prop="orgSjName"
          show-overflow-tooltip
          label="所属市局"
          header-align="center"
          min-width="220"
        ></el-table-column>
        <el-table-column
          prop="total"
          label="全部"
          header-align="center"
          min-width="80"
          align="center"
        >
          <el-table-column
            prop="totalNum"
            label="总数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.totalNum > 0"
                @click="handleSecondStat({stateList: ['2','3','4'], row: scope.row, rwTitle: '全部总数'})"
              >{{ scope.row.totalNum }}</a>
              <a class="unClick" v-else>{{ scope.row.totalNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="totalCqNum"
            label="已逾期"
            header-align="center"
            min-width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="totalWcqNum"
            label="未逾期"
            header-align="center"
            min-width="80"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="wcl"
            label="完成率"
            header-align="center"
            min-width="90"
            align="center"
          ></el-table-column>-->
        </el-table-column>
        <el-table-column
          prop="total"
          label="已办结"
          header-align="center"
          min-width="80"
          align="center"
        >
          <el-table-column
            prop="ybjNum"
            label="总数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ybjNum > 0"
                @click="handleSecondStat({stateList: ['4'], row: scope.row, rwTitle: '已办结总数'})"
              >{{ scope.row.ybjNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ybjNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="wcl"
            label="办结率"
            header-align="center"
            min-width="100"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="ybjCqNum"
            label="已逾期"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ybjCqNum > 0"
                @click="handleSecondStat({stateList: ['4'], row: scope.row, yqType: '1', rwTitle: '已办结已逾期'})"
              >{{ scope.row.ybjCqNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ybjCqNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="ybjWcqNum"
            label="未逾期"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ybjWcqNum > 0"
                @click="handleSecondStat({stateList: ['4'], row: scope.row, yqType: '2', rwTitle: '已办结未逾期'})"
              >{{ scope.row.ybjWcqNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ybjWcqNum }}</a>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="total"
          label="未办结"
          header-align="center"
          min-width="80"
          align="center"
        >
          <el-table-column
            prop="dbNum"
            label="总数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.dbNum > 0"
                @click="handleSecondStat({stateList: ['2', '3'], row: scope.row, rwTitle: '未办结总数'})"
              >{{ scope.row.dbNum }}</a>
              <a class="unClick" v-else>{{ scope.row.dbNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="dbCqNum"
            label="已逾期"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.dbCqNum > 0"
                @click="handleSecondStat({stateList: ['2','3'], row: scope.row, yqType: '1', rwTitle: '未办结已逾期'})"
              >{{ scope.row.dbCqNum }}</a>
              <a class="unClick" v-else>{{ scope.row.dbCqNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="dbWcqNum"
            label="未逾期"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.dbWcqNum > 0"
                @click="handleSecondStat({stateList: ['2','3'], row: scope.row, yqType: '2', rwTitle: '未办结未逾期'})"
              >{{ scope.row.dbWcqNum }}</a>
              <a class="unClick" v-else>{{ scope.row.dbWcqNum }}</a>
            </template>
          </el-table-column>
          <!-- （只包含未办结） -->
          <el-table-column
            prop="willLateNum"
            label="即将逾期"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.willLateNum > 0"
                @click="handleSecondStat({stateList: ['2','3'], row: scope.row, yqType: '3', rwTitle: '未办结即将逾期'})"
              >{{ scope.row.willLateNum }}</a>
              <a class="unClick" v-else>{{ scope.row.willLateNum }}</a>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="zxNum"
          label="注销"
          header-align="center"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <a
              class="canClick"
              v-if="scope.row.zxNum > 0"
              @click="handleSecondStat({row: scope.row, zxbsUser: '1', rwTitle: '注销'})"
            >{{ scope.row.zxNum }}</a>
            <a class="unClick" v-else>{{ scope.row.zxNum }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="质态监督"
          header-align="center"
          min-width="80"
          align="center"
        >
          <el-table-column
            prop="ztjdCcNum"
            label="总数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ztjdCcNum > 0"
                @click="handleSecondStat({row: scope.row, isZtjd: '1', rwTitle: '质态监督总数'})"
              >{{ scope.row.ztjdCcNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ztjdCcNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="ztjdBhgNum"
            label="不合格数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ztjdBhgNum > 0"
                @click="handleSecondStat({row: scope.row, isZtjd: '1', ztjdCheckState: '0', rwTitle: '质态监督不合格数'})"
              >{{ scope.row.ztjdBhgNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ztjdBhgNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="ztjdHgl"
            label="合格率"
            header-align="center"
            min-width="90"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>
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
    <table-view-list :isHasExport="true" ref="taskPageRef"></table-view-list>
  </div>
</template>
<script>
import { hdList } from '@/utils/util-framework';
import { taskStatMj, exports } from '../../api';
import TableViewList from './TableViewList.vue';
// 前端导出工具
import FileSaver from 'file-saver';
import XLSX from 'xlsx';

export default {
  name: 'TableView',
  components: {
    TableViewList
  },
  provide() {
    return {
      hdList: this
    };
  },
  inject: ['taskView'],
  mixins: [hdList],
  data() {
    return {
      // 查询
      queryData: {
        orgId: this.$utilPublic.getUserOrgId(),
        pushTime: [
          this.$utilDate.dateFtt(new Date(), 'yyyyMM01000000'),
          this.$utilDate.dateFtt(new Date(), 'yyyyMMdd235959')
        ],
        formIdList: [],
        orderType: '2'
      },
      // 查询扩展
      extendData: {
        orgId: this.$utilPublic.getUserOrgName()
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 当前返回数据的父级机构，即查询时的入参机构
      dataParentOrgId: ''
    };
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.extendData,
        ..._this.queryData,
        ..._this.pageOptions
      };
      // Lambda写法
      taskStatMj(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.tableData = data.voList || [];
            _this.pageOptions.total = data.total;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.log('发生了错误');
          console.error(error);
        })
        .finally(() => {
          _this.$refs.tableRef.doLayout();
          _this.loading = false;
        });
    },
    updateTable() {
      let _this = this;
      _this.$nextTick(() => {
        _this.$refs.tableRef.doLayout();
      });
    },
    handleListByOrgId(orgId) {
      this.queryData.orgId = orgId;
      this.loadList();
    },
    //二级列表 1.已逾期 2.未逾期
    handleSecondStat({
      stateList = [],
      row = '',
      yqType = '',
      isZtjd = '',
      ztjdCheckState = '',
      zxbsUser = '',
      rwTitle = ''
    }) {
      this.$refs.taskPageRef.queryData.rwTitle = rwTitle;
      this.$refs.taskPageRef.queryData.stateList = stateList;
      this.$refs.taskPageRef.queryData.yqTypeState = yqType || '';
      this.$refs.taskPageRef.queryData.zxbsUser = zxbsUser || '0';
      this.$refs.taskPageRef.queryData.zxbs = '';
      this.$refs.taskPageRef.queryData.sjgsdwdmUser = row.orgId;
      this.$refs.taskPageRef.queryData.sjgsdwdm = '150000000000';
      this.$refs.taskPageRef.factorData.sjgsdwdmText = row.orgName;
      this.$refs.taskPageRef.queryData.createTimeUser = this.queryData.pushTime;
      this.$refs.taskPageRef.queryData.fromIdList = this.queryData.formIdList;
      this.$refs.taskPageRef.queryData.isZtjd = isZtjd || '';
      this.$refs.taskPageRef.queryData.userGmsfhm = row.userGmsfhm;
      this.$refs.taskPageRef.queryData.ztjdCheckState = ztjdCheckState || '';
      this.$refs.taskPageRef.dialogTitle = '任务列表';
      this.$refs.taskPageRef.pageOptions.current = 1;
      this.$refs.taskPageRef.loadList();
      this.$refs.taskPageRef.visible = true;
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
          _this.pageOptions.current = 1;
          _this.loadList();
          // 修改饼图机构
          _this.taskView.orgId = _this.queryData.orgId;
        }
      });
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    },
    // 导出
    handleExport() {
      let _this = this;
      //导出前验证
      if (_this.exportValidator()) {
        _this.exporting = true;
        // 参数
        let dataParams = {
          ..._this.extendData,
          ..._this.queryData
        };
        exports(dataParams)
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
    // 是否为最高级别数据
    showReturn() {
      let res = false;
      // 最高级用户的最简机构
      let userSimpleOrgId = '15';
      // 当前数据查询时的最简机构
      let dataParentSimpleOrgId = this.$utilAll.getSimpleOrgId(
        this.dataParentOrgId
      );
      // 判断是否为本级机构
      if (this.dataParentOrgId === this.$utilPublic.getUserOrgId()) {
        return false;
      }
      // 判断是否存在上下级
      if (dataParentSimpleOrgId.indexOf(userSimpleOrgId) > -1) {
        // 不是第一级
        if (userSimpleOrgId !== dataParentSimpleOrgId) {
          res = true;
        }
      }
      return res;
    },
    // 返回上一级
    handleReturnLast() {
      this.queryData.orgId = this.$utilAll.getParentOrgId(this.dataParentOrgId);
      if (
        this.queryData.orgId.substring(8, 10) !== '00' &&
        this.queryData.orgId.substring(10, 12) === '00'
      ) {
        this.queryData.orgId = this.$utilAll.getParentOrgId(
          this.queryData.orgId
        );
      }
      /**
       * 查询条件机构翻译值在接口返回中设置，这里设置需要调用接口，同步会有延时，异步效果与接口返回中设置效果一致
       */
      this.loadList();
      // 修改饼图机构
      this.taskView.orgId = this.queryData.orgId;
    },
    // 设置单元格格式
    setCellClassName({ row, column, rowIndex, columnIndex }) {
      let res = 'con-cell';
      // 管辖机构列
      if (column.property === 'orgName' || column.property === 'userName') {
        res += ' cell-orgName';
      }
      if (
        (column.property && column.property === 'ybjCqNum') ||
        column.property === 'zxNum' ||
        column.property === 'dbCqNum' ||
        column.property === 'totalCqNum'
      ) {
        res += ' cell-back-danger';
      }
      if (column.property && column.property === 'totalNum') {
        res += ' cell-back-warning';
      }
      if (column.property && column.property === 'wcl') {
        res += ' cell-back-special';
      }
      return res;
    },
    handleDateChange(value) {
      if (value && value.length === 2) {
        this.queryData.pushTime = [
          value[0],
          this.$utilDate.dateFtt(value[1], 'yyyyMMdd235959')
        ];
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.el-table {
  ::v-deep .el-table__body {
    /*自定义列的背景色*/
    .con-cell {
      padding: 0;
      font-size: 16px;

      .cell {
        width: 100% !important;
        height: 100%;
        line-height: 36px;
      }

      &.cell-back-special {
        background-color: #f3f8e9;

        .con-num-cell-normal {
          color: #01b3c1;
        }
      }

      &.cell-back-danger {
        background-color: #ffebeb;

        .con-num-cell-normal {
          color: #ff0b00;
        }
      }

      &.cell-back-warning {
        background-color: #fff2de;

        .con-num-cell-normal {
          color: #ff7000;
        }
      }

      &.cell-back-primary {
        background-color: #d7ebff;

        .con-num-cell-normal {
          color: #409eff;
        }
      }

      &.cell-orgName {
        font-weight: bold;
        color: #1194fb;
      }

      &.last-row-left {
        background-color: #ff9933;
        color: #ffffff;
      }

      &.last-row-right {
        background-color: #ffcc99;
        color: #ff4700;
        font-weight: bold;
        font-size: 15px;
      }
    }
  }
}

.unClick {
  cursor: text;
}

.canClick {
  text-decoration: underline;
  cursor: pointer;
  color: #409eff;
}

.click-text-decoration {
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #1194fb;
  }
}
</style>
