<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-expand>
            <el-form-item label="用 户 名" prop="username">
              <hd-factor-input v-model="queryData.username" prop="usernameFilterFactor" fuzzy="between" :model-control.sync="extendData.usernameFilterFactor" placeholder="请输入用户名"></hd-factor-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="gmsfhm">
              <hd-factor-input v-model="queryData.gmsfhm" prop="gmsfhmFilterFactor" fuzzy="between" :model-control.sync="extendData.gmsfhmFilterFactor" placeholder="请输入用户身份证号"></hd-factor-input>
            </el-form-item>
            <el-form-item label="是否锁定" prop="isLock">
              <hd-dict-radio v-model="queryData.isLock" :dict-code="$global.dictType.isOrNot" showAllButton></hd-dict-radio>
            </el-form-item>
          </hd-expand>
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
        v-loading="loading"
        ref="tableRef"
        :data="tableData"
        row-key="vo.id"
        :empty-text="emptyText"
        border
        fit
        height="100%"
        @sort-change="handleSortChange">
        <el-table-column
          fixed
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="180">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.username"
          label="用户名"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vo.gmsfhm"
          label="用户身份证号"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          width="220">
        </el-table-column>
        <el-table-column
          prop="vo.retryCount"
          label="重试次数"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vox.lastRetryTime"
          label="上次重试的时间"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          width="220">
          <template slot-scope="scope">
            <span v-html="formatDatetime(scope.row, scope.column, scope.row.vo.lastRetryTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.isLock"
          label="是否锁定"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="vox.lockTime"
          label="锁定时间"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          min-width="220">
          <template slot-scope="scope">
            <span v-html="formatDatetime(scope.row, scope.column, scope.row.vo.lockTime)"></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.unlockTime"
          label="预计解锁时间"
          sortable="custom"
          show-overflow-tooltip
          header-align="center"
          min-width="220">
          <template slot-scope="scope">
            <span v-html="formatDatetime(scope.row, scope.column, scope.row.vo.unlockTime)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="hdty-footer">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageOptions.current"
        :page-sizes="pageOptions.sizes"
        :page-size="pageOptions.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageOptions.total">
      </el-pagination>
    </div>
    <user-lock-detail ref="detailRef"></user-lock-detail>
  </div>
</template>

<script>
import {hdList} from '@/utils/util-framework';
import {page, singleDelete} from './api';
import UserLockDetail from './UserLockDetail';

export default {
  name: "UserLockList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    UserLockDetail
  },
  data() {
    return {
      // 查询
      queryData: {
        username: '',
        gmsfhm: '',
        retryCount: '',
        isLock: '',
        lastRetryTime: [],
        andor:this.$app.factorOptions.logicOpe.and,
      },
      // 查询条件
      extendData: {
        usernameFilterFactor: this.$app.factorOptions.matchOpe.exact,
        gmsfhmFilterFactor: this.$app.factorOptions.matchOpe.exact,
      },
      // 表格
      tableData: [],
      // 验证
      rules:{},
    }
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
          ..._this.pageOptions,
        };
        // Lambda写法
        page(dataParams).then(response => {
          //响应成功回调
          let {success, data} = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
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
    // 详情
    handleDetail(index, row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.beforeLoadForm();
    },
    // 删除
    handleDelete(index, row) {
      let _this = this;
      _this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 参数
        let dataParams = {
          id: row.vo.id
        };
        // Lambda写法
        singleDelete(dataParams).then(response => {
          // 响应成功回调
          let {success, msg} = response.data;
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
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        });
      });
    }
  }
}
</script>
<style scoped>

</style>
