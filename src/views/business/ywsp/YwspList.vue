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
              <el-form-item label="审批业务类型" prop="spYwType">
                <hd-dict-select
                  v-model="queryData.spYwType"
                  placeholder="请选择审批业务类型"
                  multiple
                  :dict-code="$global.dictType.ywspType"
                ></hd-dict-select>
              </el-form-item>
              <el-form-item label="是否启用" prop="spEnable">
                <hd-dict-radio
                  v-model="queryData.spEnable"
                  :dict-code="$global.dictType.isOrNot"
                  show-all-button
                ></hd-dict-radio>
              </el-form-item>
              <el-form-item prop="orgId" >
                <hd-organ v-model="queryData.orgId" placeholder="高级查询：请选择机构"></hd-organ>
              </el-form-item>
            </hd-query-fixed>
          </hd-query>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >新增</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="id"
        ref="tableRef"
        v-loading="loading"
        border
        fit
        height="100%"
      >
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column
          prop="vox.spYwType"
          label="审批业务类型"
          header-align="center"
          min-width="150"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="table-link"
              @click="handleDetail(scope.$index, scope.row)"
            >{{ scope.row.vox.spYwType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.orgId"
          label="所属机构"
          header-align="center"
          min-width="200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="vox.formId"
          label="表单名称"
          header-align="center"
          min-width="150"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="vo.formId"
          label="表单ID"
          header-align="center"
          width="120"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="vox.spEnable"
          label="启用状态"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.vo.spEnable  === '1' ? 'success' : 'danger'"
              effect="dark"
            >{{ scope.row.vo.spEnable === '1' ? '启用' :'停用' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.createUsername"
          label="添加人"
          header-align="center"
          width="140"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="vox.createOrgId"
          label="添加机构"
          header-align="center"
          width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="vox.createTime"
          label="添加时间"
          header-align="center"
          width="180"
          show-overflow-tooltip
        ></el-table-column>

        <el-table-column label="操作" align="center" width="200" fixed="right">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)"
              >详情</hd-button>
              <hd-button name="edit" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</hd-button>
              <hd-button
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
              >删除</hd-button>
            </hd-button-container>
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
    <ywsp-add ref="addRef"></ywsp-add>
    <ywsp-detail ref="detailRef"></ywsp-detail>
    <ywsp-edit ref="editRef"></ywsp-edit>
  </div>
</template>
 
<script>
import { hdList } from '@/utils/util-framework';
import { page, exports, singleDelete } from './api';
import YwspAdd from './YwspAdd';
import YwspDetail from './YwspDetail';
import YwspEdit from './YwspEdit';
export default {
  name: 'YwspList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    YwspAdd,
    YwspDetail,
    YwspEdit
  },
  data() {
    return {
      // 查询
      queryData: {
        spYwType: [],
        spEnable: '',
        orgId: ''
      },
      // 查询扩展
      extendData: {},
      // 表格
      tableData: [],
      // 验证
      rules: {}
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    // 获取数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 处理日期范围查询参数
        const params = {
          ..._this.queryData,
          ..._this.extendData,
          ..._this.pageOptions
        };

        page(params)
          .then((response) => {
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          })
          .catch((error) => {
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
    // 注销
    handleLogout(index, row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$refs.logoutRef.beforeLoadForm();
    },
    // 导出
    handleExport() {
      let _this = this;
      if (_this.validateExport()) {
        _this.exporting = true;
        const params = {
          ..._this.queryData
        };

        exports(params)
          .then((response) => {
            _this.download(response);
          })
          .catch((error) => {
            console.error(error);
          })
          .finally(() => {
            _this.exporting = false;
          });
      }
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
            id: row.vo.id
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
        })
        .catch(() => {});
    }
  }
};
</script>