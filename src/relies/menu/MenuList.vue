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
        <hd-query>
          <hd-query-fixed>
            <el-form-item label="菜单名称" prop="name">
              <el-input
                v-model="queryData.name"
                placeholder="请输入菜单名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="客 户 端" prop="clientType">
              <hd-dict-radio
                v-model="queryData.clientType"
                :dict-code="$global.dictType.clientType"
                show-all-button
              ></hd-dict-radio>
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-row>
              <el-form-item label="菜单代码" prop="url">
                <el-input
                  v-model="queryData.url"
                  placeholder="请输入菜单代码"
                ></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="更新时间" prop="updateTime">
                <hd-date-picker
                  type="datetimerange"
                  v-model="queryData.updateTime"
                ></hd-date-picker>
              </el-form-item>
            </el-row>
          </hd-query-expand>
        </hd-query>
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
        v-if="refresh"
        :data="tableData"
        :empty-text="emptyText"
        row-key="id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        lazy
        :load="load"
        :tree-props="props"
        :indent="32"
        border
        fit
        height="100%"
        @expand-change="handleExpandChange"
      >
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="45"
        ></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="序号"
          class-name="is-index"
          align="center"
          width="45"
        ></el-table-column>
        <el-table-column
          fixed
          type="index"
          label="排序"
          class-name="is-plain"
          align="center"
          width="80"
        >
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="order"
                type="success"
                icon="el-icon-top"
                circle
                :disabled="scope.row.isFirst"
                @click="handleOrder(scope.$index, scope.row, true)"
              ></hd-button>
              <hd-button
                name="order"
                type="primary"
                icon="el-icon-bottom"
                circle
                :disabled="scope.row.isLast"
                @click="handleOrder(scope.$index, scope.row, false)"
              ></hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          label="操作"
          align="center"
          width="210"
        >
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)"
                >详情</hd-button
              >
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)"
                >编辑</hd-button
              >
              <hd-button
                :disabled="
                  scope.row.name === '工作台' || scope.row.name === '主页'
                "
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
                >删除</hd-button
              >
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="菜单名称"
          sortable="custom"
          header-align="center"
          min-width="250"
        ></el-table-column>
        <el-table-column
          label="客户端/性质"
          sortable="custom"
          header-align="center"
          min-width="120"
        >
          <template slot-scope="scope">
            <span>{{
              scope.row.clientType +
              " / " +
              (scope.row.isNavigation ? scope.row.isNavigation : "未知")
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="url"
          label="菜单代码"
          sortable="custom"
          header-align="center"
          min-width="160"
        ></el-table-column>
        <el-table-column label="图标" width="50">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
          </template>
        </el-table-column>
        <el-table-column label="菜单权限" header-align="center" min-width="445">
          <template slot-scope="scope">
            <span v-for="item in scope.row.pageElementList">
              <i :class="item.icon"></i>
              {{ item.name }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          sortable="custom"
          header-align="center"
          min-width="170"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.updateTime)"></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <menu-add ref="addRef"></menu-add>
    <menu-edit ref="editRef"></menu-edit>
    <menu-detail ref="detailRef"></menu-detail>
  </div>
</template>

<script>
import { hdList } from "@/utils/util-framework";
import { getMenuList, editOrder, deleteMenu } from "@/api/menu";
import { getControlPage } from "@/api/joinsys-manage";
import { getList } from "@/api/dict-item";
import MenuAdd from "./MenuAdd";
import MenuEdit from "./MenuEdit";
import MenuDetail from "./MenuDetail";
export default {
  name: "MenuList",
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    MenuAdd,
    MenuEdit,
    MenuDetail
  },
  data() {
    return {
      // 接入系统选择器配置项
      joinsysSelectOptions: {
        api: getControlPage,
        props: {
          value: "vo.id",
          label: "vo.systemName",
          response: "records"
        },
        columns: [
          {
            field: "vo.systemName",
            label: "系统名称",
            fixed: true,
            sortable: "custom",
            minWidth: "240"
          },
          {
            field: "vo.companyName",
            label: "所属公司",
            sortable: "custom",
            minWidth: "260"
          },
          {
            field: "vo.id",
            label: "系统编号",
            sortable: "custom",
            width: "300"
          }
        ],
        searches: [
          [
            {
              field: "systemName",
              label: "系统名称",
              type: "input",
              placeholder: "请输入系统名称"
            }
          ]
        ]
      },
      // 配置项
      props: {
        children: "children",
        hasChildren: "hasChildren"
      },
      // 查询
      queryData: {
        parentId: "",
        name: "",
        clientType: "",
        url: "",
        updateTime: []
      },
      // 客户端数据
      clientData: [],
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 根节点的Map
      rootNodeMap: {},
      // 展开的节点Map
      expandNodeMap: {},
      // 当前操作行
      currentRow: {},
      // 刷新
      refresh: true
    };
  },
  mounted() {
    // 加载数据表格
    this.loadClientData();
  },
  methods: {
    // 加载客户端数据
    loadClientData() {
      let _this = this;
      // 参数
      let dataParams = {
        typeId: _this.$global.dictType.clientType
      };
      getList(dataParams)
        .then((response) => {
          let { success, data } = response.data;
          if (success) {
            data.forEach((v) => {
              _this.clientData.push(v.key);
            });
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loadList();
        });
    },
    // 加载数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        _this.refresh = false;
        _this.$nextTick(() => {
          _this.refresh = true;
        });
        // 参数
        let dataParams = {
          ..._this.queryData
        };
        // Lambda写法
        getMenuList(dataParams)
          .then((response) => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.rootNodeMap = {};
              _this.expandNodeMap = {};
              let diffTypeMap = {};
              data.forEach((v) => {
                let k = v.clientTypeKey;
                if (!_this.$utilStr.isEmpty(diffTypeMap[k])) {
                  diffTypeMap[k]++;
                } else {
                  diffTypeMap[k] = 0;
                }
                v.index = diffTypeMap[k];
              });
              data.forEach((v, i) => {
                let k = v.clientTypeKey;
                if (v.index === 0) {
                  v.isFirst = true;
                }
                if (v.index === diffTypeMap[k]) {
                  v.isLast = true;
                  _this.rootNodeMap[k] = i;
                }
              });
              _this.tableData = data;
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
    // 加载子节点数据
    load(tree, treeNode, resolve) {
      let _this = this;
      // 参数
      let dataParams = {
        parentId: tree.id
      };
      // Lambda写法
      getMenuList(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            data.forEach((val, i) => {
              if (i === 0) {
                val.isFirst = true;
              }
              if (i === data.length - 1) {
                val.isLast = true;
              }
            });
            _this.expandNodeMap[tree.id] = resolve;
            resolve(data);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.$refs.tableRef.doLayout();
        });
    },
    // 查询
    handleQuery() {
      let _this = this;
      _this.$refs.queryRef.validate((valid) => {
        if (valid) {
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
      this.currentRow = row;
      this.$refs.editRef.visible = true;
      this.$refs.editRef.row = row;
      this.$refs.editRef.beforeLoadForm();
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
          _this.loading = true;
          // 参数
          let dataParams = {
            id: row.id
          };
          // Lambda写法
          deleteMenu(dataParams)
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
                _this.deleteRow(row);
              }
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            })
            .finally(() => {
              _this.loading = false;
            });
        })
        .catch(() => {});
    },
    // 排序
    handleOrder(index, row, upOrDown) {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        id: row.id,
        isUp: upOrDown
      };
      // Lambda写法
      editOrder(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success } = response.data;
          if (success) {
            _this.reorderRow(row, upOrDown);
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.error(error);
        })
        .finally(() => {
          _this.loading = false;
        });
    },
    // 展开/收起
    handleExpandChange() {
      this.$nextTick(() => {
        this.$refs.tableRef.doLayout();
      });
    },
    // 插入行
    insertRow(row) {
      let currentRow = {
        id: row.id,
        name: row.name,
        url: row.url,
        icon: row.icon,
        clientType: row.clientTypeValue,
        clientTypeKey: row.clientType,
        isNavigation: row.isNavigationValue,
        isNavigationKey: row.isNavigation,
        pageElementList: row.pageElementList,
        updateTime: this.$utilDate.toString(new Date()),
        isLast: true,
        hasChildren: row.type === this.$global.dictItem.menuType.branchNode,
        children: null
      };
      if (row.parentId) {
        if (this.expandNodeMap[row.parentId]) {
          let parentNode =
            this.$refs.tableRef.store.states.lazyTreeNodeMap[row.parentId];
          parentNode[parentNode.length - 1].isLast = false;
          parentNode.push(currentRow);
        } else if (this.tableData.find((e) => e.id === row.parentId)) {
          let parentNode = this.tableData.find((e) => e.id === row.parentId);
          parentNode.hasChildren = true;
        } else {
          let parentNode = this.$refs.tableRef.store.states.lazyTreeNodeMap[
            row.parentParentId
          ].find((e) => e.id === row.parentId);
          parentNode.hasChildren = true;
        }
      } else {
        let currentClientType = row.clientType;
        if (!this.$utilStr.isEmpty(this.rootNodeMap[currentClientType])) {
          this.tableData[this.rootNodeMap[currentClientType]].isLast = false;
          this.rootNodeMap[currentClientType]++;
          this.tableData.splice(
            this.rootNodeMap[currentClientType],
            0,
            currentRow
          );
        } else {
          currentRow.isFirst = true;
          let prevClientType, found;
          for (let i = 0; i < this.clientData.length; i++) {
            let activeClientType = this.clientData[i];
            if (!found) {
              if (activeClientType === currentClientType) {
                found = true;
                if (prevClientType) {
                  this.rootNodeMap[currentClientType] =
                    this.rootNodeMap[prevClientType] + 1;
                  this.tableData.splice(
                    this.rootNodeMap[currentClientType],
                    0,
                    currentRow
                  );
                } else {
                  this.rootNodeMap[currentClientType] = 0;
                  this.tableData.unshift(currentRow);
                }
              } else {
                if (
                  !this.$utilStr.isEmpty(this.rootNodeMap[activeClientType])
                ) {
                  prevClientType = activeClientType;
                }
              }
            } else {
              if (!this.$utilStr.isEmpty(this.rootNodeMap[activeClientType])) {
                this.rootNodeMap[activeClientType]++;
              }
            }
          }
        }
      }
    },
    // 更新行
    updateCurrentRow(row) {
      this.currentRow.name = row.name;
      this.currentRow.clientType = row.clientTypeValue;
      this.currentRow.clientTypeKey = row.clientType;
      this.currentRow.isNavigation = row.isNavigationValue;
      this.currentRow.isNavigationKey = row.isNavigation;
      this.currentRow.url = row.url;
      this.currentRow.icon = row.icon;
      this.currentRow.pageElementList = row.pageElementList;
      this.currentRow.updateTime = this.$utilDate.toString(new Date());
      if (row.type === this.$global.dictItem.menuType.branchNode) {
        if (!this.currentRow.hasChildren) {
          this.currentRow.hasChildren = true;
        }
      } else {
        if (this.currentRow.hasChildren) {
          this.currentRow.hasChildren = false;
        }
      }
    },
    // 删除行
    deleteRow(row) {
      if (row.parentId) {
        let parentNode =
          this.$refs.tableRef.store.states.lazyTreeNodeMap[row.parentId];
        let currentIndex = parentNode.findIndex((e) => e.id === row.id);
        if (parentNode[currentIndex].isFirst) {
          if (parentNode[currentIndex + 1])
            parentNode[currentIndex + 1].isFirst = true;
        }
        if (parentNode[currentIndex].isLast) {
          if (parentNode[currentIndex - 1])
            parentNode[currentIndex - 1].isLast = true;
        }
        parentNode.splice(currentIndex, 1);
      } else {
        let currentIndex = this.tableData.findIndex((e) => e.id === row.id);
        let currentClientTableData = this.tableData.filter(
          (e) => e.clientTypeKey === row.clientTypeKey
        );
        let currentClientIndex = currentClientTableData.findIndex(
          (e) => e.id === row.id
        );
        let currentPrevId, currentNextId;
        if (currentClientTableData[currentClientIndex - 1])
          currentPrevId = currentClientTableData[currentClientIndex - 1].id;
        if (currentClientTableData[currentClientIndex + 1])
          currentNextId = currentClientTableData[currentClientIndex + 1].id;
        if (this.tableData[currentIndex].isFirst) {
          if (currentNextId) {
            let currentNextIndex = this.tableData.findIndex(
              (e) => e.id === currentNextId
            );
            this.tableData[currentNextIndex].isFirst = true;
          }
        }
        if (this.tableData[currentIndex].isLast) {
          if (currentPrevId) {
            let currentPrevIndex = this.tableData.findIndex(
              (e) => e.id === currentPrevId
            );
            this.tableData[currentPrevIndex].isLast = true;
          }
        }
        this.tableData.splice(currentIndex, 1);
        this.rootNodeMap[row.clientTypeKey]--;
      }
    },
    // 重新排序
    reorderRow(row, upOrDown) {
      if (row.parentId) {
        let parentNode =
          this.$refs.tableRef.store.states.lazyTreeNodeMap[row.parentId];
        let currentIndex = parentNode.findIndex((e) => e.id === row.id);
        let targetIndex;
        if (upOrDown) {
          targetIndex = currentIndex - 1;
        } else {
          targetIndex = currentIndex + 1;
        }
        parentNode[currentIndex] = parentNode.splice(
          targetIndex,
          1,
          parentNode[currentIndex]
        )[0];
        if (upOrDown) {
          if (parentNode[currentIndex].isFirst) {
            parentNode[currentIndex].isFirst = false;
            parentNode[targetIndex].isFirst = true;
          }
          if (parentNode[targetIndex].isLast) {
            parentNode[targetIndex].isLast = false;
            parentNode[currentIndex].isLast = true;
          }
        } else {
          if (parentNode[targetIndex].isFirst) {
            parentNode[targetIndex].isFirst = false;
            parentNode[currentIndex].isFirst = true;
          }
          if (parentNode[currentIndex].isLast) {
            parentNode[currentIndex].isLast = false;
            parentNode[targetIndex].isLast = true;
          }
        }
      } else {
        let currentIndex = this.tableData.findIndex((e) => e.id === row.id);
        let currentClientTableData = this.tableData.filter(
          (e) => e.clientTypeKey === row.clientTypeKey
        );
        let currentClientIndex = currentClientTableData.findIndex(
          (e) => e.id === row.id
        );
        let targetClientIndex;
        if (upOrDown) {
          targetClientIndex = currentClientIndex - 1;
        } else {
          targetClientIndex = currentClientIndex + 1;
        }
        let targetClientId = currentClientTableData[targetClientIndex].id;
        let targetIndex = this.tableData.findIndex(
          (e) => e.id === targetClientId
        );
        this.tableData[currentIndex] = this.tableData.splice(
          targetIndex,
          1,
          this.tableData[currentIndex]
        )[0];
        if (upOrDown) {
          if (this.tableData[currentIndex].isFirst) {
            this.tableData[currentIndex].isFirst = false;
            this.tableData[targetIndex].isFirst = true;
          }
          if (this.tableData[targetIndex].isLast) {
            this.tableData[targetIndex].isLast = false;
            this.tableData[currentIndex].isLast = true;
          }
        } else {
          if (this.tableData[targetIndex].isFirst) {
            this.tableData[targetIndex].isFirst = false;
            this.tableData[currentIndex].isFirst = true;
          }
          if (this.tableData[currentIndex].isLast) {
            this.tableData[currentIndex].isLast = false;
            this.tableData[targetIndex].isLast = true;
          }
        }
      }
    }
  }
};
</script>

<style scoped></style>
