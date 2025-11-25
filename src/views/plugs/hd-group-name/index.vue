<template>
  <div
    class="hdty-dialog-select"
    :underline="underline">
    <el-input
      ref="inputRef"
      v-model="input"
      suffix-icon="el-icon-more"
      :size="size"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      @mouseenter.native="showClear = !visible && $refs.inputRef.showClear"
      @mouseleave.native="showClear = !visible && $refs.inputRef.showClear"
      @focus="handleInputFocus"
      @clear="handleInputClear">
    </el-input>
    <el-dialog
      :title="title || placeholder"
      :visible.sync="visible"
      custom-class="new-form"
      :custom-class="activeDialogCustomClass"
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
              <hd-component
                :model="factorData"
                ref="componentRef">
                <hd-expand>
                  <hd-expand-header>
                    <el-form-item label="群体名称" prop="name">
                      <hd-factor-input
                        prop="nameFilterFactor"
                        v-model="queryData.name"
                        :model-control.sync="factorData.nameFilterFactor"
                        fuzzy="between"
                        placeholder="请输入群体名称">
                      </hd-factor-input>
                    </el-form-item>
                  </hd-expand-header>
                  <hd-expand-body>
                    <el-row>
                      <el-form-item label="是否注销" prop="zsbz">
                        <hd-dict-radio
                          v-model="queryData.zsbz"
                          :dict-code="$global.dictType.isOrNot"
                          show-all-button>
                        </hd-dict-radio>
                      </el-form-item>
                    </el-row>
                    <el-row>
                      <el-form-item label="添加时间" prop="createTime">
                        <el-date-picker
                          v-model="queryData.createTime"
                          type="datetimerange"
                          :picker-options="pickerOptions"
                          range-separator="至"
                          start-placeholder="请输入开始时间"
                          end-placeholder="请输入结束时间"
                          value-format="yyyyMMddHHmmss"
                          align="right">
                        </el-date-picker>
                      </el-form-item>
                    </el-row>
                  </hd-expand-body>
                </hd-expand>
              </hd-component>
            </el-form>
            <div class="hdty-btn-container">
              <el-button
                type="info"
                icon="el-icon-search"
                @click="handleQuery">
                查询
              </el-button>
              <el-button
                icon="el-icon-delete"
                @click="handleClear">
                清空
              </el-button>
              <el-button
                v-if="manageIsAdd"
                type="success"
                icon="el-icon-circle-plus-outline"
                @click="handleAdd">
                新增
              </el-button>
            </div>
          </div>
          <div class="hdty-fit">
            <el-table
              ref="tableRef"
              class="new-table"
              :row-key="$utilStr.uuid()"
              v-loading="triggerLoading"
              :data="tableData"
              @sort-change="handleSortChange"
              @select="handleSelect"
              @select-all="handleSelectAll"
              border
              fit
              height="100%">
              <el-table-column
                key="hd_table_select_multiple"
                v-if="multiple"
                fixed
                type="selection"
                reserve-selection
                align="center"
                width="50">
              </el-table-column>
              <el-table-column
                key="hd_table_select_single"
                v-else
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
                v-if="manageIsEdit || manageIsDelete"
                fixed
                label="管理"
                align="center"
                width="160">
                <template slot-scope="scope">
                  <el-button
                    v-if="manageIsEdit"
                    :disabled="scope.row.vo.zsbz === $global.dictItem.isOrNot.is"
                    type="primary"
                    @click="handleEdit(scope.$index, scope.row)">
                    编辑
                  </el-button>
                  <el-button
                    v-if="manageIsDelete"
                    :disabled="scope.row.vo.zsbz === $global.dictItem.isOrNot.is"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)">
                    注销
                  </el-button>
                </template>
              </el-table-column>
              <el-table-column
                fixed
                prop="vo.name"
                label="群体名称"
                sortable="custom"
                header-align="center"
                min-width="180">
              </el-table-column>
              <el-table-column
                prop="vox.zsbz"
                label="是否注销"
                header-align="center"
                width="100">
                <template slot-scope="scope">
                  <p class="text-color-1" v-show="scope.row.vo.zsbz === $global.dictItem.isOrNot.is">
                    {{scope.row.vox.zsbz}}
                  </p>
                  <p class="text-color-5" v-show="scope.row.vo.zsbz === $global.dictItem.isOrNot.not">
                    {{scope.row.vox.zsbz}}
                  </p>
                </template>
              </el-table-column>
              <el-table-column
                prop="vox.createUserId"
                label="添加人"
                header-align="center"
                width="120">
              </el-table-column>
              <el-table-column
                prop="vo.createTime"
                label="添加时间"
                header-align="center"
                min-width="180">
                <template slot-scope="scope">
                  <span v-html="formatTime(scope.row, scope.column, scope.row.vo.createTime)"></span>
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
        <group-name-add ref="addRef"></group-name-add>
        <group-name-edit ref="editRef"></group-name-edit>
      </hd-pane>
      <span slot="footer" class="hdty-dialog-footer">
        <cite class="hdty-float-left">当前选择：<el-tag v-if="activeTag" type="success" :closable="clearable" @close="handleTagClose">{{ activeTag }}</el-tag></cite>
        <el-button @click="cancelForm">取 消</el-button>
        <el-button v-if="multiple" type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {hdComponent, hdList, hdMethod} from "@/utils/util-framework";
  import {page, singleDelete} from './api';
  import GroupNameAdd from './GroupNameAdd';
  import GroupNameEdit from './GroupNameEdit';

  export default {
    name: "index",
    provide() {
      return {
        hdGroupName: this
      };
    },
    mixins: [hdComponent, hdList, hdMethod],
    components: {
      GroupNameAdd,
      GroupNameEdit,
    },
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
      // 大小（medium / small / mini）
      size: {
        type: String,
        default: ''
      },
      // 会话标题
      title: {
        type: String,
        default: '选择群体名称'
      },
      // 会话层大小（large/ medium / small / mini / fit）
      dialogSize: {
        type: String,
        default: 'medium'
      },
      // 水印
      placeholder: {
        type: String,
        default: '请选择群体名称'
      },
      // 多选
      multiple: {
        type: Boolean,
        default: false
      },
      // 多选限制（0代表不限制）
      limit: {
        type: Number,
        default: 0
      },
      // 多选值
      currentSelection: {
        type: Array,
        default() {
          return [];
        }
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
      // 宽度随内容适应
      adaptation: {
        type: Boolean,
        default: false
      },
      // 显示边框
      underline: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        // 绑定值的字段名
        valueField: 'vo.id',
        // 绑定值文本的字段名
        labelField: 'vo.name',
        // 选中值的字段名
        selectionField: 'ids',
        // 绑定值
        input: this.modelText, // input接收父组件传来的modelText值
        // 绑定值
        currentValue: this.value,
        //采集人ID
        createUserId: '',
        // 查询
        queryData: {
          name: '',
          zsbz: this.$global.dictItem.isOrNot.not,
          createTime: [],
        },
        // 默认查询机构名称
        sjgsdwdmName: '',
        // 查询扩展
        factorData: {
          nameFilterFactor: this.$app.factorOptions.matchOpe.between,
        },
        // 验证
        rules: {},
        // 表格数据
        tableData: [],
        // 多选数据
        multipleData: this.currentSelection, // multipleData接收父组件传来的currentSelection值
        // 启用构造数据
        constDataEnabled: true,
        // 构造数据
        constData: [],
        // 显示清除按钮
        showClear: '',
        // 显示Dialog
        visible: false,
        // 是否可管理
        manageIsAdd: false,
        manageIsEdit: false,
        manageIsDelete: false,
      }
    },
    computed: {
      activeDialogCustomClass() {
        if (this.dialogSize === 'large') {
          return 'hdty-dialog-large';
        } else if (this.dialogSize === 'medium') {
          return 'hdty-dialog-medium';
        } else if (this.dialogSize === 'small') {
          return 'hdty-dialog-small';
        } else if (this.dialogSize === 'mini') {
          return 'hdty-dialog-mini';
        } else if (this.dialogSize === 'fit') {
          return 'hdty-dialog-fit';
        } else {
          return this.dialogSize;
        }
      },
      activeSuffixIcon() {
        return this.$refs.inputRef.$el.querySelector('.el-input__suffix-inner').querySelectorAll('.el-input__icon');
      },
      activeTag() {
        if (this.multiple) {
          return this.$utilStr.splitArray(this.$utilStr.objArrayToArray(this.multipleData, this.labelField));
        } else {
          return this.input;
        }
      },
      activeConstDataEnabled() {
        return this.multiple
          && this.currentValue.length > 0
          && this.currentSelection.length < 1
          && this.constDataEnabled;
      }
    },
    watch: {
      value: {
        handler(val) {
          this.doAdaptation();
          if (this.$utilStr.isEmpty(val)) {
            this.input = '';
          }
          if (this.multiple) {
            if (!Array.isArray(val)) {
              if (val) {
                val = [val];
              } else {
                val = [];
              }
            }
            this.currentValue = val;
            if (this.$utilStr.isEmpty(val)) {
              this.constData = [];
              this.triggerClearSelection();
            }
            if (this.activeConstDataEnabled) {
              this.constData = [];
              for (let i = 0; i < val.length; i++) {
                let initialValue = this.$utilStr.generateDeepObj(this.valueField, val[i]);
                this.constData.push(initialValue);
              }
            }
            this.multipleData = this.constData;
          } else {
            this.currentValue = val;
          }
          this.pageOptions.current = 1;
        },
        immediate: true
      },
      modelText: {
        handler(val) {
          if (this.$utilStr.isEmpty(val) && !this.$utilStr.isEmpty(this.currentValue)) {
            val = this.currentValue;
          }
          if (this.multiple) {
            if (!Array.isArray(val)) {
              if (val) {
                val = [val];
              } else {
                val = [];
              }
            }
            this.input = this.$utilStr.splitArray(val);
            if (this.activeConstDataEnabled) {
              for (let i = 0; i < val.length; i++) {
                let initialValue = this.$utilStr.generateDeepObj(this.valueField, this.currentValue[i]);
                let initialLabel = this.$utilStr.generateDeepObj(this.labelField, val[i]);
                this.constData[i] = this.$utilStr.deepObjMerge(initialValue, initialLabel);
              }
              this.multipleData = this.constData;
            }
          } else {
            this.input = val;
          }
        },
        immediate: true
      },
      multiple: {
        handler() {
          this.handleInputClear();
        },
        immediate: false
      },
      currentSelection: {
        handler(val) {
          this.multipleData = val;
        },
        immediate: false
      },
      showClear: {
        handler(val) {
          if (val) {
            [].forEach.call(this.activeSuffixIcon, e => {
              if (!e.className.includes('el-input__clear')) {
                e.style.display = 'none';
              }
            });
          } else {
            [].forEach.call(this.activeSuffixIcon, e => {
              e.style.display = '';
            });
          }
        },
        immediate: false
      },
    },
    mounted() {
      this.manageIsAdd = this.$utilPublic.getUserAuthority('add', 'GroupNameList') && JSON.stringify(this.$utilPublic.getUserAuthority('add', 'GroupNameList')) !== '{}';
      this.manageIsEdit = this.$utilPublic.getUserAuthority('edit', 'GroupNameList') && JSON.stringify(this.$utilPublic.getUserAuthority('edit', 'GroupNameList')) !== '{}';
      this.manageIsDelete = this.$utilPublic.getUserAuthority('delete', 'GroupNameList') && JSON.stringify(this.$utilPublic.getUserAuthority('delete', 'GroupNameList')) !== '{}';
    },
    methods: {
      // 更新搜索数据
      updateSearchData() {
        let _this = this;
        let selection = [];
        if (Array.isArray(_this.currentValue)) {
          selection = _this.currentValue;
        } else {
          selection.push(_this.currentValue);
        }
        _this.queryData[_this.selectionField] = selection;
      },
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
        _this.triggerLoading = true;
        _this.updateSearchData();
        // 参数
        let dataParams = {
          ..._this.factorData,
          ..._this.queryData,
          ..._this.pageOptions,
        };
        page(dataParams).then(response => {
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
          if (_this.multiple) {
            _this.toggleSelection();
          }
          _this.$refs.tableRef.doLayout();
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
        this.$refs.componentRef.resetFields();
      },
      // input清空
      handleInputClear() {
        if (this.multiple) {
          this.$emit('input', []);
          this.$emit('update:modelText', []);
          this.$emit('currentChanged', []);
        } else {
          this.$emit('input', '');
          this.$emit('update:modelText', '');
          this.$emit('currentChanged', '');
        }
        this.triggerValidateField();
      },
      // tag关闭
      handleTagClose() {
        if (this.multiple) {
          this.multipleData = [];
          this.triggerClearSelection();
        } else {
          this.$emit('input', '');
          this.$emit('update:modelText', '');
          this.$emit('currentChanged', '');
          this.triggerValidateField();
        }
      },
      // 单选
      handleChecked(index, row) {
        this.visible = false;
        this.input = this.$utilStr.getValueOfDeepObj(row, this.labelField);
        this.$emit('input', this.$utilStr.getValueOfDeepObj(row, this.valueField)); //触发 input 事件，并传入新值
        this.$emit('update:modelText', this.$utilStr.getValueOfDeepObj(row, this.labelField));
        this.$emit('currentChanged', row);
        this.triggerValidateField();
      },
      // selection回显
      toggleSelection() {
        let _this = this;
        if (_this.$refs.tableRef) {
          let selections = [];
          _this.multipleData.forEach(item => {
            let currentSelections = _this.tableData.find(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) === this.$utilStr.getValueOfDeepObj(item, this.valueField));
            if (currentSelections) {
              selections.push(currentSelections);
            }
          });
          let surplusSelections = _this.multipleData;
          _this.tableData.forEach(item => {
            surplusSelections = surplusSelections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) !== this.$utilStr.getValueOfDeepObj(item, this.valueField));
          });
          if (!surplusSelections || surplusSelections.length < 1) {
            _this.$refs.tableRef.clearSelection();
          }
          if (_this.tableData) {
            _this.tableData.forEach(row => {
              _this.$refs.tableRef.toggleRowSelection(row, false);
            });
          }
          if (selections) {
            selections.forEach(row => {
              _this.$refs.tableRef.toggleRowSelection(row, true);
            });
          }
        }
      },
      // selection多选
      handleSelect(val) {
        let _this = this;
        if (_this.triggerSelectionValidate(val)) {
          let selections = _this.multipleData;
          _this.tableData.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) !== this.$utilStr.getValueOfDeepObj(item, this.valueField));
          });
          val.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) !== this.$utilStr.getValueOfDeepObj(item, this.valueField));
          });
          _this.multipleData = val.concat(selections);
        }
      },
      // selection全选
      handleSelectAll(val) {
        let _this = this;
        if (_this.triggerSelectionValidate(val)) {
          let selections = _this.multipleData;
          _this.tableData.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) !== this.$utilStr.getValueOfDeepObj(item, this.valueField));
          });
          val.forEach(item => {
            selections = selections.filter(e => this.$utilStr.getValueOfDeepObj(e, this.valueField) !== this.$utilStr.getValueOfDeepObj(item, this.valueField));
          });
          _this.multipleData = val.concat(selections);
        }
      },
      // selection清空
      triggerClearSelection() {
        this.$nextTick(() => {
          if (this.$refs.tableRef) {
            this.$refs.tableRef.clearSelection();
          }
        });
      },
      // selection验证
      triggerSelectionValidate(val) {
        let _this = this;
        if (_this.limit > 0) {
          if (val.length > _this.limit) {
            _this.$message({
              showClose: true,
              customClass: 'is-fixed',
              message: '超出多选限制，最多选择[' + _this.limit + ']项数据',
              type: 'error'
            });
            val.slice(_this.limit).forEach(row => {
              _this.$refs.tableRef.toggleRowSelection(row, false);
            });
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      },
      // 提交
      submitForm() {
        this.visible = false;
        this.input = this.$utilStr.splitArray(this.$utilStr.objArrayToArray(this.multipleData, this.labelField));
        this.$emit('input', this.$utilStr.objArrayToArray(this.multipleData, this.valueField)); //触发 input 事件，并传入新值
        this.$emit('update:modelText', this.$utilStr.objArrayToArray(this.multipleData, this.labelField));
        this.$emit('currentChanged', this.multipleData);
        this.triggerValidateField();
        if (this.constDataEnabled) {
          this.constDataEnabled = false;
        }
        if (this.currentSelection < 1) {
          this.constData = this.multipleData;
        }
      },
      // 取消
      cancelForm() {
        this.visible = false;
        if (this.multiple) {
          this.resetForm();
        }
      },
      // 重置
      resetForm() {
        if (this.currentSelection.length > 0) {
          this.multipleData = this.currentSelection;
        } else {
          this.multipleData = this.constData;
        }
        this.toggleSelection();
        this.pageOptions.current = 1;
      },
      // 对宽度重新适应
      doAdaptation() {
        if (this.adaptation) {
          this.$nextTick(() => {
            let inputRef = this.$refs.inputRef;
            if (inputRef) {
              let text;
              if (inputRef.value) {
                text = inputRef.value;
              } else if (this.placeholder) {
                text = this.placeholder;
              }
              let inputBoxEl = inputRef.$el;
              let inputEl = inputBoxEl.querySelector('.el-input__inner');
              let inputStyles = this.$utilElem.getStyle(inputEl);
              let borderSize = parseFloat(inputStyles.borderLeftWidth) + parseFloat(inputStyles.borderRightWidth);
              let paddingSize = parseFloat(inputStyles.paddingLeft) + parseFloat(inputStyles.paddingRight);
              inputBoxEl.style.width = Math.ceil(this.$utilElem.getTextScreenWidth(text, inputStyles.fontSize) + borderSize + paddingSize) + 'px';
            }
          });
        }
      },
      // 添加
      handleAdd() {
        this.$refs.addRef.visible = true;
        this.$refs.addRef.beforeLoadForm();
      },
      // 编辑
      handleEdit(index, row) {
        this.$refs.editRef.visible = true;
        this.$refs.editRef.row = row;
        this.$refs.editRef.beforeLoadForm();
      },
      // 注销
      handleDelete(index, row) {
        let _this = this;
        _this.$confirm('确定要注销吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 参数
          let dataParams = {
            id: row.vo.id
          };
          // Lambda写法
          singleDelete(dataParams).then(response => {
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
          }).catch(error => {
            // 响应错误回调
            console.log(error);
          });
        });
      },
    }
  }
</script>

<style scoped>

</style>
