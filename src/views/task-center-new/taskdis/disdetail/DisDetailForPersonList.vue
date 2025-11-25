<template>
  <el-dialog
    title="处理人员"
    :visible.sync="visible"
    custom-class="hdty-dialog-medium new-form"
    append-to-body
  >
    <hd-pane>
      <div class="hdty-container hdty-flex">
        <div class="hdty-fit">
          <el-table
            class="new-table"
            :data="tableData"
            empty-text="暂无数据"
            row-key="id"
            ref="tableRef"
            border
          >
            <el-table-column
              sortable="custom"
              type="index"
              label="序号"
              :index="setIndex"
              align="center"
              width="60"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="username"
              label="人员姓名"
              align="center"
              min-width="160"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="usergmsfhm"
              label="身份证号"
              align="center"
              min-width="190"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userlxdh"
              label="联系电话"
              align="center"
              min-width="160"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="iswcr"
              label="是否为任务办结人"
              align="center"
              min-width="160"
            >
              <template slot-scope="scope">
                <div class="text-color-5 text-bold" v-if="scope.row.iswcr === '1'">是</div>
                <div class="text-color-1 text-bold" v-else>否</div>
              </template>
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
import { hdList } from '@/utils/util-framework';
import { getSubTaskForPersonList } from './../../api';

export default {
  name: 'DisDetailForPersonList',
  provide() {
    return {
      DisDetailForPersonList: this
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
      row: {}
    };
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
      getSubTaskForPersonList(dataParams)
        .then((response) => {
          // 响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.tableData = data || [];
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
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.tableData = [];
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
