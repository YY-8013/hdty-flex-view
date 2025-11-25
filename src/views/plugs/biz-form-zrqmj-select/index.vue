<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      :placeholder="placeholder"
      suffix-icon="el-icon-more"
      :validate-event="validateEvent"
      :disabled="disabled"
      :clearable="clearable"
      :underline="underline"
      :style="{width:width}"
      elip
      @focus="handleInputFocus"
      @clear="handleInputClear"
    ></el-input>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      custom-class="hdty-dialog-large"
      append-to-body
    >
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <div class="hdty-header">
            <el-form
              :inline="true"
              :model="queryData"
              :rules="rules"
              ref="queryRef"
              @keyup.enter.native="handleQuery"
            >
              <hd-component :model="extendData" ref="componentRef">
                <el-row>
                  <el-form-item label="警员姓名" prop="xm">
                    <el-input v-model="queryData.xm" placeholder="请输入警员姓名" />
                  </el-form-item>
                  <el-form-item label="身份证号" prop="gmsfhm">
                    <el-input v-model="queryData.gmsfhm" placeholder="请输入身份证号" />
                  </el-form-item>
                </el-row>
                <el-row>
                  <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="queryData.telephone" placeholder="请输入联系电话" />
                  </el-form-item>
                  <el-form-item label="所属机构" prop="orgId">
                    <hd-organ
                      v-model="queryData.orgId"
                      :model-text.sync="extendData.orgId"
                      :filterCode="queryOrgId"
                      placeholder="请选择所属机构"
                    ></hd-organ>
                  </el-form-item>
                </el-row>
              </hd-component>
            </el-form>
            <div class="hdty-btn-group">
              <el-button type="info" icon="el-icon-search" @click="handleQuery">查询</el-button>
              <el-button siza="small" icon="el-icon-delete" @click="handleClear">清空</el-button>
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              row-key="id"
              v-loading="formTableLoading"
              :data="tableData"
              @sort-change="handleSortChange"
              border
              fit
              height="100%"
            >
              <el-table-column fixed label="操作" align="center" width="80">
                <template slot-scope="scope">
                  <el-button type="primary" @click="handleChecked(scope.$index, scope.row)">选择</el-button>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                sortable="custom"
                type="index"
                label="序号"
                :index="setIndex"
                align="center"
                width="60"
              ></el-table-column>
              <el-table-column
                prop="vo.xm"
                label="警员姓名"
                sortable="custom"
                align="center"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="vo.gmsfhm"
                label="身份证号"
                sortable="custom"
                align="center"
                width="200"
              ></el-table-column>
              <el-table-column
                prop="vo.telephone"
                label="联系电话"
                sortable="custom"
                align="center"
                width="180"
              ></el-table-column>
              <el-table-column
                prop="vox.orgId"
                label="所属机构"
                sortable="custom"
                align="center"
                min-width="180"
              ></el-table-column>
            </el-table>
          </div>
          <div class="hdty-footer">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="pageOptions.current"
              :page-sizes="pageOptions.sizes"
              :page-size="pageOptions.size"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageOptions.total"
            ></el-pagination>
          </div>
        </div>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <el-button @click="cancelForm">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { hdList } from '@/utils/util-framework';
import { getZrqmjPage, getZdryZrqPage } from './api';
import request from '@/config/axios-init';

export default {
  name: 'Index',
  mixins: [hdList],
  props: {
    prop: String,
    // 选中值
    currentValue: {
      type: [Number, String, Array],
      default: ''
    },
    // 选中文本
    currentText: {
      type: String,
      default: ''
    },
    // 水印
    placeholder: {
      type: String,
      default: '请选择管控民警'
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false
    },
    // 清空
    clearable: {
      type: Boolean,
      default: true
    },
    // 显示边框
    underline: {
      type: Boolean,
      default: true
    },
    // 标题
    title: {
      type: String,
      default: '选择管控民警'
    },
    // 机构
    queryOrgId: {
      type: String,
      default: ''
    },
    // 输入框宽度
    width: {
      type: String,
      default: '100%'
    }
  },
  data() {
    return {
      // 显示Dialog
      visible: false,
      // 校验
      validateEvent: false,
      // 绑定值
      input: this.currentText, // input接收父组件传来的currentText值
      // 查询
      queryData: {
        xm: '',
        gmsfhm: '',
        telephone: '',
        orgId: ''
      },
      // 拓展表单
      extendData: {
        orgId: ''
      },
      // 验证
      rules: {},
      // 数据
      tableData: [],
      formTableLoading: false
    };
  },
  watch: {
    visible: {
      handler(val) {
        if (!val) {
          this.handleValidate();
        }
      },
      immediate: false
    },
    currentValue: {
      handler(val) {
        if (!val) {
          this.input = '';
        }
        this.pageOptions.current = 1;
      },
      immediate: true
    },
    currentText: {
      handler(val) {
        this.input = val;
      },
      immediate: true
    }
  },
  methods: {
    // input获得焦点
    handleInputFocus() {
      this.visible = true;
      this.loadList();
    },
    // 获取数据列表
    loadList() {
      let _this = this;
      _this.formTableLoading = true;
      if (!_this.queryData.orgId) {
        _this.queryData.orgId = _this.queryOrgId;
      }
      // 参数
      let dataParams = {
        ..._this.queryData,
        ..._this.pageOptions
      };
      getZdryZrqPage(dataParams)
        .then((response) => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total || 0;
            _this.tableData = data.records || [];
            _this.extendData.orgId = data.paramOrgName;
            _this.formTableLoading = false;
          }
        })
        .catch((error) => {
          // 响应错误回调
          console.log(error);
        })
        .finally(() => {
          _this.formTableLoading = false;
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
    // input清空
    handleInputClear() {
      this.$emit('input', '');
      this.$emit('currentChanged', {});
      this.handleValidate();
    },
    // input校验
    handleValidate() {
      this.validateEvent = true;
      this.$nextTick(() => {
        this.$refs.inputRef.focus();
        this.visible = false;
        this.$refs.inputRef.blur();
      });
    },
    // 单选
    handleChecked(index, row) {
      this.visible = false;
      this.input = row.vo.xm;
      this.$emit('input', row.vo.xm);
      this.$emit('currentChanged', row);
    },
    // 取消
    cancelForm() {
      this.visible = false;
    }
  }
};
</script>

<style scoped>
</style>
