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
            <el-form-item label="地区编码" prop="id">
              <el-input v-model="queryData.id" placeholder="请输入地区编码"></el-input>
            </el-form-item>
            <el-form-item label="地区全称" prop="nameAll">
              <el-input v-model="queryData.nameAll" placeholder="请输入地区全称"></el-input>
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-row>
              <el-form-item label="上级地区" prop="parentId">
                <hd-region v-model="queryData.parentId" placeholder="请选择上级地区" :filterCity="false"></hd-region>
              </el-form-item>
            </el-row>
          </hd-query-expand>
        </hd-query>
      </el-form>
      <hd-button-container>
        <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
        <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd"
        >新增</hd-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-upload2"
          :loading="exporting"
          @click="handleExport"
        >导出</hd-button>
        <hd-button name="sync" type="success" icon="icon-sync" @click="handleSyncData">同步资源库</hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="vo.id"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%"
      >
        <el-table-column fixed type="selection" reserve-selection align="center" width="50"></el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50"
        ></el-table-column>
        <el-table-column fixed label="操作" align="center" width="210">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row.vo)"
              >详情</hd-button>
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row.vo)"
              >编辑</hd-button>
              <hd-button
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row.vo)"
              >删除</hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="vo.id"
          label="地区编码"
          header-align="center"
          sortable="custom"
          width="150"
        ></el-table-column>
        <el-table-column
          prop="vo.name"
          label="地区简称"
          header-align="center"
          sortable="custom"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="vo.nameAll"
          label="地区全称"
          header-align="center"
          sortable="vo.custom"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="vox.parentId"
          label="上级地区"
          sortable="custom"
          header-align="center"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="vo.updateTime"
          label="更新时间"
          header-align="center"
          sortable="custom"
          min-width="180"
        >
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.updateTime)"></span>
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
    <region-add ref="addRef"></region-add>
    <region-detail ref="detailRef"></region-detail>
    <region-edit ref="editRef"></region-edit>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { deleteRegion, exports, getRegionList, syncData } from '@/api/region';
import RegionAdd from './RegionAdd';
import RegionDetail from './RegionDetail';
import RegionEdit from './RegionEdit';
export default {
  name: 'RegionList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    RegionAdd,
    RegionDetail,
    RegionEdit
  },
  data() {
    return {
      // 查询
      queryData: {
        addtime: '',
        account: ''
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
          ..._this.pageOptions
        };
        // Lambda写法
        getRegionList(dataParams)
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
    // 导出
    handleExport() {
      let _this = this;
      if (_this.validateExport()) {
        _this.exporting = true;
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
    // 删除
    handleDelete(index, row) {
      let _this = this;
      _this
        .$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          let dataParams = {
            id: row.id
          };
          // Lambda写法
          deleteRegion(dataParams)
            .then((response) => {
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
            })
            .catch((error) => {
              // 响应错误回调
              console.error(error);
            });
        })
        .catch(() => {});
    },
    // 同步远程资源库数据
    handleSyncData() {
      let _this = this;
      _this
        .$confirm('确定要同步远程资源数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          _this.loading = true;
          syncData()
            .then((response) => {
              // 响应成功回调
              let { success, data, msg } = response.data;
              if (success) {
                _this.$message({
                  showClose: true,
                  customClass: 'is-fixed',
                  message: msg + ':' + data.syncSuccessCount,
                  type: 'success'
                });
                // 删除成功刷新列表
                _this.handleQuery();
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
    }
  }
};
</script>
