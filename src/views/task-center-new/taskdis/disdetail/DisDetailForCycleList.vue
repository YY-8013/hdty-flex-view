<template>
  <el-dialog
    title="周期明细"
    :visible.sync="visible"
    custom-class="hdty-dialog-large new-form"
    append-to-body>
    <hd-pane >
      <div class="hdty-container hdty-flex">
        <div class="hdty-fit">
          <el-table
            class="new-table"
            :data="tableData"
            empty-text="暂无数据"
            row-key="id"
            ref="tableRef"
            border>
            <el-table-column
              fixed
              sortable="custom"
              type="index"
              label="序号"
              :index="setIndex"
              align="center"
              width="60">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jjrdate"
              label="任务周期"
              align="center"
              min-width="160">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="rwsfcq"
              label="是否超期"
              align="center"
              width="120">
              <template slot-scope="scope">
                <div class="text-color-1" v-if="scope.row.rwsfcq === '1'">
                  是
                </div>
                <div class="text-color-5" v-else>
                  否
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="rwyqsj"
              label="超期时长"
              align="center"
              min-width="200">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="iswc"
              label="是否完成"
              align="center"
              width="120">
              <template slot-scope="scope">
                <div class="text-color-5" v-if="scope.row.iswc === 1">
                  是
                </div>
                <div class="text-color-1" v-else>
                  否
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userwcsj"
              label="完成时间"
              align="center"
              min-width="190">
              <template slot-scope="scope">
                <span v-html="formatDatetime(scope.row.userwcsj)"></span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userrwname"
              label="完成人"
              align="center"
              min-width="160">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </hd-pane>
    <span slot="footer" class="hdty-dialog-footer">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import {getSubTaskForCycleList} from './../../api';

  export default {
    name: 'DisDetailForCycleList',
    provide() {
      return {
        DisDetailForCycleList: this
      };
    },
    mixins: [hdList],
    components: {},
    data() {
      return {
        // 表格
        tableData: [],
        // 显示
        visible: false,
        // 行
        row: {},
      }
    },
    methods: {
      // 初始化执行的方法
      beforeLoadForm() {
        this.$nextTick(() => {
          // 清空表单
          this.resetForm();
          // 加载表单
          this.loadList();
        });
      },
      // 加载数据表格
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          id: _this.row.id
        };
        // Lambda写法
        getSubTaskForCycleList(dataParams).then(response => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.tableData = data || [];
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      },
      // 取消
      cancelForm() {
        this.visible = false;
        this.resetForm();
      },
      // 重置
      resetForm() {
        this.tableData = [];
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
