<template>
  <el-dialog title="操作记录" :visible.sync="visible" custom-class="hdty-dialog-large" append-to-body>
    <hd-pane>
      <div class="hdty-container hdty-flex">
        <div class="hdty-header">
          <el-form :model="queryData" :rules="rules" ref="queryRef" inline @submit.native.prevent @keyup.enter.native="handleQuery">
            <hd-component :model="extendData" ref="componentRef">
              <hd-query>
                <hd-query-fixed>
                  <el-form-item label="执行内容" prop="message">
                    <el-input v-model="queryData.message" placeholder="请输入执行内容" maxlength="500" ></el-input>
                  </el-form-item>
                  <el-form-item label="执 行 人" prop="createUsername">
                    <el-input v-model="queryData.createUsername" placeholder="请输入执行人" maxlength="32" ></el-input>
                  </el-form-item>
                </hd-query-fixed>
                <hd-query-expand>
                  <el-row>
                    <el-form-item label="执行时间" prop="createTime">
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
              prop="vo.message"
              label="执行内容"
              sortable="custom"
              header-align="center"
              min-width="400">
            </el-table-column>
            <el-table-column
              prop="vo.createUsername"
              label="执行人"
              sortable="custom"
              header-align="center"
              width="150">
            </el-table-column>
            <el-table-column
              prop="vo.createTime"
              label="执行时间"
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
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { hdList } from '@/utils/util-framework';
  import { getRecord } from '@/api/delrule';
  export default {
    name: 'DelRuleRecord',
    provide() {
      return {
        hdList: this
      };
    },
    inject: ['hdList'],
    mixins: [hdList],
    data() {
      return {
        // 查询
        queryData: {
          id: '',
          delRuleId: '',
          message: '',
          createUsername: '',
          createTime: [],
          updateUserId: '',
          updateTime: '',
          andor: this.$app.factorOptions.logicOpe.and
        },
        // 查询条件
        extendData: {
          inputFilterFactor: ''
        },
        // 表格
        tableData: [],
        // 验证
        rules: {},
        // 行
        row: {},
        // 显示
        visible: false
      };
    },
    methods: {
      // 加载数据表格
      loadList() {
        let _this = this;
        if (_this.AUTHORITY_QUERY) {
          _this.loading = true;
          if (_this.queryData.delRuleId !== _this.row.vo.id) {
            _this.pageOptions.current = 1;
            _this.$nextTick(() => {
              _this.handleClear();
            });
          }
          _this.queryData.delRuleId = _this.row.vo.id;
          // 参数
          let dataParams = {
            ..._this.extendData,
            ..._this.queryData,
            ..._this.pageOptions
          };
          // Lambda写法
          getRecord(dataParams).then(response => {
            //响应成功回调
            let { success, data } = response.data;
            if (success) {
              _this.pageOptions.total = data.total;
              _this.tableData = data.records;
            }
          }).catch(error => {
            // 响应错误回调
            console.error(error);
          }).finally(() => {
            _this.loading = false;
          });
        }
      },
      // 查询
      handleQuery() {
        let _this = this;
        _this.$refs.queryRef.validate(valid => {
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
      // 取消
      cancelForm() {
        this.handleClear();
        this.visible = false;
        this.hdList.loadList();
      }
    }
  };
</script>
