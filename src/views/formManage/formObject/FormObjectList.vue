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
                  <el-form-item label="任务对象列名" prop="name">
                    <hd-factor-input
                      v-model="queryData.name"
                      prop="nameFilterFactor"
                      fuzzy="between"
                      :model-control.sync="extendData.nameFilterFactor"
                      placeholder="请输入任务对象列名"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item label="任务对象标签名" prop="label">
                    <hd-factor-input
                      v-model="queryData.label"
                      prop="labelFilterFactor"
                      fuzzy="between"
                      :model-control.sync="extendData.labelFilterFactor"
                      placeholder="请输入任务对象标签名"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item label="注销状态" prop="zxbs">
                    <hd-dict-radio
                      v-model="queryData.zxbs"
                      :dict-code="$global.dictType.logoutStatus"
                      showAllButton
                    ></hd-dict-radio>
                  </el-form-item>
                  <!-- <el-form-item prop="andor" slot="after">
                    <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
                  </el-form-item>-->
                </hd-expand-header>
                <!-- <hd-expand-body>
                  <el-row>
                    <el-form-item label="数据抽取时对应的列名" prop="tableKey">
                      <hd-factor-input
                        v-model="queryData.tableKey"
                        prop="tableKeyFilterFactor"
                        fuzzy="between"
                        :model-control.sync="extendData.tableKeyFilterFactor"
                        placeholder="请输入数据抽取时对应的列名"
                      ></hd-factor-input>
                    </el-form-item>
                    <el-form-item label="注销状态" prop="zxbs">
                      <hd-dict-radio
                        v-model="queryData.zxbs"
                        :dict-code="$global.dictType.logoutStatus"
                        showAllButton
                      ></hd-dict-radio>
                    </el-form-item>
                  </el-row>
                </hd-expand-body>-->
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
              prop="vo.name"
              label="任务对象列名"
              show-overflow-tooltip
              header-align="center"
              width="140"
            >
              <template slot-scope="scope">
                <span
                  class="table-link"
                  @click="handleDetail(scope.$index, scope.row)"
                >{{ scope.row.vo.name }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.tableKey"
              label="数据抽取时对应的列名"
              show-overflow-tooltip
              header-align="center"
              width="200"
            ></el-table-column>
            <el-table-column
              prop="vo.label"
              label="任务对象标签名"
              show-overflow-tooltip
              header-align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="vo.prop"
              label="任务对象组件绑定表单对象属性名"
              show-overflow-tooltip
              header-align="center"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="vo.config"
              label="任务对象配置"
              show-overflow-tooltip
              header-align="center"
              min-width="130"
            ></el-table-column>
            <el-table-column
              prop="vox.isAdmin"
              label="系统配置"
              header-align="center"
              align="center"
              width="90"
            ></el-table-column>
            <el-table-column
              prop="vox.isShow"
              align="center"
              label="是否显示"
              header-align="center"
              width="90"
            ></el-table-column>
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
              prop="vo.objectOrder"
              label="排序"
              sortable="custom"
              align="center"
              header-align="center"
              width="80"
            ></el-table-column>
            <el-table-column label="操作" align="center" width="100" fixed="right">
              <template slot-scope="scope">
                <el-dropdown>
                  <el-button type="info">操作</el-button>
                  <el-dropdown-menu slot="dropdown">
                    <hd-button type="success" @click="handleDetail(scope.$index, scope.row)">详情</hd-button>
                    <hd-button
                      v-show="scope.row.vo.zxbs === '0'"
                      type="primary"
                      @click="handleEdit(scope.$index, scope.row)"
                    >编辑</hd-button>
                    <hd-button
                      v-show="scope.row.vo.zxbs === '0'"
                      type="danger"
                      @click="handleLogout(scope.$index, scope.row)"
                    >注销</hd-button>
                  </el-dropdown-menu>
                </el-dropdown>
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
        <form-object-add ref="addRef"></form-object-add>
        <form-object-detail ref="detailRef"></form-object-detail>
        <form-object-edit ref="editRef"></form-object-edit>
        <form-object-logout ref="logoutRef"></form-object-logout>
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
import FormObjectAdd from './FormObjectAdd';
import FormObjectDetail from './FormObjectDetail';
import FormObjectEdit from './FormObjectEdit';
import FormObjectLogout from './FormObjectLogout';

import { formObjectPage } from './api';

export default {
  name: 'FormItemList',
  moduleName: 'FormManageList',
  components: {
    FormObjectAdd,
    FormObjectDetail,
    FormObjectEdit,
    FormObjectLogout
  },
  provide() {
    return {
      hdList: this,
      formItemList: this
    };
  },
  inject: ['hdList'],
  mixins: [hdList],
  data() {
    return {
      // 查询
      queryData: {
        name: '',
        isShow: '',
        label: '',
        config: '',
        objectOrder: '',
        isAdmin: '',
        tableKey: '',
        colType: '',
        andor: this.$app.factorOptions.logicOpe.and,
        zxbs: '0'
      },
      // 查询条件
      extendData: {
        nameFilterFactor: this.$app.factorOptions.matchOpe.between,
        labelFilterFactor: this.$app.factorOptions.matchOpe.between,
        configFilterFactor: this.$app.factorOptions.matchOpe.between,
        orderFilterFactor: this.$app.factorOptions.matchOpe.between,
        tableKeyFilterFactor: this.$app.factorOptions.matchOpe.between,
        colTypeFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 行
      row: { vo: {} },
      // 显示
      visible: false,
      formUseType: new Map([
        ['01', 'app表单'],
        ['02', 'app列表'],
        ['03', 'pc表单'],
        ['04', 'pc列表']
      ])
    };
  },
  computed: {
    dialogTitle() {
      return `操作表单任务对象 —— 【${this.row.vo.formTitle}】【${this.row.vo.formId}】`;
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
      formObjectPage(dataParams)
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
