<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form :model="queryData" :rules="rules" ref="queryRef" inline @submit.native.prevent
               @keyup.enter.native="handleQuery">
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item label="表  名" prop="expTableName">
                <el-input v-model="queryData.expTableName" placeholder="请输入表名" maxlength="255"></el-input>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
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
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
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
        height="100%">
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="vo.expTableName"
          label="表名"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.recordNumber"
          label="条数"
          sortable="custom"
          header-align="center"
          width="100">
        </el-table-column>
        <el-table-column
          prop="vo.query"
          label="查询条件"
          sortable="custom"
          header-align="center"
          min-width="280">
        </el-table-column>
        <el-table-column
          prop="vo.queryValue"
          label="条件值"
          sortable="custom"
          header-align="center"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="vo.currentUsername"
          label="操作用户"
          sortable="custom"
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.timestamp"
          sortable="custom"
          label="创建时间"
          header-align="center"
          min-width="180">
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
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import { page } from '@/api/exportlog';
  export default {
    name: 'ExportLogList',
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {},
    data() {
      return {
        // 查询
        queryData: {
          timestamp: [],
          callerClass: '',
          expTableName: '',
          recordNumber: '',
          currentUserId: '',
          currentUsername: '',
          queryValue: '',
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询条件
        extendData: {
          inputFilterFactor: ''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {}
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
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          // 参数
          let dataParams = {
            ..._this.extendData,
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          page(dataParams).then(response => {
            // 响应成功回调
            let {success, data} = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.loading = false;
          });
        }
      },
      // 查询
      handleQuery() {
        let _this = this;
        _this.$refs.queryRef.validate(valid => {
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
      }
    }
  };
</script>
