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
                  <el-form-item label="表单项名称" prop="itemLabel">
                    <hd-factor-input
                      v-model="queryData.itemLabel"
                      prop="itemLabelFilterFactor"
                      fuzzy="between"
                      :model-control.sync="extendData.itemLabelFilterFactor"
                      placeholder="请输入表单项名称"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item label="属性名" prop="itemProp">
                    <hd-factor-input
                      v-model="queryData.itemProp"
                      prop="itemPropFilterFactor"
                      fuzzy="between"
                      :model-control.sync="extendData.itemPropFilterFactor"
                      placeholder="请输入属性名"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item label="组件类型" prop="itemType">
                    <el-select
                      v-model="queryData.itemType"
                      clearable
                      placeholder="请选择组件类型"
                      filterable
                    >
                      <el-option
                        v-for="option in $global.componentType"
                        :key="option.value"
                        :label="`${option.label} - ${option.value}`"
                        :value="option.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item prop="andor" slot="after">
                    <hd-factor-logic v-model="queryData.andor"></hd-factor-logic>
                  </el-form-item>
                </hd-expand-header>
                <hd-expand-body>
                  <el-row>
                    <el-form-item label="使用类型" prop="useType">
                      <el-select
                        v-model="queryData.useType"
                        clearable
                        placeholder="请选择使用类型"
                        filterable
                      >
                        <el-option
                          v-for="option in $global.formUseType"
                          :key="option.value"
                          :label="option.label"
                          :value="option.value"
                        ></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="注销状态" prop="zxbs">
                      <hd-dict-radio
                        v-model="queryData.zxbs"
                        :dict-code="$global.dictType.logoutStatus"
                        showAllButton
                      ></hd-dict-radio>
                    </el-form-item>
                  </el-row>
                </hd-expand-body>
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
              prop="vo.itemLabel"
              label="表单项名称"
              header-align="center"
              show-overflow-tooltip
              min-width="180"
            >
              <template slot-scope="scope">
                <span
                  class="table-link"
                  @click="handleDetail(scope.$index, scope.row)"
                >{{ scope.row.vo.itemLabel }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.itemProp"
              label="属性名(prop)"
              show-overflow-tooltip
              header-align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="vo.itemType"
              label="组件类型"
              show-overflow-tooltip
              align="center"
              header-align="center"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="vo.itemConfig"
              label="组件配置"
              show-overflow-tooltip
              header-align="center"
              min-width="240"
            ></el-table-column>
            <el-table-column
              prop="vox.isFixed"
              label="是否为固定属性"
              show-overflow-tooltip
              header-align="center"
              min-width="120"
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.vo.isFixed === '1'"
                  class="text-color-5"
                >{{ scope.row.vox.isFixed }}</div>
                <div v-else>{{ scope.row.vox.isFixed }}</div>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.useType"
              label="使用类型"
              align="center"
              show-overflow-tooltip
              header-align="center"
              width="110"
            >
              <template slot-scope="scope">
                <span>{{formUseType.get(scope.row.vo.useType)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="vo.itemOrder"
              label="排序"
              sortable="custom"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="80"
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
              prop="vo.createUsername"
              label="采集人姓名"
              show-overflow-tooltip
              header-align="center"
              align="center"
              width="160"
            ></el-table-column>
            <!-- <el-table-column
              prop="vox.createTime"
              label="采集时间"
              sortable="custom"
              show-overflow-tooltip
              header-align="center"
              width="180"
            ></el-table-column>
            <el-table-column
              prop="vox.createOrgId"
              label="采集人机构"
              sortable="custom"
              show-overflow-tooltip
              header-align="center"
              width="160"
            ></el-table-column>
            <el-table-column
              prop="vo.memo"
              label="备注"
              sortable="custom"
              show-overflow-tooltip
              header-align="center"
              min-width="160"
            ></el-table-column>-->
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
        <form-item-add ref="addRef"></form-item-add>
        <form-item-detail ref="detailRef"></form-item-detail>
        <form-item-edit ref="editRef"></form-item-edit>
        <form-item-logout ref="logoutRef"></form-item-logout>
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
import FormItemAdd from './FormItemAdd';
import FormItemDetail from './FormItemDetail';
import FormItemEdit from './FormItemEdit';
import FormItemLogout from './FormItemLogout';

import { getFormItemPage } from './api';

export default {
  name: 'FormItemList',
  moduleName: 'FormManageList',
  components: {
    FormItemAdd,
    FormItemDetail,
    FormItemEdit,
    FormItemLogout
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
        itemLabel: '',
        itemProp: '',
        itemType: '',
        itemConfig: '',
        zxbs: '0',
        createUsername: '',
        createOrgId: '',
        useType: '',
        andor: this.$app.factorOptions.logicOpe.and
      },
      // 查询条件
      extendData: {
        itemLabelFilterFactor: this.$app.factorOptions.matchOpe.between,
        itemPropFilterFactor: this.$app.factorOptions.matchOpe.between,
        createUsernameFilterFactor: this.$app.factorOptions.matchOpe.between
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
      return `操作表单项 —— 【${this.row.vo.formTitle}】【${this.row.vo.formId}】`;
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
      getFormItemPage(dataParams)
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
