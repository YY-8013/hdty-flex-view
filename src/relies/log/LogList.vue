<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item label="日志内容" prop="message">
                <hd-factor-input
                  prop="messageFilterFactor"
                  v-model="queryData.message"
                  fuzzy="between"
                  :model-control.sync="extendData.messageFilterFactor"
                  placeholder="请输入日志内容"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item label="日志等级" prop="levelString">
                <hd-dict-select
                  v-model="queryData.levelString"
                  :dict-code="$global.dictType.logLevel"
                  placeholder="请选择日志等级"
                ></hd-dict-select>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="操 作 人" prop="currentUsername">
                  <hd-factor-input
                    prop="currentUsernameFilterFactor"
                    v-model="queryData.currentUsername"
                    :model-control.sync="extendData.currentUsernameFilterFactor"
                    placeholder="请输入请输入操作人"
                  ></hd-factor-input>
                </el-form-item>
                <el-form-item label="唯一标识" prop="opeCardId">
                  <hd-factor-input
                    prop="opeCardIdFilterFactor"
                    v-model="queryData.opeCardId"
                    :model-control.sync="extendData.opeCardIdFilterFactor"
                    placeholder="请输入唯一标识"
                  ></hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="客户端IP" prop="clientIp">
                  <hd-factor-input
                    prop="clientIpFilterFactor"
                    v-model="queryData.clientIp"
                    :model-control.sync="extendData.clientIpFilterFactor"
                    placeholder="请输入IP地址"
                  ></hd-factor-input>
                </el-form-item>
                <el-form-item label="客 户 端" prop="clientType">
                  <hd-dict-select
                    v-model="queryData.clientType"
                    :dict-code="$global.dictType.clientType"
                    placeholder="请选择客户端类型"
                  ></hd-dict-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="模块名称" prop="opeModuleName">
                  <hd-factor-input
                    prop="opeModuleNameFilterFactor"
                    v-model="queryData.opeModuleName"
                    :model-control.sync="extendData.opeModuleNameFilterFactor"
                    placeholder="请输入模块名称"
                  ></hd-factor-input>
                </el-form-item>
                <el-form-item label="操作类型" prop="opeType">
                  <hd-dict-select
                    v-model="queryData.opeType"
                    :dict-code="$global.dictType.opeType"
                    placeholder="请选择操作类型"
                  ></hd-dict-select>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="创建时间" prop="timestamp">
                  <hd-date-picker type="datetimerange" v-model="queryData.timestamp"></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-upload2"
          :loading="exporting"
          @click="handleExport"
        >导出</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="vo.id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%"
      >
        <el-table-column fixed type="selection" reserve-selection align="center" width="50"></el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column fixed label="操作" align="center" width="80">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row.vo)"
              >详情</hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column prop="vo.opeModuleName" label="模块名称" header-align="center" min-width="140"></el-table-column>
        <el-table-column prop="vox.opeType" label="操作类型" header-align="center" width="80"></el-table-column>
        <el-table-column prop="vo.message" label="日志内容" header-align="center" min-width="400">
          <template slot-scope="scope">
            <div line-clamp="auto" :title="scope.row.vo.message">{{ scope.row.vo.message }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="vox.levelString" label="等级" header-align="center" width="70">
          <template slot-scope="scope">
            <el-tag :type="formatLogLevel(scope.row.vo.levelString)">{{ scope.row.vox.levelString }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.errorStackCount"
          label="异常数"
          header-align="center"
          align="right"
          width="65"
        >
          <template slot-scope="scope">
            <a
              href="javascript:;"
              class="hdty-success-color"
              v-if="scope.row.vo.errorStackCount !== 0"
              @click="handlError(scope.$index, scope.row.vo)"
            >{{ scope.row.vo.errorStackCount }}</a>
            <a
              href="javascript:;"
              class="hdty-success-color hdty-disabled"
              v-else
            >{{ scope.row.vo.errorStackCount }}</a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.currentUsername"
          label="操作人"
          sortable="custom"
          header-align="center"
          width="100"
        ></el-table-column>
        <el-table-column prop="vo.opeCardId" label="唯一标识" header-align="center" width="270"></el-table-column>
        <el-table-column prop="vo.clientIp" label="客户端IP" header-align="center" width="115"></el-table-column>
        <el-table-column
          prop="vo.timestamp"
          label="更新时间"
          sortable="custom"
          header-align="center"
          width="170"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.timestamp)"></span>
          </template>
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
    <log-detail ref="detailRef"></log-detail>
    <log-error ref="errorRef"></log-error>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { deleteOne, exports, getPage } from '@/api/log';
import LogDetail from './LogDetail';
import LogError from './LogError';

export default {
  name: 'LogList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    LogDetail,
    LogError
  },
  data() {
    return {
      // 查询
      queryData: {
        message: '',
        levelString: '',
        clientIp: '',
        currentUsername: '',
        timestamp: [],
        opeType: '',
        clientType: '',
        opeModuleName: '',
        opeCardId: ''
      },
      // 查询条件
      extendData: {
        messageFilterFactor: '',
        currentUsernameFilterFactor: '',
        opeModuleNameFilterFactor: '',
        opeCardIdFilterFactor: ''
      },
      // 表格
      tableData: [],
      // 验证
      rules: {}
    };
  },
  mounted() {
    // 初始化数据表格
    this.loadList();
  },
  methods: {
    // 获取数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.extendData,
          ..._this.queryData,
          ..._this.pageOptions
        };
        // Lambda写法
        getPage(dataParams)
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
            _this.$refs.tableRef.doLayout();
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
    },
    // 导出
    handleExport() {
      let _this = this;
      if (_this.validateExport()) {
        _this.exporting = true;
        // 参数
        let dataParams = {
          ..._this.queryData
        };
        // Lambda写法
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
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 查询异常日志
    handlError(index, row) {
      this.$refs.errorRef.visible = true;
      this.$refs.errorRef.row = row;
      this.$refs.errorRef.beforeLoadForm();
    },
    // 删除
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // Lambda写法
          let dataParams = {
            id: row.id
          };
          deleteOne(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg,
                  type: 'success'
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
    // 格式化日志等级
    formatLogLevel(val) {
      if (val === this.$global.dictItem.logLevel.trace) {
        return 'default';
      } else if (val === this.$global.dictItem.logLevel.debug) {
        return 'info';
      } else if (val === this.$global.dictItem.logLevel.info) {
        return 'success';
      } else if (val === this.$global.dictItem.logLevel.warn) {
        return 'warning';
      } else if (val === this.$global.dictItem.logLevel.error) {
        return 'danger';
      } else if (val === this.$global.dictItem.logLevel.fatal) {
        return 'danger';
      } else {
        return 'primary';
      }
    }
  }
};
</script>

<style scoped>
</style>

