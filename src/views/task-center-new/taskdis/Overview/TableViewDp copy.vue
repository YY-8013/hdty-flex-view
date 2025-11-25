<template>
  <div class="hdty-container hdty-flex" style="background: #020b13">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        ref="queryRef"
        size="small"
        :rules="rules"
        class="blue-form"
        @keyup.enter.native="handleQuery"
      >
        <hd-expand>
          <hd-expand-header ref="expandHeaderRef">
            <el-form-item prop="orgId" label="管辖机构">
              <hd-organ
                v-model="queryData.orgId"
                :model-text.sync="extendData.orgName"
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
                align="right"
              ></el-date-picker>
            </el-form-item>
          </hd-expand-header>
          <hd-expand-body>
            <el-form-item label="任务类型" prop="formIdList">
              <!--选择表单-->
              <biz-form-select v-model="queryData.formIdList" multiple ref="formSelectRef"></biz-form-select>
            </el-form-item>
          </hd-expand-body>
        </hd-expand>
      </el-form>
      <hd-button-container>
        <el-button
          type="warning"
          icon="el-icon-back"
          v-show="showReturn()"
          @click="handleReturnLast"
        >查询上级</el-button>
        <el-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</el-button>
        <el-button
          name="export"
          type="warning"
          icon="el-icon-download"
          :loading="exporting"
          @click="handleExport"
        >导出</el-button>
      </hd-button-container>
    </div>
    <div class="hdty-danger-color">提示：当前统计不包括待推送的数据，即将逾期统计的是截止时间在3天内的任务</div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        id="tableViewStat"
        border
        row-key="orgId"
        ref="tableRef"
        v-loading="loading"
        :cell-class-name="setCellClassName"
        height="100%"
      >
        <el-table-column prop="orgName" label="机构" header-align="center" min-width="220">
          <template slot-scope="scope">
            <a
              class="canClick"
              v-if="scope.row.isHaveChild"
              @click="handleListByOrgId(scope.row.orgId)"
            >{{ scope.row.orgName }}</a>
            <a class="unClick" v-else>{{ scope.row.orgName }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          label="全部"
          header-align="center"
          min-width="80"
          align="center"
        >
          <el-table-column
            prop="totalNum"
            label="总量"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.totalNum > 0"
                @click="handleSecondStat(['2','3','4'], scope.row)"
              >{{ scope.row.totalNum }}</a>
              <a class="unClick" v-else>{{ scope.row.totalNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="wzpNum"
            label="未指派"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.wzpNum > 0"
                @click="handleSecondStat(['2'], scope.row)"
              >{{ scope.row.wzpNum }}</a>
              <a class="unClick" v-else>{{ scope.row.wzpNum }}</a>
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
          <el-table-column
            prop="wcl"
            label="完成率"
            header-align="center"
            min-width="80"
            align="center"
          ></el-table-column>
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
                @click="handleSecondStat([], scope.row,'','1')"
              >{{ scope.row.zxNum }}</a>
              <a class="unClick" v-else>{{ scope.row.zxNum }}</a>
            </template>
          </el-table-column>
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
            label="总量"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ybjNum > 0"
                @click="handleSecondStat(['4'], scope.row,'')"
              >{{ scope.row.ybjNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ybjNum }}</a>
            </template>
          </el-table-column>
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
                @click="handleSecondStat(['4'], scope.row,'1')"
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
                @click="handleSecondStat(['4'], scope.row,'2')"
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
            label="总量"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.dbNum > 0"
                @click="handleSecondStat(['2','3'], scope.row,'')"
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
                @click="handleSecondStat(['2','3'], scope.row,'1')"
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
                @click="handleSecondStat(['2','3'], scope.row,'2')"
              >{{ scope.row.dbWcqNum }}</a>
              <a class="unClick" v-else>{{ scope.row.dbWcqNum }}</a>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="willLateNum"
          label="即将逾期（只包含未办结）"
          header-align="center"
          min-width="80"
          align="center"
        >
          <template slot-scope="scope">
            <a
              class="canClick"
              v-if="scope.row.willLateNum > 0"
              @click="handleSecondStat(['2','3'], scope.row,'3')"
            >{{ scope.row.willLateNum }}</a>
            <a class="unClick" v-else>{{ scope.row.willLateNum }}</a>
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
            label="被抽查数"
            header-align="center"
            min-width="80"
            align="center"
          >
            <template slot-scope="scope">
              <a
                class="canClick"
                v-if="scope.row.ztjdCcNum > 0"
                @click="handleSecondStatCheck(scope.row, '1')"
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
                @click="handleSecondStatCheck(scope.row, '2')"
              >{{ scope.row.ztjdBhgNum }}</a>
              <a class="unClick" v-else>{{ scope.row.ztjdBhgNum }}</a>
            </template>
          </el-table-column>
          <el-table-column
            prop="ztjdHgl"
            label="合格率"
            header-align="center"
            min-width="80"
            align="center"
          ></el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <table-view-list ref="taskPageRef"></table-view-list>
  </div>
</template>
<script>
import { hdList } from '@/utils/util-framework';
import { taskStat } from '../../api';
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
          this.$utilDate.dateFtt(new Date(), 'yyyyMMddHHmmss')
        ],
        formIdList: []
      },
      // 查询扩展
      extendData: {
        orgName: this.$utilPublic.getUserOrgName()
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
        ..._this.queryData
      };
      // Lambda写法
      taskStat(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            this.tableData = data.voList || [];
            this.dataParentOrgId = data.orgParentId;
            this.queryData.orgId = data.orgParentId;
            this.extendData.orgId = data.orgParentName;
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
    //二级列表
    handleSecondStat(stateList, row, yqType, zxbs) {
      this.$refs.taskPageRef.queryData.stateList = stateList;
      this.$refs.taskPageRef.queryData.yqTypeState = yqType || '';
      this.$refs.taskPageRef.queryData.zxbs = zxbs || '0';
      this.$refs.taskPageRef.queryData.sjgsdwdm = row.orgId;
      this.$refs.taskPageRef.factorData.sjgsdwdmText = row.orgName;
      this.$refs.taskPageRef.queryData.pushTime = this.queryData.pushTime;
      this.$refs.taskPageRef.queryData.fromIdList = this.queryData.formIdList;
      this.$refs.taskPageRef.dialogTitle = '任务列表';
      this.$refs.taskPageRef.queryData.isZtjd = '';
      this.$refs.taskPageRef.queryData.ztjdCheckState = '';
      this.$refs.taskPageRef.pageOptions.current = 1;
      this.$refs.taskPageRef.loadList();
      this.$refs.taskPageRef.visible = true;
    },
    // 质检列表
    handleSecondStatCheck(row, type) {
      this.$refs.taskPageRef.queryData.stateList = [];
      this.$refs.taskPageRef.queryData.yqTypeState = '';
      this.$refs.taskPageRef.queryData.zxbs = '0';
      this.$refs.taskPageRef.queryData.sjgsdwdm = row.orgId;
      this.$refs.taskPageRef.factorData.sjgsdwdmText = row.orgName;
      this.$refs.taskPageRef.queryData.pushTime = this.queryData.pushTime;
      this.$refs.taskPageRef.queryData.fromIdList = this.queryData.formIdList;
      this.$refs.taskPageRef.queryData.isZtjd = '1';
      this.$refs.taskPageRef.queryData.ztjdCheckState = type === '2' ? '0' : '';
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
      this.exporting = true;

      // 获取业务类型
      function getBusType() {
        let res = ['#tableViewStat', '任务统计'];
        return res;
      }

      // 导出的内容只做解析，不进行格式转换
      let xlsxParam = { raw: true };
      let fixexDom = document
        .querySelector(getBusType()[0])
        .querySelector('.el-table__fixed');
      let wb;
      if (fixexDom) {
        //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
        wb = XLSX.utils.table_to_book(
          document.querySelector(getBusType()[0]).removeChild(fixexDom),
          xlsxParam
        );
        document.querySelector(getBusType()[0]).appendChild(fixexDom);
      } else {
        wb = XLSX.utils.table_to_book(
          document.querySelector(getBusType()[0]),
          xlsxParam
        );
      }
      // 指定单元格内容样式：四个方向的黑边框
      let contentCellStyle = {
        border: {
          top: {
            style: 'medium',
            color: '#ff0000'
          },
          bottom: {
            style: 'medium',
            color: '#ff0000'
          },
          left: {
            style: 'medium',
            color: '#ff0000'
          },
          right: {
            style: 'medium',
            color: '#ff0000'
          }
        },
        alignment: {
          horizontal: 'center',
          vertical: 'center'
        }
      };
      let sheet = wb.Sheets.Sheet1;
      Object.keys(sheet).forEach(function (key) {
        if (!key.startsWith('!')) {
          sheet[key].s = contentCellStyle;
        }
      });
      let wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      });
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          getBusType()[1] + '.xlsx'
        );
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.warn(e, wbout);
        }
      }
      this.exporting = false;
      return wbout;
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
      // // 管辖机构列
      // if (column.property === 'orgName') {
      //   res += ' cell-orgName';
      // }
      // if (
      //   (column.property && column.property === 'yqwbjs') ||
      //   column.property === 'yqybjs'
      // ) {
      //   res += ' cell-back-danger';
      // }
      // if (column.property && column.property === 'wcl') {
      //   res += ' cell-back-special';
      // }
      // 最后一行设置
      if (rowIndex === this.tableData.length - 1) {
        if (columnIndex === 0) {
          res += ' last-row-left';
        } else {
          res += ' last-row-right';
        }
      }
      return res;
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
      &.last-row-left {
        background-color: #0059be;
        color: #ffffff;
      }

      &.last-row-right {
        background-color: #0084c1;
        color: #ffffff;
        font-weight: bold;
        font-size: 15px;
      }
    }
  }
}
.click-text-decoration {
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
    color: #1194fb;
  }
}
::v-deep .el-table {
  border-color: #0f3f62 !important;
}
::v-deep .el-table::before,
::v-deep .el-table.el-table--border::after {
  background-color: #0f3f62 !important;
}
::v-deep .el-table__body-wrapper,
::v-deep .el-table .el-table__empty-text {
  background: #020b13 !important;
  color: #fff !important;
  border-color: #2f536e;
}
// 鼠标经过颜色改为粉红色
::v-deep .el-table__body tr:hover > td {
  background-color: #042641 !important;
}

::v-deep .el-table__empty-block,
::v-deep .el-table tr {
  background: rgba(0, 10, 21, 0.8) !important;
}
::v-deep .el-table th {
  background: rgba(0, 10, 21, 0.8) !important;
  color: #fff !important ;
  border: 1px solid #092133;
}
::v-deep .el-table.el-table--border th {
  border: 1px solid #0f3f62 !important;
}
::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td,
::v-deep .el-table.el-table--enable-row-hover .el-table__body tr:hover > td {
  background: #042641 !important;
}
::v-deep .el-table.el-table--border td {
  border-color: #0f3f62 !important;
}
.blue-form
  .hdty-query-wrapper
  .hdty-query-fixed
  .el-form-item
  ::v-deep
  .el-form-item__label {
  color: #fff !important;
}

.unClick {
  cursor: text;
  color: #fff;
}

.canClick {
  text-decoration: underline;
  cursor: pointer;
  color: #fff;
}
</style>
