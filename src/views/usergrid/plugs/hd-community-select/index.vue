<template>
  <div>
    <el-input
      ref="inputRef"
      v-model="input"
      :placeholder="placeholder"
      suffix-icon="el-icon-more"
      :disabled="disabled"
      :clearable="clearable"
      :underline="underline"
      elip
      @focus="handleInputFocus"
      @clear="handleInputClear">
    </el-input>
    <el-dialog
      :title="'选择' + title"
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
              size="small"
              @submit.native.prevent
              @keyup.enter.native="handleQuery">
              <hd-component
                :model="factorData"
                ref="componentRef">
                <hd-expand>
                  <hd-expand-header>
                    <el-form-item :label="title + '名称'" prop="sqjcwhmc">
                      <hd-factor-input
                        style="width: 225px;"
                        prop="sqjcwhmcFilterFactor"
                        fuzzy="between"
                        v-model="queryData.sqjcwhmc"
                        :model-control.sync="factorData.sqjcwhmcFilterFactor"
                        :placeholder="'请输入' + title + '名称'">
                      </hd-factor-input>
                    </el-form-item>
                    <el-form-item :label="title + '代码'" prop="sqjcwhdm">
                      <hd-factor-input
                        style="width: 225px;"
                        prop="sqjcwhdmFilterFactor"
                        fuzzy="between"
                        v-model="queryData.sqjcwhdm"
                        :model-control.sync="factorData.sqjcwhdmFilterFactor"
                        :placeholder="'请输入' + title + '代码'">
                      </hd-factor-input>
                    </el-form-item>
                  </hd-expand-header>
                  <hd-expand-body>
                    <el-row>
                      <el-form-item :label="title + '类型'" prop="dzyslxdm">
                        <hd-dict-select
                          v-model="queryData.dzyslxdm"
                          :dictCode="$global.dictType.addressType"
                          :remove-option="['21', '22', '23','41','42','43','44','45','50','60','70','80']"
                          filterable
                          multiple
                          :placeholder="'请输入' + title + '类型'">
                        </hd-dict-select>
                      </el-form-item>
                      <el-form-item label="行政区域" prop="ssxqbm">
                        <hd-region
                          v-model="queryData.ssxqbm"
                          placeholder="请选择行政区域">
                        </hd-region>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-form-item label="登记时间" prop="djsj">
                        <hd-date-picker
                          v-model="queryData.djsj"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="请输入开始时间"
                          end-placeholder="请输入结束时间"
                          value-format="yyyyMMddHHmmss"
                          align="right">
                        </hd-date-picker>
                      </el-form-item>
                    </el-row>
                  </hd-expand-body>
                </hd-expand>
              </hd-component>
            </el-form>
            <div class="hdty-btn-group">
              <el-button
                type="info"
                v-preventReClick
                icon="el-icon-search"
                @click="handleQuery">
                查询
              </el-button>
              <el-button
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
              v-loading="loading"
              :data="tableData"
              @sort-change="handleSortChange"
              border
              fit
              height="100%">
              <el-table-column
                fixed
                label="操作"
                align="center"
                width="100">
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
                prop="vo.sqjcwhmc"
                :label="title + '名称'"
                sortable="custom"
                header-align="center"
                min-width="240">
              </el-table-column>
              <el-table-column
                prop="vo.sqjcwhdm"
                :label="title + '代码'"
                sortable="custom"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vox.dzyslxdm"
                :label="title + '类型'"
                sortable="custom"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vox.sjxzqyDzbm"
                label="乡镇(街道)"
                sortable="custom"
                header-align="center"
                width="240">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="vox.ssxqbm"
                label="行政区域"
                sortable="custom"
                header-align="center"
                width="180">
              </el-table-column>
              <el-table-column
                prop="vo.djsj"
                label="登记时间"
                sortable="custom"
                header-align="center"
                width="180">
                <template slot-scope="scope">
                  <span v-html="formatDatetime(scope.row.vo.djsj)"></span>
                </template>
              </el-table-column>
              <el-table-column
                prop="vo.gxsj"
                label="更新时间"
                sortable="custom"
                header-align="center"
                width="180">
                <template slot-scope="scope">
                  <span v-html="formatDatetime(scope.row.vo.gxsj)"></span>
                </template>
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
  import {hdComponent, hdForm, hdList, hdMethod} from "@/utils/util-framework";
  import {getPageSelect} from './api';

  export default {
    name: "index",
    provide() {
      return {
        Index: this
      };
    },
    mixins: [hdComponent, hdList, hdForm, hdMethod],
    props: {
      prop: String,
      // 绑定值
      value: {
        type: [Number, String, Array],
        default: ''
      },
      // 绑定值文本
      modelText: {
        type: [Number, String, Array],
        default: ''
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择居(村)委会'
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
        default: false
      },
      // 会话标题
      title: {
        type: String,
        default: '居(村)委会'
      }
    },
    data() {
      return {
        // 显示Dialog
        visible: false,
        // 绑定值
        input: this.modelText, // input接收父组件传来的modelText值
        // 查询
        queryData: {
          sqjcwhmc: '',
          sqjcwhdm: '',
          dzyslxdm: [],
          ssxqbm: '',
          djsj: [],
          zxbs: '0',
        },
        // 查询条件
        factorData: {
          sqjcwhmcFilterFactor: this.$app.factorOptions.matchOpe.between,
          sqjcwhdmFilterFactor: this.$app.factorOptions.matchOpe.between,
        },
        // 验证
        rules: {},
        // 表格数据
        tableData: [],
      }
    },
    watch: {
      value: {
        handler(val) {
          if (!val || val.length < 1) {
            this.input = '';
          }
        },
        immediate: true
      },
      modelText: {
        handler(val) {
          this.input = val;
        },
        immediate: true
      },
      visible: {
        handler(val) {
          if (!val) {
            this.pageOptions.current = 1;
          }
        },
        immediate: true
      },
    },
    methods: {
      // input获得焦点
      handleInputFocus() {
        let _this = this;
        _this.visible = true;
        _this.$emit('currentOpening', _this);
        _this.loadList();
      },
      // 获取数据列表
      loadList() {
        let _this = this;
        _this.loading = true;
        // 参数
        let dataParams = {
          ..._this.queryData,
          ..._this.factorData,
          ..._this.pageOptions
        };
        getPageSelect(dataParams).then(response => {
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
      // input清空
      handleInputClear() {
        this.$emit('input', '');
        this.$emit('update:modelText', '');
        this.$emit('currentChanged', []);
        this.triggerValidateField();
      },
      // 单选
      handleChecked(index, row) {
        this.visible = false;
        this.input = row.vo.sqjcwhmc;
        this.$emit('input', row.vo.dzbm); //触发 input 事件，并传入新值
        this.$emit('update:modelText', row.vo.sqjcwhmc);
        this.$emit('currentChanged', row);
        this.triggerValidateField();
      },
      // 取消
      cancelForm() {
        this.visible = false;
      },
    }
  }
</script>

<style scoped>

</style>
