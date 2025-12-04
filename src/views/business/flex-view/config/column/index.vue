<template>
  <div class="hdty-container hdty-flex column-config-page">
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
              <!-- 列名称 -->
              <el-form-item label="列名称" prop="label">
                <hd-factor-input
                  prop="labelFilterFactor"
                  v-model="queryData.label"
                  fuzzy="between"
                  :model-control.sync="extendData.labelFilterFactor"
                  placeholder="请输入列名称"
                ></hd-factor-input>
              </el-form-item>

              <!-- 属性名 -->
              <el-form-item label="属性名" prop="prop">
                <hd-factor-input
                  prop="propFilterFactor"
                  v-model="queryData.prop"
                  fuzzy="between"
                  :model-control.sync="extendData.propFilterFactor"
                  placeholder="请输入属性名"
                ></hd-factor-input>
              </el-form-item>
              <el-form-item label="启用状态" prop="status">
                <hd-dict-radio
                  v-model="queryData.status"
                  :dict-code="$global.dictType.enableStatus"
                  show-all-button
                ></hd-dict-radio>
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
        <!-- <hd-button
          name="delete"
          type="danger"
          icon="el-icon-delete"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </hd-button> -->
      </hd-button-container>
    </div>

    <!-- 表格区域 -->
    <div class="hdty-fit">
      <el-table
        v-loading="loading"
        ref="tableRef"
        :data="tableData"
        row-key="id"
        :empty-text="emptyText"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        border
        default-expand-all
        fit
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>

        <!-- 列名称（树形列） -->
        <el-table-column
          prop="label"
          label="列名称"
          min-width="180"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span class="table-link" @click="handleDetail(scope.row)">
              {{ scope.row.label }}
            </span>
          </template>
        </el-table-column>

        <!-- 属性名 -->
        <el-table-column
          prop="prop"
          label="属性名"
          width="200"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 关联表单 -->
        <el-table-column
          prop="formIdText"
          label="关联表单"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.formIdText" size="mini" type="primary">
              {{ scope.row.formIdText }}
            </el-tag>
          </template>
        </el-table-column>
        <!-- 关联表单 -->
        <el-table-column
          prop="formItemIdText"
          label="关联表单项"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.formItemIdText" size="mini" type="primary">
              {{ scope.row.formItemIdText }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 排序号 -->
        <el-table-column
          prop="sortNum"
          label="排序号"
          align="center"
          width="80"
        >
        </el-table-column>

        <!-- 状态 -->
        <el-table-column
          prop="status"
          label="启用状态"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.status === '1' ? 'success' : 'info'"
              size="mini"
              effect="dark"
            >
              {{ scope.row.status === "1" ? "启用" : "停用" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 注销状态 -->
        <el-table-column prop="zxbs" label="注销状态" align="center" width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.zxbs === '0'" style="color: #01b3c1">
              {{ scope.row.zxbsText }}
            </div>
            <div v-else style="color: #ff0b00">{{ scope.row.zxbsText }}</div>
          </template>
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
                  v-if="scope.row.zxbs === '0'"
                  name="edit"
                  type="primary"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </hd-button>

                <!-- 启用/停用 -->
                <hd-button
                  v-if="scope.row.zxbs === '0' && scope.row.status === '0'"
                  name="edit"
                  type="warning"
                  @click="handleEnable(scope.row)"
                >
                  启用
                </hd-button>
                <hd-button
                  v-if="scope.row.zxbs === '0' && scope.row.status === '1'"
                  name="edit"
                  type="info"
                  :disabled="scope.row.zxbs === '1'"
                  @click="handleDisable(scope.row)"
                >
                  停用
                </hd-button>

                <!-- 注销 -->
                <hd-button
                  v-if="scope.row.zxbs === '0'"
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

    <!-- 弹窗组件 -->
    <column-add ref="addRef" @refresh="loadList"></column-add>
    <column-edit ref="editRef" @refresh="loadList"></column-edit>
    <column-detail ref="detailRef"></column-detail>
    <column-logout ref="logoutRef"></column-logout>
    <column-status ref="statusRef"></column-status>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { showTree, singleDelete, logout } from "./api";
import ColumnAdd from "./ColumnAdd";
import ColumnEdit from "./ColumnEdit";
import ColumnDetail from "./ColumnDetail";
import ColumnLogout from "./ColumnLogout";
import ColumnStatus from "./ColumnStatus";

export default {
  name: "ViewColumnList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    ColumnAdd,
    ColumnEdit,
    ColumnDetail,
    ColumnLogout,
    ColumnStatus
  },
  data() {
    return {
      // 查询条件
      queryData: {
        label: "",
        prop: "",
        status: "",
        zxbs: "0",
        createTime: []
      },
      // 查询条件
      // 扩展数据
      extendData: {
        labelFilterFactor: this.$app.factorOptions.matchOpe.between,
        propFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      tableData: [],
      // 表格数据
      tableData1: [
        {
          id: "c4be65a62c1944ddaf227d2015eaaaa9",
          label: "管辖机构",
          children: null
        },
        {
          id: "350a4ce31c1a4a78a2720a4b1cf3634b",
          label: "实有人口",
          children: [
            {
              id: "a66af65e2c4841e9b23327aede368edc",
              label: "总数",
              children: null
            }
          ]
        },
        {
          id: "b2fec343babe4523a6d40d14775e113a",
          label: "机构二",
          children: null
        }
      ],
      // 选中的ID列表
      selectedIds: [],
      // 选中的行数据
      selectedRows: [],

      refresh: true
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
      let _this = this;
      const params = {
        ..._this.queryData,
        ..._this.extendData
      };
      _this.refresh = false;

      _this.loading = true;

      showTree(params)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            // 将扁平数据转换为树形结构
            _this.tableData = _this.removeHasChildren(data.records || []);
          }
        })
        .catch((error) => {
          console.error("加载列表失败:", error);
        })
        .finally(() => {
          _this.$nextTick(() => {
            _this.refresh = true;
          });
          _this.$nextTick(() => {
            if (_this.$refs.tableRef) {
              _this.$refs.tableRef.doLayout();
            }
          });
          _this.loading = false;
        });
    },
    removeHasChildren(arr) {
      if (!arr || !Array.isArray(arr)) return [];

      return arr.map((item) => {
        // 创建新对象，排除 hasChildren 字段
        const { hasChildren, ...newItem } = item;

        // 递归处理子节点
        if (newItem.children && Array.isArray(newItem.children)) {
          newItem.children = this.removeHasChildren(newItem.children);
        }

        return newItem;
      });
    },

    /**
     * 查询
     */
    handleQuery() {
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
     * 启用
     * @param {Object} row - 行数据
     */
    handleEnable(row) {
      this.$refs.statusRef.visible = true;
      this.$refs.statusRef.row = row;
      this.$refs.statusRef.status = "1";
      this.$nextTick(() => {
        this.$refs.statusRef.beforeLoadForm();
      });
    },

    /**
     * 停用
     * @param {Object} row - 行数据
     */
    handleDisable(row) {
      this.$refs.statusRef.visible = true;
      this.$refs.statusRef.row = row;
      this.$refs.statusRef.status = "0";
      this.$nextTick(() => {
        this.$refs.statusRef.beforeLoadForm();
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
      this.$confirm("确定要删除该列配置吗？删除后将无法恢复！", "删除确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          singleDelete({ id: row.id })
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
     * 批量删除
     */
    handleBatchDelete() {
      if (this.selectedIds.length === 0) {
        this.$message.warning("请先选择要删除的记录");
        return;
      }

      this.$confirm(
        `确定要删除选中的 ${this.selectedIds.length} 条记录吗？删除后将无法恢复！`,
        "批量删除确认",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.$http
            .post("/web/sjls/sysColumnConfig/batchDelete", {
              ids: this.selectedIds
            })
            .then((response) => {
              const { success, msg } = response.data;
              if (success) {
                this.$message({
                  showClose: true,
                  customClass: "is-fixed",
                  message: msg,
                  type: "success"
                });
                this.selectedIds = [];
                this.selectedRows = [];
                this.loadList();
              }
            })
            .catch((error) => {
              console.error("批量删除失败:", error);
            });
        })
        .catch(() => {});
    },

    /**
     * 表格多选变化
     * @param {Array} selection - 选中的行数据
     */
    handleSelectionChange(selection) {
      this.selectedIds = selection.map((item) => item.id);
      this.selectedRows = selection;
    },

    /**
     * 获取计算类型文本
     * @param {String} calcType - 计算类型
     * @returns {String} 文本
     */
    getCalcTypeText(calcType) {
      const textMap = {
        sum: "SUM",
        avg: "AVG",
        count: "COUNT",
        max: "MAX",
        min: "MIN",
        custom: "CUSTOM"
      };
      return textMap[calcType] || calcType;
    },

    /**
     * 获取对齐方式标签类型
     * @param {String} align - 对齐方式
     * @returns {String} 标签类型
     */
    getAlignType(align) {
      const typeMap = {
        left: "primary",
        center: "success",
        right: "warning"
      };
      return typeMap[align] || "";
    },

    /**
     * 获取对齐方式文本
     * @param {String} align - 对齐方式
     * @returns {String} 文本
     */
    getAlignText(align) {
      const textMap = {
        left: "左对齐",
        center: "居中",
        right: "右对齐"
      };
      return textMap[align] || align;
    },

    /**
     * 格式化日期时间
     * @param {String} datetime - 日期时间字符串(YYYYMMDDHHmmss)
     * @returns {String} 格式化后的字符串
     */
    formatDatetime(datetime) {
      if (!datetime) return "";
      // 格式: 20251126100000 => 2025-11-26<br>10:00:00
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
.column-config-page {
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
