<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    custom-class="hdty-dialog-large"
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
                 <el-form-item label="注销状态" prop="zxbs">
                      <hd-dict-radio
                        v-model="queryData.zxbs"
                        :dict-code="$global.dictType.logoutStatus"
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
              prop="vox.type"
              label="表单附件类型"
              header-align="center"
              show-overflow-tooltip
              align="center"
              width="180"
            ></el-table-column>
             <el-table-column
              prop="vo.fileFile"
              label="附件"
              header-align="center"
              show-overflow-tooltip
              min-width="180"
            >
            <template slot-scope="scope">
              <div class="img-box">
                <hd-image
                      v-model="'data:image/jpeg;base64,' + scope.row.vo.fileFile"
                      width="100%"
                      height="200px"
                    ></hd-image>
              </div>
            </template>
            </el-table-column>
            <el-table-column
              prop="vox.zxbs"
              label="注销状态"
              align="center"
              header-align="center"
              width="110"
            >
              <template slot-scope="scope">
                <!-- 有效文字样式设置为text-color-5 -->
                <p
                  :class="{'text-color-5': scope.row.vo.zxbs === '0','text-color-1':scope.row.vo.zxbs === '1'}"
                >{{ scope.row.vox.zxbs }}</p>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.createUsername"
              label="采集人姓名"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="160"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="100">
              <template slot-scope="scope">
                    <hd-button
                      v-show="scope.row.vo.zxbs === '0'"
                      type="danger"
                      @click="handleLogout(scope.$index, scope.row)"
                    >注销</hd-button>
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
        <form-file-add ref="addRef"></form-file-add>
        <form-file-logout ref="logoutRef"></form-file-logout>
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
import FormFileAdd from './FormFileAdd';
import FormFileLogout from './FormFileLogout';

import { formFilePage } from './api';

export default {
  name: 'FormFileList',
  moduleName: 'FormManageList',
  components: {
    FormFileAdd,
    FormFileLogout
  },
  provide() {
    return {
      hdList: this,
      formFileList: this
    };
  },
  inject: ['hdList'],
  mixins: [hdList],
  data() {
    return {
      // 查询
      queryData: {
        zxbs: '0'
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
      return `操作表单附件 —— 【${this.row.vo.formTitle}】【${this.row.vo.formId}】`;
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
      formFilePage(dataParams)
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
