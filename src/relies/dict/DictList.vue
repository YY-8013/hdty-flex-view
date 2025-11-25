<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @submit.native.prevent
        @keyup.enter.native="handleQuery">
        <hd-query>
          <hd-query-fixed>
            <el-form-item label="字典编码" prop="key">
              <el-input v-model="queryData.key" placeholder="请输入字典编码"></el-input>
            </el-form-item>
            <el-form-item label="字典名称" prop="value">
              <el-input v-model="queryData.value" placeholder="请输入字典名称"></el-input>
            </el-form-item>
          </hd-query-fixed>
          <hd-query-expand>
            <el-row>
              <el-form-item label="添加时间" prop="createTime">
                <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
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
          @click="handleQuery">
          查询
        </hd-button>
        <hd-button
          icon="el-icon-delete"
          @click="handleClear">
          清空
        </hd-button>
        <hd-button
          name="add"
          type="success"
          icon="el-icon-circle-plus-outline"
          @click="handleAdd">
          新增
        </hd-button>
        <hd-button
          name="export"
          type="warning"
          icon="el-icon-upload2"
          :loading="exporting"
          @click="handleExport">
          导出
        </hd-button>
        <hd-button
          name="sync"
          type="success"
          icon="icon-sync"
          @click="handleSyncData">
          同步资源库
        </hd-button>
        <hd-button
          name="sync"
          type="warning"
          icon="icon-sync"
          @click="handleSyncOne">
          同步单个字典
        </hd-button>
      </hd-button-container>
    </div>
    <div class="hdty-fit">
      <el-table
        :data="tableData"
        :empty-text="emptyText"
        row-key="key"
        ref="tableRef"
        v-loading="loading"
        @sort-change="handleSortChange"
        border
        fit
        height="100%">
        <el-table-column
          fixed
          type="selection"
          reserve-selection
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          type="index"
          :index="setIndex"
          label="序号"
          class-name="is-index"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          fixed
          label="操作"
          align="center"
          width="280">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.$index, scope.row)">
                详情
              </hd-button>
              <hd-button
                name="edit"
                type="primary"
                @click="handleEdit(scope.$index, scope.row)">
                编辑
              </hd-button>
              <hd-button
                name="delete"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">
                删除
              </hd-button>
              <hd-button
                name="sync"
                type="warning"
                @click="handleSyncOne(scope.$index, scope.row)">
                同步
              </hd-button>
            </hd-button-container>
          </template>
        </el-table-column>
        <el-table-column
          prop="dictionary"
          label="字典项"
          header-align="center"
          align="center"
          width="65">
          <template slot-scope="scope">
            <a href="javascript:;" underline @click="handleItem(scope.row)">
              <el-tag type="success">
                {{ scope.row.dictionary }}
              </el-tag>
            </a>
          </template>
        </el-table-column>
        <el-table-column
          prop="key"
          label="字典编码"
          sortable="custom"
          header-align="center"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="value"
          label="字典名称"
          header-align="center"
          min-width="160">
        </el-table-column>
        <el-table-column
          prop="memo"
          label="备注"
          header-align="center"
          min-width="300">
        </el-table-column>
        <el-table-column
          prop="createTime"
          sortable="custom"
          label="添加时间"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.createTime)"></span>
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
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
    <dict-add ref="addRef"></dict-add>
    <dict-detail ref="detailRef"></dict-detail>
    <dict-edit ref="editRef"></dict-edit>
    <dict-item-list ref="itemListRef"></dict-item-list>
  </div>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { deleteOne, exports, getPage, syncData, syncOne } from '@/api/dict';
  import DictAdd from './DictAdd';
  import DictDetail from './DictDetail';
  import DictEdit from './DictEdit'
  import DictItemList from '../dict-item/DictItemList'
  export default {
    name: "DictList",
    provide() {
      return {
        hdList: this
      };
    },
    mixins: [hdList],
    components: {
      DictAdd,
      DictDetail,
      DictEdit,
      DictItemList
    },
    data() {
      return {
        // 查询
        queryData: {
          createTime: [],
          key:'',
          value:''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {}
      }
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
          getPage(dataParams).then(response => {
            // 响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
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
          exports(dataParams).then(response => {
            // 响应成功回调
            _this.download(response);
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
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
        _this.$confirm('确定要删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // Lambda写法
          let dataParams = {
            id: row.key
          };
          deleteOne(dataParams).then(response => {
            // 响应成功回调
            let { success, msg } = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success',
              });
              // 删除成功刷新列表
              _this.triggerDeletedReload();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 跳转到字典项
      handleItem(row) {
        this.$refs.itemListRef.visible = true;
        this.$refs.itemListRef.row = row;
        this.$refs.itemListRef.loadList();
      },
      // 同步远程资源库数据
      handleSyncData() {
        let _this = this;
        _this.$confirm('确定要同步远程资源数据吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.loading = true;
          syncData().then(response => {
            // 响应成功回调
            let {success, data, msg} = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg + '，字典类型：' + data.syncSuccessDicTypeCount+ '，字典项：' + data.syncSuccessDicCount,
                type: 'success'
              });
              // 删除成功刷新列表
              _this.handleQuery();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.loading = false;
          });
        }).catch(() => {});
      },
      // 同步远程资源库数据-单个字典
      handleSyncOne(index, row){
        let _this = this;

        _this.$prompt('请输入待同步字典编码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^[A-Za-z0-9]+$/,
          inputErrorMessage: '待同步字典编码格式不正确',
          inputPlaceholder: '请输入待同步字典编码',
          inputValue: row && row.key ? row.key : null,
        })
        .then(({ value }) => {

          _this.loading = true;
          // 参数
          let dataParams = {
            id: value
          };
          syncOne(dataParams).then(response => {
            // 响应成功回调
            let {success, data, msg} = response.data;
            if (success) {
              _this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg + '，字典类型：' + data.syncSuccessDicTypeCount+ '，字典项：' + data.syncSuccessDicCount,
                type: 'success'
              });
              // 删除成功刷新列表
              _this.handleQuery();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.loading = false;
          });
          
        })
        .catch((error) => {
             
        });
      },
    }
  }
</script>
