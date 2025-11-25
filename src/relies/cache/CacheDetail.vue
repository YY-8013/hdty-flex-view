<template>
  <el-dialog
    title="缓存详情"
    :visible.sync="visible"
    custom-class="hdty-dialog-large"
    append-to-body>
    <hd-pane>
      <div class="hdty-container hdty-flex">
        <div class="hdty-header">
        </div>
        <div class="hdty-fit">
          <el-table
            :data="tableData"
            :empty-text="emptyText"
            row-key="redisKey"
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
                    name="delete"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                    删除
                  </hd-button>
                </hd-button-container>
              </template>
            </el-table-column>
            <el-table-column
              prop="redisKey"
              label="缓存key值"
              sortable="custom"
              header-align="center"
              min-width="400">
            </el-table-column>
            <el-table-column
              prop="redisValue"
              label="缓存值"
              sortable="custom"
              header-align="center"
              min-width="400">
             <template slot-scope="scope">
                <el-popover
                  placement="top-start"
                  width="400"
                  trigger="hover" >
                  <el-input
                    type="textarea"
                    v-model="scope.row.redisValue"
                    :rows="10">
                  </el-input>
                  <span slot="reference">
                    {{scope.row.redisValue.substr(0,50)+'...' }}
                  </span>
                </el-popover>
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
  </el-dialog>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { detailPage,deleteOne } from '@/api/cache';
export default {
  name: 'CacheDetail',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {},
  data() {
    return {
      // 查询
      queryData: {keyword:''},
      // 查询条件
      extendData: {
        inputFilterFactor: ''
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 显示
      visible: false
    };
  },
  beforeLoadForm() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        if (_this.queryData.keyword !== _this.row.redisKey) {
          _this.pageOptions.current = 1;
          _this.$nextTick(() => {
            _this.handleClear();
          });
        }
        _this.queryData.keyword = _this.row.redisKey;
        // 参数
        let dataParams = {
          ..._this.extendData,
          ..._this.queryData,
          ..._this.pageOptions
        };
        // Lambda写法
        detailPage(dataParams).then(response => {
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
          // Lambda写法
          let dataParams = {
            redisKey: row.redisKey
          };
          deleteOne(dataParams)
            .then(response => {
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
            .catch(error => {
              // 响应错误回调
              console.error(error);
            });
        });
    },
    // 清空
    handleClear() {
      // this.$refs.queryRef.resetFields();
      // this.$refs.componentRef.resetFields();
    }
  }
};
</script>
s
