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
          <hd-expand>
            <hd-expand-header>
              <el-form-item label="表单名称" prop="formTitle">
                <hd-factor-input
                  prop="formTitleFilterFactor"
                  v-model="queryData.formTitle"
                  :model-contorl.sync="extendData.formTitleFilterFactor"
                  fuzzy="between"
                  placeholder="请输入表单名称"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item label="formId" prop="formId">
                <hd-factor-input
                  prop="formIdFilterFactor"
                  v-model="queryData.formId"
                  :model-contorl.sync="extendData.formIdFilterFactor"
                  fuzzy="between"
                  placeholder="请输入formId"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item prop="orgId" slot="after">
                <hd-organ
                  v-model="queryData.orgId"
                  placeholder="请选择管辖机构"
                ></hd-organ>
              </el-form-item>
            </hd-expand-header>
            <hd-expand-body>
              <el-row>
                <el-form-item label="是否必须有任务对象" prop="isMustObject">
                  <hd-dict-radio
                    v-model="queryData.isMustObject"
                    :dict-code="$global.dictType.isOrNot"
                    showAllButton
                  ></hd-dict-radio>
                </el-form-item>
                <el-form-item label="注销状态" prop="zxbs">
                  <hd-dict-radio
                    v-model="queryData.zxbs"
                    :dict-code="$global.dictType.logoutStatus"
                    showAllButton
                  ></hd-dict-radio>
                </el-form-item>
                <el-form-item label="授权状态" prop="isGlmk">
                  <el-radio-group v-model="queryData.isGlmk">
                    <el-radio label="1">全部</el-radio>
                    <el-radio label="0">已授权</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-row>
            </hd-expand-body>
          </hd-expand>
        </hd-component>
      </el-form>
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery"
          >查询</hd-button
        >
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
          >新增</hd-button
        >
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
          prop="vo.formId"
          label="formId"
          header-align="center"
          width="160"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="table-link"
              title="点击查看表单详情"
              @click="handleDetail(scope.$index, scope.row)"
              >{{ scope.row.vo.formId }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.formTitle"
          label="表单名称"
          header-align="center"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              class="table-link"
              @click="handlePreview(scope.$index, scope.row)"
              title="点击预览表单"
              >{{ scope.row.vo.formTitle }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          prop="vo.formItem"
          label="表单项"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleItem(scope.row)">
              <el-tag type="success">{{ scope.row.vo.formItem }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.formObjec"
          label="表单对象"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleObject(scope.row)">
              <el-tag type="warning">{{ scope.row.vo.formObjec }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.formFile"
          label="表单附件"
          header-align="center"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleFile(scope.row)">
              <el-tag type="info">{{ scope.row.vo.formFile }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.formAuth"
          label="授权机构"
          header-align="center"
          align="center"
          width="100"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleAuth(scope.row)">
              <el-tag type="danger">{{ scope.row.vo.formAuth }}</el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="formOrder"
          sortable="custom"
          label="表单排序"
          header-align="center"
          align="center"
          width="110"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.vo.formOrder }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="vox.orgId"
          label="所属机构"
          show-overflow-tooltip
          header-align="center"
          align="center"
          width="140"
        ></el-table-column>
        <el-table-column
          prop="vox.zxbs"
          label="注销状态"
          align="center"
          header-align="center"
          width="100"
        >
          <template slot-scope="scope">
            <!-- 有效文字样式设置为text-color-5 -->
            <p
              :class="{
                'text-color-5': scope.row.vo.zxbs === '0',
                'text-color-1': scope.row.vo.zxbs === '1'
              }"
            >
              {{ scope.row.vox.zxbs }}
            </p>
          </template>
        </el-table-column>

        <el-table-column
          prop="vo.createUsername"
          label="创建人"
          header-align="center"
          align="center"
          width="120"
        ></el-table-column>
        <el-table-column label="操作" align="center" width="100" fixed="right">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="info">操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <hd-button
                  type="success"
                  @click="handleDetail(scope.$index, scope.row)"
                  >详情</hd-button
                >
                <hd-button
                  type="warning"
                  v-show="scope.row.vo.zxbs === '0'"
                  @click="handlePreview(scope.$index, scope.row)"
                  >预览</hd-button
                >
                <hd-button
                  v-show="scope.row.vo.zxbs === '0'"
                  type="primary"
                  @click="handleEdit(scope.$index, scope.row)"
                  >编辑</hd-button
                >
                <el-button
                  v-show="scope.row.vo.zxbs === '0'"
                  type="danger"
                  @click="handleLogout(scope.$index, scope.row)"
                  >注销</el-button
                >
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
    <form-manage-add ref="addRef"></form-manage-add>
    <form-manage-edit ref="editRef"></form-manage-edit>
    <form-manage-logout ref="logoutRef"></form-manage-logout>
    <form-manage-detail ref="detailRef"></form-manage-detail>

    <new-task-form-preview
      ref="perviewRef"
      :isPreview="true"
    ></new-task-form-preview>

    <form-item-list ref="itemListRef"></form-item-list>
    <form-object-list ref="objectListRef"></form-object-list>
    <form-file-list ref="fileListRef"></form-file-list>
    <form-auth-list ref="authListRef"></form-auth-list>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { getFormPage } from "./api";

import NewTaskFormPreview from "@/views/task-center-new/common/NewTaskFormPreview";
import FormManageAdd from "./FormManageAdd";
import FormManageEdit from "./FormManageEdit";
import FormManageLogout from "./FormManageLogout";
import FormManageDetail from "./FormManageDetail";

import FormItemList from "./formItem/FormItemList";
import FormObjectList from "./formObject/FormObjectList";
import FormFileList from "./formFile/FormFileList";
import FormAuthList from "./formAuth/FormAuthList";

export default {
  name: "FormManageList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    NewTaskFormPreview,
    FormManageAdd,
    FormManageEdit,
    FormManageLogout,
    FormItemList,
    FormObjectList,
    FormFileList,
    FormManageDetail,
    FormAuthList
    // RoleDetail,
    // RoleEdit
  },
  data() {
    return {
      // 查询
      queryData: {
        formId: "",
        formTitle: "",
        formConfig: "",
        isMustObject: "",
        zxbs: "0",
        orgId: "",
        isGlmk: "1"
      },
      extendData: {
        formTitleFilterFactor: this.$app.factorOptions.matchOpe.between,
        formIdFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格
      tableData: [],
      // 验证
      rules: {}
    };
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
          ..._this.extendData,
          ..._this.pageOptions
        };
        // Lambda写法
        getFormPage(dataParams)
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
    handleLogout(index, row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$refs.logoutRef.beforeLoadForm();
    },
    // 删除
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm("确定要删除吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          // 参数
          let dataParams = {
            id: row.id
          };
          // Lambda写法
          deleteRole(dataParams)
            .then((response) => {
              // 响应成功回调
              let { success, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
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
    },
    // 预览
    /**
     * 处理预览操作
     *
     * @param index 表格行索引
     * @param row 表格行数据
     */
    handlePreview(index, row) {
      this.$refs.perviewRef.visible = true;
      this.$refs.perviewRef.row = row;
      this.$refs.perviewRef.beforeLoadForm();
    },
    // 跳转到表单项
    /**
     * 处理列表项点击事件
     *
     * @param row 被点击的列表项数据
     */
    handleItem(row) {
      this.$refs.itemListRef.visible = true;
      this.$refs.itemListRef.row = row;
      this.$nextTick(() => {
        this.$refs.itemListRef.queryData.zxbs = this.queryData.zxbs;
        this.$refs.itemListRef.loadList();
      });
    },
    // 跳转到表单对象项
    /**
     * 处理对象列表
     *
     * @param row 当前行数据
     */
    handleObject(row) {
      this.$refs.objectListRef.visible = true;
      this.$refs.objectListRef.row = row;
      this.$nextTick(() => {
        this.$refs.objectListRef.queryData.zxbs = this.queryData.zxbs;
        this.$refs.objectListRef.loadList();
      });
    },
    handleAuth(row) {
      this.$refs.authListRef.visible = true;
      this.$refs.authListRef.row = row;
      this.$nextTick(() => {
        this.$refs.authListRef.queryData.zxbs = this.queryData.zxbs;
        this.$refs.authListRef.loadList();
      });
    },
    // 跳转到表单附件页
    handleFile(row) {
      this.$refs.fileListRef.visible = true;
      this.$refs.fileListRef.row = row;
      this.$nextTick(() => {
        this.$refs.fileListRef.queryData.zxbs = this.queryData.zxbs;
        this.$refs.fileListRef.loadList();
      });
    },
    // 注销状态列文字颜色
    zxColor(scope) {
      return scope.row.vo.zxbs === "0";
    }
  }
};
</script>
