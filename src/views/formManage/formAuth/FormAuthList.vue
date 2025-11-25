<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium"
    append-to-body
    :before-close="cancelForm"
  >
    <hd-pane>
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
              <hd-expand>
                <hd-expand-header>
                    <el-form-item label="授权机构" prop="orgId">
                <hd-organ v-model="queryData.orgId" placeholder="请选择授权机构"></hd-organ>
              </el-form-item>
              <el-form-item label="警辅通是否可用" prop="jftEnable">
                      <hd-dict-radio
                        v-model="queryData.jftEnable"
                        :dict-code="$global.dictType.isOrNot"
                        showAllButton
                      ></hd-dict-radio>
                    </el-form-item>
                  </el-row>
                </hd-expand-header>
              </hd-expand>
            </hd-component>
          </el-form>
          <hd-button-container>
            <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
            <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
            <hd-button
              v-show="row.vo && row.vo.zxbs === '0'"
              name="add"
              type="success"
              icon="el-icon-circle-plus-outline"
              @click="handleAdd"
            >新增</hd-button>
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
            @sort-change="handleSortChange"
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

            <el-table-column
              prop="vox.orgId"
              label="授权机构"
              header-align="center"
              show-overflow-tooltip
              align="center"
              min-width="160px"
            ></el-table-column>
            <el-table-column
              prop="vox.jftEnable"
              label="警辅通是否可用"
              header-align="center"
              show-overflow-tooltip
              align="center"
              width="200px"
            >
             <template slot-scope="scope">
            <!-- 有效文字样式设置为text-color-5 -->
            <p
              :class="{'text-color-5': scope.row.vo.jftEnable === '1','text-color-1':scope.row.vo.jftEnable === '0'}"
            >{{ scope.row.vox.jftEnable }}</p>
          </template>
            </el-table-column>
            <el-table-column
              prop="vo.createUsername"
              label="采集人姓名"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="160px"
            ></el-table-column>
        <el-table-column prop="vox.createTime" label="创建时间" header-align="center" width="180"></el-table-column>

            <el-table-column label="操作" align="center" width="160px">
              <template slot-scope="scope">
                <!-- <hd-button
                      type="success"
                      @click="handleLogout(scope.$index, scope.row)"
                    >详情</hd-button> -->
                 <hd-button
                      type="primary"
                      @click="handleEdit(scope.$index, scope.row)"
                    >编辑</hd-button>
                    <hd-button
                      type="danger"
                      @click="handleDelete(scope.$index, scope.row)"
                    >删除</hd-button>
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
        <form-auth-add ref="addRef"></form-auth-add>
        <form-auth-edit ref="editRef"></form-auth-edit>
        <!-- <form-file-logout ref="logoutRef"></form-file-logout> -->
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { deleteOne, exports, getPage } from '@/api/dict-item';
import FormAuthAdd from './FormAuthAdd';
import FormAuthEdit from './FormAuthEdit';
// import FormFileLogout from './FormFileLogout';

import { formAuthPage,formAuthDelete } from './api';

export default {
  name: 'FormFileList',
  moduleName: 'FormManageList',
  components: {
    FormAuthAdd,
    FormAuthEdit
    // FormFileLogout
  },
  provide() {
    return {
      hdList: this,
      formAuthList: this
    };
  },
  inject: ['hdList'],
  mixins: [hdList],
  data() {
    return {
      // 查询
      queryData: {
        jftEnable: '',
        orgId: ''
      },
      // 查询条件
      extendData: {},
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 行
      row: { vo: {} },
      // 显示
      visible: false
    };
  },
  computed: {
    dialogTitle() {
      return `操作表单授权机构 —— 【${this.row.vo.formTitle}】【${this.row.vo.formId}】`;
    }
  },
  methods: {
    // 获取数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        formId: _this.row.vo.formId,
        ..._this.queryData,
        ..._this.extendData,
        ..._this.pageOptions
      };
      // Lambda写法
      formAuthPage(dataParams)
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
      this.pageOptions.current = 1;
    },
    // 新增
    handleAdd() {
      this.$refs.addRef.visible = true;
      this.$refs.addRef.row = this.row;
      this.$refs.addRef.beforeLoadForm();
    },
    // 导出
    handleExport() {
      let _this = this;
      // 导出前验证
      if (_this.exportValidator()) {
        _this.exporting = true;
        if (_this.queryData.typeId !== _this.row.key) {
          _this.$nextTick(() => {
            _this.handleClear();
          });
        }
        _this.queryData.typeId = _this.row.key;
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
          formAuthDelete(dataParams).then(response => {
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
      },
    // 取消
    cancelForm() {
      this.handleClear();
      this.visible = false;
      this.hdList.loadList();
    },
    // 注销状态列文字颜色
    zxColor(scope) {
      return scope.row.vo.zxbs === '0';
    }
  }
};
</script>

<style scoped>
</style>
