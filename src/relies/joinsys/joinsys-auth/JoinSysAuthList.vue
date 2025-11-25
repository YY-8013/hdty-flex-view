<template>
  <div class="hdty-container hdty-flex">
    <div class="hdty-header">
      <el-form
        :model="queryData"
        :rules="rules"
        ref="queryRef"
        inline
        @keyup.enter.native="handleQuery">
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <hd-query-fixed>
              <el-form-item label="系统名称" prop="systemName">
                <hd-factor-input
                  prop="systemNameFilterFactor"
                  v-model="queryData.systemName"
                  :model-control.sync="extendData.systemNameFilterFactor"
                  placeholder="请输入查询条件">
                </hd-factor-input>
              </el-form-item>
              <el-form-item prop="andor" slot="after">
                <hd-factor-logic v-model="queryData.andor" :currentValue="queryData.andor"></hd-factor-logic>
              </el-form-item>
            </hd-query-fixed>
            <hd-query-expand>
              <el-row>
                <el-form-item label="公司名称" prop="companyName">
                  <hd-factor-input
                    prop="companyNameFilterFactor"
                    v-model="queryData.companyName"
                    :model-control.sync="extendData.companyNameFilterFactor"
                    placeholder="请输入查询条件">
                  </hd-factor-input>
                </el-form-item>
                <el-form-item label="负 责 人" prop="dutyPerson">
                  <hd-factor-input
                    prop="dutyPersonFilterFactor"
                    v-model="queryData.dutyPerson"
                    :model-control.sync="extendData.dutyPersonFilterFactor"
                    placeholder="请输入查询条件">
                  </hd-factor-input>
                </el-form-item>
              </el-row>
              <el-row>
                <el-form-item label="添 加 人" prop="createUsername">
                  <hd-factor-input
                    prop="createUserNameFilterFactor"
                    v-model="queryData.createUsername"
                    :model-control.sync="extendData.createUsernameFilterFactor"
                    placeholder="请输入查询条件">
                  </hd-factor-input>
                </el-form-item>
                <el-form-item label="添加时间" prop="createTime">
                  <hd-date-picker type="datetimerange" v-model="queryData.createTime"></hd-date-picker>
                </el-form-item>
              </el-row>
            </hd-query-expand>
          </hd-query>
        </hd-component>
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
        row-key="vo.id"
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
          prop="vo.systemName"
          label="系统名称"
          sortable="custom"
          header-align="center"
          min-width="190">
        </el-table-column>
        <el-table-column
          prop="vo.systemAppid"
          label="系统AppId"
          sortable="custom"
          header-align="center"
          min-width="190">
        </el-table-column>
        <el-table-column
          prop="vo.companyName"
          label="所属企业"
          sortable="custom"
          header-align="center"
          min-width="190">
        </el-table-column>
        <el-table-column
          prop="vo.dutyPerson"
          label="负责人"
          sortable="custom"
          header-align="center"
          min-width="100">
        </el-table-column>
        <el-table-column
          prop="vo.dutyPhone"
          label="联系电话"
          sortable="custom"
          header-align="center"
          min-width="110">
        </el-table-column>
        <el-table-column
          prop="vox.enabled"
          label="开启授权"
          sortable="custom"
          header-align="center"
          width="110">
        </el-table-column>
        <el-table-column
          prop="vo.createTime"
          label="添加时间"
          sortable="custom"
          header-align="center"
          min-width="180">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span v-html="formatDatetime(scope.row.vo.createTime)"></span>
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
    <join-sys-auth-add ref="addRef"></join-sys-auth-add>
    <join-sys-auth-detail ref="detailRef"></join-sys-auth-detail>
    <join-sys-auth-edit ref="editRef"></join-sys-auth-edit>
  </div>
</template>

<script>
  import { hdList } from "@/utils/util-framework";
  import { exports, page, singleDelete } from '@/api/joinsys-auth';
  import JoinSysAuthAdd from './JoinSysAuthAdd';
  import JoinSysAuthDetail from './JoinSysAuthDetail';
  import JoinSysAuthEdit from './JoinSysAuthEdit';

  export default {
    name: "JoinSysAuthList",
    components: {
      JoinSysAuthAdd,
      JoinSysAuthDetail,
      JoinSysAuthEdit
    },
    provide() {
      return {
        hdList: this
      };
    },
    mixins:[hdList],
    data() {
      return {
        // 查询
        queryData: {
          systemName: '',
          companyName: '',
          dutyPerson: '',
          createUsername: '',
          createTime: [],
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询条件
        extendData: {
          systemNameFilterFactor: '',
          companyNameFilterFactor: '',
          dutyPersonFilterFactor: '',
          createUsernameFilterFactor: '',
        },
        // 表格
        tableData: [],
        // 验证
        rules: {

        },
      }
    },
    mounted() {
      // 加载数据表格
      this.loadList();
    },
    methods: {
      // 加载数据表格
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.extendData,
          ..._this.pageOptions
        };
        // Lambda写法
        page(dataParams).then(response => {
          //响应成功回调
          let { success, data } = response.data;
          if(success){
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
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
        this.$refs.componentRef.resetFields();
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
          type: 'warning',
        }).then(() => {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          singleDelete(dataParams).then(response => {
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
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          });
        }).catch(() => {});
      },
    }
  }
</script>
