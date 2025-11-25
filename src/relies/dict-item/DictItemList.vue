<template>
  <el-dialog
    :visible.sync="visible"
    title="操作数据字典"
    custom-class="hdty-dialog-large"
    append-to-body>
    <hd-pane>
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
              <el-form-item label="字典key值" prop="key">
                <el-input v-model="queryData.key" placeholder="请输入字典key值" ></el-input>
              </el-form-item>
              <el-form-item label="字典value值" prop="value">
                <el-input v-model="queryData.value" placeholder="请输入字典value值"></el-input>
              </el-form-item>
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
            height="100%">
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
              width="210">
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
                </hd-button-container>
              </template>
            </el-table-column>
            <el-table-column
              prop="typeId"
              label="类型"
              header-align="center"
              min-width="80">
            </el-table-column>
            <el-table-column
              prop="key"
              label="key值"
              header-align="center"
              min-width="100">
            </el-table-column>
            <el-table-column
              prop="value"
              label="value值"
              header-align="center"
              min-width="160">
            </el-table-column>
            <el-table-column
              prop="orderId"
              label="排序"
              sortable="custom"
              header-align="center"
              width="80">
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
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
    <dict-item-add ref="addRef"></dict-item-add>
    <dict-item-detail ref="detailRef"></dict-item-detail>
    <dict-item-edit ref="editRef"></dict-item-edit>
  </el-dialog>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { deleteOne, exports, getPage } from '@/api/dict-item';
  import DictItemAdd from './DictItemAdd';
  import DictItemDetail from './DictItemDetail';
  import DictItemEdit from './DictItemEdit';
  export default {
    name: "DictItemList",
    components: {
      DictItemAdd,
      DictItemDetail,
      DictItemEdit
    },
    provide() {
      return {
        hdList: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList],
    data() {
      return{
        // 查询
        queryData: {
          key: '',
          value: '',
          typeId: ''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {},
        // 行
        row: {},
        // 显示
        visible: false
      }
    },
    methods: {
      // 获取数据表格
      loadList() {
        let _this = this;
        _this.loading = true;
        if (_this.queryData.typeId !== _this.row.key) {
          _this.pageOptions.current = 1;
          _this.$nextTick(() => {
            _this.handleClear();
          });
        }
        _this.queryData.typeId = _this.row.key;
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
        }).finally(() =>{
          _this.$refs.tableRef.doLayout();
          _this.loading = false;
        });
      },
      // 查询
      handleQuery(){
        let _this = this;
        _this.$refs.queryRef.validate((valid) => {
          if (valid) {
            _this.pageOptions.current = 1;
            _this.loadList();
          }
        });
      },
      // 清空
      handleClear(){
        this.$refs.queryRef.resetFields();
      },
      // 新增
      handleAdd(){
        this.$refs.addRef.visible = true;
        this.$refs.addRef.addData.typeId = this.queryData.typeId;
        this.$refs.addRef.beforeLoadForm();
      },
      // 导出
      handleExport(){
        let _this = this;
        if (_this.validateExport()) {
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
      handleDetail(index, row){
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row){
        this.$refs.editRef.visible = true;
        this.$refs.editRef.row = row;
        this.$refs.editRef.beforeLoadForm();
      },
      // 删除
      handleDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let dataParams = {
            id: row.id
          };
          // Lambda写法
          deleteOne(dataParams).then(response => {
            // 响应成功回调
            let { success, msg } =response.data;
            if (success) {
              this.$message({
                showClose: true,
                customClass: 'is-fixed',
                message: msg,
                type: 'success'
              });
              // 删除成功刷新列表
              _this.triggerDeletedReload();
              _this.hdList.loadList();
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
      // 取消
      cancelForm() {
        this.handleClear();
        this.visible = false;
        this.hdList.loadList();
      }
    }
  }
</script>

<style scoped>

</style>
