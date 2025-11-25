<template>
  <el-dialog title="选择表单" :visible.sync="visible" custom-class="hdty-dialog-medium" append-to-body>
    <hd-pane>
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
            <hd-component :model="extendData" ref="componentRef">
              <hd-expand>
                <hd-expand-header>
                  <el-form-item label="表单名称" prop="formTitle">
                    <hd-factor-input
                      prop="formTitleFilterFactor"
                      v-model="queryData.formTitle"
                      :model-contorl.sync="extendData.formTitleFilterFactor"
                      fuzzy="between"
                      placeholder="请输入表单名称"
                    ></hd-factor-input>
                  </el-form-item>
                  <el-form-item label="管辖机构" prop="orgId">
                    <hd-organ v-model="queryData.orgId" placeholder="请选择管辖机构"></hd-organ>
                  </el-form-item>
                </hd-expand-header>
              </hd-expand>
            </hd-component>
          </el-form>
          <hd-button-container>
            <hd-button name="query" type="info" icon="el-icon-search" @click="handleQuery">查询</hd-button>
            <hd-button icon="el-icon-delete" @click="handleClear">清空</hd-button>
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
            height="100%"
          >
            <el-table-column
              fixed
              type="index"
              :index="setIndex"
              label="序号"
              class-name="is-index"
              align="center"
              width="50"
            ></el-table-column>
            <el-table-column fixed label="操作" align="center" width="80">
              <template slot-scope="scope">
                <hd-button-container>
                  <hd-button type="success" @click="handleSelect(scope.$index, scope.row)">选择</hd-button>
                </hd-button-container>
              </template>
            </el-table-column>
            <el-table-column label="预览" align="center" width="50">
              <template slot-scope="scope">
                <el-link
                  :underline="false"
                  type="primary"
                  @click="handlePreview(scope.$index, scope.row)"
                >预览</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="vo.formTitle" label="表单名称" header-align="center" min-width="160"></el-table-column>
            <el-table-column prop="vox.formType" label="表单类型" header-align="center" min-width="120"></el-table-column>
            <el-table-column prop="vo.createUsername" label="创建人" header-align="center" width="160"></el-table-column>
            <el-table-column
              prop="vox.createTime"
              label="创建时间"
              sortable="custom"
              header-align="center"
              width="180"
            ></el-table-column>
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
      </div>
    </hd-pane>
    <div slot="footer" class="hdty-btn-container">
      <el-button type="primary" @click="cancelForm">确 定</el-button>
    </div>

    <new-task-form-preview ref="perviewRef" :isPreview="true"></new-task-form-preview>
  </el-dialog>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { getFormPage } from './../api';
import NewTaskFormPreview from './NewTaskFormPreview';

export default {
  name: 'NewTaskFormSelect',
  provide() {
    return {
      NewTaskFormSelect: this
    };
  },
  mixins: [hdList],
  components: {
    NewTaskFormPreview
  },
  data() {
    return {
      // 查询
      queryData: {
        formTitle: ''
      },
      // 查询扩展
      extendData: {
        formTitleFilterFactor: this.$app.factorOptions.matchOpe.between
      },
      // 表格
      tableData: [],
      // 验证
      rules: {},
      // 行
      row: {
        vo: {},
        vox: {}
      },
      // 显示
      visible: false
    };
  },
  methods: {
    // 加载之前
    beforeLoadForm() {
      this.$nextTick(() => {
        this.pageOptions.current = 1;
        this.pageOptions.size = 10;
        // 重置表单
        this.resetForm();
        // 加载表单
        this.loadList();
      });
    },
    // 获取数据表格
    loadList() {
      let _this = this;
      _this.loading = true;
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.extendData,
        ..._this.pageOptions,
        zxbs: '0' // 默认查有效数据
      };
      // Lambda写法
      getFormPage(dataParams)
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
    // 选择
    handleSelect(index, row) {
      this.$emit('currentChange', row);
      this.visible = false;
    },
    // 预览
    handlePreview(index, row) {
      this.$refs.perviewRef.visible = true;
      this.$refs.perviewRef.row = row;
      this.$refs.perviewRef.beforeLoadForm();
    },
    // 取消
    cancelForm() {
      this.visible = false;
      this.resetForm();
    },
    // 重置
    resetForm() {
      this.handleClear();
      this.tableData = [];
    }
  }
};
</script>

<style scoped>
</style>
