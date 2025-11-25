<!--只有民警变更模块中的“民警变更”功能使用-->
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
      elip
      @focus="handleInputFocus"
      @clear="handleInputClear">
    </el-input>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      custom-class="hdty-dialog-large"
      append-to-body>
      <hd-pane>
        <div class="hdty-container hdty-flex">
          <div class="hdty-header">
            <el-form
              :inline="true"
              :model="queryData"
              :rules="rules"
              ref="queryRef"
              @keyup.enter.native="handleQuery">
              <hd-expand>
                <hd-expand-header>
                  <el-form-item label="民警姓名" prop="xm">
                    <el-input v-model="queryData.xm" placeholder="请输入民警姓名"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话" prop="telephone">
                    <el-input v-model="queryData.telephone" placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </hd-expand-header>
                <hd-expand-body>
                  <el-row>
                    <el-form-item label="身份证号" prop="gmsfhm">
                      <el-input v-model="queryData.gmsfhm" placeholder="请输入民警身份证号"></el-input>
                    </el-form-item>
                  </el-row>
                </hd-expand-body>
              </hd-expand>
              
            </el-form>
            <div class="hdty-btn-group">
              <el-button
                type="info"
                icon="el-icon-search"
                @click="handleQuery">
                查询
              </el-button>
              <el-button
                siza="small"
                icon="el-icon-delete"
                @click="handleClear">
                清空
              </el-button>
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              row-key="id"
              v-loading="triggerLoading"
              :data="tableData"
              @sort-change="handleSortChange"
              border
              fit
              height="100%">
              <el-table-column
                fixed
                label="操作"
                align="center"
                width="80">
                <template slot-scope="scope">
                  <el-button
                    type="primary"
                    @click="handleChecked(scope.$index, scope.row)">
                    选择
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                sortable="custom"
                type="index"
                label="序号"
                :index="setIndex"
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                prop="vo.xm"
                label="民警姓名"
                sortable="custom"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="vo.gmsfhm"
                label="身份证号"
                sortable="custom"
                align="center"
                width="200">
              </el-table-column>
              <el-table-column
                prop="vo.telephone"
                label="联系电话"
                sortable="custom"
                align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="vox.orgId"
                label="所属机构"
                sortable="custom"
                align="center"
                min-width="180">
              </el-table-column>
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
              :total="pageOptions.total">
            </el-pagination>
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
  import {hdList} from '../../../utils/util-framework';
  import {getZrqmjPage} from './api';

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
        default: '请选择民警'
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
        default: true,
      },
      // 显示边框
      underline: {
        type: Boolean,
        default: true
      },
      // 标题
      title: {
        type: String,
        default: '选择民警',
      },
      // 机构
      queryOrgId: {
        type: String,
        default: '',
      },
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
          orgId: this.queryOrgId,
        },
        // 验证
        rules: {},
        // 数据
        tableData: []
      }
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
        _this.triggerLoading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.pageOptions
        };
        getZrqmjPage(dataParams).then(response => {
          //响应成功回调
          let { success, data } = response.data;
          if (success) {
            _this.pageOptions.total = data.total;
            _this.tableData = data.records;
          }
        }).catch(error => {
          // 响应错误回调
          console.log(error);
        }).finally(() => {
          _this.triggerLoading = false;
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
        this.input = row.vo.xm + ' - ' + row.vo.gmsfhm + ' - ' + row.vo.telephone;
        this.$emit('input', row.vo.xm + ' - ' + row.vo.gmsfhm + ' - ' + row.vo.telephone);
        this.$emit('currentChanged', row);
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
      // 获取路由参数追加查询条件
      setQuery(obj) {
        // 重写该方法，目的是不拼接路由参数
      },
    }
  }
</script>

<style scoped>

</style>
