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
        <hd-component
          :model="extendData"
          ref="componentRef">
          <hd-query>
            <el-form-item
              label="缓存key值"
              prop="cacheKeyword">
              <el-input
                v-model="queryData.cacheKeyword"
                placeholder="缓存key值"
                maxlength="255">
              </el-input>
            </el-form-item>
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
          name="clear"
          type="warning"
          icon="el-icon-s-release"
          @click="handleReset">
          清除缓存
        </hd-button>
      </hd-button-container>
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
          width="145">
          <template slot-scope="scope">
            <hd-button-container>
              <hd-button
                name="detail"
                type="success"
                @click="handleDetail(scope.row)">
                详情
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
          prop="redisKey"
          label="缓存key值"
          sortable="custom"
          header-align="center"
          min-width="160">
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
    <cache-detail ref="detailRef"></cache-detail>
  </div>
</template>

<script>
  import {hdList} from '@/utils/util-framework';
  import CacheDetail from './CacheDetail';
  import {deleteCache, deleteOne, page} from '@/api/cache';

  export default {
  name: 'CacheList',
  provide() {
    return {
      hdList: this
    };
  },
  mixins: [hdList],
  components: {
    CacheDetail
  },
  data() {
    return {
      // 查询
      queryData: {},
      // 查询条件
      extendData: {
        inputFilterFactor: ''
      },
      // 表格
      tableData: [],
      // 验证
      rules: {}
    };
  },
  mounted() {
    // 加载数据表格
    this.loadList();
  },
  methods: {
    // 加载数据表格
    loadList() {
      let _this = this;
      if (_this.AUTHORITY_QUERY) {
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.extendData,
          ..._this.queryData,
          ..._this.pageOptions
        };
        // Lambda写法
        page(dataParams).then(response => {
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
    //跳转到详情列表
    handleDetail(row) {
      this.$refs.detailRef.visible = true;
      this.$refs.detailRef.row = row;
      this.$refs.detailRef.loadList();
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
    // 清除缓存
    handleReset(index, row) {
      let _this = this;
      _this.$confirm('确定要清除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.loading = false;
        // Lambda写法
        deleteCache().then(response => {
          // 响应成功回调
          let {success, msg} = response.data;
          if (success) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: msg,
              type: 'success'
            });
          }
        }).catch(error => {
          // 响应错误回调
          console.error(error);
        }).finally(() => {
          _this.loading = false;
        });
      }).catch(() => {});
    },
    // 清空
    handleClear() {
      this.$refs.queryRef.resetFields();
      this.$refs.componentRef.resetFields();
    }
  }
};
</script>
s
