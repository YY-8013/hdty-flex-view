<template>
  <div class="hdty-container hdty-flex column-config-page">
    <!-- 查询区域 -->
    <div class="hdty-header">
      <el-form ref="queryRef" :model="queryData" inline>
        <hd-component :model="extendData" ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <!-- 列名称 -->
              <el-form-item label="列名称" prop="label">
                <el-input
                  v-model="queryData.label"
                  placeholder="请输入列名称"
                  clearable
                  style="width: 180px"
                >
                </el-input>
              </el-form-item>

              <!-- 数据字段 -->
              <el-form-item label="数据字段" prop="prop">
                <el-input
                  v-model="queryData.prop"
                  placeholder="请输入数据字段"
                  clearable
                  style="width: 180px"
                >
                </el-input>
              </el-form-item>

              <!-- 状态 -->
              <el-form-item label="状态" prop="status">
                <el-select
                  v-model="queryData.status"
                  placeholder="请选择状态"
                  clearable
                  style="width: 120px"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="启用" value="1"></el-option>
                  <el-option label="停用" value="0"></el-option>
                </el-select>
              </el-form-item>

              <!-- 注销状态 -->
              <el-form-item label="注销状态" prop="zxbs" slot="after">
                <el-select
                  v-model="queryData.zxbs"
                  placeholder="请选择注销状态"
                  clearable
                  underline
                  style="width: 120px"
                >
                  <el-option label="全部" value=""></el-option>
                  <el-option label="未注销" value="0"></el-option>
                  <el-option label="已注销" value="1"></el-option>
                </el-select>
              </el-form-item>
            </hd-query-fixed>
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
        <hd-button
          name="delete"
          type="danger"
          icon="el-icon-delete"
          :disabled="selectedIds.length === 0"
          @click="handleBatchDelete"
        >
          批量删除
        </hd-button>
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
        default-expand-all
        border
        fit
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 序号列 -->
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>

        <!-- 多选列 -->
        <el-table-column
          type="selection"
          reserve-selection
          align="center"
          width="50"
        >
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

        <!-- 数据字段 -->
        <el-table-column
          prop="prop"
          label="数据字段"
          width="150"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 列宽 -->
        <el-table-column
          prop="columnWidth"
          label="列宽"
          align="center"
          width="80"
        >
        </el-table-column>

        <!-- 对齐方式 -->
        <el-table-column
          prop="align"
          label="对齐方式"
          align="center"
          width="90"
        >
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.align"
              size="mini"
              :type="getAlignType(scope.row.align)"
            >
              {{ getAlignText(scope.row.align) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 固定列 -->
        <el-table-column prop="fixed" label="固定列" align="center" width="80">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.fixed" size="mini" type="warning">
              {{ scope.row.fixed === "left" ? "左" : "右" }}
            </el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>

        <!-- 关联表单 -->
        <el-table-column
          prop="formName"
          label="关联表单"
          width="140"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.formName" size="mini" type="primary">
              {{ scope.row.formName }}
            </el-tag>
            <span v-else>-</span>
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
        <el-table-column prop="status" label="状态" align="center" width="80">
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
            <el-tag
              :type="scope.row.zxbs === '0' ? 'success' : 'danger'"
              size="mini"
            >
              {{ scope.row.zxbs === "0" ? "未注销" : "已注销" }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 创建时间 -->
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.createTime)"></span>
          </template>
        </el-table-column>

        <!-- 备注 -->
        <el-table-column
          prop="memo"
          label="备注"
          min-width="150"
          show-overflow-tooltip
        >
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column fixed="right" label="操作" align="center" width="280">
          <template slot-scope="scope">
            <hd-button-container>
              <!-- 详情 -->
              <hd-button
                name="detail"
                type="success"
                size="mini"
                @click="handleDetail(scope.row)"
              >
                详情
              </hd-button>

              <!-- 编辑 -->
              <hd-button
                name="edit"
                type="primary"
                size="mini"
                :disabled="scope.row.zxbs === '1'"
                @click="handleEdit(scope.row)"
              >
                编辑
              </hd-button>

              <!-- 启用/停用 -->
              <hd-button
                v-if="scope.row.status === '0'"
                name="enable"
                type="warning"
                size="mini"
                :disabled="scope.row.zxbs === '1'"
                @click="handleEnable(scope.row)"
              >
                启用
              </hd-button>
              <hd-button
                v-else
                name="disable"
                type="info"
                size="mini"
                :disabled="scope.row.zxbs === '1'"
                @click="handleDisable(scope.row)"
              >
                停用
              </hd-button>

              <!-- 注销 -->
              <hd-button
                name="cancel"
                type="danger"
                size="mini"
                :disabled="scope.row.zxbs === '1'"
                @click="handleCancel(scope.row)"
              >
                注销
              </hd-button>

              <!-- 删除 -->
              <hd-button
                name="delete"
                type="danger"
                size="mini"
                @click="handleDelete(scope.row)"
              >
                删除
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 弹窗组件 -->
    <column-add ref="addRef" @refresh="loadList"></column-add>
    <column-edit ref="editRef" @refresh="loadList"></column-edit>
    <column-detail ref="detailRef"></column-detail>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import {
  getColumnPage,
  deleteColumn,
  batchDeleteColumn,
  enableColumn,
  disableColumn,
  cancelColumn
} from "../../api/column";
import ColumnAdd from "./ColumnAdd";
import ColumnEdit from "./ColumnEdit";
import ColumnDetail from "./ColumnDetail";

export default {
  name: "ColumnConfigList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    ColumnAdd,
    ColumnEdit,
    ColumnDetail
  },
  data() {
    return {
      // 查询条件
      queryData: {
        label: "",
        prop: "",
        status: "",
        zxbs: ""
      },
      // 扩展数据
      extendData: {},
      // 表格数据
      tableData: [],
      // 选中的ID列表
      selectedIds: [],
      // 选中的行数据
      selectedRows: []
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
        ...this.extendData
      };

      getColumnPage(params)
        .then((response) => {
          const { success, data } = response.data;
          if (success) {
            // 将扁平数据转换为树形结构
            this.tableData = this.arrayToTree(data.records || []);
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
     * 将扁平数组转换为树形结构
     * @param {Array} array - 扁平数组
     * @param {String|null} parentId - 父节点ID
     * @returns {Array} 树形结构数组
     */
    arrayToTree(array, parentId = null) {
      const tree = [];
      array.forEach((item) => {
        // 兼容null、"null"、undefined等情况
        const itemParentId =
          item.parentId === "null" || item.parentId === undefined
            ? null
            : item.parentId;
        if (itemParentId === parentId) {
          // 创建新对象，避免修改原始数据
          const node = { ...item };
          const children = this.arrayToTree(array, item.id);
          if (children.length > 0) {
            // 使用 Vue.set 确保响应式
            this.$set(node, "children", children);
            this.$set(node, "hasChildren", true);
          }
          tree.push(node);
        }
      });
      return tree;
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
      this.$prompt("请输入启用原因", "启用确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "启用原因不能为空"
      })
        .then(({ value }) => {
          enableColumn(row.id, value)
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
              console.error("启用失败:", error);
            });
        })
        .catch(() => {});
    },

    /**
     * 停用
     * @param {Object} row - 行数据
     */
    handleDisable(row) {
      this.$prompt("请输入停用原因", "停用确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "停用原因不能为空"
      })
        .then(({ value }) => {
          disableColumn(row.id, value)
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
              console.error("停用失败:", error);
            });
        })
        .catch(() => {});
    },

    /**
     * 注销
     * @param {Object} row - 行数据
     */
    handleCancel(row) {
      this.$prompt("请输入注销原因", "注销确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: "注销原因不能为空",
        inputType: "textarea"
      })
        .then(({ value }) => {
          const dataParams = {
            id: row.id,
            zxyy: value
          };

          cancelColumn(dataParams)
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
              console.error("注销失败:", error);
            });
        })
        .catch(() => {});
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
          deleteColumn(row.id)
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
          batchDeleteColumn(this.selectedIds)
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
