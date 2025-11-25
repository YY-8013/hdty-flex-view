<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form :model="queryData" :rules="rules" ref="queryRef" inline @submit.native.prevent @keyup.enter.native="handleQuery">
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <el-form-item label="最慢时间(毫秒)" prop="maxTimespan" v-if="queryData.type == 1">
              <el-input v-model="queryData.maxTimespan" placeholder="请输入最慢时间(毫秒)" maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="平均时间(毫秒)" prop="maxTimespan" v-if="queryData.type == 0">
              <el-input  v-model="queryData.maxTimespan" placeholder="请输入平均时间(毫秒)" maxlength="255"></el-input>
            </el-form-item>
            <el-form-item label="查询方式" prop="type">
              <hd-dict-radio v-model="queryData.type" :dict-code="$global.dictType.slowSqlType" @currentChanged="handleTypeChange"></hd-dict-radio>
            </el-form-item>
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
        row-key="sql"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
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
          fixed
          label="操作"
          align="center"
          width="80">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="sql"
          label="sql"
          header-align="center"
          min-width="500">
          <template slot-scope="scope">
            <div
              class="row-message"
              v-if="scope.row.sql != null && scope.row.sql.length >= 150"
              :titLle="scope.row.sql">
              {{ scope.row.sql.substr(0, 150) + '...' }}
            </div>
            <span
              v-if="scope.row.sql != null && scope.row.sql.length < 150"
              slot="reference">
              {{ scope.row.sql }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="maxTimespan"
          v-if="queryData.type == 1"
          label="最慢时间(毫秒)"
          header-align="center"
          align="center"
          width="115">
        </el-table-column>
        <el-table-column
          prop="maxTimespan"
          v-if="queryData.type == 0"
          label="平均时间(毫秒)"
          header-align="center"
          align="center"
          width="115">
        </el-table-column>
        <el-table-column
          prop="executeCount"
          label="执行数"
          header-align="center"
          width="70"
          align="center">
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
    <monitoring ref="detailRef"></monitoring>
  </div>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import {getDruidStatList} from '@/api/monitoring';
  import Monitoring from './Monitoring';

  export default {
  name: 'MonitoringList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    Monitoring
  },
  data() {
    return {
      // 查询
      queryData: {
        //默认oracle
        type: '0',
        //默认两秒
        maxTimespan:2000
      },
      // 查询条件
      extendData: {
        inputFilterFactor: ''
      },
      // 表格
      tableData: [],
      // 验证
      rules: {
        maxTimespan: [
          { validator: this.$utilValidate.validateInteger, trigger: 'blur' }
        ],
      }
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
      getDruidStatList(dataParams).then(response => {
        // 响应成功回调
        let { success, data } = response.data;
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
    //
    handleTypeChange() {
      this.handleQuery();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>
