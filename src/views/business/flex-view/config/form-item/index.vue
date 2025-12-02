<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="visible"
    append-to-body
    custom-class="hdty-dialog-medium new-form"
    :before-close="cancelForm"
  >
    <hd-pane>
      <div class="hdty-container hdty-flex">
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
                  <!-- 组件标签 -->
                  <el-form-item label="组件标签" prop="itemLabel">
                    <hd-factor-input
                      prop="itemLabelFilterFactor"
                      v-model="queryData.itemLabel"
                      fuzzy="between"
                      :model-control.sync="extendData.itemLabelFilterFactor"
                      placeholder="请输入组件标签"
                    ></hd-factor-input>
                  </el-form-item>

                  <!-- 属性名 -->
                  <el-form-item label="属性名" prop="itemProp">
                    <hd-factor-input
                      prop="itemPropFilterFactor"
                      v-model="queryData.itemProp"
                      fuzzy="between"
                      :model-control.sync="extendData.itemPropFilterFactor"
                      placeholder="请输入属性名"
                    ></hd-factor-input>
                  </el-form-item>
                </hd-query-fixed>
                <hd-query-expand>
                  <el-row>
                    <!-- 组件类型 -->
                    <el-form-item label="组件类型" prop="itemType">
                      <el-select
                        v-model="queryData.itemType"
                        placeholder="请选择组件类型"
                        clearable
                        filterable
                        multiple
                      >
                        <el-option
                          v-for="item in itemTypeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
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
            <hd-button icon="el-icon-delete" @click="handleClear">
              清空
            </hd-button>
            <hd-button
              v-show="row.vo && row.vo.zxbs === '0'"
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
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="60"
            >
            </el-table-column>

            <!-- 组件标签 -->
            <el-table-column
              prop="vo.itemLabel"
              label="组件标签"
              min-width="150"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span class="table-link" @click="handleDetail(scope.row)">
                  {{ scope.row.vo.itemLabel }}
                </span>
              </template>
            </el-table-column>

            <!-- 属性名 -->
            <el-table-column
              prop="vo.itemProp"
              label="属性名"
              width="140"
              show-overflow-tooltip
            >
            </el-table-column>

            <!-- 组件类型 -->
            <el-table-column
              prop="vo.itemType"
              label="组件类型"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag type="primary" size="mini">
                  {{ getItemTypeLabel(scope.row.vo.itemType) }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 是否固定 -->
            <el-table-column
              prop="vo.isFixed"
              label="是否映射表字段"
              align="center"
              width="120"
            >
              <template slot-scope="scope">
                <el-tag
                  :type="scope.row.vo.isFixed === '1' ? 'success' : 'info'"
                  size="mini"
                >
                  {{ scope.row.vo.isFixed === "1" ? "是" : "否" }}
                </el-tag>
              </template>
            </el-table-column>

            <!-- 映射列名 -->
            <el-table-column
              prop="vo.tableKey"
              label="映射列名"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>

            <!-- 排序号 -->
            <el-table-column
              prop="vo.itemOrder"
              label="排序"
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
                <div v-else style="color: #ff0b00">
                  {{ scope.row.vox.zxbs }}
                </div>
              </template>
            </el-table-column>

            <!-- 操作列 -->
            <el-table-column
              fixed="right"
              label="操作"
              align="center"
              width="100"
            >
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
      </div>
    </hd-pane>

    <!-- 弹窗组件 -->
    <form-item-add
      ref="addRef"
      :formRow="row"
      @refresh="loadList"
    ></form-item-add>
    <form-item-edit ref="editRef" @refresh="loadList"></form-item-edit>
    <form-item-detail ref="detailRef"></form-item-detail>
    <form-item-logout ref="logoutRef" @refresh="loadList"></form-item-logout>
  </el-dialog>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { page } from "./api";
import { ITEM_TYPE_OPTIONS } from "./constants";
import FormItemAdd from "./FormItemAdd";
import FormItemEdit from "./FormItemEdit";
import FormItemDetail from "./FormItemDetail";
import FormItemLogout from "./FormItemLogout";

export default {
  name: "FormItemList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    FormItemAdd,
    FormItemEdit,
    FormItemDetail,
    FormItemLogout
  },
  data() {
    return {
      visible: false,
      // 父级行数据
      row: { vo: {}, vox: {} },
      // 查询条件
      queryData: {
        formId: "",
        itemLabel: "",
        itemProp: "",
        itemType: [],
        zxbs: "0"
      },
      // 扩展数据
      extendData: {
        itemLabelFilterFactor: this.$app.factorOptions.matchOpe.between,
        itemPropFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格数据
      tableData: [],
      // 组件类型选项
      itemTypeOptions: ITEM_TYPE_OPTIONS
    };
  },
  computed: {
    dialogTitle() {
      return `表单项配置 - ${this.row.vo.formName || ""}`;
    }
  },
  methods: {
    /**
     * 根据组件类型值获取标签
     */
    getItemTypeLabel(value) {
      const item = this.itemTypeOptions.find(
        (option) => option.value === value
      );
      return item ? item.label : value;
    },

    /**
     * 加载列表数据
     */
    loadList() {
      this.loading = true;
      const params = {
        ...this.queryData,
        ...this.extendData,
        formId: this.row.vo.id,
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
     */
    handleCancel(row) {
      this.$refs.logoutRef.visible = true;
      this.$refs.logoutRef.row = row;
      this.$nextTick(() => {
        this.$refs.logoutRef.beforeLoadForm();
      });
    },

    /**
     * 关闭弹窗
     */
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },

    /**
     * 重置表单
     */
    resetForm() {
      this.tableData = [];
      this.pageOptions.current = 1;
      this.pageOptions.total = 0;
    }
  }
};
</script>

<style lang="scss" scoped>
/* 可点击链接样式 */
.table-link {
  color: #409eff;
  cursor: pointer;
  text-decoration: underline;

  &:hover {
    color: #66b1ff;
  }
}
</style>
