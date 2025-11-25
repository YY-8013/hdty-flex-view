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
        <hd-query>
          <hd-query-fixed>
            <el-form-item label="角 色 名" prop="name">
              <el-input v-model="queryData.name" placeholder="请输入角色名"></el-input>
            </el-form-item>
            <el-form-item label="客 户 端" prop="clientType">
              <hd-dict-radio v-model="queryData.clientType" :dict-code="$global.dictType.clientType" show-all-button></hd-dict-radio>
            </el-form-item>
            <el-form-item prop="orgId" slot="after">
              <hd-organ v-model="queryData.orgId" placeholder="高级过滤：请选择共享机构"></hd-organ>
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-row>
              <el-form-item label="描  述" prop="memo">
                <el-input v-model="queryData.memo" placeholder="请输入描述"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="创建时间" prop="createTime">
                <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
              </el-form-item>
            </el-row>
          </hd-query-expand>
        </hd-query>
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
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd">
          新增
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="id"
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
          fixed
          label="操作"
          align="center"
          width="210">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">
                编辑
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
          prop="name"
          label="角色名"
          sortable="custom"
          header-align="center"
          width="180">
        </el-table-column>
        <el-table-column
          prop="clientTypeList"
          label="客户端"
          sortable="custom"
          header-align="center"
          min-width="120">
        </el-table-column>
        <el-table-column
          prop="orgId"
          label="共享机构"
          sortable="custom"
          header-align="center"
          min-width="260">
          <template slot-scope="scope">
            <span>{{ scope.row.orgName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="memo"
          label="描述"
          sortable="custom"
          header-align="center"
          min-width="180">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.createTime)"></span>
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
    <role-add ref="addRef"></role-add>
    <role-detail ref="detailRef"></role-detail>
    <role-edit ref="editRef"></role-edit>
  </div>
</template>

<script>
  import { hdList } from "@/utils/util-framework";
  import { deleteRole, getPage } from '@/api/role';
  import RoleAdd from './RoleAdd';
  import RoleDetail from './RoleDetail';
  import RoleEdit from './RoleEdit';
  export default {
    name: "RoleList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      RoleAdd,
      RoleDetail,
      RoleEdit
    },
    data() {
      return {
        // 查询
        queryData: {
          name: '',
          orgId: '',
          clientType: '',
          memo: '',
          createTime: []
        },
        // 表格
        tableData: [],
        // 验证
        rules: {}
      }
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
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          getPage(dataParams).then(response => {
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
      },
      // 新增
      handleAdd() {
        this.$refs.addRef.visible = true;
        this.$refs.addRef.beforeLoadForm();
      },
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row) {
        this.$refs.editRef.visible = true;
        this.$refs.editRef.row = row;
        this.$refs.editRef.beforeLoadForm();
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
            id: row.id
          };
          // Lambda写法
          deleteRole(dataParams).then(response => {
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
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      }
    }
  }
</script>
