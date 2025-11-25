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
            <el-form-item class="con-cjsj" label="核查时间" prop="createTime">
              <el-date-picker
                v-model="queryData.createTime"
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
        </hd-expand>
      </el-form>
      <hd-button-container>
        <!--        <hd-button-->
        <!--          type="warning"-->
        <!--          icon="el-icon-back"-->
        <!--          v-show="showReturn()"-->
        <!--          @click="handleReturnLast">-->
        <!--          查询上级-->
        <!--        </hd-button>-->
        <hd-button type="info" v-preventReClick icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <el-button icon="el-icon-delete" @click="handleClear">清空</el-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-download"
          :loading="exporting"
          @click="handleExport"
        >导出</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        id="tableViewCheck"
        border
        :row-key="$utilStr.uuid()"
        ref="tableRef"
        v-loading="loading"
        :header-cell-style="{background:'#e5eafb'}"
        :cell-class-name="setCellClassName"
        height="100%"
      >
        <table-column-ztjdgz
          v-for="(item, index) in tableHeader"
          :key="index"
          :coloumn-header="item"
        ></table-column-ztjdgz>
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
    <table-view-list ref="taskPageRef"></table-view-list>
  </div>
</template>
<script>
import { hdList } from '@/utils/util-framework';
import { exportsZtjdByMj, taskStatZtjdgz } from '../../api';
import tableColumnZtjdgz from './TableColumnZtjdgz.vue';
// 前端导出工具
import FileSaver from 'file-saver';
import XLSX from 'xlsx';
import TableViewList from './TableViewList.vue';

export default {
  name: 'TableViewZtjdgz',
  components: {
    TableViewList,
    tableColumnZtjdgz
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
        createTime: [
          this.$utilDate.dateFtt(new Date(), 'yyyyMM01000000'),
          this.$utilDate.dateFtt(new Date(), 'yyyyMMdd235959')
        ],
        formIdList: []
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
      dataParentOrgId: '',
      tableHeader: []
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
      taskStatZtjdgz(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.tableData = [];
            _this.tableHeader = [];
            _this.pageOptions.total = data.total;
            this.dataParentOrgId = data.orgId;
            this.queryData.orgId = data.orgId;
            this.extendData.orgId = data.orgName;
            if (data) {
              //处理表头
              let nameObj = {
                label: '姓名',
                prop: 'userName',
                children: null
              };
              _this.tableHeader.push(nameObj);
              let orgObj = {
                label: '管辖机构',
                prop: 'orgName',
                children: null
              };
              _this.tableHeader.push(orgObj);
              data.titleList.forEach((item) => {
                _this.tableHeader.push(item);
              });

              //处理内容
              let dataList = data.ordinateList;
              if (dataList && dataList.length > 0) {
                if (
                  dataList[0] &&
                  dataList[0].value &&
                  dataList[0].value.length > 0
                ) {
                  // 构造 表格数据 内容
                  dataList.forEach((item, index) => {
                    let obj = {};
                    obj['userName'] = item.userName;
                    obj['userGmsfhm'] = item.userGmsfhm;
                    obj['orgName'] = item.orgName;
                    obj['orgId'] = item.orgId;
                    obj['orgLevel'] = item.orgLevel;
                    obj['isLeaf'] = item.isLeaf;
                    // 处理表格数据的 其他项 字段
                    item.value.forEach((itemI, indexI) => {
                      let keyStr = itemI.prop;
                      obj[keyStr] = itemI.num;
                      obj[keyStr + '_formId'] = itemI.value;
                    });
                    _this.tableData.push(obj);
                  });
                }
              }
            }
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
    // 质检列表
    handleSecondStatCheck(row, type, formIdList, ztjdBjCheckState) {
      this.$refs.taskPageRef.queryData.stateList = [];
      this.$refs.taskPageRef.queryData.yqTypeState = '';
      this.$refs.taskPageRef.queryData.zxbs = '0';
      this.$refs.taskPageRef.queryData.sjgsdwdm = row.orgId;
      this.$refs.taskPageRef.factorData.sjgsdwdmText = row.orgName;
      //pushTime这个好像是无效参数
      this.$refs.taskPageRef.queryData.pushTime = this.queryData.pushTime;
      this.$refs.taskPageRef.queryData.ztjdCreateTime =
        this.queryData.createTime;
      this.$refs.taskPageRef.queryData.fromIdList = formIdList;
      this.$refs.taskPageRef.queryData.isZtjd = '1';
      this.$refs.taskPageRef.queryData.ztjdCheckState = type;
      this.$refs.taskPageRef.queryData.ztjdCreateUserId = row.userGmsfhm;
      this.$refs.taskPageRef.queryData.ztjdBjCheckState = ztjdBjCheckState;
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
        _this.exportLoading = true;
        // 参数
        let dataParams = {
          ..._this.extendData,
          ..._this.queryData
        };
        exportsZtjdByMj(dataParams)
          .then((response) => {
            // 响应成功回调
            _this.download(response);
          })
          .catch((error) => {
            // 响应错误回调
            console.error(error);
          })
          .finally(() => {
            _this.exportLoading = false;
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
    },
    // 设置单元格格式
    setCellClassName({ row, column, rowIndex, columnIndex }) {
      let res = 'con-cell';
      // 管辖机构列
      if (column.property === 'orgName') {
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
      // // 最后一行设置
      // if (rowIndex === this.tableData.length - 1) {
      //   if (columnIndex === 0) {
      //     res += ' last-row-left';
      //   } else {
      //     res += ' last-row-right';
      //   }
      // }
      return res;
    },
    handleDateChange(value) {
      if (value && value.length === 2) {
        this.queryData.createTime = [
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
