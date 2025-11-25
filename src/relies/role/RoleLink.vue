<template>
  <el-dialog
    title="用户角色列表"
    :visible.sync="visible"
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
              <el-form-item label="角 色 名" prop="name">
                <el-input v-model="queryData.name" placeholder="请输入角色名"></el-input>
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
              width="80">
              <template slot-scope="scope">
                <hd-button-container>
                  <hd-button
                    name="detail"
                    type="success"
                    @click="handleDetail(scope.$index, scope.row)">
                    详情
                  </hd-button>
                </hd-button-container>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="角色名"
              sortable="custom"
              header-align="center"
              width="180">
            </el-table-column>
            <el-table-column
              prop="clientTypeList"
              label="客户端"
              sortable="custom"
              header-align="center"
              min-width="140">
            </el-table-column>
            <el-table-column
              prop="memo"
              label="描述"
              sortable="custom"
              header-align="center"
              min-width="260">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              sortable="custom"
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
    <role-detail ref="detailRef"></role-detail>
  </el-dialog>
</template>

<script>
  import { hdList } from "@/utils/util-framework";
  import { getUserRolePage } from '@/api/role';
  import RoleDetail from './RoleDetail';
  export default {
    name: "RoleLink",
    provide() {
      return {
        hdList: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList],
    components: {
      RoleDetail
    },
    data() {
      return {
        // 查询
        queryData: {
          name: ''
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
        if (_this.queryData.userId !== _this.row.vo.id) {
          _this.pageOptions.current = 1;
          _this.$nextTick(() => {
            _this.handleClear();
          });
        }
        _this.queryData.userId = _this.row.vo.id;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.pageOptions
        };
        // Lambda写法
        getUserRolePage(dataParams).then(response => {
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
      // 详情
      handleDetail(index, row) {
        this.$refs.detailRef.visible = true;
        this.$refs.detailRef.row = row;
        this.$refs.detailRef.beforeLoadForm();
      },
      // 取消
      cancelForm() {
        this.handleClear();
        this.visible = false;
      }
    }
  }
</script>
