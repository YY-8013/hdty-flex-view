<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :inline="true"
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        @keyup.enter.native="handleQuery"
      >
        <el-form-item label="组织机构" prop="orgid">
          <hd-organ
            v-model="queryData.orgid"
            :currentValue="queryData.orgid"
            placeholder="请选择组织机构"
            style="width: 200px;"
            :underline="false"
          ></hd-organ>
        </el-form-item>
      </el-form>
      <hd-btn-authority>
        <template slot-scope="props">
          <el-button
            name="query"
            type="info"
            icon="el-icon-search"
            :disabled="props.disabled.query"
            @click="handleQuery"
          >查询</el-button>
          <el-button icon="el-icon-delete" @click="handleClear">清空</el-button>
          <el-button
            name="add"
            type="success"
            icon="el-icon-circle-plus-outline"
            :disabled="props.disabled.add"
            @click="handleAdd"
          >新增</el-button>
        </template>
      </hd-btn-authority>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="id"
        ref="tableRef"
        v-loading="triggerLoading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%"
      >
        <el-table-column
          fixed
          sortable="custom"
          type="index"
          label="序号"
          :index="setIndex"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column fixed label="操作" align="center" width="220">
          <template slot-scope="scope">
            <hd-btn-authority>
              <template slot-scope="props">
                <el-button
                  name="detail"
                  type="success"
                  :disabled="props.disabled.detail"
                  @click="handleDetail(scope.$index, scope.row)"
                >详情</el-button>
                <el-button
                  name="edit"
                  type="primary"
                  :disabled="props.disabled.edit"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑</el-button>
                <el-button
                  v-if="scope.row.vo.orgid !== '150000000000'"
                  name="delete"
                  type="danger"
                  :disabled="props.disabled.delete"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除</el-button>
              </template>
            </hd-btn-authority>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          prop="vox.orgid"
          label="组织机构"
          sortable="custom"
          align="center"
          min-width="240"
        >
          <template slot-scope="scope">
            <div class="row-message" :title="scope.row.vox.orgid">{{ scope.row.vox.orgid }}</div>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.optTime"
          label="更新时间"
          sortable="custom"
          align="center"
          width="320"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row, scope.column, scope.row.vo.optTime)"></span>
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
        :total="pageOptions.total"
      ></el-pagination>
    </div>
    <deploy-add ref="DeployAddRef"></deploy-add>
    <deploy-edit ref="DeployEditRef"></deploy-edit>
    <deploy-detail ref="DeployDetailRef"></deploy-detail>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { deployPage, singleDelete } from './api';
import DeployAdd from './DeployAdd';
import DeployEdit from './DeployEdit';
import DeployDetail from './DeployDetail';

export default {
  name: 'DeployList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    DeployAdd,
    DeployEdit,
    DeployDetail
  },
  data() {
    return {
      // 查询
      queryData: {
        orgid: ''
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
        _this.triggerLoading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions
        };
        // Lambda写法
        deployPage(dataParams)
          .then((response) => {
            //响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          })
          .catch((error) => {
            // 响应错误回调
            console.log(error);
          })
          .finally(() => {
            _this.triggerLoading = false;
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
    },
    // 新增
    handleAdd() {
      this.$refs.DeployAddRef.visible = true;
      this.$refs.DeployAddRef.beforeLoadForm();
    },
    // 详情
    handleDetail(index, row) {
      this.$refs.DeployDetailRef.visible = true;
      this.$refs.DeployDetailRef.row = row;
      this.$refs.DeployDetailRef.beforeLoadForm();
    },
    // 编辑
    handleEdit(index, row) {
      this.$refs.DeployEditRef.visible = true;
      this.$refs.DeployEditRef.row = row;
      this.$refs.DeployEditRef.beforeLoadForm();
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
          // 参数
          let dataParams = {
            orgid: row.vo.orgid
          };
          // Lambda写法
          singleDelete(dataParams)
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
        });
    }
  }
};
</script>

<style scoped>
</style>
