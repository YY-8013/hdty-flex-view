<template>
  <div class="hdty-container hdty-flex form-config-page">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <el-form
        ref="queryRef"
        :model="queryData"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery"
      >
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <!-- 表单名称 -->
              <el-form-item label="表单名称" prop="formName">
                <hd-factor-input
                  prop="formNameFilterFactor"
                  v-model="queryData.formName"
                  fuzzy="between"
                  :model-control.sync="extendData.formNameFilterFactor"
                  placeholder="请输入表单名称"
                ></hd-factor-input>
              </el-form-item>

              <!-- 表单编码 -->
              <el-form-item label="表单编码" prop="formCode">
                <hd-factor-input
                  prop="formCodeFilterFactor"
                  v-model="queryData.formCode"
                  fuzzy="between"
                  :model-control.sync="extendData.formCodeFilterFactor"
                  placeholder="请输入表单编码"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item label="表单类型" prop="formType">
                <hd-dict-select
                  v-model="queryData.formType"
                  :model-text.sync="extendData.formType"
                  :dict-code="$global.dictType.formType"
                  placeholder="请选择表单类型"
                  style="width: 200px"
                >
                </hd-dict-select>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="创建时间" prop="createTime">
                  <hd-date-picker
                    type="datetimerange"
                    v-model="queryData.createTime"
                  ></hd-date-picker>
                </el-form-item>
                <!-- 注销状态 -->
                <el-form-item label="注销状态" prop="zxbs">
                  <hd-dict-radio
                    v-model="queryData.zxbs"
                    :dict-code="$global.dictType.zxbs"
                    show-all-button
                  ></hd-dict-radio>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
        </hd-component>
      </el-form>

      <!-- 按钮区域 -->
      <hd-button-container>
        <hd-button
          name="query"
          type="info"
          icon="el-icon-search"
          @click="handleQuery"
        >
          查询
        </hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear"> 清空 </hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >
          新增
        </hd-button>
      </hd-button-container>
    </div>

    <!-- 表格区域 -->
    <div class="hdty-fit">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="tableData"
        :empty-text="emptyText"
        border
        fit
        height="100%"
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <!-- 表单编码 -->
        <el-table-column
          prop="vo.formCode"
          label="表单编码"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 表单名称 -->
        <el-table-column
          prop="vo.formName"
          label="表单名称"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="table-link" @click="handleDetail(scope.row)">
              {{ scope.row.vo.formName }}
            </span>
          </template>
        </el-table-column>

        <!-- 数据表 -->
        <el-table-column
          prop="vo.dataTable"
          label="数据存储表"
          width="240"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 表单项 -->
        <el-table-column
          prop="vo.itemNum"
          label="表单项"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            <a href="javascript:;" @click="handleFormItem(scope.row)">
              <el-tag type="success">{{ scope.row.vo.itemNum || 0 }}</el-tag>
            </a>
          </template>
        </el-table-column>

        <!-- 表单类型 -->
        <el-table-column
          prop="vo.formType"
          label="表单类型"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.vo.formType === '0' ? 'success' : 'primary'"
              size="mini"
            >
              {{ scope.row.vox.formType }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 版本号 -->
        <el-table-column
          prop="vo.version"
          label="版本"
          align="center"
          width="80"
        >
        </el-table-column>

        <!-- 注销状态 -->
        <el-table-column
          prop="vo.zxbs"
          label="注销状态"
          align="center"
          width="90"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.vo.zxbs === '0'" style="color: #01b3c1">
              {{ scope.row.vox.zxbs }}
            </div>
            <div v-else style="color: #ff0b00">{{ scope.row.vox.zxbs }}</div>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          prop="vox.createTime"
          label="创建时间"
          align="center"
          width="160"
        >
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-dropdown>
              <el-button type="info">操作</el-button>
              <el-dropdown-menu slot="dropdown">
                <!-- 详情 -->
                <hd-button
                  name="detail"
                  type="success"
                  @click="handleDetail(scope.row)"
                >
                  详情
                </hd-button>

                <!-- 编辑 -->
                <hd-button
                  v-if="scope.row.vo.zxbs === '0'"
                  name="edit"
                  type="primary"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </hd-button>

                <!-- 注销 -->
                <hd-button
                  v-if="scope.row.vo.zxbs === '0'"
                  name="off"
                  type="danger"
                  @click="handleCancel(scope.row)"
                >
                  注销
                </hd-button>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
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

    <!-- 弹窗组件 -->
    <form-add ref="addRef" @refresh="loadList"></form-add>
    <form-edit ref="editRef" @refresh="loadList"></form-edit>
    <form-detail ref="detailRef"></form-detail>
    <form-logout ref="logoutRef" @refresh="loadList"></form-logout>
    <form-item-list ref="itemListRef"></form-item-list>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { page, singleDelete } from "./api";
import { FORM_TYPE_OPTIONS } from "./constants";
import FormAdd from "./FormAdd";
import FormEdit from "./FormEdit";
import FormDetail from "./FormDetail";
import FormLogout from "./FormLogout";
import FormItemList from "../form-item/index";

export default {
  name: "ViewFormList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    FormAdd,
    FormEdit,
    FormDetail,
    FormLogout,
    FormItemList
  },
  data() {
    return {
      // 查询条件
      queryData: {
        formName: "",
        formCode: "",
        formType: "",
        zxbs: "0",
        createTime: []
      },
      // 扩展数据
      extendData: {
        formNameFilterFactor: this.$app.factorOptions.matchOpe.between,
        formCodeFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格数据
      tableData: [],
      // 表单类型选项
      formTypeOptions: FORM_TYPE_OPTIONS
    };
  },
  mounted() {
    this.loadList();
  },
  methods: {
    /**
     * 加载列表数据
     */
    loadList() {
      this.loading = true;
      const params = {
        ...this.queryData,
        ...this.extendData,
        current: this.pageOptions.current,
        size: this.pageOptions.size
      };

      page(params)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            this.tableData = data.records || [];
            this.pageOptions.total = data.total || 0;
          }
        })
        .catch((error) => {
          console.error("加载列表失败:", error);
        })
        .finally(() => {
          this.$nextTick(() => {
            if (this.$refs.tableRef) {
              this.$refs.tableRef.doLayout();
            }
          });
          this.loading = false;
        });
    },

    /**
     * 查询
     */
    handleQuery() {
      this.pageOptions.current = 1;
      this.loadList();
    },

    /**
     * 清空查询条件
     */
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    },

    /**
     * 新增
     */
    handleAdd() {
      this.$refs.addRef.visible = true;
      this.$nextTick(() => {
        this.$refs.addRef.beforeLoadForm();
      });
    },

    /**
     * 详情
     * @param {Object} row - 行数据
     */
    handleDetail(row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$nextTick(() => {
        this.$refs.detailRef.beforeLoadForm();
      });
    },

    /**
     * 编辑
     * @param {Object} row - 行数据
     */
    handleEdit(row) {
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$nextTick(() => {
        this.$refs.editRef.beforeLoadForm();
      });
    },

    /**
     * 注销
     * @param {Object} row - 行数据
     */
    handleCancel(row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$nextTick(() => {
        this.$refs.logoutRef.beforeLoadForm();
      });
    },

    /**
     * 删除单条记录
     * @param {Object} row - 行数据
     */
    handleDelete(row) {
      this.$confirm("确定要删除该表单配置吗？删除后将无法恢复！", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          singleDelete({ id: row.vo.id })
            .then((response) => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                this.loadList();
              }
            })
            .catch((error) => {
              console.error("删除失败:", error);
            });
        })
        .catch(() => {});
    },

    /**
     * 表单项管理
     * @param {Object} row - 行数据
     */
    handleFormItem(row) {
      this.$refs.itemListRef.visible = true;
      this.$refs.itemListRef.row = row;
      this.$nextTick(() => {
        this.$refs.itemListRef.queryData.zxbs = this.queryData.zxbs;
        this.$refs.itemListRef.loadList();
      });
    },

    /**
     * 格式化日期时间
     * @param {String} datetime - 日期时间字符串(YYYYMMDDHHmmss)
     * @returns {String} 格式化后的字符串
     */
    formatDatetime(datetime) {
      if (!datetime) return "";
      const str = datetime.toString();
      const date = str.substring(0, 8);
      const time = str.substring(8);
      return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(
        6,
        8
      )}<br>${time.substring(0, 2)}:${time.substring(2, 4)}:${time.substring(
        4,
        6
      )}`;
    }
  }
};
</script>

<style lang="scss" scoped>
.form-config-page {
  /* 可点击链接样式 */
  .table-link {
    color: #409eff;
    cursor: pointer;
    text-decoration: underline;

    &:hover {
      color: #66b1ff;
    }
  }

  /* 按钮容器内的按钮样式 */
  ::v-deep .hd-button-container {
    .hd-button {
      margin-left: 4px;
      margin-right: 4px;
    }
  }
}
</style>
